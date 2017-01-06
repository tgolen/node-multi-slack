var hemera = require('../index');

/**
 * Corrects the syntax for show
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('You need to show a specific person. Example: `show @person`');
    });
};
