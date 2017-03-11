const mails			= require('./mails');
const lists			= require('./lists');
const subscribers	= require('./subscribers');

module.exports = {
	// Mails
	'mail': {
		get:	mails.check,
	    post:   mails.send
	},
	
	// Lists
	'lists': {
	    get:    lists.get,
	    post:   lists.add
	},
	'lists/:name': {
	    get:    subscribers.get,
	    post:   subscribers.add,
	    put:    lists.update,
	    delete: lists.remove
	},
	
	// Subscribers
	'lists/:name/subscribers/:address': {
	    put:    subscribers.update,
	    delete: subscribers.remove
	}
};