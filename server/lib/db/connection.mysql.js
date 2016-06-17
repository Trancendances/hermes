var mysql       = require('mysql'),
    Connection  = require('./connection');


class MysqlConnection extends Connection {
    constructor(settings, prefix) {
        super(settings, prefix);
    }
    
    connect() {
        this.connection = mysql.createConnection(this.settings);
        this.connection.connect((err) => {
            if(err) {
                this.log.error(err.name);
                console.error(err.stack);
                process.exit();
            }
            let id = this.connection.threadId;
            this.log.info("Connected to database with ID " + id);
        });
    }
}

module.exports = MysqlConnection;