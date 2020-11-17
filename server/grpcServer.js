let grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

let PROTO_PATH = "./server_proto.proto";



let packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
let streamProto = grpc.loadPackageDefinition(packageDefinition);

//create grpc server
let grpcServer = new grpc.Server();

grpcServer.addService(streamProto.Streamer.service, {
    streamVideoChunks: streamVideoChunks
})

function streamVideoChunks(call, callback){
    call.on('data', function(chunks){
      console.log("data event")
        console.log(chunks);
    })
    call.on('end', function(){
      console.log("end event");
        callback(null, {
            message:"done"
        })
    })
}

grpcServer.bindAsync('0.0.0.0:1000', grpc.ServerCredentials.createInsecure(), (err, port)=>{
  console.log(err, port);
  grpcServer.start();
});

//grpcServer.start();