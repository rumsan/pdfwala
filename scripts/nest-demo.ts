// console.ts

import { NestFactory } from '@nestjs/core';
import { QueueModule } from '../src/queue/queue.module';
import { QueueProcessor } from '../src/queue/queue.processor';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(QueueModule);
  const service = appContext.get(QueueProcessor);

  try {
    await service.createPdfAndEmail('hlb-certificate', {
      fullName: 'santosh shrestha',
      to: 'santosh@rumsan.com',
      from: 'rumsan@gmail.com',
      subject: 'Thank you there!',
      sendEmail: true,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
