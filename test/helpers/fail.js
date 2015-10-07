module.exports = function(done) {
  return function(ex) {
    console.error(ex);
    done('Unexpected success:' + ex);
  }
};
