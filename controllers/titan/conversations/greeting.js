var controller = require('../index').getController();

/**
 * Greets the user
 * @param  {Object} convo
 */
module.exports = function greeting(convo, message) {
    convo.addMessage('Grettings mortal!', 'default');

    controller.storage.users.get(message.user, function(err, user) {
        if (err) {
            console.trace(err);
        }

        // Their user hasn't been setup yet, so send them to the setup
        if (!user) {
            return convo.addQuestion('How do you fare on this fine day?', [
                {
                    pattern: new RegExp(/^(good|fine)/i),
                    callback: function (res, convo) {
                        convo.transitionTo('setup', 'I\'m glad to hear that!');
                        convo.next();
                    }
                },
                {
                    pattern: new RegExp(/^(bad|shitty|poor)/i),
                    callback: function (res, convo) {
                        convo.addMessage('I\'m sorry to hear that :slightly_frowning_face:', 'default');
                        convo.transitionTo('setup', 'Maybe this will cheer you up. :pig2:');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function (res, convo) {
                        convo.transitionTo('setup', 'I didn\'t really understand "'+res.text+'", but I hope it means that you\'re alive.');
                        convo.next();
                    }
                }
            ], {}, 'default');
        }

        // Tell them their options
        convo.addMessage('Commands that I don\'t ignore: `help`, `reset`, `list`, `today`, `view`, `add`, `remove`, `hi`', 'default');
    });
};
