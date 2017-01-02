var channels = require('../channels');
var controller = require('../index').getController();

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        convo.addMessage('This is when you will be out of the office:', channels.DEFAULT);

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
            }

            if (!user) {
                convo.transitionTo(channels.SETUP, 'I don\'t know you, let me introduce myself');
                return;
            }

            if (!user.events || !user.events.length) {
                convo.addMessage('You have not set up any out of the office times. You can add one now by telling me `add 1/1/2017`', channels.DEFAULT);
                return;
            } else {
                var message = '';
                for (var i = 0; i < user.events.length; i++) {
                    message += '[' + i + '] ' + user.events[i].start + ' - ' + user.events[i].end + '\n';
                }
                convo.addMessage(message, channels.DEFAULT);
            }
        });
    });
};
