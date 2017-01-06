/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('Hi!');
    });
};
