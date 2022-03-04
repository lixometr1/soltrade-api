import { TrackCollectionModule } from './../track-collection/track-collection.module';
import { Module } from '@nestjs/common';
import { TrackClientService } from './track-client.service';
import { TrackClientGateway } from './track-client.gateway';
// receiving data from clients
@Module({
  imports: [TrackCollectionModule],
  providers: [TrackClientGateway, TrackClientService],
})
export class TrackClientModule {}
