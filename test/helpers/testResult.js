var expect = require('chai').expect;

module.exports = function(expected, done) {
  return function(actual) {
    try {
      expect(actual).to.equal(expected);
      done();
    } catch (ex) {
      done(ex);
    }
  }
};
