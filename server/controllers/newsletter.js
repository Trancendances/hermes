var nmd         = require('nano-markdown'),
    Newsletter  = require('../models/newsletter');

var status = {
    sending: false,
    sent: 0,
    recipients: 0,
    fail: [],
    success: []
}

module.exports.send = function (req, res, next) {
    // Setting stuff (temporary for testing)
    Newsletter.addRecipient("brendan.abolivier@isen-bretagne.fr");
    Newsletter.addRecipient("brendan@abolivier.fr");
    Newsletter.setSubject(req.body.subject);
    Newsletter.setContent(nmd(req.body.content));
    
    // Setting sending up
    status.sending = true;
    res.status(202).send();
    
    // Send dem mails
    Newsletter.sendToRecipients((err, recipient) => {
        if(err) {
            status.fail.push(recipient);
        } else {
            status.success.push(recipient);
        }
        status.sent++;
    }, () => {
        status.sending = false;
    });
}

module.exports.check = function (req, res, next) {
    let code;
    if(status.sending) {
        code = 200;
    } else {
        code = 201;
    }
    res.status(code).json(status);
}