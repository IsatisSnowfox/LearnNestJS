import { Controller, Get, Post, Query } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('recording')
@Controller('recording')
export class RecordingController {
    constructor(private readonly agoraService: RecordingService) {}

    @Post('acquire')
    async acquire(
        @Query('channelName') channelName: string,
        @Query('uid') uid: number
    ): Promise<void> {
        return await this.agoraService.acquire(channelName, uid);
    }

    @Post('start')
    async start(
        @Query('resourceId') resourceId: string,
        @Query('mode') mode: string,
        @Query('channelName') channelName: string,
        @Query('uid') uid: number
    ): Promise<void> {
        await this.agoraService.start(resourceId, mode, channelName, uid);
    }

    @Post('stop')
    async stop(
        @Query('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('mode') mode: string,
        @Query('channelName') channelName: string,
        @Query('uid') uid: number
    ): Promise<void> {
        await this.agoraService.stop(resourceId, sid, mode, channelName, uid);
    }

    @Get('query')
    async query(
        @Query('resourceId') resourceId: string,
        @Query('sid') sid: string,
        @Query('mode') mode: string
    ): Promise<any> {
        return this.agoraService.query(resourceId, sid, mode);
    }
}