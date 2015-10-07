Promise.denodeify = require('./denodeify');
var readFile = Promise.denodeify(require('fs').readFile);

const STUBBED = 'method is stubbed';

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
    return readFile(`${config.local}/${file}`, 'utf8');
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
