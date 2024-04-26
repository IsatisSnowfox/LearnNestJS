import { Module } from '@nestjs/common';
import { RecordingController } from './recording.controller';
import { RecordingService } from './recording.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AccessTokenService } from "../accesstoken/accesstoken.service";

@Module({
    controllers: [RecordingController],
    providers: [RecordingService, AccessTokenService],
    imports: [HttpModule, ConfigModule]
})
export class RecordingModule {}