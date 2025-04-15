import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { device } from './dto/device.dto';
import { SocketGatewayService } from './socket-gateway.service';

@WebSocketGateway({ cors: true })
export class SocketGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketGatewayService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  //
  @SubscribeMessage('programar-automatizacion')
  handleProgramacion(@MessageBody() data: any): void {
    console.log('Automatizacion recibida:', data);

    //Remitimos al servidor local
    this.server.emit('ejecutar-automatizacion', data);
  }

  //Escuchar evento dispositivo conectado
  @SubscribeMessage('device_connected')
  async handleDevices(@MessageBody() data: device): Promise<void> {
    console.log('dispositivo conectado recibido:', data);

    //Guardar el dispositivo en la base de datos usando el servicio
    try {
      await this.socketService.saveDevice(data);
      //Remitimos al servidor local
      this.server.emit('device_connected_notification', data.udid);
    } catch (error) {
      console.error('Error al guardar el dispositivo', error);
    }
  }

  //Escucha mensajes desde el cliente
  @SubscribeMessage('mensaje')
  handleMessage(@MessageBody() data: string): void {
    console.log(`Mensaje recibido:`, data);

    // Envia respuesta a todos los clientes
    this.server.emit('respuesta', { mensaje: 'Recibido en el backend', data });
  }
}
