import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplatesModule } from '../templates/templates.module';
import { AssetsModule } from '../assets/assets.module';
import { QueueModule } from 'src/queue/queue.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TemplatesModule,
    AssetsModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
