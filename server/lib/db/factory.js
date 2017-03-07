var printit         = require('printit'),
	conf            = require('../../../settings.json').db,
	MysqlConnection = require('./connection.mysql');


var log = printit({
	prefix: 'DB::factory',
	date: true
});


// Factory used to get a database connection object able to dialog with the
// SGBD specified in the JSON settings file.
class ConnectionFactory {
	// Selects the class to initialise according to the settings if not already
	// initialised (singleton)
	// config: Database configuration map, extracted from the JSON settings
	//         file
	// returns an instance of the right class
	static getConnection () {
	    if(this.instance)
	        return this.instance
	    
	    let sgbd       = Object.keys(conf)[0];
	    let settings   = conf[sgbd];
	    
	    switch (sgbd) {
	        case 'mysql':
	            this.instance = new MysqlConnection(settings, sgbd);
	            return this.instance;
	        default:
	            // If we don't provide a connection object for the specified
	            // SGBD, or if one hasn't been specified, we exit the programm.
	            log.error('No SGBD specified, or no driver available yet.');
	            process.exit();
	    }
	}
}


module.exports = ConnectionFactory;