function configure(config) {
  var memory = {};

  memory.store = function() {};
  memory.clean = function() {};

  return Promise.resolve(memory);
}

module.exports = configure;
