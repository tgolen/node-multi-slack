var express = require('express');
var bodyParser = require('body-parser');
//var titanController = require('./controllers/titan').start();
var hemeraController = require('./controllers/hemera').start();

var db = require('./lib/db');

db.connect(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    console.log("Connected successfully to DB");

    var app = express();

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
