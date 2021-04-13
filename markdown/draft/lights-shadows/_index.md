---
title: "Lighting and Shadows"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 700
chapter: "7"
---

# Lighting and Shadows

{{< figure src="lights-shadows/banner.jpg" alt="Photo by Matthew Henry from Unsplash" title="Photo by Matthew Henry from Unsplash" class="banner" >}}

Lighting and shadows are the soul of your scene. The same scene can be made eerie, friendly, warm, cold, bleak, daytime, nighttime, comforting, just by changing the lighting and the shadows.

Most materials need light to even show up in a scene (with the notable exception of [`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial), as well as a couple of others). In this regard, you can think of your scene in the same way you would of any space in the real world - if there is no light, you cannot see anything.

In three.js, lighting, material and textures are deeply interlinked. It can be helpful to divide think of these on three levels, from from the global level (lighting), to the object level (material) to the atomic level (textures).

1. Global level (**lighting**): a light gets added to the scene. The light affects every object within its range equally.
2. Object level (**material**): the objects within a light's range receive the light, and react to it in a way defined by their individual material settings. These specify things like whether the object is metal or not, and how shiny it is. However, material settings only define very generic aspects of the material, and while that's enough for "shiny red plastic" or "smoked glass", for most materials such as wood, skin, brushed metal and so on we'll need to go a level deeper
3. Atomic level (**textures**): textures are what make the material unique since they specify how material changes over the surface of an object. Textures define things like the pattern of bumps on a surface, or the way that part of an object is polished and part of it is rough and worn, or how the color changes across the material, for example, to show the grains in a piece wood.

Of course, we can't actually simulate lighting all the way down to the atomic level. Depending on the scale of our scene, the best we'll be able to get to is the millimeter or centimeter level. However, it's worth noting that the physical models that are used to set up a physically based shading model such as the one used in the `MeshStandardMaterial` really do consider the interaction of light with surfaces at the atomic, or at least molecular, level.

The algorithms that describe these three steps are called a [**shading model**](https://en.wikipedia.org/wiki/Shading) (and the process of calculating the results is called **shading**). These algorithms are defined in the materials, as we'll see in the next section, and each material in three.js uses a different shading model.

We'll consider the object and atomic levels in the section on materials and textures. For now, we'll look at things from high above and see what's entailed in a physical lighting setup.

One very useful property of a physically based setup is that fact that we no longer have to couple specific lights to a material to get it to look the way that we want. Instead, we can just set up lighting that represents things like "a sunny day" or "a warehouse interior" and we can be confident that when we put an object such as wooden desk or cat into our warehouse, it will look correct.

We'll call these lighting setups **lighting rigs**, and it can be useful to build up a stock of these as we proceed in our three.js careers.

## Chapter 5.1 [Physically Based Lighting](/book/lights-shadows/physically-based-lighting/)

Since we set `renderer.physicallyCorrectLights = true` way back in [Chapter 1.5](/book/first-steps/camera-controls/#physically-correct-lighting) and have never looked back since, all of our lighting is in SI units such as Candela, Lumens, and Lux. This means that we can reason about the lighting in our scenes with scientific rigour.

Of course, to do that we'll need to understand the science, so we'll start the section by taking a brief but thorough look into the physics of lighting, as it applies to three.js.

When we're using physically based lighting in three.js, we can actually go into a store and look at the packaging on a light which will tell us the brightness in lumens and its color temperature. Then we can type these values into three.js and our light will be a close match for the light from the real world!

Well, that works for `PointLights`, and it's not too much of a stretch to get it working for `SpotLights` as well, but what about the other light types? What are the units of intensity for the `DirectionalLight` or the ambient lights? All will be revealed in Chapter 5.1!

Another important consideration that comes up at this point is the fact that our renderer is rendering our scenes in [HDR](https://en.wikipedia.org/wiki/High_dynamic_range) (high dynamic range), which then gets converted to [LDR](https://en.wikipedia.org/wiki/Standard-dynamic-range_video) (low, or standard, dynamic range) since basically all computer and mobiles screens can only show a very limited range of color and brightness compared to the real world.

This is accomplished by a process known as [tone mapping](https://en.wikipedia.org/wiki/Tone_mapping), which we'll look at in more detail in [Section 11: Rendering Your Scenes with WebGL](/book/rendering/). For now, we just need to consider the [tone mapping exposure](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.toneMappingExposure), which is equivalent to the concept of [exposure in real world photography](https://en.wikipedia.org/wiki/Exposure_(photography)).

There's a nice [tone mapping example](https://threejs.org/examples/#webgl_tonemapping) over on the three.js site that you can play around with to get a feel for how this works (note that the default tone mapping type is linear).

## Chapter 5.2 [Working with the three.js Lights](/book/lights-shadows/light-types/)

Next up, we'll take theory from the previous section and put it into practice, taking a look the light types that come with three.js and what situations we should use each of them in. We'll also take a look at the helper objects that we can use to visualize the position direction, range and other aspects of the lights.

The three.js lights can be divided into three categories.

### Direct Lighting

Direct light types are designed to mimic real world light sources, so they're what you will intuitively think of when you think of lighting. There are four types of direct light currently available in three.js:

* the [PointLight](https://threejs.org/docs/#api/lights/PointLight) simulates a nearby light source like a light bulb
* the [DirectionalLight](https://threejs.org/docs/#api/lights/DirectionalLight) simulates faraway light such as the sun
* the [SpotLight](https://threejs.org/docs/#api/lights/SpotLight) simulates a... spot light
* the [RectAreaLight](https://threejs.org/docs/#api/lights/RectAreaLight) is a fairly recent addition which simulates area lights such as glowing windows or fluorescent bulbs. It's not fully functional yet (shadows don't work and it doesn't work with all material types), so we won't consider this light type for now

### Ambient Lighting

Light in the real world bounces infinitely off all the surfaces around us. In computer graphics terms, this is called [Global Illumination](https://en.wikipedia.org/wiki/Global_illumination), and it's in a category of problems that mathematicians politely like to refer to as **hard**, by which they mean, impossible.

No matter how fast our computers get, we will never be able to simulate the infinite bouncing of the trillions of photons that make up the light around us. Instead, we'll have to approximate it.

As we briefly discussed way back in [Ch 1.5 Camera Controls and Global Illumination](/book/first-steps/camera-controls/#lighting-from-all-directions) ambient lighting is one easy and computationally cheap way of doing this. Here are the ambient light types available in three.js:

* [AmbientLight](https://threejs.org/docs/#api/en/lights/AmbientLight) simply adds a fixed amount of light to all objects in the scene from all directions equally. It's a cheap for of lighting in all senses of the word, from computation speed to quality
* [HemisphereLight](https://threejs.org/docs/#api/en/lights/HemisphereLight) adds light that fades from a sky color (generally brighter) to a ground color (generally darker). It's much higher quality than the `AmbientLight`, and not much slower, although it's not suitable for all lighting scenarios
* [LightMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMap), the third way of adding ambient lighting to an object, is a form if Image Based Lighting (IBL), so we'll take a look at this on the section on textures rather than here. Lightmaps are full color and can give very high-quality results, but they need to be prepared in another application and can be tricky to set up. Additionally, they are only suitable for non-moving (static) objects

### Environment Lighting

Aside from the LightMap, there's another type of IBL lighting available in three.js - the environment map, which goes in the `material.envMap` slot.

We'll cover environment mapping in much more detail in Section 7, but for now here's quick taster.

 Environment maps come in various formats, such as cubemaps, equirectangular maps, and spherical maps, all of which represent a 3D panorama of the type that most mobile phone cameras can now capture. You can also set the `scene.background` to display the environment map, which can then be used to show [reflection](https://threejs.org/examples/#webgl_materials_cubemap_dynamic) or [refraction](https://threejs.org/examples/#webgl_materials_cubemap) on the models.

 {{< figure src="textures/cubemap-example.jpg" alt="A cube environment map in action" title="A cube environment map in action" lightbox="true" class="" >}}

Environment maps are interpreted in one of two ways, depending on the material that you use:

1. As a reflection/refraction map, in the older materials such as `MeshBasicMaterial`, `MeshLambertMaterial`, and `MeshPhongMaterial`. In these material types, the contribution of the reflection map is added after the direct and indirect lighting has been calculated - in this case, it's kind of outside the lighting model, but represents both direct and indirect light
2. As a source of environmental light, in the newer physically based `MeshStandardMaterial` and `MeshPhysicalMaterial`. In this case, it's more similar to the lightmap, except that it works on moving scenes, and it's added to specular light only (we'll explain what that means in the next chapter)

In both cases, the end result is fairly similar and you end up seeing the environment reflected/refracted in the object.

## Chapter 5.3 [Introducing Shadows](/book/lights-shadows/shadows/)

Shadows, when used correctly, add a huge amount of realism and believability to a scene. However, they can be tricky to set up and if used incorrectly will quickly lead to poor performance in your app.

Only the `DirectionalLight`, `SpotLight`, and `PointLight` can be used to cast shadows. We'll take a look at how to set up shadows for each of these light types, and also take a look at a special materials called the [`ShadowMaterial`](https://threejs.org/docs/#api/en/materials/ShadowMaterial), which will allow us to get extra control over the shadows cast on to an object and even control the color of shadows, allowing for some funky effects!

{{< figure src="lights-shadows/horses.jpg" alt="Colored shadows using the Shadow Material" title="Colored shadows using the Shadow Material" >}}


