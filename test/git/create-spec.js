var expect = require('chai').expect;
var create = require('../../lib/api');
var fs = require('fs');
var UTF8 = 'utf-8';

describe('Memory Create', function() {

  it('should reject a promise based on an unrecognised memory type', function(done) {
    var expected = 'made up type';
    var badConfig = {
      type: expected
    };

    function fail() {
      done('Unexpected success');
    }

    function testRejection(actual) {
      try {
        expect(actual).to.equal(`Unrecognised memory type ${expected}`);
        done();
      } catch (ex) {
        done(ex);
      }
    }

    create(badConfig).then(fail, testRejection);
  });

  it('retreive files from a remote location', function(done) {

    var testConfig = require('../fixtures/git-memory-config');

    function test() {
      var testFile = JSON.parse(fs.readFileSync('./temp/info.json', UTF8));
      expect(testFile).to.have.property('file', 'info.json');
      done();
    }

    create(testConfig).then(test, done);
  });
});
