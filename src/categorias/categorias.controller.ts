import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { AppController } from 'src/app.controller';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';

@Controller()
export class CategoriasController {

    constructor(
        private readonly _categoriaService: CategoriasService
    ) {}

    ackErrors = ['E11000'];
    logger = new Logger(AppController.name);

    @EventPattern('criar-categoria')
    async criarCategoria(
        @Payload() categoria: Categoria,
        @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this._categoriaService.criarCategoria(categoria);
            await channel.ack(originalMessage)
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            this.ackErrors.map(async err => {
                if (error.message.includes(err)) {
                    await channel.ack(originalMessage);
                }
            })
        }
    }

    @MessagePattern('consultar-categorias')
    async consultarCategoria(
        @Payload() _id: string,
        @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            if (_id) {
                return await this._categoriaService.consultarCategoriaPorId(_id);
            } else {
                return await this._categoriaService.consultarCategorias();
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('atualizar-categoria')
    async atualizarCategoria(
        @Payload() data: any,
        @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const _id: string = data._id;
            const categoria: Categoria = data.categoria;
            await this._categoriaService.atualizarCategoria(_id, categoria)
            await channel.ack(originalMessage);
        } catch (error) {
            const filterError = this.ackErrors.filter(err => error.message.includes(err));

            if (filterError) {
                await channel.ack(originalMessage);
            }
        }
    }
}
