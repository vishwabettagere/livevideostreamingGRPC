import * as CONFIG from "../utils/config";
import { Mp4Frag } from "./";
import { FfmpegRespawn } from "./";
import {GrpcClient} from "../grpc";

export class FfmpegUtilStreamer {

    private mp4frag: any;
    private ffmpeg: any;
    private cameraDetails: any;
    private grpcClient: any;

    constructor(deviceDetails: object, initChild: boolean = true) {
        this.cameraDetails = deviceDetails;
        this.grpcClient = GrpcClient.getInstance();
        if (initChild) {
            if (this.cameraDetails.rtspUrl) {

                console.log("Initializing the ffmpeg util Child process");
                this.mp4frag = new Mp4Frag({ hlsListSize: CONFIG.HLS_LIST_SIZE, hlsBase: 'pool', bufferListSize: CONFIG.VIDEO_BUFFER_SIZE });
                this.execChildProcess();


            }
            else {
                throw new Error("stream/camera parameters are invalid");
            }
        }
        process.on("exit", function(){
            console.log("child process quits, restarting the child again")
        })
    }
    

    public getStreamerInfo(): object {
        return this.cameraDetails;
    }

    public execChildProcess() {
        console.log("FFMPEG setup ready");
        this.ffmpeg = null;
        let ffmpegCommand: string = CONFIG.FFMPEG_CONFIGURATIONS.PATH,
            params: any[] = CONFIG.FFMPEG_CONFIGURATIONS.FFMPEG_PARAMS(this.cameraDetails.rtspUrl, this.cameraDetails.protocol, this.cameraDetails.frameRate),
            options: any[] = CONFIG.FFMPEG_CONFIGURATIONS.OPTIONS;
        if(ffmpegCommand && params.length > 0){
            console.log("FFMPEG params loaded into module");

        }

        this.ffmpeg = new FfmpegRespawn(
            {
                debug: CONFIG.FFMPEG_CONFIGURATIONS.DEBUG,
                path: ffmpegCommand,
                logLevel: CONFIG.FFMPEG_CONFIGURATIONS.LOG_LEVEL,
                killAfterStall: CONFIG.FFMPEG_CONFIGURATIONS.KILL_AFTER_STALL,
                reSpawnDelay:CONFIG.FFMPEG_CONFIGURATIONS.RESPAWN_DELAY,
                reSpawnLimit: CONFIG.FFMPEG_CONFIGURATIONS.RESPAWN_LIMIT,
                params: params,
                pipes: [
                    { stdioIndex: 3, destination: this.mp4frag }
                ],
                exitCallback: (code, signal) => {
                    console.log(' | executing callback on exit', code, signal)
                    if (this.mp4frag) {
                        this.mp4frag.resetCache()
                    }
                }
            })
            .start();

        this.monitorChildProcess();
        this.startListenerForVideoChunk();

       

    }


    private monitorChildProcess() {

        this.ffmpeg.on('stderr', (data) => {
            console.log(' | stderr event captured on ffmpeg excecution ', data.toString());
        })
        this.ffmpeg.once('progress', (obj, str) => {
            console.log(` | progress event captured on stream: ${this.cameraDetails.id} `);
        })
        this.ffmpeg.on('exit', (code, signal) => {
            console.log('| exit event captured on ffmpeg excecution ', code, signal);
        })
        this.ffmpeg.on('kill', () => {
            console.log('| kill event captured on ffmpeg excecution ');
        })
        this.ffmpeg.on('fail', (data) => {
            console.log(' | fail event captured on ffmpeg excecution ', data);
            process.exit();
        
        })
        this.ffmpeg.on('destroy', (data) => {
            console.log(' | destroy event captured on ffmpeg excecution ');
        });

        this.mp4frag.on('error', msg => {
            console.log(`mp4frag error "${msg}" `)
            this.ffmpeg.stop().start()


        })
    }

    public startListenerForVideoChunk(): any {
        const camDetails = this.cameraDetails;
        console.log(` | Started Listener For RTSP URL ==> ${camDetails.rtspUrl}`)
        this.mp4frag.on('initialized', (data) => {
            console.log(" | Initialization fragment is ready: ", data.mime);

        })

        this.mp4frag.on('segment', (data) => {
            if (this.mp4frag.initialization) {
                let payload = {
                    id:this.cameraDetails.id,
                    initSegment: this.mp4frag.initialization,
                    segment: this.mp4frag.segment,
                }
                //console.log(payload.initSegment.length, payload.segment.length)
                this.grpcClient.streamChunks(payload);
            }
        });
    }

}
