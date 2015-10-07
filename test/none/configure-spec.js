var expect = require('chai').expect;
var memory = require('../../lib/api');

describe('Configuring memory', function() {

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

    memory(badConfig).then(fail, testRejection);
  });

  it('should accept a promise based on a valid memory type', function(done) {
    var validConfig = {
      type: 'none'
    };

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

    memory(validConfig).then(testExpected, done);
  });
});
