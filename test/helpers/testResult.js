var expect = require('chai').expect;

module.exports = function(expected, done) {
  return function(actual) {
    console.log('Testing some', actual);
    try {
      expect(actual).to.deep.equal(expected);
      done();
    } catch (ex) {
      done(ex);
    }
  }
};
