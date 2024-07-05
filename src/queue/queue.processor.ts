import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getTemplateJson } from '../utils';
import { createPdf } from '../utils/pdf.utils';
import { createEmail } from '../utils/email.utils';
import { Process, Processor } from '@nestjs/bull';
import { PDF_EMAIL_QUEUE } from 'src/constants';

@Injectable()
@Processor(PDF_EMAIL_QUEUE)
export class QueueProcessor {
  constructor(private readonly _mailerService: MailerService) {}

  @Process(PDF_EMAIL_QUEUE)
  async createPdfAndEmail(templateName: string, data: any) {
    const template = getTemplateJson(templateName);
    const pdf = await createPdf(template, data);

    if (data.sendEmail === true && template.email) {
      const emailPayload = await createEmail(template, data, pdf);
      await this._mailerService.sendMail(emailPayload);
      return true;
    }

    return false;
  }
}
