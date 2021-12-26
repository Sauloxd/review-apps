import * as fs from 'fs';
import * as path from 'path';

export const toHtml = (dirname: string, filename: string) =>
  fs.readFileSync(path.resolve(dirname, filename), 'utf-8');
