var expect = require('chai').expect;
var create = require('../../lib/api');
var fs = require('fs');
var UTF8 = 'utf-8';

describe('Memory Store', function() {

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
      var testFile = JSON.parse(fs.readFileSync('./temp/counter.json', UTF8));
      updateCount = testFile.updates + 1;
      timestamp = timestamp;

      testFile.updates = updateCount;
      testFile.timestamp = timestamp;
      fs.writeFileSync('./temp/counter.json', JSON.stringify(testFile, null, 4), UTF8);
    }

    function storeAgainstMemory() {
      return memory.store('Updating counter');
    }

    function cleanMemory() {
      return memory.clean();
    }

    function finalCheck() {
      var testFile = JSON.parse(fs.readFileSync('./temp/counter.json', UTF8));
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
