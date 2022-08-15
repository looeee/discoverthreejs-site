---
title: "Organizing Your Scenes"
description: "Here, we create a more complex scene and explore ways of keeping the scene graph and our code organized and manageable. We also introduce the Group object, and the clone method."
date: 2018-04-02
weight: 111
chapter: "1.11"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/organizing-with-group/src/World/components/camera.js",
    "worlds/first-steps/organizing-with-group/src/World/components/lights.js",
    "worlds/first-steps/organizing-with-group/src/World/components/meshGroup.start.js",
    "worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js",
    "worlds/first-steps/organizing-with-group/src/World/components/scene.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/controls.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/renderer.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/Resizer.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/Loop.js",
    "worlds/first-steps/organizing-with-group/src/World/World.start.js",
    "worlds/first-steps/organizing-with-group/src/World/World.final.js",
    "worlds/first-steps/organizing-with-group/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/organizing-with-group/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/organizing-with-group/"
IDEActiveDocument: "src/World/components/meshGroup.js"
membershipLevel: free
---

# Organizing Your Scenes

In every chapter so far, we've created examples using nothing but our trusty cube. Don't you think it's about time we moved on to some other shapes? Or even (gasp!) more than one object at the same time? Switching to a new geometry is easy since we can use any of the twenty or so geometries that come with the three.js core, as we'll see in the next chapter. However, once we start to add lots of objects to our scenes, we also need to think about how to organize and keep track of them, both within the 3D space of the scene and in our code.

In this chapter, we'll introduce a new geometry called `SphereBufferGeometry`, and we'll use this to showcase some features we can use to keep our scenes and code organized: the `Group` class, which is used to organize objects within the {{< link path="/book/first-steps/transformations/#the-scene-graph" title="scene graph" >}}, and the `.clone` method, which you can use to create identical copies of an existing object in a single line of code.

## Introducing `SphereBufferGeometry`

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#SphereGeometry" height="500" title="The SphereBufferGeometry in action" caption="The `SphereBufferGeometry` in action" >}}

The [`SphereBufferGeometry`](https://threejs.org/docs/#api/en/geometries/SphereBufferGeometry) geometry constructor takes up to seven parameters, all optional. We'll focus on the first three here:

{{< code lang="js" linenos="false" hl_lines="" caption="Creating a `SphereBufferGeometry`" >}}

```js
import { SphereBufferGeometry } from "three";

const radius = 0.25;
const widthSegments = 16;
const heightSegments = 16;

const geometry = new SphereBufferGeometry(
  radius,
  widthSegments,
  heightSegments
);
```

{{< /code >}}

The radius defines how big the sphere will be. More interesting are the next two parameters, which specify how much detail the geometry has around its width (equator) and height, respectively. The {{< link path="/book/first-steps/first-scene/#the-geometry" title="`BoxBufferGeometry` has similar parameters" >}}, however, they are less important as they don't change the shape of the box. The reason for this that all geometries are made out of triangles - you can see these outlined on the sphere in the scene above. To create a curved surface like a sphere we need to use lots of very tiny triangles.

Try experimenting with different values for `widthSegments` and `heightSegments` to see how these settings affect the quality of the geometry. It's important to use the smallest value that looks good for both settings. The number of triangles the sphere is built from increases very quickly when you use larger values for these parameters. What you're looking for is a tradeoff between quality and performance. If the sphere is far away from the camera or very small, you might be able to get away with a low-quality geometry made out of very few triangles, while if the sphere is the main focal point of your scene (such as a globe or planet), you will probably want to use a higher quality geometry.

## Adding Many Objects to the Scene

In a few moments, we'll create twenty-one sphere-shaped meshes and add them to our scene, arranged in a circle around the center. We could, of course, add each sphere to the scene one by one (in the following examples we've skipped setting the spheres' positions for brevity).

{{< code lang="js" linenos="false" hl_lines="" caption="Adding lots of sphere to the scene, one by one" >}}

```js
const sphere1 = new Mesh(geometry, material);
const sphere2 = new Mesh(geometry, material);
const sphere3 = new Mesh(geometry, material);
// ...
const sphere20 = new Mesh(geometry, material);
const sphere21 = new Mesh(geometry, material);

scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
// ...
scene.add(sphere20);
scene.add(sphere21);
```

{{< /code >}}

Kind of tedious, don't you think? This is the perfect time to use a loop:

{{< code lang="js" linenos="false" hl_lines="" caption="Creating many spheres in a loop" >}}

```js
for (let i = 0; i < 21; i++) {
  const sphere = new Mesh(geometry, material);
  scene.add(sphere);
}
```

{{< /code >}}

That's better. We've gone from over forty lines of code to just four. However, we have to think about
this issue from two perspectives: clean code, and a clean scene graph. There's nothing wrong, technically, with adding lots of objects directly to the scene like this. There are no issues with performance or anything else. The problems will come when we want to do something with the spheres. Perhaps we want to show/hide them all at once, or perhaps we want to animate them (as we'll do below). In that case, we'll have to keep track of all of them in our code and change them one by one, and to animate them we would have to add a `.tick` method to all twenty-one spheres.

