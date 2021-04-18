function loadModelUsingPromise(url) {
  return new Promise((resolve, reject) => {
    // Wait a few seconds, then execute the callback
    // (simulating a model that loads in exactly 5 seconds)
    setTimeout(() => {
      resolve(`Example 8: Model ${url} loaded successfully`);
    }, 5000);
  });
}

async function main() {
  console.time('Total loading time: ');

  const [modelA, modelB, modelC, modelD] = await Promise.all([
    loadModelUsingPromise('async_A.file'),
    loadModelUsingPromise('async_B.file'),
    loadModelUsingPromise('async_C.file'),
    loadModelUsingPromise('async_D.file'),
  ]);

  console.timeEnd('Total loading time: ');

  console.log(modelA);
  console.log(modelB);
  console.log(modelC);
  console.log(modelD);
}

main().catch((err) => {
  console.log(err);
});
