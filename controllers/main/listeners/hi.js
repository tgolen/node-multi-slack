var conversationGreeting = require('../conversations/greeting');
var conversationSetup = require('../conversations/setup');

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message, controller) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        conversationGreeting(convo);
        conversationSetup(convo);
    });
};
