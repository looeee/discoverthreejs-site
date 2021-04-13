function loadModelUsingPromise(url) {
  return new Promise((resolve, reject) => {
    // Wait a few seconds, then execute the callback
    // (simulating a model that loads in 5 seconds)
    setTimeout(() => {
      resolve(`Example 7: Model ${url} loaded successfully`);
    }, 5000);
  });
}

async function main() {
  const result = await loadModelUsingPromise('async_test.file');

  console.log(result);
}

main().catch((err) => {
  console.log(err);
});
