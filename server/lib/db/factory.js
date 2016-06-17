var printit         = require('printit'),
    MysqlConnection = require('./connection.mysql');

var log = printit({
    prefix: "db:factory",
    date: true
});

class ConnectionFactory {
    static createConnection (config) {
        let sgbd       = Object.keys(config)[0];
        let settings   = config[sgbd];
        
        switch (sgbd) {
            case "mysql":
                return new MysqlConnection(settings, sgbd);
            default:
                log.error("No SGBD selected.");
                process.exit();
        }
    }
}

module.exports = ConnectionFactory;