import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './categorias/interfaces/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
