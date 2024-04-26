import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AccessTokenService } from "../accesstoken/accesstoken.service";

/* https://documenter.getpostman.com/view/6319646/SVSLr9AM#6e47859b-5ab5-47b0-8095-5a3ec3dba54c */
@Injectable({ scope: Scope.REQUEST })
export class RecordingService {
    appId: string;
    customerKey: string;
    customerSecret: string;
    azureStorageName;
    azureStorageAccessKey;
    azureStorageContainerName;

    constructor(config: ConfigService, private readonly accessTokenService: AccessTokenService) {
        this.appId = config.get<string>('agora.appId');
        this.customerKey = config.get<string>('agora.customerKey');
        this.customerSecret = config.get<string>('agora.customerSecret');
        this.azureStorageName = config.get<string>('AzureStorageAccount.storageName');
        this.azureStorageAccessKey = config.get<string>('AzureStorageAccount.accessKey');
        this.azureStorageContainerName = config.get<string>('AzureStorageAccount.containerName');
    }

    async acquire(channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/acquire`;
        const response = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
            "clientRequest": {}
        }, {
            "auth": {
                "username": this.customerKey,
                "password": this.customerSecret
            }
        });
        return response.data?.resourceId;
    }

    async start(resourceId: string, mode: string, channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/mode/${mode}/start`
        const accessToken: string = await this.accessTokenService.getRtcAccessToken(channelName, uid);

        let reponse = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
            "clientRequest": {
                "token": accessToken,
                "recordingConfig": {
                    "streamMode": "standard",
                    "transcodingConfig": {
                        "width": 1280,
                        "height": 720,
                        "bitrate": 3000,
                        "mixedVideoLayout": 1,
                        "fps": 15
                    }
                },
                "recordingFileConfig": {
                    "avFileType": [
                        "hls",
                        "mp4"
                    ]
                },
                "storageConfig": {
                    "vendor": 5,
                    "accessKey": this.azureStorageName,
                        "secretKey": this.azureStorageAccessKey,
                        "bucket": this.azureStorageContainerName,
                        "fileNamePrefix": [
                        "8777e21bf16a44803c1e08dc5b1b1fef"
                    ],
                    "region": 0
                }
            }
        }, {
            "auth": {
                "username": this.customerKey,
                "password": this.customerSecret
            }
        })
            .then((response) => {
                console.log(response);
                return response.data;
        })
            .catch(error => {
            console.log('Error:', error.message);
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Headers:', error.response.headers);
                console.log('Data:', error.response.data);
            } else if (error.request) {
                console.log('Request:', error.request);
            } else {
                console.log('Configuration Error or Other Issue');
            }
            return error;
        });
    }

    async stop(resourceId: string, sid: string, mode: string, channelName: string, uid: number): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/stop`;
        let reponse = await axios.post(url, {
            "cname": channelName,
            "uid": uid,
            "clientRequest": {
                "async_stop": true // Détermine si la requête doit être asynchrone ou non
            }
        }, {
            "auth": {
                "username": this.customerKey,
                "password": this.customerSecret
            }
        }).catch(error => {
            console.log('Error:', error.message);
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Headers:', error.response.headers);
                console.log('Data:', error.response.data);
            } else if (error.request) {
                console.log('Request:', error.request);
            } else {
                console.log('Configuration Error or Other Issue');
            }
            return error.response.data;
        });
        return reponse.data;
    }

    async query(resourceId: string, sid: string, mode: string): Promise<any> {
        const url = `https://api.agora.io/v1/apps/${this.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/${mode}/query`;
        try {
            const response = await axios.get(url, {
                "auth": {
                    "username": this.customerKey,
                    "password": this.customerSecret
                }
            });
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
}
