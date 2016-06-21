var newsletter  = require('./newsletter'),
    lists       = require('./lists'),
    subscribers = require('./subscribers');

module.exports = {
    'newsletter/send': {
        post:   newsletter.send
    },
    
    // Lists
    'lists': {
        get:    lists.getLists,
        post:   lists.addList
    },
    'lists/:name': {
        get:    lists.getList,
        put:    lists.updateList,
        delete: lists.removeList
    },
    
    // Subscribers
    'subscribers': {
        get:    subscribers.getSubscribers,
        post:   subscribers.addSubscriber
    },
    'subscribers/:address': {
        put:    subscribers.updateSubscriber,
        delete: subscribers.removeSubscriber
    }
};