import { TrackCollectionUpdateEvent } from './../track-collection/events/track-collection-update.event';
import { TrackCollectionService } from './../track-collection/track-collection.service';
import { TrackPublicGateway } from './track-public.gateway';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@Injectable()
export class TrackPublicService {
  constructor(
    @Inject(forwardRef(() => TrackPublicGateway))
    private trackPublicGateway: TrackPublicGateway,
    private trackCollection: TrackCollectionService,
  ) {}
  async updateRoom({
    collectionName,
    floor,
    volumes,
    listedCount,
  }: TrackCollectionUpdateEvent) {
    this.trackPublicGateway.emitToRoom(collectionName, {
      floor,
      volumes,
      listedCount,
      collectionName
    });
  }
}
