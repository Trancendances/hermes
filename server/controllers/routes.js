var newsletter  = require('./newsletter'),
    lists       = require('./lists');

module.exports = {
    'newsletter/send': {
        post:   newsletter.send
    },
    'lists': {
        get:    lists.getLists,
        post:   lists.addList
    },
    'lists/:name': {
        put:    lists.updateList,
        delete: lists.removeList
    }
};