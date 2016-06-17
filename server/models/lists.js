var Connection  = require('../lib/db/factory'),
    settings    = require('../../settings');
    
var db = Connection.createConnection(settings.db);

db.connect();

class List {
    
}

module.exports = List;