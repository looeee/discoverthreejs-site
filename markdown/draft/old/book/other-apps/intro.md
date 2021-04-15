---
title: "Working with Other Applications and Libraries"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 1500
chapter: "15"
---
{{% fullwidth %}}
# WORKING WITH OTHER APPLICATIONS

{{< figure src="/images/15-other-apps/banner.jpg" alt="Model from Mixamo Processing in Blender" class="banner" >}}

Part of the skill of working with any tool is being aware of it's limitations and knowing when to put it down and use a different tool. At it's heart, three.js is a rendering framework - and an amazing one at that, especially considering that the core file is only a little more than one megabyte in size.

The plugins such as `OrbitControls`, `GLTFLoader`, post-processing shaders, and so on add a lot of extra functionality, meaning that for most things we need we won't have to look outside of the repo. So, for example, even though three.js is _not_ a game engine, if we add in the various controls and loaders and do a little scripting ourselves we can quickly use it as the basis for one.

Likewise, three.js is not a modelling program, but we can achieve a lot with the built-in geometries, and we can can create our geometries for simple, abstract or even complex mathematical shapes with a bit of work.

On the other hand, if we need to create complex models of buildings, animals, humans, or aliens, we will not have much luck trying to make these using three.js and a text editor.

The same goes for creating complex animations for these model, or setting up physics for a game engine, or creating textures for use in our materials.

When it comes to physics, libraries such as [Cannon.js](http://www.cannonjs.org/) and [Ammo.js](https://github.com/kripken/ammo.js/) work well with three.js.

If you want to create animations programmatically, you may find the three.js animation system too limited for your need - after all, it's mainly designed to be used with animations created in other programs. Again, there are lots of JavaScript animation libraries that work well with three.js, such as [tween.js](https://github.com/tweenjs/tween.js/), [GSAP](https://greensock.com/gsap), [Velocity.js](http://velocityjs.org/), and [anime.js](https://animejs.com/).

For authoring textures, you might need to go out in to the real world with a camera, or alternatively you can find many sources of high quality free textures on the web. If you need to edit them, there are hundred of suitable programs, the most well known of which are [PhotoShop](https://www.photoshop.com/) and [Gimp](https://www.gimp.org/).

In this section, we'll focus

## Chapter 15.1 [Preparing Models for Export from Modelling Applications](/book/15-other-apps/1-preparing-models/)

## Chapter 15.2 [Converting FBX, OBJ and DAE files to glTF Format](/book/15-other-apps/2-convert-to-gltf/)

## Chapter 15.3 [The LoadingManager](/book/15-other-apps/3-loading-manager/)

## Chapter 15.4 [Exporting Your Scene in glTF Format](/book/15-other-apps/4-export-gltf/)

## Chapter 15.5 [Loaders for Other Formats: FBX, Collada, and OBJ](/book/15-other-apps/5-load-fbx-dae-obj/)

{{% /fullwidth %}}

Three.js is an amazing library, and you can do a _lot_ without reaching for any other tools beyond your favorite text editor. However, it is not a modeling  or animation program and you will at some point find yourself needing some things that the library doesn't provide - or at least, you will save yourself a _lot_ of work by using a dedicated program. Or perhaps you are working with a 3D artist or animator and you need to let them know how they should prepare the assets before sending them to you.

We'll start by looking at the various 3D formats that work well with three.js and then take look at typical workflows with some popular 3D applications such as {{< externalLink src="https://www.autodesk.com/products/3ds-max/overview" name="3D Studio Max" >}}, {{< externalLink src="https://www.autodesk.com/products/maya/overview" name="Maya" >}}, and {{< externalLink src="https://www.blender.org/" name="Blender" >}}.