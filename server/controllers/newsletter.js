const nmd		= require('nano-markdown');
const printit	= require('printit');
const helpers	= require('../lib/helpers/newsletter');

var log = printit({
	prefix: 'Controllers::Newsletter',
	date: true
});

// TODO: Replace this with methods from Lists
var tmpRecipients = [
	'brendan.abolivier@isen-bretagne.fr',
	'brendan@abolivier.fr'
];

// Gets the email subject and content from the HTTP body, sets everything up,
// and sends the mail to all needed recipients.
module.exports.send = function (req, res, next) {
	// Set, or reset, the objects used during sending
	helpers.init();

	// helpers.prepare() can throw 4 exceptions: If no recipients are provided,
	// if no subject is provided, if no content is provided, or if none of the
	// arguments are or contain string(s)
	try {
		helpers.prepare(tmpRecipients, req.body.subject, nmd(req.body.content));
	} catch (e) {
		let code = 400;
		// If a TypeError is thrown, it means the error is on the server's side
		if(e instanceof TypeError) {
			code = 500
		}
		res.status(code).send({err: e.message});
	    log.error(e.message);
		return console.error(e.stack);
	}

	// All checks passed, let's send the load.
	helpers.dispatch();

	// Notify the user that mail is on its way
	res.status(202).send();
}


// During a sending, the client can request status on the progress.
module.exports.check = function (req, res, next) {
	// Retrieve the current sending status
	let status = helpers.getStatus();

	let code;
	// If the email is still currently being sent, we send a 200 OK
	// If all recipients has been sent the email, we send a 201 Created
	if(status.sending) {
		code = 200;
	} else {
		code = 201;
	}
	// All responses are sent with the status map
	res.status(code).send(status);
}