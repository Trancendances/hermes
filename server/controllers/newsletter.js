var nmd         = require('nano-markdown'),
    printit     = require('printit'),
    Newsletter  = require('../models/newsletter');

var log = printit({
    prefix: "newsletters",
    date: true
});

var status = {};

function resetStatus() {
    status = {
        sending: false,
        sent: 0,
        recipients: 0,
        fail: [],
        success: []
    }
}

resetStatus();

module.exports.send = function (req, res, next) {
    if(!req.body.subject || !req.body.content) {
        let message = "Subject or content missing";
        res.send(400).send({err: message});
        return log.error(message);
    }
    
    let newsletter = new Newsletter(req.body.subject);
    
    // Setting stuff (temporary for testing)
    newsletter.setRecipients([
        "brendan.abolivier@isen-bretagne.fr",
        "brendan@abolivier.fr"
    ]);

    // Translate from markdown
    newsletter.setContent(nmd(req.body.content));
    
    // Setting sending up
    status.sending = true;
    res.status(202).send();
    
    // Send dem mails
    newsletter.sendToRecipients((err, recipient) => {
        if(err) {
            status.fail.push(recipient);
        } else {
            status.success.push(recipient);
        }
        status.sent++;
    }, () => {
        resetStatus();
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