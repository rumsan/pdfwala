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
  async processSendEmail(
    job: Job<{ templateName: string; data: TemplateData }>,
  ) {
    this._logger.log(
      `sending email for template '${job.data.templateName}' to '${job.data.data.email}'`,
    );
    const { templateName, data } = job.data;

    const result = await this.createPdfAndEmail(templateName, data);

    return result;
  }

  async createPdfAndEmail(templateName: string, data: TemplateData) {
    if (templateName === 'consent') {
      const organizationName = data.organization;

      const template = getTemplateJson(templateName, organizationName);

      const pdf = await createPdf(template, data);

      return pdf as string;
    }
    const template = getTemplateJson(templateName);

    const pdf = await createPdf(template, data);

    if (template.email) {
      if (typeof pdf === 'string') {
        throw new Error('Expected a Buffer but received a base64 string');
      }
      const emailPayload = await createEmail(template, data, pdf);

      const res = await this._mailerService.sendMail(emailPayload);

      return true;
    }

    // return false;
  }
}
