import { Module } from '@nestjs/common';
import { TrackClientService } from './track-client.service';
import { TrackClientGateway } from './track-client.gateway';
// receiving data from clients
@Module({
  providers: [TrackClientGateway, TrackClientService],
})
export class TrackClientModule {}
