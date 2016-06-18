var mysql       = require('mysql'),
    Connection  = require('./connection');

// MySQL driver, implementation of the Connection abstract class
// Methods are described in the said abstract class. Here, dataTypes
// are MySQL tables.
class MysqlConnection extends Connection {
    // Calling the abstract class's constructor
    constructor(settings, prefix) {
        super(settings, prefix);
    }
    
    
    connect() {
        // Openning MySQL connection
        this.connection = mysql.createConnection(this.settings);
        this.connection.connect((err) => {
            if(err) {
                this.log.error("Error: " + err.code);
                console.error(err.stack);
                process.exit();
            }
            // Logging
            this.log.info("Connected to MySQL database.");
        });
    }
    
    
    get(table, options, next) {
        let query = 'SELECT * FROM ' + table;
        
        if(options.conditions) {
            query += ' WHERE ';
            for(let condition in options.conditions) {
                query += condition.lo + ' ';
                query += condition.cmp + ' ';
                query += this.connection.escape(condition.ro);
                query += ' AND ';
            }
            
            // Remove the last "AND"
            let length = query.length;
            query = query.substr(0, length-4);
        }
        // Execute query and pass error, if there's one, to the callback,
        // along the query result
        this.connection.query(query, next);
    }
    
    
    add(table, data, next) {
        let query = 'INSERT INTO ' + table + ' SET ?'
        
        // Gotta love a well-made module <3
        this.connection.query(query, data, next);
    }
    
    
    update(table, newData, oldData, next) {
        let query = 'UPDATE ' + table + ' SET ? WHERE ';
        
        for(let field in oldData) {
            query += field + '=';
            query += this.connection.escape(oldData[field]) + ' AND';
        }
        
        // Remove the last "AND"
        let length = query.length;
        query = query.substr(0, length-4);
        // Execute query and pass error, if there's one, to the callback
        this.connection.query(query, newData, next);
    }
    
    
    delete(table, conditions, next) {
        let query = 'DELETE FROM ' + table + ' WHERE '
        
        for(let field in conditions) {
            query += field + '=';
            query += this.connection.escape(conditions[field]) + ' AND';
        }
        
        // Remove the last "AND"
        let length = query.length;
        query = query.substr(0, length-4);
        // Execute query and pass error, if there's one, to the callback
        this.connection.query(query, next);
    }
}


module.exports = MysqlConnection;