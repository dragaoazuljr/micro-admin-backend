import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogador.schema';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';

@Module({
  controllers: [JogadoresController],
  imports: [
    MongooseModule.forFeature([
        { name: 'Jogador', schema: JogadorSchema}
      ]),
  ],
  providers: [JogadoresService]
})
export class JogadoresModule {}
