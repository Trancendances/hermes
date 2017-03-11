const Connection	= require('../db/factory');
const constants		= require('./const');
const helpers		= require('./helpers');
const lists			= require('./lists');
const ParamError	= require('../errors/paramerror');

// Setting the dataType once
const dataType = 'subscribers';
	
// This module needs to do requests to the database, so we initialise it
// and open the connection.
var db = Connection.getConnection();

db.connect();

// Request all subscribers in a list
// name: Name of the list to get subscribers from
// next(err, data): Callback function (data being the list's subscribers)
module.exports.get = function (list, next) {
	lists.exist(list, function (err, exists) {
		if (err) return next(err);
		if (!exists) {
			return next(new ReferenceError(constants.errors.LISTNOEXISTS));
		}
		// If the list exists, get its subscribers
		db.get(dataType, {conditions: [{lo: 'list', cmp: '=', ro: list}]}, next);
	});
};


// Creates a mailing list in the database with a given name
// name: The new mailing list's name
// next(err): Callback function
module.exports.add = function (list, address, next) {
	// Both the list name and subscriber address must be a non-empty string
	let e = helpers.checkStringParam(constants.param.list.NAME, list)
	|| helpers.checkStringParam(constants.param.sub.ADDR, address);
	// If one of the parameter isn't a non-empty string, stop the registration
	if(e) return next(e);

	// Check if there isn't already a subscriber with this address in this list
	doesSubExist(list, address, function(err, exists) {
		if(err) return next(err);
		if(!exists) {
			lists.exist(list, function (err, exists) { // Check if the list exists
				if(!exists) {
					let e = new ReferenceError(constants.errors.LISTNOEXISTS);
					return next(e);
				}
				// Registering the subscriber
				db.add(dataType, {
					address: address,
					list: list
				}, next);
			});
		} else {
			next(new Error(constants.errors.SUBEXISTS));
		}
	});
};


// Changes a list's name from its old name to a given new one
// newName: New name to give to the list
// oldName: The list's name before the change. This allows to
//			identify the list in the database.
// next(err): Callback function
module.exports.update = function (list, oldAddress, newAddress, next) {
	// Both the list name and subscriber old and new address must be a 
	// non-empty string
	let e = helpers.checkStringParam(constants.param.list.NAME, list)
	|| helpers.checkStringParam(constants.param.sub.ADDR, oldAddress)
	|| helpers.checkStringParam(constants.param.sub.NEW_ADDR, newAddress);
	// If one of the parameter isn't a non-empty string, stop the update
	if(e) return next(e);
	// Check if the subscriber to update exists
	doesSubExist(list, oldAddress, function (err, exists) {
		if(err) return next(err);
		if(!exists) {
			return next(new ReferenceError(constants.errors.SUBNOEXISTS));
		}
		// Proceeds to the update if all parameters are good to go
		db.update(dataType, {
			address: oldAddress,
			list: list
		}, {address: newAddress}, next);
	});
};


// Remove a given list from the database
// name: Name of the list to be removed from the database
// next(err): Callback function
module.exports.remove = function (list, address, next) {
	// Both the list name and subscriber address must be a non-empty string
	let e = helpers.checkStringParam(constants.param.list.NAME, list)
	|| helpers.checkStringParam(constants.param.sub.ADDR, address);
	// If one of the parameter isn't a non-empty string, stop the registration
	if(e) return next(e);
	// Check if the subscriber to remove exists
	doesSubExist(list, address, function (err, exists) {
		if(err) return next(err);
		if(!exists) {
			return next(new ReferenceError(constants.errors.SUBNOEXISTS));
		}
		// If the subscriber exists, remove it
		db.delete(dataType, {address: address, list: list}, next);
	});
};


// Checks if an e-mail has already subscribed to a given linse
// list: List name (non-empty string)
// address: Subscriber's address (non-empty string)
// next(err, exists): Callback function (exists is a boolean)
function doesSubExist (list, address, next) {
	// Check if parameters are non-empty strings
	let e = helpers.checkStringParam(constants.param.list.NAME, list)
	|| helpers.checkStringParam(constants.param.sub.ADDR, address);
	// Abort if a parameter is incorrect
	if(e) {
		return next(e);
	}

	db.count(dataType, {
		conditions: [
			{lo: 'list', cmp: '=', ro: list},
			{lo: 'address', cmp: '=', ro: address}
		]
	}, function(err, data) {
		if(err) return next(err);
		return next(null, !!data); // Data will value 0 if no sub with this name
	});
}

// We export this function separately because we need it both inside and outside
// of this file
module.exports.exist = doesSubExist;