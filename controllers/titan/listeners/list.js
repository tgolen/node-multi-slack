var moment = require('moment');
var tz = require('moment-timezone');
var controller = require('../index').getController();

/**
 * Lits all of the OOO events a user has set
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function list(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.trace(err);
        }

        convo.addMessage('This is when you will be out of the office:', 'default');

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.trace(err);
            }

            if (!user || !user.slackUser) {
                convo.transitionTo('setup', 'I don\'t know you, let me introduce myself.');
                return;
            }

            if (!user.events || !user.events.length) {
                convo.addMessage('You have not set up any out of the office times.', 'default');
                return;
            }

            var message = '';
            for (var i = 0; i < user.events.length; i++) {
                var start = moment(user.events[i].start).tz(user.slackUser.tz);
                var end = moment(user.events[i].end).tz(user.slackUser.tz);
                message += '`' + i + '` *' + start.format('llll') + ' - ' + end.format('llll') + '*';
                if (user.events[i].reason && user.events[i].reasonPrefix) {
                    message += ' _' + user.events[i].reasonPrefix + ' ' + user.events[i].reason + '_';
                }
                message += '\n';
            }
            convo.addMessage(message, 'default');
        });
    });
};
