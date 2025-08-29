export enum DeviceType {
  FISICO = 'FISICO',
  EMULADOR = 'EMULADOR',
}

export enum DeviceStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export interface DeviceInfo {
  id: number;
  user_id: number;
  udid: string;
  device_type: DeviceType;
  os_version: string;
  brand: string;
  connected_at: Date;
  last_activity: Date | null;
  complete_config: boolean;
  status: DeviceStatus;
}
