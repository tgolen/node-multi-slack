var titan = require('./controllers/titan');
var hemera = require('./controllers/hemera');
var slashcommand = require('./controllers/slashcommand');
var db = require('./lib/db');

db.connect(function(err, connection) {
    if (err) {
        return console.error(err);
    }
    console.log("Connected successfully to DB");

    hemera.start();
    titan.start();
    slashcommand.start();
});
