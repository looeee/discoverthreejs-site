---
title: "The Built-In Geometries"
description: "Here, we use the three.js BoxBufferGeometry and CylinderBufferGeometry to build a simple toy train, taking the opportunity to explore ways to structure more complex scene components."
date: 2018-04-02
weight: 112
chapter: "1.12"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/materials.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/materials.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/Train.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/camera.js",
    "worlds/first-steps/built-in-geometries/src/World/components/helpers.js",
    "worlds/first-steps/built-in-geometries/src/World/components/lights.js",
    "worlds/first-steps/built-in-geometries/src/World/components/scene.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/controls.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/renderer.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/Resizer.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/Loop.js",
    "worlds/first-steps/built-in-geometries/src/World/World.start.js",
    "worlds/first-steps/built-in-geometries/src/World/World.final.js",
    "worlds/first-steps/built-in-geometries/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/built-in-geometries/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/built-in-geometries/"
IDEActiveDocument: "src/World/components/Train/Train.js"
membershipLevel: free
---

# Getting Creative with The Built-In Geometries

The three.js core includes a large selection of basic geometric shapes. We've already seen two of these: {{< link path="/book/first-steps/first-scene/#the-geometry" title="our trusty `BoxBufferGeometry`" >}}, and the `SphereBufferGeometry` we introduced in the last chapter. There are many other shapes besides these two, from basic cylinders and circles to exotic dodecahedrons. You can use these geometries like an infinite box of stretchy, squishy Lego to build nearly anything your imagination can come up with.

The built-in geometries range from the mundane:

{{< figure src="first-steps/geometries_basic.svg" alt="Box, Cylinder and Sphere geometries" lightbox="true" >}}

... to the exotic:

{{< figure src="first-steps/geometries_exotic.svg" alt="Dodecahedron, Icosahedron and TorusKnot geometries" lightbox="true" >}}

... to the specialized:

{{< figure src="first-steps/geometries_specialized.svg" alt="Extrude, Lathe and Text geometries" lightbox="true" >}}

