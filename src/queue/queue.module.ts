import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { QueueProcessor } from './queue.processor';
import { BullModule } from '@nestjs/bull';
import { PDF_EMAIL_QUEUE } from 'src/constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: +configService.get('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get('EMAIL'),
            pass: configService.get('PASSWORD'),
          },
        },
        defaults: { from: '"No Reply" <no-reply@rumsan.com>' },
        template: {
          dir: __dirname + '/../.data',
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),

    BullModule.registerQueue({
      name: PDF_EMAIL_QUEUE,
    }),
  ],
  providers: [QueueProcessor],
})
export class QueueModule {}
