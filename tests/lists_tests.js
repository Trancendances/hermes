var should      = require('chai').Should(),
    startServer = require('../server').start,
    helpers     = require('./helpers');

var client = helpers.getClient();

var LIST_NAME       = 'test list',
    NEW_LIST_NAME   = 'new test list';

describe('Lists', () => {
    before((done) => {
        startServer();
        helpers.removeAllLists(done);
    });
    
    it('Getting lists', (done) => {
        client.get('/lists', (err, res, body) => {
            body.length.should.equal(0);
            done();
        });
    });
    
    it('Creating a list', (done) => {
        client.post('/lists', {name: LIST_NAME}, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists', (err, res, body) => {
                body.length.should.equal(1);
                body[0].name.should.equal(LIST_NAME);
                done();
            });
        });
    });
    
    
    it('Updating the name of a list', (done) => {
        let data = {name: NEW_LIST_NAME};
        client.put('/lists/' + LIST_NAME, data, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists', (err, res, body) => {
                body.length.should.equal(1);
                body[0].name.should.equal(NEW_LIST_NAME);
                done();
            });
        });
    });
    
    it('Removing a list', (done) => {
        client.del('/lists/' + NEW_LIST_NAME, {}, (err, res) => {
            res.statusCode.should.equal(200);
            
            client.get('/lists', (err, res, body) => {
                body.length.should.equal(0);
                done();
            });
        });
    });
});
