const constants = require('../utils/const');

// Error passed when a parameter is missing or empty in a request. It consists
// in a basic Error, with an additional "param" attribute describing the missing
// parameter.
class ParamError extends Error {
	
	// Constructor
	// param: String describing the missing parameter
	constructor(param) {
		// Call the parent's constructor with a "Missing parameter message"
		super(constants.errors.PARAM_MISSING);
		// Record the parameter description
		this.param = param;
	}
}

module.exports = ParamError;