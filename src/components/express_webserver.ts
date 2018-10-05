import { SlackController } from 'botkit';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cookieParser from 'cookie-parser';

const express = require('express');

module.exports = (controller: SlackController) => {
  const webserver = express();
  webserver.use((req, res, next) => {
    req.rawBody = '';

    req.on('data', chunk => {
      req.rawBody += chunk;
    });

    next();
  });
  webserver.use(cookieParser());
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));

  let normalizedPath = path.join(__dirname, 'express_middleware');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(file => {
      require(`./express_middleware/${file}`)(webserver, controller);
    });

  const server = http.createServer(webserver);

  server.listen(process.env.PORT || 3000, null, () => {
    console.log(
      `Express webserver configured and listening at http://localhost:${process
        .env.PORT || 3000}`
    );
  });

  normalizedPath = require('path').join(__dirname, 'routes');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(file => {
      require(`./routes/${file}`)(webserver, controller);
    });

  return webserver;
};
