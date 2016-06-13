var nodemailer  = require('nodemailer');
var settings    = require('../../mailSettings');

var transporter = nodemailer.createTransport(settings);

var newsletter = {
    recipients: [],
    htmlPath: "",
    
    setRecipients: function(recipients) {
        this.recipients = recipients;
    },
    
    addRecipient: function(newRecipient) {
        if(typeof newRecipient === 'string') {
            this.recipient.push(newRecipient);
        } else {
            throw 'Not a string';
        }
    },
    
    sendToRecipients: function(next) {
        // TODO: Define function and callback
    }
};

module.exports = newsletter;