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
  ) {}
  handleDisconnect(client: Socket) {
    delete this.clients[client.id];
  }
  @SubscribeMessage('track-subscribe')
  trackSubscribe(client: Socket, items: string[]) {
    this.clients[client.id] = items;
    client.join(items);
    console.log('subscribe', items);
  }
  @SubscribeMessage('track-unsubscribe')
  trackUnSubscribe(client: Socket, items: string[]) {
    this.clients[client.id] = this.clients[client.id].filter(
      (item) => !items.includes(item),
    );
  }
  emitToRoom(collectionName: string, data: any) {
    this.server.in(collectionName).emit('track-collection', data);
  }
}
