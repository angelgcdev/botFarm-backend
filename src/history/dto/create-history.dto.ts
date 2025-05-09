export class CreateHistoryDto {
  device_id: number;
  username?: string;
  total_views: number;
  liked: boolean;
  video_saved: boolean;
  commented?: string;
  finished_at?: Date;
}
