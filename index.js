var express = require('express');
var favicon = require('serve-favicon');
var mainController = require('./controllers/main');

if (!process.env.SLACKBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

mainController.start();

var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/images/logo.png'));

app.get('/:userId/', function (req, res) {
    res.render('index', {
        userId: req.params.userId,
    });
});

app.get('/:userId/events', function (req, res) {
    res.render('events', {
        userId: req.params.userId,
    });
});

app.get('/:userId/calendar', function (req, res) {
    res.render('calendar', {
        userId: req.params.userId,
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
