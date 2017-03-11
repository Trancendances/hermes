const subscribers	= require('../lib/utils/subscribers');
const lists			= require('../lib/utils/lists');
const helpers		= require('../lib/utils/helpers');
const printit		= require('printit');
const log			= printit({
	prefix: 'Controllers::Subscribers',
	date: true
});


// Returns an array containing all of the addresses subscribed to a given list
module.exports.get = function (req, res, next) {
	subscribers.get(req.params.name, function (err, subscribers) {
		if (err) return helpers.logError(err, log, res);
		res.status(200).send(subscribers); // Send dem subz
	});
};


// Adds a subscriber to a given list
module.exports.add = function (req, res, next) {
	subscribers.add(req.params.name, req.body.address, function (err) {
		if (err) return helpers.logError(err, log, res);
		res.status(200).send(req.body.address);
	});
};


// Update a subscriber's address
module.exports.update = function (req, res, next) {
	subscribers.update(req.params.name, req.params.address, req.body.address, function (err) {
		if (err) return helpers.logError(err, log, res);
		res.sendStatus(200);
	});
};


// Removes an address's subscription
module.exports.remove = function (req, res, next) {
	subscribers.remove(req.params.name, req.params.address, function (err) {
		if (err) return helpers.logError(err, log, res);
		res.sendStatus(200);
	});
};