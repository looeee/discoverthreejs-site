---
title: "Extend three.js With a Camera Controls Plugin"
description: "Here, we extend the three.js core with a camera controls plugin called OrbitControls. This plugin allows us to rotate/pan/zoom to the camera to view our scene from any angle."
date: 2018-04-02
weight: 109
chapter: "1.9"
available: true
showIDE: true
IDEFiles:
  [
    "assets/textures/uv-test-bw.png",
    "assets/textures/uv-test-col.png",
    "worlds/first-steps/camera-controls/src/World/components/camera.js",
    "worlds/first-steps/camera-controls/src/World/components/cube.js",
    "worlds/first-steps/camera-controls/src/World/components/lights.js",
    "worlds/first-steps/camera-controls/src/World/components/scene.js",
    "worlds/first-steps/camera-controls/src/World/systems/renderer.js",
    "worlds/first-steps/camera-controls/src/World/systems/Resizer.js",
    "worlds/first-steps/camera-controls/src/World/systems/controls.start.js",
    "worlds/first-steps/camera-controls/src/World/systems/controls.final.js",
    "worlds/first-steps/camera-controls/src/World/systems/Loop.js",
    "worlds/first-steps/camera-controls/src/World/World.start.js",
    "worlds/first-steps/camera-controls/src/World/World.final.js",
    "worlds/first-steps/camera-controls/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/camera-controls/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["assets", "components", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/camera-controls/"
IDEActiveDocument: "src/World/systems/controls.js"
---

# Extend three.js With a Camera Controls Plugin

The three.js core is a powerful, lightweight, and focused **rendering framework**, with intentionally limited capabilities. It has everything you need to create and render physically correct scenes, however, it does not have everything you need to create, say, a game, or a product configurator. Even when building relatively simple apps, you will often find yourself needing functionality that's not in the core. When this happens, before you write any code yourself, check to see whether there's a plugin available. The three.js repo contains hundreds of extensions, in the [_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm) folder. These are also included in [the NPM package](https://www.npmjs.com/package/three), for those of you using a package manager.

There are also a huge number of plugins to be found scattered around the web. However, these are sometimes poorly maintained and may not work with the latest three.js version, so in this book, we'll restrict ourselves to using the official plugins from the repo. There, we'll find all kinds of plugins, and most of them are showcased in one of [the examples](https://threejs.org/examples/). These add all kinds of functionality, such as mirrored surfaces:

{{< iframe src="https://threejs.org/examples/webgl_mirror_nodes.html" title="three.js node materials mirror example" height="500" >}}

Or, how about a loader for the Lego LDraw format:

{{< iframe src="https://threejs.org/examples/webgl_loader_ldraw.html" height="500" title="three.js LDraw format example" >}}

Here are a few more:

- [One of the many post-processing effects](https://threejs.org/examples/?q=postprocessing#webgl_postprocessing_glitch)
- [A loader for the Autodesk FBX format](https://threejs.org/examples/?q=loader#webgl_loader_fbx)
- [An exporter for glTF format](https://threejs.org/examples/?q=exporter#misc_exporter_gltf)
- [Physically accurate ocean and sky](https://threejs.org/examples/?q=ocean#webgl_shaders_ocean)

Each extension is stored in a separate module in _**examples/jsm**_, and to use them, we simply import them into our app, much like any other three.js class.

## Our First Plugin: `OrbitControls`

One of the most popular extensions is [`OrbitControls`](https://threejs.org/docs/#examples/en/controls/OrbitControls), a camera controls plugin which allows you to orbit, pan, and zoom the camera using touch, mouse, or keyboard. With these controls, we can view a scene from all angles, zoom in to check tiny details, or zoom out to get a birds-eye overview. Orbit controls allow us to control the camera in three ways:

1. **Orbit around a fixed point, using the left mouse button or a single finger swipe.**
2. **Pan the camera using the right mouse button, the arrow keys, or a two-finger swipe.**
3. **Zoom the camera using the scroll wheel or a pinch gesture.**

You can find the module containing `OrbitControls` on the three.js repo, in the _**examples/jsm/controls/**_ folder, in a file called _**[OrbitControls.js](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js)**_. There's also an [official example showcasing `OrbitControls`](https://threejs.org/examples/?q=controls#misc_controls_orbit). For a quick reference of all the control's settings and features, head over to the [`OrbitControls` doc page](https://threejs.org/docs/#examples/en/controls/OrbitControls).

### Importing Plugins

Since the plugins are part of the three.js repo and included in the NPM package, importing them works in much the same way as {{< link path="/book/first-steps/first-scene/#import-classes-from-threejs" title="importing classes from the three.js core" >}}, except that each plugin is in a separate module. Refer back to {{< link path="/book/introduction/get-threejs/" title="" >}} for a reminder of how to include the three.js files in your app, or head over to {{< link path="/book/appendix/javascript-modules/" title="" >}} for a deeper exploration of how JavaScript modules work.

In the editor, we've placed the _**OrbitControls.js**_ file in the equivalent directory to the repo, under _**vendor/**_. Go ahead and locate the file now. Since the editor uses NPM style imports, we can import `OrbitControls` like this, from anywhere in our code like this:

{{< code lang="js" linenos="false" caption="Importing the `OrbitControls` extension using NPM style imports" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
{{< /code >}}

Once again, if you’re working locally and not using a bundler, you’ll have to change the import path. For example, you can import from skypack.dev instead.

{{< code lang="js" linenos="false" caption="Importing the `OrbitControls` extension using relative imports" >}}
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js?module';
{{< /code >}}

> Important note: Make sure you import plugins from _**examples/jsm/**_ and not legacy plugins from _**examples/js/**_!

### The _**controls.js**_ Module

As usual, we'll create a new module in our app to handle setting up the controls. Since the controls operate on the camera, they will go in the {{< link path="/book/first-steps/world-app/#systems-and-components" title="systems category" >}}. Open or create the module _**systems/controls.js**_ to handle setting up the camera controls. This new module has the same structure as most of our other modules. First, import the `OrbitControls` class, then make a `createControls` function, and finally, export the function:

{{< code lang="js" linenos="true" caption="_**systems/controls.js**_: initial setup" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls() {}

export { createControls };
{{< /code >}}

Back over in World, add the new function to the list of imports:

{{< code from="1" to="9" file="worlds/first-steps/camera-controls/src/World/World.final.js" lang="js" linenos="true" hl_lines="6" caption="_**World.js**_: import the controls module" >}}{{< /code >}}

Next, call the function and store the result in a variable called `controls`. While you're here, comment out the line adding `cube` to the `updatables` array. This will stop the cube from rotating and make the effect of the controls easier to see:

{{< code lang="js" linenos="true" linenostart="17" hl_lines="22 27 28" caption="_**World.js**_: stop the cube's animation" >}}

```js
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    const controls = createControls();

    const cube = createCube();
    const light = createLights();

    // disabled mesh rotation
    // updatables.push(cube);

    scene.add(cube, light);

    this.canvas = renderer.domElement;
  }
```

{{< /code >}}

### Initialize the Controls

If you check out the [`OrbitControls` docs page](https://threejs.org/docs/#examples/en/controls/OrbitControls), you'll see that the constructor takes two parameters: a `Camera`, and a [`HTMLDOMElement`](https://developer.mozilla.org/en-US/docs/Web/API/Element). We'll use our camera for the first parameter and the canvas, stored in `renderer.domElement`, for the second.

Internally, `OrbitControls` uses `addEventListener` to listen for user input. The controls will listen for events such as `click`, `wheel`, `touchmove`, and `keydown`, amongst others, and use these to move the camera. We previously used this method to {{< link path="/book/first-steps/responsive-design/#listen-for-resize-events-on-the-browser-window" title="listen for the `resize` event" >}} when we set up automatic resizing. There, we listened for the `resize` event on the entire `window`. Here, the controls will listen for user input on whatever element we pass in as the second parameter. The rest of the page will be unaffected. In other words, when we pass in the canvas, the controls will work when the mouse/touch is over the canvas, but the rest of the page will continue to work as normal.

Pass the camera and canvas into the `createControls` function, then create the controls:

{{< code lang="js" linenos="true" linenostart="3" caption="_**controls.js**_: create the controls" >}}
function createControls(camera, canvas) {
const controls = new OrbitControls(camera, canvas);

return controls;
}
{{< /code >}}

Back over in the world module, pass in the `camera` and `renderer.domElement`:

{{< code lang="js" linenos="" linenostart="18" hl_lines="24" caption="_**World.js**_: initialize the controls" >}}

```js
constructor(container) {
  camera = createCamera();
  scene = createScene();
  renderer = createRenderer();
  container.append(renderer.domElement);

  const controls = createControls(camera, renderer.domElement);

  // ...
}
```

{{< /code >}}

With that, the controls should start to work. Take them for a spin!

You'll immediately notice [the cube is not illuminated from the back](#a-glaring-problem). We'll explain why and how to fix this in the next chapter.

{{% note %}}
TODO-LOW: add a "using the controls section" that explains how the controls work
{{% /note %}}

## Working with the Controls

### Manually Set the Target

By default, the controls orbit around the center of the scene, point $(0,0,0)$. This is stored in the `controls.target` property, which is a `Vector3`. We can move this target to a new position:

{{< code lang="js" linenos="false" caption="Set the control's target" >}}
controls.target.set(1,2,3);
{{< /code >}}

We can also point the controls at an object by copying the object's position.

{{< code lang="js" linenos="false" caption="_**World.js**_: target an object" >}}
controls.target.copy(cube.position);
{{< /code >}}

{{% note %}}
TODO-LOW: what is mobile control for pan?
{{% /note %}}

Whenever you pan the controls (using the right mouse button), the target will pan too. If you need a fixed target, you can disable panning using `controls.enablePan = false`.

### Enable Damping for Added Realism

As soon as the user stops interacting with the scene, the camera will come to an abrupt stop. Objects in the real world have inertia and never stop abruptly like this, so we can make the controls feel more realistic by enabling [damping](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.enableDamping).

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable damping" >}}
controls.enableDamping = true;
{{< /code >}}

With damping enabled, the controls will slow to a stop over several frames which gives them a feeling of
weight. You can adjust [the `.dampingFactor`](https://threejs.org/docs/#examples/en/controls/OrbitControls.dampingFactor) to control how fast the camera comes to a stop. However, for damping to work, we must call `controls.update` every frame in the animation loop. If we're [rendering frames on demand](#rendering-on-demand-with-orbitcontrols) instead of using the loop, we cannot use damping.

### Update the Controls in the Animation Loop

Whenever we need to update an object in the loop, we'll use the technique we devised when creating {{< link path="/book/first-steps/animation-loop/#create-the-animation" title="the cube's animation" >}}. In other words, we'll give the controls a `.tick` method and then add them to the `loop.updatables` array. First, the `.tick` method:

{{< code file="worlds/first-steps/camera-controls/src/World/systems/controls.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="12" caption="_**controls.js**_: add controls.tick" >}}{{< /code >}}

Here, `.tick` simply calls `controls.update`. Next, add the controls to the `updatables` array:

{{< code file="worlds/first-steps/camera-controls/src/World/World.final.js" from="18" to="37" lang="js" linenos="true" hl_lines="29" caption="_**World.js**_: add the controls to the updatables array" >}}{{< /code >}}

Now, `controls.tick` will be called once per frame in {{< link path="/book/first-steps/animation-loop/#the-update-loop" title="the update loop" >}}, and damping will work. Test it out. Can you see the difference?

### Working With the Camera While Using `OrbitControls`

With the controls in place, we have relinquished control of the camera to them. However, sometimes you need to take back control to manually position the camera. There are two ways to go about this:

1. Cut/jump to a new camera position
2. Smoothly animate to a new camera position

We'll take a brief look at how you would go about both of these, but we won't add the code to our app.

#### Cut to a New Camera Position

To perform a camera cut, update the camera's transform as usual, and then call `controls.update`:

{{< code lang="js" linenos="false" caption="Manually adjust the camera transform while using `OrbitControls`" >}}
// move the camera
camera.position.set(1,2,3);

// and/or rotate the camera
camera.rotation.set(0.5, 0, 0);

// then tell the controls to update
controls.update();
{{< /code >}}

If you're calling `.update` in the loop, you don't need to do it manually and you can simply move the camera. If you move the camera _without_ calling `.update`, weird things will happen, so watch out!

One important thing to note here: when you move the camera, the `controls.target` does not move. If you have not moved it, it will remain at the center of the scene. When you move the camera to a new position but leave the target unchanged, the camera will not only move but also _rotate_ so that it continues to point at the target. This means that camera movements may not work as you expect when using the controls. Often, you will need to move the camera and the target at the same time to get your desired outcome.

#### Smoothly Transition to a New Camera Position

If you want to smoothly animate the camera to a new position, you will probably need to transition the camera and the target at the same time, and the best place to do this is in the `controls.tick` method. However, you will need to disable the controls for the duration of the animation, otherwise, if the user attempts to move the camera before the animation has completed, you'll end up with the controls fighting against your animation, often with disastrous results.

{{< code lang="js" linenos="false" hl_lines="" caption="Disable the controls while animating the camera or target" >}}

```js
controls.enabled = false;
```

{{< /code >}}

### Save and Restore a View State

You can save the current view using [`.saveState`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.saveState), and later restore it using [`.reset`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.reset):

{{< code lang="js" linenos="false" caption="_**controls.js**_: save and restore state" >}}
controls.saveState();

// sometime later:
controls.reset();
{{< /code >}}

If we call `.reset` without first calling `.saveState`, the camera will jump back to the position it was in when we created the controls.

### Disposing of the Controls

If you no longer need the controls, you can clean them up using [.dispose](https://threejs.org/docs/#examples/en/controls/OrbitControls.dispose), which will remove all event listeners created by the controls from the canvas.

{{< code lang="js" linenos="false" caption="_**controls.js**_: remove all event listeners from the canvas" >}}
controls.dispose();
{{< /code >}}

## Rendering on Demand with `OrbitControls`

A couple of chapters ago we set up the {{< link path="/book/first-steps/animation-loop/" title="animation loop" >}}, a powerful tool that allows us to create beautiful animations with ease. On the other hand, as we discussed at the end of that chapter, {{< link path="/book/first-steps/animation-loop/#to-loop-or-not-to-loop" title="the loop does have some downsides" >}}, such as increased battery use on mobile devices. As a result, sometime we'll choose to render frames **on demand** instead of generating a constant stream of frames using the loop.

Now that our app has orbit controls, whenever the user interacts with your scene, the controls will move the camera to a new position, and when this occurs you must draw a new frame, otherwise, you won't be able to see that the camera has moved. If you're using the animation loop, that's not a problem. However, if we're rendering on demand we'll have to figure something else out.

Fortunately, `OrbitControls` provides an easy way to generate new frames whenever the camera moves. The controls have a custom event called `change` which we can listen for using {{< link path="/book/appendix/dom-api-reference/#listening-for-events" title="`addEventListener`" >}}. This event will fire whenever a user interaction causes the controls to move the camera.

To use rendering on demand with the orbit control, you must render a frame whenever this event fires:

{{< code lang="js" linenos="false" caption="Rendering on demand with `OrbitControls`" >}}
controls.addEventListener('change', () => {
renderer.render(scene, camera);
});
{{< /code >}}

To set this up inside _**World.js**_, you'll use `this.render`:

{{< code lang="js" linenos="false" caption="_**World.js**_: Rendering on demand with `OrbitControls`" >}}
controls.addEventListener('change', () => {
this.render();
});
{{< /code >}}

Next, over in _**main.js**_, make sure we're no longer starting the loop. Instead, render the initial frame:

{{< code lang="js" linenos="" linenostart="10" hl_lines="" caption="_**main.js**_: render a single frame instead of starting the loop" >}}

```js
// render the inital frame
world.render();
```

{{< /code >}}

If you make these changes in your app, you'll see that this results in a slight problem. When we render the initial frame in _**main.js**_, the texture has not yet loaded, so the cube will look black. If we were running the loop, this frame would almost instantly be replaced with a new one after the texture loads, so it might not even be noticeable that the cube was black for a few milliseconds. However, with rendering on demand, we are now only generating new frames when the user interacts with the scene and moves the camera. As soon as you move the controls, sure enough, a new frame will be created and the texture will show up.

{{% note %}}
TODO-LOW: add inline scene demonstrating the above
{{% /note %}}

As a result, you also need to generate a new frame after the texture has loaded. We won't cover how to do that here, but hopefully, it highlights why rendering on demand is trickier than using the loop. You have to consider all situations where you need a new frame (for example, don't forget that you'll also need to {{< link path="/book/first-steps/responsive-design/#create-an-onresize-hook" title="render a frame on resize" >}}).

## `OrbitControls` Configuration

The controls have lots of options that allow us to adjust them to our needs. Most of these are [well explained in the docs](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls), so we won't cover them exhaustively here. The following are some of the most important.

### Enable or Disable the Controls

We can [enable or disable the controls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.enabled) entirely:

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable or disable" >}}
controls.enabled = false;
{{< /code >}}

Or, we can disable any of the three modes of control individually:

{{< code lang="js" linenos="false" caption="_**controls.js**_: disable individual modes" >}}
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
{{< /code >}}

By default, you can use the arrow keys to pan the camera. To disable this:

{{< code lang="js" linenos="false" caption="_**controls.js**_: disable keyboard pan controls" >}}
controls.enableKeys = false;
{{< /code >}}

### Auto Rotate

[`.autoRotate`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.autoRotate) will make the camera automatically rotate around the `.target`, and [`.autoRotateSpeed`](https://threejs.org/docs/#examples/en/controls/OrbitControls.autoRotateSpeed) controls how fast:

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable auto-rotation" >}}
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
{{< /code >}}

As with `.enableDamping`, you must call `controls.update` every frame for this to work. Note that `.autoRotate` will still work if the controls are disabled.

### Limiting Zoom

We can limit how far the controls will zoom in or out:

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit zoom" >}}
controls.minDistance = 5;
controls.maxDistance = 20;
{{< /code >}}

Make sure `minDistance` is not smaller than [the camera's near clipping plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.near) and `maxDistance` is not greater than [the camera's far clipping plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.far). Also, `minDistance` must be smaller than `maxDistance`.

### Limiting Rotation

We can limit the control's rotation, both horizontally (azimuth angle):

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit horizontal rotation" >}}
controls.minAzimuthAngle = - Infinity; // default
controls.maxAzimuthAngle = Infinity; // default
{{< /code >}}

... and vertically (polar angle)

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit vertical rotation" >}}
controls.minPolarAngle = 0; // default
controls.maxPolarAngle = Math.PI; // default
{{< /code >}}

Remember, {{< link path="/book/first-steps/transformations/#the-unit-of-rotation-is-radians" title="rotations are specified using radians" >}}, not degrees, and $\pi$ radians is equal to $180^{\circ}$.

## A Glaring Problem!

As soon as we rotate the camera using our fancy new orbit controls, we'll see a glaring problem. The camera rotates, but the light is fixed and shines only from one direction. The rear faces of the cube receive no light at all!

In the real world, light bounces and reflects off every surface, so the rear of the cube would be dimly lit. There's nothing in this simple scene aside from the cube, so there's nothing for the light to bounce off. But, even if there was, performing these calculations is much too expensive for us to do in real-time. In the next chapter, we will look at a technique for overcoming this problem known as **ambient lighting**.

## Challenges

{{% aside success %}}

### Easy

1. Try adjusting the control's [minimum and maximum zoom levels](#limiting-zoom). What happens if you make these two values equal? Or make `minDistance` greater than `maxDistance`?

2. Enable [auto-rotation](#auto-rotate) and then try adjusting the rotation speed.

3. Try [disabling each of the three modes of control](#enable-or-disable-the-controls), one at a time, and observe the results.

4. [Adjust the damping speed](#enable-damping-for-added-realism) (`.dampingFactor`) to get a feel for how damping works. Values greater than 0 and less than 1 work best.

{{% /aside %}}

{{% aside %}}

### Medium

1. Try adjusting the control's [horizontal and vertical rotation limits](#limiting-rotation). Remember, if you are working in degrees you must convert to radians. Look inside _**cube.js**_ if you need a reminder of how that works.

2. Add a button (or a click event listener) to the page, and whenever you click the button, move the camera and control's target to a new, random position. Try and constrain the movement so that the cube is always still somewhere on the screen.

{{% /aside %}}

{{% aside warning %}}

### Hard

1. Set up [rendering on demand](#rendering-on-demand-with-orbitcontrols) while using the controls, including generating a new frame after the texture has loaded, and whenever the scene is resized.

2. Can you make the camera and the control's target animate to a new position over a few seconds? Maybe add a button to the page, and when you click it, play the animation. See what happens when you animate just the camera, or just the target, or what happens when you don't disable the controls while animating. The best place to set up this animation is in the controls module.

{{% /aside %}}
