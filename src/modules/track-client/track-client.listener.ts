import { TrackClientGateway } from './track-client.gateway';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TrackClientListener {
  constructor(
    @Inject(forwardRef(() => TrackClientGateway))
    private trackClientGateway: TrackClientGateway,
  ) {}
  @OnEvent('track-public:subscribe')
  onSubscribe() {
    this.trackClientGateway.redistributeTasks();
  }
  @OnEvent('track-public:unsubscribe')
  onUnSubscribe() {
    this.trackClientGateway.redistributeTasks();
  }
}
