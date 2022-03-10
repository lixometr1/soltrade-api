import { TrackClientTask } from './types/track-client-task';
import { TrackClientService } from './track-client.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as magicEden from '@app/magic-eden-api';
import { TrackClientTrackType } from './types/track-client-track-type.enum';
import * as web3 from '@solana/web3.js';
@Injectable()
export class TrackClientFallbackService {
  private collectionNames = [];
  private activeId = 0;
  constructor(
    @Inject(forwardRef(() => TrackClientService))
    private trackClientService: TrackClientService,
  ) {}
  async run() {
    try {
      const stats = await magicEden.getMulticollectionStats(
        this.collectionNames,
      );
      stats.data.forEach((collectionStats) => {
        let floorPrice = collectionStats.floorPrice / web3.LAMPORTS_PER_SOL;
        floorPrice = +floorPrice.toFixed(3);
        if (isNaN(floorPrice)) {
          floorPrice = undefined;
        }
        const listedCount = collectionStats.listedCount;
        let volumes = collectionStats.volumeAll / web3.LAMPORTS_PER_SOL;
        if (!collectionStats.volumeAll) {
          volumes = 0;
        } else {
          volumes = +volumes.toFixed(2);
        }
        const collectionName = collectionStats.symbol;
        const date = new Date();
        this.trackClientService.updateData({
          collectionName,
          data: {
            value: floorPrice,
            date,
          },
          type: TrackClientTrackType.floor,
        });
        this.trackClientService.updateData({
          collectionName,
          data: {
            volumes,
            listedCount,
            date,
          },
          type: TrackClientTrackType.volumesAndListedCount,
        });
      });
    } catch (err) {}
  }
  start(tasks: TrackClientTask[]) {
    const items = tasks.map((task) => task.collectionName);
    this.collectionNames = items;
    if (this.activeId) {
      this.collectionNames = items;
    } else {
      this.startTracking();
    }
  }
  stop() {
    this.activeId = 0;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  startTracking() {
    const id = new Date().getTime();
    this.activeId = id;
    (async () => {
      while (true) {
        if (this.activeId !== id) return;
        await this.run();
        await this.delay(1000);
      }
    })();
  }
}
