---
title: "The Animation Loop"
description: "In this chapter, we build an Animation Loop which will generate a stream of frames allowing us to add animation and other effects to our scenes."
date: 2018-04-02
weight: 107
chapter: "1.7"
available: true
showIDE: true
IDEFiles: [
  "worlds/first-steps/animation-loop/src/World/components/camera.js",
  "worlds/first-steps/animation-loop/src/World/components/cube.start.js",
  "worlds/first-steps/animation-loop/src/World/components/cube.final.js",
  "worlds/first-steps/animation-loop/src/World/components/lights.js",
  "worlds/first-steps/animation-loop/src/World/components/scene.js",
  "worlds/first-steps/animation-loop/src/World/systems/renderer.js",
  "worlds/first-steps/animation-loop/src/World/systems/Resizer.js",
  "worlds/first-steps/animation-loop/src/World/systems/Loop.start.js",
  "worlds/first-steps/animation-loop/src/World/systems/Loop.final.js",
  "worlds/first-steps/animation-loop/src/World/World.start.js",
  "worlds/first-steps/animation-loop/src/World/World.final.js",
  "worlds/first-steps/animation-loop/src/main.start.js",
  "worlds/first-steps/animation-loop/src/main.final.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/animation-loop/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/animation-loop/'
IDEActiveDocument: 'src/World/systems/Loop.js'
---



# The Animation Loop

{{< inlineScene entry="first-steps/static-cube.js" class="small right" caption="The output from a single call of<br>renderer.render" >}}

Over the last couple of chapters, we've made amazing progress with our app. We have lights, colors, physically correct rendering, anti-aliasing, automatic-resizing, we know how to move objects around in 3D space, and our code is clean, modular, and well-structured. But our scene is missing one vital ingredient: **movement!**

We're using the `renderer.render` method to draw the scene. This method takes a scene and a camera as input and outputs a single still image to the HTML `<canvas>` element. The output is the non-moving purple box you can see above.

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="32" to="36" lang="js" hl_lines="34" linenos="true" caption="_**World.js**_: drawing a single frame with `renderer.render`" >}}{{< /code >}}

{{< inlineScene entry="first-steps/animation-loop.js" class="small right" >}}

In this chapter, we'll add a simple rotation animation to the cube. Here's how we'll do it:

* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* ...

... and so on in an endless loop called an **animation loop**. Setting up this loop is simple since three.js does all the hard work for us via the `renderer.setAnimationLoop` method.

We'll also introduce the three.js `Clock` in this chapter, a simple stopwatch class that we can use to keep animations in sync. We'll be dealing with time values less than one second throughout this chapter, so we'll use milliseconds (ms), which are thousandths of a second.

Once we've set up the loop, our goal is to generate a steady stream of frames at a rate of sixty frames a second (60FPS), which means we need to call `.render` approximately once every sixteen milliseconds. In other words, we need to ensure that all of the processing we do in a frame takes less than 16ms (this is sometimes referred to as a **frame budget**). That means we need to update animations, perform any other tasks that need to be calculated across frames (such as physics), _and_ render the frame, in less than sixteen milliseconds on the lowest spec hardware that we intend to support. Over the rest of this chapter, as we set up the loop and create a simple rotating animation for the cube, we'll discuss how best to achieve this.

## Similarities with the Game Loop

Most game engines use the concept of a **game loop** that runs once per frame and is used to update and render the game. A basic game loop might consist of these four tasks:

1. **Get user input**
2. **Calculate physics**
3. **Update animations**
4. **Render a frame**

