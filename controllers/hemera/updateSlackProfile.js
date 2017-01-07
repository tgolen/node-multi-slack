var hemera = require('./index');
var controller;

/**
 * Every time a user posts a message, we update their slack profile so we can stay up to date on their profile
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function updateSlackProfile(bot, message) {
    controller = hemera.getController();
    controller.storage.users.get(message.user, function(err, user) {
        if (err) {
            return console.error(err);
        }

        bot.api.users.info({user: message.user}, function(err, res) {
            if (err) {
                return console.error(err);
            }

            if (!user) {
                user = {
                    id: message.user,
                };
            }

            user.slackUser = res.user;
            controller.storage.users.save(user, function() {});
        });
    });
};
