Promise.denodeify = require('./denodeify');
var fs = require("fs")
var readFile = Promise.denodeify(fs.readFile);

var mkdirp = require("mkdirp")
var getDirName = require("path").dirname
var writeFile = Promise.denodeify(function(path, contents, options, cb) {
  mkdirp(getDirName(path), function(err) {
    if (err) return cb(err);
    fs.writeFile(path, contents, options, cb);
  });
});

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
    return writeFile(`${config.local}/${file}`, contents, 'utf8')
      .then(function() {
        return git.add(file);
      }).then(function() {
        return file;
      });
  };

  memory.delete = function(file) {
    return git.remove(`${config.local}/${file}`).then(function() {
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
