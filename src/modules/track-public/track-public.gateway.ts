import { EventEmitter2 } from 'eventemitter2';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { config } from 'src/config/config';
import { TrackPublicService } from './track-public.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway(config.wsPort, { namespace: 'public', cors: true })
export class TrackPublicGateway implements OnGatewayDisconnect {
  public clients: { [key: string]: string[] } = {};
  @WebSocketServer()
  private server: Server;
  constructor(
    @Inject(forwardRef(() => TrackPublicService))
    private readonly trackPublicService: TrackPublicService,
    private events: EventEmitter2,
  ) {}
  getClients() {
    return this.clients;
  }
  getTrackingCollections() {
    const items = new Set();
    Object.values(this.clients).forEach((collections) => {
      collections.forEach((collectionName) => items.add(collectionName));
    });
    return [...items] as string[];
  }
  handleDisconnect(client: Socket) {
    const items = this.clients[client.id];
    delete this.clients[client.id];
    this.events.emit('track-public:unsubscribe', items);
  }
  @SubscribeMessage('track-subscribe')
  trackSubscribe(client: Socket, items: string[]) {
    this.clients[client.id] = items || [];
    client.join(items);
    console.log('subscribe', items);
    this.events.emit('track-public:subscribe', items);
  }
  @SubscribeMessage('track-unsubscribe')
  trackUnSubscribe(client: Socket, items: string[]) {
    this.clients[client.id] = this.clients[client.id].filter(
      (item) => !items.includes(item),
    );
    items.forEach((collectionName) => {
      client.leave(collectionName);
    });
    console.log('unsubscribe', items);

    this.events.emit('track-public:unsubscribe', items);
  }
  emitToRoom(collectionName: string, data: any) {
    this.server.in(collectionName).emit('track-collection', data);
  }
}
