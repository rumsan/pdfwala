import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { createPdf } from './pdf.service';

const templatePath = '.data/templates';

@Injectable()
export class ProcessorService {
  constructor(private readonly _mailerService: MailerService) {}

  async renderTemplate(
    templatePath: string,
    data: Record<string, any>,
  ): Promise<string> {
    try {
      // Read the template file
      const templateFile = await fs.promises.readFile(templatePath, 'utf-8');

      // Compile the template
      const template = Handlebars.compile(templateFile);

      // Render the template with the provided data
      const result = template(data);

      return result;
    } catch (error) {
      console.error('Error rendering template:', error);
      throw error;
    }
  }

  async createPdfAndEmail(template: string, data: any) {
    const pdf = await createPdf(template, data);
    this.sendMail(template, data, pdf).then(() => {
      console.log('Email sent');
    });
  }

  async sendMail(template: string, data: any, pdfBuffer: Buffer) {
    const html = await this.renderTemplate(
      path.join(templatePath, template, data.tplBody),
      data,
    );

    const attachments = [];
    for (const img of data.images) {
      attachments.push({
        filename: img.file,
        path: path.join(templatePath, template, img.file),
        cid: img.cid,
        headers: {
          'Content-Disposition': `inline; filename="${img.file}`,
        },
      });
    }

    if (pdfBuffer) {
      attachments.push({
        filename: `${template}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
    }

    return this._mailerService.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      html,
      attachments,
    });
  }
}
