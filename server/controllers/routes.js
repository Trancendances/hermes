var newsletter  = require('./newsletter'),
    index       = require('./index');

module.exports = {
    '': {
        get: index.index
    },
    'newsletter/send': {
        post: newsletter.send
    }
};