---
title: "The Built-In Materials"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 800
chapter: "8"
---

# The Built-In Materials

{{< figure src="materials/banner.jpg" alt="Materials and textures" class="banner" >}}

In the previous section, we described how lighting, materials, and textures are deeply interlinked in three.js, and we described a useful mental model for these, starting with lighting at the global level, materials at the object level, and textures at the "atomic" level, or at least the smallest scale that we can achieve based on the scale of our scene and the resolution of the textures:

1. Global level (**lighting**): a light gets added to the scene. The light affects every object within its range equally
2. Object level (**material**): the objects in a lights range receive the light, and react to it in a way defined by their individual material settings, which specify things like whether the object is metal or not, and how shiny it is. However, these only define very general aspects of the material, and while that's enough for "shiny red plastic" or "smoked glass", for most materials such as wood, skin, brushed metal and so on we'll need to go a level deeper
3. Atomic level (**textures**): textures are what make the material unique since they specify how material changes over the surface of an object. Textures define things like the pattern of bumps on a surface, or the way that part of an object is polished and part of it is rough and worn, or how the color changes across the material, for example, to show the grains in a piece wood

Note that this description is not intended to be technically accurate, rather we're presenting this as a useful mental model for creating your scenes. However, the three.js `WebGLRenderer` uses a technique called **forward shading** (AKA **forward rendering**), which means that we do go through the above three steps in a more or less linear fashion. We'll talk more about the graphics pipeline in [Section 11: Rendering Your Scenes with WebGL](/book/rendering/).

