var printit         = require('printit'),
    MysqlConnection = require('./connection.mysql');


var log = printit({
    prefix: "db:factory",
    date: true
});


// Factory used to get a database connection object able to dialog with the
// SGBD specified in the JSON settings file.
class ConnectionFactory {
    // Selects the class to initialise according to the settings
    // config: Database configuration map, extracted from the JSON settings
    //         file
    // returns an instance of the right class
    static createConnection (config) {
        let sgbd       = Object.keys(config)[0];
        let settings   = config[sgbd];
        
        switch (sgbd) {
            case "mysql":
                return new MysqlConnection(settings, sgbd);
            default:
                // If we don't provide a connection object for the specified
                // SGBD, or if one hasn't been specified, we exit the programm.
                log.error("No SGBD specified, or no driver available yet.");
                process.exit();
        }
    }
}


module.exports = ConnectionFactory;