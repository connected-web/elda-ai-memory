# elda-ai Memory
Methods for external memory storage.

In the structure of `elda-ai` *memory* is considered as long term storage of information.

## Development
Running tests:

```
npm install
npm test
```

## API
### Configure
When you require `elda-ai-memory`, it returns a function that can be used to configure a memory interface.

The stub configuration is:

```js
var config = {
  type: 'none';
};
```

Where as a configuration using git is:
```js
var config =  {
  type: 'git',
  remote: 'git@github.com:elda-ai/memory-training.git',
  local: process.cwd() + '/memory',
  user: {
    name: 'elda-ai',
    email: 'elda-ai@mkv25.net'
  }
};
```

Pass the config into the memory function to return a promise. The promise resolves to a usable instance. During this step, files are downloaded from the remote and stored locally; this may take several seconds depending on the size of the remote.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  /* ... do stuff with instance ... */
});
```

* If there is an error with the supplied config, it should fail fast with a rejected promise.
* External memory is treated as a local copy which upon which you can `read` and `write`. Later `store` can be used to push changes, and `destroy` used to clean up the local copy.

### Read
External memory is expected to be made up of files. These files can be read from the local copy using a relative path to the root of the external files.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  return instance.read('file/name.json').then(function(contents) {
    console.log('Read from file:', contents);
  });
});
```

### Write
Files can be created and updated by using write. Writing will only update the local copy until `store` is called.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  // Write a file
  var data = JSON.stringify({data: "some data"});
  return instance.write('file/new.json', data).then(function(name) {
    console.log('Wrote to file:', name);
  });
});
```

### Delete
Files can be deleted from the local memory. Deleted files will only affect the remote when `store` is called.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  // Delete a file
  return instance.delete('file/to/delete.json').then(function(name) {
    console.log('Deleted file:', name);
  });
});
```

### Store
Store pushes any local changes to the remote location with a message.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  // Store local changes back to server
  var message = 'New files added';
  return instance.store(message).then(function() {
    console.log('Files stored in external memory:', message);
  });
});
```

### Destroy
Destroy removes all local files stored on the machine relating to the remote.

```js
var memory = require('elda-ai-memory');
memory(config).then(function(instance) {
  // Destroy local copy of files
  return instance.destroy().then(function() {
    console.log('Local files removed');
  });
});
```

## Git configuration
This configuration assumes you have the command line version of git installed on the machine, and that you have correct access rights to the remote repository.

Worked example:

```js
var memory = require('elda-ai-memory');
var config =  {
  type: 'git',
  remote: 'git@github.com:elda-ai/memory-training.git',
  local: process.cwd() + '/memory',
  user: {
    name: 'elda-ai',
    email: 'elda-ai@mkv25.net'
  }
};

// Retrieve files from external memory
memory(config).then(function(instance) {

  function readAFile() {
    // Read a file
    return instance.read('file/name.json').then(function(contents) {
      console.log('Read from file:', contents);
    });
  }

  function writeAFile() {
    // Write a file
    var data = JSON.stringify({data: "some data"});
    return instance.write('file/new.json', data).then(function(name) {
      console.log('Wrote to file:', name);
    });
  }

  function deleteAFile() {
    // Delete a file
    return instance.delete('file/to/delete.json').then(function(name) {
      console.log('Deleted file:', name);
    });
  }

  function storeChanges() {
    // Store local changes back to server
    var message = 'New files added';
    return instance.store(message).then(function() {
      console.log('Files stored in external memory:', message);
    });
  }

  function destroyLocalCopy() {
    // Destroy local copy of files
    return instance.destroy().then(function() {
      console.log('Local files removed');
    });
  }

  return readExample()
    .then(readAFile)
    .then(writeAFile)
    .then(deleteAFile)
    .then(storeChanges)
    .then(destroyLocalCopy);
});
```
