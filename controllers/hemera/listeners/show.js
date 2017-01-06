var hemera = require('../index');
var moment = require('moment');
/**
 * Show a person's last update
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        var targetUser = message.match[1];
        var targetUserId = targetUser.replace('<@', '').replace('>', '');
        var controller = hemera.getController();

        if (targetUser.search('<@') === -1) {
            convo.say('When looking at someone, you need to add @ in front of their name.');
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

            controller.storage.users.get(targetUserId, function(err, userToView) {
                if (err) {
                    console.error(err);
                    return;
                }

                if (!userToView || !userToView.lastUpdate) {
                    convo.say('They haven\'t posted any updates yet.');
                    return;
                }

                var dateOfLastUpdate = new moment(userToView.lastUpdate_at);
                convo.say('Their last update was '+dateOfLastUpdate.calendar()+': \n'
                    + '> ' + userToView.lastUpdate);
            });
        });
    });
};
