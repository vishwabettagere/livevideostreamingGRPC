import * as grpc from "@grpc/grpc-js";
import * as protoloader from "@grpc/proto-loader";
import * as CONFIG from "../utils/config";
let PROTO_PATH: string = __dirname + '/streamer.proto';



export class GrpcClient{

    private static instance: GrpcClient;
    public static getInstance(): GrpcClient{
        if (!GrpcClient.instance) {
            GrpcClient.instance = new GrpcClient(CONFIG.GRPC_URL);
          }
          return GrpcClient.instance;
      
    }
    private packageDefinition: any;
    private streamerPackage: any;
    private url: string;
    private client: any;
    private constructor(url: string){
        this.packageDefinition =  protoloader.loadSync(
            PROTO_PATH,
            {keepCase: true,
             longs: String,
             enums: String,
             defaults: true,
             oneofs: true
            });
        this.streamerPackage =  grpc.loadPackageDefinition(this.packageDefinition);
        this.url = url;
        this.client = new this.streamerPackage.Streamer(this.url, grpc.credentials.createInsecure());

    }

    public rpcClient(): any{
        this.client = new this.streamerPackage.Streamer(this.url, grpc.credentials.createInsecure());
        return this.client;
    }

    public streamChunks(payload: any): void{
        let publishPayload  = {
            id:"",
            initSegment:"",
            segment:""
        };
        publishPayload.id = payload.id;
        publishPayload.initSegment = payload.initSegment;
        publishPayload.segment = payload.segment;

        let call: any = this.client.streamVideoChunks(function(err: any, response: any){
            if(err){
                console.log("Error occured",err.details);
            }
            else{
                console.log("received the response ", response);
            }
        })

        call.write(publishPayload);


        
    }



}