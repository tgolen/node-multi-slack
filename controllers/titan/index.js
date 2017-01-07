var Botkit = require('botkit');
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

    // Keep their slack profile up to date for every message
    controller.on('message_received', function(bot, message) {
        updateSlackProfile(bot, message, controller);
    });

    controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', require('./listeners/hi'));
    controller.hears(['reset'], 'direct_message,direct_mention,mention', require('./listeners/reset'));
    controller.hears(['list'], 'direct_message,direct_mention,mention', require('./listeners/list'));
    controller.hears(['add (.*)'], 'direct_message,direct_mention,mention', require('./listeners/add'));
    controller.hears(['remove (.*)'], 'direct_message,direct_mention,mention', require('./listeners/remove'));
    controller.hears(['today'], 'direct_message,direct_mention,mention', require('./listeners/today'));
    controller.hears(['now'], 'direct_message,direct_mention,mention', require('./listeners/now'));
    controller.hears(['view (.*)'], 'direct_message,direct_mention,mention', require('./listeners/date'));
    controller.hears(['help', 'add', 'remove', 'view'], 'direct_message,direct_mention,mention', require('./listeners/help'));

    controller.spawn({
        token: process.env.SLACKBOT_TOKEN_TITAN
    }).startRTM(function(err, connectedBot) {
        if (err) {
            return console.error(err);
        }
        bot = connectedBot;
    });

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
