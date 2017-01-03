var channels = require('../channels');
var controller = require('../index').getController();
var bot = require('../index').getBot();

/**
 * Sets the user up for the first time
 * @param  {Object} convo
 */
module.exports = function greeting(convo, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (err) {
            console.error(err);
        }

        if (!user) {
            convo.addMessage('I am Titan. I am clever at observing the seasons of the year and times when the sun increases and ripens seeds and fruits.', channels.SETUP);
            convo.addMessage('This makes me especially good at remembering when you will be out of the office.', channels.SETUP);

            // Tell them their options
            convo.addMessage('Commands that I respond to: `reset`, `list`, `view`, `add`, `remove`, `help`, `hi`', channels.SETUP);
            convo.addMessage('Why don\'t you start by adding a time when you\'re going to be gone? Example: `add 2017-01-01 for 1 day on vacation`. Enter `help` to see how to use all the commands.', channels.SETUP);
        }
    });

    // When the conversation is done, create a user for them
    convo.on('end',function(convo) {
        if (convo.status === 'completed') {
            controller.storage.users.get(message.user, function(err, user) {
                if (err) {
                    console.error(err);
                }

                if (!user) {
                    bot.api.users.info({user: message.user}, function(err, res) {
                        if (err) {
                            return console.error(err);
                        }

                        var newUser = {
                            id: message.user,
                            slackUser: res.user
                        };
                        controller.storage.users.save(newUser, function() {});
                    });
                }
            });
        }
    });
};
