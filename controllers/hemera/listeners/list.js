var hemera = require('../index');

/**
 * Shows everyone that you are snoozing
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        var controller = hemera.getController();

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
                return;
            }

            if (!user) {
                convo.say('I don\'t know you. Why don\'t you say "hi" and introduce yourself?');
                convo.stop();
                return;
            }

            if (!user.snooze) {
                user.snooze = [];
            }

            if (!user.snooze.length) {
                convo.say('Nice! You are not snoozing anyone. You value all of your co-worker\'s updates!');
                convo.stop();
                return;
            }

            var reply = 'You are not listening to updates from:\n';
            for (var i = 0; i < user.snooze.length; i++) {
                reply += '    ' + user.snooze[i] + '\n';
            }

            if (user.snooze.length > 30) {
                reply += '\nThat\'s a lot of people. Be sure to keep watching the #10am channel for their updates. If you want to start over at any time, just say "reset".'
            }
            convo.say(reply);
            convo.stop();
        });
    });
};
