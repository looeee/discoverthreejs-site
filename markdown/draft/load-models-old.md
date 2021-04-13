### The Loading Manager

You can pass an optional [loading manager](https://threejs.org/docs/#api/en/loaders/managers/LoadingManager) to the constructor:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="The LoadingManager class" >}}
import { LoadingManager } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const manager = new LoadingManager();
const loader = new GLTFLoader(manager);
{{< /code >}}

However, if you omit this, three.js will use the [`DefaultLoadingManager`](https://threejs.org/docs/#api/en/loaders/managers/DefaultLoadingManager), which is fine for most situations.



### The `onProgress` Callback

`.loadAsync` takes two arguments. The first is the path or URL to your model, and the second is an optional `onProgress` callback, which will be called repeatedly as loading progresses:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="GLTFLoader: optional onProgress callback" >}}
const loader = new GLTFLoader();

const loadedData = await loader.loadAsync('path/to/yourModel.glb', (progressData) => {
  console.log(progressData);
});
{{< /code >}}

`progressData` is an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object that contains data about loading progress. You can use this to set up a loading bar, for example.

In this chapter, to keep things simple, we'll skip the `onProgress` callback.

### `Loader.setPath`

Suppose you have ten files to load, called _**model01_.glb**_, _**model02.glb**_, _**model03.glb**_, all the way to up to _**model10.glb**_. Suppose further that these files are in the folder _**some/long/long/very/long/folder/path/**_. Rather than typing the folder over and over, you can set the asset path:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Loader.setPath" >}}
const loader = new GLTFLoader();

loader.setPath('some/long/long/very/long/folder/path/');

const loadedData01 = await loader.loadAsync('model01_.glb');
const loadedData02 = await loader.loadAsync('model02_.glb');
const loadedData03 = await loader.loadAsync('model03_.glb');
...
const loadedData10 = await loader.loadAsync('model10.glb');
{{< /code >}}

### and `Loader.setResourcePath`

You can load either `.gltf` or `.glb` files using `.load` or `.loadAsync`. These files may also come with additional resources. `.gltf` files come with an extra `.bin` data files, while both file types may have additional textures, usually in PNG or JPG format.

By default, the loader expects you to place additional resources in the same folder as the main file. Here's [one example of a `.gltf` file that comes with both `.bin` and textures](https://github.com/mrdoob/three.js/tree/master/examples/models/gltf/BoomBox/glTF).

This can get in the way of organizing you code. For example, what if you want to put models in the _**models/**_ folder and textures in the _**textures/**_ folder? `.setResourcePath` to the rescue!

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Loader.setResourcePath" >}}
const loader = new GLTFLoader();

loader.setPath('assets/models');
loader.setResourcePath('assets/textures');

const loadedData01 = await loader.loadAsync('model01.glb');
{{< /code >}}

Note that you'll have to place `.bin` files in the textures folder here. However, it's usually better to use compressed `.glb` files, so this is rarely a problem.


**************************************************
The `.load` method takes four parameters:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="GLTFLoader.load" >}}
loader.load(url, onload, onProgress, onError);
{{< /code >}}

* **`url` is a string containing the URL or path to the file we want to load.**
* **The `onLoad` callback function will be called once the file has finished loading.**
* **The `onProgress` callback function will be called repeatedly as loading progresses.**
* **The `onError` callback function will be called if loading fails.**

Each of the callback function is passed some data as an argument:

* **`onLoad` is called with the loaded glTF data as an argument.**
* **`onProgress` is called with an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) instance that contains data about loading progress.**
* **`onError` is called with data related to the type of error that occurred.**

#### The `onLoad` Callback

A very basic implementation of the `onLoad` callback looks like this:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="The onLoad callback" >}}
const onLoad = (gltfData) => {
  console.log(gltfData);
};
{{< /code >}}

Here, we are simply logging the loaded data to the console. We have called this data `gltfData`, although we can give this variable any name we like.

#### The `onProgress` Callback

`onProgress` is optional, so to keep things simple in this chapter, we will skip this callback. In a more complex application, you might use this to set up a loading bar, for example.

#### The `onError` Callback

If the file fails to load (for example, if the `url` parameter is incorrect, or there is a network error), the `onError` callback will be called.

**`onError` is optional, but since it's good practice to handle errors gracefully, we will always include this callback.**

Here, we will log the error data to the console:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="The onError callback" >}}
const onError = (errorData) => {
  console.error(errorData);
};
{{< /code >}}


### Omit an Optional Callback

If we want to omit an optional callback, we can pass `null` instead. Here, we are skipping `onProgress`:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="GLTFLoader.load" >}}
loader.load(
  '/assets/models/Parrot.glb',
  onLoad,
  null,
  onError
);
{{< /code >}}


### Complete Code for Loading a glTF File

Here is the complete code required to load a glTF file using the `GLTFLoader`:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="GLTFLoader minimal complete example" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader();

const onLoad = (gltfData) => {
  console.log(gltfData);
};

const onError = (errorData) => {
  console.error(errorData);
};

loader.load(
  '/assets/models/Parrot.glb',
  onLoad,
  null,
  onError
);
{{< /code >}}

Of course, it doesn't do anything very interesting yet, only logs the loaded data to the console. Next we need to figure out how to use the loaded data.


## The `ModelLoader` Class

We'll create a new module called `ModelLoader` to handle loading models. If you are following along from the previous chapter, replace **_Train.js_** with a new file called **_birds.js_**.

Inside this new file, first, we'll import the `GLTFLoader`, and then we'll create a new `ModelLoader` class. We will also create an instance of the `GLTFLoader` in the constructor.

Finally, we'll export the new `ModelLoader` class, just as we did with the `Train` in the previous chapter:

{{< code lang="js" linenos="true" linenostart="0" hl_lines="" caption="ModelLoader class initial structure" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
  }
}
export { ModelLoader };
{{< /code >}}

### Create `.load`, `.onLoad`, and `.onError` Methods

Next, we'll add three new methods called `.load`, `.onLoad`, and `.onError` to our new class. These are almost exactly the same as the [code we wrote above for loading a glTF file](#complete-code-for-loading-a-gltf-file).

The `.load` method is a wrapper for `GLTFLoader.load`, while `.onLoad` and `.onError` simply log data to the console for now. `onProgress` is `null`, as before:

{{< code lang="js" linenos="true" linenostart="0" hl_lines="" caption="ModelLoader" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
  }

  // Called when loading is complete
  onLoad(gltfData) {
    console.log(gltfData);
  }

  // called if the loader encounters and error
  onError(errorData) {
    console.error(errorData);
  }

  load(url) {
    this.loader.load(
      url,
      this.onLoad,
      null,
      this.onError
    )
  }
}

export { ModelLoader };
{{< /code >}}

We won't need to make any further changes to `.onError`, but once we have successfully loaded a model, we'll update `.onLoad` to add the model to our scene.

### Use the New `ModelLoader` Class in `World`

To use the `ModelLoader` class in `World`, the first thing we need to do is import it (again, if you are following along from the previous chapter, replace the `Train` import with `ModelLoader`):

{{< code file="worlds/first-steps/load-models/src/World/World.js" from="1" to="14" lang="js" linenos="true" hl_lines="14" caption="World imports" >}}{{< /code >}}

Delete the old `.createMeshes` method and replace it with a new `.loadModels` method. Inside this method, create a new instance of `ModelLoader`:

{{< code lang="js" linenos="true" linenostart="60" hl_lines="" caption="World.loadModels" >}}
loadModels() {
  const modelLoader = new ModelLoader();
}
{{< /code >}}

Next, call the new method in the `World` constructor:

{{< code file="worlds/first-steps/load-models/src/World/World.js" from="17" to="30" lang="js" linenos="true" hl_lines="10" caption="World.constructor" >}}{{< /code >}}

### Load the Parrot Model

With that, we are ready to load a model in our app! Here, we'll load the **_Parrot.glb_** file from the _**assets/models**_ folder:

{{< code lang="js" linenos="true" linenostart="60" hl_lines="" caption="World.loadModels" >}}
loadModels() {
  const modelLoader = new ModelLoader(this.scene);

  // Load a model asynchronously,
  // don't make any assumption about
  // when (or if!) it will finish loading
  modelLoader.load('/assets/models/Parrot.glb');
}
{{< /code >}}

If everything works correctly, you will have just loaded your first model. Well done!

Of course, we still need to add it to the scene before we can see it

{{% aside %}}
### The `.copy` Method

Note the use of `.position.copy` here. In a previous chapter, we saw that {{< link path="book/first-steps/organizing-with-group/#introduce-clone" title="most objects in three.js have a `.clone` method" >}}, which creates a new object with the same settings as the cloned object.

Similarly, most objects also have a `.copy` method, which can be used to quickly copy the properties from another object of the same type into this one:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Most object have a copy method" >}}
meshA.copy(meshB);

cameraA.copy(cameraB);

lightA.copy(lightB);
{{< /code >}}

Or, as we are doing here:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
const positionVector = new Vector3(2,2,2);
mesh.position.copy(positionVector);
{{< /code >}}

{{% /aside %}}

## Add the Mesh to Our Scene

We have a reference to the `parrotModel`, so now we just need to add it to `World.scene`. Unfortunately, due to the nature of asynchronous callback functions, this is not quite as straightforward as we would like it to be.

To add the `parrotModel` to our scene, we need to run this line of code:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="World.scene" >}}
World.scene.add(parrotModel);
{{< /code >}}

At the moment though, the `parrotModel` is in the `ModelLoader` class, and the `scene` is in the `World` class.

To overcome this, we have two options:

1. **Send `parrotModel` into `World`**.
2. **Send the `scene` into `ModelLoader.onLoad`**.

If we choose option one, we can treat the `parrotModel` exactly as we have treated every other mesh since {{< link path="book/first-steps/first-scene/#add-the-mesh-to-the-scene" title="the very first mesh we ever created" >}}. Clearly that's the best choice here. After all, **the `parrotModel` is just a mesh** - the only difference is that we loaded this one from a file instead of creating it manually.

Unfortunately, due to the way asynchronous callback functions work, option one is not possible. Instead, **we have to do _everything_ related to setting up the model in `onLoad`**. That means adding the model to the scene, setting its position, rotation, or scale, setting up animations, and so on, all have to be done inside `onLoad`.

For a lot more detail about this, including better solutions using Promises and Async functions, check out {{< link path="/book/appendix/asynchronous-javascript" title="" >}}.

In the meantime, we'll stick with option two and press on.

### Send the `scene` into `ModelLoader.onLoad`

First, we'll pass the `scene` into the `ModelLoader`'s constructor:

{{< code file="worlds/first-steps/load-models/src/World/World.js" from="61" to="68" lang="js" linenos="true" hl_lines="2" caption="World.js" >}}{{< /code >}}

Then, we'll store `scene` as a member variable inside `ModelLoader`:

{{< code file="worlds/first-steps/load-models/src/World/components/birds/birds.js" from="3" to="7" lang="js" linenos="true" hl_lines="3" caption="ModelLoader.constructor" >}}{{< /code >}}

Now we can try to use `this.scene` in the `.onLoad` method:

{{< code lang="js" linenos="true" linenostart="9" hl_lines="" caption="ModelLoader.onLoad" >}}
onLoad(gltfData) {
  const model = gltfData.scene.children[0];

  // this line will fail: "this" is undefined
  this.scene.add(model);
}
{{< /code >}}

However, when you do this, you will receive an error message saying that `this.scene` cannot be found.

### Scope Error!

We have just run into the **dreaded JavaScript scope error**. These can be tricky to understand, especially if you are new to JavaScript. What's happened here is that we have tried to access `this.scene` from the **wrong scope**, so it could not be found.

When we are inside the `ModelLoader` class, we can use `this` to refer to the class instance, and then we can find any member variables such as `this.scene`.

Here, we _think_ we are calling `.onLoad` from inside `ModelLoader`. However, we passed `.onLoad` as a callback into `GLTFLoader.load` and its being called from there, inside the `GLTFLoader` where it no longer has access to the `ModelLoader` scope.

If this is all new to you, it's worth spending the time to research how scope in JavaScript works. It's not too complicated, but will lead to confusing errors like this if you don't understand it. Here, rather than get into a deep discussion of scope we'll simply present a solution.

Once again, we go into this in a lot more detail in {{< link path="/book/appendix/asynchronous-javascript" title="" >}}. If asynchronous operations are new to you, read over at least the section on callbacks. We'll wait here for you.

### Callback Wrapper Function

There are a couple of ways to solve this problem.

The one we'll use here is to wrap `.onLoad` in a simple outer function, or **wrapper function**. **This creates a closure that will bind the `ModelLoader` scope making `this` available inside `.onLoad` once again**:

{{< code lang="js" linenos="true" linenostart="26" hl_lines="3-5 9" caption="ModelLoader.load" >}}
load(url) {
  const onLoadWrapper = (gltfData) => {
    this.onLoad(gltfData);
  }

  this.loader.load(
    url,
    onLoadWrapper,
    this.onProgress,
    this.onError,
  );
}
{{< /code >}}

We can shorten `onLoadWrapper` and write it on a single line:

{{< code lang="js" linenos="true" linenostart="27" hl_lines="" caption="ModelLoader.load" >}}
const onLoadWrapper = gltfData => this.onLoad(gltfData);
{{< /code >}}

...and we can shorten this again by writing it inline:

{{< code lang="js" linenos="true" linenostart="27" hl_lines="5" caption="ModelLoader.load" >}}
load(url) {
  this.loader.load(
    url,
    gltfData => this.onLoad(gltfData),
    this.onProgress,
    this.onError,
  );
}
{{< /code >}}

Once you add this wrapper function, the `parrotModel` should show up in your scene.

### Passing Custom Parameters to a Callback Function

Look at [the basic `onLoad` callback](#the-onload-callback) from earlier in this chapter once again:

{{< code lang="js" linenos="false" linenostart="" hl_lines="" caption="onLoad takes a single parameter, gltfData" >}}
const onLoad = (gltfData) => {
  console.log(gltfData);
};

loader.load(
  url,
  onLoad,
  onProgress,
  onError
);
{{< /code >}}

The callback takes an argument: `gltfData`.

However, we don't write this argument when we pass the callback into `GLTFLoader.load` - it's _implicit_.

But now we want to do something a bit different. We want the callback to take _two_ arguments:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="onLoad with a second parameter" >}}
const onLoad = (gltfData, position) => {
  ...
};
{{< /code >}}

How do we specify that when we pass `onLoad` as a callback into `.load`? This won't work:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="This won't work :/" >}}
loader.load(
  url,
  onLoad(gltfData, position), // No!
  onProgress,
  onError
);
{{< /code >}}

Fortunately, the [callback wrapper](#callback-wrapper-function) function that we created above has a second benefit. It enables us to pass custom arguments to a callback.

Using the wrapper function, we can do this:

{{< code lang="js" linenos="false" linenostart="" hl_lines="" caption="Using onLoadWrapper to pass extra parameters to onLoad" >}}
const position = new Vector3();

const onLoadWrapper = (gltfData) => {
  onLoad(gltfData, position);
}

const onLoad = (gltfData, position) => {
  ...
};

loader.load(
  url,
  onLoadWrapper,
  onProgress,
  onError
);
{{< /code >}}

Or, once again writing the wrapper function inline:

{{< code lang="js" linenos="true" linenostart="0" hl_lines="10" caption="Using onLoadWrapper to pass extra parameters to onLoad (inline version)" >}}
const position = new Vector3();

const onLoad = (gltfData,position) => {
  ...
};

this.loader.load(
  url,
  gltfData => this.onLoad(gltfData, position),
  this.onProgress,
  this.onError,
);
{{< /code >}}

So as you can see, the wrapper not only allows us to access `this.scene` in `onLoad`, but also allows us pass as many parameters as we like to a callback. Later, we might want to pass `scale` and `rotation` data as well, for example.

### The `gltfData.scene`

The `gltfData.scene` is an actual instance of a [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene), just like the one in our app. If you like, you can use this directly in your render loop:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Directly using GLTFData.scene" >}}
// replace this
renderer.render(scene, camera);

// ... with this
renderer.render(gltfData.scene, camera);
{{< /code >}}

If you have the luxury of creating your own models or working closely with a 3D artist, you might be able to set up your entire scene in a program like Blender and use this approach.

More likely though, you'll need to process the models before you can use them. In that case, you need to search through the `gltfData.scene` to find the models you want, as we'll do below.