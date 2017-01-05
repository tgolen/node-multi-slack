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

        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
            }

            if (!user) {
                convo.transitionTo(channels.SETUP, 'I don\'t know you, let me introduce myself.');
                return;
            }

            var url = process.env.NODE_ENV === 'production'
                ? 'https://' + process.env.HOST
                : 'http://' + process.env.HOST + ':' + process.env.PORT;
            url += '/' + user.id + '/events';

            convo.addMessage('Direct your gaze towards ' + url, channels.DEFAULT);
        });
    });
};
