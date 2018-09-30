import {SlackController} from "botkit";

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');

module.exports = (controller : SlackController) => {
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

  // import express middlewares that are present in /components/express_middleware
  let normalizedPath = require('path').join(__dirname, 'express_middleware');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(file => {
      require('./express_middleware/' + file)(webserver, controller);
    });

  const server = http.createServer(webserver);

  server.listen(process.env.PORT || 3000, null, () => {
    console.log(
      'Express webserver configured and listening at http://localhost:' +
        process.env.PORT || 3000
    );
  });

  // import all the pre-defined routes that are present in /components/routes
  normalizedPath = require('path').join(__dirname, 'routes');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(file => {
      require('./routes/' + file)(webserver, controller);
    });

  return webserver;
};
