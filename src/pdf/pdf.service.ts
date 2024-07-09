import { Injectable } from '@nestjs/common';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_DEFAULT, SEND_EMAIL } from '../constants';
import { jobOptions } from './config/bullOptions';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { CertificateDto } from './dto/create-pdf.dto';
import { DonorCardDto } from './dto/create-pdf.dto';
import * as moment from 'moment';
import { calculateAge } from 'src/utils/helperFuntion';
import { eventNames } from 'process';

@Injectable()
export class PdfService {
  constructor(@InjectQueue(QUEUE_DEFAULT) private readonly _queue: Queue) {}

  async create(dto: CreatePdfDto) {
    let jobData: any;

    if (dto.templateName === 'donor-card') {
      const donorCardData = dto.data as DonorCardDto;
      const bloodGroupSplit = donorCardData.bloodGroup.split('_');
      const eventDate = moment(donorCardData.eventDate).format('MMMM Do, YYYY');

      jobData = {
        templateName: dto.templateName,
        data: {
          name: donorCardData.fullName,
          phone: donorCardData.phone,
          dob: calculateAge(donorCardData.dob),
          gender: donorCardData.gender.slice(0, 1),
          abo: bloodGroupSplit[0],
          rh: bloodGroupSplit[1],
          eventDate: eventDate,
          eventName: donorCardData.eventName,
          organization: donorCardData.organization,
          email: donorCardData.email,
        },
      };
    } else if (dto.templateName === 'hlb-certificate') {
      const certificateData = dto.data as CertificateDto;

      const formatDate = moment(certificateData.eventDate).format(
        'MMMM Do, YYYY',
      );

      jobData = {
        templateName: dto.templateName,
        data: {
          fullName: certificateData.fullName,
          eventLocation: certificateData.eventLocation,
          email: certificateData.email,
          organizerName: certificateData.organizerName,
          eventDate: formatDate,
        },
      };
    } else {
      throw new Error('Invalid template name');
    }
    try {
      await this._queue.add(
        SEND_EMAIL,
        jobData,
        // {
        //   templateName: dto.templateName,
        //   data: {
        //     fullName: dto.fullName,
        //     eventLocation: dto.eventLocation,
        //     email: dto.email,
        //     organizerName: dto.organizerName,
        //     eventDate: eventDate,
        //   },
        // },
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
