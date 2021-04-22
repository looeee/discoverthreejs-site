function loadModelUsingPromise(url) {
  return new Promise((resolve, reject) => {
    // Wait a few seconds, then resolve the promise
    // (simulating a model that loads in 4 seconds)
    setTimeout(() => {
      resolve(`Example 4: Model ${url} loaded successfully`);
    }, 4000);
  });
}

loadModelUsingPromise('promises_test.file')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
