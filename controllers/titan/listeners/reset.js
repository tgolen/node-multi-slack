var controller = require('../index').getController();

/**
 * Resets all the settings for a user
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function reset(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        convo.addMessage('I have forced myself to forget all your settings', 'default');

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
            }
            var newUser = {
                id: message.user,
                slackUser: user.slackUser,
            };
            controller.storage.users.save(newUser, function() {});
        });
    });
};
