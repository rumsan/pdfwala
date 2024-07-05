// console.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/processor/processor.module';
import { ProcessorService } from '../src/processor/processor.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const service = appContext.get(ProcessorService);

  try {
    await service.createPdfAndEmail('hlb-certificate', {
      fullName: 'santosh shrestha',
      to: 'santosh@rumsan.com',
      from: 'rumsan@gmail.com',
      subject: 'Thank you there!',
      images: [
        { cid: 'logo', file: 'hlb-logo.jpg' },
        { cid: 'cedar', file: 'cedar.png' },
      ],
      tplBody: 'email.hbs',
    });
  } catch (error) {
    console.error(error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
