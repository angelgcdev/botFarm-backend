// device.interface.ts
import { DeviceType, DeviceStatus } from '../enum/device.enum';

export interface Device {
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
