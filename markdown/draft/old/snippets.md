---
title: "Snippets"
description: "We'll cover how to add a function automatically resize our scene when the browser window changes size here"
date: 2018-04-02
weight: 304
chapter: "99.0"
draft: true
---

# POINT VERSUS VECTOR

{{% aside %}}
Mathematically speaking, vertex positions are **points**, while normals are **vectors**. These both look the same - they both consist of `(x, y, z)` components and can be written as `(1, 2, 3)`, `(1,1,1)`, `(5,6,7)` etc.

A point has a position in space but no direction or magnitude (size), while a vector has a direction and magnitude but no position.

In general, we'll infer the difference between the two from context. When we are writing them down, we can draw an arrow over the vector like this: $ \vec{v} $

Since there is no way to do that in our code, in some situation we may add a fourth component, either a 0 for a point or a 1 for a vector. However, this is only done when absolutely necessary since we may using millions of vertices and that extra 1 or zero for each would really add up.

{{< figure src="first-steps/point_vector.svg" alt="A point and a vector" >}}

{{% /aside %}}


# animation

You might be experiencing slow down in your app, and on testing find that your **frame budget** is divided up like this:

* 10ms creating new objects
* 1ms getting user input
* 2ms updating animations
* 8ms rendering

This is a total of 21ms, so your app is over budget and you will not get 60fps. It's pretty clear here that the problem is that you are creating too many new objects every frame, and you'll need to think about how to restructure your app to avoid that. Perhaps you could create a collection ( or **pool**) of objects at the start, and then reuse them?

Testing your app in this way is called **profiling**, and there are lots of tools in your browser's Developer Console to help with this.

# Scene

You can think of your scene as a tree diagram, with the `Scene` at the root node, and things like Meshes and Lights as branches. We'll add the Mesh to the scene using the `Scene.add( child )` method.

Once you have added the mesh to the scene, the mesh is called a _child_ of the scene, and the scene is called the _parent_ of the mesh. The mesh itself can also be a parent and have children, and the scene graph can grow to be extremely large in size.

{{< figure src="first-steps/scene_tree.svg" alt="Mesh attached to the scene" class="small right" lightbox="true" >}}

Take a look at the diagram - notice that each object can have only one parent, but a parent can have many children, and every object in the tree (_including_ the scene itself) can be both a parent and a child. When you move an object around in 3D space, all of its children will move with it. Also, if you _add_ an object to a new parent, it will be _removed_ from its old parent.

Every object in the tree has an `.add( child )` and a `.remove( child )` method, which we can use to create and make changes to the tree. So, there is `Scene.add( child )`, `Scene.remove( child )`, `Mesh.add( child )`, `Mesh.remove( child )`, `Light.add( child )`, `Light.remove( child )` - and lots of other objects have these methods too, as we'll see later.

{{% aside success %}}
Note that we haven't added the camera to the scene. In general, the camera sits outside the scene graph, even though it does have a position and we can move it around.

However, there are `Camera.add( child )` and `Camera.remove( child )` methods, and we _can_ add it to the scene. One common pattern that we'll investigate in [Chapter 1.5](/book/first-steps/camera-controls/) is to _add_ the camera as a child of the scene and then _add_ a light as a child of the camera. When we move the camera around, the light attached to it will move too, ensuring that everything we look at through the camera is illuminated, much as if we had strapped a torch to the side of it.
{{% /aside %}}

{{% aside warning %}}
#### Don't Move the Scene!
When you create the scene, it's positioned at the point `(0, 0, 0 )`. Things will be _much_  simpler if you leave it there.

The scene is an object and has a position, rotation and scale, just like any other object. But since everything is positioned relative to the scene things can quickly spiral out of control if you move it.
{{% /aside %}}

# RepaintRate

### Repaint Rate, Frame Rate, Refresh Rate and Hz

The important term in the above definition is **next repaint** and we'll take a few moments now to understand what that means.

