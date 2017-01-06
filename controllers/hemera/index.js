var Botkit = require('botkit');
var controller;
var bot;

/**
 * Start the bot
 *
 * @returns {Object} the created slackbot
 */
exports.start = function start() {
    controller = Botkit.slackbot({
        debug: process.env.NODE_ENV !== 'production',
        storage: require('botkit-storage-mongo')({mongoUri: process.env.DATABASE_URL})
    });

    bot = controller.spawn({
        token: process.env.SLACKBOT_TOKEN_HEMERA
    }).startRTM();

    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', require('./listeners/hi'));
    controller.hears(['help'], 'direct_message,direct_mention,mention', require('./listeners/help'));
    controller.hears(['snooze (.*)'], 'direct_message,direct_mention,mention', require('./listeners/snooze'));
    controller.hears(['snooze'], 'direct_message,direct_mention,mention', require('./listeners/snoozeOops'));
    controller.hears(['subscribe (.*)'], 'direct_message,direct_mention,mention', require('./listeners/subscribe'));
    controller.hears(['subscribe'], 'direct_message,direct_mention,mention', require('./listeners/subscribeOops'));

    return bot;
};

/**
 * Get the botkit controller
 * @return {Object}
 */
exports.getController = function getController() {
    return controller;
}

/**
 * Get the running bot
 * @return {Object}
 */
exports.getBot = function getController() {
    return bot;
}
