var moment = require('moment');
var tz = require('moment-timezone');
var controller = require('../index').getController();

/**
 * Show everyone who is gone right now
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function list(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
            }

            if (!user || !user.slackUser) {
                convo.transitionTo('setup', 'I don\'t know you, let me introduce myself.');
                return;
            }

            convo.addMessage('Let me consult the oracle...', 'default');
            var now = moment().tz(user.slackUser.tz);

            controller.storage.users.all(function(err, users) {
                if (err) {
                    console.error(err);
                }

                if (!users || !users.length) {
                    convo.addMessage('No one has told me they will be gone right now.', 'default');
                    return;
                }

                var message = '';

                // Loop through each user
                for (var i = 0; i < users.length; i++) {
                    var otherUser = users[i];
                    var username = otherUser.slackUser ? otherUser.slackUser.real_name : otherUser.id;

                    if (!otherUser.events || !otherUser.events.length || !otherUser.slackUser) {
                        continue;
                    }

                    // Loop through each event and find one happening today
                    for (var j = 0; j < otherUser.events.length; j++) {
                        var event = otherUser.events[j];
                        var start = moment(event.start).tz(user.slackUser.tz);
                        var end = moment(event.end).tz(user.slackUser.tz);

                        if (now.isBetween(start, end, 'minute', '[]')) {
                            message += '*' + username + '*: ' + start.format('llll') + ' - ' + end.format('llll');
                            if (event.reason && event.reasonPrefix) {
                                message += ' _' + event.reasonPrefix + ' ' + event.reason + '_';
                            }
                            message += '\n';
                        }
                    }
                }

                if (message) {
                    convo.addMessage(message, 'default');
                    return;
                }

                convo.addMessage('No one has told me they will be gone right now.', 'default');
            });
        });
    });
};
