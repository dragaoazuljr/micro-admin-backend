import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
    
    private readonly logger = new Logger(JogadoresService.name);

    constructor(
        @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>
    ){}
    
    async criarJogador(criarJogadorDto: Jogador): Promise<Jogador>{
        try{
            const jogadorCriado = new this.jogadorModel(criarJogadorDto);
            return await jogadorCriado.save();
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async atualizarJogador(atualizarJogadorDto: Jogador, _id: string){
        try{
            const jogador = await this.jogadorModel.findOne({_id}).exec();
            if(!jogador){
                throw new NotFoundException(`Jogador não encontrado`)
            }
            await this.jogadorModel.findOneAndUpdate({_id}, atualizarJogadorDto).exec();
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async deletarJogador(_id: string): Promise <any>{
        try {
            return await this.jogadorModel.findOneAndDelete({_id}).exec();
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
        try {
            const jogador = await this.jogadorModel.findOne({email}).populate('categoria').exec();
            if(!jogador){
                throw new NotFoundException(`Jogador com email ${email} não encontrado`)
            }
            return jogador
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async consultarJogadoresPeloId(_id: string): Promise<Jogador> {
        try {
            const jogador = await this.jogadorModel.findOne({_id}).exec();
            if(!jogador){
                throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
            }
            return jogador
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        try{
            return await this.jogadorModel.find().exec();
        } catch(error){
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

}
