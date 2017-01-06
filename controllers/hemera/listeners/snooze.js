var hemera = require('../index');

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        var targetUser = message.match[1];
        var targetUserId = targetUser.replace('<@', '').replace('>', '');
        var controller = hemera.getController();

        if (targetUser.search('<@') === -1) {
            convo.say('When snoozing someone, you need to add @ in front of their name');
            return;
        }

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
                return;
            }

            if (!user) {
                convo.say('I don\'t know you. Why don\'t you say "hi" and introduce yourself?');
                return;
            }

            if (!user.snooze) {
                user.snooze = [];
            }

            if (user.snooze.indexOf(targetUser) > -1) {
                convo.say('You are already ignoring them.');
                return;
            }

            // The target user may not be registered yet, but that's OK. This is really just a failsafe
            bot.api.users.info({user: targetUserId}, function(err, res) {
                if (err) {
                    return console.error(err);
                }

                // Save this user to their array of snoozed users
                user.snooze.push(res.user.name);
                controller.storage.users.save(user, function() {
                    convo.say('I will no longer send you private messages from ' + res.user.name + '.');
                });
            });
        });
    });
};
