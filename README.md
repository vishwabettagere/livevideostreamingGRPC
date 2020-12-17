#Video Streaming Using ffmpeg and gRPC service

##This microservice is aimed at pulling a video stream from IP camera(any compatible device which supports RTSP) and pushing the stream chunks into the GRPC server running in any network(cloud as well)

**Steps to run the project**

```
git clone <project url>
cd <project directory>
npm install
ts-node-dev --respawn --inspect --transpileOnly ./lib/app.ts

```
**Setting up initial configuration**

**The very first config file is .env , Keep this file in the pe=roject root directory**

    ```
    #grpc server url
    GRPC_SERVER_URL=localhost:10000
    #ffmpeg installed path in your local machine, use command '$ which ffmpeg' in terminal to get path, use versions > 4.0
    FFMPEG_PATH=/usr/bin/ffmpeg
    #input  stream  file path local to your machine, specify absolute path
    INPUT_STREAM_FILE_PATH="/home/livevideostreamingGRPC/inputStreams.json"

    ```

**Input rtsp streams for the service is given by inputStreams.json file, we can provide multiple input streams inside the array**

    ```
    [
    {

    "id": "rtspStream_1",
    "rtspUrl": "rtsp://localhost:8554/live",
    "protocol": "udp",
    "frameRate": 30
    }
    ]
    ```

    ##Server side setup

    ```
    cd server
    node grpcServer.js
    ```

    On running the above setup we can see video stream chunks are being pushed to gRPC server with the stream ID in the payload

**Please Note: Client side code and the mechanism to get the video feed on the browser is in progress, will add in the next commits**



