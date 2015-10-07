function runCommand(command) {
  return new Promise(function(accept, reject) {

    var exec = require('child_process').exec;
    var child = exec(command, function(error, stdout, stderr) {

      var result = {
        error: error,
        stdout: stdout,
        stderr: stderr
      };

      if (error) {
        // console.log('Rejecting', result, 'on', command);
        reject(result)
      } else {
        accept(result);
      }
    });
  });
}

module.exports = runCommand;
