---
title: "Introducing the World App"
description: "When creating complex 3D apps, good code architecture is vital. In this chapter, we refactor our monolithic main.js file into several small modules to create a template we can use for three.js apps of any size."
date: 2018-04-02
weight: 103
chapter: "1.3"
available: true
showIDE: true
IDEFiles:
  [
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/world-app/index.html",
    "worlds/first-steps/world-app/src/World/components/camera.start.js",
    "worlds/first-steps/world-app/src/World/components/cube.start.js",
    "worlds/first-steps/world-app/src/World/components/scene.start.js",
    "worlds/first-steps/world-app/src/World/systems/renderer.start.js",
    "worlds/first-steps/world-app/src/World/systems/Resizer.start.js",
    "worlds/first-steps/world-app/src/World/World.start.js",
    "worlds/first-steps/world-app/src/main.start.js",
    "worlds/first-steps/world-app/src/World/components/camera.final.js",
    "worlds/first-steps/world-app/src/World/components/cube.final.js",
    "worlds/first-steps/world-app/src/World/components/scene.final.js",
    "worlds/first-steps/world-app/src/World/systems/renderer.final.js",
    "worlds/first-steps/world-app/src/World/systems/Resizer.final.js",
    "worlds/first-steps/world-app/src/World/World.final.js",
    "worlds/first-steps/world-app/src/main.final.js",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/world-app/"
IDEActiveDocument: "src/World/World.js"
---

# Introducing the World App

In this book our aim is to create simple yet fully functional three.js applications similar to those you might create in a professional setting. Once you've completed these chapters, you'll be able to use what you've learned here to create beautiful customer-facing web apps of any size, whether that's [3D product displays](https://www.threekit.com/), [stunning landing pages](https://cineshader.com/), [video](https://felixmariotto.itch.io/edelweiss) [games](https://lazykitty.itch.io/ex-nihilo) or [game engines](https://github.com/Usnul/meep), [music videos](http://www.ro.me/film), [3D or CAD software](https://clara.io/), [journalistic visualizations](https://www.nytimes.com/interactive/2019/04/17/world/europe/notre-dame-cathedral-fire-spread.html), or just about [anything else you can dream of](https://dddance.party/?ref=three). Not only that, you'll be able to use the code from these chapters _immediately_ as a template for building your own apps.

In the last chapter, we created our first three.js application, and we introduced lots of new three.js and computer graphics info along the way. However, we didn't pay any attention to the quality or structure of the code we wrote. Here, we'll refactor this simple, monolithic app to create a template we can use as a starting point for the rest of the examples in this book. To ensure our code remains accessible and easy to understand, we'll split the app into small modules, each of which handles a small part of the overall complexity.

The HTML and CSS files will remain unchanged, it's only the JavaScript we need to refactor here.

### Modular Software Design

When writing modular JavaScript, each file is a module. So, we may refer to a module by its file name, for example, _**main.js**_, or simply as the _main_ module. An important part of modular software design is choosing the structure and names of your modules. Open up the inline code editor and you'll see that all the files required for this chapter have already been created, although they're all empty to begin with. If you like, hit the comparison toggle to view the completed code, otherwise, try completing the modules yourself while you read.

_There's an entire chapter of the appendices dedicated to [JavaScript modules]({{< relref "/book/appendix/javascript-modules" >}} "JavaScript modules"). If this subject is new to you, now would be a good time to check it out._

## The Web Page and the World App

Over the last two chapters, we created a basic webpage consisting of _**index.html**_ and _**main.css**_, and then we wrote our three.js app in _**main.js**_. However, if you recall, back in [the intro]({{< relref "/book/introduction/threejs-with-frameworks" >}} "the intro"), we said our goal is to create a component that can be dropped into any web app just as easily as it can be used with a simple web page like this one. For this to work, we need to add another small layer of abstraction. We'll start by deleting everything from _**main.js**_. Now, we have a simple web app consisting of three files: _**index.html**_, _**main.css**_, and _**main.js**_ (currently empty). We'll make a rule: **this web app cannot know about the existence of three.js**. Once we build our three.js app, all the web app should know is that we have a component capable of generating 3D scenes, but not _how_ that component does it. Out in the real world, this web app might be much more complicated and built using a framework such as React or Svelte. However, using our three.js component will not be any more complicated than it is here.

To accomplish this, we'll move everything related to three.js into a separate app (or component), which we'll place in the _**src/World**_ folder. Within this folder, we are free to use three.js however we like, but outside this folder we are forbidden from using three.js. Also, the files in this folder should form a self-contained component that knows nothing about the web app on which it is being displayed. This means we can take the _**World/**_ folder, and drop it into any web app, whether it's a simple HTML page like this one or an app made with a framework like React, Angular, or Vue. Think about it this way: you should be able to give your three.js component to another developer who knows nothing about three.js and explain how they can integrate it into their web app, in five minutes or less, without explaining how three.js works.

From here on, we'll refer to this folder and its contents as **_the World app_**.

## The World App

Currently, our three.js scene is relatively simple. To set it up, once again we need to follow the six-step program [outlined in the last chapter]({{< relref "/book/first-steps/first-scene#simple-steps" >}} "outlined in the last chapter"):

1. Initial Setup
2. [Create the scene]({{< relref "book/first-steps/first-scene#create-scene" >}} "Create the scene")
3. [Create a camera]({{< relref "book/first-steps/first-scene#create-camera" >}} "Create a camera")
4. [Create the cube and add it to the scene]({{< relref "book/first-steps/first-scene#create-visible" >}} "Create the cube and add it to the scene")
5. [Create the renderer]({{< relref "book/first-steps/first-scene#create-the-renderer" >}} "Create the renderer")
6. [Render the scene]({{< relref "book/first-steps/first-scene#render-scene" >}} "Render the scene")

However, _using_ the World app should look like this:

1. Create an instance of the World app
2. Render the scene

The first set of six tasks are the _implementation details_. The second set of two tasks are the _interface_ we'll provide to the containing web app.

### The `World` Interface

The interface is very simple for now. Using it within _**main.js**_ will look something like this:

{{< code lang="js" linenos="false" hl_lines="" caption="_**main.js**_: creating a world" >}}

```js
// 1. Create an instance of the World app
const world = new World(container);

// 2. Render the scene
world.render();
```

{{< /code >}}

Everything else about the _implementation_ of the World app should be hidden. From within _**main.js**_, we should not be able to access the scene, camera, renderer, or cube. If we later need to add additional functionality, we'll do so by expanding the interface, _not_ by exposing three.js functions to the outside world.

Note that we're passing in a container to the World constructor, which will be our scene container once again. Within World, we'll append the canvas to this container, [just as we did in the last chapter]({{< relref "book/first-steps/first-scene#add-canvas" >}} "just as we did in the last chapter").

_Before reading through the next section, check out the appendices for [a refresher on JavaScript classes]({{< relref "/book/appendix/javascript-reference#classes" >}} "a refresher on JavaScript classes"), if you need one._

## The `World` Class

Now, we can go ahead and start to build the `World` class. We'll need a `constructor` method to handle setup (create the scene, renderer, cube, and camera, set the scene's size, and add the canvas element to the container), and a `render` method to render the scene. Open or create the _**src/World/World.js**_ module, and inside, create the World class with both of these methods. At the bottom of the file, export the class so we can use it from _**main.js**_.

{{< code lang="js" linenos="false" caption="_**World.js**_: initial setup" >}}
class World {
// 1. Create an instance of the World app
constructor(container) {}

// 2. Render the scene
render() {}
}

export { World };
{{< /code >}}

With this, our interface is complete. Everything else is implementation. Although this interface doesn't yet _do_ anything, it's already _usable_. In other words, we can go ahead and fully set up _**main.js**_, calling these functions in the appropriate places. Later, once we fill in the details, the app will magically start to work. This is a common approach to creating interfaces. First, decide how it should look and create stubs for each part of the interface, _then_ worry about the details.

## Set Up _**main.js**_

Inside _**main.js**_, which should currently be empty, we'll start by importing the new World class, then we'll create a main function and immediately call it to start the app:

{{< code lang="js" linenos="true" caption="_**main.js**_: initial setup" >}}
import { World } from './World/World.js';

// create the main function
function main() {
// code to set up the World App will go here
}

// call main to start the app
main();
{{< /code >}}

### Set up the World App

Next, we'll perform our two-step World app setup. First, just like in the last chapter, we need a reference to the container. Then we'll create a `new World`, and finally, with everything set up, we can call `world.render` to draw the scene.

{{< code from="3" to="12" file="worlds/first-steps/world-app/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: create a whole new World">}}{{< /code >}}

With this, the _**main.js**_ module is complete. Later, when we fill in the details of the World app, our scene will spring to life.

## World App Implementation

Of course, building the interface was the easy part. Now we have to make it work. Fortunately, from here on it's mostly a matter of copying code over from the previous chapter. Take a look at the setup tasks again.

1. ~~Initial Setup~~
2. [Create the scene]({{< relref "book/first-steps/first-scene#create-scene" >}} "Create the scene")
3. [Create a camera]({{< relref "book/first-steps/first-scene#create-camera" >}} "Create a camera")
4. [Create the cube and add it to the scene]({{< relref "book/first-steps/first-scene#create-visible" >}} "Create the cube and add it to the scene")
5. [Create the renderer]({{< relref "book/first-steps/first-scene#create-the-renderer" >}} "Create the renderer")
6. [Render the scene]({{< relref "book/first-steps/first-scene#render-scene" >}} "Render the scene")

Number one is done and dusted. That leaves the final five. However, we'll create an additional task that will go in between steps five and six:

- Set the size of the scene.

We'll create a new module for each of the remaining tasks. For now, these modules will be very simple, but as the app grows in size they can become more complex. Splitting them up like this means the complexity will never become overwhelming, and the World class will remain manageable rather than spiraling into a thousand line class of doom.

We'll divide these modules into two categories: **components**, and **systems**. Components are anything that can be placed into the scene, like the cube, the camera, and the scene itself, while systems are things that operate on components or other systems. Here, that's the renderer and the sizing function, which we'll call a `Resizer`. Later you might want to add additional categories like **utilities**, **stores**, and so on.

This gives us the following new modules:

- _**components/camera.js**_
- _**components/cube.js**_
- _**components/scene.js**_
- _**systems/renderer.js**_
- _**systems/Resizer.js**_

If you're working locally, create these files now, otherwise, locate them in the editor. The `Resizer` gets a capital `R` because it will be a class. The other four modules will each contain a function following this basic pattern:

{{< code lang="js" linenos="false" caption="The basic pattern for most of our new modules" >}}
import { Item } from 'three';

function createItem() {
const instance = new Item();

return instance;
}

export { createItem }
{{< /code >}}

...where `createItem` is replaced by `createCamera`, `createCube`, `createRenderer`, or `createScene`. If the code in any of these modules is unclear to you, refer back to the previous chapter where we explain it in detail.

### Systems: the Renderer Module

First up is [the renderer system]({{< relref "/book/first-steps/first-scene#create-the-renderer" >}} "the renderer system"):

{{< code file="worlds/first-steps/world-app/src/World/systems/renderer.final.js" lang="js" linenos="true" hl_lines="4"
caption="_**systems/renderer.js**_" >}}{{< /code >}}

Later, we'll tune some settings on the renderer to improve the quality of our renderings, but for now, a basic renderer with default settings is just fine.

### Components: The Scene Module

Next up, the scene component:

{{< code file="worlds/first-steps/world-app/src/World/components/scene.final.js" lang="js" linenos="true" hl_lines="4 6"
caption="_**components/scene.js**_" >}}{{< /code >}}

Here, we've created an instance of the `Scene` class, and then used a `Color` to set the background to `skyblue`, exactly as we did [in the last chapter]({{< relref "/book/first-steps/first-scene#create-scene" >}} "in the last chapter").

### Components: The Camera Module

Third is [the camera component]({{< relref "/book/first-steps/first-scene#create-camera" >}} "the camera component"):

{{< code file="worlds/first-steps/world-app/src/World/components/camera.final.js" lang="js" linenos="true" hl_lines="4-9 11,12"
caption="_**components/camera.js**_" >}}{{< /code >}}

This is _almost_ the same code we used to set up the camera in the last chapter, except this time we're using a dummy value of `1` for the aspect ratio since that relies on the dimensions of the `container`. We want to avoid passing things around unnecessarily, so we'll defer setting the aspect until we create the `Resizer` system below.

One other difference: in the last chapter, we declared each of the camera's four parameters as variables, then passed them into the constructor. Here, we've switched to declaring them inline to save some space. Compare this code to the previous chapter to see the difference.

{{< code from="20" to="26" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" hl_lines="" caption="Ch 1.2: Your First three.js Scene: creating the camera" header="" footer="" >}}{{< /code >}}

### Components: The Cube Module

Fourth is the cube component, which comprises creating {{< link path="/book/first-steps/first-scene/#create-geometry" title="a geometry" >}}, {{< link path="/book/first-steps/first-scene/#create-material" title="a material" >}}, and then {{< link path="/book/first-steps/first-scene/#create-mesh" title="a mesh" >}}. Once again, the highlighted lines here are identical to the code from the last chapter.

{{< code file="worlds/first-steps/world-app/src/World/components/cube.final.js" lang="js" linenos="true" hl_lines="4,5,7,8,10,11"
caption="_**components/cube.js**_" >}}{{< /code >}}

Later, we might add visible objects that are much more complicated than this simple cube, in which case we'll split them up into sub-modules. For example, the playable character in a game is likely to be a complex component with many separate pieces, so we'll put that into _**components/mainCharacter/**_, and inside there we'll have sub-modules such as _**mainCharacter/geometry.js**_, _**mainCharacter/materials.js**_, _**mainCharacter/animations.js**_, and so on.

### Systems: the Resizer Module

Finally, we'll create a stub for the `Resizer` module. This one is a little different than the others since it's a class rather than a function (note that the file name starts with a capital _**R**_ to denote that it's a class):

{{< code lang="js" linenos="" linenostart="0" hl_lines="" caption="_**systems/Resizer.js**_: initial setup" >}}

```js
class Resizer {
  constructor() {}
}

export { Resizer };
```

{{< /code >}}

We'll complete this class below.

## Set Up the `World` Class

With that, most of our components and systems are ready and we can fill in the details of the World class. First, import the five modules we just created at the top of _**World.js**_:

{{< code from="1" to="6" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true"
caption="_**World.js**_: imports" >}}{{< /code >}}

### Set Up the Camera, Renderer, and Scene

Next, we'll set up the camera, scene, and renderer, which all need to be created in the constructor, then accessed in the `World.render` method. Usually, this means we would save them as class member variables: `this.camera`, `this.scene`, and `this.renderer`:

{{< code lang="js" linenos="false" caption="Class member variables are accessible from outside the class" >}}

```js
class World {
  constructor() {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
  }
```

{{< /code >}}

However, member variables are accessible within _**main.js**_, which we _don't_ want.

{{< code lang="js" linenos="false" caption="_**main.js**_: not what we want" >}}

```js
const world = new World();

// We can access member variables from the instance
console.log(world.camera);
console.log(world.renderer);
console.log(world.scene);
```

{{< /code >}}

### Guard your Secrets Well

We want to interact with the World app using _only_ the interface we've designed, and we want everything else to be hidden. Why? Imagine you have worked long and hard to create a beautiful, well structured three.js application, and you pass it on to your client for them to integrate into a larger application. They don't know anything about three.js, but they are competent developers, so when they need to change something they start to hack around and figure out that they can access the camera and renderer. They open up the three.js docs and after five minutes of reading, change some settings. These are likely to break some other parts of the app, so they make more changes, and more changes, and eventually... chaos. Which _you_ will be called in to fix.

**By hiding the implementation behind a simple interface, you make your app foolproof and simple to use. It does what's it's supposed to do, and _nothing else_.** By hiding the implementation, we are enforcing good coding style on the people using our code. The more of the implementation you make accessible, the more likely it will be used for complicated half-baked "fixes" that you have to deal with later.

Replace the word _client_ with _you in six months_ and everything still holds. If you later need to make some quick changes to the app, you won't be tempted to do them in a hacky way if you can't access anything except for the simple interface. Instead, you'll have to open up the World app and fix things _properly_ (in theory at least).

Of course, there will be times when you do legitimately want to expose the camera and other components to the outside world. However, hiding them should be the default. Guard your secrets well, and only expose them when you have a good reason for doing so.

### But How?

Most languages have private class fields for this purpose, and they are coming soon to JavaScript too. Unfortunately, at the time of writing this chapter, [support is not good](https://caniuse.com/#search=private%20class%20fields), so for now we must look for an alternative.

#### Module Scoped Variables

We can create something similar to private variables by declaring the variables in {{< link path="/book/appendix/javascript-reference/#scope-and-closures" title="module scope" >}}:

{{< code from="0" to="18" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="10-12 16-18" caption="_**World.js**_: create the camera, renderer, and scene as module scoped variables" footer="  }" >}}{{< /code >}}

This way, we can access `camera`, `renderer`, and `scene` from anywhere in the World module, but _not_ from _**main.js**_. Just what we want.

**Important note**: this solution will not work if we create _two_ instances of the `World` class, since the module scoped variables will be shared between both instances, so the second instance will overwrite the variables of the first. However, we only ever intend to create one world at a time, so we'll accept this limitation.

### Add the Canvas to the Container

With that, most our of setup is complete. We now have a camera, scene, and renderer. [If you recall from the last chapter]({{< relref "book/first-steps/first-scene#add-canvas" >}} "If you recall from the last chapter"), when we create the renderer a `<canvas>` element is also created and stored in `renderer.domElement`. The next step is to add this to the container.

{{< code lang="js" linenos="" linenostart="14" hl_lines="19" caption="_**World.js**_: append the canvas to the container" >}}

```js
class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);
  }
```

{{< /code >}}

### Render the Scene

Next, we'll set up `World.render` so that we can see the results. Once again the code is the same as [the last chapter]({{< relref "book/first-steps/first-scene#render-scene" >}} "the last chapter").

{{< code from="28" to="31" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="30" caption="_**World.js**_: complete the render method" >}}{{< /code >}}

{{< figure src="first-steps/world_app_unsized_background.png" caption="The canvas is the red rectangle" lightbox="true" class="medium right" >}}

Once you do this, if everything is set up correctly, your scene will be drawn into the canvas. However, the canvas doesn't take up the full size of the container since we haven't completed the `Resizer` yet. Instead, it has been created at the default size for a `<canvas>` element, which is $300 \times 150$ pixels (in Chrome, at least).

This won't be obvious since we've set the container background to the same color as the scene's background - they are both "skyblue". However, try temporarily making the canvas "red" and this will become obvious.

{{< code lang="js" linenos="" linenostart="6" hl_lines="" caption="_**scene.js**_: temporarily make the canvas red to show that it doesn't take up the full container yet" >}}

```js
scene.background = new Color("red");
```

{{< /code >}}

We'll fix this in a few moments, but first, let's add the cube to the scene.

### Create the Cube

The cube doesn't need to be a module scope variable since it's only used in the constructor, so call `createCube`, save the result in a normal variable called `cube`, then add it to the scene.

{{< code from="15" to="23" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="21 23" caption="_**World.js**_: Create the cube and add it to the scene" footer="  }" >}}{{< /code >}}

Now, the white square will appear against the blue background. Still sized at $300 \times 150$ pixels though.

## Systems: the Resizer Module

All that remains is to set up the `Resizer` class. Gathering up all the code we used to set the scene's size from the last chapter, here's what we get:

{{< code lang="js" linenos="false" caption="Everything we need to do in the `Resizer` class" >}}

```js
// Set the camera's aspect ratio to match the container's proportions
camera.aspect = container.clientWidth / container.clientHeight;

// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);

// finally, set the pixel ratio to ensure our scene will look good on mobile devices
renderer.setPixelRatio(window.devicePixelRatio);
```

{{< /code >}}

Here, we'll move these lines into the `Resizer` class. Why a class (and why _Re_-sizer)? Later, this class will have more work to do: in the [Responsive Design]({{< relref "book/first-steps/responsive-design" >}} "Responsive Design") chapter, we'll set up automatic resizing whenever the browser window changes size. Creating it as a class gives us more scope to add functionality later without refactoring.

Looking through the above lines, we can see that `Resizer` needs the container, the camera, and the renderer (`devicePixelRatio` is on [the global scope]({{< relref "book/appendix/javascript-reference#global-scope" >}} "the global scope"), which means it's available everywhere). Over in World, make sure `Resizer` is in the list of imports:

{{< code from="0" to="6" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="6" caption="_**World.js**_: imports" >}}{{< /code >}}

... and then create a `resizer` instance in the constructor:

{{< code from="15" to="26" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="25" caption="_**World.js**_: create the resizer" >}}{{< /code >}}

Next, copy the lines of code we gathered up the last chapter into the constructor, and also update the method's signature to include the container, camera, and renderer.

{{< code lang="js" linenos="" linenostart="0" hl_lines="2 4 7 10" caption="_**Resizer.js**_: nearly complete!" >}}

```js
class Resizer {
  constructor(container, camera, renderer) {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}
```

{{< /code >}}

{{< figure src="first-steps/perspective_frustum.svg" alt="Perspective camera frustum" class="medium right" lightbox="true" >}}

This is nearly complete, although there's still one thing we need to do. If you recall from the last chapter, the camera uses the aspect ratio along with the field of view and the near and far clipping planes to calculate its [viewing frustum]({{< relref "/book/first-steps/first-scene#viewing-frustum" >}} "viewing frustum"). **The frustum is not automatically recalculated, so when we change any of these settings, stored in `camera.aspect`, `camera.fov`, `camera.near`, and `camera.far`, we also need to update the frustum.**

The camera stores its frustum in a mathematical object called a [**projection matrix**](https://threejs.org/docs/#api/en/cameras/Camera.projectionMatrix), and, to update this, we need to call the camera's [`.updateProjectionMatrix`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.updateProjectionMatrix) method. Adding this line gives us the final `Resizer` class:

{{< code from="1" to="15" file="worlds/first-steps/world-app/src/World/systems/Resizer.final.js" lang="js" linenos="true" hl_lines="7" caption="_**Resizer.js**_: complete!" >}}{{< /code >}}

{{< figure src="first-steps/world_app_fullsized.png" caption="Fullsize at last!" lightbox="true" class="medium right" >}}

With that, our refactor is complete, and the scene will expand to take up the full size of the window.

### The Final `World` Class

With everything in place, here's our complete code for the _**World.js**_ module. As you can see, this class coordinates the setup of our 3D scene while offloading the complexity onto separate modules.

{{< code from="1" to="47" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true"
caption="_**World.js**_: complete code" >}}{{< /code >}}

Whew! That was some refactor! If you're used to structuring your code using modules, this chapter was probably a breeze. On the other hand, if this was all new to you, it can take some time to get used to the idea of splitting up an application like this. Hopefully, by going through this step by step, you now have a clearer understanding of why we would choose to do this.

Our application is now ready for liftoff. Over the next few chapters, we'll add lighting, movement, user controls, animation, and even some shapes that are a little more interesting than our humble square. Are you ready?

## Challenges

{{% aside success %}}

#### Easy

1. Change the color of the scene background. You can enter any standard color name such as red, green, purple, and so on, as well as some unusual names like aquamarine or coral. How many of the 140 CSS color names can you guess?

{{% /aside %}}

{{% aside %}}

#### Medium

1. Change the cube to some other shapes like a rectangle, sphere, triangle, or torus. (Hint: [search the docs](https://threejs.org/docs) for "BufferGeometry".)

2. Add a second cube and move it around using `mesh.position.set(x, y, z)` (you'll either need to figure out some way of returning two cubes from the `createCube` function, or add a second module like _**cube2.js**_).

{{% /aside %}}

{{% aside warning %}}

#### Hard

_This is a challenge for people who are already familiar with building websites. If you are new to web development, it's OK to skip this one._

1. Add a button to the HTML page, and delay rendering the scene until the button has been clicked. Do this _without_ making any changes to the World app. Instead, create the button in _**index.html**_ and set it up in _**main.js**_.

{{% /aside %}}
