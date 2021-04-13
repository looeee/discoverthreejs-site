---
title: "Points, Particles Systems, and Sprites"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 1100
chapter: "11"
---

# Points, Particles Systems, and Sprites

{{< inlineScene entry="first-steps/9.0-banner.js" class="round" >}}

Up until now, we have only considered geometries with vertices in groups of three, each group making up a triangular face in a polygon. When these polygons get combined together, they create convincing smooth 3D surfaces. Throw in lighting and materials, and you nearly everything that you need to create your 3D scenes - in fact, for many scenes, you have _everything_ that you need.

However, what about showing many thousands or millions of very tiny things, like raindrops, stars, snow, or dust? Or things that don't fit th concept of *3D surface* at all, like flames, explosions and clouds?

For these, we'll take a different approach and consider the vertices in _groups of one_. Each vertex represents a particle, or [Points](https://threejs.org/docs/#api/en/objects/Points) as they are called in three.js.

## Chapter 9.1 [Particle Systems](/book/points-sprites/particle-system/)

The process of creating `Points` is nearly the same as the process for creating a `Mesh`:

### Creating a `Mesh`

{{< code lang="js" linenos="false" hl_lines="" >}}
const geometry = // get or create geometry

const material = new MeshBasicMaterial();

const mesh = new Mesh( geometry, material );

scene.add( mesh );
{{< /code >}}

### Creating `Points`

{{< code lang="js" linenos="false" hl_lines="" >}}
const geometry = // get or create geometry

const material = new PointsMaterial();

const points = new Points( geometry, material );

scene.add( points );
{{< /code >}}

When we want to update the position of the `Points`, we need to iterate over the entire positions attribute (or at least part of it) and update the position of each vertex. This happens on the CPU, and it's fine if you're not doing it often or if you have a fairly small particle system. When it comes to animating millions of points, that will probably be a bottle neck and you will need to write a custom shader, as in this [GPU based particles](https://threejs.org/examples/webgl_gpu_particle_system.html) example. For now though, we'll stick with the built-in system.

## Chapter 9.2 [Introducing Sprites](/book/points-sprites/sprites/)

We'll also consider the `Sprite` object in this section, even though they don't _quite_ fit. However, their behavior is similar in many ways to Points.

A Sprite is a _screen oriented quad_, that is, a square that is always facing the screen. Generally, you put a texture on it, or perhaps even an animated texture using a **sprite sheet**, as in this example by [Danny Pixel](https://dannypixel.itch.io/assetspack01-dannypixel).

{{< figure src="points-sprites/sprite-sheet.png" alt="A Sprite Sheets by Danny Pixel" lightbox="true" class="" >}}

{{< figure src="points-sprites/sprite-sheet-animated.gif" alt="" lightbox="true" class="" >}}

`Sprite` has an implicit geometry, meaning that when we create one we don't need to provide the geometry. Generally, we will always provide a texture, however:

{{< code lang="js" linenos="false" hl_lines="" >}}
const spriteMap = textureLoader.load( 'sprite.png' );

const spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );

const sprite = new THREE.Sprite( spriteMaterial );

scene.add( sprite );
{{< /code >}}
Sprite textures will almost always be transparent PNGs.