It would be much better if we had some way of treating them as a group, don't you think?

{{% note %}}
TODO-DIAGRAM: diagram of scene graph with twenty spheres
TODO-DIAGRAM: improve diagram of group in scene graph to show twenty spheres
{{% /note %}}

## The `Group` Object {#hello-group}

[Groups](https://threejs.org/docs/#api/objects/Group) occupy {{< link path="/book/first-steps/transformations/#the-object3d-base-class-and-the-scene-graph" title="a position in the scene graph" >}} and can have children, but are themselves invisible. If the `Scene` represents the entire universe, then you can think of a `Group` as a single _compound_ object within that universe.

{{< figure src="first-steps/scene_tree.svg" caption="A `Group` in the Scene Graph" >}}

When we move a group around, all of its children move too. Likewise, if we rotate or scale a group, all of its children will be rotated or scaled too. However, the children can also be translated, rotated, or scaled independently. This is exactly how objects behave in the real world. For example, a car is made up of separate pieces like the body, windows, wheels, engine, and so on, and when you move the car they all move with it. But the wheels can rotate independently, and you can open the doors and roll down the windows, spin the steering wheel, and so on.

Of course, all of that applies to _every_ scene object. Every scene object has `.add` and `.remove` methods inherited from `Object3D`, just like the `Group` and the `Scene` itself, and {{< link path="/book/first-steps/transformations/#working-with-the-scene-graph" title="every object can hold a position in the scene graph and have children" >}}. The difference is that groups are _purely organizational_. Other scene objects, like meshes, lights, cameras, and so on, have some other purpose in addition to occupying a place in the scene graph. However, groups exist purely to help you manipulate other scene objects.

### Working with Groups

Like the `Scene` constructor, the `Group` constructor doesn't take any parameters:

{{< code lang="js" linenos="false" caption="Importing and creating a `Group`" >}}
import {
Group,
} from 'three.module.js';

const group = new Group();
{{< /code >}}

You can [`.add`](https://threejs.org/docs/#api/en/core/Object3D.add) and [`.remove`](https://threejs.org/docs/#api/en/core/Object3D.remove) children from a group:

{{< code lang="js" linenos="false" caption="Adding and removing objects from a `Group`" >}}
group.add(mesh);
group.add(light);

// later
group.remove(light);
{{< /code >}}

Once you add the group to your scene, any children of the group become part of the scene too:

{{< code lang="js" linenos="false" caption="Adding a group to your scene" >}}
// the mesh (and light if we didn't remove it)
// will become visible
scene.add(group);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams for each block of code describing how to use a group
{{% /note %}}

Getting back to our spheres, we'll create the spheres in a loop like before, but now we'll add them to a group, and then we'll add the group to the scene.

{{< code lang="js" linenos="false" hl_lines="" caption="Adding the spheres to a group instead of the scene allows us to manipulate them as a unit" >}}

```js
const scene = new Scene();
const group = new Group();
scene.add(group);

for (let i = 0; i < 21; i++) {
  const sphere = new Mesh(geometry, material);
  group.add(sphere);
}
```

{{< /code >}}

{{< iframe src="https://threejs.org/examples/webgl_loader_collada_kinematics.html" height="500" title="A `group` in action" caption="A `Group` in action" class="medium right" >}}

In case our simple group of spheres has not convinced you, a classic example of the reason for grouping objects is a robotic arm. The arm in this scene consists of at least four individually moving pieces, and they are connected by joints in a hierarchy, with the base of the arm at the top and the "hand" at the bottom. Imagine if these were all added directly to the scene, with no connection to each other, and our task was to animate them. Each joint in the arm requires the joints preceding it to remain connected while it moves. If we had to account for this without any kind of connection between the pieces, there would be a lot of painful math involved. However, when we connect the pieces in a parent-child relationship within the scene graph, the hierarchical movements logically follow. When we move the entire group, the whole arm will move. If we rotate the base, the upper joints will move but the group and base will not move. When we rotate the middle joint, the top joint will rotate too, and finally, when we rotate the top joint, nothing else will be forced to move with it.

This kind of logical connection between objects is one of the things that grouping objects within the scene graph makes easy.

{{% note %}}
TODO-DIAGRAM: add diagram of robot arm in scene graph
{{% /note %}}

## The `.clone` Method {#introduce-clone}

In the above examples where we created lots of spheres, we skipped over the part where we have to move each sphere into a new position. If we don't do that, all of the spheres will remain at the exact center of the scene, all jumbled on top of each other. This is where cloning an object can be useful. We can set up one object just how we like it, then we can create an exact clone. This clone will have the same transform, the same shape, the same material, if it's a light, it will have the same color and intensity, if it's a camera it will have the same field of view and aspect ratio, and so on. Then, we can make whatever adjustments we want to the clone.

Nearly all objects in three.js have a `.clone` method, which allows you to create an identical copy of that object. All scene objects inherit from [`Object3D.clone`](https://threejs.org/docs/#api/en/core/Object3D.clone), while geometries inherit from [`BufferGeometry.clone`](https://threejs.org/docs/#api/en/core/BufferGeometry.clone), and materials inherit from [`Material.clone`](https://threejs.org/docs/#api/en/materials/Material.clone).

In this chapter, we'll focus on cloning meshes, which works like this:

{{< code lang="js" linenos="false" caption="Cloning a mesh" >}}
const mesh = new Mesh(geometry, material);
const clonedMesh = mesh.clone();
{{< /code >}}

If we set the position, rotation, and scale of `mesh`, and then clone it, `clonedMesh` will start with the same position, rotation, and scale as the original.

{{< code lang="js" linenos="false" caption="Cloned objects have the same transform as the original object" >}}
const mesh = new Mesh(geometry, material);
mesh.position.set(1, 1, 1);
mesh.rotation.set(0.5, 0.5, 0.5);
mesh.scale.set(2, 2, 2);

const clonedMesh = mesh.clone();
// clonedMesh.position === (1, 1, 1)
// clonedMesh.rotation === (0.5, 0.5, 0.5)
// clonedMesh.scale === (2, 2, 2)
{{< /code >}}

After cloning, you can adjust the transforms on the original mesh and the cloned mesh separately.

{{< code lang="js" linenos="false" caption="Adjusting the transforms of the original and cloned meshes" >}}
// only mesh will move
mesh.position.x = 20;

// only clonedMesh will increase in size
clonedMesh.scale.set(5, 5, 5);
{{< /code >}}

`clonedMesh` also has the same geometry and material as `mesh`. **However, the geometry and material are not cloned, they are shared**. If we make any changes to the shared material, for example, to change its color, **all the cloned meshes will change, along with the original**. The same applies if you make any changes to the geometry.

{{< code lang="js" linenos="false" caption="Changes to the material or geometry will affect all clones" >}}
// mesh AND clonedMesh will turn red
mesh.material.color.set('red');

// mesh AND clonedMesh will turn blue
clonedMesh.material.color.set('blue');
{{< /code >}}

However, you can give a clone an entirely new material, and the original will not be affected.

{{< code lang="js" linenos="false" hl_lines="" caption="You can break the connection by giving clones a new material or geometry" >}}

```js
clonedMesh.material = new MeshStandardMaterial({ color: "indigo" });

// mesh.material -> still red
```

{{< /code >}}

### Custom Properties like `.tick` are Not Cloned

One important final note. Only the default properties of an object will be cloned. If you create custom properties like {{< link path="/book/first-steps/animation-loop/#the-tick-method" title="the `.tick` method" >}} we're using to create animations, these will not be cloned. You'll have to set up any custom properties again on the cloned mesh.

## Create the _**meshGroup.js**_ Module

Now, we will finally add these twenty-one spheres to our scene. Rename the _**cube.js**_ module from the previous chapter to _**meshGroup.js**_, and delete everything inside it (in the editor we've done this for you). Inside this new module, we'll use `SphereBufferGeometry`, `Group`, and `.clone` to create a bunch of spheres and then spend some time experimenting with them.

First, set up the imports. These are mostly the same as the previous chapter, except that we have replaced `BoxBufferGeometry` and `TextureLoader`, with `SphereBufferGeometry` and `Group`. Next, create the `createMeshGroup` function, and finally, export this function at the bottom of the module:

{{< code lang="js" linenos="" caption="_**meshGroup.js**_: initial structure" >}}
import {
SphereBufferGeometry,
Group,
MathUtils,
Mesh,
MeshStandardMaterial,
} from 'three';

function createMeshGroup() {}

export { createMeshGroup };
{{< /code >}}

### Create the `Group`

Inside the function, create a new group, and then give it a `.tick` method:

{{< code lang="js" linenos="" linenostart="9" hl_lines="12-16" caption="_**meshGroup.js**_: create a group" >}}
function createMeshGroup() {
// a group holds other objects
// but cannot be seen itself
const group = new Group();

group.tick = (delta) => {};

return group;
}

export { createMeshGroup };
{{< /code >}}

This completes the skeleton structure for the new module. Over in World, switch the `createCube` import to `createMeshGroup` (again, already done for you in the editor):

{{< code file="worlds/first-steps/organizing-with-group/src/World/World.final.js" from="1" to="8" lang="js" linenos="true" hl_lines="3" caption="_**World.js**_: import the new `meshGroup` module" >}}{{< /code >}}

Make a similar change in the constructor:

{{< code file="worlds/first-steps/organizing-with-group/src/World/World.final.js" from="17" to="32" lang="js" linenos="true" hl_lines="26-29" caption="_**World.js**_: create the group and add it to the scene and animation loop" >}}{{< /code >}}

At this point, your scene will contain a single empty group and nothing else. However, groups are invisible so all you'll see is the blue background.

### Create the Prototype Sphere

Next, we'll create the spheres and add them to the group. We'll do this by creating one _prototype_ sphere and then we'll clone that twenty times for a total of twenty-one spheres.

First, create a `SphereBufferGeometry` to give the prototype mesh its shape. This geometry will be shared by all the spheres. We'll give it a `radius` of 0.25, and set both `widthSegments` and `heightSegments` to sixteen:

{{< code lang="js" linenos="true" linenostart="14" caption="_**meshGroup.js**_: create a `SphereBufferGeometry`" >}}
const geometry = new SphereBufferGeometry(0.25, 16, 16);
{{< /code >}}

Setting both `widthSegments` and `heightSegments` to sixteen gives us a decent tradeoff between quality and performance, as long as we don't zoom in too close. With these settings, each sphere will be made out of 480 tiny triangles.

Next, create a `MeshStandardMaterial`. Nothing new here, except this time we'll {{< link path="/book/first-steps/physically-based-rendering/#change-the-materials-color" title="set the color" >}} to indigo. Once again, this material will be shared by all of the spheres.

{{< code lang="js" linenos="true" linenostart="16" caption="_**meshGroup.js**_: create a MeshStandardMaterial" >}}
const material = new MeshStandardMaterial({
color: 'indigo',
});
{{< /code >}}

Finally, create the mesh and then add it to the group:

{{< code lang="js" linenos="true" linenostart="20" caption="_**meshGroup.js**_: create the prototype mesh" >}}
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);
{{< /code >}}

We'll `.clone` this mesh to create the rest of the meshes, hence the name `protoSphere`. Putting all that together, here's the `createMeshGroup` function so far:

{{< code lang="js" linenos="" linenostart="9" caption="_**meshGroup.js**_: current progress" >}}
function createMeshGroup() {
// a group holds other objects
// but cannot be seen itself
const group = new Group();

const geometry = new SphereBufferGeometry(0.25, 16, 16);

const material = new MeshStandardMaterial({
color: 'indigo',
});

// create one prototype sphere
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

group.tick = (delta) => {};

return group;
}
{{< /code >}}

{{< figure src="first-steps/proto-sphere.png" alt="The protosphere" lightbox="true" class="medium right" >}}

At this point, the `protoSphere` should show up in the center of your scene.

Note how the `HemisphereLight` we added in the last chapter combines with the color of the sphere to create different shades across the surface. Also, look closely at the silhouette of the sphere. Can you see that it's made from lots of short straight lines? If you zoom way in using the orbit controls and then rotate the camera, this should become more obvious. Clearly, `widthSegments` and `heightSegments` at sixteen doesn't give us enough detail for a full-screen sphere. Now, zoom back out to the original size. The sphere should look better now, showing us that this quality level is fine for small or far-away spheres.

### Clone the `protoSphere`

This sub-heading wins the prize for most likely to be a line of dialogue in a cheesy sci-fi movie.

With our prototype mesh set up, we'll clone it to create the other meshes.

{{< code lang="js" linenos="false" hl_lines="" caption="Clone the `protoSphere`" >}}

```js
const clonedSphere = protoSphere.clone();
```

{{< /code >}}

We'll use a {{< link path="/book/appendix/javascript-reference/#for-loop" title="**for loop**" >}} to create twenty new spheres, adding each to the group as we create them. Normally, to loop twenty times, we would do this:

{{< code lang="js" linenos="false" caption="A basic for loop that runs twenty times" >}}
for (let i = 0; i < 20; i++) {
console.log('Hello twenty times!');
}
{{< /code >}}

However, in a moment, we'll arrange the cloned spheres in a circle using some trigonometry and we'll need values of `i` between zero and one. Since $\frac{1}{20}=0.05$, we can write the loop this way instead:

{{< code lang="js" linenos="false" caption="A for loop that runs twenty times with `i` values between zero and one" >}}
for (let i = 0; i < 1; i += 0.05) {
console.log('Hello twenty times!');
}
{{< /code >}}

Add this loop to `createMeshGroup` to create the twenty new spheres:

{{< code lang="js" linenos="true" linenostart="18" hl_lines="25-31" caption="_**meshGroup.js**_: create twenty cloned spheres" >}}
...

const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create twenty clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.05) {
const sphere = protoSphere.clone();

group.add(sphere);
}

...
{{< /code >}}

Now we have a total of twenty-one spheres (the original sphere plus twenty clones). However, we haven't moved any of the spheres yet, so they are all positioned exactly on top of each other at the center of the scene and it looks like there is still only one sphere.

### Position the Cloned Spheres in a Circle

We'll use a bit of trigonometry to place the cloned spheres in a circle surrounding the `protoSphere`. Here's one way to write the equations of a circle with radius one, where $0 \le i \le 1$:

$$
\begin{aligned}
  x &= \cos(2 \pi i) \cr
  y &= \sin(2 \pi i) \cr
\end{aligned}
$$

If we input values of $i$ between zero and one, we'll get points spread around the circumference of the circle. We can easily rewrite these function in JavaScript {{< link path="/book/appendix/javascript-reference/#the-math-object" title="using the built-in `Math` class" >}}:

{{< code lang="js" linenos="false" caption="Equations for points on a circle" >}}
const x = Math.cos(2 * Math.PI * i);
const y = Math.sin(2 * Math.PI * i);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagram of points around circle
{{% /note %}}

Next, move the equations into your for loop (now can you see why we wanted values of `i` between zero and one?):

{{< code lang="js" linenos="true" linenostart="27" hl_lines="31 32" caption="_**meshGroup.js**_: position the cloned meshes around a circle" >}}
for (let i = 0; i < 1; i += 0.05) {
const sphere = protoSphere.clone();

// position the spheres on around a circle
sphere.position.x = Math.cos(2 * Math.PI * i);
sphere.position.y = Math.sin(2 * Math.PI * i);

this.group.add(sphere);
}
{{< /code >}}

Once you do this, the cloned spheres will move into a circle surrounding the original `protoSphere`.

### Scale the Group

The circle we created has radius one, which is quite small. We'll double the scale of the group to make it bigger:

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="39" to="40" lang="js" linenos="true" caption="_**meshGroup.js**_: scale the group" >}}{{< /code >}}