Even though three.js is not a game engine and we are calling our loop an **animation loop**, our goals are pretty similar. This means, instead of starting from scratch, we can borrow some tried and trusted ideas from game engine design. The loop we create in this chapter is very simple, but if you later find yourself needing a more complex one, perhaps to update animations and physics at a different rate than you render the scene, you can refer to a [book on game development](https://gameprogrammingpatterns.com/game-loop.html) for more info.

Later, we'll make our scene interactive. Fortunately for us, handling user input in the browser is easy thanks to {{< link path="book/appendix/dom-api-reference/#listening-for-events" title="`addEventListener`" >}}, so we don't need to handle this task in the loop. Also, we won't be doing any physics calculations for now (although several great physics libraries work with three.js), so we can skip the physics step. Rendering is already covered by `renderer.render`. That leaves us with two tasks in this chapter: set up the loop itself, and then create a system for updating animations.

We'll set up the loop first to generate a stream of frames, and then we'll set up the animation system.

## Creating an Animation Loop with three.js

### The _**Loop.js**_ Module

Open (or create) the _**systems/Loop.js**_ module and create a new `Loop` class inside. This class will handle all the looping logic and the animation system. You'll notice that we have imported `Clock`, which we'll use below to keep animations in sync. Next, since we'll use `renderer.render(scene, camera)` to generate frames, it's a fair bet we'll need the `camera`, `scene`, and `renderer` within the `Loop` class, so pass them to the constructor and save them as instance variables. Finally, create `.start` and `.stop` methods that we can later use to start/stop the loop.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**Loop.js**_: initial setup" >}}
``` js
import { Clock } from 'three';

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
  }

  start() {}

  stop() {}
}

export { Loop }
```
{{< /code >}}

Over in World, add this new class to the list of imports:

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="1" to="8" lang="js" linenos="true" hl_lines="8" caption="_**World.js**_: import the `Loop` class" >}}{{< /code >}}

Create the loop as a {{< link path="book/first-steps/world-app/#set-up-the-camera-renderer-and-scene" title="module scoped variable" >}} like the `camera`, `renderer`, and `scene`, since we don't want it to be accessible from outside the `World` class:

{{< code lang="js" linenos="" linenostart="10" hl_lines="13 20" caption="_**World.js**_: create a `loop` instance" >}}
``` js
let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    ...
  }
```
{{< /code >}}

Finally, add `.start` and `.stop` methods to `World`, which simply call their counterparts in `Loop`. This is how we'll provide access to the loop from within _**main.js**_:

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="33" to="44" lang="js" linenos="true" hl_lines="38-44" caption="_**World.js**_: create the `.start` and `.stop` methods" >}}{{< /code >}}

Then, over in _**main.js**_, switch out `world.render`:

{{< code file="worlds/first-steps/animation-loop/src/main.start.js" from="3" to="12" lang="js" linenos="true" hl_lines="10 11" caption="_**main.js**_: render a single still frame" >}}{{< /code >}}

... for `world.start`:

{{< code file="worlds/first-steps/animation-loop/src/main.final.js" from="3" to="12" lang="js" linenos="true" hl_lines="10 11" caption="_**main.js**_: start the animation loop" >}}{{< /code >}}

The scene will go black when you do this, but don't worry. It'll spring back to life again in a few moments once we have finished creating the loop.

### Creating the Loop with `.setAnimationLoop`

Now, everything is set up and we can create the loop. As we mentioned above, we don't need to worry about the technicalities of creating an animation loop since three.js provides a method that does everything for us: [`WebGLRenderer.setAnimationLoop`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop).

{{< code lang="js" linenos="false" caption="Creating a loop using `.setAnimationLoop`" >}}
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();

// start the loop
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
});
{{< /code >}}

This will call `renderer.render` over and over to generate a stream of frames. We can cancel a running loop by passing `null` as the callback:

{{< code lang="js" linenos="false" caption="Stop a running loop" >}}
// stop the loop
renderer.setAnimationLoop(null);
{{< /code >}}

Internally, the loop is created using {{< link path="/book/appendix/dom-api-reference/#drawing-animation-frames" title="`.requestAnimationFrame`" >}}. This built-in browser method intelligently schedules frames in sync with the refresh rate of your monitor and will smoothly reduce the frame rate if your hardware can't keep up. Since `.setAnimationLoop` was added fairly recently, older three.js examples and tutorials often use `.requestAnimationFrame` directly to set up the loop, and it's fairly simple to do it that way. However, with `.setAnimationLoop` there's a little extra magic to ensure the loop will work in virtual reality and augmented reality environments.

