var express = require('express');
var bodyParser = require('body-parser');
var titan = require('./controllers/titan');
var hemera = require('./controllers/hemera');
var db = require('./lib/db');

var app = express();

db.connect(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    console.log("Connected successfully to DB");

    hemera.start();
    titan.start();

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }))

    // parse application/json
    app.use(bodyParser.json())

    // Respond to the 10am slash command
    app.post('/10am', require('./routes/10am'));

    app.listen(process.env.PORT || 3000, function () {
        console.log('App listening on port ' + (process.env.PORT || 3000) + '!');
    });
});
