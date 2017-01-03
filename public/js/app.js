var allUsers = [];

/**
 * Gets all of the dates for a user and puts them into our data object
 * @param  {Object} user
 * @param  {Object} data
 */
function mixinDataForUser(user, data) {
    if (user.events && user.events.length) {
        for (var i = 0; i < user.events.length; i++) {
            var start = moment.utc(user.events[i].start);
            var end = moment.utc(user.events[i].end);

            // Add all of our start days
            if (!data[start.unix()]) {
                data[start.unix()] = 1;
            } else {
                data[start.unix()] += 1;
            }

            // Add all the subsequent days
            if (user.events[i].start !== user.events[i].end) {
                var diffInDays = end.diff(start, 'days');
                for (var j = 0; j < diffInDays; j++) {
                    var recurringDay = moment.utc(start).add(j + 1, 'day');

                    if (!data[recurringDay.unix()]) {
                        data[recurringDay.unix()] = 1;
                    } else {
                        data[recurringDay.unix()] += 1;
                    }
                }
            }
        }
    }
}

/**
 * Displays a list of users who are gone on a specific day
 * @param  {String} date
 */
function displaySelectedDate(date) {
    var usersGone = {};

    // Loop through every user
    for (var i = 0; i < allUsers.length; i++) {
        var user = allUsers[i];
        if (user.events && user.events.length) {
            // Loop through every event
            for (var j = 0; j < user.events.length; j++) {
                var event = user.events[j];
                if (moment.utc(date).isBetween(moment.utc(event.start), moment.utc(event.end), 'day', '[]')) {
                    if (!usersGone[user.id]) {
                        usersGone[user.id] = user;
                        usersGone[user.id].matchedEvents = [];
                    }
                    usersGone[user.id].matchedEvents.push(event);
                }
            }
        }
    }

    var $results = $('#cal-day-results');
    var $resultCollection = $('<ul class="collection">');

    $.each(usersGone, function(userId, user) {
        var $item = $('<li class="collection-item avatar">');
        if (user.slackUser) {
            if (user.slackUser.profile.image_72) {
                $item.append('<img src="'+user.slackUser.profile.image_72+'" alt="" class="circle">');
            }
            $item.append('<span class="title">'+user.slackUser.real_name+'</span>');
        }
        $.each(user.matchedEvents, function(i, event) {
            var $event = $('<p>');
            var start = moment.utc(event.start);
            var end = moment.utc(event.end);

            if (end.diff(start, 'days') > 0) {
                $event.append(' All day');
            } else {
                $event.append(' ' + start.format('h:mma') + ' - ' + end.format('h:mma'));
            }
            if (event.reasonPrefix && event.reason) {
                $event.append(' ' + event.reasonPrefix + ' ' + event.reason);
            }
            $item.append($event);
        });
        $resultCollection.append($item);
    });

    $results.html($resultCollection);
}

$(function() {
    var cal = new CalHeatMap();
    var data = {};

    // Get the data for our users
    if (window.USER) {
        allUsers.push(window.USER);
    } else if (window.USERS) {
        allUsers = window.USERS;
    }

    for (var i = 0; i < allUsers.length; i++) {
        mixinDataForUser(allUsers[i], data);
        mixinDataForUser(allUsers[i], data);
    }

    // Initialize our calendar
    cal.init({
        domain: 'month',
        data: data,
        onClick: displaySelectedDate,
    });
});
