var moment = require('moment');
var tz = require('moment-timezone');
var hemera = require('./index');

/**
 * Nag all our users once an our to see if they need to send an update
 */
module.exports = function nag() {
    var controller = hemera.getController();
    var bot = hemera.getBot();

    controller.storage.users.all(function(err, users) {
        if (err) {
            return console.error(err);
        }

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var usersNow = moment().tz(user.slackUser.tz);

            if (!user.slackUser) {
                continue;
            }

            console.log('[10am] COMMENCE NAGGING ------', user.slackUser.name);
            !user.lastUpdate_at && console.log('[10am] user has never sent an update');
            user.lastUpdate_at && console.log('[10am] their last update was %d days ago', usersNow.diff(moment(user.lastUpdate_at).tz(user.slackUser.tz), 'days'));

            if (!user.lastUpdate_at || usersNow.diff(moment(user.lastUpdate_at).tz(user.slackUser.tz), 'days') > 0) {
                console.log('[10am] Right now, its %s for them', usersNow.format('ha z'));

                // They haven't sent an update yet, so see if it's after 11 (give them an extra hour) in their timezone
                if (usersNow.format('H') > 11) {
                    var timeLastNagged = user.lastNag_at ? moment(user.lastNag_at).tz(user.slackUser.tz) : null;
                    console.log('[10am] The last time I nagged them was %s', timeLastNagged ? timeLastNagged.format('llll') : 'never');

                    // If we have never nagged them, or it's been more than a day, then we will nag them
                    if (!timeLastNagged || usersNow.diff(timeLastNagged, 'days') > 0) {
                        console.log('[10am] I am nagging them now because its past 10:00 for them and I have\'nt nagged them yet.');

                        // Send nag
                        bot.startPrivateConversation({user: user.id}, function(err, convo) {
                            if (err) {
                                return console.error(err);
                            }

                            convo.say('Oh goodness, you haven\'t sent an update today! Why don\'t you do that right now with `/10am`?');

                            // Save the last time we nagged them
                            user.lastNag_at = new Date();
                            controller.storage.users.save(user, function() {});
                        });
                    } else {
                        console.log('[10am] I have already nagged them today');
                    }
                }
            }
        }
    });
};
