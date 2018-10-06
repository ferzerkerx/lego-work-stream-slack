import { SlackController } from 'botkit';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as express from 'express';
import { Server } from 'http';
import { Express, Request } from 'express';

const createExpressServer = (controller: SlackController): Express => {
  const webserver: Express = express();
  webserver.use((req: Request, res, next) => {
    req.body = '';

    req.on('data', chunk => {
      req.body += chunk;
    });

    next();
  });
  webserver.use(cookieParser());
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));

  let normalizedPath: string = path.join(__dirname, 'express_middleware');
  fs.readdirSync(normalizedPath).forEach(file => {
    require(`./express_middleware/${file}`)(webserver, controller);
  });

  const server: Server = http.createServer(webserver);

  server.listen(process.env.PORT || 3000, null, () => {
    console.log(
      `Express webserver configured and listening at http://localhost:${process
        .env.PORT || 3000}`
    );
  });

  normalizedPath = path.join(__dirname, 'routes');
  fs.readdirSync(normalizedPath).forEach(file => {
    require(`./routes/${file}`)(webserver, controller);
  });

  return webserver;
};
module.exports = createExpressServer;
