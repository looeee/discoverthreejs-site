
### Accessing Data in Callbacks

`onLoad`, `onProgress`, and `onError` are each automatically called by the loader at the appropriate time with some data (e.g. `gltfData`) as an argument:

``` js
loader.load(
  '/assets/models/Parrot.glb',

  // the function is called as onLoad(gltfData)
  // when loading has finished
  onLoad,

  // the function is called as onProgress(XMLHttpRequest)
  // as loading progresses
  onProgress,

  // the function is called as onError(errorData)
  // when an error occurs
  onError
);
```

Then, **when we write our callback we include that argument as parameter**:

``` js
const onLoad = (gltfData) => {
  console.log(gltfData);
};

const onError = (errorData) => {
  console.log(errorData);
}
```

We can call this data whatever we like. For example, `errorData` is commonly abbreviated as `error`, `err`, or even just `e`:

``` js
// these are equivalent
const onError = (error) => {
  console.log(error);
}

const onError = (err) => {
  console.log(err);
}

const onError = (e) => {
  console.log(e);
}
```