{{% note %}}
TODO-LOW: possible move discussion of Hz and framerates here, or otherwise link to later in the chapter
TODO-LINK: link to "creating an animation loop with JavaScript" if/when the chapter is added
{{% /note %}}

{{% aside success %}}

### Virtual Reality, Augmented Reality, and the Animation Loop

**Web Virtual Reality** (**WebVR**) and **Web Augmented Reality** (**WebAR**) are combined into a unified API called the [**WebXR Device API**](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API). Support for these APIs was added to three.js around the start of 2018. If you're fortunate enough to own a virtual reality device, check out the [three.js VR examples here](https://threejs.org/examples/?q=webxr).

At the time of writing this, in 2020, the WebXR API is relatively new and subject to change as development proceeds. By using `.setAnimationLoop`, we don't need to worry about any of these changes beyond keeping three.js up to date. Also, if you create a scene now and later decide to add VR capability, it will be easy to do so.

{{% /aside %}}

### The `Loop.start` and `Loop.stop` Methods

Now, we can create the loop. We'll do it in `Loop.start` using `.setAnimationLoop`:

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="13" to="22" lang="js" linenos="true" hl_lines="" skip_lines="15,16,17" caption="_**Loop.js**_: create the `.start` method" >}}{{< /code >}}

Next, create the counterpart `.stop` method, passing in `null` as the callback to stop the loop:

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="23" to="25" lang="js" linenos="true" hl_lines="" skip_lines="15,16,17" caption="_**Loop.js**_: create the `.stop` method" >}}{{< /code >}}

As soon as you make these changes, your app will start to pump out frames at a rate of around sixty per second (or possibly higher, depending on the refresh rate of your monitor). However, you won't _see_ any difference. Nothing is moving yet, so we are simply drawing the same frame over and over. Our loop now looks like this:

* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* ...

If you compare that to the loop we described at the start of the chapter, you'll see we are missing a vital step:

* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **rotate the cube a tiny amount**
* ...

We need some way to adjust the cube's rotation right before we render each frame, and we need to do so in a way that works for any kind of animated object, not just a rotating cube. More generally, our loop should look like this:

* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **move animations forward one frame**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **move animations forward one frame**
* **call `renderer.render(...)`**
* **wait until it's time to draw the next frame**
* **move animations forward one frame**
* ...

### Remove the `onResize` Hook

First, let's tidy up. Now that the loop is running, whenever we resize the window a new frame will be produced on the next iteration of the loop. This is fast enough that you won't notice any delay so we don't need to manually redraw the scene on resizing anymore. Remove the `resizer.onResize` hook from World:

{{< code lang="js" linenos="" linenostart="17" hl_lines="31-33" caption="_**World.js**_: remove the highlighted lines" >}}
``` js
constructor(container) {
  camera = createCamera();
  scene = createScene();
  renderer = createRenderer();
  container.append(renderer.domElement);

  const cube = createCube();
  const light = createLights();

  updatables.push(cube);

  scene.add(cube, light);

  const resizer = new Resizer(container, camera, renderer);
  resizer.onResize = () => {
    this.render();
  };
}
```
{{< /code >}}

Now, try resizing the scene and notice that it works smoothly. This shows us that the loop is running correctly.

## The Animation System

Consider a simple game where you explore a map and pick apples. Here are some animated objects you might add to this game:

* The heroine, who has various animations like walk/run/jump/climb/pick.
* Trees with apples. The apples grow over time, and the leaves blow in the wind.
* Some scary bees that will try to chase you from the garden.
* An interesting environment with objects like water, wind, leaves, and rocks.
* Power-ups in the form of rotating cubes that hover above the ground.

