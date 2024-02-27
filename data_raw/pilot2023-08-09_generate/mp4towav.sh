#!/bin/bash

shopt -s globstar

src_dir="video_perchild"
dest_dir="wav"

for orig_path in "${src_dir}"/**/*.mp4; do
    #Change first directory in the path
    new_path=${orig_path/$src_dir/$dest_dir}

    #Remove filename from new path. Only directories are left.
    #They are needed for mkdir
    dir_hier=${new_path%/*}

    #Remove extension .flac from path, thus we have original path with first directory
    #changed and file extension removed.
    #Original path:   "Music/one/two/song.flac"
    #New path:        "Music_new/one/two/song"
    new_path=${new_path%.*}

    mkdir -p "$dir_hier"

    #New path with extension:   "Music_new/one/two/song.m4a"
    #ffmpeg should create new file by this path, necessary directories
    #already created by mkdir
    ffmpeg -i "$orig_path" -f wav -ar 16000 -vn "${new_path}.wav"
done