import { TrackCollectionService } from './../track-collection/track-collection.service';
import { TrackClientGateway } from './track-client.gateway';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTrackCollectionItemDto } from '../track-collection/dto/create-track-collection.dto';
import { TrackClientDataDto } from './dto/track-client-data.dto';
import { TrackClientTrackType } from './types/track-client-track-type.enum';

@Injectable()
export class TrackClientService {
  constructor(
    @Inject(forwardRef(() => TrackClientGateway))
    private trackClientGateway: TrackClientGateway,
    private trackCollectionService: TrackCollectionService,
  ) {}
  async updateData(data: TrackClientDataDto) {
    if (data.type === TrackClientTrackType.floor) {
      await this.trackCollectionService.addFloor(
        data.collectionName,
        data.data as CreateTrackCollectionItemDto,
      );
    }
    if (data.type === TrackClientTrackType.volumesAndListedCount) {
      await this.trackCollectionService.addVolumesAndListedCount(
        data.collectionName,
        {
          volumes: {
            value: data.data.volumes,
            date: data.data.date,
          },
          listedCount: {
            value: data.data.listedCount,
            date: data.data.date,
          },
        },
      );
    }
  }
}
