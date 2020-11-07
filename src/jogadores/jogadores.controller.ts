import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('jogadores')
export class JogadoresController {
    ackErrors = ['E11000', 'Jogador não encontrado'];
    logger = new Logger(JogadoresController.name);

    constructor(
        private readonly _jogadoresService: JogadoresService
    ) { }

    @EventPattern('criar-jogador')
    async criarJogador(
        @Payload() jogador: Jogador,
        @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            await this._jogadoresService.criarJogador(jogador)
            await channel.ack(originalMessage);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            this.ackErrors.map(async err => {
                if (error.message.includes(err)) {
                    await channel.ack(originalMessage);
                }
            })
        }
    }

    @MessagePattern('consultar-jogador')
    async consultarJogador(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try{
            if(_id){
                return await this._jogadoresService.consultarJogadoresPeloId(_id);
            }else {
                return await this._jogadoresService.consultarTodosJogadores();
            }
        } finally {
            channel.ack(originalMessage);
        }
    }

    @EventPattern('atualizar-jogador')
    async atualizarJogador(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            const _id: string = data._id;
            const jogador: Jogador = data.jogador;
            await this._jogadoresService.atualizarJogador(jogador, _id);
            await channel.ack(originalMessage);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            this.ackErrors.map(async err => {
                if (error.message.includes(err)) {
                    await channel.ack(originalMessage);
                }
            })
        }
    }

    @EventPattern('apagar-jogador')
    async apagarJogador(
        @Payload() _id: string,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try{
            await this._jogadoresService.deletarJogador(_id);
            await channel.ack(originalMessage);
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
        }
    }


}
