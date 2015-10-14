var command = require('./command')
var rimraf = require('rimraf');

function error(message) {
  throw message;
}

function configure(config) {

  var local = config.local || error('No local path set on supplied git config');
  var remote = config.remote || error('No remote repo set on supplied git config');
  var log = config.log || ((message) => null);

  var git = {};

  git.initialise = function() {
    return git.status()
      .then(git.pull, git.freshCheckout);
  };

  git.status = function() {
    var statusCommand = `cd ${local} && git status`;

    return command(statusCommand);
  };

  git.freshCheckout = function() {
    var user = config.user;

    function configureUserName() {
      return git.configure('user.name', user.name);
    }

    function configureUserEmail() {
      return git.configure('user.email', user.email);
    }

    return git.clean()
      .then(git.clone)
      .then(configureUserName)
      .then(configureUserEmail);
  }

  git.clean = function() {
    return new Promise(function(accept, reject) {
      rimraf(local, accept);
    });
  }

  git.add = function() {
    var addCommand = `cd ${local} && git add .`;

    log('Add command', addCommand);

    return command(addCommand);
  }

  git.remove = function(file) {
    var removeCommand = `cd ${local} && git rm ${file} -f`;

    log('Remove command', file, removeCommand);

    return command(removeCommand);
  }

  git.clone = function() {
    var cloneCommand = `git clone ${remote} ${local}`;

    log('Clone command', cloneCommand);

    return command(cloneCommand);
  }

  git.pull = function() {
    var pullCommand = `cd ${local} && git pull`;

    log('Pull command', pullCommand);

    return command(pullCommand);
  }

  git.push = function() {
    var pushCommand = `cd ${local} && git push`;

    log('Push command', pushCommand);

    return command(pushCommand);
  }

  git.commit = function(message) {
    if (!message) {
      return Promise.reject('No store message provided');
    }

    var commitCommand = `cd ${local} && git commit -am "${message}"`;

    log('Commit command', message, commitCommand);

    return command(commitCommand);
  }

  git.configure = function(key, value) {
    var configureCommand = `cd ${local} && git config ${key} "${value}"`;

    return command(configureCommand);
  }

  git.check = function() {
    var remotesCommand = `cd ${local} && git remote -v`

    return command(remotesCommand).then(function(result) {
      if (result.stdout && result.stdout.indexOf(remote) !== -1) {
        accept();
      } else {
        reject('Local repo did not contain expected remote');
      }
    });
  }

  return git;
}

module.exports = configure;
