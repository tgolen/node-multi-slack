module.exports = function (req, res) {
    if (req.body.token !== process.env.SLASHCOMMAND_10AM_TOKEN) {
        return res.status(403).send();
    }
    res.send('hi');
};
