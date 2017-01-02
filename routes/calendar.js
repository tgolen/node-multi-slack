var db = require('../lib/db').db();

module.exports = function route(req, res) {
    db.collection('users').find({}, function(err, users) {
        if (err) {
            return console.error(err);
        }

        res.render('calendar', {
            userId: req.params.userId,
            users: users,
        });
    });
};