var mysql       = require('mysql'),
    printit     = require('printit'),
    settings    = require('../../settings');
    
var log = printit({
    prefix: "database",
    date: true
});

var mysqlConnection = mysql.createConnection(settings.db);

mysqlConnection.connect((err) => {
    if err {
        log.error(err.name);
        console.error(err.stack);
        process.exit();
    }
    
    log.info("Connected to database with ID " + connection.threadId);
});