The browser will attempt to refresh the page, at most, at the same refresh rate as the screen it is being displayed on. This means that if you are viewing your app on a standard issue 2018 monitor, you will get a **maximum repaint rate** of 60 repaints per second. You can consider the following terms to mean the same thing, although there are technical differences:

* `maximum repaint rate`
* `refresh rate of your monitor` in `Hz`/`hertz`
* `maximum frame rate`

Hertz or Hz for short, is a unit which means 'number of times per second'.

So, our standard issue computer monitor has a refresh rate of 60Hz. The image on the screen is redrawn 60 times per seconds, always - even if nothing has changed, the image is still redrawn.

This means that once we set up our animation using `requestAnimationFrame`, our app will _attempt_ to draw a new frame 60 times per second. Depending on the complexity of your app, and the speed of your computer, it may or may not succeed - if the frame is not ready in time, it will simply redraw it at the next available refresh interval instead.

In the meantime, the previous frame will be drawn on the screen again, which can cause a jerky effect called **jank**.

Other monitors or TVs may have different refresh rates - a typical TV (even a mid-range modern one) is likely to have a refresh rate of 24Hz or 30Hz, while a super fancy new 3D capable monitor may have a refresh rate of 120Hz or even 240Hz. Newer phones may also have a 120Hz refresh rate.

What does all of this mean for us as animators?

### Time based animation, not Frame Based Animation

The upshot of all of this is that you should never base your animation on frame rate - i.e., you should never make your character move 1/100th of a step each frame, because on your laptop this may look fine, but on my 3-year-old Android phone the character will be moving in horrible jerky slow motion, while on your friend's uber gaming battlestation with fancy curved 240Hz monitor, the animations will be happening at 4 times the desired speed.

Base your animations on how much _time_ has passed instead and your animations will stay in sync, even if your app suffers some slowdown.

It won't matter if your app is running at 15 frames per second, or 30, or 60, or 240, or even if it's jumping wildly between those values, if you calculate how much time has passed since the last frame and update your character's movement by that instead.

We'll explore how to do this using {{< externalLink src="https://threejs.org/docs/#api/core/Clock" name="THREE.Clock()" >}} later.

{{% aside success %}}
#### Definition: Frame Budget

The **frame budget** is an equally important concept for both traditional 2D websites and 3D WebGL apps.

Our goal is for our app to run at a silky smooth 60 frames per second. Dividing each second into 1000 milliseconds, we can calculate that to achieve 60 frames per second, the amount of time that we have to spend on each frame $1000 / 60 = 16.66 ms$. That is, we have just over 16 milliseconds to calculate each frame. This 16ms is called our **frame budget**.

On modern hardware, we can get a lot done in this tiny fraction of a second. However, we do need to keep track of it, and for that you'll use a form of testing called **profiling**. There are lots of tools in your browser's Developer Console to help with this, and we'll explore this further in **Section 8: Animation**.

Of course, getting your app within its frame budget on one device doesn't mean that it will be within it on another. You will have to decide on target hardware, make sure that your app runs reasonably well there, and accept that there will be people lower powered devices who cannot experience complex 3D web apps smoothly.
{{% /aside %}}

# animation loop


We'll also create a new function called `start()` to start this loop, and we'll call `start()` at the end of our `init()` function to get things running.

To stop the animation loop, you can just pass `null` as the callback function. We'll put this inside a function called `stop()`. Now, whenever we want to start the app, we can call `start()`, and whenever we want to stop it, we can call `stop()`.


# Math


When you call the `camera.updateProjectionMatrix` method, the frustum's shape is recalculated and the information is stored in a special matrix called the {{< externalLink src="https://threejs.org/docs/#api/cameras/Camera.projection" name="projectionMatrix" >}}.


{{% aside success %}}
#### Matrix? I Thought That Was a Film?

Just like _quantum_, **matrix** is a word that has gained a lot of popularity with people who have no idea what it means but think that it sounds cool. Which is fine, because, well, it _does_ sound cool.

However, as you study three.js you are going to come across matrices quite a bit, so we need a better understanding of what they are. At their most basic, matrices are structured ways of storing and working with collections of numbers.  We'll describe them based on their **number of rows** X **number of columns**. This is a 2x2 matrix:

