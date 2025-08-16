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
import {
  InteractionStatus,
  scheduled_tiktok_interaction,
} from '@prisma/client';

// 3. Librerías internas absolutas

// 4. Imports relativos
import { DevicesService } from 'src/devices/devices.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Device } from '../devices/interface/device.interface';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryDto } from '../history/dto/create-history.dto';
import { BadRequestException } from '@nestjs/common';
import { DeviceStatus } from '../devices/enum/device.enum';

@WebSocketGateway({ cors: true })
export class SocketGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // Estado en memoria para el progreso por sala y por interacción
  private executionProgress: Record<
    string,
    { total: number; completed: number }
  > = {};

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
      // Opcional: Limpiar datos o notificar a otros clientes
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
    data: scheduled_tiktok_interaction,
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario
    const interactionId = data.id;

    console.log(`Interacción de TikTok recibida del usuario ${user_id}`);
    console.log('Datos del frontend:', data);
    console.log('📹Datos del formulario:', data);

    try {
      //Guardamos el total de dispositivos para esta interaccion en esta sala
      const key = `${room}:${interactionId}`;
      this.executionProgress[key] = {
        total: await this.getActiveDevicesCount(room),
        completed: 0,
      };

      console.log('Datos del executionProgress:', this.executionProgress);

      // Actualizar el estado en la base de datos
      const status = 'EN_PROGRESO';
      const res =
        await this.scheduleService.updateStatusScheduleTiktokInteraction({
          status,
          id: data.id,
        });

      console.log('Estado actualizado con exito:', res);

      //Emitimos progreso inicial
      this.server.to(room).emit('schedule:tiktok:progress', {
        interactionId,
        completedDevices: this.executionProgress[key].completed,
        totalDevices: this.executionProgress[key].total,
      });

      // Emitir al frontend para que vuelva a cargar los datos cuando llega el evento
      this.server.to(room).emit('schedule:tiktok:interaction:update');

      //Evento para el dispositivo movil
      this.server.to(room).emit('schedule:tiktok:execute', data);
    } catch (error) {
      console.error('Error inesperado:', error.message);
    }
  }

  //Escuchar evento para recibir tiempo estimado de la interaccion
  @SubscribeMessage('schedule:tiktok:execution_info')
  async handleScheduleTiktokExecutionInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      estimatedTime: string;
      interactionId: number;
    },
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    try {
      console.log('Tiempo estimado:', data.estimatedTime);

      // Obtener total de dispositivos activos desde Socket.IO
      const totalDevices = await this.getActiveDevicesCount(room);

      console.log('Dispositivos totales:', totalDevices);

      // Emitir al frontend para que vuelva a cargar los datos cuando llega el evento
      this.server.to(room).emit('schedule:tiktok:interaction:update');

      // Enviar info al frontend
      this.server.to(room).emit('schedule:tiktok:execution_info', {
        estimatedTime: data.estimatedTime,
        totalDevices,
        interactionId: data.interactionId,
      });
    } catch (error) {
      console.error('Error inesperado:', error.message);
    }
  }

  // Evento para cancelar todas la ejecuciones
  @SubscribeMessage('cancel:tiktok:interaction')
  async handleScheduleTiktokCancelled(
    @ConnectedSocket() client: Socket,
    @MessageBody() scheduledTiktokInteraction_id: number,
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    try {
      // Actualizar el estado en la base de datos
      const status = 'CANCELADO';
      const res =
        await this.scheduleService.updateStatusScheduleTiktokInteraction({
          status,
          id: scheduledTiktokInteraction_id,
        });

      console.log(res);

      // Emitir al frontend para que vuelva a cargar los datos cuando llega el evento
      this.server.to(room).emit('schedule:tiktok:interaction:update');

      //Emitimos al servidor local
      this.server.to(room).emit('cancel:tiktok:interaction');
    } catch (error) {
      console.error(error.message);
    }
  }

  // Evento para notificaciones al frontend
  @SubscribeMessage('notification:localServer')
  handleNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      type: string;
      message: string;
      scheduledTiktokInteraction_id: number;
      status: InteractionStatus;
    },
  ): void {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario

    try {
      // Emitir al frontend para que vuelva a cargar los datos cuando llega el evento
      this.server.to(room).emit('schedule:tiktok:interaction:update');

      this.server.to(room).emit('interaction:canceled');

      //Remitimos al frontend
      this.server.to(room).emit('notification:frontend', data);
    } catch (error) {
      console.error('Error al enviar la notificación', error);
    }
  }

  //Escuchar el evento "schedule:tiktok:status:update" y actualizar el estado en la base de datos
  @SubscribeMessage('schedule:tiktok:status:update')
  async handleDeviceScheduleTiktokStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      udid: string;
      status: InteractionStatus;
      history: any;
      scheduledTiktokInteraction_id: number;
      error?: any;
    },
  ): Promise<void> {
    const user_id = client.data.user_id; // Acceder al usuario_id
    const room = `usuario_${user_id}`; //Definir la sala del usuario
    const interactionId = data.scheduledTiktokInteraction_id;
    const key = `${room}:${interactionId}`;

    // Obtener el device_id
    const device_id = await this.devicesService.findDeviceIdByUdidAndUserId(
      data.udid,
      Number(user_id),
    );

    const createHistoryData: CreateHistoryDto = {
      ...data.history,
      device_id,
      status: data.status,
    };

    console.log('Informacion del historial', createHistoryData);

    try {
      // Contar progreso
      if (!this.executionProgress[key]) {
        console.log(`No existe tracking de progreso para ${key}`);
        return;
      }

      // Guardar en historial de tiktok
      const resHistory =
        await this.historyService.createTiktokInteractionHistory(
          createHistoryData,
        );

      console.log(resHistory);

      // Realizar el conteo de progreso
      this.executionProgress[key].completed++;
      console.log(
        `Progreso para ${key}: ${this.executionProgress[key].completed}/${this.executionProgress[key].total}`,
      );

      //Emitimos progreso parcial
      this.server.to(room).emit('schedule:tiktok:progress', {
        interactionId,
        completedDevices: this.executionProgress[key].completed,
        totalDevices: this.executionProgress[key].total,
      });

      // Si todos terminaron
      if (
        this.executionProgress[key].completed ===
        this.executionProgress[key].total
      ) {
        console.log(`Todos los dispositivos completaron ${key}`);

        // Actualizar el estado en la base de datos
        const res =
          await this.scheduleService.updateStatusScheduleTiktokInteraction({
            status: 'COMPLETADA',
            id: data.scheduledTiktokInteraction_id,
          });

        console.log(res);

        //Notificacion al frontend
        this.server.to(room).emit('schedule:tiktok:status:notification', data);

        // Emitir al frontend para que vuelva a cargar los datos cuando llega el evento
        this.server.to(room).emit('schedule:tiktok:interaction:update');

        delete this.executionProgress[key];
      }
    } catch (error) {
      console.error('Error al actualizar el estado', error.message);
    }
  }

  //Escuchar evento dispositivo conectado y guardar
  @SubscribeMessage('device:connected')
  async handleDeviceConnected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Device,
  ): Promise<void> {
    const user_id = client.data.user_id;
    const room = `usuario_${user_id}`;

    console.log(`dispositivo conectado recibido de Usuario ${user_id}:`, data);

    try {
      //Guardar el dispositivo en la base de datos usando el servicio
      const res = await this.devicesService.saveDevice(data);
      console.log('Dispositivo nuevo:', res);

      this.server.to(room).emit('device:connected:notification', data.udid);
      this.server.to(room).emit('device:connected:status', {
        udid: data.udid,
        status: data.status,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        // si ya existe Actualizar el estado del dispositivo
        console.log('Dispositivo existente:', error.message);

        const res = await this.devicesService.updateStatusAndConnectionDevice(
          data.udid,
          +user_id,
          data.status,
          new Date(), // connected_at
        );

        console.log(res);

        //Remitimos al servidor local
        this.server.to(room).emit('device:connected:notification', data.udid);
        this.server.to(room).emit('device:connected:status', {
          udid: data.udid,
          status: data.status,
        });
      } else {
        console.error(error.message);
      }
    }
  }

  // Evento dispositivo desconectado y actualizar estado
  @SubscribeMessage('device:disconnected')
  async handleDeviceDisconnected(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      udid: string;
      status: DeviceStatus;
    },
  ): Promise<void> {
    const user_id = client.data.user_id;
    const room = `usuario_${user_id}`;

    console.log(
      `dispositivo desconectado recibido de Usuario ${user_id}:`,
      data.udid,
    );

    //Actualizar el estado del dispositivo en la base de datos usando el servicio
    try {
      const res = await this.devicesService.updateStatusAndConnectionDevice(
        data.udid,
        +user_id,
        data.status,
        undefined, // connected_at
        new Date(), // last_activity
      );

      console.log(res);

      //Remitimos al servidor local
      this.server.to(room).emit('device:disconnected:notification', data.udid);
      this.server.to(room).emit('device:disconnected:status', {
        udid: data.udid,
        status: data.status,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Evento dispositivos actualizar estados
  @SubscribeMessage('devices:resetStatus')
  async handleUpdateDeviceStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() status: DeviceStatus,
  ): Promise<void> {
    const user_id = client.data.user_id;
    const room = `usuario_${user_id}`;

    //Actualizar el estado de los dispositivos en la base de datos usando el servicio
    try {
      const res = await this.devicesService.setAllDevicesToStatus(
        +user_id,
        status,
      );

      console.log('Reset de estado de los dispositivos:', res);

      //Emitimos al frontend
      this.server.to(room).emit('device:refresh');
    } catch (error) {
      console.error(error.message);
    }
  }

  // Funcion para contar dispositivos
  private async getActiveDevicesCount(room: string): Promise<number> {
    const sockets = await this.server.in(room).fetchSockets();
    return sockets.length - 1;
  }
}
