module.exports = {
	errors: {
		PARAM_MISSING: 'HERMES_PARAM_MISSING',	// One parameter is missing
		NOTSTRING: 'HERMES_NOT_STRING',			// The given parameter should be a string but isn't
		LISTEXISTS: 'HERMES_LIST_EXISTS',		// Trying to create a list that already exists
		SUBEXISTS: 'HERMES_SUB_EXISTS',			// Trying to register a subscriber that has already subscribed to this list
		LISTNOEXISTS: 'HERMES_LIST_NO_EXISTS',	// Trying to update/remove a non-existing list
		SUBNOEXISTS: 'HERMES_SUB_NO_EXISTS'		// Trying to update/remove a non-existing subscriber
	},
	param: { // Parameters that can be missing
		list: {
			NAME: 'HERMES_LIST_NAME',
			NEW_NAME: 'HERMES_LIST_NEW_NAME'
		},
		sub: {
			ADDR: 'HERMES_SUB_ADDRESS',
			NEW_ADDR: 'HERMES_SUB_NEW_ADDRESS'
		},
		mail: {
			RECIPIENTS: 'HERMES_MAIL_RECIPIENTS',
			SUBJECT: 'HERMES_MAIL_SUBJECT',
			CONTENT: 'HERMES_MAIL_CONTENT'
		}
	}
};