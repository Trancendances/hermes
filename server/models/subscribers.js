var Connection  = require('../lib/db/factory');

// Setting the dataType once
var dataType = 'subscribers';
    
// This class needs to do requests to the database, so we initialise it
// and open the connection.
var db = Connection.getConnection();

db.connect();

// Subscriber to a list. This class is mainly consisting in static
// methods, because that's the most practical way to use it.
// It's more an interface between the controller and the database's
// models than anything else.
class Subscribers {
    // Requests all the mailing lists from the database and passes them
    // to the controller using the callback
    // next(err, data): Callback function
    static getSubscribers(next) {
        db.get(dataType, {}, (err, data) => {
            if(err) {
                return next(err);
            }
            next(null, data);
        });
    }
    
    
    // Creates a mailing list in the database with a given name
    // name: The new mailing list's name
    // next(err): Callback function
    static addSubscriber(list, address, next) {
        db.add(dataType, { list: list, address: address }, (err) => {
            next(err);
        });
    }
    
    
    // Changes a list's name from its old name to a given new one
    // newName: New name to give to the list
    // oldName: The list's name before the change. This allows to
    //          identify the list in the database.
    // next(err): Callback function
    static updateSubscriber(list, newAddress, oldAddress, next) {
        db.update(dataType, {
            address: newAddress
        }, {
            address: oldAddress,
            list: list
        }, (err) => {
            next(err);
        });
    }
    
    
    // Remove a given list from the database
    // name: Name of the list to be removed from the database
    // next(err): Callback function
    // TODO: Remove per-list
    static removeSubscriber(address, next) {
        db.delete(dataType, { address: address }, (err) => {
            next(err);
        });
    }    
}

module.exports = Subscribers;