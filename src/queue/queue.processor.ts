import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { getTemplateJson } from '../utils';
import { createPdf } from '../utils/pdf.utils';
import { createEmail } from '../utils/email.utils';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { QUEUE_DEFAULT, SEND_EMAIL } from '../constants';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { TemplateData } from 'src/utils/types';

@Injectable()
@Processor(QUEUE_DEFAULT)
export class QueueProcessor {
  private readonly _logger = new Logger(QueueProcessor.name);
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @Process(SEND_EMAIL)
  async processSendEmail(job: Job<{ templateName: string; data: TemplateData }>) {
    this._logger.log(`sending thank you email to '${job.data.data.email}'`);
    const { templateName, data } = job.data;

    return this.createPdfAndEmail(templateName, data);
  }

  async createPdfAndEmail(templateName: string, data: TemplateData) {
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
