---
title: "Working with Textures"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 900
chapter: "9"
---

# Working with Textures

{{< figure src="textures/banner.jpg" alt="Worn Paint by Philip Veater" title="Worn Paint by Philip Veater" class="banner" >}}

The final part of our three part mental model for working with lighting, materials, and textures is what we're calling the **atomic level**.

At the **global level**, a light will affect all objects in its range equally. Just like in the real world, a light has no knowledge of the surface properties of the objects that it will eventually illuminate.
At the **object level**, or material level, we define the high-level properties of an objects surface: whether it is metallic, whether it is see-through or solid, how shiny it is and so on.

But what about a rusted piece of metal? Is that metallic or non-metallic? Or an old piece of painted wood with the paint flaking off to display the wood underneath? Is that wooden or painted? Shiny or non-shiny?

Obviously, the high-level properties of materials are not good enough for most objects. If the object is made of shiny plastic, perhaps. But, one thing that's guaranteed to make your scenes look computer generated is not taking into account the fact that the real world is messy. Even shiny plastic that's more than a few months old will probably have lots of tiny scratches in it and for most objects the way in which they react to light changes dramatically over their surface, going all the way down to the atomic, or at least molecular, level.

This is where textures come in. We can't, in the current generation of real-time graphics, hope to get down anywhere near the molecular level. However, we can define the properties of the surfaces of our objects down to a small scale, perhaps down to the sub-millimeter level, depending on the resolution of the textures we're using, and the scale of our scene.

As such, **the quality of our materials is almost completely dependant on the quality of our textures**. We can spend all the time that we like on fine-tuning our lighting rigs and materials, but it will all be in vain if our textures are not up to scratch.

