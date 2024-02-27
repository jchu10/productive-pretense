# productive-pretense/data_raw

This folder contains raw response data for each experiment version that we ran. Note that on Lookit, a single test *session* is considered a single *response*.

For asynchronous Lookit studies, this will likely include some combination of:

- framedata_per_session/[study-name]_[response-uuid]_frames.csv **(Detailed frame data per session)** 
- video_perchild/[response-uuid]/videoStream-[child-hash-id]_[frame-id]_[response-uuid]_[timestamp]_[randomintegers].mp4 **(Session videos, potentially split by frame)**
- study-name_all-children-identifiable.csv **(Participant information data)**
- study-name_all-responses-identifiable.csv **(Response summary data)**
- study-name_demographics_data.csv **(User demographic information data)**
- study-name_preprocess.R **(Preprocessing code which outputs anonymized files to data_anonymized/ )**

As well as corresponding data dictionaries, downloaded from Lookit: 

- study-name_all-children-dict.csv **(Participant information data dictionary)**
- study-name_all-responses-dict.csv **(Response summary data dictionary)**
- study-name_demographics_dict.csv **(User demographic information data dictinoary)**
