var Moment = require('moment');
var channels = require('../channels');
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

        convo.addMessage('Let me consult the oracle...', channels.DEFAULT);

        controller.storage.users.all(function(err, users) {
            if (err) {
                console.error(err);
            }

            if (!users || !users.length) {
                convo.addMessage('No one has told me they will be gone today.', channels.DEFAULT);
                return;
            }

            var message = '';
            var now = new Moment();

            // Loop through each user
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                var username = user.slackUser ? user.slackUser.real_name : user.id;

                if (!user.events || !user.events.length) {
                    continue;
                }

                // Loop through each event and find one happening today
                for (var j = 0; j < user.events.length; j++) {
                    var event = user.events[j];
                    var start = new Moment(event.start);
                    var end = new Moment(event.end);

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
                convo.addMessage(message, channels.DEFAULT);
                return;
            }

            convo.addMessage('No one has told me they will be gone today.', channels.DEFAULT);
        });
    });
};
