const lists			= require('../server/lib/utils/lists');
const subscribers	= require('../server/lib/utils/subscribers');
const Client		= require('request-json').JsonClient;

module.exports.removeAllLists = function(done) {
	lists.get(function(err, listsTab) {
	    let removal = listsTab.map(function(list) {
	        return new Promise(function(removed) {
	            lists.remove(list.name, removed);
	        });
	    });
	    
	    Promise.all(removal).then(function() { done() });
	});
}


module.exports.getClient = function() {
	let port = process.env.PORT || 1708;
	return new Client('http://localhost:' + port);
}