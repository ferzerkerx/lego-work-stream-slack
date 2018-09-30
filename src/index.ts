
if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
  process.exit(1);
}

const Botkit = require('botkit');

const bot_options: any = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  debug: true,
  scopes: ['bot'],
  token: process.env.API_TOKEN,
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
  bot_options.storage = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGO_URI,
  });
} else {
  bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(
  controller
);

if (!process.env.clientId || !process.env.clientSecret) {
  webserver.get('/', (req, res) =>{
    res.send('active');
  });
  console.log(
    'WARNING: This application is not fully configured to work with Slack'
  );
} else {
  webserver.get('/', (req, res)=> {
    res.send('active');
  });

  // Set up a simple storage backend for keeping a record of customers
  // who sign up for the app via the oauth
  require(__dirname + '/components/rtm_manager.js')(controller);

  const normalizedPath = require('path').join(__dirname, 'skills');
  require('fs')
    .readdirSync(normalizedPath)
    .forEach(function(file) {
      require('./skills/' + file)(controller);
    });

  controller.trigger('rtm:start', [bot_options]);
}

function usage_tip() {
  console.log('~~~~~~~~~~');
  console.log('Botkit Starter Kit');
  console.log('Execute your bot application like this:');
  console.log(
    'clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js'
  );
  console.log('Get Slack app credentials here: https://api.slack.com/apps');
  console.log('~~~~~~~~~~');
}
