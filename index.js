var mainController = require('./controllers/main');

if (!process.env.SLACKBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

mainController.start();