The [`.multiplyScalar`](https://threejs.org/docs/#api/en/math/Vector3.multiplyScalar) method {{< link path="/book/first-steps/transformations/#the-multiplyscalar-method" title="multiplies the $x$, $y$, and $z$ components of a vector by a number" >}}. When we double the scale of the group, every object inside the group doubles in size too.

### Scale the Spheres

For some extra visual flair, let's scale the cloned spheres from tiny to large. Add the following line to the loop:

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="27" to="37" lang="js" linenos="true" caption="_**meshGroup.js**_: scale the cloned spheres"  hl_lines="34" >}}{{< /code >}}

The variable `i` lies in the range $0 \le i \le 1$, so here, we are scaling the meshes from nearly zero to full size.

### Spin the Wheel

Finally, update the `group.tick` method to set the spheres in motion. We'll use the same approach we used to {{< link path="/book/first-steps/animation-loop/#rotate-the-cube" title="create the cube animation" >}}, except this time we are rotating on a single axis so it's a simple spinning motion, like a wheel rotating around its center.

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="42" to="47" lang="js" linenos="true" caption="_**meshGroup.js**_: animate the group">}}{{< /code >}}

### Complete `createMeshGroup` Function

With all that in place, here's the complete `createMeshGroup` function:

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="9" to="50" lang="js" linenos="true" caption="_**meshGroup.js**_: complete createMeshGroup function">}}{{< /code >}}

