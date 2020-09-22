This microservice is aimed at pulling a live camera feed from a local camera and pushing it to cloud server

    Currently streams can be pulled using socket connection with socket trigger message and mqtt trigger message.
    app.js is the entry point
    
    
###Sample .env  
```
#server address
SERVER_SOCKET_URL="ZenServerAddress"
#ffmpeg installed path in your local machine, use command '$ which ffmpeg' in terminal to get path, use versions > 4.0
FFMPEG_PATH=/usr/bin/ffmpeg
#api key is specific to microservice
API_KEY = ""
#input  stream  file path local to your machine, specify absolute path
INPUT_STREAM_FILE_PATH=/filePathTo/cameraDetails.json
```

####Sample INPUT_STREAM_FILE 

```
[
    {

    "id": "liveCam1",
    "deviceIp": "10.10.10.3",
    "rtspUrl": "rtsp://localhost:8554/live1",
    "protocol": "udp",
    "socketNamespace": "liveStreaming_Cam1"


    }
    {...}
]

```

#####How To Run
```
npm i
npm run-script dev
```


