/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { device } from '../devices/dto/device.dto';
import { DevicesService } from 'src/devices/devices.service';

@WebSocketGateway({ cors: true })
export class SocketGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly devicesService: DevicesService) {}

  //Evento para usuarios conectados
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  //Evento para usuarios desconectados
  handleDisconnect(client: Socket) {
    const usuario_id = client.data?.usuario_id;
    if (usuario_id) {
      const room = `usuario_${usuario_id}`;
      console.log(
        `Cliente ${client.id} (Usuario ${usuario_id}) desconectado de la sala ${room}`,
      );
      // // Opcional: Limpiar datos o notificar a otros clientes
      // this.server.to(room).emit('usuario_desconectado', { usuario_id });
    } else {
      console.log(`Cliente ${client.id} desconectado (sin usuario_id)`);
    }
  }

  //Registrar usuario a la sala
  @SubscribeMessage('registrar_usuario')
  async handleRegistrarUsuario(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { usuario_id: number },
  ) {
    if (!data?.usuario_id) {
      client.disconnect();
      console.warn(`Cliente ${client.id} intentó registrarse sin usuario_id`);
    }

    const room = `usuario_${data.usuario_id}`;
    await client.join(room);

    //Guardar el usuario_id en el socket del usuario
    client.data.usuario_id = data.usuario_id;

    console.log(`Socket ${client.id} unido a la sala ${room}`);
  }

  //Escuchar evento para recibir Datos para la automatizacion
  @SubscribeMessage('programar-automatizacion')
  handleProgramacion(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    const usuario_id = client.data.usuario_id;
    const room = `usuario_${usuario_id}`;
    console.log(`Automatización recibida de Usuario ${usuario_id}:`, data);

    //Remitimos al servidor local
    this.server.to(room).emit('ejecutar-automatizacion', data);
  }

  //Escuchar evento dispositivo conectado y guardar
  @SubscribeMessage('device_connected')
  async handleDevices(@MessageBody() data: device): Promise<void> {
    console.log('dispositivo conectado recibido:', data);

    //Guardar el dispositivo en la base de datos usando el servicio
    try {
      await this.devicesService.saveDevice(data);
      //Remitimos al servidor local
      this.server.emit('device_connected_notification', data.udid);
    } catch (error) {
      console.error('Error al guardar el dispositivo', error);
    }
  }
}
