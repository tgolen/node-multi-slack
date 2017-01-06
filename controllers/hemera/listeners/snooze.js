var hemera = require('../index');

/**
 * Snoozes updates for a specific person
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        var targetUser = message.match[1];
        var targetUserId = targetUser.replace('<@', '').replace('>', '');
        var controller = hemera.getController();

        if (targetUser.search('<@') === -1) {
            convo.say('When snoozing someone, you need to add @ in front of their name.');
            convo.stop();
            return;
        }

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
                return;
            }

            if (!user) {
                convo.say('I don\'t know you. Why don\'t you say "hi" and introduce yourself?');
                convo.stop();
                return;
            }

            if (!user.snooze) {
                user.snooze = [];
            }

            // The target user may not be registered yet, but that's OK. This is really just a failsafe
            bot.api.users.info({user: targetUserId}, function(err, res) {
                if (err) {
                    return console.error(err);
                }

                if (user.snooze.indexOf(res.user.name) > -1) {
                    convo.say('I would snooze them for you, but you are already ignoring them.');
                    convo.stop();
                    return;
                }

                if (user.slackUser.name === res.user.name) {
                    convo.say('You don\'t want to hear your own updates? That\'s silly.');
                    convo.stop();
                    return;
                }

                // Save this user to their array of snoozed users
                user.snooze.push(res.user.name);
                controller.storage.users.save(user, function() {
                    convo.say('OK, I will no longer send you updates from ' + res.user.name + '.');
                    convo.stop();
                });
            });
        });
    });
};
