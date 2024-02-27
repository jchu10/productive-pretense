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

# set working directory to the correct study
setwd("/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-09_generate")

# Where to get data from?
path_frame_data <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-09_generate/framedata_per_session/"
path_videos <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-09_generate/video_perframe/"
path_response_summary <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-09_generate/Let-s-play-pretend--_all-responses-identifiable.csv"

# Where to write data to?
path_cleaned_data <- "/Users/junyichu/Sites/productive-pretense/data_anonymized/"
path_reorg_videos <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-09_generate/video_perchild/"

# Read in frame csvs ====
frame_filenames <- list.files(path_frame_data, pattern="*.csv", full.names=F)

read_frame_csvs <- function(filename, directory) {
  read_csv(paste0(directory, filename), show_col_types = FALSE) # quiet display messages
}

## Extract trial metadata
df.frames.all <- lapply(frame_filenames, read_frame_csvs, directory=path_frame_data) %>%
  reduce(., bind_rows) %>%
  separate(frame_id, into=c("frame_num", "frame_id"), sep="-", extra="merge") # split into 2 words, merging extra into second col
  
  
# subset - ignore video-recording detail
df.frames <- df.frames.all %>%
  filter(is.na(event_number)) %>% # ignore info about camera event timings
  pivot_wider(names_from='key', values_from='value') %>%
  mutate(trial_num = as.integer(str_sub(images.0.id, 6, -1)), # get number from the word "slideN"
         scene = str_sub(str_split_i(images.0.src, "/", -1), 1, -5), # get last word in img path, without .png
         object = str_sub(str_split_i(images.1.src, "/", -1), 1, -5)) %>% # repeat for object
    # keep and rename useful variables
  select(video_id=videoId, response_uuid, child_hashed_id, 
           useOfMedia, databraryShare,
           frame_num, frame_id, trial_num, scene, object, frameDuration) 
# add privacy preference to all rows
df.exitsurvey <- df.frames %>%
  filter(frame_id=="exit-survey") %>%
  select(response_uuid, useOfMedia, databraryShare)
df.frames <- df.frames %>% 
  select(-useOfMedia, -databraryShare) %>%
  left_join(df.exitsurvey, by='response_uuid')

df.trials <- df.frames %>% filter(!is.na(trial_num)) %>%
  arrange(response_uuid,trial_num) %>%
  select(-frame_id)
df.videos <- df.frames %>% filter(!is.na(video_id))


# GET TRIAL & VIDEO TIMINGS ----
df.timing <- df.frames.all %>% 
  filter(!is.na(event_number)) %>% # ignore info about stimuli & response
  pivot_wider(names_from='key', values_from='value') %>%
  select(-videoId) %>%
  left_join(unique(df.videos %>% select(response_uuid, video_id, frame_num))) %>%
  separate(eventType, into=c(NA, 'event_type'), sep=":") %>%
  filter(
    !is.na(video_id), # only frames that contain video
    frame_id == "alltrials", # test trials only
    event_type %in% c('startRecording', # begin video recording
                          'startAudio', # audio plays
                          'displayImages', # scene displayed
                          'displayImage', # object displayed
                          'finishAudio', # audio stopped
                      'replayAudio',
                     'stoppingCapture')) %>% # stop video recording
  select(video_id, frame_num, event_number, event_type, timestamp) %>%
  mutate(timestamp_msec = round(1000*as.numeric(ymd_hms(timestamp)))) %>% # convert to UNIX time object
  group_by(video_id, frame_num) %>% # for each unique trial,...
  mutate(video_timestamp_sec = (timestamp_msec - min(timestamp_msec))/1000) %>% 
  # NOW JOIN WITH TRIAL INFORMATION
  left_join(df.trials, by=c("video_id", "frame_num")) %>%
  relocate(video_id, response_uuid, child_hashed_id, trial_num:databraryShare, 
           frame_num, event_number:video_timestamp_sec,expected_frame_duration = frameDuration)

# CLEAN UP VIDEOS ----
# First we want to create a dataframe containing:
# - video filenames
# - response uuid
# - child hash id
# The format of the video names is 
# videoStream_{study_uuid}_{order-frame_name}_{response_uuid}_{timestamp}_{randomDigits}.mp4
videofiles <- data.frame(filename = list.files(path = path_videos, pattern=".mp4")) %>% 
  separate(col=filename, remove=FALSE, sep="_", into=c(NA, NA, "framename", "response_uuid", "timestamp_msec", NA)) %>% 
  separate(framename, into=c("frame_num", "frame_id"), sep="-", extra="merge") %>%
  left_join(df.exitsurvey, by="response_uuid") %>%
  arrange(response_uuid, as.integer(frame_num))

# NOTE: THERE ARE 225 VIDEO FILES
# BUT RESPONSE DATA CSV ONLY NOTES 223 VIDEOS?
## DETOUR - CHECK PARENT COMMENTS
df.response_summary <- read_csv(path_response_summary, show_col_types = FALSE) %>%
  select(response__uuid:child__additional_information) %>%
  select(-`consent__time...15`) %>%
  rename(consent_time = `consent__time...13`)
# OK - LIKELY BECAUSE OF ADDITIONAL PARTIAL VIDEO WHEN PARTICIPANTS ENDED EARLY

## Move videos ----
# Second step: create child-specific folders
dir.create(path_reorg_videos) # Create the new folder

# Loop through unique subject IDs and put videos in their new homes
for (i in 1:nrow(videofiles)) {
  this_child_videos <- list.files(path = path_videos, pattern = videofiles[i,4]) # list all the files for a specific subject
  newSubDir <- dir.create(paste0(path_reorg_videos, videofiles[i,4])) # Create new subject-specific folder
  file.copy(from = paste0(path_videos, this_child_videos),
            to = paste0(path_reorg_videos, videofiles[i,4])) # Copies all the subject-specific files into the new homes
} # end for loop



# write anonymized files ====
write_csv(df.trials %>% select(-frameDuration), 
          paste0(path_cleaned_data, "pilot-2023-08-generate_trials.csv"))
write_csv(df.timing, paste0(path_cleaned_data, "pilot-2023-08-generate_trials-with-timing.csv"))
write_csv(df.response_summary, paste0(path_cleaned_data, "pilot-2023-08-generate_children.csv"))
write_csv(videofiles, paste0(path_cleaned_data, "pilot-2023-08-generate_videos-all-metadata.csv"))


