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

    controller.setupWebserver(process.env.PORT || 3000, function(err, express_webserver) {
        if (err) {
            return console.error(err);
        }

        // Add multiple slash command tokens to this array
        controller.createWebhookEndpoints(express_webserver, [process.env.SLASHCOMMAND_10AM_TOKEN]);

        // Need to abstract this a little once it handles more slash commands
        controller.on('slash_command', require('./10am'));
    });
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
