var americano = require('americano');

var port = process.env.PORT || 1708;

var server;


function start(done) { 
	americano.start({name: 'Hermes', port: port}, (err, app, srv) => {
	    if(err){
	        console.log(err);
	        process.exit();
	    }
	    server = srv;
	    if(done)
	        done();
	});
}


function stop(done) {
	if(server) {
	    server.close(() => {
	        if(done)
	            done();
	    });
	}
}


// This file can be used to export the startup function for tests
if(require.main === module) {
	start();
} else {
	module.exports.start = start;
	module.exports.stop = stop;
}