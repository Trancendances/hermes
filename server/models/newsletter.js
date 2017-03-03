var fs          = require('fs'),
	nodemailer  = require('nodemailer'),
	settings    = require('../../settings');


// Initialise nodemailer's transporter with the JSON settings file
var transporter = nodemailer.createTransport(settings.transporter);


// Merge fields of two maps
// dst: Destination map
// src: Source map
// returns the destination map with fields from the source map in addition to
//         its original fields.
function mergeFields (dst, src) {
	for (var property in src) {
	    dst[property] = src[property];
	}
	return dst;
}


// We renamed settings so they can be easier to understand by the user. This
// means that mail settings aren't fully compatible with nodemailer's syntax.
// Because of this, we need this function to match the mail settings to the
// corresponding nodemailer settings.
// settings: The initial settings from the JSON file
// returns the settings with renamed and rearranged fields
function standardise (settings) {
	let dst = {};
	dst.headers = {};
	
	if(settings.from)
	    dst.from = settings.from;
	if(settings.userAgent)
	    dst.headers['User-Agent'] = settings.userAgent;
	if(settings.replyTo)
	    dst.headers['Reply-To'] = settings.replyTo;
	
	return dst;
}


// Class describing all the necessary methods to set up and send a bulk email
class Newsletter {
	// Initialise attributes
	// subject: The email's subject
	constructor(subject) {
	    this.subject    = subject;
	    this.recipients = []; // Mandatory
	    this.html       = ''; // Mandatory
	}
	
	
	// Set recipients array
	// recipients: Array contaning all the newsletter's recipients
	setRecipients (recipients) {
	    if(recipients.lenght) {
	        this.recipients = recipients;
	    } else {
	        throw 'Not an array or no elements in it.';
	    }
	}
	
	
	// Add a recipient to tbe recipient's array
	// newRecipient: Recipient to add to the email's recipients
	addRecipient (newRecipient) {
	    if(typeof newRecipient === 'string') {
	        this.recipients.push(newRecipient);
	    } else {
	        throw 'Not a string';
	    }
	}
	
	
	// Set HTML content to the email
	// content: HTML content
	setContent (content) {
	    if(typeof content === 'string') {
	        this.html = content;
	    } else {
	        throw 'Not a string';
	    }
	}
	
	
	// Specify that we want to load the email's content from an HTML file.
	// path: HTML file path
	setContentFromFile (path) {
	    if(typeof path === 'string') {
	        this.html = { path: path };
	    } else {
	        throw 'Not a string';
	    }
	}
	
	
	// A few checks to see if all fields have been set before sending the email
	prepareMail () {
	    // Check if recipients are set
	    if(!this.recipients.length) {
	        throw 'No recipient'
	    }
	    // Check if content is set
	    if(!this.html) {
	        throw 'No content'
	    }
	    // Prepare mail to be sent
	    return mergeFields(standardise(settings.mail), {
	        subject: this.subject ? this.subject : 'Newsletter',
	        html: this.html
	    });
	}
	
	
	// Sending the email to the previously set recipients with the previously
	// set content and subject
	// next(err, infos): Callback sent for each recipient being the infos 
	//                   returned by nodemailer
	// done(): Callback to call once every mail have been sent
	sendToRecipients (next, done) {
	    let options = this.prepareMail();
	    // Loop, to send the mail to each recipient, one by one
	    let mails = this.recipients.map(function(recipient) {
	        return new Promise(function(sent) {
	            // Setting the recipient
	            options.to = recipient;
	            // Sending the mail
	            transporter.sendMail(options, function(err, infos) {
	                sent();
	                if(err) {
	                    return next(err, recipient);
	                }
	                next(null, recipient);
	            });
	        });
	    });
	    // Once the mail has been sent to all of the recipients in the array,
	    // call the done() callback function
	    Promise.all(mails).then(done);
	}    
}


module.exports = Newsletter;