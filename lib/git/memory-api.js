function configure(config) {
  var git;
  var memory = {};

  function initialise(memory) {
    function complete() {
      return memory;
    }

    git = require('./git')(config);

    return git.initialise().then(complete);
  }

  memory.read = function(file) {
    return Promise.reject(STUBBED);
  };
  memory.write = function(file, contents) {
    return Promise.reject(STUBBED);
  };
  memory.delete = function(file) {
    return Promise.reject(STUBBED);
  }
  memory.store = function(message) {
    return git.commit(message).then(git.push);
  };
  memory.destroy = function() {
    return git.clean();
  };

  return initialise(memory);
}

module.exports = configure;