... and so on. Each time the loop runs, we want to update all of these animations by moving them forward one frame. Just before we render each frame, we'll make the heroine step forward a tiny bit, we'll make each bee move towards her, we'll make the leaves move, the apples grow, and the powerups rotate, each by a tiny, tiny amount that is almost too small for the eye to see but over time creates a smooth animation.

### The `Loop.tick` Method

To handle all of this, we need a function that _updates_ all the animations, and this function should run once at the start of each frame. However, the word _update_ is already used a lot throughout three.js, so we'll choose the word _tick_ instead. Before we draw each frame, we'll make each animation _tick_ forward one frame.  Add the `Loop.tick` method at the end of the `Loop` class, and then call it within the animation loop:

{{< code lang="js" linenos="" linenostart="13" hl_lines="16 27-29" caption="_**Loop.js**_: create the `.tick` method" >}}
``` js
start() {
  this.renderer.setAnimationLoop(() => {
    // tell every animated object to tick forward one frame
    this.tick();

    // render a frame
    this.renderer.render(this.scene, this.camera);
  });
}

stop() {
  this.renderer.setAnimationLoop(null);
}

tick() {
  // Code to update animations will go here
}
```
{{< /code >}}

### Centralized or Decentralized?

When it comes to implementing this new `.tick` method, we have to make some design choices. One obvious solution is to create a complicated, centralized update function that controls all of the animated objects in our scene. It might look something like this:

{{< code lang="js" linenostart="27" linenos="false" hl_lines="" caption="A centralized animation system" >}}
``` js
tick() {
  if(controls.state.run) {
    character.runAnimation.nextFrame();
  }

  beeA.moveTowards(character.position);
  beeB.moveTowards(character.position);
  beeC.moveTowards(character.position);

  powerupA.rotation.z += 0.01;
  powerupB.rotation.z += 0.01;
  powerupC.rotation.z += 0.01;

  leafA.rotation.y += 0.01;

  // ... and so on
}
```
{{< /code >}}

Well, you get the picture. This might be ok if we have just a couple of animated objects in our scene, but it's not going to scale well. With fifty or a hundred animated objects, it's going to be downright ugly. It also breaks all kinds of software design principles, since now the `Loop` class has to have a deep understanding of how each animated object works.

Here's a better idea: we'll define the logic for updating each object _on the object itself_. Each object will expose that logic using a generic `.tick` method of its own. Now, the `Loop.tick` method will be simple. On each frame, we'll loop over a list of animated objects and tell each of them to `.tick` forward by one frame. It will look something like this:

{{< code lang="js" linenostart="23" linenos="false" hl_lines="" caption="A decentralized animation system" >}}

``` js
// somewhere in the Loop class:
this.updatables = [character, beeA, beeB, beeC, powerupA, powerupB, powerupC, leafA, ... ]
...

tick() {
  for(const object of this.updatables) {
    object.tick();
  }
}
```
{{< /code >}}

This is much better. Now, all the `Loop` class knows is that '_animated objects have a `.tick` method_'. These methods can be as complex or simple as needed for each object. For example, here's what a simple rotating powerup might look like:

{{< code lang="js" linenos="false" linenostart="1" hl_lines="" caption="Creating a rotating powerup with a `.tick` method" >}}
``` js
function createPowerup() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: 'purple' });
  const powerup = new Mesh(geometry, material);

  // this method will be called once per frame
  powerup.tick = () => {
    // increase the powerup's rotation each frame
    powerup.rotation.z += 0.05;

  };

  return powerup;
}
```
{{< /code >}}

If you compare this to _**components/cube.js**_, you'll see this is quite similar. We just need to add a `cube.tick` method.

This approach fits better with the modular philosophy we're using to design our application. Instead of having one part of the app grow more and more complicated, we'll break the complexity into small pieces, with each piece of logic defined at the place where it's used. This way, we can design each object as a self-contained entity. **Every object, from the humble spinning cube to the apple picking heroine, will encapsulate its behavior**. This is a powerful concept which we'll build on throughout the book.

