---
title: "Adding Realism with Environment Maps"
description: "TODO"
date: 2018-04-02
weight: 902
chapter: "9.2"
---

# Adding Realism with Environment Maps

### Equirectangular Environment Maps

{{< figure src="textures/equirectangular.png" alt="Equirectangular Environment Map" title="Equirectangular Environment Map" lightbox="true" class="small right" >}}

### Spherical Environment Maps

{{< figure src="textures/spherical.png" alt="Spherical Environment Map" title="Spherical Environment Map" lightbox="true" class="small left" >}}

### Cube Environment Maps

Cube maps can be stored in a single texture as six images joined in a cross, although this is not supported in three.js:

{{< figure src="textures/skybox_cross.png" alt="Cube Cross Environment Map" title="Cube Cross Environment Map" lightbox="true" class="small right" >}}

Or as six separate files representing the six directions from the cross format (this will be our preferred format). These last two are also commonly called a sky box since they form a cube shape with us in the center.

We'll need to use a special loader called the
[`CubeTextureLoader`](https://threejs.org/docs/#api/en/loaders/CubeTextureLoader) for loading the six textures that make
up a cube map, and it will create a special kind of texture called a
[`CubeTexture`](https://threejs.org/docs/#api/en/textures/CubeTexture), however, the process of loading the texture is
still simple.

Whichever format we use, we'll have to set the correct texture mapping, for example, Cube Reflection Mapping for the six separate images. Additionally, we need to decide whether we want our object to **reflect** or **refract** - transparent objects will refract lights, while solid objects reflect. So, for a cube map we will set `texture.mapping = cubeReflectionMapping`, or `texture.mapping = cubeRefractionMapping`. Equirectangular textures and spherical textures have equivalent mappings.