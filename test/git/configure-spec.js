var expect = require('chai').expect;
var memory = require('../../lib/api');
var fs = require('fs');
var UTF8 = 'utf-8';

describe('Configure memory of type Git', function() {

  var testConfig = require('../fixtures/git-memory-config');

  it('should accept a promise based on a valid memory type', function(done) {

    function testExpected(instance) {
      try {
        expect(instance).to.have.property('read');
        expect(instance).to.have.property('write');
        expect(instance).to.have.property('delete');
        expect(instance).to.have.property('store');
        expect(instance).to.have.property('destroy');
        done();
      } catch (ex) {
        done(ex);
      }
    }

    memory(testConfig).then(testExpected, done);
  });

  it('should retreive files from a remote location', function(done) {

    function test() {
      var testFile = JSON.parse(fs.readFileSync('./temp/info.json', UTF8));
      expect(testFile).to.have.property('file', 'info.json');
      done();
    }

    memory(testConfig).then(test, done);
  });
});
