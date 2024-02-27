# This script prepares the Lookit downloads for analysis
# (1) Rename frame videos with hashed childIDs 
# (2) Reorganize videos into one folder per child
# (3) Generate anonymized & cleaned response data csvs ready for analysis

# It expects:
# - a folder containing frame data, one csv per session
# - a folder containing lookit videos, one mp4 per frame
# - a csv "children-identifiable.csv" linking response UUIDs to child/participant hash IDs and demographics

# SETUP ----
rm(list=ls()) # clear workspace
library(tidyverse) # load package
library(lubridate) # for handling times
library(here) # for convenient file paths
here::i_am("data_raw/pilot-2023-11_choose-then-generate/pretense-pilot3_preprocess.R")

# Where to get data from?
path_frame_data <- "data_raw/pilot-2023-11_choose-then-generate/framedata_per_session"
path_videos <- "data_raw/pilot-2023-11_choose-then-generate/7b23abd4-c81c-4e82-8784-65cc6e6e1eaf_videos"
path_response_summary <- "data_raw/pilot-2023-11_choose-then-generate/pretense-pilot3_sessions-identifiable_data.csv"

# Where to write data to?
path_cleaned_data <- "data_anonymized"
path_reorg_videos <- "data_raw/pilot-2023-11_choose-then-generate/video_perchild"

# Read in frame csvs ====
frame_filenames <- list.files(here(path_frame_data), pattern="*.csv", full.names=F)

read_frame_csvs <- function(filename, directory) {
  read_csv(here(directory, filename), show_col_types = FALSE) # quiet display messages
}

## Extract trial metadata
df.frames.all <- lapply(frame_filenames, read_frame_csvs, directory=path_frame_data) %>%
  reduce(., bind_rows) %>%
  separate(frame_id, into=c("frame_num", "frame_id"), sep="-", extra="merge") # split into 2 words, merging extra into second col
  
# Get CHOOSE data - ignore video-recording detail
df.frames_choose <- df.frames.all %>%
  filter(is.na(event_number), str_starts(frame_id, "choose-trial") | str_starts(frame_id, "choose-warmup")) %>% # ignore info about camera event timings
  pivot_wider(names_from='key', values_from='value') %>%
  mutate(condition = "choose",
         trial_label = str_sub(frame_id, start = 8), # "warmup-whichwould", "trial-X"
         trial_num = if_else(
           frame_id=="choose-warmup-whichwould", as.integer(0), # warm up is trial 0
           as.integer(str_split_i(frame_id, "-", -1)) # get number from the word "choose-trial-X"
         ), 
         scene = images.0.id,
         object_left = str_split_i(images.1.id, "_", 1),
         object_right = str_split_i(images.2.id, "_", 1),
         chosen_object = str_split_i(selectedImage, "_", 1),
         chosen_side = str_split_i(selectedImage, "_", 2)) %>% # repeat for object
    # keep and rename useful variables
  select(video_id=videoId, response_uuid, child_hashed_id, 
           frame_num, frame_id, condition, trial_num, scene, chosen_object, chosen_side, 
         object_left, object_right, frameDuration) 

# Get GENERATE data - ignore video-recording detail
df.frames_generate <- df.frames.all %>%
  filter(is.na(event_number), str_starts(frame_id, "generate-")) %>% # ignore info about camera event timings
  pivot_wider(names_from='key', values_from='value') %>%
  mutate(condition = "generate",
         trial_label = str_sub(frame_id, start = 10), # "gameintro", "trial-X"
         trial_num = as.integer(str_split_i(frame_id, "-", -1)), # get number from the word "choose-trial-X"
         scene = images.0.id,
         generate_object = images.1.id) %>% # repeat for object
  # keep and rename useful variables
  select(video_id=videoId, response_uuid, child_hashed_id, 
         frame_num, frame_id, condition, trial_num, scene, generate_object, frameDuration) %>%
  # replace missing values for the warmup trial
  mutate(trial_num = case_match(trial_num, NA ~ 0, .default=trial_num),
         scene = case_match(scene, NA ~ "meadow", .default=scene), 
         generate_object = case_match(generate_object, NA ~ "animals", .default=generate_object))
# add privacy preference to all rows
df.exitsurvey <- df.frames.all %>%
  filter(frame_id=="exit-survey", is.na(event_number)) %>%
  pivot_wider(names_from='key', values_from='value') %>%
  select(response_uuid, useOfMedia, databraryShare)

# Combine response data
df.frames <- bind_rows(df.frames_choose, df.frames_generate) %>%
  left_join(df.exitsurvey, by='response_uuid')

