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

            /**
             * Respond with a message about not being able to understand
             */
            function couldNotUnderstand() {
                convo.addMessage('You can command me by saying `add <date-time> for <length of time> at|on <reason>`. For example:\n'
                    + '`add 2017-01-01 for 1 day on vacation`\n'
                    + '`add 2017-01-01 14:30 for 1 hour at DR. Appointment`\n'
                    + '`add 2017-01-01 on holiday`\n'
                    + '`add 2017-01-01`\n'
                    + 'See http://momentjs.com/docs/#/parsing/string/ for examples for date and time formats.', channels.DEFAULT);
            }

            // Parse our dates and reasons
            var datesToAdd = message.match[1];
            var reasonPrefix;
            var messageArray;

            if (datesToAdd.search(' at ') > -1) {
                reasonPrefix = 'at';
            } else if (datesToAdd.search(' on ') > -1) {
                reasonPrefix = 'on';
            }

            if (reasonPrefix) {
                messageArray = datesToAdd.split(' ' + reasonPrefix + ' ');
            } else {
                messageArray = [datesToAdd];
            }

            var datePortion = messageArray[0];
            var reason = messageArray.length > 1 ? messageArray[1] : null;
            var datePortionArray = datePortion.split(' for ');
            var startDateString = datePortionArray[0];
            var lengthOfTimeString = datePortionArray.length > 1 ? datePortionArray[1] : null;

            var startDate = new Moment(startDateString);
            var lengthOfTimeArray = lengthOfTimeString ? lengthOfTimeString.split(' ') : null;
            var endDate = lengthOfTimeArray ? new Moment(startDate).add(lengthOfTimeArray[0], lengthOfTimeArray[1]) : startDate;

            // Validate our options
            if (!startDate.isValid()) {
                convo.addMessage('I could not understand "' + datesToAdd + '".', channels.DEFAULT);
                return couldNotUnderstand();
            }

            // Confirm to the user what we will be adding
            var confirmationMessage = 'I will remember that you will be gone on ' + startDate.format('dddd, MMMM Do YYYY, h:mm:ss a');
            if (startDate !== endDate) {
                confirmationMessage += ' for ' + startDate.from(endDate, true);
            }
            if (reason) {
                confirmationMessage += ' because you will be ' + reasonPrefix + ' ' + reason;
            }

            convo.addMessage(confirmationMessage, channels.DEFAULT);

            // Store this event in the user object
            if (!user.events) {
                user.events = [];
            }
            user.events.push({
                start: startDate.valueOf(),
                end: endDate.valueOf(),
                reason: reason,
                reasonPrefix: reasonPrefix,
            });
            controller.storage.users.save(user, function() {});
        });
    });
};
