var moment = require('moment');
var userCache = {};
var cacheTimeInMilliseconds = 1000 * 60 * 15;

/**
 * Every time a user posts a message, we update their slack profile so we can stay up to date on their profile
 * @param  {Object} bot
 * @param  {Object} message
 * @param  {Object} controller
 */
module.exports = function updateSlackProfile(bot, message, controller) {
    // This can come in as undefined, so we will just ignore those requests
    if (!message.user) {
        return;
    }

    // Cache the user updates for 15 minutes so we don't do too much stuff
    if (userCache[message.user]) {
        var userCacheExpiration = moment(userCache[message.user]);
        if (userCacheExpiration.diff(moment(), 'minutes') < 15) {
            return;
        }
    }

    controller.storage.users.get(message.user, function(err, user) {
        if (err) {
            return console.trace(err);
        }

        bot.api.users.info({user: message.user}, function(err, res) {
            if (err) {
                console.error('could not get info for user %s', message.user);
                console.dir(message.user);
                return console.trace(err);
            }

            if (!user) {
                user = {
                    id: message.user,
                };
            }

            user.slackUser = res.user;
            controller.storage.users.save(user, function() {
                userCache[user.id] = new Date();
            });
        });
    });
};
