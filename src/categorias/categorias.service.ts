import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
    
    private readonly logger = new Logger(CategoriasService.name);
    
    constructor(
        @InjectModel('Categoria') private readonly _categoriaModel: Model<Categoria>,
    ) { }


    async criarCategoria(categoria: Categoria): Promise<Categoria> {
        try {
            const categoriaCriada = new this._categoriaModel(categoria)
            return await categoriaCriada.save();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message);
        }
    }

    async consultarCategoriaPorId(_id: string) {
        try {
            return await this._categoriaModel.findOne({ _id }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error)}`)
            throw new RpcException(error.message)
        }
    }

    async consultarCategorias() {
        try {
            return await this._categoriaModel.find().exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error)}`)
            throw new RpcException(error.message)
        }
    }

    async atualizarCategoria(_id, categoria: Categoria) {
        try {
            const categoriaEncontrada = this._categoriaModel.findOne({ _id })
            if (!categoriaEncontrada) {
                throw new RpcException(`categoria ${_id} nao encontrada`);
            }
            return await this._categoriaModel.findOneAndUpdate({ _id }, categoria)
        } catch (error) {
            this.logger.error(`error on atualizarCategoria: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }
}
