const lists		= require('../lib/utils/lists');
const helpers	= require('../lib/utils/helpers');
const printit 	= require('printit');
const log 		= printit({
	prefix: 'Controllers::Lists',
	date: true
});

// Returns an array containing all the lists registered in the database
module.exports.get = function (req, res, next) {
	lists.get(function (err, lists) {
		if(err) return helpers.logError(err, log, res);
		res.status(200).send(lists);
	});
};


// Adds a list to the database
module.exports.add = function (req, res, next) {
	lists.add(req.body.name, function (err) {
		if(err) return helpers.logError(err, log, res);
		res.status(200).send(req.body.name);
	});
};


// Updates a list's name in the database
module.exports.update = function (req, res, next) {
	lists.update(req.params.name, req.body.name, function (err) {
		if(err) return helpers.logError(err, log, res);
		res.sendStatus(200);
	});
};


// Removes a list from the database
module.exports.remove = function (req, res, next) {
	lists.remove(req.params.name, function (err) {
		if(err) return helpers.logError(err, log, res);
		res.sendStatus(200);
	});
};