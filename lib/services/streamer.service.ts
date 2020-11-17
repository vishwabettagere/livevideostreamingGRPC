import { FfmpegUtilStreamer } from "./";
import * as CONFIG from "../utils/config";




//initializing different camera feed streams

export default class StreamerService{

    
    constructor(){
        let streams = [];
        CONFIG.STREAMING_DEVICES.forEach((device) => {
            streams.push({
                streamObj: new FfmpegUtilStreamer(device),
                streamMap: device,
            });
        })
    }
}














