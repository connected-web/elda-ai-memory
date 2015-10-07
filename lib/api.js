var types = {
  'git': require('./git/memory-api'),
  'none': require('./none/memory-api')
};

function configure(config) {
  try {
    var memoryApi = require(`./${config.type}/memory-api`);
    return memoryApi(config);
  } catch (ex) {
    console.error(ex);
    return Promise.reject(`Unrecognised memory type ${config.type}`);
  }
}

module.exports = configure;