### `Loop.updatables`

For this to work, we need a list of animated objects within the loop class. We'll use a simple array for this purpose, and we'll call this list `updatables`. Go ahead and create it now.

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="6" to="11" lang="js" linenos="true" hl_lines="10" caption="_**Loop.js**_: create a list to hold animated objects" >}}{{< /code >}}

Next, within `Loop.tick`, loop over this list and call `.tick` on any object within it.

{{< code lang="js" linenos="" linenostart="27" hl_lines="" caption="_**Loop.js**_: loop over animated objects and call their `.tick` method" >}}
``` js
tick() {
  for (const object of this.updatables) {
    object.tick();
  }
}
```
{{< /code >}}

Take careful note of the fact that `Loop.tick` will run every frame, which means it will run sixty times per second. It's important to keep the amount of work done here to a minimum, which means that each animated object's `.tick` method must be as simple as possible.

### The `cube.tick` Method

Before we can add `cube` to the `updatables` list, it needs a `.tick` method, so go ahead and create one. This `.tick` method is where we'll define the logic for rotating the cube.

Each type of animated object will have a different `.tick` method. In our [apple picking game](#the-animation-system), the heroine's tick method will check whether she is walking, running, jumping, or standing still, and then play a frame from one of those animations, while the apple tree's tick method will check the ripeness of the apples and rustle the leaves, and each of the evil bee's tick methods will check the position of the heroine then move the bee towards her a tiny bit. If she is close enough, the bee will attempt to sting her.

Here, we'll simply update the cube's rotation on the $X$, $Y$, _and_ $Z$ axes by a tiny amount each frame. This will give it a random-looking tumble.

{{< code lang="js" linenos="" linenostart="8" hl_lines="16-21" caption="_**cube.js**_: create the `.tick` method" >}}
``` js
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: 'purple' });
  const cube = new Mesh(geometry, material);

  cube.rotation.set(-0.5, -0.1, 0.8);

  // this method will be called once per frame
  cube.tick = () => {
    // increase the cube's rotation each frame
    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return cube;
}
```
{{< /code >}}

**Note**: adding a property to an existing class at run-time like this is known as [_monkey-patching_](https://en.wikipedia.org/wiki/Monkey_patch) (here, we're adding `.tick` to an instance of `Mesh`). It's common practice, and in our simple app won't cause any problems. However, we shouldn't get into the habit of doing this carelessly since in certain situations it can cause performance issues. We'll only allow ourselves to do this here as the alternatives are more complex.

0.01 is a value that gives a fairly slow rotation speed, and we discovered it by trial and error.  {{< link path="/book/first-steps/transformations/#the-unit-of-rotation-is-radians" title="Rotations in three.js are measured in radians" >}} so internally this value is being interpreted as _0.01 radians_, which is roughly half a degree. So, we're rotating the cube by about half a degree on each axis every frame. At sixty frames a second, this means our cube will rotate $60 \times 0.5 = 30 ^{\circ}$ each second, or one full rotation around each of the $X$, $Y$ and $Z$ axes approximately every twelve seconds.

#### Add the `cube` to `Loop.updatables`

Next, over in World, add the cube to the the `Loop.updatables` list.

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="16" to="31" lang="js" linenos="true" hl_lines="26" caption="_**World.js**_: add the cube to `Loop.updatables`" >}}{{< /code >}}

Right away, the cube should start rotating.

## Timing in the Animation System

Look at this sentence again: _**at sixty frames a second**, this means our cube will rotate $60 \times 0.5 = 30 ^{\circ}$ each second, or one full rotation around each of the $X$, $Y$ and $Z$ axes approximately every twelve seconds_. But, what if our app is _not_ running at sixty frames a second? If it's running at slower than 60FPS the animation will run slowly, while if it runs faster, the animation will run faster. In other words, the speed of our animation depends on the device it's being viewed on. Not good. To understand how to fix this, we need to take a deeper look at what we mean by the word _frame_.

