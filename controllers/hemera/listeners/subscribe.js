var hemera = require('../index');

/**
 * Stops snoozing a specific person
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        var targetUser = message.match[1];
        var targetUserId = targetUser.replace('<@', '').replace('>', '');
        var controller = hemera.getController();

        if (targetUser.search('<@') === -1) {
            convo.say('When subscribing to someone, you need to add @ in front of their name.');
            return;
        }

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.trace(err);
                return;
            }

            if (!user) {
                convo.say('I don\'t know you. Why don\'t you say "hi" and introduce yourself?');
                return;
            }

            if (!user.snooze) {
                user.snooze = [];
            }

            // The target user may not be registered yet, but that's OK. This is really just a failsafe
            bot.api.users.info({user: targetUserId}, function(err, res) {
                if (err) {
                    return console.trace(err);
                }

                if (user.snooze.indexOf(res.user.name) === -1) {
                    convo.say('You are already subscribed to them');
                    return;
                }

                // Save this user to their array of snoozed users
                var newSnoozeArray = [];
                for (var i = 0; i < user.snooze.length; i++) {
                    if (user.snooze[i] !== res.user.name) {
                        newSnoozeArray.push(user.snooze[i]);
                    }
                }
                user.snooze = newSnoozeArray;
                controller.storage.users.save(user, function() {
                    convo.say('I will start sending you updates from ' + res.user.name + ' again.');
                });
            });
        });
    });
};
