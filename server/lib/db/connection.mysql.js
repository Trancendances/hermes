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
        // Don't connect twice
        if(!this.connection) {
            // Openning MySQL connection
            this.connection = mysql.createConnection(this.settings);
            this.connection.connect(function(err) {
                if(err) {
                    this.log.error('Error: ' + err.code);
                    console.error(err.stack);
                    process.exit();
                }
                // Logging
                this.log.info('Connected to MySQL database.');
            }.bind(this));
        }
    }
    
    
    // Returns SQL formatted condition part of the query
    // conditions: The conditions object
    // returns: String containing the 'WHERE' part of the query
    genSQLCondition(conditions) {
        let str = ''
        
        str += ' WHERE ';
        conditions.forEach(function(condition) {
            str += condition.lo + ' ';
            str += condition.cmp + ' ';
            str += this.connection.escape(condition.ro);
            str += ' AND ';
        }.bind(this));
        
        // Remove the last 'AND'
        let length = str.length;
        str = str.substr(0, length-4);
        
        return str;
    }
    
    
    get(table, options, next) {
        let query = 'SELECT * FROM ' + table;
        
        if(options.conditions) {
            query += this.genSQLCondition(options.conditions);
        }
        // Execute query and pass error, if there's one, to the callback,
        // along the query result
        this.connection.query(query, next);
    }
    
    
    count(table, options, next) {
        let query = 'SELECT COUNT(*) FROM ' + table;
        
        if(options.conditions) {
            query += this.genSQLCondition(options.conditions);
        }
        
        this.connection.query(query, function(err, data) {
            next(err, data[0]['COUNT(*)']);
        });
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
            query += this.connection.escape(oldData[field]) + ' AND ';
        }
        
        // Remove the last 'AND'
        let length = query.length;
        query = query.substr(0, length-4);
        // Execute query and pass error, if there's one, to the callback
        this.connection.query(query, newData, next);
    }
    
    
    delete(table, conditions, next) {
        let query = 'DELETE FROM ' + table + ' WHERE '
        
        for(let field in conditions) {
            query += field + '=';
            query += this.connection.escape(conditions[field]) + ' AND ';
        }
        
        // Remove the last 'AND'
        let length = query.length;
        query = query.substr(0, length-4);
        // Execute query and pass error, if there's one, to the callback
        this.connection.query(query, next);
    }
}


module.exports = MysqlConnection;