## Experiment!

Finally, we have a scene that we can play with. You can get interesting results by making tiny changes within the loop. For example, try experimenting with a different step size in the loop to create more or fewer spheres:

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="27" to="27" lang="js" linenos="true" caption="_**meshGroup.js**_: try different values instead of 0.05">}}{{< /code >}}

{{% note %}}
TODO-LOW: the example scene in the editor looks better with 101 spheres than 20
Try these:
const geometry = new SphereBufferGeometry(0.25, 2, 8);

const material = new MeshStandardMaterial({
color: 'indigo',
flatShading: true
});

const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create 20 clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.01) {

{{% /note %}}

What happens if you change 0.05 to 0.001? How small can that value be before you start to notice a drop in the frame rate?

Or, how about changing the $z$ positions in the loop as well as $x$ and $y$?

{{< code lang="js" linenos="true" linenostart="31" caption="_**meshGroup.js**_: change sphere's z position" >}}
sphere.position.x = Math.cos(2 * Math.PI * i);
sphere.position.y = Math.sin(2 * Math.PI * i);
sphere.position.z = -i * 5;
{{< /code >}}

{{< inlineScene entry="first-steps/snake.js" class="round" >}}

{{% note %}}
TODO-LOW: better position controls target on snake scene
{{% /note %}}

You'll have to adjust the camera as well to get this exact view. That sounds like a "hard" challenge!

## Challenges

{{% aside success %}}

### Easy

1. Increase and decrease the number of spheres by changing the value 0.05 in the loop. Try to calculate how many spheres you want before you make the change, rather than entering random numbers.

2. Try out some other shapes besides spheres and boxes. How about [cones](https://threejs.org/docs/#api/en/geometries/ConeBufferGeometry), [cylinders](https://threejs.org/docs/#api/en/geometries/CylinderBufferGeometry), [rings](https://threejs.org/docs/#api/en/geometries/RingBufferGeometry), or [dodecahedrons](https://threejs.org/docs/#api/en/geometries/DodecahedronBufferGeometry)? For this exercise, simply replace the `SphereBufferGeometry` with one of the other buffer geometry classes. The constructor for each type of geometry takes different parameters so read the docs carefully, and remember to import the class before you use it.

3. Try adjusting the `widthSegments` and `heightSegments`. How high can you go before you notice a drop in the frame rate? What does the sphere look like with really low values? What happens if you don't use the same number for both parameters?

{{% /aside %}}

{{% aside %}}

### Medium

1. Inside the `group.tick` method, we are subtracting the rotation each frame: `.rotation.z -= ...`. This results in _clockwise_ rotation. Switch to `+=`, and notice how the rotation changes to _anti-clockwise_. If you add rotation, the movement will be anti-clockwise. If you subtract rotation, the movement will be clockwise. **Positive rotation in three.js is anti-clockwise**.

2. Can you create some other animations here? Remember, you can animate _any property that can be changed_.

{{% /aside %}}

{{% aside warning %}}

### Hard

1. You guessed it! Can you make the scene in the editor exactly match the scene above?

2. Back to the original scene, can you alternate between two different shapes around the circle? Say, ten spheres, and ten boxes? How about alternating between three different shapes? Or ten different shapes?

3. While it's true that you can animate any property, the hard part is making smooth, repeating motion. Rotation is a special case since you can keep increasing forever and the object will go round and round in circles. To create similar behavior for the other properties, you can use the trigonometric functions sin, cos, and tan. We used cos and sin to place the spheres in a circle, and you can do something similar to move the group's position in a circle. Can you figure it out? No tips though, after all, this is supposed to be a hard challenge!

{{% /aside %}}
