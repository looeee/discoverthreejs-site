function loadModelUsingCallback(url, callback) {
  // Wait a few seconds, then execute the callback
  // (simulating a model that loads in 3 seconds)
  setTimeout(() => {
    callback(`Example 2: Model ${url} loaded successfully`);
  }, 3000);
}

loadModelUsingCallback('callback_test.file', (result) => {
  console.log(result);
});
