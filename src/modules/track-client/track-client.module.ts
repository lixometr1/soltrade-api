import { TrackClientMainService } from './track-client-main.service';
import { TrackClientListener } from './track-client.listener';
import { TrackPublicModule } from './../track-public/track-public.module';
import { TrackClientDistributor } from './track-client.distributor';
import { TrackCollectionModule } from './../track-collection/track-collection.module';
import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { TrackClientService } from './track-client.service';
import { TrackClientGateway } from './track-client.gateway';
// receiving data from clients
@Module({
  imports: [TrackCollectionModule, TrackPublicModule],
  providers: [
    TrackClientGateway,
    TrackClientService,
    TrackClientDistributor,
    TrackClientListener,
    TrackClientMainService,
  ],
})
export class TrackClientModule implements OnModuleInit {
  constructor(private trackClientMainService: TrackClientMainService) {}
  onModuleInit() {
    // this.trackClientMainService.run();
  }
}
