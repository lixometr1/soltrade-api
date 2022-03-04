import { TrackCollectionModule } from './../track-collection/track-collection.module';
import { TrackPublicEvents } from './track-public.listener';
import { Module } from '@nestjs/common';
import { TrackPublicService } from './track-public.service';
import { TrackPublicGateway } from './track-public.gateway';

@Module({
  imports: [TrackCollectionModule],
  providers: [TrackPublicGateway, TrackPublicService, TrackPublicEvents],
})
export class TrackPublicModule {}