df.trials <- df.frames %>% filter(!is.na(trial_num)) %>%
  arrange(response_uuid,as.integer(frame_num)) %>%
  select(-frame_id) %>%
  relocate(video_id, response_uuid, child_hashed_id, useOfMedia, databraryShare, 
           condition, scene, generate_object, chosen_object:object_right, 
           frameDuration)
  
df.videos <- df.frames %>% filter(!is.na(video_id))


# GET TIMING DATA ----
df.timing <- df.frames.all %>% 
  filter(!is.na(event_number)) %>% # ignore info about stimuli & response
  pivot_wider(names_from='key', values_from='value') %>%
  select(-videoId) %>%
  left_join(unique(df.videos %>% select(response_uuid, video_id, frame_num)),
            relationship = "many-to-many") %>%
  separate(eventType, into=c(NA, 'event_type'), sep=":") %>%
  filter(
    !is.na(video_id), # only frames that contain video
    str_starts(frame_id, "choose-") | str_starts(frame_id, "generate-"), # only keep test trials
    event_type %in% c('startRecording', # begin video recording
                          'startAudio', # audio plays
                      'replayAudio', # if audio is replayed
                          'displayImages', # scene displayed
                          'displayImage', # object displayed
                          'finishAudio', # audio stopped
                      'clickImage', # choose response
                      'trialComplete', # completed, 
                     'stoppingCapture')) %>% # stop video recording
  select(video_id, frame_num, event_number, event_type, timestamp) %>%
  mutate(timestamp_msec = round(1000*as.numeric(ymd_hms(timestamp)))) %>% # convert to UNIX time object
  group_by(video_id, frame_num) %>% # for each unique trial,...
  mutate(video_timestamp_sec = (timestamp_msec - min(timestamp_msec))/1000) %>% 
  # NOW JOIN WITH TRIAL INFORMATION
  left_join(df.trials, by=c("video_id", "frame_num")) %>%
  rename(expected_frame_duration = frameDuration) %>%
  relocate(video_id, response_uuid, child_hashed_id, useOfMedia, databraryShare, 
           condition, scene, generate_object, chosen_object:object_right, 
           frame_num:video_timestamp_sec,expected_frame_duration) %>%
  arrange(response_uuid,as.integer(frame_num))

# CLEAN UP VIDEOS ----
# First we want to create a dataframe containing:
# - video filenames
# - response uuid
# - child hash id
# The format of the video names is 
# videoStream_{study_uuid}_{order-frame_name}_{response_uuid}_{timestamp}_{randomDigits}.mp4
videofiles <- data.frame(filename = list.files(path = here(path_videos), pattern=".mp4")) %>% 
  separate(col=filename, remove=FALSE, sep="_", into=c(NA, NA, "framename", "response_uuid", "timestamp_msec", NA)) %>% 
  separate(framename, into=c("frame_num", "frame_id"), sep="-", extra="merge") %>%
  left_join(df.exitsurvey, by="response_uuid") %>%
  arrange(response_uuid, as.integer(frame_num))

# NOTE: THERE ARE 563 VIDEO FILES
nrow(videofiles)
# BUT RESPONSE DATA CSV ONLY NOTES 536 VIDEOS?
nrow(df.videos)
## DETOUR - CHECK PARENT COMMENTS
df.response_summary <- read_csv(here(path_response_summary), show_col_types = FALSE) %>%
  select(response__uuid:child__additional_information) %>%
  select(-`consent__time...16`) %>%
  rename(consent_time = `consent__time...14`)
# OK - LIKELY BECAUSE OF ADDITIONAL PARTIAL VIDEO WHEN PARTICIPANTS ENDED EARLY

## Move videos ----
# Second step: create child-specific folders
dir.create(here(path_reorg_videos)) # Create the new folder

# Loop through unique subject IDs and put videos in their new homes
for (i in 1:nrow(videofiles)) {
  this_child_videos <- list.files(path = here(path_videos), pattern = videofiles[i,4]) # list all the files for a specific subject
  newSubDir <- dir.create(here(path_reorg_videos, videofiles[i,4])) # Create new subject-specific folder
  file.copy(from = here(path_videos, this_child_videos),
            to = here(path_reorg_videos, videofiles[i,4])) # Copies all the subject-specific files into the new homes
} # end for loop



# write anonymized files ====
write_csv(df.trials %>% select(-frameDuration), 
          here(path_cleaned_data, "pilot-2023-11-choose-generate_trials.csv"))
write_csv(df.timing, here(path_cleaned_data, "pilot-2023-11-choose-generate_trials-with-timing.csv"))
write_csv(df.response_summary, here(path_cleaned_data, "pilot-2023-11-choose-generate_children.csv"))
write_csv(videofiles, here(path_cleaned_data, "pilot-2023-11-choose-generate_videos-all-metadata.csv"))


