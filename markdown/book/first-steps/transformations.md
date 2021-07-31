---
title: "Transformations and Coordinate Systems"
description: "Here, we explore how to move objects around in 3D space using translation, rotation, and scale, and the coordinate systems which makes up the space itself. We also introduce the scene graph, a structure used to group objects within a three.js scene."
date: 2018-04-02
weight: 105
chapter: "1.5"
available: true
showIDE: true
IDEFiles:   [
  "worlds/first-steps/transformations/src/World/components/camera.js",
  "worlds/first-steps/transformations/src/World/components/cube.js",
  "worlds/first-steps/transformations/src/World/components/lights.js",
  "worlds/first-steps/transformations/src/World/components/scene.js",
  "worlds/first-steps/transformations/src/World/systems/renderer.js",
  "worlds/first-steps/transformations/src/World/systems/Resizer.js",
  "worlds/first-steps/transformations/src/World/World.js",
  "worlds/first-steps/transformations/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/transformations/index.html",
]
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/transformations/'
IDEActiveDocument: 'src/World/components/cube.js'
membershipLevel: free
---



# Transformations, Coordinate Systems, and the Scene Graph

This chapter is an introduction to moving objects around in 3D space.

Many things come together to make a beautiful 3D scene, such as lighting, materials, models, textures, camera settings, post-processing, particle effects, interactivity, and so on, but no matter what kind of scene we create, nothing is more important than the arrangement and movement of the pieces from which it is composed.

