var Moment = require('moment');
var channels = require('../channels');
var controller = require('../index').getController();

/**
 * Lits all of the OOO events a user has set
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function list(bot, message) {
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
                convo.transitionTo(channels.SETUP, 'I don\'t know you, let me introduce myself.');
                return;
            }

            if (!user.events || !user.events.length) {
                convo.addMessage('You have not set up any out of the office times.', channels.DEFAULT);
                return;
            } else {
                var message = '';
                for (var i = 0; i < user.events.length; i++) {
                    var start = new Moment(user.events[i].start);
                    var end = new Moment(user.events[i].end);
                    message += '`' + i + '` ' + start.format('dddd, MMMM Do YYYY, h:mm:ss a') + ' - ' + end.format('dddd, MMMM Do YYYY, h:mm:ss a');
                    if (user.events[i].reason && user.events[i].reasonPrefix) {
                        message += ' ' + user.events[i].reasonPrefix + ' ' + user.events[i].reason;
                    }
                    message += '\n';
                }
                convo.addMessage(message, channels.DEFAULT);
            }
        });
    });
};
