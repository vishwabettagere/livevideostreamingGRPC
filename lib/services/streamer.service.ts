import { FfmpegStrem } from "./";
import * as CONFIG from "../utils/config"




//initializing different camera feed streams and sockets under different namespaces

export default class StreamerService{

    
    constructor(){
        let streams = [];
        CONFIG.STREAMING_DEVICES.forEach((device) => {
            streams.push({
                streamObj: new FfmpegStrem(device),
                streamMap: device,
            });
        })
    }
}














