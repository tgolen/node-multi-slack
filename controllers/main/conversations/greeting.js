var channels = require('../channels');

/**
 * Greets the user
 * @param  {Object} convo
 */
module.exports = function greeting(convo) {
    convo.addMessage('Grettings mortal!', channels.DEFAULT);
    convo.addQuestion('How do you fair on this fine day?', [
        {
            pattern: new RegExp(/^(good|fine)/i),
            callback: function (res, convo) {
                convo.addMessage('I\'m glad to hear that!', channels.DEFAULT);
                convo.changeTopic(channels.SETUP);
                convo.next();
            }
        },
        {
            pattern: new RegExp(/^(bad|shitty|poor)/i),
            callback: function (res, convo) {
                convo.addMessage('I\'m sorry to hear that :slightly_frowning_face:', channels.DEFAULT);
                convo.addMessage('Maybe this will cheer you up. :pig2:', channels.DEFAULT);
                convo.addMessage('I just love bacon.', channels.DEFAULT);
                convo.changeTopic(channels.SETUP);
                convo.next();
            }
        },
        {
            default: true,
            callback: function (res, convo) {
                convo.transitionTo(channels.SETUP, 'I didn\'t really understand "'+res.text+'", but I hope it means that you\'re alive.');
                convo.next();
            }
        }
    ], {}, channels.DEFAULT);
};
