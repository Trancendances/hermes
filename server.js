var americano = require('americano');

var port = process.env.PORT || 1708;
americano.start({name: 'Hermes', port: port});
