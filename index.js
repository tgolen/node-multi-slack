var express = require('express');
var mainController = require('./controllers/main');

if (!process.env.SLACKBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

mainController.start();

var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Titan'
    });
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});
