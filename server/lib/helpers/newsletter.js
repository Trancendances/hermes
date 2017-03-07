const nodemailer	= require('nodemailer');
const settings		= require('../../../settings');
const constants		= require('./const');
const printit		= require('printit');
const log			= printit({
	prefix: 'Helpers::Newsletter',
	date: true
})

// Globals used to manage e-mail sending
var transporter = null,
	status = {},
	mails = {};


// (Re)sets the status and creates the transporter if needed (sort of singleton)
module.exports.init = function () {
	status = {
	    sending: false, // true if a sending is currently occuring
	    sent: 0, // Total of addresses to which the email has been sent
	    recipients: 0, // Total of recipients
	    fails: [] // Addresses for which the email failed to be sent
	};

	// If a transporter has already been created, there's no need to create
	// another
	if(!transporter) {
		transporter = nodemailer.createTransport(settings.transporter);
	}
};


// If an array is passed, will check if all of its rows are strings. If anything
// else is passed, will check if it a string. If not, throw a TypeError.
// v: parameter to check
module.exports.checkIfString = function (v) {
	if(v instanceof Array) {
		for(m of v) {
			checkIfString(m);
		}
	} else if(typeof v != 'string') {
		throw new TypeError(constants.errors.NOTSTRING);
	}
};


// Prepare the newsletter to be sent
// recipients: Array of e-mails (following RFC 1036)
// subject: The newsletter's subject
// content: The newsletter's HTML content (parsed from markdown)
module.exports.prepare = function (recipients, subject, content) {
	// Check recipients
	if(!recipients || !recipients.length) {
		throw new Error(constants.errors.NORECIPIENT);
		checkIfString(recipients);
	}

	// Check subject
	if(!subject || !subject.length) {
		throw new Error(constants.errors.NOSUBJECT);
		checkIfString(subject);
	}

	// Check content
	if(!content || !content.length) {
		throw new Error(constants.errors.NOCONTENT);
		checkIfString(content);
	}

	status.recipients = recipients.length;
	// Create the promises for each individual e-mail
	mails = recipients.map(function (recipient) {
		return new Promise(function (sent) {
			send(recipient, subject, content, sent);
		});
	});
};


// Send the e-mails previously prepared
module.exports.dispatch = function () {
	Promise.all(mails).then(function () {
		// When all e-mails have been sent, set the status to not sending
		status.sending = false;
	});
}


// Retrieve the sending status
// return: Object describing the current sending status
module.exports.getStatus = function() {
	return status;
}


// Send an e-mail
// recipient: String containing the recipient's e-mail (following RFC 1036)
// subject: String containing the e-mail's subject
// content: String containing the e-mail's HTML content
// send: Callback called once the e-mail has been sent
function send (recipient, subject, content, sent) {
	// Set the status to sending if not previously set
	status.sending = true;

	// Get the transport options
	let options = genTransportOptions(recipient, subject, content);

	// Send the load
	transporter.sendMail(options, function(err) {
		// Sending process is over, send the next e-mail
		sent();
		// Error handling
		if(err) {
			status.fails.push(recipient);
			log.error('Failed to send to ' + recipient + ': ' + err.message);
			console.error(err.stack);
		} else {
			// Debug log and status update
			log.debug('Sent to ' + recipient);
			status.sent++;
		}
	});
}


// Generate options for nodemailer's transporter
// recipient: String containing the recipient's e-mail (following RFC 1036)
// subject: String containing the e-mail's subject
// content: String containing the e-mail's HTML content
// returns an object to pass to nodemailer's transporter
function genTransportOptions (recipient, subject, content) {
	// Basic options
	let options = {
		to: recipient,
		subject: subject,
		html: content
	}

	// Additional options from user-based settings
	if(settings.from)
		options.from = settings.from;
	if(settings.userAgent)
		options.headers['User-Agent'] = settings.userAgent;
	if(settings.replyTo)
		options.headers['Reply-To'] = settings.replyTo;

	return options;
}