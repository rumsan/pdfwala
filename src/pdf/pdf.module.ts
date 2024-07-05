import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { BullModule } from '@nestjs/bull';
import { QUEUE_DEFAULT } from '../constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_DEFAULT,
    }),
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