Capturing and creating high-quality textures for use in graphics is an art form in itself, and not something that we'll attempt to cover here. Instead, we'll use some of the many amazing and free textures available on sites such as [freePBR.com](https://freepbr.com/), [cc0 Textures](https://cc0textures.com/), or [3dtextures.me](https://3dtextures.me/tag/pbr/). If you have a bit of money to spend, the industry standard is probably [Quixel Megascans](https://quixel.com/megascans).

Here's what's coming up in this section.

## Chapter 7.1 [Loading and Working with Textures, and the `Texture` Base Class](/book/textures/texture-base-class/)

In the first chapter of this section, we'll take a look at how to load textures and how to use them in our materials. We'll also cover all theory and best practices that you need to know for working with textures, such as the correct terminology, color spaces, encoding, when to use JPG, when to use PNG, and lots more.

We'll use the `TextureLoader` for loading textures - we already covered this back in [Ch 1.4: A Brief Introduction to Texture Mapping](/book/first-steps/textures-intro/), so it should be familiar to you.

Fortunately, although loading textures is an asynchronous operation, the loader is set up to easily deal with the wait time while the images are loading over a potentially slow network.

We'll also take a look at the `Texture` base class here. Unlike most other base classes such as `Object3D`, `Light`, and `Material`, we will generally use the `Texture` class directly. Finally, we'll introduce the diffuse color `material.map` slot.

### Color Map

The color map is stored in the [`material.map`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.map) slot. It's the most commonly used texture and describes how the color of the material changes over it's surface. It's so ubiquitous that its slot is just called `.map`, implying that it's the default map.

**If you only apply one map to your material it should probably be the color map since this has the biggest visual effect.**

{{< figure src="textures/brick_diffuse.jpg" alt="Brick Diffuse Map" title="Brick Diffuse Map" lightbox="true" class="small left" >}}

{{% aside %}}
#### Every Map Slot in a Material has Modulating Parameters

An important thing to take note of is that all the textures have one or more associated **modulating properties** of various kinds, for example, the `.bumpMap` is associated with `.bumpScale`, which is a simple float. A higher value of `bumpScale` will make the bumps in the `.bumpMap` more prominent. The color `.map` is associated with the `material.color` property, which is a [`Color`](https://threejs.org/docs/#api/en/math/Color) object. The normal map goes in the `.normalMap` slot and is modulated by the `.normalScale`, which is a `Vector2`, and so on.
{{% /aside %}}

## Chapter 7.2 [Adding Realism with Environment Maps](/book/textures/environment-map/)

**...and if you only apply *two* maps to your material, the second one should probably be an environment map.**

Depending on the type of material, the environment map may be even more important than the color map - for example, shiny materials and metals. We need to set up the texture being used for the environment map a bit differently than the other textures since it defines the incoming light from all angles.  Environment maps are similar to what your phone camera captures when you take a panaroma photo and have to turn to all directions before the photo is finished.

The environment map goes in a material's [`.envMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.envMap) slot and gets modulated by the [`.envMapIntensity`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.envMapIntensity) in the Standard and Physical materials, and the [`.reflectivity`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.reflectivity) and [`.combine`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.combine) properties in the case of the Phong, Lambert and Basic materials.

The reason that different materials have different modulating parameters for the environment is that environment maps are treated quite differently by the shading model in the newer physical workflow. The older materials treat this map as a reflection map, and add the reflection after all lighting calculations have been done, while the Standard and Physical materials treat this as a source of specular light. In either case, the end result is similar.

There are several formats used to store 3D dimensional photos in a 2D texture, such as Equirectangular, Spherical and Cube maps.

In the case of the later, the cube map is made up of six separate images, and we'll need to use special loader called the `CubeTextureLoader`, which create a `CubeTexture`. However, the process is very similar to using the normal texture loader, as we'll see.

Environment maps can be used for reflection (left) or, on transparent materials, for refraction (right).

{{< figure src="textures/refract-reflect.jpg" alt="Reflection and Refraction Comparison" lightbox="true" class="" >}}

## Chapter 7.3 [`MeshStandardMaterial` and the Metal/Rough Workflow](/book/textures/metal-rough/)

As we discussed in the previous section, there are two basic workflows available to us in three.js - a specular workflow used in the older `MeshBasicMaterial`, `MeshLambertMaterial`, and `MeshPhongMaterial`, and a rough/metal workflow in the new `MeshStandardMaterial` and `MeshPhysicalMaterial`. We'll concentrate on the metal/rough workflow here, and show you how to set up a couple of highly realistic materials using the `MeshStandardMaterial`.

While the difference may appear to be only in the three maps and associated properties listed here, in practice, you may need to set up the color map differently as well.

### Metalness Map

The [`.metalnessMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.metalnessMap) is modulated by the [`.metalness`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.metalness) property. In the real world, with very few exceptions, materials are either metal or not metal. That means that if you are using a metalness map, then you must set `material.metalness = 1`. Then, your metalness map should have areas of full black (non-metal) and areas of full white (metal), with perhaps a couple of pixels of grey to transition between them.

The notable exception to this is metal with a light rust coating. Even then, at an atomic scale, the material is either rust (non-metal) or not rust (metal). However, for practical purposes we'll have to describe it as partially metallic - that is, some level of grey in the texture. That's the *only* common exception though!

Here's a metalness map for our brick material. It's completely black since bricks are not metal. In practice, we wouldn't use this map since setting `material.metalness = 0` will have the same effect while saving us some memory on the GPU.

{{< figure src="textures/metalness.jpg" alt="Brick Metalness Map" title="Brick Metalness Map" lightbox="true" class="small left" >}}

### Roughness Map

The[`.roughnessMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.roughnessMap) is modulated by the [`roughness`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.roughness) property and describes the roughness of the surface **at a molecular level**. Imagine that you are a bacteria or at least an unusually small ant. A surface with low roughness will be easy for you to travel across, while a surface with high roughness will be like a mountain range, all hills, and valleys. The effect is that the non-rough (shiny, smooth, glossy) surface reflects light in a very uniform (highly specular) manner, while a rough surface scatters light in all directions, which we call diffuse reflection.

Here's what a roughness map for the above brick texture will look like:

{{< figure src="textures/brick_roughness.jpg" alt="Brick Roughness Map" title="Brick roughness Map" lightbox="true" class="small left" >}}

It's important to remember that the metalness and roughness maps both describe changes at the microscopic level in your material. Don't try to use it to define larger features, instead use a bump, normal or displacement map to achieve those.

## Chapter 7.4 [`MeshPhongMaterial` and the Specular Workflow](/book/textures/specular-workflow/)

While the `MeshStandardMaterial` offers undeniably higher quality in nearly all situations, there will be times when we need to use a lower quality material for performance reasons. The next level down is the `MeshPhongMaterial`, below that is the `MeshLambertMaterial`, and at the very bottom is the `MeshBasicMaterial`.

All of these material types use the specular workflow which replaces the roughness and metalness parameters and map with the specular map goes in the [`.specularMap`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.specular).

### Specular Map

This gets modulated by the [`.specular`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.specular) color and the [`.shininess`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.shininess) on the `MeshPhongMaterial` *only*.

`MeshBasicMaterial` and `MeshLambertMaterial` can have a specular map, but do not have the corresponding `.shininess` and `.specular` properties. As such, the specular map is offered as a kind of cheat in these materials, allowing us to add shiny highlights to the material without performing expensive specular lighting calculations.

Here's a specular map for some bricks.

{{< figure src="textures/brick-specular.jpg" alt="Brick Specular Map" title="Brick Specular Map" lightbox="true" class="small left" >}}

## Chapter 7.5 [Bump, Normal, and Displacement Maps](/book/textures/bump-normal-displace/)

We'll switch back to the `MeshStandardMaterial` here and take a look at how to add larger scale perturbations to our materials. Where the roughness map describes how rough the surface is at a microscopic level, the maps in this section describe bumps, crevices, and crenelations at a macroscopic level.

### Bump Map

The oldest technique available is the [`.bumpMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.bumpMap), which is a simple greyscale image with white as the highest point and black as the lowest, modulated by the [`.bumpScale`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.bumpScale).

Here's a bump map for our brick texture:

{{< figure src="textures/brick_bump.jpg" alt="Brick Bump Map" title="Brick Bump Map" lightbox="true" class="small left" >}}

### Normal Map

The [`.normalMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.normalMap) is a more modern technique that gives a similar effect to the `.bumpMap`. However, the texture used for a normal map is full color and describes height in 3D, rather than the 1D of the bump map. It's modulated by the [`.normalScale`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.normalScale).

Here's a normal map for some bricks:

{{< figure src="textures/bricks-normal.jpg" alt="Bricks Normal Map" title="Bricks Normal Map" lightbox="true" class="small right" >}}

You should use **either** a bump map, **or** and normal map, but not both! The normal map will give better results, but it's harder to create one, the texture size will be bigger, and the performance a little lower, so as useful it's a quality/performance tradeoff.

### Displacement Map

Finally, there's the [`.displacementMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementMap), which gets modulated by the [`.displacementScale`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementScale) **and** the [`.displacementBias`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementBias). Unlike the other two, the displacement map actually changes the geometry of the object - the position of each of the vertices gets displaced according to the map. This happens on the GPU at render time, so it's a very fast operation.

## Chapter 7.6 [Different Ways of Approaching Transparency](/book/textures/transparency/)

The **alpha map**, also known as the **transparency map** or **opacity map**, is stored in the [`material.alphaMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.alphaMap) describes how the transparency of an object changes over its surface. However, we can also use a transparent PNG (or some other format that support transparency) for the color `.map` and store the transparency data in the alpha channel of the texture. There is no difference between these two approaches, so if possible you should nearly always do that and avoid using an alpha map. On the other hand, you can use a separate alpha map to achieve some [funky effects](https://medium.com/@soffritti.pierfrancesco/animations-with-alpha-textures-in-three-js-52a33654e137)!

When it comes to making our objects see-through, or **transparent**, there are two different approaches we can take, matching up to two different things that we may be trying to achieve:

1. Partially transparent materials, such as glass or clear plastic - this is generally just referred to as **transparency**
2. Objects with some completely opaque areas and some completely transparent areas. This is called **alpha cutoff** or **transparent cutout**

### Standard Transparency

The first one is what you probably think of when you think of transparency, and it's self-explanatory. When we have a partially see-through object, we can either make the object uniformly transparent with the `material.opacity` setting, or we can use an alpha map or transparent color map. In either case, we'll need to set `material.transparent = true`, otherwise this won't work.

### Alpha Cutoff

What do we mean by the second? Take a look at this leaf texture that we'll use to create a Sprite in Section 15:

{{< figure src="textures/leaf-on-checkerboard.jpg" alt="Leaf on Checkerboard" lightbox="true" >}}

The leaf texture is composed of 100% opaque(not see-through) and 100% transparent (see-through) elements, there are no partially transparent pixels. We've placed it on top of a black and white checkerboard pattern to highlight that.

In this scenario, we can leave `material.transparent = false` and instead use `material.alphaTest`. By default, `material.alphaTest = 0`, which means that it is disabled, but a good starting value for using this technique is `material.alphaTest = 0.5`.

### Which Transparency Method Should You Use?

Alpha cutoff has much better performance, so if possible you should use that. However, it's not possible to have partially transparent objects using this technique, so if you need to model something partially see-through you'll need to use standard transparency.

We'll go into more detail about which method to use, and when, in this chapter.

## Chapter 7.7 [Emissive, Light, and Ambient Occlusion Maps](/book/textures/ao-emissive-light-maps/)

The final map types available are the emissive, light, and ambient occlusion maps. The lightmap and ambient occlusion map need special treatment because they require a second set of UV coordinates to work. In the case where these are not provided in a model, it's usually a simple matter of duplicating the primary UVs so that's not a big problem.

### Emissive Map

The [`.emissiveMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.emissiveMap) makes the material appear to glow according to the color and brightness of the materials, combined with the [`material.emissive`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.emissive) color.

Note that an emissive material does not actually give off light. The object will appear to glow, but it will not affect any other objects. However, this can be used in conjunction with a light to create convincing lightbulbs and other effects.

### Lightmap

If you recall, back in [Chapter 1.5](/book/first-steps/camera-controls/#lighting-from-all-directions), we introduced the concept of Global Illumination, then immediately dashed your hopes by pointing out that true global illumination is a result of light reflecting an essentially infinite number of times off all the surfaces around you and is impossible for us to calculate. We then described how we can use ambient lighting as a cheap way of simulating this, by adding a constant amount of light to an object.

Along with the `AmbientLight` and `HemisphereLight`, the lightmap is the third way of applying ambient lighting to an object. The `AmbientLight` just adds a uniform amount of light at a single color and intensity, and the `HemisphereLight` improves on this by adding light that varies between the sky and ground, but the lightmap allows us to add a full spectrum of ambient light that varies across an object's surface.

The lightmap goes in the [`.lightMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMap) slot and is modulated by the [`.lightMapIntensity`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMapIntensity).

### Ambient Occlusion

All three sources of ambient lighting are occluded (darkened) by the Ambient Occlusion (AO) map.

The [`.aoMap`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap) _only_ affects ambient light. This map is modulated by the [`.aoMapIntensity`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.aoMapIntensity) property.

However, the edges and small gaps in objects are all uniformly lit using this technique, while in the real world objects **self-shadow**. Applying an Ambient Occlusion map along with ambient lighting can bring a huge increase in realism if done right.

{{< figure src="textures/ao-demo.jpg" alt="Ambient Occlusion" title="Ambient Occlusion" link="https://www.flickr.com/photos/syntopia/" >}}

The AO map requires a second set of UVs, just like the lightmap (both maps share these secondary UVs).


