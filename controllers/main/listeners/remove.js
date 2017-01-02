var Moment = require('moment');
var channels = require('../channels');
var controller = require('../index').getController();

/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function add(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

        // Make sure we have a user first
        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.error(err);
            }
            if (!user) {
                convo.transitionTo(channels.SETUP, 'I don\'t know you, let me introduce myself.');
                return;
            }
            if (!user.events || !user.events.length) {
                convo.addMessage('You have not added any events. Try adding one first.', channels.DEFAULT);
                return;
            }

            // Parse our dates and reasons
            var eventID = new Number(message.match[1]);

            if (!user.events[eventID]) {
                return convo.addMessage('I could not find the event with ID `' + message.match[1] + '`. Try using an event ID from `list`.', channels.DEFAULT);
            }

            // Store this event in the user object
            var newEvents = [];
            for (var i = 0; i < user.events.length; i++) {
                if (i != eventID) {
                    newEvents.push(user.events[i]);
                }
            }
            user.events = newEvents;
            controller.storage.users.save(user, function() {});
            convo.addMessage('I have removed that event.', channels.DEFAULT);
        });
    });
};
