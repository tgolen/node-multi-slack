var Botkit = require('botkit');
var nag = require('./nag');
var updateSlackProfile = require('../utils/updateSlackProfile');
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

    // Keep their slack profile up to date for every message
    controller.on('message_received', function(bot, message) {
        updateSlackProfile(bot, message, controller);
    });

    // Setup our message listeners
    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', require('./listeners/hi'));
    controller.hears(['help'], 'direct_message,direct_mention,mention', require('./listeners/help'));
    controller.hears(['snooze (.*)'], 'direct_message,direct_mention,mention', require('./listeners/snooze'));
    controller.hears(['snooze'], 'direct_message,direct_mention,mention', require('./listeners/snoozeOops'));
    controller.hears(['subscribe (.*)'], 'direct_message,direct_mention,mention', require('./listeners/subscribe'));
    controller.hears(['subscribe'], 'direct_message,direct_mention,mention', require('./listeners/subscribeOops'));
    controller.hears(['list'], 'direct_message,direct_mention,mention', require('./listeners/list'));
    controller.hears(['show (.*)'], 'direct_message,direct_mention,mention', require('./listeners/show'));
    controller.hears(['show'], 'direct_message,direct_mention,mention', require('./listeners/showOops'));
    controller.hears(['reset'], 'direct_message,direct_mention,mention', require('./listeners/reset'));

    // Nag people about posting updates every hour
    nag();
    setInterval(nag, 1000 * 60 * 60);

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
