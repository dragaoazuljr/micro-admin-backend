import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JogadorSchema } from './jogadores/interfaces/jogador.schema';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.zkh1s.mongodb.net/sradmbackend?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CategoriasModule,
    JogadoresModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
