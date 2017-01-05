var express = require('express');
var favicon = require('serve-favicon');
var moment = require('moment');
var titanController = require('./controllers/titan');
var db = require('./lib/db');

titanController.start();

db.connect(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    console.log("Connected successfully to DB");

    var app = express();
    app.set('view engine', 'pug');
    app.use(express.static('public'));
    app.use(favicon(__dirname + '/public/images/logo.png'));
    app.locals.moment = moment;

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
