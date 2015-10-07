const STUBBED = 'method is stubbed';

function configure(config) {
  var memory = {};

  memory.read = function(file) {
    return Promise.reject(STUBBED);
  };
  memory.write = function(file, contents) {
    return Promise.reject(STUBBED);
  };
  memory.delete = function(file) {
    return Promise.reject(STUBBED);
  }
  memory.store = function() {
    return Promise.reject(STUBBED);
  };
  memory.destroy = function() {
    return Promise.reject(STUBBED);
  };

  return Promise.resolve(memory);
}

module.exports = configure;
