import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { getTemplateJson } from '../utils';
import { createPdf } from '../utils/pdf.utils';
import { createEmail } from '../utils/email.utils';
import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { QUEUE_DEFAULT, SEND_EMAIL } from '../constants';
import { Job } from 'bull';

@Injectable()
@Processor(QUEUE_DEFAULT)
export class QueueProcessor {
  private readonly _logger = new Logger(QueueProcessor.name);
  constructor(private readonly _mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @Process(SEND_EMAIL)
  async processSendEmail(job: Job<{ templateName: string; data: any }>) {
    this._logger.log(
      `sending email for template '${job.data.templateName}' to '${job.data.data.email}'`,
    );
    const { templateName, data } = job.data;
    return this.createPdfAndEmail(templateName, data);
  }

  async createPdfAndEmail(templateName: string, data: any) {
    const template = getTemplateJson(templateName);

    const pdf = await createPdf(template, data);

    if (template.email) {
      const emailPayload = await createEmail(template, data, pdf);

      const res = await this._mailerService.sendMail(emailPayload);

      return true;
    }

    return false;
  }
}
  