var moment = require('moment');
var tz = require('moment-timezone');
var controller = require('../index').getController();

/**
 * Show everyone who is gone today
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function list(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        convo.addMessage('Let me consult the oracle...', 'default');

        controller.storage.users.all(function(err, users) {
            if (err) {
                console.error(err);
            }

            if (!users || !users.length) {
                convo.addMessage('No one has told me they will be gone today.', 'default');
                return;
            }

            var message = '';

            // Loop through each user
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var username = user.slackUser ? user.slackUser.real_name : user.id;

                if (!user.events || !user.events.length || !user.slackUser) {
                    continue;
                }

                var now = moment().tz(user.slackUser.tz);

                // Loop through each event and find one happening today
                for (var j = 0; j < user.events.length; j++) {
                    var event = user.events[j];
                    var start = moment(event.start).tz(user.slackUser.tz);
                    var end = moment(event.end).tz(user.slackUser.tz);

                    if (now.isBetween(start, end, 'day', '[]')) {
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

            convo.addMessage('No one has told me they will be gone today.', 'default');
        });
    });
};
