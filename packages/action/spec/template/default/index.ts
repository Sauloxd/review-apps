import * as http from 'http';
import { defaultPage } from '../../../src/template/default';
import { manifest } from '../../fixtures/manifest';

// To develop, run yarn dev:tmpl
const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(defaultPage(manifest));
});

server.listen(process.env.PORT || 3000);
