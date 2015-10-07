module.exports = function(done) {
  return function(ex) {
    done('Unexpected success:' + ex);
  }
};
