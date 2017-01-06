var hemera = require('../controllers/hemera');
var db = require('../lib/db').db();

module.exports = function (req, res) {
    var bot = hemera.getBot();
    var controller = hemera.getController();

    if (req.body.token !== process.env.SLASHCOMMAND_10AM_TOKEN) {
        return res.status(403).send();
    }

    controller.storage.users.get(req.body.user_id, function(err, user) {
        if (err) {
            console.error(err);
        }

        if (!user) {
            res.send('I don\'t know you yet. Why don\'t you say "@hemera hi" and introduce yourself.');
            return;
        }

        var newUpdate = {
            user: user.id,
            text: req.body.text,
            created_at: new Date(),
        };
        db.collection('updates').insertOne(newUpdate, function(err) {
            if (err) {
                res.send('Ooops, there was an error. How embarassing. ' + err.toString());
                return;
            }

            user.lastUpdate = new Date();
            controller.storage.users.save(user, function(err) {
                if (err) {
                    res.send('Ooops, there was an error. How embarassing. ' + err.toString());
                    return;
                }

                bot.api.chat.postMessage({
                    channel: '10amtest',
                    text: req.body.text,
                    as_user: false,
                    username: req.body.user_name,
                    icon_url: user.slackUser ? user.slackUser.profile.image_72 : '',
                }, function(err) {
                    if (err) {
                        res.send('Ooops, there was an error. How embarassing. ' + err.toString());
                        return;
                    }

                    res.send('OK, I will post your update!');
                });
            });
        });
    });
};
