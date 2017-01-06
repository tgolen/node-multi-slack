/**
 * Reponds with a private message when someone says "hi"
 * @param  {Object} bot
 * @param  {Object} message
 */
module.exports = function hi(bot, message) {
    bot.startPrivateConversation(message, function(err, convo) {
        convo.say('Every day, you should tell me what your plan is for the day. Just a few brief sentances is fine. I will post your update to the #10am channel so that others know what you\'re plans are for the day.\n'
            + 'I will also send your update to everyone as a private message.\n\n'
            + 'I respond to the following requests:\n'
            + '`help` - view these instructions again\n'
            + '`snooze @person` - I will stop sending your private messages for that person\'s updates\n'
            + '`subscribe @person` - I will resume sending your private messages for that person\'s updates\n'
            + '`list` - I will show you everyone that you are snoozing\n'
            + '`show @person` - I will show you that person\'s update for today');
    });
};
