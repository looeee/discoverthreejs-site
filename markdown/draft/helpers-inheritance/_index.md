---
title: "Components, Helpers, and Inheritance"
description: "In this section we'll take a look at the Object3D base class, and see how inheritance works in three.js, as well as examining how the scene graph works and introducing some helper objects"
date: 2018-04-02
sectionHead: true
weight: 300
chapter: "3"
---

# Components, Helpers, and Inheritance

{{< figure src="first-steps/inheritance.svg" alt="Inheritance" class="banner" >}}

**Welcome to Section three!**

In Section One, we introduced you to all the basic ideas and terminology you needed to get started with making 3D web applications, and using the simplest HTML, CSS and JavaScript possible we created a series of basic 3D scenes, working our way up to loading model and animations in glTF format. It was a lot of fun.

Then, in Section Two, we stepped up our JavaScript game in a big way, fully engaging with next-gen, ES6+ style JavaScript and with this we created a reusable `App` class which allows us to set up a three.js project in just one or two lines. It may have been a little less fun, but with that out of the way, we can get back to being creative and digging into how 3D scenes work.

Moving onto to Section Three, we'll look deeply into the inner workings of three.js itself, as well as the mathematical helper objects that come with the library and finally, how to use JavaScript Event Listeners to add interactivity to our scenes.

Here's what's coming up over the next couple of chapters:

## Chapter 3.1 [The Object3D Base Class and Inheritance in three.js](/book/helpers-inheritance/object3d-and-inheritance/)

The three.js core is split up into two rough categories: things we can add to the scene using `scene.add( object )`, such as meshes, lights, cameras, and groups, and things that we can't, such as materials, geometries, and the `WebGLRenderer`.

Everything that falls into the first category, including the `Scene` itself, **inherits** from the [`Object3D`](https://threejs.org/docs/#api/en/core/Object3D) base class. If you take a look at docs pages for any of these **derived**, or **child**, classes, such as [`Mesh`](https://threejs.org/docs/#api/en/objects/Mesh), you see this at the top of the page:

$$Object3D \rightarrow$$

This means that the `Mesh` class can use all the properties and methods outlined on its docs page **and** everything outlined on the `Object3D` page as well! Although care should be taken since if something is mentioned on both pages, that means it has been overwritten or extended on in the child class.

It's possible for there to be multiple levels of inheritance - for example, if we look at the top of the [`SkinnedMesh`](https://threejs.org/docs/#api/en/objects/SkinnedMesh) page, we'll see this:

$$Object3D \rightarrow Mesh \rightarrow$$

which means that `SkinnedMesh` inherits from `Mesh` and thus from `Object3D` as well in a process known as the **inheritance chain**. We'll note here that to be completely technically accurate, in JavaScript we should be calling this a [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) - however since this is not a JavaScript book we'll avoid talking about prototypes and get on with making pretty 3D scenes instead.

It's not just `Object3D` that is used as a **base class** - for example, all the buffer geometry objects such as the `BoxBufferGeometry` inherit from the base `BufferGeometry` class, and sure enough, if we look at the top of any of their [docs pages](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry) we'll see this:

$$BufferGeometry \rightarrow$$

Make sure that you pay attention to this inheritance chain whenever you're using the docs to ensure you are aware of the full range of properties and methods of the class that you're looking at!

In this chapter, we'll cover everything that you need to know about inheritance in three.js, paying special attention to the `Object3D` base class.

## Chapter 3.2 [The Scene Graph and the Scene Object](/book/helpers-inheritance/scene-graph/)

Scenes in three.js are structured using the [Scene Graph](https://en.wikipedia.org/wiki/Scene_graph) concept, which is a basic tree-like structure.

{{< figure src="helpers-inheritance/scene_tree.svg" alt="The three.js Scene Graph" title="The three.js Scene Graph" lightbox="true" >}}

We looked at this briefly back in [Ch 1.1: Hello, Cube!](/book/first-steps/first-scene/#the-scene), where we introduced the `scene.add( child )` and `scene.remove( child )` methods and mentioned that there are similar functions on other objects, such as `mesh.add()`, `camera.add()`, `light.remove()` and so on. Now that we understand how inheritance works, we can see that this is because all of these inherit from `Object3D`, and all of these add and remove methods are actually just the `Object3D.add()` and `Object3D.remove()` methods being passed up the inheritance chain.

While the scene graph is a simple structure, mathematically speaking, it's worth taking the time to make sure that we understand it very well since it's such an integral part of every three.js scene.

We'll also spend some time in this chapter talking about matrices (specifically, 4x4 [Transformation Matrices](https://threejs.org/docs/#api/en/math/Matrix4)), without going too deeply into the mathematics. Each object has a couple of different matrices associated with it, and each matrix stores the complete transformation information of the object in a particular coordinate system - that is, the location, rotation, and scale of the object, at a given moment in time.

There are three different coordinate systems needed by each object in the scene graph (plus a couple of extras for the camera), each with an associated transformation matrix:

1. [Object3D.matrix](https://threejs.org/docs/#api/en/core/Object3D.matrix) stores the transformation of an object in its own local coordinate system - that is, the way an object (and its children) is transformed _relative to itself_, without taking parents into position.
2. [Object3D.matrixWorld](https://threejs.org/docs/#api/en/core/Object3D.matrixWorld) stores the transformation of the object within the world, or in other words, where it's located in the scene
3. [Object3D.modelViewMatrix](https://threejs.org/docs/#api/en/core/Object3D.modelViewMatrix) stores the location of the object relative to the camera

The coordinate systems represented by these three matrices are usually called **local space**, **world space**, and **camera space**.

The first two, local space and world space, are required to specify the position of the object within the scene graph, and the third, camera space, describes the position of the object relative to the camera.

We generally only need to ever directly use the first two since the camera space is calculated and updated automatically for us by the renderer.

We're calling these matrices transformation matrices since they store the objects transform, within their respective coordinate systems.

In particular, the `object.position`, `object.rotation`, `object.scale`, and `object.quaternion` (which is another way of expressing the rotation)  are all relative to the local coordinate system, so they get stored in the local `.matrix`.

We'll explain all of this in much more detail in this chapter.

## Chapter 3.3 [Visualizing the Invisible: Helper Gizmos](/book/helpers-inheritance/helpers/)

We'll end up using quite a few mathematical objects in our careers as three.js developers. This can sometimes be difficult since these objects are often just conceptual - that is, we'll use them to move things around in 3D space, and we can see their effects, but we cannot see the objects themselves.

Fortunately, three.js comes with a whole menagerie of mathematical helper objects, and we'll take a look at most of them here.

<figure>
  <video id="vid" width="800" height="500" autoplay loop>
    <source src="/static/images/helpers-inheritance/ch3.3.mp4" type="video/mp4">
  </video>
</figure>

<script>
window.addEventListener( 'click', function() {
  document.getElementById('vid').play();
} );
window.addEventListener( 'touch', function() {
  document.getElementById('vid').play();
} );
window.addEventListener( 'scroll', function() {
  document.getElementById('vid').play();
} );
</script>

