import * as PdfMake from 'pdfmake';

import { TemplateJson, listFontsFromFolder, replacePlaceholders } from '.';

const fonts = listFontsFromFolder('.data/fonts');

const printer = new PdfMake(fonts);

export function createPdf(template: TemplateJson, data: any): Promise<Buffer> {
  
  data.assetPath = data.assetPath || template.path;

  const docDefinition = replacePlaceholders(template, data);
 
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
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
