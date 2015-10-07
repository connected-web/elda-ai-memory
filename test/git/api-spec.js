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
    var expected = {
      'file': 'info.json',
      'message': `If you're reading this JSON file you've successfully accessed the remote test`
    };

    memory(testConfig).then(function(instance) {
      return instance.read('info.json')
        .then(JSON.parse)
        .then(testResult(expected, done), done);
    });
  });

  it('should accept a promise with a file name when asked to read, and write to that file with the expected content', function(done) {
    var expectedFile = 'counter.json';
    var expectedResult = JSON.parse(read(`./temp/${expectedFile}`));
    expectedResult.updates = expectedResult.updates + 1;
    expectedResult.timestamp = Date.now();

    var contents = JSON.stringify(expectedResult, null, 4);

    memory(testConfig).then(function(instance) {
      return instance.write(expectedFile, contents)
        .then(function(actualFile) {
          try {
            expect(actualFile).to.equal(expectedFile);
          } catch (ex) {
            done(ex);
            throw ex;
          }
          return instance.read(expectedFile);
        })
        .then(function() {
          return instance.read(expectedFile);
        })
        .then(JSON.parse)
        .then(testResult(expectedResult, done), done);
    });
  });
});
