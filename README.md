# Hermes [![](https://travis-ci.org/Trancendances/hermes.svg?branch=master)](https://travis-ci.org/Trancendances/hermes)

Hermes is a bulk e-mail sender. It allows you to manage mailing lists and subscribers, and send them e-mails based on HTML template and
markdown content, in a self-hosted and respectful way. No more big superservice adding its own tracker to your emails.

:warning: **This project is still under heavy development and is not ready for production yet.**

## Dependencies

Hermes is a Node.js app, so you will need [Node.js](https://nodejs.org) at a [supported version](https://travis-ci.org/Trancendances/hermes), along NPM.

## Installing

To install Hermes, clone this repository and install the required NPM dependencies.
```
git clone https://github.com/Trancendances/hermes
cd hermes
npm install
```

## Configuring

To configure Hermes with your own settings, you must put them in a JSON file at the root of this directory. This file includes three parts: One for the transporter's (SMTP) configuration, another for the e-mail sending settings, and a last one for the database. The final JSON file should look like this.

```json
{
    "transporter": {
        "pool": true,
        "host": "mail.example.tld",
        "port": 587,
        "requireTLS": true,
        "auth": {
            "user": "noreply@example.tld",
            "pass": "somepassword"
        }
    },
    "mail": {
        "from": "My awesome service <noreply@example.tld>",
        "userAgent": "Hermes (Trancendances) based on nodemailer",
        "replyTo": "contact@example.tld"
    },
    "db": {
        "mysql": {
            "host"     : "localhost",
            "user"     : "root",
            "password" : "anotherpassword",
            "database" : "hermes"
        }
    }
    
}
```

* The first part (`transporter`) can include any setting allowed by [nodemailer](https://github.com/nodemailer/nodemailer#set-up-smtp).
* The `mail` part configures static parts for all the e-mails that will be sent from Hermes. Right now, it only accepts three different fields: `from` (sender's address), `userAgent` (sender's user agent) and `replyTo` (the user to reply to the email, in case it differs from the sender's address).
* `db` contains all your database settings. It contains a map which key defines the database engine you use, among all the drivers existing in the application. In this example, we use MySQL, for which we use four fields: `host`, `user`, `password` and `database`.

### Available database drivers

Here is a list of all the database engines currently supported in Hermes:

**MySQL**
```json
"mysql": {
    "host"     : "localhost",
    "user"     : "root",
    "password" : "anotherpassword",
    "database" : "hermes"
}
```


## Starting

To start Hermes, run 
```
npm start
```
from the directory you installed it in. Hermes will run on port 1708 by default,
but you can override this value with the `PORT` environment variable.
```
PORT=8080 npm start
```

## Testing

To run Hermes's unit test, you first need to install it and its dependencies, then run 
```
npm test
```

## Contribute

If you like this project and want to help, there's many way to do it.

- Suggest new features in an [issue](https://github.com/Trancendances/hermes/issues)
- Report every bug or inconvenience you encountered during this software in the [issues](https://github.com/Trancendances/hermes/issues)
- Pick up an [issue](https://github.com/Trancendances/hermes/issues) and fix it by submitting a [pull request](https://github.com/Trancendances/hermes/pulls)
- Implement a new database driver
- Start implementing a new feature you'd like to use in the software*

\* Before you start implementing anything, please make sure to create an [issue](https://github.com/Trancendances/hermes/issues) about it if one hasn't been created yet.
If we don't want to see your idea in Hermes (even if it's quite unlikely), it can be frustrating to you to have been working hard on someting
for nothing.

## About Trancendances

[![](https://cloud.githubusercontent.com/assets/5547783/16178421/7f568a30-3647-11e6-891d-5e14384425e4.png)](https://www.trancendances.fr)

Trancendances is a non-profit organisation promoting trance music in France. During more than five years of experience with this genre
and its global scene, we've had the opportunity to take part in major french events (Wackii Time Party, Fables Festival...), team up with
some of the bests trance labels and artists around the world, and promote this music within our weekly podcasts, reviews, reports and giveaways.

One of the most important thing in the organisation's management is transparency, as long as the respect of the users (no tracking, or at least the
least necessary) and the use of free software in accordance with its philosophy.

## Contact us

There are many ways to get in touch, whether it is by [e-mail](oss@trancendances.fr), [Twitter](https://twitter.com/Trancendances) or [Facebook](https://facebook.com/Trancendances), or even in this repository's [issues](https://github.com/Trancendances/hermes/issues).

Additionally, you can contact Hermes's maintainer at <brendan@trancendances.fr>.

We can't wait to read your feedback :-)