const constants		= require('./const');
const ParamError	= require('../errors/paramerror');

// If an array is passed, will check if all of its rows are strings. If anything
// else is passed, will check if it a string. If not, throw a TypeError.
// v: parameter to check
function checkIfString (v) {
	if(v instanceof Array) {
		for(m of v) {
			checkIfString(m);
		}
	} else if(typeof v != 'string') {
		throw new TypeError(constants.errors.NOTSTRING);
	}
};


// Check if the param is a non-empty string. Uses checkIfString to provide a
// more complete check
// param: Parameter identifier (as defined in const.js)
// value: Parameter value
// return: Instance of ParamError if the parameter is null or empty, instance of
//			Error if the parameter isn't a string, null if the parameter is a
//			non-empty string
function checkStringParam (param, value) {
	// First check if the parameter is non-null and empty
	if(!value || !value.length) {
		return new ParamError(param);
	}

	// Then check if the parameter is a string
	try {
		checkIfString(value);
	} catch (e) {
		return e;
	}

	// If the parameter is a non-empty string, return no error
	return null;
}


// Complete error logging and handling process for controller-level functions
// error: The Error object to handle
// log: The printit log object, needed to log the error in the console
// res: The express response object, needed to send the error data to the client
function logError (error, log, res) {
	// Log the error in the server console
	log.error(error.message);
	// Don't log the stack if we're tesing or running in production
	if(!(['test', 'production'].includes(process.env.NODE_ENV))) {
		console.error(error.stack);
	}
	// If a ParamError is thrown, it means the error is on the client's side
	if(error instanceof ParamError) {
		log.error('Param: ' + error.param);
		res.status(400).send({
			err: error.message,
			param: error.param // We tell the user which parameter is missing
		});
	} else if(error instanceof ReferenceError) {
		// A ReferenceError is thrown when a ressource doesn't exist
		res.status(404).send({err: error.message});
	} else { // The error is on the server's side
		res.status(500).send({err: error.message});
	}
};

module.exports = {
	checkIfString: checkIfString,
	logError: logError,
	checkStringParam: checkStringParam
}