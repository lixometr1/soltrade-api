import { TrackClientStartDto } from './dto/track-client-start.dto';
import { CreateTrackCollectionItemDto } from './../track-collection/dto/create-track-collection.dto';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TrackClientService } from './track-client.service';
import { Server, Socket } from 'socket.io';
import { TrackClientTrackType } from './types/track-client-track-type.enum';
import { Inject, forwardRef } from '@nestjs/common';
import { TrackClientDataDto } from './dto/track-client-data.dto';
import { config } from 'src/config/config';
type ITimerInfo = TrackClientStartDto & { id: string };
@WebSocketGateway(config.wsPort, { namespace: 'client' })
export class TrackClientGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private clients: Socket[] = [];
  private timers: { [key: string]: ITimerInfo[] } = {};
  constructor(
    @Inject(forwardRef(() => TrackClientService))
    private readonly trackService: TrackClientService,
  ) {}
  handleConnection(socket: Socket) {
    this.clients.push(socket);

    this.startTrack(socket, {
      collectionName: 'magicticket',
      type: TrackClientTrackType.floor,
      time: 1000,
    });
    // this.startTrack(socket, {
    //   collectionName: 'bohemia_',
    //   type: TrackClientTrackType.floor,
    //   time: 1000,
    // });
    // this.startTrack(socket, {
    //   collectionName: 'degods',
    //   type: TrackClientTrackType.floor,
    //   time: 1000,
    // });
    this.startTrack(socket, {
      collectionName: 'magicticket',
      type: TrackClientTrackType.volumesAndListedCount,
      time: 5000,
    });
  }
  handleDisconnect(socket: Socket) {
    this.clients = this.clients.filter((s) => s !== socket);
    this.removeTimers(socket.id);
  }
  addTimer(socketId: string, timerInfo: ITimerInfo) {
    if (!this.timers[socketId]) this.timers[socketId] = [];
    this.timers[socketId].push(timerInfo);
  }
  removeTimer(socketId: string, id: string) {
    if (!this.timers[socketId]) this.timers[socketId] = [];
    this.timers[socketId] = this.timers[socketId].filter(
      (item) => item.id !== id,
    );
  }
  removeTimers(socketId: string) {
    this.timers[socketId] = [];
  }
  startTrack(socket: Socket, toSend: TrackClientStartDto) {
    socket.emit('start', toSend, (id: string) => {
      this.addTimer(socket.id, { ...toSend, id });
    });
  }
  @SubscribeMessage('data')
  onData(client: Socket, data: TrackClientDataDto) {
    console.log('data', data);
    this.trackService.updateData(data);
  }

  @SubscribeMessage('error')
  onError(client: Socket, err: any) {
    console.log('socket error', client.id, ' ', err);
  }
}
