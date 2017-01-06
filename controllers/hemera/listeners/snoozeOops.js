var hemera = require('../index');

/**
 * Corrects the syntax for snooze
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('You need to snooze a specific person. Example: `snooze @person`');
    });
};
