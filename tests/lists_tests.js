var should      = require('chai').Should(),
    server      = require('../server'),
    helpers     = require('./helpers');

var client = helpers.getClient();

var LIST_NAME       = 'test list',
    NEW_LIST_NAME   = 'new test list';

describe('Lists', function() {
    before(function(done) {
        server.start(function() {
            helpers.removeAllLists(done);
        });
    });
    
    after(function(done) {
        server.stop(function() {
            helpers.removeAllLists(done);
        });
    });
    
    it('Getting lists', function(done) {
        client.get('/lists', function(err, res, body) {
            body.length.should.equal(0);
            done();
        });
    });
    
    it('Creating a list', function(done) {
        client.post('/lists', {name: LIST_NAME}, function(err, res) {
            res.statusCode.should.equal(200);
            
            client.get('/lists', function(err, res, body) {
                body.length.should.equal(1);
                body[0].name.should.equal(LIST_NAME);
                done();
            });
        });
    });
    
    it('Getting subscribers from a list', function(done) {
        client.get('/lists/' + LIST_NAME, function(err, res, body) {
            body.length.should.equal(0);
            done();
        });
    });
    
    it('Updating the name of a list', function(done) {
        let data = {name: NEW_LIST_NAME};
        client.put('/lists/' + LIST_NAME, data, function(err, res) {
            res.statusCode.should.equal(200);
            
            client.get('/lists', function(err, res, body) {
                body.length.should.equal(1);
                body[0].name.should.equal(NEW_LIST_NAME);
                done();
            });
        });
    });
    
    it('Removing a list', function(done) {
        client.del('/lists/' + NEW_LIST_NAME, {}, function(err, res) {
            res.statusCode.should.equal(200);
            
            client.get('/lists', function(err, res, body) {
                body.length.should.equal(0);
                done();
            });
        });
    });
});
