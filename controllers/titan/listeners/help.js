var channels = require('../channels');
var controller = require('../index').getController();

/**
 * Resets all the settings for a user
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function reset(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        if (err) {
            return console.error(err);
        }

    convo.addMessage('You can *add* events with `add <date-time> for <length of time> at|on <reason>`. For example:\n'
+ '`add 2017-01-01 for 1 day on vacation`\n'
+ '`add 2017-01-01 14:30 for 1 hour at DR. Appointment`\n'
+ '`add 2017-01-01 on holiday`\n'
+ '`add 2017-01-01`\n'
+ 'See http://momentjs.com/docs/#/parsing/string/ for examples for date and time formats.\n\n'
+ '`list` - view all your events\n\n'
+ '`today` - see everyone who is gone today\n\n'
+ '`view 2017-01-07` - see everyone who is gone on a specific day\n\n'
//+ 'You can *view* a graph of your events with `view`\n\n'
+ '`remove <event_id` - Remove and event (get the event ID from `list`)', channels.DEFAULT);
    });
};
