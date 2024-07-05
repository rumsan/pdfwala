import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getTemplateJson } from '../utils';
import { createPdf } from '../utils/pdf.utils';
import { createEmail } from '../utils/email.utils';
import { Process, Processor } from '@nestjs/bull';
import { QUEUE_DEFAULT, SEND_EMAIL } from '../constants';
import { Job } from 'bull';

@Injectable()
@Processor(QUEUE_DEFAULT)
export class QueueProcessor {
  constructor(private readonly _mailerService: MailerService) {}

  @Process(SEND_EMAIL)
  async processSendEmail(job: Job<{ templateName: string; data: any }>) {
    const { templateName, data } = job.data;
    return this.createPdfAndEmail(templateName, data);
  }

  async createPdfAndEmail(templateName: string, data: any) {
    const template = getTemplateJson(templateName);
    const pdf = await createPdf(template, data);

    if (template.email) {
      const emailPayload = await createEmail(template, data, pdf);
      const res = await this._mailerService.sendMail(emailPayload);
      console.log(res);
      console.log('sending email:', templateName);
      return true;
    }

    return false;
  }
}
