var db = require('../lib/db').db();

module.exports = function route(req, res) {
    db.collection('users').findOne({id: req.params.userId}, function(err, user) {
        if (err) {
            return console.error(err);
        }

        if (!user) {
            return res.render('nouser');
        }

        res.render('events', {
            userId: req.params.userId,
            user: user,
        });
    });
};
