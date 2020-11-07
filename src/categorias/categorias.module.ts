import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaSchema } from './interfaces/categoria.schema';

@Module({
  controllers: [CategoriasController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema},
    ]),
  ],
  providers: [CategoriasService]
})
export class CategoriasModule {}
