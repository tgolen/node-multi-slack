var hemera = require('../index');

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    var controller = hemera.getController();
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('Hi! I am Hemera, the Greek goddess of the day.\n'
            + '> Nyx and Hemera draw near and greet one another as they pass the great threshold of bronze: and while the one is about to go down into the house, the other comes out at the door.\n'
            + 'I have been tasked with managing your 10 AM updates. Want to know how it works? Just say `help`.');

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.trace(err);
                return;
            }

            if (!user) {
                bot.api.users.info({user: message.user}, function(err, res) {
                    if (err) {
                        return console.trace(err);
                    }

                    var newUser = {
                        id: message.user,
                        slackUser: res.user
                    };
                    controller.storage.users.save(newUser, function() {});
                });
            }
        });
    });
};
