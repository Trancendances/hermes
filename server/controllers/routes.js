var newsletter  = require('./newsletter'),
    lists       = require('./lists');

module.exports = {
    'newsletter/send': {
        post: newsletter.send
    },
    'lists': {
        get: lists.getLists
    }
};