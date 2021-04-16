---
title: "Making Our Scenes Responsive (and also Dealing with Jaggies)"
description: "In this chapter, we bring responsive design to our three.js app, ensuring our scene will smoothly resize to fit any browser window. We also turn on antialiasing, improving the quality of our final render a lot."
date: 2018-04-02
weight: 106
chapter: "1.6"
available: true
showIDE: true
IDEFiles: [
  "worlds/first-steps/responsive-design/src/World/components/camera.js",
  "worlds/first-steps/responsive-design/src/World/components/cube.js",
  "worlds/first-steps/responsive-design/src/World/components/lights.js",
  "worlds/first-steps/responsive-design/src/World/components/scene.js",
  "worlds/first-steps/responsive-design/src/World/systems/renderer.start.js",
  "worlds/first-steps/responsive-design/src/World/systems/renderer.final.js",
  "worlds/first-steps/responsive-design/src/World/systems/Resizer.start.js",
  "worlds/first-steps/responsive-design/src/World/systems/Resizer.final.js",
  "worlds/first-steps/responsive-design/src/World/World.start.js",
  "worlds/first-steps/responsive-design/src/World/World.final.js",
  "worlds/first-steps/responsive-design/src/main. js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/responsive-design/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['components', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/responsive-design/'
IDEActiveDocument: 'src/World/systems/Resizer.js'
---

{{% note %}}
THIS CHAPTER IS COMPLETE!
{{% /note %}}

# Making Our Scenes Responsive (and also Dealing with Jaggies)

Welcome back! The last chapter was a long one, stuffed full of mathematical and computer graphics theory. Here, we'll slow things down a little and look at the current state of our app.

Since we created {{< link path="/book/first-steps/world-app/" title=" the World app" >}} a couple of chapters ago, our code is well structured and ready to be expanded as we add features over the coming chapters. Next, we switched to {{< link path="/book/first-steps/physically-based-rendering/" title="physically correct lighting and rendering" >}} and explained how we'll (nearly always) build our scenes using meters for measurement. Our brains are tuned to appreciate physically correct lighting and colors, so when we set up our scenes this way a lot of the hard work of making them look great is done for us. This applies even to scenes with a cartoony or abstract look.

In the last chapter, we explored the coordinate systems and mathematical operations called transformations that are used to move objects around in 3D space. Over the next couple of chapters, we'll use everything we have learned so far and start to create scenes that are more interesting than a single cube.

But first, take a closer look at the cube:

{{< figure src="first-steps/cube-medium.png" alt="Our humble cube" class="left small noborder" lightbox="false" >}}

Closer...

{{< figure src="first-steps/cube-medium.png" alt="Our humble cube is getting closer" class="large noborder" lightbox="false" >}}

Even closer...

{{% note %}}
TODO-DIAGRAM: take all screenshots at same zoom level for identical aliasing
{{% /note %}}

{{< figure src="first-steps/cube-closeup-text.png" alt="Not until you see the white of it's eyes!" class="noborder" lightbox="false" >}}

Look closely at the cube's edges. Can you see that they are not straight, but rather look jagged and unclean? Technically, this is called **aliasing**, but informally we refer to these as jaggies. Ugh...

There's another problem. Try resizing the preview window in the editor and you'll see that the scene does not adapt to fit the new size (the preview might refresh too fast to see this easily, in which case, try popping it out into a new window using the {{< icon "solid/external-link-alt" >}} button). **In the language of web design, our scene is not _responsive_**. In this chapter, we'll fix both of these issues.

## Anti-Aliasing {#antialiasing}

{{< figure src="first-steps/antialias.svg" alt="Anti-alias on and off" class="" lightbox="false" >}}

It turns out that drawing straight lines using square pixels is hard unless the straight lines are exactly horizontal or vertical. We'll use a technique called **anti-aliasing** (**AA**) to counter this.

### Enable Anti-Aliasing

We can turn on anti-aliasing by passing a single new parameter into the `WebGLRenderer` constructor.  As with {{< link path="/book/first-steps/physically-based-rendering/#change-the-material-s-color" title="the `MeshStandardMaterial`" >}}, the `WebGLRenderer` constructor takes a specification object with named parameters. Here, we will set the `antialias` parameter to `true`:

{{< code file="worlds/first-steps/responsive-design/src/World/systems/renderer.final.js" from="3" to="9" lang="js" linenos="true" hl_lines="4" caption="_**renderer.js**_: Enable antialiasing" >}}{{< /code >}}

Note that **you can't change this setting once you have created the renderer**. To change it, you need to create an entirely new renderer. That's rarely a problem though since you'll want this on for most scenes.

{{% note %}}
TODO-DIAGRAM: add comparison of cube with and without AA
{{% /note %}}

### Multisample Anti-Aliasing (MSAA)

**Anti-aliasing is performed using the built-in WebGL method, which is [multisample anti-aliasing](https://en.wikipedia.org/wiki/Multisample_anti-aliasing) (MSAA)**. Depending on your browser and graphics card, there's a chance this will be unavailable or disabled, although on modern hardware that's unlikely. If your app does end up running on a device without MSAA, this setting will be ignored, but your scene will be otherwise unaffected.

MSAA is not a perfect solution, and there will be scenes that still display aliasing, even with AA enabled. In particular, scenes with many long, thin straight lines (such as wire fences, or telephone lines) are notoriously hard to remove aliasing from. If possible, avoid creating such scenes. On the other hand, some scenes look fine without AA, in which case you might choose to leave it switched off. On the powerful GPU in a laptop, you are unlikely to notice any difference in performance. However, mobile devices are a different story and you might be able to gain a few precious frames per second by disabling AA.

Other anti-aliasing techniques such as SMAA and FXAA are available as post-processing passes, as we'll see later in the book. However, these passes are performed on the CPU, while MSAA is done on the GPU (for most devices), so you may see a drop in performance if you use another technique, again, especially on mobile devices.

{{% note %}}
TODO-LINK: add link to FXAA/SMAA
{{% /note %}}

## Seamlessly Handling Browser Window Size Changes {#seamless-resize}

Currently, our app cannot handle a user doing something as simple as rotating their phone or resizing their browser. **We need to handle resizing gracefully, in an automatic manner that's invisible to our users**, and which involves a minimum of effort on our part. Unlike anti-aliasing, there's no magic setting to fix this. However, we already have a `Resizer` class, so here, we'll extend this to reset the size whenever the window changes size. After all, that's why we called this class a {{< link path="/book/first-steps/world-app/#systems-the-resizer-module-1" title="Re-sizer" >}} in the first place.

### Listen for `resize` Events on the Browser Window

First, we need some way of listening to the browser and then taking action when the window's size changes. In web-dev terminology, we want to **listen for resize events**. A built-in browser method called `element.addEventListener` makes our work easy here. We can use this method to listen for all kinds of events, such as `click`, `scroll`, `keypress`, and many more, on any HTML element. Whenever an event occurs, we say **the event has fired**. When a user clicks their mouse, the `click` event will fire, when they spin their scroll wheel, the `scroll` event will fire, when they resize the browser window, the `resize` event will fire, and so on.

Later, we'll use event listeners to add interactivity to our scenes. Here, we want to listen for the [`resize`](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event) event, which fires whenever the browser's window size changes. Rotating a mobile device from landscape to portrait, dragging a window between monitors on a multi-monitor setup, and resizing the browser by dragging the edges of the window with a mouse all cause the `resize` event to fire, which means the code we add here will handle all of these scenarios.

{{% note %}}
TODO-LINK: add link to interactivity chapter
{{% /note %}}

_If you are unfamiliar with event listeners, check out the {{< link path="/book/appendix/dom-api-reference/#listening-for-events" title="DOM API reference" >}} in the appendices for more info._

We can listen for most events, like `click`, or `scroll`, on any HTML element. However, the `resize` event listener must be attached to {{< link path="book/appendix/dom-api-reference/#global-object" title="the global `window` object" >}}. There is another way of listening for resize events which works with any element: the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver). However, it's quite new and at the time of writing this chapter isn't yet widely supported. Besides, it's a little more work to set up, so we'll stick with the tried and trusted `resize` event for now.

### Test `addEventListener` in the Browser Console

Before we set up automatic resizing in our app, we'll use the browser console to test `addEventListener` and the `resize` event. Open your browser console by pressing the F12 key, paste in the following code, then press _Enter_:

{{< code lang="js" linenos="false" caption="Paste this code into your browser console then resize the page" >}}
function onResize() {
  console.log('You resized the browser window!');
}

window.addEventListener('resize', onResize);
{{< /code >}}

{{< figure src="first-steps/console-resize.png" alt="Logging resize event to console" lightbox="true" class="medium right" >}}

This will call the `onResize` function every time the window resizes. Once you've entered the code, try resizing your browser while keeping an eye on the console. You should see something like the following image.

When we resize the window, the `onResize` callback might get called many times. You might think you have performed a single resize, but find the `resize` event has fired ten times or more. As a result, doing too much work in `onResize` can cause stuttering. It's important to keep this function simple.

> Don't do heavy calculations in the resize function.

If you find this function growing in size, you might consider using a throttling function such as [lodash's `_.throttle`](https://lodash.com/docs#throttle) to prevent it from being called too often.

### Extend the Resizer Class

Now that we've confirmed everything works as expected, we'll go ahead and extend the `Resizer` class to automatically handle resizing. That means we need to call the sizing code in two situations: first, on load, to set the initial size, and then again whenever the size changes.  So, let's move that code into a separate function, and then call it once when our scene loads:

{{< code lang="js" linenos="" linenostart="1" hl_lines="1-7 12" caption="_**Resizer.js**_: move the sizing code into a setSize function and call it on load" >}}
``` js
const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container, camera, renderer) {
    // set initial size on load
    setSize(container, camera, renderer);
  }
}

export { Resizer };
```
{{< /code >}}

Great. Now, let's add an event listener and call `setSize` again whenever the event fires.

{{< code lang="js" linenos="" linenostart="9" hl_lines="14-17" caption="_**Resizer.js**_: set up the event listener" >}}
``` js
class Resizer {
  constructor(container, camera, renderer) {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
    });
  }
}
```
{{< /code >}}

{{< figure src="first-steps/cube-stretched.png" caption="Cube abuse!" lightbox="true" class="medium left" >}}

Now, `setSize` is called whenever the `resize` event fires. However, we're not quite done yet. If you try resizing the window now, you'll see that the scene does expand or contract to fit the new window size. However, weird things are happening to the cube. It seems to be getting squashed and stretched instead of resizing with the window. What's going on?

{{< figure src="first-steps/cube-flattened.png" caption="Oh, the humanity!" lightbox="true" class="medium right" >}}

{{< clear >}}

The camera, renderer, and `<canvas>` element are all being resized correctly. However, we're only calling `.render` a single time, which draws a single frame into the canvas. When the canvas is resized, this frame is stretched to fit the new size.

### Create an `onResize` Hook

This means we need to generate a new frame every time the resize event fires. To do this, we need to call `World.render` right after `setSize`, inside the event listener in the `Resizer` class. However,  we'd rather not pass the entire World class into Resizer. Instead, we'll create a `Resizer.onResize` hook. This enables us to perform some custom behavior whenever a resize happens.

{{< code from="9" to="23" file="worlds/first-steps/responsive-design/src/World/systems/Resizer.final.js" lang="js" linenos="true" hl_lines="18 22" caption="_**Resizer.js**_: an empty onResize method for custom resizing behavior" header="" footer="" >}}{{< /code >}}

`.onResize` is an {{< link path="book/appendix/javascript-reference/#empty-functions" title="empty method" >}} that we can customize from outside the `Resizer` class.

### Customize `Resizer.onResize` in World

Over in World, replace the empty `.onResize` with a new one that calls `World.render`.

{{< code from="14" to="29" file="worlds/first-steps/responsive-design/src/World/World.final.js" lang="js" linenos="true" hl_lines="26-28" caption="_**World.js**_: customise Resizer.onResize" header="    ...." footer="" >}}{{< /code >}}

With that, automatic resizing is complete.

Now that automatic resizing and antialiasing are working, our app looks much more professional. In the next chapter, we'll set up an animation loop, which will spit out a steady stream of frames at a rate of sixty per second. Once we do that, we'll no longer need to worry about re-rendering the frame after resizing.

## Challenges

{{% aside success %}}
### Easy

1. Enable and disable AA and compare the difference.

2. Rotate the cube until the edges are vertical and horizontal. Now, can you see any difference with AA disabled?

3. Comment out the code for resizing in _**World.js**_ and compare the difference when you resize the window.

4. Comment out the custom `onResize` hook in _**World.js**_ and see what happens when you resize the window.

{{% /aside %}}

{{% aside %}}
### Medium

1. Disable antialiasing. Now, zoom in on the cube to get a better view of the aliasing artifact. Don't use your browser's zoom function. Instead, try these methods:
    * Enlarge the cube using `cube.scale`.
    * Bring the cube closer to you using `cube.position.z`.
    * Bring the camera closer to the cube using `camera.position.z` <br><br>

2. Still with AA disabled, use `camera.position.x` (horizontal movement) and `camera.position.y` (vertical movement) to zoom in on the right-hand corner of the cube.

3. Repeat 2., but this time, use `cube.position.x` and `cube.position.y`.

_Note how aliasing artifacts (jaggies) change as you move the cube around or zoom in and out._

{{% /aside %}}

{{% aside warning %}}
### Hard

1. Instead of using the container to size the scene, try entering some numbers manually. For example, create a scene that is 64 pixels wide and high, or 256 pixels wide and high. You might want to change the scene's background color here to see this more easily.

2. Play with the `devicePixelRatio`. Try setting a higher value for DPR, like 4 or 8 (don't go too high though!). What happens if you set a value below 1, like 0.5? What happens if you set a high value for DPR and disable AA? How do the edges of the cube look?

_`devicePixelRatio` values other than 1 render the scene at a higher or low resolution and then scale it to fit in the canvas. A DPR of 2 will render the scene at double resolution and scale down, while a DPR of 0.5 will render at half resolution and scale up. As you can imagine, high DPR values are very expensive to render!_

{{% /aside %}}
