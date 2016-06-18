var List    = require('../server/models/lists'),
    Client  = require('request-json').JsonClient;

module.exports.removeAllLists = function(done) {
    List.getLists((err, lists) => {
        let removal = lists.map((list) => {
            return new Promise((removed) => {
                List.removeList(list.name, removed);
            });
        });
        
        Promise.all(removal).then(() => { done() });
    });
}

module.exports.getClient = function() {
    let port = process.env.PORT || 1708;
    return new Client('http://localhost:' + port);
}