import { IsBoolean } from 'class-validator';

export class CompleteConfig {
  @IsBoolean()
  complete_config: boolean;
}
