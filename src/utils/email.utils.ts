import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { TemplateJson } from '.';
import * as path from 'path';
import { ISendMailOptions } from '@nestjs-modules/mailer';

export async function renderTemplate(
  templatePath: string,
  data: Record<string, any>,
): Promise<string> {
  try {
    const templateFile = await fs.promises.readFile(templatePath, 'utf-8');

    const template = Handlebars.compile(templateFile);
    const result = template(data);

    return result;
  } catch (error) {
    console.error('Error rendering template:', error);
    throw error;
  }
}

export async function createEmail(
  template: TemplateJson,
  data: any,
  pdfBuffer: Buffer,
) {
  const payload: ISendMailOptions = {
    to: data.email,
    from: `${data.fromName || template.email.fromName}<${template.email.fromName}>`,
    subject: data.subject || template.email.subject,
  };
  payload.html = await renderTemplate(
    path.join(template.path, template.email.tplBody),
    data,
  );

  payload.attachments = [];
  if (template.email?.images)
    for (const img of template.email.images) {
      payload.attachments.push({
        filename: img.file,
        path: path.join(template.path, img.file),
        cid: img.cid,
        headers: {
          'Content-Disposition': `inline; filename="${img.file}`,
        },
      });
    }

  if (pdfBuffer) {
    payload.attachments.push({
      filename: `${template.name}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  return payload;
}
