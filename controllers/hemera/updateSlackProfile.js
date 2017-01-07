var hemera = require('./index');
var controller;

/**
 * Every time a user posts a message, we update their slack profile so we can stay up to date on their profile
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function updateSlackProfile(bot, message) {
    controller = hemerga.getController();
    controller.storage.users.get(message.user, function(err, user) {
        if (err) {
            return console.error(err);
        }

        bot.api.users.info({user: message.user}, function(err, res) {
            if (err) {
                return console.error(err);
            }

            user.slackUser = res.user;
            controller.storage.users.save(user, function() {});
        });
    });
};
