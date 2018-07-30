/* eslint-disable no-alert, no-console */

import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import forceSSL from 'express-force-ssl';

const app = express();
app.use(cors());
app.use(compression({
  level: 9,
  strategy: 1,
  memLevel: 9,
}));
app.use(forceSSL);
app.use(express.static('dist/client'));
app.use('*', (req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>seneca</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <base href="/" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
      </head>
      <body>
        <div id="app"></div>
        <script src="main.js" defer></script>
      </body>
    </html>
  `);
});
const readAsUTF8 = path => fs.readFileSync(path, 'utf8');

// generated using https://github.com/jsha/minica
// for testing purposes only
const SSL = {
  key: readAsUTF8('./certs/senecatest.com-key.pem'),
  cert: readAsUTF8('./certs/senecatest.com-cert.pem'),
  ca: [
    readAsUTF8('./certs/minica.pem'),
    readAsUTF8('./certs/minica-key.pem'),
  ],
};

console.log('Starting..');
http.createServer(app).listen(
  80,
  () => console.log('Running @ port 80!'),
);
https.createServer(SSL, app).listen(
  443,
  () => console.log('Running @ port 443!'),
);
