import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RecordingService } from './recording.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('recording')
@Controller('recording')
export class RecordingController {
    constructor(private readonly agoraService: RecordingService) {}

    @Post('acquire/:channelName')
    async acquire(
        @Param('channelName') channelName: string,
        @Query('uid') uid: number
    ): Promise<void> {
        return await this.agoraService.acquire(channelName, uid);
    }

    @Post('start/:channelName')
    async start(
        @Param('channelName') channelName: string,
        @Query('resourceId') resourceId: string,
        @Query('uid') uid: number,
        @Query('mode') mode: string = 'mix'
    ): Promise<void> {
        return await this.agoraService.start(resourceId, mode, channelName, uid);
    }

    @Post('stop/:channelName')
    async stop(
        @Param('channelName') channelName: string,
        @Query('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('uid') uid: number,
        @Query('mode') mode: string = 'mix'
    ): Promise<void> {
        await this.agoraService.stop(resourceId, sid, mode, channelName, uid);
    }

    @Get('query/:resourceId')
    async query(
        @Param('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('mode') mode: string = "mix"
    ): Promise<any> {
        return this.agoraService.query(resourceId, sid, mode);
    }
}