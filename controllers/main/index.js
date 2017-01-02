var Botkit = require('botkit');
var controller = Botkit.slackbot({
    debug: process.env.NODE_ENV !== 'production',
});
var listenerHi = require('./listeners/hi');
var bot;

/**
 * Start the bot
 *
 * @returns {Object} the created slackbot
 */
exports.start = function start() {
    bot = controller.spawn({
        token: process.env.SLACKBOT_TOKEN
    }).startRTM();

    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {listenerHi(bot, message, controller)});

    return bot;
}
