var channels = require('../channels');
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

        convo.addMessage('I have forced myself to forget all your settings', channels.DEFAULT);

        var newUser = {
            id: message.user,
        };
        controller.storage.users.save(newUser, function() {});
    });
};
