import * as fs from 'fs';
import * as path from 'path';

export function replacePlaceholders(
  templateName: string,
  data: any,
  options: { assetPath?: string; requireAllFields?: boolean } = {
    requireAllFields: false,
  },
): any {
  // Read reference JSON file
  const templatePath = path.join(
    __dirname,
    '..',
    '..',
    '.data',
    'templates',
    templateName,
    'template.json',
  );

  options.assetPath =
    options.assetPath ||
    path.join(__dirname, '..', '..', '.data', 'templates', templateName);

  data.assetPath = options.assetPath;
  const referenceData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  // Replace placeholders in the template JSON
  const replacedJson = JSON.parse(
    JSON.stringify(referenceData.pdf).replace(/{{(.*?)}}/g, (match, p1) => {
      const keys = p1.split('.');
      let value = data;
      for (const key of keys) {
        if (value.hasOwnProperty(key)) {
          value = value[key];
        } else {
          value = '';
          //throw new Error(`Placeholder '${p1}' not found in reference JSON.`);
        }
      }
      return value;
    }),
  );

  return replacedJson;
}
