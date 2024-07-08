import { Injectable } from '@nestjs/common';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_DEFAULT, SEND_EMAIL } from '../constants';
import { jobOptions } from './config/bullOptions';
import { CreatePdfDto } from './dto/create-pdf.dto';
import * as  moment from 'moment';

@Injectable()
export class PdfService {
  constructor(@InjectQueue(QUEUE_DEFAULT) private readonly _queue: Queue) {}

  async create(dto: CreatePdfDto) {
    const eventDate = moment(dto.eventDate).format('MMMM Do, YYYY');
    try {
      await this._queue.add(
        SEND_EMAIL,
        {
          templateName: dto.templateName,
          data: {
            fullName: dto.fullName,
            eventLocation: dto.eventLocation,
            email: dto.email,
            organizerName: dto.organizerName,
            eventDate: eventDate,
          },
        },
        jobOptions,
      );
    } catch (error) {
      throw error;
    }
    return 'success';
  }

  findAll() {
    return `This action returns all pdf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdf`;
  }

  update(id: number, updatePdfDto: UpdatePdfDto) {
    return `This action updates a #${id} pdf`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdf`;
  }
}
