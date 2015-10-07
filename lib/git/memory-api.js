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

  memory.store = function(message) {
    return git.commit(message).then(git.push);
  };

  memory.clean = function() {
    return git.clean();
  };

  return initialise(memory);
}

module.exports = configure;
