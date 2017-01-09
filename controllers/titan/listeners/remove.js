var controller = require('../index').getController();

/**
 * Removes an event from their OOO calendar
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function remove(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.trace(err);
        }

        // Make sure we have a user first
        controller.storage.users.get(message.user, function(err, user) {
            if (err) {
                console.trace(err);
            }
            if (!user) {
                convo.transitionTo('setup', 'I don\'t know you, let me introduce myself.');
                return;
            }
            if (!user.events || !user.events.length) {
                convo.addMessage('You have not added any events. Try adding one first.', 'default');
                return;
            }

            // Parse our dates and reasons
            var eventID = new Number(message.match[1]);

            if (!user.events[eventID]) {
                return convo.addMessage('I could not find the event with ID `' + message.match[1] + '`. Try using an event ID from `list`.', 'default');
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
            convo.addMessage('I have removed that event.', 'default');
        });
    });
};
