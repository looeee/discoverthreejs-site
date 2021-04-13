---
title: "Load 3D Models in glTF Format"
description: "Here, we show you how to load complex animated models and add them to your scene. These models were originally created in Blender and exported in glTF format."
date: 2018-04-02
weight: 113
chapter: "1.13"
available: true
showIDE: true
IDEFiles: [
  "assets/models/Flamingo.glb",
  "assets/models/Parrot.glb",
  "assets/models/Stork.glb",
  "worlds/first-steps/load-models/src/World/components/birds/birds.start.js",
  "worlds/first-steps/load-models/src/World/components/birds/birds.final.js",
  "worlds/first-steps/load-models/src/World/components/birds/setupModel.start.js",
  "worlds/first-steps/load-models/src/World/components/birds/setupModel.final.js",
  "worlds/first-steps/load-models/src/World/components/camera.js",
  "worlds/first-steps/load-models/src/World/components/lights.js",
  "worlds/first-steps/load-models/src/World/components/scene.js",
  "worlds/first-steps/load-models/src/World/systems/controls.js",
  "worlds/first-steps/load-models/src/World/systems/renderer.js",
  "worlds/first-steps/load-models/src/World/systems/Resizer.js",
  "worlds/first-steps/load-models/src/World/systems/Loop.js",
  "worlds/first-steps/load-models/src/World/World.start.js",
  "worlds/first-steps/load-models/src/World/World.final.js",
  "worlds/first-steps/load-models/src/main.start.js",
  "worlds/first-steps/load-models/src/main.final.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "vendor/three/examples/jsm/controls/OrbitControls.js",
  "vendor/three/examples/jsm/loaders/GLTFLoader.js",
  "worlds/first-steps/load-models/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/load-models/'
IDEActiveDocument: 'src/World/components/birds/birds.js'
---

{{% note %}}
THIS CHAPTER IS COMPLETE!
{{% /note %}}

# Load 3D Models in glTF Format

{{< inlineScene entry="first-steps/birds-animated.js" class="round" >}}

In the last chapter, we created a simple toy train model using some of the built-in three.js geometries, and it quickly became clear that it would be hard to build anything complex or organic using just these. To create beautiful 3D models, a sophisticated [modeling program](https://en.wikipedia.org/wiki/3D_modeling) is required. You can use three.js to build any kind of 3D application, however, building a modeling app from scratch would be a huge amount of work. A much simpler solution is to use an existing program and export your work for use in three.js...  or, cheat, and download any of the millions of amazing models and other scene assets that are available for free in many places around the web.

In this chapter, we'll show you how to load some models that were created in [Blender](https://www.blender.org/), an open-source 3D graphics application that can be used for modeling, scene building, material creation, animation authoring, and more. Once you have created a model in Blender, you can export your work using a 3D format such as glTF, then use the [`GLTFLoader` plugin](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) to bring the model into three.js.

## The Best Way to Send 3D Assets Over the Web: glTF

There have been many attempts at creating a standard 3D **asset exchange format** over the last thirty years or so. [FBX](https://threejs.org/examples/webgl_loader_fbx.html), [OBJ (Wavefront)](https://threejs.org/examples/#webgl_loader_obj_mtl) and [DAE (Collada)](https://threejs.org/examples/?q=collada#webgl_loader_collada_skinning) formats were the most popular of these until recently, although they all have problems that prevented their widespread adoption. For example, OBJ doesn't support animation, FBX is a closed format that belongs to Autodesk, and the Collada spec is overly complex, resulting in large files that are difficult to load.

{{% note %}}
TODO-LINK: add link to asset section
{{% /note %}}

However, recently, a newcomer called **glTF** has become the de facto standard format for exchanging 3D assets on the web. [glTF](https://www.khronos.org/gltf/) (**GL Transmission Format**), sometimes referred to as the _JPEG of 3D_, was created by the [Kronos Group](https://www.khronos.org/), the same people who are in charge of WebGL, OpenGL, and a whole host of other graphics APIs. Originally released in 2017, glTF is now the best format for exchanging 3D assets on the web, and in many other fields. **In this book, we'll always use glTF, and if possible, you should do the same**. It's designed for sharing models on the web, so the file size is as small as possible and your models will load quickly.

However, since glTF is relatively new, your favorite application might not have an exporter yet. In that case, you can convert your models to glTF before using them, or use another loader such as the `FBXLoader` or `OBJLoader`. All three.js loaders work the same way, so if you do need to use another loader, everything from this chapter will still apply, with only minor differences.

> Whenever we mention glTF, we mean _glTF Version 2_. The original _glTF Version 1_ never found widespread use and is no longer supported by three.js

glTF files can contain models, animations, geometries, materials, lights, cameras, or even entire scenes. This means you can create an entire scene in an external program then load it into three.js.

{{< iframe src="https://threejs.org/examples/webgl_animation_keyframes.html" height="500" title="This entire scene fits in a single `.glb` file." class="" caption="This entire scene fits in a single _**.glb**_ file." >}}

### Types of glTF Files

glTF files come in standard and binary form. These have different extensions:

* **Standard _.gltf_ files are uncompressed and may come with an extra _.bin_ data file.**
* **Binary _.glb_ files include all data in one single file.**


Both standard and binary glTF files may contain textures embedded in the file or may reference external textures. Since binary _**.glb**_ files are considerably smaller, it's best to use this type. On the other hand, uncompressed _**.gltf**_ are easily readable in a text editor, so they may be useful for debugging purposes.

### Free glTF Files on the three.js Repo

There are lots of [free glTF models available on the three.js repo](https://github.com/mrdoob/three.js/tree/master/examples/models/gltf), and amongst these are three simple and beautiful models of a [parrot](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Parrot.glb), a [flamingo](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Flamingo.glb), and a [stork](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Stork.glb), created by the talented people at [mirada.com](http://mirada.com/). These three models are [**low poly**](https://en.wikipedia.org/wiki/Low_poly), meaning they'll run on even the most low-power of mobile devices, and they are even animated.

You can find these three files in the editor, in the _**assets/models/**_ folder. In this chapter, we'll load **_Parrot.glb_**, **_Flamingo.glb_**, and **_Stork.glb_** and then add the bird-shaped meshes each file contains to our scene. In the next chapter, we'll show you how to play the flying animation that is included with each bird.

If you're working locally rather than using the inline code editor, {{< link path="/book/introduction/prerequisites/#a-web-server" title="you'll need to set up a webserver" >}}. Otherwise, due to browser security restrictions, you won't be able to load these files from your hard drive.

{{% aside  %}}

## Asynchronous JavaScript

Whenever we load a model over the internet, we need to do so in a manner that ensures our app continues to run smoothly while the model is loading, and which can also gracefully handle failure if there is a network error. There are several ways to solve this problem using JavaScript, and there's an entire chapter of the appendices dedicated to this subject.

In this chapter, we'll use **async functions** to load the models, and we're going to assume that you have at least some familiarity with these. If these are new to you, or you need a refresher, head over to {{< link path="/book/appendix/asynchronous-javascript/" title="" >}}.

{{% /aside %}}

## The `GLTFLoader` Plugin {#gltf-loader}

To load glTF files, first, you need to add [the `GLTFLoader` plugin](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) to your app. This works the same way as adding the {{< link path="/book/first-steps/camera-controls/#importing-plugins" title="`OrbitControls` plugin" >}}. You can find the loader in [_**examples/jsm/loaders/GLTFLoader.js**_](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js) on the repo, and we have also included this file in the editor. Go ahead and locate the file now.

Importing and creating an instance of the loader works like this:

{{< code lang="js" linenos="false" caption="Import and create an instance of the `GLTFLoader`" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader();
{{< /code >}}

You can use one instance of the loader to load any number of glTF files.

### The `.load` and `.loadAsync` Methods

All three.js loaders have two methods for loading files: the old callback-based [`.load`](https://threejs.org/docs/#examples/en/loaders/GLTFLoader.load) method, and the newer Promise based `.loadAsync` method. Again, refer to chapter {{< link path="/book/appendix/asynchronous-javascript/" title="A.5" >}} where we cover the difference between these two approaches in detail. Promises allow us to use async functions, which in turn results in much cleaner code, so throughout this book, we will always use `.loadAsync`.

{{< code lang="js" linenos="false" caption="`GLTFLoader.loadAsync`" >}}
const loader = new GLTFLoader();

const loadedData = await loader.loadAsync('path/to/yourModel.glb');
{{< /code >}}

## Set Up _**Main.js**_ and _**World.js**_ to Handle Async/Await

The `await` keyword means "wait here until the model has loaded". If you have previously dealt with loading models using callbacks or Promises, then `await` will seem almost magical in its simplicity. However, we need to make a few adjustments to our code before we can use it since we can only use `await` inside a function that has been marked as `async`:

{{< code lang="js" linenos="false" caption="You can only use `await` inside an `async` function" >}}
async function loadingSuccess() {
  // inside an async function: OK!
  await loader.loadAsync('yourModel.glb');
}

function loadingFail() {
  // not inside an async function: ERROR!
  await loader.loadAsync('yourModel.glb');
}
{{< /code >}}

Another issue is that we cannot mark a constructor as async. A common solution to this is to create a separate `.init` method.

{{< code lang="js" linenos="false" caption="The constructor of a class cannot be `async`" >}}
class Foobazzer {
  constructor() {
    // constructor cannot be async: ERROR!
    await loader.loadAsync('yourModel.glb');
  }

  async init() {
    // inside an async function: OK!
    await loader.loadAsync('yourModel.glb')
  }
}
{{< /code >}}

This way, the constructor can handle the synchronous setup of the class, as usual, and then the init method will take over for asynchronous setup. We will use this approach, so we need to create a new `World.init` method.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="We will create a new `World.init` method to handle asynchronous setup" >}}
``` js
class World {
  constructor() {
    // synchronous setup here
    // create camera, renderer, scene, etc.
  }

  async init() {
    // asynchronous setup here
    // load bird models
  }
}
```
{{< /code >}}

Go ahead and add an empty `.init` method to World now, and make sure you mark it `async`. Splitting the setup into synchronous and asynchronous stages like this gives us full control over the setup of our app. In the synchronous stage, we will create everything that doesn't rely on loaded assets, and in the asynchronous stage, we'll create everything that does.

### Mark the `main` Function as Async

Over in _**main.js**_, first, we must also mark the main function as async. This is required so that we can call the async `World.init` method.

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="3" to="3" lang="js" linenos="true" hl_lines="3" caption="_**main.js**_: mark main as `async`" >}}{{< /code >}}

Now we can call both stages of setting up the World app. First, the synchronous constructor, as usual, then the new `.init` method to handle asynchronous tasks.

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="8 11" caption="_**main.js**_: call both synchronous and asynchronous stages of World setup" >}}{{< /code >}}


### Catch Errors

No method of loading files is complete unless we can also handle any errors that occur. Errors can be as simple as a typo in the file name, or something more complex like a network error. Fortunately, with async functions, error handling is also simple. At the bottom of _**main.js**_, replace this line:

{{< code lang="js" linenos="" linenostart="17" caption="_**main.js**_: calling the main() function" >}}
main();
{{< /code >}}

... with:

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="17" to="19" lang="js" linenos="true" caption="_**main.js**_: add a catch method to handle errors" >}}{{< /code >}}

Now any errors will be logged to the console. In a real app, you might want to do more sophisticated error handling, such as displaying a message to the user to let them know that something went wrong. However, while we are in development mode, the most important thing is that all errors are logged to the console where we can see them.

## Create the _**birds.js**_ Module

Now everything is set up and we can go ahead and load our first model. Open (or create) the _**components/birds/birds.js**_ module. Start by importing the `GLTFLoader`, then create an async `loadBirds` function. Inside the function, create an instance of the loader, and finally, export the function at the bottom of the file:

{{< code lang="js" linenos="" caption="_**birds/birds.js**_: initial structure" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadBirds() {
  const loader = new GLTFLoader();
}

export { loadBirds };
{{< /code >}}

The structure of this new module should be familiar to you since it's the same as nearly {{< link path="/book/first-steps/world-app/#systems-and-components" title="every other component we have created so far" >}}. The only difference is the `async` keyword.

Over in World, update the list of imports:

{{< code from="1" to="4" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="1" caption="_**World.js**_: import components" >}}{{< /code >}}

### Load the Parrot

Now, we're ready to load the _**Parrot.glb**_ file using `.loadAsync`. Once you have done so, log the loaded data to the console:

{{< code lang="js" linenos="" linenostart="3" caption="_**birds.js**_: load the Parrot" >}}
async function loadBirds() {
  const loader = new GLTFLoader();

  const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');

  console.log('Squaaawk!', parrotData);
}
{{< /code >}}

Next, call the `loadBirds` in `World.init`:

{{< code lang="js" linenos="" linenostart="36" caption="_**World.js**_: load the birds!" >}}
async init() {
  await loadBirds();
}
{{< /code >}}

## Data Returned by the `GLTFLoader` {#returned-gltf-data}

We need to take a deeper look at the data we have just loaded before we can add the model to our scene, so for now we've simply logged the data to the console. Open up the browser console (press F12). You should see the word _Squaaawk!_ followed by an Object containing the loaded data. This Object contains meshes, animations, cameras, and other data from the file:

{{< code lang="js" linenos="false" caption="Data return by the `GLTFLoader`" >}}
{
  animations: [AnimationClip]
  asset: {generator: "Khronos Blender glTF 2.0 I/O", version: "2.0"}
  cameras: []
  parser: GLTFParser {json: {…}, extensions: {…}, options: {…}, cache: {…}, primitiveCache: {…}, …}
  scene: Scene {uuid: "1CF93318-696B-4411-B672-4C12C46DF7E1", name: "Scene", type: "Scene", parent: null, children: Array(0), …}
  scenes: [Scene]
  userData: {}
  __proto__: Object
}
{{< /code >}}

{{% note %}}
TODO-LOW: convert list to table without header
{{% /note %}}

* **`gltfData.animations`** is an array of animation clips. Here, there's a flying animation. We'll make use of this {{< link path="/book/first-steps/animation-system/" title="in the next chapter" >}}.
* **`gltfData.assets`** contains metadata showing this glTF file was created using the [Blender](https://www.blender.org/) exporter.
* **`gltfData.cameras`** is an array of cameras. This file doesn't contain any cameras, so the array is empty.
* **`gltfData.parser`** contains technical details about the `GLTFLoader`.
* **`gltfData.scene`** is a {{< link path="/book/first-steps/organizing-with-group/#hello-group" title="`Group`" >}} containing any meshes from the file. **This is where we'll find the parrot model.**
* **`gltfData.scenes`**: The glTF format supports storing multiple scenes in a single file. In practice, this feature is rarely used.
* **`gltfData.userData`** may contain additional non-standard data.

_`__proto__` is a standard property that every JavaScript object has, you can ignore that._

Usually, all you need is **`.animations`**, **`.cameras`**, and **`.scene`** (not `.scenes`!) and you can safely ignore everything else.

{{% note %}}
TODO-LINK: link to animation chapter
{{% /note %}}

## Process the Loaded Data

Extracting data from a glTF file usually follows a predictable pattern, especially if the file contains a single animated model, as these three files do. This means we can create a `setupModel` function and then run it on each of the three files. We'll do this in a separate module. Open or create the _**birds/setupModel.js**_ module, and create the function, following the now-familiar pattern:

{{< code lang="js" linenos="" caption="_**birds/setupModel.js**_: initial structure" >}}
function setupModel(data) {}

export { setupModel };
{{< /code >}}

The idea of this function is that we can pass in the loaded data and get back the bird model, ready to be added to the scene. Next, import this new module into _**birds.js**_, then pass in the loaded data. Finally, return the results for use within World.

{{< code lang="js" linenos="" hl_lines="3 12 14" caption="_**birds.js**_: process loaded data" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';

async function loadBirds() {
  const loader = new GLTFLoader();

  const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');

  console.log('Squaaawk!', parrotData);

  const parrot = setupModel(parrotData);

  return { parrot }
}
{{< /code >}}

### Extract the Mesh from the Loaded Data

At this point, we have the unprocessed loaded data within the `setupModel` function. The next step is to extract the model, and then do any processing to prepare it for use. The amount of work we need to do here depends on the model, and what we want to do with it. Here, all we need to do is extract the mesh, but in the next chapter, we'll have a bit more work to do as we connect the animation clip to the mesh.

Look at the loaded data in the console again, and expand the `gltfData.scene`. This a {{< link path="/book/first-steps/organizing-with-group/#hello-group" title="`Group`" >}}, and any meshes that are in the file will be {{< link path="/book/first-steps/transformations/#the-scene-graph" title="children of the group" >}}. These can be accessed using the {{< link path="/book/first-steps/transformations/#accessing-a-scene-objects-children" title="`group.children`" >}} array. If you look inside there, you'll see that `glTF.scene.children` has only one object inside it, so that must be our parrot model.

Using this knowledge, we can finish the `setupModel` function:

{{< code file="worlds/first-steps/load-models/src/World/components/birds/setupModel.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="2 4" caption="_**setupModel.js**_: extract the model from the loaded data" >}}{{< /code >}}

_Note A: if you click the toggle to complete the scene in the editor, then view the `gltfData.scene.children` array in the console, it will be empty. This is because, by the time you look at it, the mesh has already been removed and added to the scene._

_Note B: you could also just add the `gltf.scene` to your scene since it's a group. That would add an additional node to your scene graph but everything will still work. However, it's best practice to keep your scene graph as simple as possible, since every node means additional calculations are required to render the scene._

### Add the Mesh to the Scene

Over in World, `loadBirds` now returns the parrot mesh and you can add it to the scene:

{{< code lang="js" linenos="" hl_lines="35 37" linenostart="34" caption="_**World.js**_: add the mesh to the scene" >}}
  async init() {
    const { parrot } = await loadBirds();

    scene.add(parrot);
  }
{{< /code >}}

## Load the Other Two Birds

You can use a single instance of the `GLTFLoader` to load any number of files. When performing multiple asynchronous operations with async functions, you should (in most cases) use `Promise.all`. We go into the reason for this in more detail {{< link path="/book/appendix/asynchronous-javascript/#loading-multiple-files-with-async-functions-first-attempt" title="in the appendix" >}}, but here's the short version.

First, here's the obvious way of loading the other two files:

{{< code lang="js" linenos="false" caption="Load multiple glTF files, the WRONG way" >}}
// Don't do this!
const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');
const flamingoData = await loader.loadAsync('/assets/models/Flamingo.glb');
const storkData = await loader.loadAsync('/assets/models/Stork.glb');

const parrot = setupModel(parrotData);
const flamingo = setupModel(flamingoData);
const stork = setupModel(storkData);
{{< /code >}}

There's a problem with this approach. [As we stated above](#set-up-main-js-and-world-js-to-handle-async-await), `await` means _wait here until the file has loaded_. This means the app will wait until the parrot has fully loaded, _then_ start to load the flamingo, wait until _that_ has fully loaded, and _finally_ start to load the stork. Using this approach, loading will take nearly three times longer than it should.

Instead, we want all three files to load at the same time, and the simplest way of doing this is to use `Promise.all`.

{{< code lang="js" linenos="" linenostart="8" hl_lines="" caption="_**birds.js**_: load the other two file using `Promise.all`" >}}
``` js
const [parrotData, flamingoData, storkData] = await Promise.all([
  loader.loadAsync('/assets/models/Parrot.glb'),
  loader.loadAsync('/assets/models/Flamingo.glb'),
  loader.loadAsync('/assets/models/Stork.glb'),
]);
```
{{< /code >}}

Then we can process each file's loaded data using the `setupModel` function. Once we do that, here's our (nearly complete) `loadModels` function:

{{< code lang="js" linenos="" hl_lines="8-12 17-18 22 23" linenostart="5" caption="_**birds.js**_: load and then process multiple glTF files" >}}
async function loadBirds() {
  const loader = new GLTFLoader();

  const [parrotData, flamingoData, storkData] = await Promise.all([
    loader.loadAsync('/assets/models/Parrot.glb'),
    loader.loadAsync('/assets/models/Flamingo.glb'),
    loader.loadAsync('/assets/models/Stork.glb'),
  ]);

  console.log('Squaaawk!', parrotData);

  const parrot = setupModel(parrotData);
  const flamingo = setupModel(flamingoData);
  const stork = setupModel(storkData);

  return {
    parrot,
    flamingo,
    stork,
  };
}
{{< /code >}}

Over in World, you now have all three models. Add them to your scene:

{{< code lang="js" linenos="" linenostart="36" caption="_**World.js**_: add the second two birds to the scene" >}}
async init() {
  const { parrot, flamingo, stork } = await loadBirds();

  scene.add(parrot, flamingo, stork);
}
{{< /code >}}

Great! Well...

{{< inlineScene entry="first-steps/birds-jumbled.js" >}}

Just like visiting the zoo!

### Move the Birds into Position

It is possible for models loaded from a glTF file to have a position already specified, but that's not the case here, so all three models start at the point $(0,0,0)$, all jumbled together on top of each other. We'll adjust the position of each bird to make it look like they are flying in formation:

{{< code from="16" to="23" file="worlds/first-steps/load-models/src/World/components/birds/birds.final.js" lang="js" linenos="true" hl_lines="17 20 23" caption="_**birds.js**_: move the birds into position" >}}{{< /code >}}

### Final _**birds.js**_ Module

The _**birds.js**_ module is now complete. Here's the final code:

{{< code file="worlds/first-steps/load-models/src/World/components/birds/birds.final.js" from="1" to="32" lang="js" linenos="true" caption="_**birds.js**_: final code" >}}{{< /code >}}

### Center the Camera on the Parrot

The very last thing we'll do is {{< link path="/book/first-steps/camera-controls/#manually-set-the-target" title="adjust the `OrbitControls` target" >}}. Currently, this is in its default position, the center of the scene. Now that we have moved the birds into formation, this ends up being somewhere around the tail of the parrot. It would look better if the camera focused on the center of the bird rather than its tail. We can easily set this up by copying the `parrot.position` into `controls.target`. However, to do so, we need to access `controls` within `.init`, so first, let's convert it to a module-scoped variable.

{{< code from="11" to="15" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="12" caption="_**World.js**_: make `controls` a module scoped variable" >}}{{< /code >}}

{{< code from="18" to="32" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="24" caption="_**World.js**_: make `controls` a module scoped variable" >}}{{< /code >}}

Now, the controls are accessible from `.init` and we can move the target to the center of the parrot.

{{< code from="34" to="41" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="38" caption="_**World.js**_: target the parrot with the camera" >}}{{< /code >}}

{{< inlineScene entry="first-steps/birds-still.js" class="" >}}

Next up, we'll introduce the three.js animation system and show you how to play the animation clips that were loaded alongside the bird models.

## Challenges

{{% aside success %}}
### Easy

1. Look at that parrot hogging the limelight! Switch around the bird's positions to give the stork and the flamingo each a turn in leading the flock.

2. Alternatively, leave the birds in place and try making the `controls.target` focus on one of the other two birds instead of the parrot.

{{% /aside %}}

{{% aside %}}
### Medium

1. Add a `<button>` element with the text _Switch Focus_. Whenever you click this button, the camera should focus on the next bird. You can implement this however you like, but, if you want to do it in keeping with our work so far, you should set up the buttons inside _**main.js**_ and then {{< link path="/book/first-steps/world-app/#the-world-interface" title="expand the World class interface" >}} with a method to move focus onto the next bird. You can call this method `World.focusNext` or something similar.

{{% /aside %}}

{{% aside warning %}}
### Hard

1. Once you have implemented the button above, you'll have three camera views, one for each bird. Add a fourth view which is a zoomed-out overview of the scene that allows you to see all three birds. For this fourth view, you may need to adjust the `camera.position` as well as the `controls.target`.

2. Now, make the camera smoothly animate from one viewpoint to the next. You will have to animate the camera.position and the controls.target at the same time. The best place to do this is within the `controls.tick` method.

{{% note %}}
TODO-LOW: test the above challenges
{{% /note %}}

{{% /aside %}}