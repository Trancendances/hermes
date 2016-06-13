var americano = require('americano');

module.exports = {
    common: {
        use: [
            americano.bodyParser(),
            americano.methodOverride(),
            americano.static(__dirname + '/../client/public', {
                maxAge: 86400000
            })
        ],
        useAfter: [
            americano.errorHandler({
                dumpExceptions: true,
                showStack: true
            }),
        ]
    },
    development: [
        americano.logger('dev')
    ],
    production: [
        americano.logger('short')
    ]
};