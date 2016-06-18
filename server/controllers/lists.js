var Lists   = require("../models/lists"),
    printit = require('printit');

var log = printit({
    prefix: "lists",
    date: true
});

// The process of adding and removing a list are almost the same. Only
// the static method we call, and the list's name location changes.
// req, res: Request and response, same as Express's
// feature: 'addition' or 'deletion'. Used to select the method to use
function alterLists(req, res, feature) {
    // Selecting the method and the name's location
    let alterFunction, name;
    switch(feature) {
        case 'addition':
            alterFunction = Lists.addList;
            name = req.body.name;
            break;
        case 'deletion':
            name = req.params.name;
            alterFunction = Lists.removeList;
            break;
        default:
            alterFunction = null;
            break;
    }
    
    // Checking if the list's name has been filled
    if(!name) {
        let message = "Name missing";
        res.status(400).send({err: message});
        return log.error(message);
    }
    
    // Using the method
    alterFunction(name, (err) => {
        if(err) {
            log.error("Error: " + err.code);
            console.error(err.stack);
            return res.status(500).send(err);
        }
        res.sendStatus(200)
    });
}


// Returns an array containing all the lists registered in the database
module.exports.getLists = function (req, res, next) {
    Lists.getLists((err, lists) => {
        res.status(200).send(lists);
    });
}


// Adds a list to the database
module.exports.addList = function (req, res, next) {
    alterLists(req, res, 'addition');
}


// Updates a list's name. In this process, we need two names, as does
// the used static method, unlike the addition or deletion. This one
// gets its own function, but the process is very similar.
module.exports.updateList = function (req, res, next) {
    if(!req.body.name) {
        let message = "New name missing";
        res.send(400).send({err: message});
        return log.error(message);
    }
    
    Lists.updateList(req.body.name, req.params.name, (err) => {
        if(err) {
            log.error("Error: " + err.code);
            console.error(err.stack);
            return res.status(500).send(err);
        }
        res.sendStatus(200)        
    });
}


// Remove a list from the database
module.exports.removeList = function (req, res, next) {
    alterLists(req, res, 'deletion');
}