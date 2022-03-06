import { TrackPublicGateway } from './../track-public/track-public.gateway';
import { TrackClientGateway } from './track-client.gateway';
import { TrackClientTrackType } from './types/track-client-track-type.enum';
import { TrackClientTask } from './types/track-client-task';
import { Inject, forwardRef } from '@nestjs/common';

export class TrackClientDistributor {
  constructor(
    @Inject(forwardRef(() => TrackClientGateway))
    private trackClientGateway: TrackClientGateway,
    @Inject(forwardRef(() => TrackPublicGateway))
    private trackPublicGateway: TrackPublicGateway,
  ) {}
  getClients() {
    return this.trackClientGateway.getClients();
  }
  getActiveCollections() {
    return this.trackPublicGateway.getTrackingCollections();
  }
  distribute(): { [key: string]: TrackClientTask[] } {
    /*
            Tasks:
            track floor of active collections every second
            track volumes-count and priceLayers of active collection every 10 seconds
            track all collections every 10 seconds (floor, volumes-count, priceLayers)
         */
    const clients = this.getClients();
    const collections = this.getActiveCollections();
    const clientsCount = clients.length;
    const collectionsCount = collections.length;
    if (!clientsCount) return;
    const result: { [key: string]: TrackClientTask[] } = {};
    const collectionsPerClient = Math.round(collectionsCount / clientsCount);

    // active collections
    clients.forEach((client, idx) => {
      let clientActiveCollections = [];
      if (idx === clientsCount - 1) {
        clientActiveCollections = collections.slice(idx * collectionsPerClient);
      } else {
        clientActiveCollections = collections.slice(
          idx * collectionsPerClient,
          idx * collectionsPerClient + collectionsPerClient,
        );
      }

      const tasks: TrackClientTask[] = clientActiveCollections.reduce(
        (arr, collectionName) => {
          return arr.concat([
            {
              time: 1000,
              type: TrackClientTrackType.floor,
              collectionName,
            },
            // {
            //   time: 5000,
            //   type: TrackClientTrackType.volumesAndListedCount,
            //   collectionName,
            // },
            // {
            //   time: 5000,
            //   type: TrackClientTrackType.priceLayers,
            //   collectionName,
            // },
          ]);
        },
        [],
      );

      result[client.id] = tasks;
    });
    return result;
  }
}
