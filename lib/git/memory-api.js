Promise.denodeify = require('./denodeify');
var readFile = Promise.denodeify(require('fs').readFile);
var writeFile = Promise.denodeify(require('fs').writeFile);
var deleteFile = Promise.denodeify(require('fs').unlink);

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
    return writeFile(`${config.local}/${file}`, contents, 'utf8').then(function() {
      return file;
    });
  };
  memory.delete = function(file) {
    return deleteFile(`${config.local}/${file}`).then(function() {
      return file;
    });
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
