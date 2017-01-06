var hemera = require('../controllers/hemera');
var db = require('../lib/db').db();

/**
 * Handles the 10AM express route
 * @param  {Express.Request} req
 * @param  {Express.Response} res
 */
module.exports = function (req, res) {
    var bot = hemera.getBot();
    var controller = hemera.getController();

    if (req.body.token !== process.env.SLASHCOMMAND_10AM_TOKEN) {
        return res.status(403).send();
    }

    controller.storage.users.get(req.body.user_id, function(err, user) {
        if (err) {
            res.send('Ooops, there was an error. How embarassing. ' + err.toString());
            console.error(err);
        }

        if (!user) {
            res.send('I don\'t know you yet. Why don\'t you say "@hemera hi" and introduce yourself.');
            return;
        }

        // Record the last time the user made an update and what that update was
        user.lastUpdate_at = new Date();
        user.lastUpdate = req.body.text;
        controller.storage.users.save(user, function(err) {
            if (err) {
                console.error(err);
                res.send('Ooops, there was an error. How embarassing. ' + err.toString());
                return;
            }

            // Send their update to our main 10AM channel
            bot.api.chat.postMessage({
                channel: '10amtest',
                text: req.body.text,
                as_user: false,
                username: req.body.user_name,
                icon_url: user.slackUser ? user.slackUser.profile.image_72 : '',
            }, function(err) {
                if (err) {
                    console.error(err);
                    res.send('Ooops, there was an error. How embarassing. ' + err.toString());
                    return;
                }

                // Respond to the API at this point so the rest is done after the request
                res.send('OK, I will post your update!');

                // Now send a PM to each of our users with that update
                controller.storage.users.all(function(err, users) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    if (users && users.length) {
                        for (var i = 0; i < users.length; i++) {
                            var recipient = users[i];

                            // Don't send a message to the user that's posting the update
                            if (recipient.id === req.body.user_id) {
                                continue;
                            }

                            // Don't send a message to this person if they snoozed the user posting the update
                            if (recipient.snooze && recipient.snooze.length && recipient.snooze.indexOf(req.body.user_name) > -1) {
                                continue;
                            }

                            // Open an IM channel and post to it
                            bot.api.im.open({
                                user: recipient.id
                            }, function (err, res) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }

                                var channelId = res.ok ? res.channel.id : null;
                                if (channelId) {
                                    bot.api.chat.postMessage({
                                        channel: channelId,
                                        text: req.body.text,
                                        as_user: false,
                                        username: req.body.user_name,
                                        icon_url: user.slackUser ? user.slackUser.profile.image_72 : '',
                                    }, function(err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            });
        });
    });
};
