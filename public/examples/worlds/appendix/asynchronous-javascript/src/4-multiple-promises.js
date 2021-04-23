function loadModelUsingPromise(url) {
  return new Promise((resolve, reject) => {
    // Wait a few seconds, then execute the callback
    // (simulating a model that loads in less than 5 seconds)
    setTimeout(() => {
      resolve(`Example 5: Model ${url} loaded successfully`);
    }, Math.random() * 5000);
  });
}

Promise.all([
  loadModelUsingPromise('promise_A.file'),
  loadModelUsingPromise('promise_B.file'),
  loadModelUsingPromise('promise_C.file'),
  loadModelUsingPromise('promise_D.file'),
]).then((results) => {
  const [modelA, modelB, modelC, modelD] = results;

  console.log(modelA);
  console.log(modelB);
  console.log(modelC);
  console.log(modelD);
});