$$
\begin{pmatrix}
  a & b \cr
  d & e
\end{pmatrix}
$$

Here is a 3X3 matrix:

$$
\begin{pmatrix}
  a & b & c \cr
  d & e & f \cr
  g & h & i
\end{pmatrix}
$$

Here is a special matrix that is known as the 3X3 _identity matrix_

$$
\begin{pmatrix}
  1 & 0 & 0 \cr
  0 & 1 & 0 \cr
  0 & 0 & 1
\end{pmatrix}
$$

All of these matrices have the same number of rows and columns, and this type of matrix is known as a **square matrix**.

The **identity matrix** takes the place of the number 1 in matrix mathematics, at least as far as multiplication goes. If you multiply a matrix **A** by the identity matrix **I**, then you get the matrix A back. That means **A x I = A**, just as **4 x 1 = 4**.

$$
\begin{pmatrix}
  a & b & c \cr
  d & e & f \cr
  g & h & i
\end{pmatrix} \times \begin{pmatrix}
  1 & 0 & 0 \cr
  0 & 1 & 0 \cr
  0 & 0 & 1
\end{pmatrix} = \begin{pmatrix}
  a & b & c \cr
  d & e & f \cr
  g & h & i
\end{pmatrix}
$$

Here is a 4x4 version of the identity matrix

$$
\begin{pmatrix}
  1 & 0 & 0 & 0 \cr
  0 & 1 & 0 & 0 \cr
  0 & 0 & 1 & 0 \cr
  0 & 0 & 0 & 1 \cr
\end{pmatrix}
$$

We'll only ever be dealing with 3x3 and 4x4 matrices - nearly every single matrix used by three.js is a special type of 4x4 matrix called a **transformation matrix**. This type of matrix is used to combine information about how we've **transformed** our objects - that is, how much we've **translated** (or moved), **rotated**, or **scaled** them.
{{% /aside %}}

# Textures

#### It Appears That Every Vertex Can Be Mapped to Multiple UV Coordinates as Well

For example, the front top left vertex `(-1, 1, 1)` appears to be mapped to `(0, 1)` on the front and top of the cube, and `(1, 1)` on the left side. But not so! **Each vertex must be mapped to at most one unique UV coordinate.** It turns out that while a cube is simple shape for us to think about, when it comes to UV mapping, hard edges are actually quite difficult. In the case of our cube, to get around this problem, every vertex of the cube is duplicated 3 times and the cube is actually made up of 24 vertices, not 8! This way we can correctly map the textures to all sides of the cube. Don't worry if this is making your head spin, since the vertices are just duplicates you can still treat the cube as if it has just 8 vertices and everything except for UV mapping will work out as normal.



# Maths
### Reflection

There is one final affine transformation that we haven't mentioned yet: _reflection_.

However, we can write a reflection as a negative scale combined with translation, so we don't consider them seperately.
That is, if we want to reflect an object over the X-axis, we do this by setting `object.scale.x = -1` and `object.position.x = -object.position.x`

### Definition: Affine Transformation

Any transformation where straight lines stay straight, and parallel lines remain parallel, is called an affine transformation.

{{< figure src="first-steps/affine_nonaffine_trans.svg" alt="Affine and non-affine transformations" lightbox="true" >}}

There are a few that reasons we like these affine transformations so much.

The first is that **translation**, **rotation** and **scaling** are all affine transformations, and we use these a lot to position our objects in 3D space.

Any combination of these is also an affine transformation. This means that we can take an object, rotate it, scale it, rotate it again, translate it, scale it and rotate it a final time and be certain that we can combine all of these into a single affine transformation.

The next reason is that they can all be stored in a special kind of matrix called a **4x4 transformation matrix**. These matrices can be easily combined and reused, multiplied and added together. When we talk about combining affine transformations, we mean that we can take any combination of rotation, translation, and scaling, and combine them into a single transformation matrix.

