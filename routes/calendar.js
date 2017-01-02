var db = require('../lib/db').db();

module.exports = function route(req, res) {
    db.collection('users').find().toArray(function(err, users) {
        if (err) {
            return console.error(err);
        }

        res.locals.USERS = users;

        res.render('calendar', {
            userId: req.params.userId
        });
    });
};
