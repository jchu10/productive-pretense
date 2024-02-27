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
# set working directory to the correct study
setwd("/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-08_choose")

# Where to get data from?
path_frame_data <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-08_choose/framedata_per_session/"
path_response_summary <- "/Users/junyichu/Sites/productive-pretense/data_raw/pilot2023-08-08_choose/Let-s-play-pretend-choose-pilot_all-responses-identifiable.csv"

# Where to write data to?
path_cleaned_data <- "/Users/junyichu/Sites/productive-pretense/data_anonymized/"

# Read in frame csvs ====
frame_filenames <- list.files(path_frame_data, pattern="*.csv", full.names=F)

read_frame_csvs <- function(filename, directory) {
  read_csv(paste0(directory, filename), show_col_types = FALSE) # quiet display messages
}

## Extract trial metadata
df.frames <- lapply(frame_filenames, read_frame_csvs, directory=path_frame_data) %>%
  reduce(., bind_rows) %>%
  filter(is.na(event_number)) %>% # ignore info about camera event timings
  pivot_wider(names_from='key', values_from='value') %>%
  mutate(trial_num = as.integer(str_split_i(frame_id, "-", 4)), # get 4th element
         scene = images.0.id,
         object_left = images.1.id,
         object_right = images.2.id) %>% # repeat for object
    # keep and rename useful variables
  separate(frame_id, into=c("frame_num", "frame_id"), sep="-", extra="merge") %>% # split into 2 words, merging extra into second col
  separate(selectedImage, into=c("choice_object", "choice_side"), sep="_") %>%
  # select important variables for analysis
  select(response_uuid, child_hashed_id, video_id=videoId,
           feedback, useOfMedia, databraryShare, 
           frame_num, frame_id, frameDuration, trial_num, 
         scene, object_left, object_right, choice_object, choice_side) 

# add privacy preference to all rows
df.exitsurvey <- df.frames %>%
  filter(frame_id=="exit-survey") %>%
  select(response_uuid, feedback, useOfMedia, databraryShare)
df.frames <- df.frames %>% 
  select(-useOfMedia, -databraryShare, -feedback) %>%
  left_join(df.exitsurvey, by='response_uuid')

df.trials <- df.frames %>% filter(!is.na(trial_num)) %>%
  arrange(response_uuid,trial_num)
# NOTICE: SOMETIMES CHILDREN REPEAT THE PROMPT. 
# ONLY THE FINAL ANSWER HAS A TRIAL NUMBER; THE FRAME ID include "REPEATED"

## DETOUR - CHECK PARENT COMMENTS
df.response_summary <- read_csv(path_response_summary, show_col_types = FALSE) %>%
  select(response__uuid:child__additional_information) %>%
  select(-`consent__time...15`) %>%
  rename(consent_time = `consent__time...13`)
# OK - LIKELY BECAUSE OF ADDITIONAL PARTIAL VIDEO WHEN PARTICIPANTS ENDED EARLY


# write anonymized files ====
write_csv(df.trials, paste0(path_cleaned_data, "pilot-2023-08-choose_trials.csv"))
write_csv(df.response_summary, paste0(path_cleaned_data, "pilot-2023-08-choose_children.csv"))
