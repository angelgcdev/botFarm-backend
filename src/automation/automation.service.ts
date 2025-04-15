import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomationService {
  executeAutomation(data: any) {
    console.log('Ejecutando automatización con:', data);

    //Aqui iria la logica para dispara
  }
}
