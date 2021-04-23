function loadModelUsingCallback(url, callback) {
  // Wait a few seconds, then execute the callback
  // (simulating a model that loads in less than 5 seconds)
  setTimeout(() => {
    callback(`Example 3: Model ${url} loaded successfully`);
  }, Math.random() * 5000);
}

const onLoad = (result) => {
  console.log(result);
};

loadModelUsingCallback('callback_test_A.file', onLoad);
loadModelUsingCallback('callback_test_B.file', onLoad);
loadModelUsingCallback('callback_test_C.file', onLoad);
loadModelUsingCallback('callback_test_D.file', onLoad);
