var expect = require('chai').expect;
var memory = require('../../lib/api');

describe('Operations against memory of type None', function() {

  const EXPECTED_STUB_MESSAGE = 'method is stubbed';
  const config = {
    type: 'none'
  };

  function fail(done) {
    return function(ex) {
      done('Unexpected success:' + ex);
    }
  }

  function testResult(expected, done) {
    return function(actual) {
      try {
        expect(actual).to.equal(expected);
        done();
      } catch (ex) {
        done(ex);
      }
    }
  }

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
