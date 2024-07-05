const template = 'hlb-certificate';
const data = {
  fullName: 'Santosh Shrestha',
  lastName: 'Nice',
};

import * as fs from 'fs';
import * as PdfMake from 'pdfmake';

import { listFontsFromFolder, replacePlaceholders } from '../src/utils';

const fonts = listFontsFromFolder('./.data/fonts');

const printer = new PdfMake(fonts);

const docDefinition = replacePlaceholders(template, data);
const pdfDoc = printer.createPdfKitDocument(docDefinition);

const fileStream = fs.createWriteStream('./.data/demo.pdf');
pdfDoc.pipe(fileStream);
pdfDoc.end();
