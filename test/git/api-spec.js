var expect = require('chai').expect;
var memory = require('../../lib/api');
var testResult = require('../helpers/testResult');
var fail = require('../helpers/fail');
var read = function(file) {
  return require('fs').readFileSync(file, 'utf-8');
};
var write = function(file, contents) {
  return require('fs').writeFileSync(file, contents, 'utf-8');
};

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

  it('should be able to read from a file, and return a promise', function(done) {
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

  it('should be able to write to a file, and return a promise', function(done) {
    try {
      var expectedFile = 'counter.json';
      var expectedResult = JSON.parse(read(`./temp/${expectedFile}`));
      expectedResult.updates = expectedResult.updates + 1;
      expectedResult.timestamp = Date.now();
    } catch (ex) {
      done(ex);
    }

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
        .then(JSON.parse)
        .then(testResult(expectedResult, done), done);
    });
  });

  it('should be able to delete a file, and return a promise', function(done) {

    memory(testConfig).then(function(instance) {
      var expectedFile = 'test.file';
      var uniqueData = 'Time: ' + Date.now();

      return instance.write(expectedFile, uniqueData).then(function() {
          // Check that the file has been written
          var sanityCheck = read(`./temp/${expectedFile}`);
          expect(sanityCheck).to.equal(uniqueData);
        })
        .then(function() {
          // Go delete the file
          return instance.delete(expectedFile);
        })
        .then(function(actualFile) {
          // Check that file name is returned from delete
          expect(actualFile).to.equal(expectedFile);
        })
        .then(function() {
          // Expecting this read to fail as part of the test
          return instance.read(expectedFile);
        })
        .then(function(contents) {
          expect(contents).to.not.deep.equal(uniqueData);
        }).catch(function(ex) {
          if (ex.toString().indexOf('ENOENT') !== -1) {
            done();
          } else {
            done(ex);
          }
        });
    });
  });
});
