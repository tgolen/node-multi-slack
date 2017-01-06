var hemera = require('../index');

/**
 * Corrects the syntax for subscribe
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('You need to subscribe to a specific person. Example: `subscribe @person`');
    });
};
