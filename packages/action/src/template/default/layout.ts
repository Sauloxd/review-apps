import * as fs from 'fs';
import * as path from 'path';
import { render } from 'mustache';

const html = fs.readFileSync(path.resolve(__dirname, './layout.html'), 'utf-8');

export const layout = ({ children }: { children: string }) => {
  return render(html, {}, { children });
};
