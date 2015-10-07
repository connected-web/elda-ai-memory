var expect = require('chai').expect;
var memory = require('../../lib/api');
var testResult = require('../helpers/testResult');
var fail = require('../helpers/fail');

describe('Operations against memory of type None', function() {

  const EXPECTED_STUB_MESSAGE = 'method is stubbed';
  const config = {
    type: 'none'
  };

  it('should reject a promise when asked to read', function(done) {
    memory(config).then(function(instance) {
      return instance.read('some/file.json').then(fail(done), testResult(EXPECTED_STUB_MESSAGE, done));
    });
  });

  it('should reject a promise when asked to write', function(done) {
    memory(config).then(function(instance) {
      return instance.write('some/file.json', 'some value').then(fail(done), testResult(EXPECTED_STUB_MESSAGE, done));
    });
  });

  it('should reject a promise when asked to delete', function(done) {
    memory(config).then(function(instance) {
      return instance.delete('some/file.json').then(fail(done), testResult(EXPECTED_STUB_MESSAGE, done));
    });
  });

  it('should reject a promise when asked to store', function(done) {
    memory(config).then(function(instance) {
      return instance.store('Some value').then(fail(done), testResult(EXPECTED_STUB_MESSAGE, done));
    });
  });

  it('should reject a promise when asked to destroy', function(done) {
    memory(config).then(function(instance) {
      return instance.destroy().then(fail(done), testResult(EXPECTED_STUB_MESSAGE, done));
    });
  });
});
