var MongoClient = require('mongodb').MongoClient;
var database;

/**
 * Connect to the DB
 * @param  {Function} cb
 */
exports.connect = function connect(cb) {
    MongoClient.connect(process.env.DATABASE_URL, function(err, connectedDatabase) {
        if (err) {
            return cb && cb(err);
        }

        database = connectedDatabase;
        cb && cb();
    });
};

/**
 * Return our DB object
 * @return {Object}
 */
exports.db = function db() {
    return database;
};