### Fixed and Dynamic Frames

There's an important distinction between the kind of frames we are talking about in this chapter and the kind of frames that make up television shows or movies. **Frame rates in film are _fixed_**. Movies are usually shot at 24 frames per second (FPS), while the standard for television shows is 30FPS, although some newer shows may be filmed at 60FPS. Whatever frame rate is chosen, that rate won't change for the entire duration of the movie or show.

However, **our animation loop doesn't generate frames at a fixed rate**. The loop will attempt to render frames at the hardware-defined refresh rate of your screen (behind the scenes the browser is using `.requestAnimationFrame` to do this). At the time of writing, most screens have a 60Hz refresh rate, but this value can be as high as 240Hz on new screens, while in VR it will be at least 90Hz. This means, on a 60Hz screen, the **target frame rate** is 60FPS, on a 90Hz screen, the target frame rate is 90FPS, and so on.

However, we might not succeed in generating frames that quickly. If the device your app is running on is not be powerful enough to reach the target frame rate, the animation loop will run more slowly. Even on fast hardware, your app will have to share computing resources with other applications, and there may not always be enough to go around. In each of these cases, the animation loop will generate frames at a lower rate, and this rate may fluctuate from one moment to the next depending on many factors. This is called a **_variable frame rate_**.

That means, as we have currently set up the animation of our cube, it will rotate more slowly on an old, slow device, while on fancy new 240Hz gaming monitor it will go into hyper-speed. $240 = 4\times60$, meaning the cube will rotate at four times the desired speed!

To prevent this, **we need to decouple animation speed from frame rate**. Here's how we'll do it: **when we tell an object to `.tick` forward a frame, we'll scale the size of the movement by how long the previous frame took**. This way, as the frame rate varies, we'll constantly adjust the size of each `.tick` so that the animation remains smooth. Our adjustments will always be one frame behind, but the frames are generated so quickly this won't be visible to the user. This way, animations will run at the same speed on all devices.

### Measuring Time Across Frames

This is where the `Clock` class comes in. We'll use [`Clock.getDelta`](https://threejs.org/docs/#api/en/core/Clock.getDelta) to measure how long the previous frame took.

{{< code lang="js" linenos="false" caption="The `Clock.getDelta` method" >}}
import { Clock } from 'three';

const clock = new Clock();

const delta = clock.getDelta();
{{< /code >}}

**`.getDelta` tells us how much time has passed since the last time we called `.getDelta`**. If we call it once, and only once, at the start of each frame, it will tell us how long the previous frame took. **Note: if you call it `.getDelta` more than once per frame, subsequent calls will measure close to zero.** Only call `.getDelta` once at the very start of a frame!

{{% aside %}}
#### $Δ$ (Delta) {#delta}

Delta is a Greek letter, uppercase $Δ$, lowercase $δ$.

The $Δ$ symbol is often used to denote a change in some quantity. Here, `Clock.getDelta` tells us the rate of change of time.
{{% /aside %}}

### Create a `clock`

Over in Loop, create a module scoped `clock` instance at the top of the file.

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="3" caption="_**Loop.js**_: create the `clock`" footer="  ..." >}}{{< /code >}}

### Call `.getDelta` at the Start of Each Frame

Next, we'll call `.getDelta` at the start of `Loop.tick`, saving the result in a variable called `delta` which we'll then pass into the `.tick` method of each animated object.

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="27" to="38" skip_lines="31 32 33 34" lang="js" linenos="true" hl_lines="29 32" caption="_**Loop.js**_: pass time deltas to animated objects" >}}{{< /code >}}

{{% aside success %}}
### Frame Rates Are Never Perfectly Steady

In the inline code editor, we've added a log statement:

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="31" to="33" lang="js" linenos="true" caption="_**Loop.js**_: Log the elapsed time in milliseconds" >}}{{< /code >}}

