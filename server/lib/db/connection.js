var printit = require('printit');

// This class is abstract. Its only aim is so other classes get heritage
// from it, and to define a common structure to harmonise all the
// database connectors.
class Connection {
    // Set the database settings stored in the JSON file (settings)
    // Also set the logger prefix so we can know which driver is being
    // used (prefix)
    constructor(settings, prefix) {
        this.settings = settings;
        
        this.log = printit({
            prefix: 'db:' + prefix,
            date: true
        });
    }
    
    
    // Open connection to database
    connect() {}
    
    
    // Extract data from the database
    // dataType: Type of data
    // options: Options to select the data (limit, conditions...)
    // next(err, data): Callback function
    get(dataType, options, next) {}
    
    
    // Extract data from the database
    // dataType: Type of data
    // options: Options to select the data (limit, conditions...)
    // next(err, data): Callback function
    count(dataType, next) {}
    
    
    // Add data to the database
    // dataType: Type of data
    // data: Data to add symbolised as a {field: value} map
    // next(err): Callback function
    add(dataType, data, next) {}
    
    
    // Update data from the database
    // dataType: Type of data
    // newData: Data to replace old data, symbolised as a 
    //          {field: value} map
    // oldData: Data to be replaced, symbolised as a {field: value} map
    // next(err): Callback function
    update(dataType, newData, oldData, next) {}
    
    
    // Delete data from the database
    // dataType: Type of data
    // conditions: Data matching this condition will be deleted from the
    //             database. Symbolised by a {field: value} map, leading
    //             to a deletion of all data matching field=value
    // next(err): Callback function
    delete(dataType, conditions, next) {}
}

module.exports = Connection;