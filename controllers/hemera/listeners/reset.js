var hemera = require('../index');
var moment = require('moment');
/**
 * Reset their snooze list
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
                return;
            }

            if (!user.snooze || !user.snooze.length) {
                convo.say('There is nothing for me to reset. You\'re already getting everyone\'s updates.');
                return;
            }

            convo.ask('Are you sure you want to reset your list of snoozed people?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function (res, convo) {
                        // Clear out their list of snoozed people
                        user.snooze = [];
                        controller.storage.users.save(user, function() {
                            convo.say('You are now subscribed to everyone\'s updates!');
                            convo.next();
                        });
                    }
                },
                {
                    pattern: bot.utterances.no,
                    callback: function (res, convo) {
                        convo.say('OK');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function (res, convo) {
                        convo.say('OK');
                        convo.next();
                    }
                }
            ]);
        });
    });
};
