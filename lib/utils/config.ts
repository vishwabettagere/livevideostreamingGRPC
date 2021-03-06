import * as dotEnv from  "dotenv";
import * as dateTime from "date-time";


dotEnv.config();
export const DATE_TIME = dateTime();
export let FFMPEG_CONFIGURATIONS ={
  DEBUG:false,
  PATH: process.env.FFMPEG_PATH,
  LOG_LEVEL:"quiet",
  KILL_AFTER_STALL: 10,
  RESPAWN_DELAY: 10,
  RESPAWN_LIMIT:100,// Number.POSITIVE_INFINITY,
  FFMPEG_PARAMS : (url: any, protocol: any, frameRate: number ): any[]=>{

    return  [/*"-loglevel", "quiet",*/
    "-hwaccel",
    "auto",
    "-probesize",
    "8192",
    "-analyzeduration",
    "100000000",
    "-reorder_queue_size", "5",
    "-rtsp_transport", protocol,
    "-i", url,
    "-r", frameRate.toString(),
    "-an", "-c:v", "copy", "-c:a", "copy",
    "-f", "mp4",
    "-movflags",
    /*"+dash+negative_cts_offsets",*/
    "+frag_keyframe+empty_moov+default_base_moof",
    "-metadata", "title='media source extensions'",
    "pipe:3"];


  },
  OPTIONS:
  ["ignore", "pipe", "inherit"]

}

export const INPUT_STREAM_FILE_PATH = process.env.INPUT_STREAM_FILE_PATH;
export const INPUT_STREAMS = require(INPUT_STREAM_FILE_PATH);
export const PORT: number = 3000;
export const PRECEDING_VIDEO_RECORD_PATH = process.cwd() + "/video_snippets_preceding/";
export const SUCCEEDING_VIDEO_RECORD_PATH = process.cwd() + "/video_snippets_succeeding/";
export const VIDEO_BUFFER_SIZE = 9;
export const HLS_LIST_SIZE = 3;
export const STREAMING_DEVICES = [];
INPUT_STREAMS.forEach((device)=>{
  STREAMING_DEVICES.push(device);
});
export const GRPC_URL: string = process.env.GRPC_SERVER_URL; //"localhost:10000"


