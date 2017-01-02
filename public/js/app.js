/**
 * Gets all of the dates for a user and puts them into our data object
 * @param  {Object} user
 * @param  {Object} data
 */
function mixinDataForUser(user, data) {
    if (USER.events && USER.events.length) {
        for (var i = 0; i < USER.events.length; i++) {
            var start = new moment(USER.events[i].start);
            var end = new moment(USER.events[i].end);

            // Start dates get a high value so they are dark
            if (!data[start.unix()]) {
                data[start.unix()] = 100;
            } else {
                data[start.unix()] += 100;
            }

            // Subsequent days for that range get a small value
            if (USER.events[i].start !== USER.events[i].end) {
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
};

$(function() {
    var cal = new CalHeatMap();
    var data = {};

    // Get the data for our users
    if (window.USER) {
        mixinDataForUser(window.USER, data);
    } else if (window.USERS) {
        for (var i = 0; i < window.USERS.length; i++) {
            mixinDataForUser(window.USERS[i], data);
        }
    }

    // Initialize our calendar
    cal.init({
        domain: 'month',
        data: data,
    });
});
