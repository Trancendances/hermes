var fs          = require('fs'),
    nodemailer  = require('nodemailer'),
    settings    = require('../../mailSettings');

var transporter = nodemailer.createTransport(settings.transporterConfig);

function mergeFields(dst, src) {
    for (var property in src) {
        dst[property] = src[property];
    }
    return dst;
}

/***************** Newletter class *******************/
class Newsletter {
    constructor(subject) {
        this.subject    = subject;
        this.recipients = []; // Mandatory
        this.html       = ""; // Mandatory
    }
    
    setRecipients (recipients) {
        this.recipients = recipients;
    }
    
    addRecipient (newRecipient) {
        if(typeof newRecipient === 'string') {
            this.recipients.push(newRecipient);
        } else {
            throw 'Not a string';
        }
    }
    
    setContent (content) {
        if(typeof content === 'string') {
            this.html = content;
        } else {
            throw 'Not a string';
        }
    }
    
    setContentFromFile (path) {
        if(typeof path === 'string') {
            this.html = { path: path };
        } else {
            throw 'Not a string';
        }
    }
    
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
        return mergeFields(settings.mailSettings, {
            subject: this.subject ? this.subject : "Newsletter",
            html: this.html
        });
    }
    
    // next(err, infos): Callback sent for each recipient being the infos 
    //                   returned by nodemailer
    // done(): To call once every mail have been sent
    sendToRecipients (next, done) {
        let options = this.prepareMail();
        // Loop, to send the mail to each recipient, one by one
        let mails = this.recipients.map((recipient) => {
            return new Promise((sent) => {
                // Setting the recipient
                options.to = recipient;
                // Sending the mail
                transporter.sendMail(options, (err, infos) => {
                    sent();
                    if(err) {
                        return next(err, recipient);
                    }
                    next(null, recipient);
                });
            });
        });
        Promise.all(mails).then(done);
    }    
}

module.exports = Newsletter;