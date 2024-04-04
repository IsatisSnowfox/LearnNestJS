import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/* https://documenter.getpostman.com/view/6319646/SVSLr9AM#6e47859b-5ab5-47b0-8095-5a3ec3dba54c */
@Injectable({ scope: Scope.REQUEST })
export class RecordingService {
    appId: string;
    azureStorageName;
    azureStorageAccessKey;
    azureStorageContainerName;

    constructor(config: ConfigService) {
        this.appId = config.get<string>('agora.appId');
        this.azureStorageName = config.get<string>('AzureStorageAccount.storageName');
        this.azureStorageAccessKey = config.get<string>('AzureStorageAccount.accessKey');
        this.azureStorageContainerName = config.get<string>('AzureStorageAccount.containerName');
    }

    async acquire(channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/acquire`;
        const response = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
        });
        return response.data;
    }

    async start(resourceId: string, mode: string, channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/mode/${mode}/start`;
        let reponse = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
            "recordingConfig": {
                "streamMode": "standard",
                "transcodingConfig": {
                    "width": 1920,
                    "height": 1080,
                    "bitrate": 2000,
                    "mixedVideoLayout": 1
                }
            },
            "recordingFileConfig": {
                "avFileType": ["hls", "mp4"]
            },
            "storageConfig": {
                "vendor": 5, // Microsoft Azure,
                "accessKey": this.azureStorageName,
                "secretKey": this.azureStorageAccessKey,
                "bucket": this.azureStorageContainerName,
                "fileNamePrefix": [channelName]
            }
        });

        return reponse.data;
    }

    async stop(resourceId: string, sid: string, mode: string, channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/stop`;
        let reponse = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
            "clientRequest": {
                "async_stop": true // Détermine si la requête doit être asynchrone ou non
            }
        });

        return reponse.data;
    }

    async query(resourceId: string, sid: string, mode: string): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/query`;
        const response = await axios.get(url);
        return response.data;
    }
}
