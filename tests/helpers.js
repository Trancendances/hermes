var List    = require('../server/models/lists'),
	Subs    = require('../server/models/subscribers'),
	Client  = require('request-json').JsonClient;

module.exports.removeAllLists = function(done) {
	List.getLists(function(err, lists) {
	    let removal = lists.map(function(list) {
	        return new Promise(function(removed) {
	            List.removeList(list.name, removed);
	        });
	    });
	    
	    Promise.all(removal).then(function() { done() });
	});
}


module.exports.getClient = function() {
	let port = process.env.PORT || 1708;
	return new Client('http://localhost:' + port);
}