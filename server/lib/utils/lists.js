const Connection	= require('../db/factory');
const constants		= require('./const');
const helpers		= require('./helpers');
const ParamError	= require('../errors/paramerror');

// Setting the dataType once
const dataType = 'lists';

// This module needs to do requests to the database, so we initialise it
// and open the connection.
var db = Connection.getConnection();

db.connect();

// Requests all the mailing lists from the database and passes them
// to the controller using the callback
// next(err, data): Callback function (data being the list of lists)
module.exports.get = function (next) {
	db.get(dataType, {}, next);
};


// Creates a mailing list in the database with a given name
// name: The new mailing list's name
// next(err): Callback function
module.exports.add = function (name, next) {
	// Checking if the list name is a non-empty string
	let e = helpers.checkStringParam(constants.param.list.NAME, name);
	if(e) {
		return next(e);
	}

	doesListExist(name, function(err, exists) {
		if(err) return next(err);
		// We check if the list already exists before creating it
		if(!exists) db.add(dataType, {name: name}, next);
		else next(new Error(constants.errors.LISTEXISTS));
	});
};


// Changes a list's name from its old name to a given new one
// newName: New name to give to the list
// oldName: The list's name before the change. This allows to
//          identify the list in the database.
// next(err): Callback function
module.exports.update = function (oldName, newName, next) {
	// Checking if the list's old and new name are non-empty strings	
	let e = helpers.checkStringParam(constants.param.list.NAME, oldName)
			|| helpers.checkStringParam(constants.param.list.NEW_NAME, newName);

	// If one of the parameter isn't a non-empty string, stop the modification
	if(e) {
		return next(e);
	}

	doesListExist(oldName, function (err, exists) {
		if(err) return next(err);
		if(!exists) {
			return next(new ReferenceError(constants.errors.LISTNOEXISTS));
		}
		// Update the list's name if it exists
		db.update(dataType, {name: oldName}, {name: newName}, next);
	});
};


// Removes a given list from the database
// name: Name of the list to be removed from the database
// next(err): Callback function
module.exports.remove = function (name, next) {
	doesListExist(name, function (err, exists) {
		if(err) return next(err);
		if(!exists) {
			return next(new ReferenceError(constants.errors.LISTNOEXISTS));
		}
		// If list exists, remove it
		db.delete(dataType, {name: name}, next);
	})
};


// Checks if a list already exists with this name
// name: List name (non-empty string)
// next(err, exists): Callback function (exists is a boolean)
function doesListExist (name, next) {
	// Check if parameter is a non-empty string
	let e = helpers.checkStringParam(constants.param.list.NAME, name);
	// Abort if the parameter is incorrect
	if(e) {
		return next(e);
	}

	db.count(dataType, {
		conditions: [{lo: 'name', cmp: '=', ro: name}]
	}, function (err, data) {
		if(err) return next(err);
		return next(null, !!data); // Data will value 0 if no list with this name
	});
}

// We export this function separately because we need it both inside and outside
// of this file
module.exports.exist = doesListExist;