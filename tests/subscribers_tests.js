var should      = require('chai').Should(),
    server      = require('../server'),
    helpers     = require('./helpers');

var client = helpers.getClient();

var LIST_NAME       = 'test list',
    FAKE_LIST_NAME  = 'fake list',
    SUB_ADDR        = 'test@example.tld',
    NEW_SUB_ADDR    = 'contact@example.tld';

describe('Subscribers', () => {
    before((done) => {
        server.start(() => {
            // Removing all lists will also remove their subscribers
            helpers.removeAllLists(() => {
                // Adding a fake list. Test on this route is in a separate file
                client.post('/lists', {name: LIST_NAME}, (err, res) => {
                    done();
                });
            });
        });        
    });
    
    after((done) => {
        server.stop(() => {
            helpers.removeAllLists(done);
        });
    });
    
    it('Getting all subscribers', (done) => {
        client.get('/subscribers', (err, res, body) => {
            body.length.should.equal(0);
            done();
        });
    });
    
    it('Adding a subscriber to a non existing list', (done) => {
        client.post('/subscribers', {
            list: FAKE_LIST_NAME,
            address: SUB_ADDR
        }, (err, res, body) => {
            res.statusCode.should.equal(500);
            body.should.have.property('err');
            body.err.should.equal('List doesn\'t exist.')
            done();
        });
    });
    
    it('Adding a subscriber to an existing list', (done) => {
        client.post('/subscribers', {
            list: LIST_NAME,
            address: SUB_ADDR
        }, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists/' + LIST_NAME, (err, res, body) => {
                body.length.should.equal(1);
                body[0].address.should.equal(SUB_ADDR);                
                done();
            });
        });
    });
    
    it('Updating the address of a subscriber', (done) => {
        let data = {
            list: LIST_NAME,
            address: NEW_SUB_ADDR
        };
        client.put('/subscribers/' + SUB_ADDR, data, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists/' + LIST_NAME, (err, res, body) => {
                body.length.should.equal(1);
                body[0].address.should.equal(NEW_SUB_ADDR);
                done();
            });
        });
    });
    
    it('Removing a subscriber', (done) => {
        client.del('/subscribers/' + NEW_SUB_ADDR, {}, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists/' + LIST_NAME, (err, res, body) => {
                body.length.should.equal(0);
                done();
            });
        });
    });
});
