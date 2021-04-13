---
title: "Understanding Geometry"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 1000
chapter: "10"
---

# Understanding Geometry

{{< inlineScene entry="first-steps/8.0-banner.js." class="round" >}}

Over the last couple of sections, we've been gradually building up a thorough understanding of what makes objects in three.js tick, especially mesh objects. In [Section Three](/book/helpers-inheritance/), we learned all about how to position objects in our scenes, including how the scene graph works, and how transformations, coordinate systems and so on are used to translate, rotate and scale our objects within the scene. Then, over the course of section Five ([Lighting and Shadows](/book/lights-shadows/)), Six ([Built-In Materials](/book/materials/)), and Seven ([Working with Texture](/book/textures/)), we thoroughly covered the process by which three.js simulates the interaction of light with the surface of these objects.

In this section, we'll look beneath the surface to see how the underlying shape, or **geometry**, of these objects is defined.

At any point, you can view this geometry yourself by setting `material.wireframe = true`, as we've done for the horse model above.

### Geometry and BufferGeometry - Which One Should You Use?

One thing you'll need to be aware of is that three.js has two types of geometry. The older variety is called [Geometry](https://threejs.org/docs/#api/en/core/Geometry), while the slicker, newer, faster, smoother type is called [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry). Hopefully, the excessive use of comparative adverbs in the previous sentence has given you some idea of which one you should use!

The older `Geometry` is slower, and we should consider `BufferGeometry` to be the default. The `GLTFLoader` and all the other loaders, will always create buffer geometries for us. If you look in the docs, you'll see that all the built-in shapes come in two forms, such as [BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) and [BoxBufferGeometry](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry). You should always choose the buffer geometry form.

## Chapter 8.1 [Basic Geometry Concepts: Vertices, Normals, and UVs](/book/geometry/geometry-concepts/)

The basic component, or attribute, of a geometry is a **Vertex**, which defines the $x$, $y$, and $z$ coordinates of a point in 3D space. Other attributes such as **normals** and **UV coordinates** are built on top of vertices. What we mean by this is, that you can have a vertex with no other attributes in the geometry (just a point in space), but other attributes must be attached to an existing vertex - you can't have a normal or UV coordinate without a corresponding vertex.

There are three types of geometric objects available in three.js.

1. the [Point](https://threejs.org/docs/#api/en/objects/Points), which put the geometry's vertices in **groups of one**, and draws one point for each vertex. Points are used to create particle systems, for things like rain, dust, stars, flames and so on
2. [Line](https://threejs.org/docs/#api/en/objects/Line), [LineLoop](https://threejs.org/docs/#api/en/objects/LineLoop), and [LineSegments](https://threejs.org/docs/#api/en/objects/LineSegments), which put the geometry's vertices in **groups of two**, drawing a straight connecting line between each set of two vertices. If we add enough vertices, these straight lines become very tiny and can look like a curved line. Most of the helper objects that we looked at back in [Ch 3.3: Visualizing the Invisible](/book/helpers-inheritance/helpers/) are made up of these type of objects
3. [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) and [SkinnedMesh](https://threejs.org/docs/#api/en/objects/SkinnedMesh), which consider the vertices in **groups of three**, drawing a triangle on screen for each group. Again, if we make the triangles small enough the mesh can look smooth and curvy, and we can do some tricks with lighting to make surfaces made up of quite large triangles look curved

We'll consider Points in Section 15 and Lines in Section 9

We've been using `Mesh` a lot so far, and in this section, we'll continue to do so since they are the most common types of visual object that we'll use.

`SkinnedMesh` is used for skeletal animation, and we'll take a look at it in [Section 12: Animating Your Scenes](/book/animation/). It's derived from the `Mesh` class, so everything that we learn here will apply to `SkinnedMesh` as well.

## Chapter 8.2 [Creating A Custom Geometry](/book/geometry/custom-geometry/)

Now that we understand how geometries work, we can build our own! We'll start with some very basic shapes like flat squares, then move on to adding normals and UV maps and creating more complex shapes.

Finally, we'll demonstrate how to add a seam, or crease, to our geometry, such as the sharp edges of a cube. This is one of those things that seem like they should be easy, but turn out to require some extra work.