`delta` is in seconds, so we multiplied it by one thousand to convert to milliseconds. These lines are commented out to avoid filling the console with hundreds of logs statement, but if you remove the `//` characters, and open the console by pressing F12, you'll see a rapidly updating list of logs telling you how long each frame took to render. If you are viewing this page on a monitor with a refresh rate of 60Hz, it'll look something like this:

{{< code lang="bash" linenos="false" caption="Frame times logged to the console" >}}
The last frame rendered in $17.40000000083819$ milliseconds
The last frame rendered in $15.710000006947666$ milliseconds
The last frame rendered in $16.574999986914918$ milliseconds
...
{{< /code >}}

Even with a powerful GPU and a scene as simple as this single cube, we won't achieve exactly sixty frames per second. Some frames render a little fast, and others render a little slow. This is normal. Part of the reason for this is that, [for security reasons](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#Reduced_time_precision) browsers add around a millisecond of jitter to the result of `.getDelta`.

{{% /aside %}}

### Scale the Cube's Rotation by `delta`

Scaling movements by `delta` is easy. We simply decide how much we want to move an object in one second, and then multiply that value by `delta` within the objects `.tick` method. In  `cube.tick`, we found a value that resulted in the cube rotating approximately thirty degrees a second _at 60FPS_.

{{< code lang="js" linenos="" linenostart="18" hl_lines="" caption="_**cube.js**_: the unscaled tick method" >}}
``` js
cube.tick = () => {
  // increase the cube's rotation each frame
  cube.rotation.z += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
};
```
{{< /code >}}

Now, we'll fix that so the cube rotates thirty degrees per second at _any_ FPS. First, we need to convert thirty degrees to radians, and for that, we'll use {{< link path="/book/first-steps/transformations/#the-unit-of-rotation-is-radians" title="`MathUtils.degToRad`" >}} method (refer back to the transformations chapter if you need a reminder of how that works):

{{< code lang="js" linenos="false" caption="Converting degrees to radians" >}}
import { MathUtils } from 'three';

const radiansPerSecond = MathUtils.degToRad(30);
{{< /code >}}

Next, we'll scale `radiansPerSecond` by `delta` each frame.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**cube.js**_: the updated tick method, now scaling by `delta`" >}}
``` js
cube.tick = (delta) => {
  // increase the cube's rotation each frame
  cube.rotation.z += radiansPerSecond * delta;
  cube.rotation.x += radiansPerSecond * delta;
  cube.rotation.y += radiansPerSecond * delta;
};
```
{{< /code >}}

Putting all that together, here's our final _**cube.js**_ module:

{{< code file="worlds/first-steps/animation-loop/src/World/components/cube.final.js" from="1" to="26" lang="js" linenos="true"
hl_lines="3 15 18-23" caption="_**cube.js**_: final code" >}}{{< /code >}}

{{< inlineScene entry="first-steps/animation-loop-duplicate.js" class="small right">}}

Now, once again the cube will be rotating thirty degrees per second around each axis, but with an important difference: the animation will now play at the same speed no matter where we run it, whether on a VR rig running at 90FPS, or a ten-year-old smartphone that can barely crank out 10FPS, or some future system from the year 3000 that runs at a billion FPS. **The frame rate may change, but the animation speed will not**.

With this change, **we have successfully decoupled animation speed from frame rate.**

## To Loop or Not to Loop

Now that we've started the loop, `.render` is being called over and over, creating a steady stream of frames, and before we render each frame, we're rotating the cube by a tiny amount. As long as the frames are being generated with sufficient speed (around 12FPS or above), and the difference between successive frames is small enough, we'll perceive this as an animation.

The animation loop will be the driving force of many apps. This loop, when combined with the idea of encapsulating the animation logic in each object's `.tick` method, is a powerful tool that we'll continue to explore and build on throughout the book. Later, we'll use the loop to drive behavior that is much more complex and interesting than our simple rotating cube, either [created in our code](https://threejs.org/examples/webgl_buffergeometry_instancing.html) or [loaded from an external application](https://threejs.org/examples/webgl_loader_fbx.html).