Collectively, the process of applying lighting and color to our objects is called [shading](https://en.wikipedia.org/wiki/Shading), and it's the part of the [**graphics pipeline**](https://en.wikipedia.org/wiki/Graphics_pipeline).

{{% aside %}}
In this section, to keep things simple, we'll exclusively involve ourselves with the materials designed to be applied to meshes, in particular, these four:

* `MeshBasicMaterial`
* `MeshLambertMaterial`
* `MeshPhongMaterial`
* `MeshStandardMaterial`
{{% /aside %}}

## What, Exactly, Is a Material?

A material in three.js is a wrapper around code that's written in a special language called [**GLSL**](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) (Graphics Library Shader Language), which is designed to be run on your graphics card. To put this in the simplest possible language:

**A three.js material is a set of two programs designed to be run on your graphics card. These programs contain algorithms that describe how an object reacts to light.**

These programs are individually known as [**Shaders**](https://en.wikipedia.org/wiki/Shader) and takes as inputs things like lighting, details of the geometry, the position of the camera, the parameters we have set on our material such as color, roughness, and metalness, and the textures.

Then, the programs run on your graphics card and outputs data which the `WebGLRenderer` combines from all the object in the scene into a final image that you see on your screen.

## Materials consist of Two Programs: a Vertex Shader and a Fragment Shader

The two programs that make up each material are called the **Vertex Shader** and the **Fragment Shader** (AKA **Pixel Shader**).

In short, your GPU is a massively parallel computer capable of running millions or even billions of shader programs each second. The vertex shader is run once for each vertex in the geometry of your object. Then, the result is passed to the fragment shader which calculates the values in between the vertices.

Consider the simple example of rendering a triangle shaped `Mesh` with a material applied to it. The triangle has three vertices, one at each corner, meaning that the vertex shader will run three times.

The vertex shader will take as input the $(x, y, z)$ position of each vertex, as well as the mesh's various transformation matrices (if you recall, we introduced these back in [Ch 3.2](/book/helpers-inheritance/scene-graph/)). These matrices get multiplied together to get the final position of the vertex. Next, it will take into consideration the camera's matrices and use these to calculate the position of the vertex from the viewpoint of the camera, and thus where it will end up being drawn on the screen.

This is the bare minimum that a standard vertex shader will calculate. In practice, it will probably take other inputs such as color, lights, and various textures.

The results of these calculations then get passed to the fragment shader, which calculates the color of each individual pixel for the part of the screen that the triangle takes up.

This isn't quite the final step since this is just the result for one object and there may be many objects in the scene, and our triangle may be covered (**occluded**) each other meshes. The renderer is responsible for taking the results from the fragment shaders and combining them into the final image that makes up each frame.

We'll get into more details about how these shaders work in [Section 11: Creating Custom Materials with Shaders](/book/custom-materials/). For now, remember that the vertex shader runs first on each vertex, and the fragment shader runs afterward to calculate the bits in between.

{{% aside %}}
Materials do other things as well, most notably calculations for Morph Targets and Skeletal Animation but to keep thing as simple as possible here we'll leave discussion of those for [Section 12: Animating Your Scenes](/book/animation/).
{{% /aside %}}


## Chapter 6.1 [Shading Algorithms Used by the Built-In Materials](/book/materials/shading-models/)

Real world lighting is made up of an essentially infinite number of light rays, and, as always when presented with the infinite in our computer programs, we'll have to come up with an approximation that gives a good result in a time somewhat less than the current age of the universe.

An algorithm used for lighting are called an **Illumination Model**, and there are several popular models in use, each offering various levels of tradeoff between speed and accuracy.

The shading algorithm used by a material consists of an illumination model and an interpolation model, and we'll discuss the shading models used by the main three.js materials.

## Chapter 6.2 [Common Material Properties And Methods](/book/materials/material-base-class/)

All of these material types are based on the [Material](https://threejs.org/docs/#api/en/materials/Material) base class, and in this chapter, we'll take a look at this to make sure that we're familiar with the properties and methods common to all materials.

## Chapter 6.3 [Welcome to the Future: Physically Based Rendering with MeshStandardMaterial and MeshPhysicalMaterial](/book/materials/physically-based/)

## Chapter 6.4 [Fast, but OldSchool: MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, and MeshToonMaterial](/book/materials/non-physical/)

## Chapter 6.5 [Specialty Materials: MeshDepthMaterial and MeshNormalMaterial](/book/materials/specialty-materials/)

Finally in this section, we'll take a look at two specialty materials that come with three.js:

* [MeshDepthMaterial](https://threejs.org/docs/#api/en/materials/MeshDepthMaterial) - this is used to measure depth in the scene, that is, how far objects are away from the camera. It's used for a variety of effects, for example, when creating shadows
* [MeshNormalMaterial](https://threejs.org/docs/#api/en/materials/MeshNormalMaterial) - this can be used to visualize an object's normal, that is, the direction in which light will bounce from the surface

## But What About the Rest?

This leaves a couple of material unmentioned, but we'll cover those in relevant sections later in the book:

### [Section 5: Lights and Shadows](/book/lights-shadows/)

* [ShadowMaterial](https://threejs.org/docs/#api/en/materials/ShadowMaterial) - as we saw in the previous section, when this material is applied to an object, that object will be invisible, however, shadows that fall on the object will still show up, which can be used for a variety of effects

### [Section 9: Points, Particles Systems, and Sprites](/book/points-sprites/)

All the materials covered so far (except for `ShadowMaterial`) have the word `Mesh` in their name, implying that they are designed to be used with `Mesh` objects. However, there are several visible object types in three.js. In Section 9 we'll look at [Sprite](https://threejs.org/docs/#api/en/objects/Sprite) and [Points](https://threejs.org/docs/#api/en/objects/Points). Sprites always face the camera, making them perfect for 2D scenes or labels on 3D objects, while points allow us to create simple particle systems. Sure enough, these both have associated materials:

* [SpriteMaterial](https://threejs.org/docs/#api/en/materials/SpriteMaterial)
* [PointsMaterial](https://threejs.org/docs/#api/en/materials/PointsMaterial)

### [Section 10: Lines, Shapes, and Text](/book/shapes-text/)

The final renderable objects we need to consider are [Line](https://threejs.org/docs/#api/en/objects/Line), [LineLoop](https://threejs.org/docs/#api/en/objects/LineLoop), and [LineSegments](https://threejs.org/docs/#api/en/objects/LineSegments). When working with these objects, we have these two materials to choose from:

* [LineBasicMaterial](https://threejs.org/docs/#api/en/materials/LineBasicMaterial) - the equivalent to `MeshBasicMaterial`, but for lines, this material type doesn't react to lights
* [LineDashedMaterial](https://threejs.org/docs/#api/en/materials/LineDashedMaterial) - the same as `LineBasicMaterial`, except that we can also add gaps into the line for a dashed effect

### [Section 16: Creating Custom Materials with Shaders](/book/custom-materials/)

Finally, we'll come to our second section on materials where we'll learn how to build our own custom materials. As we mentioned above, each material consists of a Vertex Shader, which runs once for each vertex in the object's geometry, and a Fragment Shader, which calculates the bits in between.

In this section, we'll take a look at how to create our own shaders. three.js has two material types to help us with this:

* the [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) still has some built-in helpers to make our lives easier
* the [RawShaderMaterial](https://threejs.org/docs/#api/en/materials/RawShaderMaterial) gets us very close to the bare metal and has all helpers stripped out