... and many more besides. Search for "Geometry" in the [docs](https://threejs.org/docs/) to see all of them.

{{< inlineScene entry="first-steps/toy-train.js" class="round medium right" >}}

In this chapter, we'll use the transformations we learned a few chapters ago ({{< link path="/book/first-steps/transformations.md" title="translate, rotate, and scale" >}}) to manipulate these geometries and build a simple toy train model. At the same time, we'll use this as an opportunity to explore ways of structuring scene components that are more complex than anything we have created so far. We'll also take a deeper look at using transformations, in particular rotation, which is the trickiest of the three transformations to use. We'll use just two of the geometries to build the toy train: a box geometry for the cabin, and a cylinder geometries for the wheels, nose, and chimney.

{{% aside success %}}

### `Geometry` and `BufferGeometry`

Technically speaking, the geometries we will create are "buffer" geometries, which means that their data is stored in flat arrays called _**buffers**_. `BoxBufferGeometry` is an extension of the [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry) class. This is a newer and faster way of representing geometries, compared to the old `Geometry` class. Until three.js r125, both `Geometry` and `BufferGeometry` were included in the three.js core, but as of three.js r126, `Geometry` has been removed. It's still available in the examples folder, but you'll have to include it manually if you want to use it.

However, unless you have a good reason and know what you are doing, **you should _always_ use `BufferGeometry`**. `Geometry` remains [in the examples folder on the repo](https://github.com/mrdoob/three.js/blob/master/examples/jsm/deprecated/Geometry.js) for backward compatibility only.

{{% /aside %}}

## The `Material.flatShading` Property

We'll also introduce a new material property in this chapter. [`Material.flatShading` ](https://threejs.org/docs/#api/en/materials/Material.flatShading) is defined in the base `Material` class, which means it's available for every kind of material. By default, it's set to false.

{{< link path="/book/first-steps/organizing-with-group/#introducing-spherebuffergeometry" title="As we mentioned in the previous chapter" >}}, all geometries are made out of triangles. **The only shapes you can draw using WebGL are points, lines, and triangles**, and all other shapes are made from these. However, **`Mesh` objects are made exclusively from triangles**, never points or lines. When they are part of a mesh, these triangles are referred to as **faces**. To create smooth curves, the triangles need to be very tiny. However, to reduce the number of triangles needed faces next to each other are usually blended in lighting calculations. We'll explain how this works in more detail once we get around to explaining what _**normals**_ are later in the book.

{{% note %}}
TODO-LINK: add link to normals explanation
{{% /note %}}

If you turn on `.flatShading`, adjacent faces are no longer blended. You can use this to give an object a carved or faceted look, which can be a nice effect for low-poly objects like our train.

{{< inlineScene entry="first-steps/flatshading.js" caption="Left: flat shading disabled. Right: flat shading enabled." >}}

You can create a material with flat shading enabled by passing the parameter into the constructor:

{{< code lang="js" linenos="false" caption="Create a red flat-shaded `MeshStandardMaterial`" >}}
const material = new MeshStandardMaterial({
color: 'red',
flatShading: true,
});
{{< /code >}}

You can also set the `material.flatShading` property after creating the material. However, if you have already used the material in a rendered scene (technically, if the material has been _compiled_), you will also need to set the [`material.needsUpdate`](https://threejs.org/docs/#api/en/materials/Material.needsUpdate) flag:

{{< code lang="js" linenos="false" caption="Once the material has compiled, set the `.needsUpdate` flag when changing certain properties" >}}
const material = new MeshStandardMaterial({
color: 'red',
flatShading: false, // default
});

material.flatShading = true;
material.needsUpdate = true;
{{< /code >}}

{{% note %}}
TODO-LINK: add link to material needs update section
{{% /note %}}

## Introducing the `CylinderBufferGeometry`

This is the first time we've used a [`CylinderBufferGeometry`](https://threejs.org/docs/#api/en/geometries/CylinderBufferGeometry), so let's take a moment to examine it now.

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#CylinderGeometry" height="500" title="The CylinderBufferGeometry in action" caption="The CylinderBufferGeometry in action" >}}

The first three parameters define the shape and size of the cylinder:

- **`radiusTop`: the radius of the top of the cylinder.**
- **`radiusBottom`: the radius of the bottom of the cylinder.**
- **`height`: the height of the cylinder.**

By making `radiusTop` and `radiusBottom` different sizes you can create cones instead of cylinders. There is also a [`ConeBufferGeometry`](https://threejs.org/docs/#api/en/geometries/ConeBufferGeometry), but under the hood, it's just a `CylinderBufferGeometry` with `radiusBottom` set to zero.

The next two parameters define how detailed the geometry is:

- **`radialSegments`: how detailed the cylinder is around its curved edge. The default is 8, but you'll want to increase this in most cases to make the cylinder more smooth.**
- **`heightSegments`: how detailed the cylinder is along its height. The default value of 1 is usually fine.**

The final three parameters define how _complete_ the cylinder is:

- **`openEnded`: whether to draw caps on the top and bottom of the cylinder.**
- **`thetaStart`: what point around the curvature the cylinder is drawn from.**
- **`thetaLength`: how far around the curvature to draw.**

By setting `openEnded` to false, you can create a tube instead of a cylinder. `thetaStart` and `thetaLength` are easily understood if you play around with them in the live example above, or in your own code. You don't have to supply all the parameters when creating a `CylinderBufferGeometry`. In most cases, the first four are sufficient

By varying the initial parameters, this "cylinder" geometry can be used to create cones, tubes, and various trough-like shapes. Most of the other geometries are similarly flexible, which means the initial set of twenty geometries can be used to create a near-infinite variety of shapes.

## Helpers

In the editor, we've added a couple of helpers to make it easier for you to build the train. There's an [`AxesHelper`](https://threejs.org/docs/#api/en/helpers/AxesHelper), which is three lines representing the $X$, $Y$, and $Z$ axes, and a [`GridHelper`](https://threejs.org/docs/#api/en/helpers/GridHelper), which is a rectangular grid with thick black lines going through the center of the scene, and smaller gray lines at one-unit intervals.

You'll often find it useful to add helpers like this when constructing your scenes, especially while you're getting used to working with the three.js coordinate system. There are many other helpers besides these two to help us visualize all kinds of things our scenes, like boxes, cameras, lights, arrows, planes, and so on.

Here, note the colors of the lines in the axes helper: RGB, representing XYZ: the $X$-axis is red, the $Y$-axis is green, and the $Z$-axis is blue. Next, note that each square of the grid helper is a $1 \times 1$ square, which you can use to help visualize the size of pieces of the train. Our final train will be about nine meters long, perhaps a little big for a toy train (or perhaps not), but we won't worry about that for now. You can also adjust the size of the squares in the helper, which is useful when building large or small scenes.

{{% note %}}
TODO-LINK: link to helpers section
{{% /note %}}

## Working With Rotations

{{< figure src="first-steps/coordinate_system.svg" caption="The World Space Coordinate System" class="medium left" lightbox="true" >}}

To build the train, we'll create several shapes and then transform (translate, rotate, and scale) them into position. Although we covered the technical details of 3D transformations a few chapters ago, putting the theory into practice takes some work. Translating and scaling objects usually works as you expect, as long as you keep the coordinate system firmly in mind. On the other hand, {{< link path="/book/first-steps/transformations/#our-final-transformation-rotation" title="working with rotations" >}} can be tricky. Here, we'll take a few moments to examine the rotation operations we'll need to build the train.

Look at the {{< link path="/book/first-steps/transformations/#coordinate-systems-world-space-and-local-space" title="world space coordinate system" >}} above. The origin, $(0,0,0)$, is at the very center of your scene. Keep this diagram in mind while working with transformations throughout this chapter. Also, note how the colors in the diagram match the colors of the axes helper in the editor: RGB for XYZ.

{{< clear >}}

{{< inlineScene entry="first-steps/toy-train-rotated.js" class="small right" >}}

Next, take a look at the train. The cabin is made from a box geometry, and everything else is made from cylinders. Even the chimney is a cylinder with a smaller radius at the bottom than at the top. The red nose is oriented along the $X$-axis, while the black wheels are orientated along the $Z$-axis. Finally, the chimney is oriented upwards along the $Y$-axis. When we say a cylinder is oriented _along an axis_, we mean the axis is parallel to a line drawn through the center of the cylinder.

Before we proceed to move the pieces into position, remember, **the direction of a positive rotation in three.js is anti-clockwise**. This is probably the opposite to what your intuition expects, and it's also the opposite of CSS rotations, so make a special note of this:

> **Positive Rotation = Anti-Clockwise!**

{{< figure src="first-steps/cylinder_initial_rotation.svg" caption="`CylinderBufferGeometry` initial orientation" class="medium left" lightbox="true" >}}

When we create a `CylinderBufferGeometry`, it starts out pointing upwards like a tree trunk, **oriented along the $Y$-axis**. How do we work out the rotations required to move this into position, to create the wheel, chimney, and nose? Of course, we _could_ use trial and error. However, we'd prefer to use a more sophisticated approach.

{{< clear >}}

{{< figure src="first-steps/cylinder_final_rotation.svg" caption="The cylinder after $90^{\circ}$ rotation around Z" class="medium right" lightbox="true" >}}

Let's consider the large red nose first. We want the nose to lie along the $X$-axis. This means we need to rotate it by $90^{\circ}$, or $\frac{\pi}{2}$ radians, **anti-clockwise** around the $Z$-axis.

{{< clear >}}

{{< figure src="first-steps/wheel_initial_rotation.svg" caption="Wheel geometry's initial rotation" class="large noborder" lightbox="true" caption="Initial orientation of the wheels" class="medium left" >}}

That accounts for the nose. What about the wheels? Once again, the cylinder we'll create for the wheels begins its life pointing upwards along the $Y$-axis.

{{< clear >}}

{{< figure src="first-steps/wheel_final_rotation.svg" alt="Wheel geometry's final rotation" class="large noborder" lightbox="true" caption="The cylinder after $90^{\circ}$ rotation around X" class="medium right" >}}

We want the wheels to lie parallel to the $Z$-axis, so this time, we'll rotate around the $X$-axis. Again, it's a $90^{\circ}$ anti-clockwise (positive) rotation.

{{< clear >}}

The final mesh we need to consider is the chimney. Once again, we'll create a geometry (this time, cone-shaped) that starts out pointing up along the $Y$-axis. The chimney also points upwards, so we won't need to rotate this mesh after creating it.

{{% note %}}
TODO-DIAGRAM: seems kind of sad there is no chimney diagram
(comment from a reader)
{{% /note %}}

When working with rotations, often, we'll use the[ three.js helper function `.degToRad`](https://threejs.org/docs/#api/en/math/MathUtils.degToRad) to {{< link path="/book/first-steps/animation-loop/#scale-the-cubes-rotation-by-delta" title="convert from degrees to radians" >}}. However, many degree values are easy to write as radians since $180^{\circ} = \pi$ radians, so simple division will give us a range of other radian values, in particular, $90^{\circ} = \frac{\pi}{2}$ and $45^{\circ} = \frac{\pi}{4}$.

{{< code lang="js" linenos="false" caption="Various clockwise and anti-clockwise rotations" >}}
// 90 degrees anti-clockwise around the X-axis
mesh.rotation.x = Math.PI / 2;

// 90 degrees clockwise around the X-axis
mesh.rotation.x = -Math.PI / 2;

// 90 degrees anti-clockwise around the Y-axis
mesh.rotation.y = Math.PI / 2;

// 90 degrees clockwise around the Z-axis
mesh.rotation.z = -Math.PI / 2;

// 45 degrees clockwise around the X-axis
mesh.rotation.x = -Math.PI / 4;

// 45 degrees anti-clockwise around the Y-axis
mesh.rotation.y = Math.PI / 4;
{{< /code >}}

## A Simple Toy Train Model

With all that talk of rotations under our belts, hopefully, it will be easy to build the train, so let's get started. We'll also use this simple model as an opportunity to build a template for future, more complex scene components. To that end, we'll create separate modules for geometries, materials, and meshes, and then create a `Train` class to coordinate the other modules and provide a minimal interface for use within `World`.

If this sounds familiar to you, it's because this is a microcosm of how we set up {{< link path="/book/first-steps/world-app/#the-world-app" title="the World app" >}}. There are two reasons for this:

1. **Familiarity**: The more similar individual sections of our code are, the less we have to think when switching focus.
2. **Reusability**: Just as we want to be able to hand the _**World/**_ folder over to another developer with a single paragraph of instructions on how to use it, we want to be able to copy the _**Train/**_ component between our apps with zero effort.

On the other hand, this structure won't be the best for every possible component you create. Always make sure the structure of your code supports what you are trying to build, rather than making you fight against it.

In the editor, we have deleted the _**meshGroup.js**_ module from the previous chapter and replaced it with a new _**components/Train/**_ folder. If you're working on your own machine, go ahead and do that now. Inside this folder, there are four modules:

- _**components/Train/geometries.js**_
- _**components/Train/materials.js**_
- _**components/Train/meshes.js**_
- _**components/Train/Train.js**_

### Initial Structure of _**geometries.js**_, _**materials.js**_, and _**meshes.js**_

The first two modules follow a similar format to all the other {{< link path="/book/first-steps/world-app/#systems-and-components" title="components and systems" >}} we've created so far.

{{< code lang="js" linenos="" caption="_**Train/geometries.js**_: initial structure" >}}
import { BoxBufferGeometry, CylinderBufferGeometry } from 'three';

function createGeometries() {}

export { createGeometries }
{{< /code >}}

{{< code lang="js" linenos="" caption="_**Train/materials.js**_: initial structure" >}}
import { MeshStandardMaterial } from 'three';

function createMaterials() {}

export { createMaterials }
{{< /code >}}

Finally, the meshes module. This is similar to the other two, however, the meshes will require the geometries and materials created by the other two modules, so import them at the top of the module, after we import `Mesh` from the three.js core (vendor imports will always go before our local imports). Finally, call each function and store the results in the `geometries` and `materials` variables.

{{< code lang="js" linenos="" caption="_**Train/meshes.js**_: initial structure" >}}
import { Mesh } from 'three';

import { createGeometries } from './geometries.js';
import { createMaterials } from './materials.js';

function createMeshes() {
const geometries = createGeometries();
const materials = createMaterials();
}

export { createMeshes }
{{< /code >}}

### The `Train` Class Extends `Group`

Next, the `Train` class. Here, we'll do something new and {{< link path="/book/appendix/javascript-reference/#class-inheritance-and-the-extends-keyword" title="_extend_ the `Group` class" >}}:

{{< code lang="js" linenos="" caption="_**Train.js**_: extend the group class" >}}
import { Group } from 'three';

class Train extends Group {
constructor() {
super();
}
}

export { Train }
{{< /code >}}

Note the use of `super()`. This means the `Train` class now has all the normal functionality of a `Group`. In particular, we can add objects to it, and we can add it directly to our scene:

{{< code lang="js" linenos="false" caption="By extending `Group`, once we create a train we can add it directly to our scene" >}}
const train = new Train();

// we can add objects to our train
train.add(mesh);

// and we can add the train directly to the scene
scene.add(train);
{{< /code >}}

We can also add objects to the train from within the class itself, using `this.add`:

{{< code lang="js" linenos="false" caption="By extending `Group`, we can add a mesh to the train in the constructor" >}}
class Train extends Group {
constructor() {
super();

    const mesh = new Mesh(...);

    this.add(mesh);

}
}
{{< /code >}}

### Import the Meshes

Using this knowledge, we can finish setting up the `Train` class. First, import the `createMeshes` function, then call it and store the result in a member variable, `this.meshes`. At the very end of this chapter, we'll add some animation to the wheels, which means we need to access the meshes from outside the constructor, hence the use of a member variable here.

{{< code lang="js" linenos="" linenostart="1" hl_lines="3 4 5 11" caption="_**Train.js**_: import and create the meshes" >}}

```js
import { Group } from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";
import { createMeshes } from "./meshes.js";

class Train extends Group {
  constructor() {
    super();

    this.meshes = createMeshes();
  }
}

export { Train };
```

{{< /code >}}

### _**World.js**_ Setup

Over in World, import the `Train` class. If you're working with code from the last chapter, remove any references to `meshGroup` from the file.

{{< code file="worlds/first-steps/built-in-geometries/src/World/World.final.js" from="1" to="13" lang="js" hl_lines="8" linenos="true" caption="_**World.js**_: import the train" >}}{{< /code >}}

Next, create an instance of the train and add it to the scene.

{{< code lang="js" linenos="" linenostart="21" hl_lines="30 32" caption="_**World.js**_: create an instance of the train and add it to the scene" >}}

```js
constructor(container) {
  camera = createCamera();
  renderer = createRenderer();
  scene = createScene();
  loop = new Loop(camera, scene, renderer);
  container.append(renderer.domElement);

  const controls = createControls(camera, renderer.domElement);
  const { ambientLight, mainLight } = createLights();
  const train = new Train();

  scene.add(ambientLight, mainLight, train);

  const resizer = new Resizer(container, camera, renderer);

  scene.add(createAxesHelper(), createGridHelper());
}
```

{{< /code >}}

### Other Changes

Note that we have also made some minor adjustments to the camera position in _**camera.js**_, slightly moved the {{< link path="/book/first-steps/camera-controls/#manually-set-the-target" title="`controls.target`" >}} in _**controls.js**_ to better frame the train, as well as reducing the intensity of both lights in _**lights.js**_.

### Create the Materials

At this point, we have finished creating the structure of our new scene component. All that remains is to set up the materials, geometries, and meshes. These don't have to take the form of a train. You can use this structure as a template to create any shape you can dream of.

We'll create two materials for the train: a dark gray material for the chimney and wheels, and a reddish material for the body. We'll use {{< link path="/book/first-steps/physically-based-rendering/#introducing-the-meshstandardmaterial" title="`MeshStandardMaterial`" >}} with [`.flatShading`](#the-material-flatshading-property) enabled for both. Other than `.flatShading`, there's nothing new here. Here's the complete materials module:

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/materials.final.js" from="1" to="17" lang="js" linenos="true" caption="_**materials.js**_: complete code" >}}{{< /code >}}

We've chosen `firebrick` red for the body and `darkslategray` for the wheels and chimney, but you can take a look through the [list of CSS colors](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) and pick out two that you like. At the end of the module, we return an object containing both materials for use within _**meshes.js**_.

### Create the Geometries

We'll use just two types of geometry for every part of the train: a box geometry for the cabin, and [cylinder geometries](#introducing-the-cylinderbuffergeometry) with various parameters for everything else.

#### The Cabin Geometry

First up, the box-shaped cabin. A single `BoxBufferGeometry` will suffice here. Create one with the following parameters:

| Length | Width  | Height |
| ------ | ------ | ------ |
| $2$    | $2.25$ | $1.5$  |

{{< code lang="js" linenos="" linenostart="3" hl_lines="4" caption="_**geometries.js**_: create the cabin geometry" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);
}
```

{{< /code >}}

Different values for the length, width, and height will give us a rectangular box, unlike the cube we have used in previous chapters.

#### The Nose Geometry

Next, create the first `CylinderBufferGeometry` for the nose, using these parameters:

| Top radius | Bottom radius | Height | Radial segments |
| ---------- | ------------- | ------ | --------------- |
| $0.75$     | $0.75$        | $3$    | $12$            |

`radiusTop` and `radiusBottom` are equal, so we'll get a cylinder. A value of $12$ for the `radialSegments`, when combined with `Material.flatShading`, will make the cylinder look like it has been roughly carved.

{{< code lang="js" linenos="" linenostart="3" hl_lines="6" caption="_**geometries.js**_: create the nose geometry" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);
}
```

{{< /code >}}

#### The Wheels Geometry

We can reuse a single `CylinderBufferGeometry` for all four wheels, even the large rear wheel. You can reuse a geometry in any number of meshes, and then change the `.position`,`.rotation` and `.scale` for each mesh. This is more efficient than creating a new geometry for every mesh, and you should do this whenever possible. Create a cylinder geometry with these parameters:

| Top radius | Bottom radius | Height | Radial segments |
| ---------- | ------------- | ------ | --------------- |
| $0.4$      | $0.4$         | $1.75$ | $16$            |

The higher value of 16 for `radialSegments` will make the wheels look more rounded. We're creating the geometry at the correct size for the three smaller wheels, so, later, we'll have to increase the scale of the larger rear wheel.

{{< code lang="js" linenos="" linenostart="3" hl_lines="9" caption="_**geometries.js**_: create the wheel geometry" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
}
```

{{< /code >}}

#### The Chimney Geometry

Finally, the chimney. It's a cone, not a cylinder, but as discussed above, if we create a cylinder geometry with different values for `radiusTop` and `radiusBottom`, the result will be a cone shape. This time, leave `radialSegments` at the default value of 8.

| Top radius | Bottom radius | Height | Radial segments |
| ---------- | ------------- | ------ | --------------- |
| $0.3$      | $0.1$         | $0.5$  | default value   |

{{< code lang="js" linenos="" linenostart="3" hl_lines="12" caption="_**geometries.js**_: create the chimney geometry" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);

  // different values for the top and bottom radius creates a cone shape
  const chimney = new CylinderBufferGeometry(0.3, 0.1, 0.5);
}
```

{{< /code >}}

#### Final Geometries Module

Finally, return all of the geometries as an object at the end of the function. Putting all that together, here's the final geometries module:

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.final.js" from="1" to="22" hl_lines="14-19" lang="js" linenos="true" caption="_**geometries.js**_: final code" >}}{{< /code >}}

### Create the Meshes

All that remains is to create the meshes. First, we'll create the cabin, nose, and chimney individually, then {{< link path="/book/first-steps/organizing-with-group/#clone-the-protosphere" title="we'll create one wheel and `.clone` it" >}} to create the other three.

#### The Cabin and Chimney Meshes

{{< link path="/book/first-steps/first-scene/#our-first-visible-object-mesh" title="Create the cabin and chimney meshes as usual" >}}, using the body material for the cabin and the detail material for the chimney, then move each mesh into position.

{{< code lang="js" linenos="" linenostart="6" hl_lines="10 11 13 14" caption="_**meshes.js**_: create the cabin and chimney" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);
}
```

{{< /code >}}

The values entered for the positions are the result of some trial and error. However, with practice, you'll find that positioning objects becomes more intuitive and faster. As we mentioned above, there's no need to rotate the chimney, as it's already oriented correctly when we create it.

#### The Nose Mesh

Next up is the big red nose. Create the mesh as normal, using `geometries.nose` and `materials.body`. This time [we need to rotate](#working-with-rotations) as well as position the mesh:

{{< code lang="js" linenos="" linenostart="6" hl_lines="16-18" caption="_**meshes.js**_: create the nose" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;
}
```

{{< /code >}}

This completes the red body of the train, along with the chimney.

#### Create the Prototype Wheel

Now, the wheels. We'll create the `smallWheelRear` first and then clone it to create the rest, just as we did with our {{< link path="book/first-steps/organizing-with-group/#create-the-prototype-mesh" title="`protoSphere` from the previous chapter" >}}. Create the `smallWheelRear` mesh, and then **translate it down half a unit on the $Y$-axis** to position it under the train. Then, [rotate it to lie along the $X$-axis](#working-with-rotations).

{{< code lang="js" linenos="" linenostart="6" hl_lines="20-22" caption="_**meshes.js**_: create the first wheel" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;
}
```

{{< /code >}}

When we clone this wheel to create the rest of the wheels, the **cloned meshes will inherit the transformations from the prototype**. This means the cloned wheels will start correctly rotated and positioned at the bottom of the train, and we just need to space them out along the $X$-axis.

#### Create the Other Small Wheels {#create-small-wheels}

Clone the proto-wheel to create the other two small wheels, then move each into position along the $X$-axis:

{{< code lang="js" linenos="" linenostart="6" hl_lines="24 25 27 28" caption="_**meshes.js**_: create the other small wheels" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;
}
```

{{< /code >}}

#### Create The Large Rear Wheel

The final piece of our train is the large rear wheel. Once again, clone the small wheel, then move it into position at the back of the train. This time, we also need to scale it to make it larger:

{{< code lang="js" linenos="" linenostart="6" hl_lines="30-32" caption="_**meshes.js**_: create the large rear wheel" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.position.set(1.5, 0.9, 0);
  bigWheel.scale.set(2, 1.25, 2);
}
```

{{< /code >}}

By scaling, we have doubled the diameter of the big wheel and increased its length by 1.25. But how did we work out which axes to scale on?

{{< figure src="first-steps/wheel_initial_rotation.svg" class="medium left noborder" lightbox="true" caption="Initial cylinder geometry orientation" >}}

Look at the initial position of a newly created `CylinderBufferGeometry` once again. **Scaling happens independently of rotation, so even though we rotated the mesh, we must decide how to scale based on the original, unrotated geometry.** By examining this diagram, we can see that to increase the height, we need to scale on the $Y$-axis, and to increase the diameter, we need to scale by an equal amount on the $X$-axis and $Z$-axis. This gives us the final `.scale` value of $(2, 1.25, 2)$.

#### Final Meshes Module

Putting that all together, here's the final meshes module. Once again, we have returned an object containing all the meshes for use in the Train module.

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.final.js" from="1" to="45" hl_lines="34-42" lang="js" linenos="true" caption="_**meshes.js**_: complete code" >}}{{< /code >}}

### Add the Meshes to the Train

Next, we'll add the meshes to the Train. We'll do this in the train's constructor.

{{< code lang="js" linenos="" linenostart="7" hl_lines="13-21" caption="_**Train.js**_: add the meshes to the Train group" >}}

```js
class Train extends Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.nose,
      this.meshes.cabin,
      this.meshes.chimney,
      this.meshes.smallWheelRear,
      this.meshes.smallWheelCenter,
      this.meshes.smallWheelFront,
      this.meshes.bigWheel
    );
  }
}
```

{{< /code >}}

With that, the train should appear in your scene.

{{< inlineScene entry="first-steps/toy-train-autorotate.js" >}}

### Spin the Wheels!

As a final touch, let's set the wheels spinning. Give the train a `.tick` method, following the same {{< link path="/book/first-steps/animation-loop/#the-cubetick-method" title="pattern we use for all animated objects" >}}.

{{< code lang="js" linenos="" linenostart="7" hl_lines="12" caption="_**Train.js**_: create an empty tick method" >}}

```js
class Train extends Group {
  constructor() {
    // ... lines skipped for clarity
  }

  tick(delta) {}
}
```

{{< /code >}}

Next, over in World, add the train to the updatables array.

{{< code file="worlds/first-steps/built-in-geometries/src/World/World.final.js" from="21" to="38" hl_lines="32" lang="js" linenos="true" caption="_**World.js**_: add the train to the updatables array" >}}{{< /code >}}

{{< figure src="first-steps/wheel_initial_rotation.svg" class="small right noborder" lightbox="true" caption="Initial cylinder geometry orientation" >}}

Now, we need to figure out what axis to spin the wheels on. Refer once again to the diagram of the initial cylinder geometry orientation. We want it to spin around the axis going through its center, which is the $Y$-axis. The fact that we have rotated the wheels to lie along the $Z$-axis doesn't change this.

Next, we need to figure out how fast to spin the wheels. We'll spin at a rate of $24^{\circ}$ per second to give us one complete rotation every fifteen seconds. As usual, we must convert this to radians using the `degToRad` helper function.

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js" from="1" to="7" hl_lines="1 5" lang="js" linenos="true" caption="_**Train.js**_: calculate the wheel speed in degrees per second" >}}{{< /code >}}

Finally, update the tick method to rotate each of the four wheels. We must scale the per-second speed by delta here, as usual. Refer back to the [Animation Loop]({{< relref "/book/first-steps/animation-loop#timing-in-the-animation-system" >}} "Animation Loop") chapter for an explanation of why we do this.

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js" from="24" to="29" hl_lines="25-28" lang="js" linenos="true" caption="_**Train.js**_: spin the wheels, scaling the per-second speed by delta" >}}{{< /code >}}

Once you make this change, the wheel should start to rotate, and with that, our toy train is complete!

## Beyond Simple Shapes

{{< iframe src="https://threejs.org/examples/webgl_materials_normalmap.html" width="500" title="Creating a complex model like this using the built-in geometries is not possible" caption="Creating a complex model like this using the built-in geometries<br> is not possible" class="medium right" >}}

The last two chapters have shown us both the strengths and the limitations of the built-in three.js geometries. It's easy to create one hundred or one thousand clones of a mesh in a loop, and it was relatively easy to create a simple model of a toy train. However, creating a real-world object like a cat or a human would soon overwhelm us. Even for a model as basic as this one, the trial and error required to move the pieces of the train into position took some time.

To create truly amazing models, we need to use an external program designed for that purpose and then load the model into three.js. In the next chapter, we'll see how to do just that.

## Challenges

{{% aside success %}}

### Easy

1. What's better than a toy train? How about _two_ toy trains? You can `.clone` the entire train after creating it. Do that now, and then adjust the `.position` of the second train. Don't forget to add it to the scene!

2. What's better than two toy trains? {{< link path="/book/first-steps/organizing-with-group/#clone-the-protosphere" title="Create a whole bunch of trains in a loop" >}}. Within the loop, make sure to move each new train so they are not all stacked on top of each other, and then add each to the scene. See how many interesting ways you can position the cloned trains.

_Both of these tasks should be done in **World.js**._

{{% /aside %}}

{{% aside %}}

### Medium

1. Can you create a window in the cabin? There's no way to cut holes in the geometries (without using an external library), so you'll have to rebuild the cabin out of several box geometries. One way to do it is to create a large box for the floor, then another large box for the roof, and finally, four small boxes (or cylinders) for the pillars, around the edges of the roof.

2. A train won't go far without tracks! Add some tracks under the wheels. Create the two main tracks, then create a single board under the track and use clone to create the rest.

3. Every train needs a conductor! Create a simple human figure (like a Lego character) standing beside the train.

{{% /aside %}}

{{% aside warning %}}

### Hard

1. What else can you do to improve this scene? How about some bubbles of smoke coming out of the train's chimney (use `SphereBufferGeometry` to create the bubbles). What about some clouds in the sky? How about _animating_ the smoke and clouds?

{{% /aside %}}
