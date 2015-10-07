var expect = require('chai').expect;
var memory = require('../../lib/api');
var testResult = require('../helpers/testResult');
var fail = require('../helpers/fail');
var read = function(file) {
  return require('fs').readFileSync(file, 'utf-8');
}

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
      var testFile = JSON.parse(read('./temp/info.json'));
      expect(testFile).to.have.property('file', 'info.json');
      done();
    }

    memory(testConfig).then(test, done);
  });

  it('should accept a promise with the file contents when asked to read', function(done) {
    var expected = JSON.stringify({
      "file": "info.json",
      "message": "If you're reading this JSON file you've successfully accessed the remote tes"
    }, 4);

    memory(testConfig).then(function(instance) {
      return instance.read('some/file.json').then(testResult(expected, done), done);
    });
  });
});
