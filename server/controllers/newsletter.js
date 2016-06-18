var nmd         = require('nano-markdown'),
    printit     = require('printit'),
    Newsletter  = require('../models/newsletter');

var log = printit({
    prefix: "newsletters",
    date: true
});


// This map will contain all the needed infos to get the status on the sending
// of emails.
var status = {};


// Sets the map to its initial values.
function resetStatus() {
    status = {
        sending: false, // true if a sending is currently occuring
        sent: 0, // Total of addresses to which the email has been sent
        recipients: 0, // Total of recipients
        fail: [], // Addresses for which the email failed to be sent
        success: [] // Addresses to which the email was successfully sent
    }
    log.info('Reset status.');
}


// Initializing the status map on startup
resetStatus();


// Gets the email subject and content from the HTTP body, sets everything up,
// and sends the mail to all needed recipients.
module.exports.send = function (req, res, next) {
    // Checking if all the required fields are filled
    if(!req.body.subject || !req.body.content) {
        let message = "Subject or content missing";
        res.send(400).send({err: message});
        return log.error(message);
    }
    
    // We begin with resetting the status so we don't use the previous mail's
    // stats as a base. 
    resetStatus();
    
    let newsletter = new Newsletter(req.body.subject);
    
    // This part is temporary. It will be replaced as soon as lists' subscribers
    // are implemented.
    newsletter.setRecipients([
        "brendan.abolivier@isen-bretagne.fr",
        "brendan@abolivier.fr"
    ]);

    // Translate content from markdown
    newsletter.setContent(nmd(req.body.content));
    
    // Setting sending up
    status.sending = true;
    res.status(202).send();
    
    // Send dem mails
    newsletter.sendToRecipients((err, recipient) => {
        // Each time the email is sent, we update the status map
        if(err) {
            status.fail.push(recipient);
        } else {
            status.success.push(recipient);
        }
        status.sent++;
    }, () => {
        // Once the sending is done, we change the sending status
        status.sending = false;
    });
}


// During a sending, the client can request status on the progress.
module.exports.check = function (req, res, next) {
    let code;
    // If the email is still currently being sent, we send a 200 OK
    // If all recipients has been sent the email, we send a 201 Created
    if(status.sending) {
        code = 200;
    } else {
        code = 201;
    }
    // All responses are sent with the status map
    res.status(code).json(status);
}