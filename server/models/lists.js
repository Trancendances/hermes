var Connection  = require('../lib/db/factory');

// Setting the dataType once
var dataType = 'lists';
	
// This class needs to do requests to the database, so we initialise it
// and open the connection.
var db = Connection.getConnection();

db.connect();

// List of e-mail addresses. This class is mainly consisting in static
// methods, because that's the most practical way to use it.
// It's more an interface between the controller and the database's
// models than anything else.
class List {
	// Requests all the mailing lists from the database and passes them
	// to the controller using the callback
	// next(err, data): Callback function
	static getLists(next) {
	    db.get(dataType, {}, function(err, data) {
	        if(err) {
	            return next(err);
	        }
	        next(null, data);
	    });
	}
	
	
	// Request all subscribers in a list
	// name: Name of the list to get subscribers from
	// next(err, data): Callback function
	static getList(name, next) {
	    db.get('subscribers', {
	        conditions: [{
	            lo: 'list',
	            cmp: '=',
	            ro: name
	        }]
	    }, function(err, data) {
	        if(err) {
	            return next(err);
	        }
	        next(null, data);
	    })
	}
	
	
	// Creates a mailing list in the database with a given name
	// name: The new mailing list's name
	// next(err): Callback function
	static addList(name, next) {
	    db.count(dataType, {
	        conditions: [{
	            lo: 'name',
	            cmp: '=',
	            ro: name
	        }]
	    }, function(err, data) {
	        if(err) {
	            return next(err);
	        }
	        if(!data) {
	            db.add(dataType, { name: name }, function(err) {
	                next(err);
	            });    
	        } else {
	            next(new Error('Database already exists'));
	        }
	    });
	}
	
	
	// Changes a list's name from its old name to a given new one
	// newName: New name to give to the list
	// oldName: The list's name before the change. This allows to
	//          identify the list in the database.
	// next(err): Callback function
	static updateList(newName, oldName, next) {
	    db.update(dataType, {name: newName}, {name: oldName}, function(err) {
	        next(err);
	    });
	}
	
	
	// Remove a given list from the database
	// name: Name of the list to be removed from the database
	// next(err): Callback function
	static removeList(name, next) {
	    db.delete(dataType, { name: name }, function(err) {
	        next(err);
	    });
	}
}

module.exports = List;