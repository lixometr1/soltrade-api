import { TrackClientFallbackService } from './track-client-fallback.service';
import { TrackClientError } from './dto/track-client-error.dto';
import { TrackClientDistributor } from './track-client.distributor';
import { TrackClientCollectionInfoDto } from './dto/track-client-collection-info.dto';
import { TrackClientTask } from './types/track-client-task';
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
type ITimerInfo = TrackClientTask & { id: string };
console.log(config.wsPort)
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
    @Inject(forwardRef(() => TrackClientDistributor))
    private trackClientDistributor: TrackClientDistributor,
    @Inject(forwardRef(() => TrackClientFallbackService))
    private trackClientFallbackService: TrackClientFallbackService,
  ) {}
  handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    if (token !== config.socketAuthToken) {
      socket.disconnect();
      return;
    }
    this.clients.push(socket);
    this.redistributeTasks();
    // this.startTrack(socket, {
    //   collectionName: 'magicticket',
    //   type: TrackClientTrackType.floor,
    //   time: 1000,
    // });
    // this.startTrack(socket, {
    //   collectionName: 'bohemia_',
    //   type: TrackClientTrackType.floor,
    //   time: 1000,
    // });
  }
  handleDisconnect(socket: Socket) {
    this.clients = this.clients.filter((s) => s !== socket);
    this.removeTimers(socket.id);
    this.redistributeTasks();
  }
  getClients() {
    return this.clients;
  }
  redistributeTasks() {
    this.stopAll();
    const result = this.trackClientDistributor.distribute();
    // console.log(result);
    if (!result) return;
    Object.keys(result).forEach((clientId) => {
      if (clientId === '@fallback') {
        this.trackClientFallbackService.start(result[clientId]);
        return;
      }
      const client = this.clients.find((client) => client.id === clientId);
      result[clientId].forEach((task) => {
        this.startTrack(client, task);
      });
    });
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
  startTrack(socket: Socket, toSend: TrackClientTask) {
    socket.emit('start', toSend, (id: string) => {
      this.addTimer(socket.id, { ...toSend, id });
    });
  }
  stopTrack(socket: Socket, id: string) {
    socket.emit('stop', id, (id: string) => {
      this.removeTimer(socket.id, id);
    });
  }
  stopTrackAll(socket: Socket) {
    socket.emit('stopAll');
    this.removeTimers(socket.id);
  }
  stopAll() {
    this.server.emit('stopAll');
    this.timers = {};
    this.trackClientFallbackService.stop();

  }
  @SubscribeMessage('data')
  onData(client: Socket, data: TrackClientDataDto) {
    this.trackService.updateData(data);
  }

  @SubscribeMessage('error')
  onError(client: Socket, err: TrackClientError) {
    if (err.statusCode === 429) {
      // pause client for 1 minute
    }
    console.log('socket error', client.id, ' ', err);
  }

  @SubscribeMessage('collection-info')
  onCollectionInfo(client: Socket, data: TrackClientCollectionInfoDto[]) {}
}
