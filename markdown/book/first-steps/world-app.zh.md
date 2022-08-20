---
title: "介绍世界应用程序"
description: "创建复杂的3D应用程序时，良好的代码架构至关重要。 在本章中，我们将单个main.js文件重构为几个小模块，以创建一个可以用于任意大小的three.js应用程序的模板。"
date: 2018-04-02
weight: 103
chapter: "1.3"
available: true
showIDE: true
IDEFiles: [
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
IDEClosedFolders: ['styles', 'vendor']
IDEStripDirectory: "worlds/first-steps/world-app/"
IDEActiveDocument: "src/World/World.js"
---



# 介绍世界应用程序

在本书中，我们的目标是创建简单但功能齐全的three.js应用程序，类似于您在专业环境中可能创建的应用程序。完成这些章节后，您将能够使用您在此处学到的内容创建任何大小的面向客户的精美Web应用程序，无论是[3D产品展示](https://www.threekit.com/)、 [令人惊叹的官网页面](https://cineshader.com/)、 [视频](https://felixmariotto.itch.io/edelweiss)、[游戏](https://lazykitty.itch.io/ex-nihilo)或[游戏引擎](https://github.com/Usnul/meep)、 [音乐视频](http://www.ro.me/film)、 [3D或CAD软件](https://clara.io/)、 [新闻可视化](https://www.nytimes.com/interactive/2019/04/17/world/europe/notre-dame-cathedral-fire-spread.html)，或几乎[任何您可以梦想的东西](https://dddance.party/?ref=three)。不仅如此，您还可以 _立即_ 使用这些章节中的代码作为构建您自己的应用程序的模板。

在上一章中，我们创建了第一个three.js应用程序，并在此过程中介绍了许多新的three.js和计算机图形信息。但是，我们没有注意我们编写的代码的质量或结构。在这里，我们将重构这个简单的单体应用程序以创建一个模板，我们可以将其用作本书其余示例的起点。为了确保我们的代码保持可访问性和易于理解，我们将应用程序拆分为多个小模块，每个模块处理复杂整体中的一小部分。

HTML和CSS文件将保持不变，这里只需要重构 JavaScript。

### 模块化软件设计

在编写模块化JavaScript时，每个文件都是一个模块。因此，我们可以通过文件名来引用模块，例如 _**main.js**_，或者简单地称为 _主_ 模块。模块化软件设计的一个重要部分是选择模块的结构和名称。打开内联代码编辑器，您会看到本章所需的所有文件都已创建，尽管它们一开始都是空的。如果您愿意，请点击比较开关以查看已完成的代码，否则，请在阅读时尝试自己完成模块。

_附录中有一整章专门介绍{{< link path="/book/appendix/javascript-modules/" title="JavaScript模块" >}}。如果这个主题对你来说是新的，那么现在是查看它的好时机。_

## 网页和世界应用程序

在前两章中，我们创建了一个由 _**index.html**_ 和 _**main.css**_ 组成的基本网页，然后我们在 _**main.js**_ 中编写了我们的three.js应用程序。但是，如果您还记得，在{{< link path="/book/introduction/threejs-with-frameworks/" title="0.7 中：将three.js与React、Vue.js、Angular、Svelte、TypeScript一起使用..." >}}，我们说过我们的目标是创建一个可以放入任何网络应用程序的组件，就像它可以与像这样的简单网页一起使用一样容易。为此，我们需要添加另一个小的抽象层。我们将从删除 _**main.js**_ 中的所有内容开始。现在，我们有一个简单的Web应用程序，由三个文件组成： _**index.html**_、 _**main.css**_ 和 _**main.js**_ （目前为空）。我们会制定一个规则：**这个web应用程序不能知道three.js的存在**。一旦我们构建了我们的 three.js应用程序，所有Web应用程序都应该知道我们有一个能够生成3D场景的组件，但不知道该组件是 _如何_ 生成的。在现实世界中，这个Web应用程序可能要复杂得多，并且使用诸如React或Svelte之类的框架构建。但是，使用我们的three.js组件不会比这里更复杂。

为此，我们将把与three.js相关的所有内容移动到一个单独的应用程序（或组件）中，我们将把它放在 _**src/World**_ 文件夹中。在这个文件夹中，我们可以随意使用three.js，但是在这个文件夹之外，我们将被禁止使用three.js。此外，此文件夹中的文件应形成一个独立的组件，该组件对显示它的Web应用程序一无所知。这意味着我们可以拿着 _**World/**_ 文件夹，然后将其放入任何Web应用程序中，无论是像这样的简单HTML页面，还是使用React、Angular或Vue等框架制作的应用程序。这样想吧：您应该能够将您的three.js组件提供给另一个对three.js一无所知的开发人员，并在五分钟或更短的时间内跟他们解释如何将其集成到他们的Web应用程序中，而无需解释如何实现three.js工作。

从这里开始，我们将此文件夹及其内容称为**_World应用程序_**。

## 世界应用

目前，我们的three.js场景比较简单。要设置它，我们需要再次遵循{{< link path="/book/first-steps/first-scene/#simple-steps" title="上一章中概述" >}}的六步程序：

1. 初始设置
2. {{< link path="book/first-steps/first-scene/#create-scene" title="创建场景" >}}
3. {{< link path="book/first-steps/first-scene/#create-camera" title="创建相机" >}}
4. {{< link path="book/first-steps/first-scene/#create-visible" title="创建立方体并将其添加到场景中" >}}
5. {{< link path="book/first-steps/first-scene/#create-the-renderer" title="创建渲染器" >}}
6. {{< link path="book/first-steps/first-scene/#render-scene" title="渲染场景" >}}

但是，_使用_ 世界应用程序应如下所示：

1. 创建World应用程序的实例
2. 渲染场景

第一组六个任务是 _执行细节_。第二组两个任务是我们将要提供给包含Web应用程序的 _接口_。

### `World` 接口

目前接口非常简单。在 _**main.js**_ 中使用它看起来像这样：

{{< code lang="js" linenos="false" hl_lines="" caption="_**main.js**_: 创建world实例" >}}
``` js
// 1. Create an instance of the World app
const world = new World(container);

// 2. Render the scene
world.render();
```
{{< /code >}}

应该隐藏与 _实现_ 世界应用程序不相关的所有内容。在 _**main.js**_ 中，我们应该无法访问场景、相机、渲染器或立方体。如果我们以后需要添加额外的功能，我们将通过扩展接口来实现，而 _不是_ 通过向外界公开three.js函数来实现。

Note that we're passing in a container to the World constructor, which will be our scene container once again. Within World, we'll append the canvas to this container, {{< link path="book/first-steps/first-scene/#add-canvas" title="just as we did in the last chapter" >}}.

_Before reading through the next section, check out the appendices for {{< link path="/book/appendix/javascript-reference/#classes" title="a refresher on JavaScript classes" >}}, if you need one._

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
2. {{< link path="book/first-steps/first-scene/#create-scene" title="Create the scene" >}}
3. {{< link path="book/first-steps/first-scene/#create-camera" title="Create a camera" >}}
4. {{< link path="book/first-steps/first-scene/#create-visible" title="Create the cube and add it to the scene" >}}
5. {{< link path="book/first-steps/first-scene/#create-the-renderer" title="Create the renderer" >}}
6. {{< link path="book/first-steps/first-scene/#render-scene" title="Render the scene" >}}

Number one is done and dusted. That leaves the final five. However, we'll create an additional task that will go in between steps five and six:

* Set the size of the scene.

We'll create a new module for each of the remaining tasks. For now, these modules will be very simple, but as the app grows in size they can become more complex. Splitting them up like this means the complexity will never become overwhelming, and the World class will remain manageable rather than spiraling into a thousand line class of doom.

We'll divide these modules into two categories: **components**, and **systems**. Components are anything that can be placed into the scene, like the cube, the camera, and the scene itself, while systems are things that operate on components or other systems. Here, that's the renderer and the sizing function, which we'll call a `Resizer`. Later you might want to add additional categories like **utilities**, **stores**, and so on.

This gives us the following new modules:

* _**components/camera.js**_
* _**components/cube.js**_
* _**components/scene.js**_
* _**systems/renderer.js**_
* _**systems/Resizer.js**_

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

First up is {{< link path="/book/first-steps/first-scene/#create-the-renderer" title="the renderer system" >}}:

{{< code file="worlds/first-steps/world-app/src/World/systems/renderer.final.js" lang="js" linenos="true" hl_lines="4"
caption="_**systems/renderer.js**_" >}}{{< /code >}}

Later, we'll tune some settings on the renderer to improve the quality of our renderings, but for now, a basic renderer with default settings is just fine.

### Components: The Scene Module

Next up, the scene component:

{{< code file="worlds/first-steps/world-app/src/World/components/scene.final.js" lang="js" linenos="true" hl_lines="4 6"
caption="_**components/scene.js**_" >}}{{< /code >}}

Here, we've created an instance of the `Scene` class, and then used a `Color` to set the background to `skyblue`, exactly as we did {{< link path="/book/first-steps/first-scene/#create-scene" title="in the last chapter" >}}.

### Components: The Camera Module

Third is {{< link path="/book/first-steps/first-scene/#create-camera" title="the camera component" >}}:

{{< code file="worlds/first-steps/world-app/src/World/components/camera.final.js" lang="js" linenos="true" hl_lines="4-9 11,12"
caption="_**components/camera.js**_" >}}{{< /code >}}

This is _almost_ the same code we used to set up the camera in the last chapter, except this time we're using a dummy value of `1` for the aspect ratio since that relies on the dimensions of the `container`. We want to avoid passing things around unnecessarily, so we'll defer setting the aspect until we create the `Resizer` system below.

One other difference: in the last chapter, we declared each of the camera's four parameters as variables, then passed them into the constructor. Here, we've switched to declaring them inline to save some space. Compare this code to the previous chapter to see the difference.

{{< code from="20" to="26" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" hl_lines="" caption="Ch 1.2: Your First three.js Scene: creating the camera" header="" footer="" >}}{{< /code >}}

### Components: The Cube Module

Fourth is the cube component, which comprises creating {{< link path="/book/first-steps/first-scene/#create-geometry" title="a geometry" >}}, {{< link path="/book/first-steps/first-scene/#create-material" title="a material" >}}, and then {{< link path="/book/first-steps/first-scene/#create-mesh" title="a mesh" >}}. Once again, the highlighted lines here are identical to the code from the last chapter.

{{< code file="worlds/first-steps/world-app/src/World/components/cube.final.js" lang="js" linenos="true" hl_lines="4,5,7,8,10,11"
caption="_**components/cube.js**_" >}}{{< /code >}}

Later, we might add visible objects that are much more complicated than this simple cube, in which case we'll split them up into sub-modules. For example, the playable character in a game is likely to be a complex component with many separate pieces, so we'll put that into _**components/mainCharacter/**_, and inside there we'll have sub-modules such as _**mainCharacter/geometry.js**_,  _**mainCharacter/materials.js**_, _**mainCharacter/animations.js**_, and so on.

### Systems: the Resizer Module

Finally, we'll create a stub for the `Resizer` module. This one is a little different than the others since it's a class rather than a function (note that the file name starts with a capital _**R**_ to denote that it's a class):

{{< code lang="js" linenos="" linenostart="0" hl_lines="" caption="_**systems/Resizer.js**_: initial setup" >}}
``` js
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
``` js
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
``` js
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

With that, most our of setup is complete. We now have a camera, scene, and renderer. {{< link path="book/first-steps/first-scene/#add-canvas" title="If you recall from the last chapter" >}}, when we create the renderer a `<canvas>` element is also created and stored in `renderer.domElement`. The next step is to add this to the container.

{{< code lang="js" linenos="" linenostart="14" hl_lines="19" caption="_**World.js**_: append the canvas to the container" >}}
``` js
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

Next, we'll set up `World.render` so that we can see the results. Once again the code is the same as {{< link path="book/first-steps/first-scene/#render-scene" title="the last chapter" >}}.

{{< code from="28" to="31" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="30" caption="_**World.js**_: complete the render method" >}}{{< /code >}}

{{< figure src="first-steps/world_app_unsized_background.png" caption="The canvas is the red rectangle" lightbox="true" class="medium right" >}}

Once you do this, if everything is set up correctly, your scene will be drawn into the canvas. However, the canvas doesn't take up the full size of the container since we haven't completed the `Resizer` yet. Instead, it has been created at the default size for a `<canvas>` element, which is $300 \times 150$ pixels (in Chrome, at least).

This won't be obvious since we've set the container background to the same color as the scene's background - they are both "skyblue". However, try temporarily making the canvas "red" and this will become obvious.

{{< code lang="js" linenos="" linenostart="6" hl_lines="" caption="_**scene.js**_: temporarily make the canvas red to show that it doesn't take up the full container yet" >}}
``` js
scene.background = new Color('red');
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

Here, we'll move these lines into the `Resizer` class. Why a class (and why _Re_-sizer)? Later, this class will have more work to do, for example, in {{< link path="book/first-steps/responsive-design/" title="" >}}, we'll set up automatic resizing whenever the browser window changes size. Creating it as a class gives us more scope to add functionality later without refactoring.

Looking through the above lines, we can see that `Resizer` needs the container, the camera, and the renderer (`devicePixelRatio` is on {{< link path="book/appendix/javascript-reference/#global-scope" title="the global scope" >}}, which means it's available everywhere). Over in World, make sure `Resizer` is in the list of imports:

{{< code from="0" to="6" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="6" caption="_**World.js**_: imports" >}}{{< /code >}}

... and then create a `resizer` instance in the constructor:

{{< code from="15" to="26" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="25" caption="_**World.js**_: create the resizer" >}}{{< /code >}}

Next, copy the lines of code we gathered up the last chapter into the constructor, and also update the method's signature to include the container, camera, and renderer.

{{< code lang="js" linenos="" linenostart="0" hl_lines="2 4 7 10" caption="_**Resizer.js**_: nearly complete!" >}}
``` js
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

This is nearly complete, although there's still one thing we need to do. If you recall from the last chapter, the camera uses the aspect ratio along with the field of view and the near and far clipping planes to calculate its {{< link path="/book/first-steps/first-scene/#viewing-frustum" title="viewing frustum" >}}. **The frustum is not automatically recalculated, so when we change any of these settings, stored in `camera.aspect`, `camera.fov`, `camera.near`, and `camera.far`, we also need to update the frustum.**

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
