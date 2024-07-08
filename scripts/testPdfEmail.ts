// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app/app.module';
// import { QueueProcessor } from '../src/queue/queue.processor';

// async function bootstrap() {
//   const appContext = await NestFactory.createApplicationContext(AppModule);
//   const service = appContext.get(QueueProcessor);

//   try {
//     await service.createPdfAndEmail('hlb-certificate', {
//       fullName: 'Pratiksha RAi',
//       email: '728pratiksharai@gmail.com',
//       sendEmail: true,
//     });
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await appContext.close();
//   }
// }

// bootstrap();
