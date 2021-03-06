var moment = require('moment');
var tz = require('moment-timezone');
var async = require('async');
var hemera = require('./index');
var whitelist = require('../utils/10amwhitelist');

/**
 * Nag all our users once an our to see if they need to send an update
 */
module.exports = function nag() {
    var controller = hemera.getController();
    var bot = hemera.getBot();

    controller.storage.users.all(function(err, users) {
        if (err) {
            return console.trace(err);
        }

        async.eachSeries(users, function (user, done) {

            // They need to have a slack profile and they can't be a bot
            // and they must be in the whitelist
            if (!user.slackUser || user.slackUser.is_bot || whitelist.indexOf(user.slackUser.name) === -1) {
                return done();
            }

            var tz = user.slackUser.tz || undefined;
            var usersNow = tz ? moment().tz(tz) : moment();
            var dayOfTheWeek = usersNow.format('dd');

            // Don't do any nagging on the weekend
            if (dayOfTheWeek === 'Su' || dayOfTheWeek === 'Sa') {
                console.log('[HEMERA] No nagging on the weekends');
                return done();
            }

            // Don't do any nagging when they are OOO
            if (user.events && user.events.length) {
                var userIsOOO = false;
                for (var j = 0; j < user.events.length; j++) {
                    var event = user.events[j];
                    var start = moment(event.start).tz(tz);
                    var end = moment(event.end).tz(tz);
                    if (usersNow.isBetween(start, end, 'day', '[]')) {
                        userIsOOO = true;
                    }
                }
                if (userIsOOO) {
                    console.log('[HEMERA] No nagging while the user is out of the office');
                    return done();
                }
            }

            var lastUpdatedTime = user.lastUpdated_at ? moment(lastUpdated_at).tz(tz) : null;
            var timeLastNagged = user.lastNag_at ? moment(user.lastNag_at).tz(tz) : null;
            var daysSinceLastUpdated = lastUpdatedTime ? usersNow.diff(lastUpdatedTime, 'days') : null;
            var daysSinceNagged = timeLastNagged ? usersNow.diff(timeLastNagged, 'days') : null;

            console.log('[HEMERA] COMMENCE NAGGING ------', user.slackUser.name);
            !lastUpdatedTime && console.log('[HEMERA] user has never sent an update');
            lastUpdatedTime && console.log('[HEMERA] their last update was %d days ago', daysSinceLastUpdated);
            console.log('[HEMERA] Right now, its %s for them', usersNow.format('ha z'));

            // Either they haven't sent an update yet, or it's been more than a day since their last update
            if (!lastUpdatedTime || daysSinceLastUpdated > 0) {
                // They haven't sent an update yet, so see if it's after 11AM (give them an extra hour)
                if (usersNow.format('H') >= 11) {
                    console.log('[HEMERA] %s', timeLastNagged ? 'I last nagged them ' + daysSinceNagged + ' days ago' : 'I haven\'t nagged them yet.');

                    // If we have never nagged them, or it's been more than a day, then we will nag them
                    if (!timeLastNagged || daysSinceNagged > 0) {
                        console.log('[HEMERA] I am nagging %s now because its past 11AM for them and I haven\'t nagged them yet.', user.slackUser.name);

                        // Send nag
                        bot.startPrivateConversation({user: user.id}, function(err, convo) {
                            if (err) {
                                console.trace(err);
                                return done();
                            }

                            convo.say('Oh goodness, you haven\'t sent your 10AM update today! Why don\'t you do that right now with `/10am`?');

                            // Save the last time we nagged them
                            user.lastNag_at = new Date();
                            controller.storage.users.save(user, function(err) {
                                if (err) {
                                    console.trace(err);
                                    return done();
                                }
                                console.log('[HEMERA] db update for lastNag_at for %s was successful', user.slackUser.name);
                                done();
                            });
                        });
                    } else {
                        console.log('[HEMERA] I have already nagged them today');
                        done();
                    }
                }
            }
        });
    });
};
