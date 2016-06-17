var printit = require('printit');

class Connection {
    constructor(settings, prefix) {
        this.settings   = settings;
        
        this.log = printit({
            prefix: "db:" + prefix,
            date: true
        });
    }
    
    connect() {}
}

module.exports = Connection;