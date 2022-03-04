import { TrackCollectionUpdateEvent } from './../track-collection/events/track-collection-update.event';
import { TrackPublicService } from './track-public.service';
import { TrackPublicGateway } from './track-public.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
export class TrackPublicEvents {
  constructor(
    @Inject(forwardRef(() => TrackPublicService))
    private trackPublicService: TrackPublicService,
  ) {}
  @OnEvent('track-collection:update')
  onCollectionUpdate(event: TrackCollectionUpdateEvent) {
    console.log('update collection');
    this.trackPublicService.updateRoom(event);
  }
}
