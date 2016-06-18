var americano = require('americano');

var port = process.env.PORT || 1708;

function start() { 
    americano.start({name: 'Hermes', port: port});
}


// This file can be used to export the startup function for tests
if(require.main === module) {
    start();
} else {
    module.exports.start = start;
}