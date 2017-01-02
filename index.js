var express = require('express');
var favicon = require('serve-favicon');
var mainController = require('./controllers/main');
var db = require('./lib/db');

if (!process.env.SLACKBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

mainController.start();

db.connect(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    console.log("Connected successfully to DB");

    var app = express();
    app.set('view engine', 'pug');
    app.use(express.static('public'));
    app.use(favicon(__dirname + '/public/images/logo.png'));

    app.get('/:userId/', function (req, res) {
        res.render('index', {
            userId: req.params.userId,
        });
    });

    app.get('/:userId/events', require('./routes/events'));
    app.get('/:userId/calendar', require('./routes/calendar'));

    app.listen(process.env.PORT || 3000, function () {
        console.log('App listening on port ' + (process.env.PORT || 3000) + '!');
    });
});