For now, remember that the `.position`, `.rotation` and `.scale` properties of an object get combined into a single `.matrix` property - the so-called **local transform**, which describes where an object is relative to its parent.

Finally, affine transformations are (generally) undo-able, or **invertible** in mathematical language. We know that as long as we stick with this type of transformation, we can always get back to where we started from.

# uv mapping

{{% aside success %}}
### Take a Few Minutes to Examine the Texture and the Way That It Maps onto the Cube Now

Take particular notice of the following:

#### We Have Only Defined Uv Coordinates for the Corners of the Cube but the Texture Is Being Mapped Across the Whole Face of the Cube

A technique called {{< externalLink src="https://en.wikipedia.org/wiki/Interpolation" name="Interpolation" >}} is being used to map the points on the interior of the texture to points in between the  vertices of the cube - for example, here the point UV coordinate $(0.5,0,5)$ is being mapped to the 3D point $(0,0,1)$ on the front face of the cube, even though we have not specified any mapping for that point.

#### UV Coordinates on Our Texture Can Be Mapped to Multiple Vertices on the Geometry

For example, we can map the UV coordinate $(0, 0)$ to as many different vertices as we wish. We could even map it to every vertex! Since the bottom left pixel of the texture is black, doing this would make the entire cube black.

#### It Looks like Vertices Can Be Mapped to Multiple UUV Coordinates Too

At first glance, it looks like vertices can be mapped to multiple UV coordinates. For example, if you zoom into the vertex $(-1, 1, 1)$ at the top of the cube, you'll see this:

{{< figure src="first-steps/uv_vertex_zoom.png" alt="UV mapping of cube corner detail" lightbox="true" class="small" >}}

It certainly looks like this vertex is being mapped to three separate UV coordinates. However, that's not allowed - each vertex must map to a single UV coordinate. To get around this, whenever there is a hard edge in your geometry  (usually called a **Seam** or a **Crease**) - such as the edges of the cube here - the vertices get duplicated.

This means that the vertex $(-1, 1, 1)$ needs to be duplicated three times. We'll call these vertices $(-1, 1, 1)\_{a}$, $(-1, 1, 1)\_{b}$ and $(-1, 1, 1)\_{c}$. Once we've done that, we can create the mappings that we need:

$$
\begin{aligned}
  ( 0, 0 ) &\longrightarrow (-1, 1, 1)\_{a} \cr
  ( 0, 1 ) &\longrightarrow (-1, 1, 1)\_{b} \cr
  ( 1, 1 ) &\longrightarrow (-1, 1, 1)\_{c} \cr
\end{aligned}
$$

Don't worry about this too much for now, since our trusty `BoxBufferGeometry` has taken care of duplicating the vertices automatically for us. We'll come back to it in **Section 6**.

{{% /aside %}}


# Rotations intro
{{% aside %}}
#### `Mesh.Rotation` is Not a `Vector3`!

`Mesh.position` and `Mesh.scale` are both stored in a `Vector3`, and we can set the `rotation.x`, `rotation.y`, and `rotation.z` components as well as using `rotation.set`, so it would be natural to assume that `Mesh.rotation` is also a `Vector3`, but that's not the case!

For a number of reasons, rotation in 3D space is more complex than translation or scaling and needs to be treated differently. For a start, the units of rotation are **radians**, while scaling and translating both use standard three.js units, which are meters.

For this reason, there are {{< externalLink src="https://threejs.org/docs/#api/en/math/Euler" name="Euler" >}}

{{< externalLink src="https://threejs.org/docs/#api/en/math/Quaternion" name="Quaternion" >}}

{{% /aside %}}

{{% aside warning %}}
**Rotation is not stored in a `Vector3`!**

It's actually stored a special mathematical class representing {{< externalLink src="https://threejs.org/docs/#api/en/math/Euler" name="Euler angles" >}}.

However, we can still use `rotation.set`, and it has `.x`, `.y`, and `.z` properties, just like a `Vector3`, so for now you don't need to worry to much about the differences. We'll come back to this later.
{{% /aside %}}
