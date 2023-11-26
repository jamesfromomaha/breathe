const http = require('node:http');
const { readFile } = require('node:fs/promises');

const IP = '127.0.0.1';
const PORT = 3000;

const server = http.createServer();
server
  .on('request', async function (req, res) {
    let file;
    switch (req.url.split('/').pop()) {
    case 'index.html':
      file = { path: 'cypress/support/index.html', mime: 'text/html' };
      break;
    case 'loadme.html':
      file = { path: 'cypress/support/loadme.html', mime: 'text/html' };
      break;
    case 'include-html.js':
      file = { path: 'build/include-html.js', mime: 'text/javascript' };
      break;
    default:
      console.error(`'${req.url}' not found:\n${Object.keys(req).join('\n')}`);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Not found');
    }
    let data = await readFile(file.path);
    res.statusCode = 200;
    res.setHeader('Content-Type', file.mime);
    res.end(data);
  })
  .listen(PORT, IP, () => console.log('Server running on :3000'));
