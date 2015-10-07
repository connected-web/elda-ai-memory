var tempDir = process.cwd() + '/temp';

module.exports = {
  type: 'git',
  local: tempDir,
  remote: 'git@github.com:connected-web/remote-test.git',
  user: {
    name: 'Elda Test',
    email: 'elda-ai@mkv25.net'
  },
  log: function() {
    // Implement tabbed console log to merge inline with test description
    var args = [].slice.call(arguments);
    args.unshift('    *');
    console.log.apply(this, args);
  }
};
