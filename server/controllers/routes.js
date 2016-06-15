var newsletter  = require('./newsletter');

module.exports = {
    'newsletter/send': {
        post: newsletter.send
    }
};