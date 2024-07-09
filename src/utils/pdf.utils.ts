import * as PdfMake from 'pdfmake';

import { TemplateJson, listFontsFromFolder, replacePlaceholders } from '.';

const fonts = listFontsFromFolder('.data/fonts');

const printer = new PdfMake(fonts);

export function createPdf(template: TemplateJson, data: any): Promise<Buffer> {
  console.log(template, 'template-createpdf');
  console.log(data, 'data-createpdf');
  data.assetPath = data.assetPath || template.path;

  const docDefinition = replacePlaceholders(template, data);
  console.log(docDefinition, 'docDefinition');
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  console.log(pdfDoc,'pdfdoc')
  return new Promise((resolve, reject) => {
    try {
      const chunks: Uint8Array[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });

  //   const fileStream = fs.createWriteStream('./.data/demo.pdf');
  //   pdfDoc.pipe(fileStream);
  //   pdfDoc.end();
}
