var channels = require('../channels');

/**
 * Sets the user up for the first time
 * @param  {Object} convo
 */
module.exports = function greeting(convo) {
    convo.addMessage('Let me guide you through how to interact with me.', channels.SETUP);
};
