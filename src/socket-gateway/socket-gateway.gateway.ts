/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// 1. Librerías de Node.js

// 2. Librerías de terceros
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InteractionStatus } from '@prisma/client';

// 3. Librerías internas absolutas

// 4. Imports relativos
import { DevicesService } from 'src/devices/devices.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { device } from '../devices/dto/device.dto';
import { ScheduleTiktokDTO } from './dto/schedule-tiktok.dto';
import { HistoryService } from 'src/history/history.service';

@WebSocketGateway({ cors: true })
export class SocketGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private devicesService: DevicesService,
    private scheduleService: ScheduleService,
    private historyService: HistoryService,
  ) {}

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
      console.log(`Cliente ${client.id} desconectado`);
    }
  }

  //Registrar usuario a la sala
  @SubscribeMessage('user:register')
  async handleUserRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { user_id: number },
  ) {
    if (!data?.user_id) {
      client.disconnect();
      console.warn(`Cliente ${client.id} intentó registrarse sin user_id`);
    }

    const room = `usuario_${data.user_id}`;
    await client.join(room);

    //Guardar el usuario_id en el socket del usuario
    client.data.user_id = data.user_id;

    console.log(`Socket ${client.id} unido a la sala ${room}`);
  }

  //Evento para cerrar sesion socket io client
  @SubscribeMessage('cerrarSesion')
  handleCloseSesionClient(@ConnectedSocket() client: Socket): void {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    try {
      //Remitimos al servidor local
      this.server.to(room).emit('cerrarSesion');
    } catch (error) {
      console.error(
        'Error al emitir el evento de cerrar sesión del cliente',
        error,
      );
    }
  }

  //Escuchar evento para recibir Datos para la automatizacion
  @SubscribeMessage('schedule:tiktok:start')
  async handleScheduleTiktokStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      scheduledTiktokData: ScheduleTiktokDTO;
      activeDevices: [device];
    },
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    console.log(`Interacción de TikTok recibida del usuario ${user_id}:`);
    console.log('📹Datos del formulario:', data.scheduledTiktokData);
    console.log('📱Dispositivos activos:', data.activeDevices);

    // Guardar los datos en la base de datos
    try {
      const res =
        await this.scheduleService.saveScheduleTiktokInteractionWithDevices(
          data.scheduledTiktokData,
          data.activeDevices,
        );

      //Agregar los IDs de device_scheduled_tiktok_interaction al payload
      const dataWithIds = {
        ...data.scheduledTiktokData,
        idsRelations: res, // [{device_id, device_scheduled_tiktok_interaction_id, udid}]
      };

      console.log('Datos con los IDs:', dataWithIds);

      //Remitimos al servidor local
      this.server.to(room).emit('schedule:tiktok:execute', dataWithIds);
    } catch (error) {
      console.error('Error al guardar la interacción programada', error);
    }
  }

  //Escuchar el evento "schedule:tiktok:status:update" y actualizar el estado en la base de datos
  @SubscribeMessage('schedule:tiktok:status:update')
  async handleDeviceScheduleTiktokStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { idRelations: any; status: InteractionStatus; history: any },
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    const createHistoryData = {
      ...data.history,
      device_id: data.idRelations.device_id,
    };
    console.log('Datos de la interaccion:', data);

    try {
      // Actualizar el estado en la base de datos
      await this.scheduleService.updateStatusDeviceScheduleTiktok(data);

      // Añadir al historial de tiktok
      await this.historyService.create(createHistoryData);

      this.server.to(room).emit('schedule:tiktok:status:notification', data);
    } catch (error) {
      console.error('Error al actualizar el estado', error);
    }
  }

  //Escuchar evento dispositivo conectado y guardar
  @SubscribeMessage('device:connected')
  async handleDeviceConnected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: device,
  ): Promise<void> {
    const user_id = client.data.user_id;
    const room = `usuario_${user_id}`;

    console.log(`dispositivo conectado recibido de Usuario ${user_id}:`, data);

    //Guardar el dispositivo en la base de datos usando el servicio
    try {
      const res = await this.devicesService.saveDevice(data);
      console.log(res);

      if (res.status === 'exists') {
        await this.devicesService.updateStatusAndConnectionDevice(
          data.udid,
          +user_id,
          'ACTIVO',
          new Date(), // connected_at
        );
      }

      //Remitimos al servidor local
      this.server.to(room).emit('device:connected:notification', data.udid);
      this.server.to(room).emit('device:connected:status', {
        udid: data.udid,
        status: 'ACTIVO',
      });
    } catch (error) {
      console.error('Error al guardar el dispositivo', error);
    }
  }

  // Evento dispositivo desconectado y actualizar estado
  @SubscribeMessage('device:disconnected')
  async handleDeviceDisconnected(
    @ConnectedSocket() client: Socket,
    @MessageBody() udid: string,
  ): Promise<void> {
    const user_id = client.data.user_id;
    const room = `usuario_${user_id}`;

    console.log(
      `dispositivo desconectado recibido de Usuario ${user_id}:`,
      udid,
    );

    //Actualizar el estado del dispositivo en la base de datos usando el servicio
    try {
      await this.devicesService.updateStatusAndConnectionDevice(
        udid,
        +user_id,
        'INACTIVO',
        undefined, // connected_at
        new Date(), // last_activity
      );

      //Remitimos al servidor local
      this.server.to(room).emit('device:disconnected:notification', udid);
      this.server.to(room).emit('device:disconnected:status', {
        udid,
        status: 'INACTIVO',
      });
    } catch (error) {
      console.error('Error al guardar el dispositivo', error);
    }
  }
}
