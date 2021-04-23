---
title: "Your First three.js Scene: Hello, Cube!"
description: "In this chapter, we build our first three.js scene and create the Hello World of three.js apps: a simple white cube. While doing so, we introduce many important concepts such as the scene, renderer, and camera."
date: 2018-04-02
weight: 102
chapter: "1.2"
available: true
showIDE: true
IDEFiles: [
  'styles/main.css',
  'vendor/three/build/three.module.js',
  'worlds/first-steps/first-scene/index.html',
  'worlds/first-steps/first-scene/src/main.start.js',
  'worlds/first-steps/first-scene/src/main.final.js',
]
IDEComparisonMode: true
IDEClosedFolders: ['styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/first-scene/'
IDEActiveDocument: 'index.html'
IDEActiveDocument: 'src/main.js'
---



# Your First three.js Scene: Hello, Cube!

In this chapter, we'll create the Hello World of three.js apps: a simple white cube. Since we've already set up a simple webpage, as described in the last chapter, all we need to do is write a couple of lines of JavaScript in _**src/main.js**_ and our app will spring to life. We'll introduce quite a bit of theory along the way, but the actual code is short. Below is what this file will look like by the end of the chapter. Not counting the import statement and comments, there are under twenty lines of code in total. That's all it takes to create a simple "Hello Cube!" three.js app.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" linenos="" caption="_**main.js**_: final result" >}}{{< /code >}}

Click the <input type="checkbox" class="simple-toggle" title="Find the real toggle!"> toggle on the top left of the editor to {{< link path="/book/introduction/about-the-book/#before-and-after-code-comparison" title="see this code in action" >}}, or, if you prefer to {{< link path="/book/introduction/about-the-book/#working-on-your-own-machine" title="work locally" >}}, you can click the {{< icon "solid/download" >}} button to download a zip archive containing all the files from the editor. If any of the JavaScript here is unfamiliar to you, refer to {{< link path="/book/appendix/javascript-reference" title="" >}} and {{< link path="/book/appendix/dom-api-reference" title="" >}} in the appendices.

## The Components of a Real-Time 3D App

{{% note %}}
  TODO-DIAGRAM: This graph is confusing - Annie Chen
{{% /note %}}

{{< figure src="first-steps/rendered_scene_canvas.svg" alt="A basic scene" lightbox="true" >}}

Before we get started on the code, let's look at the basic components that make up every three.js app. First, there's the scene, camera, and renderer, which form the basic scaffolding of the application. Next, there's the HTML {{< link path="/book/first-steps/app-structure/#adding-a-three-js-scene-to-the-page" title="`<canvas>` element" >}}, where we see the results. Last but not least, there's a visible object such as a mesh. With the exception of the canvas (which is specific to the browser), an equivalent to each of these components can be found in any 3D graphics system, making the knowledge you'll gain in these pages highly transferable.

### The Scene: a Tiny Universe

**The scene is a holder for everything we can see**. You can think of it as a "tiny universe" in which all your 3D objects live. The three.js class we use to create a scene is simply called [`Scene`](https://threejs.org/docs/#api/en/scenes/Scene). The constructor takes no parameters.

{{< code linenos="false" caption="Creating a `scene`" >}}
import { Scene } from 'three';

const scene = new Scene();
{{< /code >}}

{{< figure src="first-steps/coordinate_system_simple.svg" caption="The world space coordinate system, defined by the Scene" class="small left" lightbox="true" >}}

{{% note %}}
TODO-LOW: replace all coordinate diagrams with a 3D coordinate systems
{{% /note %}}

The `scene` defines a coordinate system called **World Space**, which is our main frame of reference when working with visible objects in three.js. World space is a [3D Cartesian coordinate system](https://mathinsight.org/cartesian_coordinates). We'll explore what that means and how to use world space in more detail in {{< link path="/book/first-steps/transformations/#coordinate-systems" title="" >}}.

The very center of the scene is the point $(0,0,0)$, also called the **origin** of the coordinate system. Whenever we create a new object and add it to our scene, it will be placed at the origin, and whenever we move it around, we do so within this coordinate system.

{{< figure src="first-steps/scene_graph.svg" caption="Objects added to the Scene live in the scene-graph, <br> a tree of visible objects" class="small right" lightbox="true" >}}

When we add objects to the scene, they are placed into the [**scene graph**](http://what-when-how.com/advanced-methods-in-computer-graphics/scene-graphs-advanced-methods-in-computer-graphics-part-1/) which is a tree structure with the scene at the top.

{{< clear >}}

{{< figure src="appendix/html-tree.svg" caption="Elements on a HTML page also form a tree structure" class="small left" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: improve scene graph diagram - add at least a camera as well
{{% /note %}}

This is similar to the way elements on a HTML page are structured, except that the HTML page is 2D while the scene graph is 3D.

### The Camera: a Telescope pointed at the Tiny Universe

The tiny universe of the scene is a realm of pure mathematics. To view the scene, we need to open a window into this realm and convert into something that makes sense to our human eyes, and that's where the camera comes in. There are several ways to convert the scene graphic into a human vision friendly format, using techniques called **projections**. The most important type of projection, for us, is **perspective projection**, which is designed to match the way our eyes see the world. To view the scene using perspective projection, we use the [`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera). This type of camera is the 3D equivalent of a camera in the real world and uses many of the same concepts and terminology, such as the field of view and the aspect ratio. Unlike the `Scene`, the `PerspectiveCamera` constructor takes several parameters, which we'll explain in detail below.

{{% note %}}
TODO-DIAGRAM: add simple diagram of perspective projection here
{{% /note %}}

{{< code linenos="false" caption="Creating a `PerspectiveCamera`" >}}
import { PerspectiveCamera } from 'three';

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
{{< /code >}}

Another important type of projection is **orthographic projection**, which we can access using the [`OrthographicCamera`](https://threejs.org/docs/#api/en/cameras/OrthographicCamera). You might be familiar with this type of projection if you have ever studied engineering diagrams or blueprints, and it's useful for creating 2D scenes or user interfaces that overlay a 3D scene. In this book, we'll use HTML to create user interfaces and three.js to create 3D scenes, so we'll stick with the `PerspectiveCamera` for the most part.

The following example shows the difference between these two cameras. The left side shows the scene rendered with an `OrthographicCamera` (Press O) or a `PerspectiveCamera` (press P), while the right side of the view shows a zoomed-out overview of the camera:

{{< iframe src="https://threejs.org/examples/webgl_camera.html" height="500" title="The OrthographicCamera and PerspectiveCamera in action" caption="The OrthographicCamera and PerspectiveCamera in action" >}}

{{% note %}}
TODO-LOW: improve this - simple show ortho left and perspective right
{{% /note %}}

### The Renderer: An Artist of Extraordinary Talent and Speed

If the scene is a tiny universe, and the camera is a telescope pointed at that universe, then the renderer is an artist who looks through the telescope and draws what they see onto a `<canvas>`, _incredibly fast_. We call this process **rendering**, and the resulting picture is a **render**. In this book, we will exclusively use the [`WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) which renders our scenes using [**WebGL2**](https://en.wikipedia.org/wiki/WebGL), if it's available, and falls back to **WebGL V1** if it's not. The constructor for the renderer does take several parameters, however, if we leave them out default values will be used, which is fine for now.

{{% note %}}
TODO-LOW: if WEBGPU becomes a thing this will have to be updated
{{% /note %}}

{{< code linenos="false" caption="Creating a renderer with default parameters" >}}
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();
{{< /code >}}

Together, **the scene, camera, and renderer give us the basic scaffolding of a three.js application**. However, none of them can be _seen_. In this chapter, we'll introduce a type of visible object called a **mesh**.

## Our First Visible Object: Mesh

{{< figure src="first-steps/mesh_details.svg" caption="A mesh contains of a geometry and a material" lightbox="true" class="medium left" >}}

**[Meshes](https://threejs.org/docs/#api/en/objects/Mesh) are the most common kind of visible object used in 3D computer graphics**, and are used to display all kinds of 3D objects - cats and dogs and humans and trees and buildings and flowers and mountains can all be represented using a mesh. There are other kinds of visible objects, such as lines, and shapes, and sprites, and particles, and so on, and we'll see all of them in later sections, but we'll stick with meshes throughout these introductory chapters.

{{< code linenos="false" caption="Creating a mesh" >}}
import { Mesh } from 'three';

const mesh = new Mesh(geometry, material);
{{< /code >}}

As you can see, the `Mesh` constructor takes two parameters: **a geometry and a material**. We will need to create both of these before can create the mesh.

### The Geometry

**The geometry defines the shape of the mesh**. We'll use a kind of geometry called a [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry). In this case, we want a box shape, so we'll use a [`BoxBufferGeometry`](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry), which is one of several basic shapes provided in the three.js core.

{{< code linenos="false" caption="Creating a 2x2x2 box shaped geometry" >}}
import { BoxBufferGeometry } from 'three';

const length = 2;
const width = 2;
const depth = 2;

const geometry = new BoxBufferGeometry(length, width, depth);
{{< /code >}}

 The constructor takes up to six parameters, but here, we provide only the first three, which specify the length, width, and depth of the box. Defaults are provided for any parameters we omit. You can play with all six parameters in the scene below.

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#BoxBufferGeometry" height="500" title="The BoxBufferGeometry in action" caption="The `BoxBufferGeometry` in action" >}}

### The Material

While the geometry defines the shape, **the material defines how the surface of the mesh looks**. We'll use the [`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) in this chapter, which is the simplest kind of material available, and more importantly, doesn't require us to add any lights to the scene. For now, we will omit all parameters which means a default white material will be created.

{{< code linenos="false" caption="Creating a basic material" >}}
import { MeshBasicMaterial } from 'three';

const material = new MeshBasicMaterial();
{{< /code >}}

Many of the parameters are available for testing here. The _Material_ menu has parameters that are common to all three.js materials, while the _MeshBasicMaterial_ menu has parameters that belong to just this material.

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="The MeshBasicMaterial in action" caption="The `MeshBasicMaterial` in action" >}}

## Our First three.js App {#simple-steps}

Now we are ready to write some code! We've introduced all the components that will make up our simple app, so the next step is to figure out how they all fit together. We'll break process this into six steps. Every three.js app you create will require all six of these steps, although more complex apps will often require many more.

1. **[Initial Setup](#setup)**
2. **[Create the Scene](#create-scene)**
3. **[Create the Camera](#create-camera)**
4. **[Create a Visible Object](#create-visible)**
5. **[Create the Renderer](#create-renderer)**
6. **[Render the Scene](#render-scene)**

## 1. Initial Setup {#setup}

An important part of the initial setup is creating some kind of web page to host our scene, which we covered in the last chapter. Here, we'll focus exclusively on the JavaScript we need to write. First, we'll import the necessary classes from three.js, and then we'll obtain a reference to the `scene-container` element from the _**index.html**_ file.

### Import Classes from three.js

Rounding up all the components we've introduced so far, we can see that we need these classes:

- `BoxBufferGeometry`
- `Mesh`
- `MeshBasicMaterial`
- `PerspectiveCamera`
- `Scene`
- `WebGLRenderer`

We'll also use the `Color` class to set the scene's background color:

- `Color`

We can import everything we need from the three.js core using a single `import` statement.

{{< code from="1" to="9" file="worlds/first-steps/first-scene/src/main.final.js" caption="_**main.js**_: importing the required three.js classes, NPM style" >}}{{< /code >}}

If you're working locally (and not using a bundler like Webpack), you'll have to change the import path. For example, you can import from unpkg.com instead.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**main.js**_:  importing the required three.js classes from a CDN" >}}
``` js
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'https://unpkg.com/three@0.117.0/build/three.module.js';

```
{{< /code >}}

Refer back to {{< link path="/book/introduction/get-threejs/#imports-in-the-inline-code-editor" title="" >}} if you need a reminder on how importing three.js classes works, or jump over to {{< link path="/book/appendix/javascript-modules/" title="" >}} if you want a refresher on JavaScript modules.

### Access the HTML `scene-container` Element in JavaScript

Over in _**index.html**_, we created a `scene-container` element.

{{< code from="17" to="23" hl_lines="20 21 22" file="worlds/first-steps/first-scene/index.html" lang="html" caption="_**index.html**_: the container element" >}}{{< /code >}}

The renderer will automatically create a `<canvas>` element for us, which we'll insert inside this container. By doing this, we can control the size and position of our scene by using CSS to set the size of the container (as we described in {{< link path="/book/first-steps/app-structure/#adding-a-three-js-scene-to-the-page" title="the last chapter" >}}). First though, we need to access the container element in JavaScript, which we'll do using {{< link path="/book/appendix/dom-api-reference/#accessing-html-elements" title="`document.querySelector`" >}}.

{{< code from="11" to="12" file="worlds/first-steps/first-scene/src/main.final.js" caption="_**main.js**_: get a reference to the scene container" >}}{{< /code >}}

## 2. Create the Scene {#create-scene}

{{< figure src="first-steps/scene_only.svg" alt="The scene" class="small left" >}}

With the setup out of the way, we'll start by creating the scene, our very own tiny universe. We'll use the [`Scene`](https://threejs.org/docs/#api/scenes/Scene) constructor (with an uppercase "S") to create a `scene` instance (with a lowercase "s"):

{{< code from="14" to="15" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: create the scene" >}}{{< /code >}}

### Set the Scene's Background Color {#set-color}

Next, we'll change the color of [the scene's background](https://threejs.org/docs/#api/en/scenes/Scene.background) to sky blue. If we don't do this, the default color will be used, which is black. We'll use the `Color` class that we imported above, passing the string `'skyblue'` as a parameter to the constructor:

{{< code from="17" to="18" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: set the scene's background color" >}}{{< /code >}}

`'skyblue'` is a [CSS color name](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value), and we can use any of the CSS colors here, giving us 140 named colors. You're not limited to just these few colors, of course. You can use any color your monitor can display, and there are several ways of specifying them, just as there are in CSS.

{{% note %}}
If you recall from the last chapter, we also used `'skyblue'` for the container element's background. When three.js renders the scene and inserts the `<canvas>` element into the page, by giving the container and the scene the same background color, we ensure that the transition is seamless.

{{< code from="24" to="35" hl_lines="34" file="styles/main.css" linenos="false" lang="css" caption="_**styles/main.css**_: the scene container background color">}}{{< /code >}}

Of course, not every three.js scene will have a simple colored background, so this is not always possible.:
{{% /note %}}

{{% note %}}
TODO-LINK: add link to color chapter
{{% /note %}}

## 3. Create The Camera {#create-camera}

{{< figure src="first-steps/camera.svg" alt="The camera" class="small left" >}}

There are a couple of different cameras available in the three.js core, but as we discussed above, we will mostly use the [`PerspectiveCamera`](https://threejs.org/docs/#api/cameras/PerspectiveCamera) since it draws a view of the scene that looks similar to how our eyes see the real world. The `PerspectiveCamera` constructor takes four parameters:

1. `fov`, or **field of view**: how wide the camera's view is, in degrees.
2. `aspect`, or **aspect ratio**: the ratio of the scene's width to its height.
3. `near`, or **near clipping plane**: anything closer to the camera than this will be invisible.
4. `far`, or **far clipping plane**: anything further away from the camera than this will be invisible.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="20" to="26" lang="js" linenos="true" caption="_**main.js**_" >}}{{< /code >}}

Together, these four parameters are used to create a bounded region of space which we call a [**viewing frustum**](https://en.wikipedia.org/wiki/Viewing_frustum).

### The Camera's Viewing Frustum {#viewing-frustum}

{{< figure src="first-steps/frustum.png" alt="A frustum" title="A frustum" caption="A frustum" class="small left" >}}

**If the `scene` is a tiny universe, stretching forever in all directions, the camera's viewing frustum is the part of it that we can _see_**. A _frustum_ is a mathematical term meaning a four-sided rectangular pyramid with the top cut off. When we view the scene through a `PerspectiveCamera`, everything inside the frustum is visible, while everything outside it is not. In the following diagram, the area in between the **Near Clipping Plane** and the **Far Clipping Plane** is the camera's viewing frustum.

{{< figure src="first-steps/perspective_frustum.svg" alt="Perspective camera frustum" lightbox="true" >}}

The four parameters we pass into the `PerspectiveCamera` constructor each create one aspect of the frustum:

1. The **field of view** defines the angle at which the frustum expands. A small field of view will create a narrow frustum, and a wide field of view will create a wide frustum.
2. The **aspect ratio** matches the frustum to the scene container element. When we set this to the container's width divided by its height, we ensure the rectangular base of the frustum can be expanded to fit perfectly into the container. If we get this value wrong the scene will look stretched and blurred.
3. The **near clipping Plane** defines the small end of the frustum (the point closest to the camera).
4. The **far clipping Plane** defines the large end of the frustum (the point furthest from the camera).

Any objects in your scene that are not inside the frustum won't be drawn by the renderer. If an object is partly inside and partly outside the frustum, the parts outside will be chopped off (**clipped**).

{{% note %}}
TODO-DIAGRAM: better diagram of viewing frustum
TODO-LINK: add link to cameras section
{{% /note %}}

### Position the Camera {#position-camera}

Every object we create is initially positioned at the center of our scene, the point $(0,0,0)$. This means our camera is currently positioned at $(0,0,0)$, and any objects we add to the scene will also be positioned at $(0,0,0)$, all jumbled together on top of each other. Placing the camera artistically is an important skill, however, for now, we'll simply move it back (_towards us_) to give us an overview of the scene.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="26" to="30" lang="js" linenos="true" caption="_**main.js**_: move the camera back on the Z-axis" >}}{{< /code >}}

Setting the position of any object works the same way, whether it's a camera, a mesh, a light, or anything else. We can set all three components of the position at once, as we're doing here:

{{< code lang="js" linenos="false" caption="Set the X, Y, and Z axes together" >}}
camera.position.set(0, 0, 10);
{{< /code >}}

Or, we can set the X, Y, and Z components individually:

{{< code lang="js" linenos="false" caption="Set the three axes individually" >}}
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
{{< /code >}}

Both ways of setting the position give the same result. The position is stored in a [`Vector3`](https://threejs.org/docs/#api/en/math/Vector3), a three.js class representing a 3D vector which we'll explore in more detail in {{< link path="/book/first-steps/transformations/" title="" >}}.

## 4. Create a Visible Object {#create-visible}

{{< figure src="first-steps/box.png" alt="A visible object" class="small left" >}}

We've created a `camera` to see things with, and a `scene` to put them in. The next step is to create something we can see. Here, we'll create a simple box-shaped [`Mesh`](https://threejs.org/docs/#api/objects/Mesh). As we mentioned above, the mesh has two sub-components which we need to create first: a geometry and a material.

### Create a Geometry {#create-geometry}

The geometry of a mesh defines its shape. If we create a box-shaped geometry (as we do here), our mesh will be shaped like a box. If we create a sphere-shaped geometry, our mesh will be shaped like a sphere. If we create a cat-shaped geometry, our mesh will be shaped like a cat... you get the picture. Here, we create a cube using a [`BoxBufferGeometry`](https://threejs.org/docs/#api/geometries/BoxBufferGeometry). The three parameters define the width, height, and depth of the box:

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="32" to="33" lang="js" linenos="true" caption="_**main.js**_: create a box geometry" >}}{{< /code >}}

Most parameters have default values, so even though the docs say that `BoxBufferGeometry` should take six parameters, we can leave out most of them and three.js will fill in the blanks with the default values. **We don't have to pass in _any_ parameters**.

{{< code lang="js" linenos="false" caption="Creating a default box geometry" >}}
const geometry = new BoxBufferGeometry();
{{< /code >}}

If we leave out all the parameters, we'll get a default box which is a $1 \times 1 \times 1$ cube. We want a bigger cube, so we're passing in the above parameters to create a $2 \times 2 \times 2$ box.

### Create a Material {#create-material}

{{% note %}}
TODO-DIAGRAM: add examples of stone cars etc. Great for visual learners. (Annie-chen)
{{% /note %}}

Materials define the surface properties of objects, or in other words, what an object _looks_ like it is made from. **Where the geometry tells us that the mesh is a box, or a car, or a cat, the material tells us that it's a metal box, or a stone car, or a red-painted cat**.

There are quite a few materials in three.js. Here, we'll create a [`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial), which is the simplest (and fastest) material type available. This material also ignores any lights in the scene and colors (**shades**) a mesh based on the material's color and other settings which is great since we haven't added any lights yet. We'll create the material without passing any parameters into the constructor, so we'll get a default white material.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="35" to="36" lang="js" linenos="true" caption="_**main.js**_: create a default material" >}}{{< /code >}}

{{% aside %}}

### You (Usually) Need a Light to See

If we used nearly any other material type than `MeshBasicMaterial` right now, we wouldn't be able to see anything since the scene is in total darkness. **As in the real world, we usually need light to see things in our scene**. `MeshBasicMaterial` is an exception to that rule.

This is a common point of confusion for newcomers to three.js, so if you can't see anything, make sure you have added some lights to your scene, or temporarily switch all materials to a `MeshBasicMaterial`. We'll add some lights to our scene in {{< link path="/book/first-steps/physically-based-rendering/" title="" >}}.
{{% /aside %}}

### Create the Mesh {#create-mesh}

{{< figure src="first-steps/mesh_details.svg" alt="A mesh consists of a geometry and a material" class="large" >}}

Now that we have a geometry and a material, we can create our mesh, passing in both as parameters.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="32" to="39" lang="js" linenos="true" caption="_**main.js**_: create the mesh" >}}{{< /code >}}

Later, we can access the geometry and material at any time using `mesh.geometry` and `mesh.material`.

### Add the Mesh to the Scene

Once the `mesh` has been created, we need to add it to our scene.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="41" to="42" lang="js" linenos="true" caption="_**main.js**_: add the mesh to the scene" >}}{{< /code >}}

Later, if we want to remove it, we can use `scene.remove(mesh)`. Once the mesh has been added to the scene, we call the mesh _a child_ of the scene, and we call the scene _the parent_ of the mesh.

## 5. Create the Renderer {#create-the-renderer}

{{< figure src="first-steps/rendered_scene_canvas.svg" alt="The rendered scene outputs to a canvas element" lightbox="true" class="medium right" >}}

{{% note %}}
TODO-LOW: update if WebGPURenderer becomes default
{{% /note %}}

The final component of our simple app is the renderer, which is responsible for drawing (**rendering**) the scene into the `<canvas>` element. We'll use the [`WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer) here. There are some other renderers available as plugins, but the `WebGLRenderer` is by far the most powerful renderer available, and usually the only one you need. Let's go ahead and create a `WebGLRenderer` now, once again with default settings.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="44" to="45" lang="js" linenos="true" caption="_**main.js**_: create the renderer" >}}{{< /code >}}

### Set the Renderer's Size {#set-renderer-size}

We are nearly there! Next, we need to tell renderer what size our scene is using the container's width and height.

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="47" to="48" lang="js" linenos="true" caption="_**main.js**_: set the renderer's size" >}}{{< /code >}}

If you recall, we used CSS to make the container take up the full size of the browser window (as described in {{< link path="/book/first-steps/app-structure/#adding-a-three-js-scene-to-the-page" title="the last chapter" >}}), so the scene will also take up the full window.

{{% aside notice %}}
We've set the renderer's size to the container's width and height _as it is now_. If we resize the browser window, the window's width and height will change, but the size of our canvas will not change. We'll fix this in {{< link path="/book/first-steps/responsive-design" title="" >}}.
{{% /aside %}}

### Set The Device Pixel Ratio {#pixel-ratio}

We also need to tell the renderer what the pixel ratio of the device's screen is. **This is required to prevent blurring on HiDPI displays** (also known as retina displays).

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="50" to="51" lang="js" linenos="true" caption="_**main.js**_: set the pixel ratio" >}}{{< /code >}}

We won't get into the technicalities here, but you mustn't forget to set this, otherwise your scene may look great on the laptop where you're testing it, but blurry on mobile devices with retina displays. As always, {{< link path="/book/appendix/dom-api-reference/#the-virtual-viewport" title="the appendices have more details" >}}.

### Add the `<canvas>` Element to Our Page {#add-canvas}

The renderer will draw our scene from the viewpoint of the camera into a `<canvas>` element. This element has been automatically created for us and is stored in `renderer.domElement`, but before we can see it, we need to add it to the page. We'll do this using a {{< link path="/book/appendix/dom-api-reference/#adding-the-new-elements-to-our-page" title="built-in JavaScript method called `.append`" >}}:

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="53" to="54" lang="js" linenos="true" caption="_**main.js**_: add the canvas to the page" >}}{{< /code >}}

Now, if you open up the browser's development console (press F12) and inspect the HTML, you'll see something like this:

{{< code lang="html" linenos="false" caption="_**index.html**_" >}}
<div id="scene-container">
  <canvas
    width="800"
    height="600"
    style="width: 800px; height: 600px;"
  ></canvas>
</div>
{{< /code >}}

This assumes a browser window size of $800 \times 600$, so what you see may look slightly different. Notice that `renderer.setSize` has also set the width, height, and style attributes on the canvas.

## 6. Render the Scene {#render-scene}

{{< figure src="first-steps/rendered_scene.svg" alt="A rendered scene" class="" lightbox="true" class="medium left" >}}

<p style="clear:both"> </p>

With everything in place, all that remains to do is **render the scene!** Add the following and final line to your code:

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="56" to="57" lang="js" linenos="true" caption="_**main.js**_: render the scene" >}}{{< /code >}}

With this single line, we're telling the renderer to create a still picture of the scene using the camera and output that picture into the `<canvas>` element. If everything is set up correctly, you'll see a white cube against a blue background. It's hard to see that it's a cube since we're looking directly at a single square face, but we'll fix that over the next few chapters.

Well done! **By completing this chapter, you've taken the first giant leap in your career as a three.js developer**. Our scene may not be that interesting yet, but we've laid some important groundwork and covered some fundamental concepts of computer graphics that you'll use in every scene you build from now on, whether you are using three.js or any other 3D graphics system.
