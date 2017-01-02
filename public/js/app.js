var allUsers = [];

/**
 * Gets all of the dates for a user and puts them into our data object
 * @param  {Object} user
 * @param  {Object} data
 */
function mixinDataForUser(user, data) {
    if (user.events && user.events.length) {
        for (var i = 0; i < user.events.length; i++) {
            var start = new moment(user.events[i].start);
            var end = new moment(user.events[i].end);

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
                    var recurringDay = moment(start).add(j + 1, 'day');

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
                if (moment(date).isBetween(moment(event.start), moment(event.end), 'day', '[]')) {
                    usersGone[user.id] = user;
                }
            }
        }
    }

    var $results = $('#cal-day-results');
    var $resultCollection = $('<ul class="collection">');

    $.each(usersGone, function(userId, user) {
        $resultCollection.append('<li class="collection-item">'+user.id+'</li>');
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
