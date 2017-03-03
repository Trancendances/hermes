var Subscribers = require('../models/subscribers.js'),
	Lists       = require('../models/lists.js'),
	printit     = require('printit');

var log = printit({
	prefix: 'subscribers',
	date: true
});


// Log an error and sends it in the HTTP response.
// error: An Error object representing the error
// res: Express's response object
function logError(error, res) {
	// If not an error object, make it one
	if(typeof error === 'string') {
	    error = new Error(error);
	}
	res.status(500).send({err: error.message});
	log.error(error.message);
	if(process.env.NODE_ENV !== 'test')
	    console.log(error.stack);
}


// Returns an array containing all the subscribers registered in the database
module.exports.getSubscribers = function (req, res, next) {    
	Subscribers.getSubscribers(function(err, subscribers) {
	    if(err) {
	        return logError(err, res);
	    }
	    res.status(200).send(subscribers);
	});
}


// Adds a subscriber to the database
module.exports.addSubscriber = function (req, res, next) {
	// Check required fields
	let message = '';
	if(!req.body.list)
	    message += 'List missing. ';
	if(!req.body.address)
	    message += 'Name missing.'
	if(message)
	    return logError(message, res)
	
	return Lists.getLists(function(err, lists) {
	    for(let list of lists) {
	        if(list.name === req.body.list) {
	            Subscribers.addSubscriber(req.body.list, req.body.address
	                                                        , function(err) {
	                if(err)
	                    return logError(err, res);
	                
	                res.sendStatus(200);
	            }); 
	            return;
	        }
	    }
	    logError('List doesn\'t exist.', res)
	});
}


// Updates a subscriber's name. In this process, we need two names, as does
// the used static method, unlike the addition or deletion. This one
// gets its own function, but the process is very similar.
module.exports.updateSubscriber = function (req, res, next) {
	// Check required fields
	let message = '';
	if(!req.body.address)
	    message += 'Name missing.'
	if(message)
	    return logError(message, res)
	
	Subscribers.updateSubscriber(req.body.list, req.body.address, 
	                                      req.params.address, function(err) {
	    if(err)
	        return logError(err, res);
	    
	    res.sendStatus(200);
	});
}


// Remove a subscriber from the database
module.exports.removeSubscriber = function (req, res, next) {
	Subscribers.removeSubscriber(req.params.address, function(err) {
	    if(err)
	        return logError(err, res);
	    
	    res.sendStatus(200);
	});
}