To create architectural renderings, we must become architects and interior decorators. We must consider the proportions of buildings and the rooms inside them, and skillfully place the furniture and light fittings. In a nature scene, whether a close up of a single flower or a wide, sweeping mountain vista, we need to arrange the trees and rocks, or the leaves and petals, in a natural and convincing manner. Perhaps a hoard of [invading robots](https://threejs.org/examples/#webgl_animation_skinning_morph) will sweep across the landscape, eyes gleaming, arms and feet swinging as they march in unison, rockets blasting into the sky and creating huge explosions wherever they land - in which case we must become both robot designers and ballistics experts.

Even [purely abstract scenes](https://threejs.org/examples/#webgl_interactive_buffergeometry) require an understanding of how to move objects around in 3D space.

{{< iframe src="https://threejs.org/examples/webgl_buffergeometry_drawrange.html" height="500" title="An abstract scene from the three.js examples" caption="An abstract scene from the three.js examples<br>created by [Fernando Serrano](https://twitter.com/fernandojsg)" >}}

Finally, we must also become directors and position the camera to artistically frame each shot. When creating a 3D scene, the only limit is your imagination - and the depth of your technical knowledge.

Moving objects around in 3D space is a fundamental skill on your path of learning three.js. We'll break this skill down into two parts: first, we'll explore the coordinate system used to describe 3D space, and then we'll explore mathematical operations called transformations that are used to move objects around within a coordinate system.

Along the way we'll encounter several mathematical objects, such as **the scene graph**, a structure used to describe the hierarchy of objects that make up our scenes, **vectors**, which are used to describe positions in 3D space (and many other things), and no less than two ways of describing rotations: **Euler angles** and **quaternions**. We'll finish up the chapter by introducing you to **transformation matrices**, which are used to store an object's complete transformation state.

{{% aside success %}}

### Hello, Linear Algebra (Nice to Meet You!)

Transformations, coordinate systems, and most of the other mathematical terms we'll encounter in this chapter come from **linear algebra**. You only need a high school level to get through this book, but if your algebra skills are a little rusty, or even if you've never heard of a coordinate system before, don't worry. You can get by with very little mathematical knowledge when using three.js, and there is a range of mathematical helpers built-in to the three.js core, so we rarely need to do any calculation ourselves.

If at some point you want to study this subject more deeply, [Khan Academy](https://www.khanacademy.org/) is one of the best resources on the web for learning mathematics, and their courses, especially the [linear algebra course](https://www.khanacademy.org/math/linear-algebra), have everything you need to get through this book. If you're already familiar with this subject and want a deeper technical overview of the coordinate systems used in WebGL, check out this [excellent article on learnopengl.com](https://learnopengl.com/Getting-started/Coordinate-Systems).

On the other hand, if all this talk of mathematics sounds daunting, or if you find this chapter more challenging than the last few, take it slow. You don't need to absorb everything here in one go, especially if it's new to you or you haven't touched linear algebra in years. Pick up what you can now, then treat this chapter as a reference and come back to it as your three.js skills mature. Once you have more experience creating 3D scenes the concepts described here will become easier to grasp.

{{% /aside %}}

## Translation, Rotation, and Scaling: the Three Fundamental Transformations

**Whenever we move objects around in 3D space, we do so using mathematical operations called _transformations_**. We've already seen two kinds of transformation: **translation**, stored in an object's [`.position`](https://threejs.org/docs/#api/en/core/Object3D.position) property, and **rotation**, stored in the [`.rotation`](https://threejs.org/docs/#api/en/core/Object3D.rotation) property. Along with **scaling**, stored in the [`.scale`](https://threejs.org/docs/#api/en/core/Object3D.scale) property, these make up the three fundamental transformations that we'll use to move objects around in our scenes. We'll sometimes refer to transform, rotate, and scale using their initials, **TRS**.

Every object we can add to the scene using `scene.add` has these properties, including meshes, lights, and cameras, while materials and geometries do not. We previously used `.position` to {{< link path="/book/first-steps/first-scene/#position-camera" title="set the position of our camera" >}}:

{{< code lang="js" linenos="false" caption="Our First Scene: _**main.js**_" >}}
camera.position.set(0, 0, 10);
{{< /code >}}

... and also to {{< link path="/book/first-steps/physically-based-rendering/#position-the-light" title="set the position of the directional light" >}}:

{{< code lang="js" linenos="false" caption="Physically Based Rendering: _**lights.js**_" >}}
light.position.set(10, 10, 10);
{{< /code >}}

In the last chapter {{< link path="/book/first-steps/physically-based-rendering/#rotate-the-cube" title="we used `.rotation` to get a better view of our cube" >}}:

{{< code lang="js" linenos="false" caption="Physically Based Rendering: _**cube.js**_" >}}
cube.rotation.set(-0.5, -0.1, 0.8);
{{< /code >}}

The only fundamental transformation we haven't encountered so far is `.scale`.

There's no code to write in this chapter. Instead, the editor has a mesh set up with some transformations applied, which you can use as a scratchpad for testing out ideas while you read.

### Butterflies and Caterpillars

Using the word **transformation** in this way might seem strange to you. In common speech, it's more likely to evoke the idea of a caterpillar turning into a butterfly than moving the caterpillar two units to the left across a leaf. But mathematically speaking, only the second one of these is a transformation. Translation, rotation, and scaling are the most important transformations you'll encounter, and we'll explore each of these in detail in a few moments.

## The `Object3D` Base Class

Rather than redefining the `.position`, `.rotation`, and `.scale` properties many times for each type of object, these properties are defined once on the [`Object3D`](https://threejs.org/docs/#api/en/core/Object3D) base class, then all the other classes that can be added to the scene {{< link path="/book/appendix/javascript-reference/#class-inheritance-and-the-extends-keyword" title="derive from this base class" >}}. That includes things like meshes, cameras, lights, points, lines, helpers, and even the scene itself. We'll informally refer to classes derived from `Object3D` as _scene objects_.

`Object3D` has many properties and methods besides these three, inherited by every scene object. This means positioning and setting up a camera or a mesh works in much the same way as setting up a light or the scene. Additional properties are then added to scene objects as needed, so lights get color and intensity settings, the scene gets a background color, meshes get a material and geometry, and so on.

## The Scene Graph

Recall how we {{< link path="/book/first-steps/first-scene/#add-the-mesh-to-the-scene" title="add the mesh to scene" >}}:

{{< code lang="js" linenos="false" hl_lines="" caption="The `scene.add` method" >}}
``` js
scene.add(mesh);
```
{{< /code >}}

The `.add` method is also defined on `Object3D` and inherited by the scene class, just like `.position`, `.rotation`, and `.scale`. All other derived classes inherit this method too, giving us `light.add`, `mesh.add`, `camera.add` and so on. This means we can add objects to each other to create a tree structure with the scene at the top. This tree structure is known as the **scene graph**.

{{< figure src="first-steps/scene_graph.svg" caption="The scene graph" class="" lightbox="true" >}}

When we add an object to another object, we call one object the **parent** and the other the **child**.

{{< code lang="js" linenos="false" caption="Objects within the scene graph have a parent-child relationship" >}}
parent.add(child);
{{< /code >}}

The scene is the top-level parent. The scene in the figure above has three children: one light and two meshes. One of the meshes also has two children. However, every object (except the top-level scene) has exactly one parent.

> Each object in the scene graph (except the top-level scene) has exactly one parent, and can have any number of children.

When we render the scene:

{{< code lang="js" linenos="false" hl_lines="" caption="Render a frame" >}}
``` js
renderer.render(scene, camera);
```
{{< /code >}}

... the renderer walks through the scene graph, starting with the scene, and uses the position, rotation, and scale of each object relative to its parent to figure out where to draw it.

### Accessing a Scene Object's Children

You can access all children of a scene object using the [`.children`](https://threejs.org/docs/#api/en/core/Object3D.children) array:

{{< code lang="js" linenos="false" caption="Accessing child of a group" >}}
scene.add(mesh);

// the children array contains the mesh we added
scene.children; // -> [mesh]

// now, add a light:
scene.add(light);

// the children array now contains both the mesh and the light
scene.children; // -> [mesh, light];

// now you can access the mesh and light using array indices
scene.children[0]; // -> mesh
scene.children[1]; // -> light
{{< /code >}}

There are more sophisticated ways to access a particular child, for example, the [`Object3d.getObjectByName`](https://threejs.org/docs/#api/en/core/Object3D.getObjectByName) method. However, directly accessing the `.children` array is useful when you don't know the object's name, or it doesn't have a name.

## Coordinate Systems: World Space and Local Space

3D space is described using a 3D [Cartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system).

{{% note %}}
TODO-LOW: make the coordinate system diagram 3D
{{% /note %}}

{{< figure src="first-steps/coordinate_system_simple.svg" caption="A 3D Cartesian coordinate system" class="medium left" lightbox="true" >}}

3D Cartesian coordinate systems are represented using $X$, $Y$, and $Z$ axes crossing at the point $(0,0,0)$ (known as **the origin**). 2D coordinate systems are similar but have only $X$, and $Y$ axes.

{{% note %}}
TODO-DIAGRAM: add figure of 2D coords
{{% /note %}}

Every 3D graphics system uses a coordinate system like this, from game engines like Unity and Unreal, to the software Pixar uses to create their films, to professional animation and modeling software such as 3DS Max, Maya, and Blender. Even CSS, the language used to position objects on a web page, uses a Cartesian coordinate system. However, there may be minor technical differences between these systems, such as the axes being labeled differently or pointing in different directions.

We'll encounter several 2D and 3D coordinate systems while using three.js. Here, we'll introduce the two most important of these: **world space** and **local space**.

### World Space

{{< figure src="first-steps/coordinate_system.svg" caption="Our scene defines world space" class="medium left" lightbox="true" >}}

Our `scene` defines the world space coordinate system, and the center of the system is the point where the `X`, `Y` and, `Z` axes meet.

Remember a couple of chapters ago, {{< link path="/book/first-steps/first-scene/#the-scene" title="when we first introduced the `Scene` class" >}}, we called it a "tiny universe"? This tiny universe _is_ world space.

{{< figure src="first-steps/world_space_scene_graph.svg" caption="Objects added to the scene live within world space" class="medium right" lightbox="true" >}}

When we arrange objects within a scene - whether we are positioning furniture in a room, trees in a forest, or rampaging robots on a battlefield - what we see drawn on our screens is the position of each object in world space.

**When we add an object directly to the scene and then translate, rotate, or scale it, the object will move relative to world space - that is, relative to the center of the scene**.

{{< code lang="js" linenos="false" >}}
// add a cube to our scene
scene.add(cube);

// move the cube relative to world space
cube.position.x = 5;
{{< /code >}}

These two statements are equivalent, so long as the object is a direct child of the scene:

1. Transform an object relative to world space.
2. Move an object around in the scene.

Whenever we try to visualize something tricky in 3D, it can be useful to drop down a dimension and consider a 2D analogy instead. So, let's consider a chessboard. When we arrange the pieces to start a new game, we place them in certain positions on the board. That means the chessboard is the scene, and the pieces are objects we place in the scene.

{{< figure src="first-steps/chessboard.svg" caption="The board is world space in a game of chess" class="medium left" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: the points on the axes should match rows/columns on the board
{{% /note %}}

Next, when we explain to someone why we have arranged the pieces like this, white on one side, black on the other, pawns on the second row, and so on, we do so relative to the board itself. The board defines a coordinate system, with rows on the Y-axis and columns on the X-axis. This is the world space of a chessboard, and we explain the position of each piece relative to this coordinate system.

Now the game starts, and we begin to move pieces. When we do, we follow the rules of chess. When we move an object around in a three.js scene, we follow the rules of Cartesian coordinate systems. Here the analogy breaks down a little because each piece on the chessboard has its own way of moving, whereas in a Cartesian coordinate system, translation, rotation, and scale behave the same for any kind of object.

### Local Space

{{% note %}}
TODO-DIAGRAM: diagram of local space within world space
{{% /note %}}

{{< figure src="first-steps/knight.svg" caption="The local space of a chess piece" class="medium right" lightbox="true" >}}

Now, consider one of the chess pieces. If asked to describe the shape of a chess piece, you won't describe how it looks relative to the chessboard since it may be placed anywhere on the board, and indeed, retains its shape even when not on the board at all. Instead, you'll create a new coordinate system in your mind and describe how the piece looks there.

Just like pieces on a chessboard, **every object we can add to the scene also has a local coordinate system**, and the shape (geometry) of the object is described within this local coordinate system. When we create a mesh or a light, we also create a new local coordinate system, with the mesh or light at its center. This local coordinate system has $X$, $Y$ and, $Z$ axes, just like world space. The local coordinate system of an object is called **local space** (or sometimes **object space**).

{{% note %}}
TODO-LOW: check that local space and object space are the same
TODO-DIAGRAM: add diagram of mesh at the center of local coordinate system
{{% /note %}}

When we create a $2 \times 2 \times 2$ `BoxBufferGeometry`, and then create a mesh using the geometry, the size of the geometry is two units along each side _in the mesh's local space_:

{{< code lang="js" linenos="false" caption="Geometry is described in the mesh's local space" >}}
const geometry = new BoxBufferGeometry(2, 2, 2);

const mesh = new Mesh(geometry, material);
{{< /code >}}

As we'll see below, we can stretch or shrink the mesh using `.scale`, and the size of the mesh as drawn on our screen will change. However, the size of the geometry does not change when we scale the mesh. When the renderer comes to render the mesh, it will see that it has been scaled, and then draws the mesh at a different size.

{{% note %}}
TODO-DIAGRAM: add diagram of mesh being scaled
{{% /note %}}

### Every Object has a Coordinate System

To recap: the top-level scene defines world space, and every other object defines its own local space.

{{< code lang="js" linenos="false"  >}}
// creating the scene creates the world space coordinate system
const scene = new Scene();

// mesh A has its own local coordinate system
const meshA = new Mesh();

// mesh B also has its own local coordinate system
const meshB = new Mesh();
{{< /code >}}

With the above three lines of code, we have created three coordinate systems. There's no difference, mathematically, between these three coordinate systems. Any mathematical operation we can do in world space will work the same way in any object's local space.

It's easy to think of coordinate systems as big complicated things, however, when working in 3D you'll find out that there are a lot of coordinate systems around. Every object has at least one, and some have several. There's another whole set of coordinate systems involved in rendering the scene, that is, converting the objects from 3D world space into something that looks good on the flat 2D surface of your screen. Every texture even has a 2D coordinate system. In the end, they are not so complicated, and they are very cheap to create.

## Working with the Scene Graph

Using each object's `.add` and `.remove` methods, we can create and manipulate the scene graph.

{{< figure src="first-steps/local_space_scene_graph.svg" caption="The scene graph is a series of embedded<br> coordinate systems, with world space at the top" class="medium right" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: could make this into a very cool diagram that shows the scene graph in 3D with one huge coordinate system and lots of small coordinate systems
{{% /note %}}

When we add an object to our scene using `scene.add`, we embed this object within the scene's coordinate system, world space. When we move the object around, it will move relative to world space (or equivalently, relative to the scene).

When we add an object to another object deeper within the scene graph, we embed the child object within the parent's local space. When we move the child object around, it will move relative to the parent object's coordinate system. The coordinate systems get nested inside each other like Russian dolls.

Let's look at some code. First, we'll add an object $A$ as a child of the scene:

{{< code lang="js" linenos="false" caption="Add $A$ to the scene" >}}
scene.add(meshA);
{{< /code >}}

Now, the `scene` is the parent of $A$, or equivalently, $A$ is a child of the `scene`. Next, we'll translate $A$:

{{< code lang="js" linenos="false" caption="Move $A$ within world space" >}}
meshA.position.x = 5;
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of $A$ moving relative to the scene
{{% /note %}}

Now, $A$ has been translated five units along the positive $X$-axis within world space. **Whenever we transform an object, we do so relative to its parent's coordinate system**. Next, let's look at what happens when we add a second object, $B$, as a child of $A$:

{{< code lang="js" linenos="false" caption="Add $B$ to $A$" >}}
meshA.add(meshB);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of this simple scene graph: scene -> A -> B
{{% /note %}}

$A$ is still a child of the scene, so we have the relationship $Scene \longrightarrow A \longrightarrow B$. So, $A$ is a child of the scene and $B$ is a child of $A$. Or, equivalently, $A$ now lives in world space and $B$ now lives in $A$'s local space. When we move $A$, it will move around in world space, and when we move $B$, it will move around in $A$'s local space.

Next, we'll translate $B$:

{{< code lang="js" linenos="false" caption="Move $B$ within the local space of $A$" >}}
meshB.position.x = 3;
{{< /code >}}

Where do you think $B$ will end up?

### What We See is World Space

When we call `.render`, the renderer calculates the world space position of each object. To do this, it starts at the bottom of the scene graph and works its way up, combining the transformations of each parent and child, to calculate the final position of each object relative to world space. **What we finally see on our screen is world space**. Here, we'll do this calculation by hand for $A$ and $B$. Remember, each object starts at $(0,0,0)$ relative to its parent.

{{< code lang="js" linenos="false" >}}
// A starts at (0,0,0) in world space
scene.add(meshA);

// B starts at (0,0,0) in A's local space
meshA.add(meshB);

meshA.position.x = 5;

meshB.position.x = 3;
{{< /code >}}


Calculating $A$'s position is easy since it's a direct child of the scene. We moved $A$ five units to the right along the $X$-axis, so its final position is $x=5, y=0, z = 0$, or $(5, 0, 0)$.

When we move $A$, its local coordinate system moves with it, and we must take that into account when calculating the world space position of $B$. Since, $B$ is a child of $A$, this means it now starts at $(5, 0, 0)$ relative to world space. Next, we moved $B$ three units along the $X$-axis relative to $A$, so the final position of $B$ on the $X$-axis is $5 + 3 = 8$. This gives us the final position of $B$ in world space: $(8, 0, 0)$.

### Moving an Object Between Coordinate Systems

What happens if we move an object from one coordinate system to another? In other words, what happens if we take mesh $B$, and, without changing its `.position`, remove it from $A$ and add it directly to the scene? We can do this in a single line:

{{< code lang="js" linenos="false" caption="Add mesh $B$ to the scene, and remove any previous parent" >}}
scene.add(meshB);
{{< /code >}}

An object can only have one parent, so any previous parent of $B$ (in this case, mesh $A$) is removed.

The following statement still holds: **$B$ has been translated three units along the positive $X$-axis _within its parent's coordinate system_.** However, $B$'s parent is now the scene rather than $A$, so now we must recalculate the position of $B$ in world space rather than $A$'s local space, which will give us $(3, 0, 0)$.

That's it for coordinate systems. In the rest of the chapter, we'll take a deeper look at each of the three fundamental transformations: translation, rotation, and scale.

## Our First Transformation: Translation

{{% note %}}
TODO-DIAGRAM: add diagram of translation
{{% /note %}}

The simplest of the three fundamental transformations is **translation**. We've already used it for several of the examples in this chapter, and also to set the position of the camera and light in our scene. We perform translations by changing an object's [`.position`](https://threejs.org/docs/#api/en/core/Object3D.position) property. Translating an object moves it to a new position within the coordinate system of its direct parent.

To fully describe an object's position, we need to store three pieces of information:

1. The object's position on the $X$-axis, which we call $x$.
2. The object's position on the $Y$-axis, which we call $y$.
3. The object's position on the $Z$-axis, which we call $z$.

We can write these three positions as an ordered list of numbers: $(x, y, z)$.

Zero on all three axes is written $(0,0,0)$, and {{< link path="/book/first-steps/first-scene/#the-scene" title="as we mentioned previously" >}}, this point is known as **the origin**. **Every object starts at the origin within the coordinate system of its parent.**

A position one unit to the _right_ along the $X$-axis, two units _up_ along the $Y$-axis, and three units _out_ along the $Z$-axis is written $(1,2,3)$. A position two units _left_ along the $X$-axis, four units _down_ along the $Y$-axis, and eight units _in_ along the $Z$-axis is written $(-2,-4,-8)$.

> We call an ordered list of numbers like this a **vector**, and since there are three numbers, it's a **3D vector**.

### Translating an Object

We can translate along the $X$, $Y$, and $Z$ axes one by one, or we can translate along all three axes at once using `position.set`. The final result in both cases will be the same.

{{< code lang="js" linenos="false" caption="Two ways of translating an object" >}}
// translate one axis at a time
mesh.position.x = 1;
mesh.position.y = 2;
mesh.position.z = 3;

// translate all three axes at once
mesh.position.set(1,2,3);
{{< /code >}}

When we perform the translation $(1,2,3)$, we are performing the mathematical operation:

$$(0,0,0) \longrightarrow (1,2,3)$$

This means: move from the point $(0,0,0)$ to the point $(1,2,3)$.

{{% note %}}
TODO-DIAGRAM: add diagram of vector moving 0,0,0 -> 1,2,3
{{% /note %}}

### The Unit of Translation is Meters

When we perform the translation `mesh.position.x = 2`, we move the object **two three.js units to the right** along the $X$-axis, and {{< link path="/book/first-steps/physically-based-rendering/#create-physically-sized-scenes" title="as we mentioned previously" >}}, we'll always take one three.js unit to be equal to one meter.

### Directions in World Space

{{< figure src="first-steps/coordinate_system.svg" caption="Directions within World Space" class="medium left" lightbox="true" >}}

Above we mentioned moving an object left or right on the $X$-axis, up or down on the $Y$-axis, and in or out on the $Z$-axis. These directions are relative to your screen and assume that you have not rotated the camera. In that case, the following directions hold:

{{< clear >}}

* The positive $X$-axis points to the _right_ of your screen.
* The positive $Y$-axis points _up_, towards the top of your screen.
* The positive $Z$-axis points _out_ of the screen towards you.

Then, when you move an object:

* A positive translation on the $X$-axis moves the object to the _right_ on your screen.
* A positive translation on the $Y$-axis moves the object _up_ towards the top of your screen.
* A positive translation on the $Z$-axis moves the object _out_ towards you.

When we put a minus sign into the translation, we reverse those directions:

* A negative translation on the $X$-axis moves the object to the _left_ on your screen.
* A negative translation on the $Y$-axis moves the object _down_ towards the bottom of your screen.
* A negative translation on the $Z$-axis moves the object _in_, away from you.

But of course, you can rotate the camera in any direction, in which case these directions will no longer hold. After all, what you see on your screen is the viewpoint of the camera. However, it's useful to be able to describe directions in world space using "normal" language, so we'll treat this camera position as the default view and continue to describe directions using this terminology, no matter where the camera happens to be.

## Positions are stored in the `Vector3` Class

Three.js has a special class for representing 3D vectors called [`Vector3`](https://threejs.org/docs/#api/math/Vector3). This class has `.x`, `.y` and `.z` properties and methods like `.set` to help us manipulate them. Whenever we create any scene object, such as a `Mesh`, a `Vector3` is created automatically and stored in `.position`:

{{< code lang="js" linenos="false" caption="An object's translation is stored in a `Vector3`" >}}
// when we create a mesh ...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.position = new Vector3();
{{< /code >}}

We can also create `Vector3` instances ourselves:

{{< code lang="js" linenos="false" caption="Creating a `Vector3` instance" >}}
import { Vector3 } from 'three';

const vector = new Vector3(1, 2, 3);
{{< /code >}}

We can access and update the `.x`, `.y` and `.z` properties directly, or we can use `.set` to change all three at once:

{{< code lang="js" linenos="false" caption="The `Vector3` class: changing property values" >}}
vector.x; // 1
vector.y; // 2
vector.z; // 3

vector.x = 5;

vector.x; // 5

vector.set(7, 7, 7);

vector.x; // 7
vector.y; // 7
vector.z; // 7
{{< /code >}}

As with nearly all three.js classes, we can omit the parameters to use default values. If we omit all three parameters the `Vector3` created will represent the origin, with all zero values:

{{< code lang="js" linenos="false" caption="The `Vector3` class: default parameters" >}}
const origin = new Vector3();

origin.x; // 0
origin.y; // 0
origin.z; // 0

mesh.position = new Vector3();
mesh.position.x; // 0
mesh.position.y; // 0
mesh.position.z; // 0
{{< /code >}}

three.js also has classes representing [2D vectors](https://threejs.org/docs/#api/en/math/Vector2) and [4D vectors](https://threejs.org/docs/#api/en/math/Vector4), however, 3D vectors are by far the most common type of vector we'll encounter.

### Vectors are General Purpose Mathematical Objects

Vectors can represent all kinds of things, not just translations. Any data that can be represented as an ordered list of two, three, or four numbers are usually stored in one of the vector classes. These data types fall into three categories:

1. A point in space.
2. **A length and direction within a coordinate system**.
3. A list of numbers with no deeper mathematical meaning.

Category two is the mathematical definition of a vector, and translation falls into this category.  Categories one and three are not technically vectors. However, it's useful to reuse the code within the vector classes so we'll turn a blind eye to this.

## Our Second Transformation: Scaling

{{% note %}}
TODO-DIAGRAM: add diagram of scaling
{{% /note %}}

Scaling an object makes it larger or smaller, so long as we scale by the same amount on all three axes. If we scale the axes by different amounts, the object will become squashed or stretched. As a result, scaling is the only one of the three fundamental transformations that can change the shape of an object.

Like `.position`, `.scale` is stored in a `Vector3`, and the initial scale of an object is $(1,1,1)$:

{{< code lang="js" linenos="false" caption="An object's scale is stored in a `Vector3`" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.scale = new Vector3(1, 1, 1);
{{< /code >}}

### Scale Values are Relative to the Initial Size of the Object

Since `.scale` and `.position` are both stored in a `Vector3`, scaling an object works much the same way as translating it. However, while translation uses three.js units, scale does not use any units. Instead, scale values are proportional to the initial size of the object: 1 means 100% of initial size, 2 means 200% of initial size, 0.5 means 50% of initial size, and so on.

### Uniform Scaling: Use the Same Value for all Three Axes

When we scale all three axes by the same amount, the object will expand or shrink, but maintain its proportions. This is called **uniform scaling**. A scale of $(1,1,1)$, meaning 100% scale on the $X$-axis, $Y$-axis, and $Z$-axis, is the default value:

{{< code lang="js" linenos="false" caption="Reset the object to its initial scale" >}}
mesh.scale.set(1, 1, 1);
{{< /code >}}

A scale of $(2,2,2)$ means 200% scale on the $X$-axis, $Y$-axis, and $Z$-axis. The object will grow to twice its initial size:

{{< code lang="js" linenos="false" caption="Double the object's size" >}}
mesh.scale.set(2, 2, 2);
{{< /code >}}

A scale of $(0.5,0.5,0.5)$ means 50% scale on the $X$-axis, $Y$-axis, and $Z$-axis. The object will shrink to half its initial size:

{{< code lang="js" linenos="false" caption="Shrink the object to half size" >}}
mesh.scale.set(0.5, 0.5, 0.5);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of uniform scale
{{% /note %}}

### Non-Uniform Scaling: Different Scale Values on Each Axis

If we scale individual axes the object will lose its proportions and become squashed or stretched. This is called **non-uniform scaling**. If we scale just the $X$-axis, the object will become wider or narrower:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $X$-axis" >}}
// double the initial width
mesh.scale.x = 2;

// halve the initial width
mesh.scale.x = 0.5;
{{< /code >}}

Scaling on the $Y$-axis will make the object taller or shorter:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $Y$-axis" >}}
// squash the mesh to one quarter height
mesh.scale.y = 0.25;

// stretch the mesh to a towering one thousand times its initial height
mesh.scale.y = 1000;
{{< /code >}}

Finally, if we scale on the $Z$-axis, the depth of the object will be affected:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $Z$-axis" >}}
// stretch the object to eight times its initial depth
mesh.scale.z = 8;

// squash the object to one tenth of its initial depth
mesh.scale.z = 0.1;
{{< /code >}}

Once again, we can use `.set` to scale on all three axes at once:

{{< code lang="js" linenos="false" caption="Non-uniform scale on multiple axes" >}}
mesh.scale.set(2, 0.5, 6);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of non-uniform scale
{{% /note %}}

### Negative Scale Values Mirror an Object

Scale values less than zero will mirror the object in addition to making it smaller or larger. A scale value of $-1$ _on any single axis_ will mirror the object without affecting the size:

{{< code lang="js" linenos="false" caption="Mirror an object" >}}
// mirror the mesh across the X-axis
mesh.scale.x = -1;

// mirror the mesh across the Y-axis
mesh.scale.y = -1;

// mirror the mesh across the Z-axis
mesh.scale.z = -1;
{{< /code >}}

Values less than zero and greater than $-1$ will mirror _and_ squash the object:

{{< code lang="js" linenos="false" caption="Mirror and shrink object" >}}
// mirror and squash mesh to half width
mesh.scale.x = -0.5;
{{< /code >}}

Values less than $-1$ will mirror _and_ stretch the object:

{{< code lang="js" linenos="false" caption="Mirror and stretch object" >}}
// mirror and stretch mesh to double height
mesh.scale.y = -2;
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of mirror scale
{{% /note %}}

#### Uniform Scale and Mirror

To mirror an object while maintaining its proportions, use the same value for all three axes but make one of them negative. For example, to double an object's size and mirror on the $Y$-axis, use a scale value of $(2, -2, 2)$:

{{< code lang="js" linenos="false" caption="Uniform scale and mirror" >}}
mesh.scale.set(2, -2, 2);
{{< /code >}}

Or, to shrink the object to one-tenth size and mirror on the $X$-axis, use a scale value of $(-0.1,0.1,0.1)$:

{{< code lang="js" linenos="false" caption="Uniform scale and mirror" >}}
mesh.scale.set(-0.1, 0.1, 0.1);
{{< /code >}}

### Cameras and Lights Cannot be Scaled

Not all objects can be scaled. For example, cameras and lights (except for `RectAreaLight`) don't have a size, so scaling them doesn't make sense. Changing `camera.scale` or `light.scale` will have no effect.

## Our Final Transformation: Rotation

{{% note %}}
TODO-DIAGRAM: add diagram of rotation
{{% /note %}}

Rotation requires a little more care than translation or scaling. There are several reasons for this, but the main one is **the order of rotation matters**. If we translate or scale an object on the $X$-axis, $Y$-axis, and $Z$-axis, it doesn't matter which axis goes first. These three translations give the same result:

1. Translate along $X$-axis, then along the $Y$-axis, then along the $Z$-axis.
2. Translate along $Y$-axis, then along the $X$-axis, then along the $Z$-axis.
3. Translate along $Z$-axis, then along the $X$-axis, then along the $Y$-axis.

These three scale operations give the same result:

1. Scale along $X$-axis, then along the $Y$-axis, then along the $Z$-axis.
2. Scale along $Y$-axis, then along the $X$-axis, then along the $Z$-axis.
3. Scale along $Z$-axis, then along the $X$-axis, then along the $Y$-axis.

However, these three rotations _may_ not give the same result:

1. Rotate around $X$-axis, then around the $Y$-axis, then around the $Z$-axis.
2. Rotate around $Y$-axis, then around the $X$-axis, then around the $Z$-axis.
3. Rotate around $Z$-axis, then around the $X$-axis, then around the $Y$-axis.

As a result, the humble `Vector3` class that we used for both `.position` and `.scale` is not sufficient for storing rotation data. Instead, three.js has not one, but _two_ mathematical classes for storing rotation data. We'll look at the simpler of these here: [Euler angles](https://en.wikipedia.org/wiki/Euler_angles). Fortunately, it's similar to the `Vector3` class.

### Representing Rotations: the `Euler` class

Euler angles are represented in three.js using the [`Euler`](https://threejs.org/docs/#api/en/math/Euler) class. As with `.position` and `.scale`, an `Euler` instance is automatically created and given default values when we create a new scene object.

{{< code lang="js" linenos="false" caption="An object's rotation is stored as an `Euler` angle" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();
{{< /code >}}

As with `Vector3`, there are `.x`, `.y` and `.z` properties and a `.set` method:

{{< code lang="js" linenos="false" caption="The `Euler` class is similar to `Vector3`" >}}
mesh.rotation.x = 2;
mesh.rotation.y = 2;
mesh.rotation.z = 2;

mesh.rotation.set(2, 2, 2);
{{< /code >}}

Once again, we can create `Euler` instances ourselves:

{{< code lang="js" linenos="false" caption="Creating an `Euler` instance" >}}
import { Euler } from 'three';

const euler = new Euler(1, 2, 3);
{{< /code >}}

Also like `Vector3`, we can omit the parameters to use default values, and again, the default is zero on all axes:

{{< code lang="js" linenos="false" caption="The `Euler` class: default parameters" >}}
const euler = new Euler();

euler.x; // 0
euler.y; // 0
euler.z; // 0
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of rotations
{{% /note %}}

#### Euler Rotation Order

By default, three.js will perform rotations around the $X$-axis, then around the $Y$-axis, and finally around the $Z$-axis, in an object's local space. We can change this using the [`Euler.order` property](https://threejs.org/docs/#api/en/math/Euler.order). The default order is called 'XYZ', but 'YZX', 'ZXY', 'XZY', 'YXZ' and 'ZYX' are also possible.

We won't get into rotation order further here. Usually, the only time you need to change the order is when dealing with rotation data from another app. Even then, this is usually taken care of by the three.js loaders. For now, if you like, you can simply think of `Euler` as a `Vector3`. Until you start to create animations or perform complex mathematical operations involving rotations, it's unlikely you'll run into any problems by doing so.

### The Unit of Rotation is Radians

{{% note %}}
TODO-DIAGRAM: add degrees and radian diagram
{{% /note %}}

You may be familiar with expressing rotations using **degrees**. There are $360^{\circ}$ in a circle, $90^{\circ}$ in a right-angle, and so on. The {{< link path="/book/first-steps/first-scene/#field-of-view-fov" title="perspective camera's field of view" >}}, which we encountered earlier, is specified in degrees.

However, **all other angles in three.js are specified using [_radians_](https://en.wikipedia.org/wiki/Radian) rather than _degrees_**. Instead of $360^{\circ}$ in a circle, there are $2\pi$ radians. Instead of  $90^{\circ}$ in a right-angle, there are $\frac{\pi}{2}$ radians. If you're comfortable using radians, great! As for the rest of us, we can use the [`.degToRad`](https://threejs.org/docs/#api/en/math/MathUtils.degToRad) utility to convert from degrees to radians.

{{< code lang="js" linenos="false" caption="Converting degrees to radians" >}}
import { MathUtils } from 'three';

const rads = MathUtils.degToRad(90); // 1.57079... = π/2
{{< /code >}}

Here, we can see that $90^{\circ}$ is equal to $1.57079...$, or $\frac{\pi}{2}$ radians.

### The _Other_ Rotation Class: Quaternions

{{% note %}}
TODO-LINK: Add link to quaternions chapter
{{% /note %}}

We mentioned above that three.js has two classes for representing rotations. The second, which we'll mention only in passing here, is the [`Quaternion` class](https://threejs.org/docs/#api/en/math/Quaternion). Along with the `Euler`, a `Quaternion` is created for us and stored in the `.quaternion` property whenever we create a new scene object such as a mesh:

{{< code lang="js" linenos="false" caption="An object's rotation is stored as an `Euler` angle" >}}
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();

// .. AND a Quaternion:
mesh.quaternion = new Quaternion();
{{< /code >}}

We can use **quaternions** and **Euler angles** interchangeably. When we change `mesh.rotation`, the `mesh.quaternion` property is automatically updated, and vice-versa. This means we can use Euler angles when it suits us, and switch to quaternions when it suits us.

Euler angles have a couple of shortcomings that become apparent when creating animations or doing math involving rotations. In particular, we cannot add two Euler angles together (more famously, they also suffer from something called gimbal lock). Quaternions don't have these shortcomings. On the other hand, they are harder to use than Euler angles, so for now we'll stick with the simpler `Euler` class.

For now, make a note of these two ways to rotate an object:

1. **Using Euler angles, represented using the `Euler` class and stored in the `.rotation` property.**
2. **Using quaternions, represented using the `Quaternion` class and stored in the `.quaternion` property.**

### Important Things to Know About Rotating Objects

Despite the issues we highlighted in this section, rotating object is generally intuitive. Here are a couple of important things to take note of:

{{% note %}}
TODO-LOW: if non-targeted DirectionalLight is ever added revisit
{{% /note %}}

1. Not all objects can be rotated. For example, {{< link path="/book/first-steps/physically-based-rendering/#introducing-the-directionallight" title="the `DirectionalLight` we introduced in the last chapter" >}} cannot be rotated. The light shines _from_ a position, _towards_ a target, and the angle of the light is calculated from the target's position, not the `.rotation` property.
2. Angles in three.js are specified using radians, not degrees. The only exception is the [`PerspectiveCamera.fov`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov) property which uses degrees to match real-world photography conventions.

## Transformation Matrices

We've covered a lot of ground in this chapter. We've introduced Cartesian coordinate systems, world space and local space, the scene graph, translations, rotations, and scaling and the associated `.position`, `.rotation`, and `.scale` properties, and three mathematical classes used for storing transformations: `Vector3`, `Euler`, and `Quaternion`. Surely we couldn't cram anything else in?

Well, just one more thing. We can't end a chapter on transformations without discussing [**transformation matrices**](https://en.wikipedia.org/wiki/Transformation_matrix). While vectors and Euler angles are (relatively) easy for us humans to work with, they are not efficient for computers to process. As we chase the elusive goal of sixty frames per second, we must walk a fine line between ease of use and efficiency. To this end, the translation, rotation, and scale of an object are combined into a single mathematical object called a matrix. Here's what the matrix for an object that has not been transformed looks like.

<section>
$$
\begin{pmatrix}
   1 & 0 & 0 & 0 \\
   0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

It has four rows and four columns, so it's a $4 \times 4$ matrix, and it's storing an object's complete transform which is why we refer to it as a **transformation matrix**. Once again, there is a three.js class to handle this type of mathematical object, called [`Matrix4`](https://threejs.org/docs/#api/en/math/Matrix4). There's also a class for $3\times3$ matrices called `Matrix3`. When the matrix has all ones on the diagonal and zeros everywhere else like the one above, we call it the **identity matrix**, $I$.

Matrices are much more efficient for your CPU and GPU to work with than the individual transforms, and represents a compromise that gives us the best of both worlds. We humans can use the simpler `.position`, `.rotation`, and `.scale`, properties, then, whenever we call `.render`,  the renderer will update each object's matrices and use them for internal calculations.

We'll spend a bit of time here going into how transformation matrices work, but if you're allergic to math, it's absolutely fine to skip this section (for now). You don't need a deep understanding of how matrices work to use three.js. You can stick with using `.position`, `.rotation`, and `.scale` and let three.js handle the matrices. On the other hand, if you're a mathematical wizard, working directly with the transformation matrix opens up a whole new range of opportunities.

### The Local Matrix

Every object has, in fact, not one, but two transformation matrices. The first of these is the **local matrix**, which holds the combined `.position`, `.rotation`, and `.scale` of an object. The local matrix is stored in the [`Object3D.matrix`](https://threejs.org/docs/#api/en/core/Object3D.matrix) property. Every object that inherits from `Object3D` has this property.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="When we create a mesh, a local transformation matrix is created automatically" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates a Matrix4 for us:
mesh.matrix = new Matrix4();
```
{{< /code >}}

At this point, the matrix will look like the identity matrix above, with ones on the diagonal and zeros everywhere else. If we change the position of the object, and then force the matrix to update:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changes to the transform of an object are reflected in the local matrix" >}}
``` js
mesh.position.x = 5;

mesh.updateMatrix();
```
{{< /code >}}

... now, the local matrix of the mesh will look like this:

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 5 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Normally, we don't need to call `.updateMatrix` manually, since the renderer will update the matrix of every object before it's rendered. Here, though, we want to see the change in the matrix immediately so we must force an update.

If we change the position on all three axes and update the matrix again:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changing the object's translation and then updating the matrix" >}}
``` js
mesh.position.x = 2;
mesh.position.y = 4;
mesh.position.z = 6;

mesh.updateMatrix();
```
{{< /code >}}

... now we can see that translations are stored in the first three rows of the last column of the matrix.

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 2 \\
  0 & 1 & 0 & 4 \\
  0 & 0 & 1 & 6 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Next, let's do the same for scale:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changing the object's scale and then updating the matrix" >}}
``` js
mesh.scale.x = 5;
mesh.scale.y = 7;
mesh.scale.z = 9;

mesh.updateMatrix();
```
{{< /code >}}

... and we'll see that the scale values are stored on the diagonals.

<section>
$$
\begin{pmatrix}
  5 & 0 & 0 & 2 \\
  0 & 7 & 0 & 4 \\
  0 & 0 & 9 & 6 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Great! That means we can write a formula for storing translation and scale in a transformation matrix. If we write the translation values as $T_{x}, T_{y}, T_{z}$, and the scale values as $S_{x}, S_{y}, S_{z}$:

{{< code lang="js" linenos="false" hl_lines="" caption="" >}}
``` js
mesh.position.x = Tx;
mesh.position.y = Ty;
mesh.position.z = Tz;

mesh.scale.x = Sx;
mesh.scale.y = Sy;
mesh.scale.z = Sz;
```
{{< /code >}}

... now the transformation matrix looks like this:

<section>
$$
\begin{pmatrix}
  S_{x} & 0 & 0 & T_{x} \\
  0 & S_{y} & 0 & T_{y} \\
  0 & 0 & S_{z} & T_{z} \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Finally, let's see how rotation is stored. First, let's reset the position and scale:

{{< code lang="js" linenos="false" hl_lines="" caption="Reset the position and scale" >}}
``` js
mesh.position.set(0, 0, 0);
mesh.scale.set(1, 1, 1);
mesh.updateMatrix();
```
{{< /code >}}

Now the matrix will look like the identity matrix again, with ones on the diagonal and zeros everywhere else. Next, let's try a thirty degree rotation around the $X$-axis:

{{< code lang="js" linenos="false" hl_lines="" caption="Thirty degree rotation around the $X$-axis" >}}
``` js
mesh.rotation.x = MathUtils.degToRad(30);

mesh.updateMatrix();
```
{{< /code >}}

... then the matrix will look like this:

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & 0.866\dots & 0.5\dots & 0 \\
  0 & -0.5\dots & 0.866\dots & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Hmmm... weird. However, this makes more sense when we see the following equations:

<section>
$$
\begin{aligned}
\cos(30) &= 0.866\dots \\
\sin(30) &= 0.5
\end{aligned}
$$
</section>

So, this matrix is actually:

<section>
$$
\text{X-Rotation} = \begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & \cos(30) & \sin(30) & 0 \\
  0 & -\sin(30) & \cos(30) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Unfortunately, this is not nearly as intuitive as the transform and scale examples above. However, once again we use it to write a formula. If we write the rotation around the $X$-axis as $R_{x}$, here's the formula for rotation around the $X$-axis:

<section>
$$
\text{X-Rotation} = \begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & \cos(R_{x}) & \sin(R_{x}) & 0 \\
  0 & -\sin(R_{x}) & \cos(R_{x}) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Similarly, here's the formula for rotation around the $Y$-axis, $R_{y}$:

<section>
$$
\text{Y-Rotation} = \begin{pmatrix}
  \cos(R_{y}) & 0 & \sin(R_{y}) & 0 \\
  0 & 1 & 0 & 0 \\
  -\sin(R_{y}) & 0 & \cos(R_{y}) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

And finally, rotation around the $Z$-axis, $R_{z}$:

<section>
$$
\text{Z-Rotation} = \begin{pmatrix}
  \cos(R_{z}) & -\sin(R_{z}) & 0 & 0 \\
  \sin(R_{z}) & \cos(R_{z}) & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

### The World Matrix

As we've mentioned a few times, what's important to us is the final position of an object in world space, since that's what we see once the object is rendered. To help with calculating this, every object has a second transformation matrix, the **world matrix**, stored in  [`Object3D.matrixWorld`](https://threejs.org/docs/#api/en/core/.matrixWorld). There's no difference, mathematically, between these two matrices. They're both $4 \times 4$ transformation matrices, and when we create a mesh or any other scene object, both the local and world matrices are created automatically.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="When we create a mesh, both local and world matrices are created automatically" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates the local matrix and the world matrix
mesh.matrix = new Matrix4();
mesh.matrixWorld = new Matrix4();
```
{{< /code >}}

**The world matrix stores the position of the object in world space**. If the object is a direct child of the scene, these two matrices will be identical, but if the object resides somewhere further down the scene graph, the local and world matrices will most likely be different.

To help us understand this, let's look at our [objects $A$ and $B$ from earlier](#working-with-the-scene-graph) once again:

{{< code lang="js" linenos="false" hl_lines="" caption="" >}}
``` js
const scene = new Scene();
const meshA = new Mesh();
const meshB = new Mesh();

// A starts at (0,0,0) in world space
scene.add(meshA);

// B starts at (0,0,0) in A's local space
meshA.add(meshB);

// move A relative to its parent the scene
meshA.position.x = 5;

// move B relative to its parent A
meshB.position.x = 3;

meshA.updateMatrix();
meshA.updateMatrixWorld();

meshB.updateMatrix();
meshB.updateMatrixWorld();
```
{{< /code >}}

{{% note %}}
TODO-LOW: make sure that .render updates both matrices
TODO-DIAGRAM: add diagram of A and B in the scene graph
{{% /note %}}

Once again, we must force the matrices to update. Alternatively, you could call `.render` and the matrices of all objects in the scene will be automatically updated.

If you recall from earlier, we calculated the final positions of $A$ and $B$ in world space and found that $A$ is at $(5, 0, 0)$, while $B$ ends up at $(8, 0, 0)$. Let's examine how this works for each object's local and world matrices. First up is $A$'s local matrix.

<section>
$$
A_{local} = \begin{pmatrix}
1 & 0 & 0 & 5 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

As we saw above, the position of an object on the $X$-axis is stored in the last column of the top row of its local matrix. Now, let's look at $A$'s world matrix:

<section>
$$
A_{world} = \begin{pmatrix}
1 & 0 & 0 & 5 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

Since $A$ is a direct child of the scene, the local and world matrices are identical. Now, let's take a look at $B$. First, the local matrix:

<section>
$$
B_{local} = \begin{pmatrix}
1 & 0 & 0 & 3 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

And finally, here is $B$'s world matrix:

<section>
$$
B_{world} = \begin{pmatrix}
1 & 0 & 0 & 8 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

This time, the local and world matrices are different since $B$ is not a direct child of the scene.

### Working with Matrices Directly

Hopefully, this brief introduction has taken away some of the mystery of how matrices work. They are not as complicated as they look, rather, they are just a compact way of storing lots of numbers. However, keeping all those numbers in mind takes some practice, and doing calculations involving matrices by hand is tedious. Fortunately, three.js comes with many functions that allow us to work with matrices with ease. There are obvious functions like add, multiply, subtract, as well as functions to set and get the translation, rotation, or scale components of a matrix, and many others.

Working with the matrix directly, rather than setting `.position`, `.rotation`, and `.scale` separately is almost never _required_, but it does allow for powerful manipulations of an object's transform. Think of it like a superpower that you'll unlock once you level up your three.js skills enough.

When used together, all of the properties we've encountered in this chapter - `.position`, `.rotation`, `.scale`, `.quaternion`, `.matrix`, and `.matrixWorld` - have tremendous expressive power, and enable you to create scenes like an artist with a paintbrush.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Every scene object has many properties for transformation" >}}
``` js
// when we create a mesh,
// or any other object derived from Object3D
// such as lights, camera, or even the scene itself
const mesh = new Mesh();

// ... internally, three.js creates
// many different objects to help us transform the object
mesh.position = new Vector3();
mesh.scale = new Vector3();
mesh.rotation = new Euler();

mesh.quaternion = new Quaternion();
mesh.matrix = new Matrix4();
mesh.matrixWorld = new Matrix4();
```
{{< /code >}}

Learning how to use the `.position`, `.rotation`, and `.scale` is a fundamental skill that you need to work with three.js. However, learning to use the `.quaternion` and transformation matrices is an advanced skill that you don't need to master immediately.

## Challenges

{{% aside success %}}

### Easy

1. Open up the _**cube.js**_ module and experiment with `cube.position`, `cube.rotation`, and `cube.scale`.

2. Open up the _**lights.js**_ module and experiment with `light.position`. Note how `light.rotation` and `light.scale` have no effect.

3. Experiment with `camera.position` and `camera.rotation` in the _**camera.js**_ module. Note how `camera.scale` has no effect.

{{% /aside %}}

{{% aside %}}

### Medium

1. Create a second mesh called `meshB`. Make it a different color or a different shape so you can recognize it. [Add this new mesh as a child of the first mesh](#nesting-coordinate-systems). Start with one axis - perhaps the $X$-axis - and adjust the position of each mesh. Try and guess where both meshes will end up when you do so. Notice how translations are _additive_. If you translate both meshes five units, the child will move a total of ten units.

2. Now try setting the rotation of both meshes. Again, start by constraining yourself to a single axis. Once again, note that rotations are additive. If you rotate the parent $45^{\circ}$, and the child $45^{\circ}$, the final rotation of the child will be ninety degrees. Remember to use `MathUtils.degToRad` to convert degrees to radians.

3. Finally, try setting the scale of both meshes. This time, note that scales are _multiplicative_. If you scale the parent mesh by two and the child by four, the child will grow to eight times its initial size.

_Note: you can add the second mesh to the first mesh in **cube.js**:_

{{< code lang="js" linenos="false" caption="_**cube.js**_: creating a second mesh" >}}
const cube = new Mesh(geometry, material);
const cubeB = new Mesh(geometry, material);

cube.add(cubeB);
{{< /code >}}

{{% note %}}
TODO-LOW: code block above has messed up indentation
{{% /note %}}

{{% /aside %}}

{{% aside warning %}}

### Hard

1. If you're familiar with radians, try doing the above exercises without the `.degToRad` method. {{< link path="/book/appendix/javascript-reference/#the-math-object" title="You can access $\pi$ in JavaScript using `Math.PI`" >}}.

{{% /aside %}}
