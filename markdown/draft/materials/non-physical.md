---
title: "Fast, but OldSchool: MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, and MeshToonMaterial"
description: "TODO"
date: 2018-04-02
weight: 804
chapter: "8.4"
---

# Fast, but OldSchool: `MeshBasicMaterial`, `MeshLambertMaterial`, `MeshPhongMaterial`, and `MeshToonMaterial`


# [`MeshBasicMaterial`](https://threejs.org/docs/#api/materials/MeshBasicMaterial),  [`MeshLambertMaterial`](https://threejs.org/docs/#api/materials/MeshLambertMaterial), AND [MeshPhongMaterial](https://threejs.org/docs/#api/materials/MeshPhongMaterial)


## `MeshBasicMaterial`

First, let's take a look at what's changed from the base `Material`. Of course, all the properties and methods are still
available, however, some of the defaults that have been changed. In fact, just one parameter had been changed from the default
and that is:

### .lights

This is true on Material, but it's set to false here meaning that `MeshBasicMaterial` is not affected by any lights in your scene. You can't change this.

It also means that shadows won't show up on this material, although it can still _cast_ shadows onto other materials.

## Properties Shared by Multiple Materials

All the materials that are designed to be used with a mesh have lots of similarities, and just a few differences, so let's start by going over the properties that they share.

It's a lot to keep in your mind at first, so whenever you are working with a new material type open up the relevant docs page and check each parameter to see whether it's available on that material.

### `.color`

First up is `color`, which is defined on _most_ material types. The only materials for which it's _not_ available are a couple of speciality materials:

* MeshDepthMaterial
* MeshNormalMaterial
* ShadowMaterial
* ShaderMaterial
* RawShaderMaterial

These are all used for advanced techniques which we'll cover later. For now you can note that any "normal" material that you use to make something show up in your scene will have the `.color` property, which is an instance of [`Color`](https://threejs.org/docs/#api/en/math/Color).

### `.map`

This is the most important texture, it works in conjunction with `.color` to say what color an object is over it's surface.
