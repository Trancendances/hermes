var Lists   = require("../models/lists"),
    printit = require('printit');

var log = printit({
    prefix: "lists",
    date: true
});


// Log an error and sends it in the HTTP response.
// error: An Error object representing the error
// res: Express's response object
function logError(error, res) {
    // If not an error object, make it one
    if(typeof error === "string") {
        error = new Error(error);
    }
    res.status(500).send({err: error.message});
    log.error(error.message);
    console.log(error.stack);
}


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
        return logError('Name missing.', res);
    }
    
    // Using the method
    alterFunction(name, (err) => {
        if(err) {
            return logError(err);
        }
        res.sendStatus(200)
    });
}


// Returns an array containing all the lists registered in the database
module.exports.getLists = function (req, res, next) {
    Lists.getLists((err, lists) => {
        if(err) {
            return logError(err, res);
        }
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
        return logError('Names missing.', res);
    }
    
    Lists.updateList(req.body.name, req.params.name, (err) => {
        if(err) {
            return logError(err);
        }
        res.sendStatus(200)        
    });
}


// Remove a list from the database
module.exports.removeList = function (req, res, next) {
    alterLists(req, res, 'deletion');
}