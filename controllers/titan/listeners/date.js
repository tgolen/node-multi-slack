var moment = require('moment');
var tz = require('moment-timezone');
var controller = require('../index').getController();

/**
 * Show all the people gone on a specific day
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function list(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.trace(err);
        }

        convo.addMessage('Let me consult the oracle...', 'default');

        controller.storage.users.all(function(err, users) {
            if (err) {
                console.trace(err);
            }

            if (!users || !users.length) {
                convo.addMessage('No one has told me they will be gone on that day.', 'default');
                return;
            }

            var reply = '';
            var date = moment(message.match[1]);

            if (!date.isValid()) {
                convo.addMessage('No one could possibly understand a date like: ' + message.match[1] + '. I can only understand the YYYY-MM-DD format.', 'default');
                return;
            }

            // Loop through each user
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var username = user.slackUser ? user.slackUser.real_name : user.id;

                if (!user.events || !user.events.length || !user.slackUser) {
                    continue;
                }

                // Loop through each event and find one happening today
                for (var j = 0; j < user.events.length; j++) {
                    var event = user.events[j];
                    var now = moment(message.match[1]).tz(user.slackUser.tz);
                    var start = moment(event.start).tz(user.slackUser.tz);
                    var end = moment(event.end).tz(user.slackUser.tz);

                    if (now.isBetween(start, end, 'day', '[]')) {
                        reply += '*' + username + '*: ' + start.format('llll') + ' - ' + end.format('llll');
                        if (event.reason && event.reasonPrefix) {
                            reply += ' _' + event.reasonPrefix + ' ' + event.reason + '_';
                        }
                        reply += '\n';
                    }
                }
            }

            if (reply) {
                convo.addMessage(reply, 'default');
                return;
            }

            convo.addMessage('No one has told me they will be gone today.', 'default');
        });
    });
};
