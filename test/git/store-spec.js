var expect = require('chai').expect;
var create = require('../../lib/api');
var read = function(file) {
  return require('fs').readFileSync(file, 'utf-8');
}
var write = function(file, contents) {
  return require('fs').writeFileSync(file, contents, 'utf-8');
}

describe('Store against memory of type Git', function() {

  it('store files to a remote location', function(done) {

    var testConfig = require('../fixtures/git-memory-config');

    var updateCount = 0;
    var timestamp = Date.now();
    var memory;

    function createMemoryStore() {
      return create(testConfig);
    }

    function recreateMemoryStore() {
      return createMemoryStore();
    }

    function storeReference(reference) {
      memory = reference;
    }

    function incrementCounter() {
      var testFile = JSON.parse(read('./temp/counter.json'));
      updateCount = testFile.updates + 1;
      timestamp = timestamp;

      testFile.updates = updateCount;
      testFile.timestamp = timestamp;
      var contents = JSON.stringify(testFile, null, 4);
      write('./temp/counter.json', contents);
    }

    function storeAgainstMemory() {
      return memory.store('Updating counter');
    }

    function cleanMemory() {
      return memory.destroy();
    }

    function finalCheck() {
      var testFile = JSON.parse(read('./temp/counter.json'));
      expect(testFile).to.have.property('updates', updateCount);
      expect(testFile).to.have.property('timestamp', timestamp);
      done();
    };

    createMemoryStore()
      .then(storeReference)
      .then(incrementCounter)
      .then(storeAgainstMemory)
      .then(cleanMemory)
      .then(recreateMemoryStore)
      .then(finalCheck, done);
  });
});
