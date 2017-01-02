var channels = require('../channels');
var controller = require('../index').getController();

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function add(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        convo.addMessage('Adding the date: ' + message.match[1], channels.DEFAULT);
    });
};
