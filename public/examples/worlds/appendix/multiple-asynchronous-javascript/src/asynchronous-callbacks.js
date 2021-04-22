// An asynchronous callback.
// This is a callback function that executes after some time.
// We are using SetTimeout to simulate an asynchronous operation

// The callback.
// Note that we're using almost the exact same callback for both synchronous
// and asynchronous callbacks operations
const onLoad = result => {
  console.log(result);
};

function loadModelAsync(callback) {
  // wait a few seconds, then execute the callback
  // (simulating a model that loads in 3 seconds)
  setTimeout(() => {
    callback('Asynchronous callback function executed');
  }, 3000);
}

loadModelAsync(onLoad);
