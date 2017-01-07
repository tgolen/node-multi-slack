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

            // They need to have a slack profile
            if (!user.slackUser) {
                continue;
            }

            var usersNow = moment().tz(user.slackUser.tz);
            var dayOfTheWeek = usersNow.format('dd');

            // Don't do any nagging on the weekend
            if (dayOfTheWeek === 'Su' || dayOfTheWeek === 'Sa') {
                console.log('[HEMERA] No nagging on the weekends');
                continue;
            }

            // Don't do any nagging when they are OOO
            if (user.events && user.events.length) {
                var userIsOOO = false;
                for (var j = 0; j < user.events.length; j++) {
                    var event = user.events[j];
                    var start = moment(event.start).tz(user.slackUser.tz);
                    var end = moment(event.end).tz(user.slackUser.tz);
                    if (dayOfTheWeek.isBetween(start, end, 'day', '[]')) {
                        userIsOOO = true;
                    }
                }
                if (userIsOOO) {
                    console.log('[HEMERA] No nagging while the user is out of the office');
                    continue;
                }
            }

            var lastUpdatedTime = user.lastUpdated_at ? moment(lastUpdated_at).tz(user.slackUser.tz) : null;
            var timeLastNagged = user.lastNag_at ? moment(user.lastNag_at).tz(user.slackUser.tz) : null;
            var daysSinceLastUpdated = lastUpdatedTime ? usersNow.diff(lastUpdatedTime, 'days') : null;
            var daysSinceNagged = timeLastNagged && usersNow.diff(timeLastNagged, 'days') : null;

            console.log('[HEMERA] COMMENCE NAGGING ------', user.slackUser.name);
            !lastUpdatedTime && console.log('[HEMERA] user has never sent an update');
            lastUpdatedTime && console.log('[HEMERA] their last update was %d days ago', daysSinceLastUpdated);
            console.log('[HEMERA] Right now, its %s for them', usersNow.format('ha z'));

            // Either they haven't sent an update yet, or it's been more than a day since their last update
            if (!lastUpdatedTime || daysSinceLastUpdated > 0) {
                // They haven't sent an update yet, so see if it's after 11AM (give them an extra hour)
                if (usersNow.format('H') > 11) {
                    console.log('[HEMERA] %s', timeLastNagged ? 'I last nagged them ' + daysSinceNagged + ' days ago' : 'I haven\'t nagged them yet.');

                    // If we have never nagged them, or it's been more than a day, then we will nag them
                    if (!timeLastNagged || daysSinceNagged > 0) {
                        console.log('[HEMERA] I am nagging them now because its past 11AM for them and I have\'nt nagged them yet.');

                        // Send nag
                        bot.startPrivateConversation({user: user.id}, function(err, convo) {
                            if (err) {
                                return console.error(err);
                            }

                            convo.say('Oh goodness, you haven\'t sent your 10AM update today! Why don\'t you do that right now with `/10am`?');

                            // Save the last time we nagged them
                            user.lastNag_at = new Date();
                            controller.storage.users.save(user, function() {});
                        });
                    } else {
                        console.log('[HEMERA] I have already nagged them today');
                    }
                }
            }
        }
    });
};