<div class="fig-comparison">
  {{< iframe src="https://threejs.org/examples/webgl_buffergeometry_instancing.html" height="500" title="An animation created in code" caption="An animation created in code" >}}
  {{< iframe src="https://threejs.org/examples/webgl_loader_fbx.html" height="500" title="An animation created in an external application" caption="An animation created in an external application" >}}
</div>

Animations like these are beautiful. However, they come at a cost, which will probably be obvious to you right now if you are viewing this on a low-powered device. As you chase the goal of sixty frames per second, you must work hard to keep the loop running fast. This is one place in your app where constant vigilance, profiling, and optimization is a necessity.

Not all scenes have animation though. Some scenes update only occasionally, for example, only during user interaction. A common example of this is a product display app. Such apps are used to display a 3D product such as a shoe or milk bottle that the user can rotate or zoom to get a better look. In this type of scene, whenever the user is _not_ interacting, the scene will remain unchanged between frames. Here's another example of a scene without an animation loop.

{{< iframe src="https://threejs.org/examples/webgl_decals.html" height="500" title="No animation loop doesn't mean no movement!" caption="No animation loop doesn't mean no movement!" >}}

Running the loop for an app like this would be a waste. This will be especially noticeable on mobile devices, where the constant GPU and CPU churn of the loop will drain the battery. As a result, you should only use the loop when you need to.

`World.render` and `World.start` give us two ways of producing frames. For apps with constant animation, we'll use `.start` to run a loop, and for apps that update occasionally, we'll call `.render` whenever a new frame is needed. We'll refer to the second technique as **_rendering on demand_**.

{{< code lang="js" linenos="false" caption="_**main.js**_: two ways of producing frames" >}}
const world = new World();

// produce a single frame (render on demand)
world.render();

// start the loop (produce a stream of frames)
world.start();
{{< /code >}}

Rendering on demand may reduce battery use, but on the other hand, using the loop is simpler. Instead of thinking about where and when you need to draw frames, you simply churn out a constant, steady supply, and for this reason, most of the examples in this book will use the loop. However, this is not an endorsement of the loop over rendering on demand. It's up to you to decide which method is appropriate for your app.

Next up, we'll see how to make our materials more interesting using textures.

## Challenges

{{% aside success %}}
### Easy

1. Play with the animation speed. Make the cube perform one rotation every hundred seconds, then one rotation every single second.

2. You can animate anything, not just rotations. Try animating some other properties of the mesh.

{{% /aside %}}

{{% aside %}}
### Medium

1. Add a `.tick` method to the camera, then make it zoom out slowly. Try zooming out at around one meter per second.

2. Add a `.tick` method to the light, and animate any of the `light.position.x`, `.y`, or `.z` parameters.

3. Add a `click` event listener (or, if you want to get fancy, a button) that starts and stops the animation loop. Do this in _**main.js**_ using `World.start` and `World.stop`.

Don't forget to add the camera and light to the `updatables` list! To zoom out, increase `camera.position.z`.

{{% /aside %}}

{{% aside warning %}}
### Hard

Rotation is an easy property to animate since rotations go round in circles. When we reach $360^\circ$ on any axis, we come back to where we started. This means we can infinitely increase the rotation and the result is a nice looking animation. If we do the same with position, or scaling, the object being animated will quickly vanish from our screens. However, we can create cyclical animations of other properties using {{< link path="/book/appendix/javascript-reference/#the-modulo-operator" title="the modulo operator `%`" >}}.

1. Animate the `.position` of the cube, camera, or light, using the modulo operator. Make the camera zoom out by ten meters repeatedly. Make the cube animate from the left to the right of the screen over and over again.

2. Make the camera zoom out by ten meters, then reverse direction to zoom in again. Animate the cube from left to right across the screen, then, when it reaches the right edge of the screen (roughly), have it reverse direction and move back to the starting point.

{{% /aside %}}
