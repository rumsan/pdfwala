import { getTemplateJson } from '../src/utils';
import { createPdf } from '../src/utils/pdf.utils';
import * as fs from 'fs';
import * as path from 'path';

const templateName = 'hlb-certificate';
const data = {
  fullName: 'John Doe',
};

async function testPdfDesign() {
  const template = getTemplateJson(templateName);
  const pdf = await createPdf(template, data);
  fs.writeFileSync(path.join(process.cwd(), '.data', 'document.pdf'), pdf);
}

testPdfDesign();
