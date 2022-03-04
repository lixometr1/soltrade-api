import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TrackClientService } from './track-client.service';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(85)
export class TrackClientGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private clients: Socket[] = [];
  constructor(private readonly trackService: TrackClientService) {}
  handleConnection(socket: Socket) {
    this.clients.push(socket);
  }
  handleDisconnect(socket: Socket) {
    this.clients = this.clients.filter((s) => s !== socket);
  }
  @SubscribeMessage('data')
  test(client: Socket, data: any) {
    //
  }
}
