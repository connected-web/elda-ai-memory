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

describe('Write against memory of type Git', function() {

  var testConfig = require('../fixtures/git-memory-config');

  it('should be able to write a new file to a non-existent folder, and return a promise', function(done) {
    var expectedFile = 'new/folder/test.file';
    var expectedContents = 'Time: ' + Date.now();

    memory(testConfig)
      .then(function(instance) {
        return instance.write(expectedFile, expectedContents)
          .then(function(actualFile) {
            expect(actualFile).to.equal(expectedFile);
          })
          .then(function() {
            return instance.read(expectedFile);
          })
          .then(function(actualContents) {
            expect(actualContents).to.deep.equal(expectedContents);
          })
          .then(function() {
            return instance.delete(expectedFile);
          })
          .then(function(deletedFile) {
            expect(deletedFile).to.deep.equal(expectedFile);
            done();
          });
      })
      .catch(done);
  });
});
