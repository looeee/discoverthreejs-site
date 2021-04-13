---
title: "Visualizing the Invisible: Helper Objects"
description: "TODO"
date: 2018-04-02
weight: 303
chapter: "3.3"
---

# Visualizing the Invisible: Helper Objects


* section links
* header graphic

How do you think the unthinkable? With an itheberg of course!

Well, in three.js we can visualize the invisible without having to resort to any such bad puns. By invisible I mean such things as Cameras, Lights, Normals and animated [Skeletons](https://threejs.org/docs/#api/objects/Skeleton) as well as purely mathematical objects such as boxes, grids, arrows, and the axes of coordinate systems.

In this chapter, we'll take a look at [ArrowHelper](https://threejs.org/docs/#api/helpers/ArrowHelper),
[AxesHelper](https://threejs.org/docs/#api/helpers/AxesHelper), [BoxHelper](https://threejs.org/docs/#api/helpers/BoxHelper) and [Box3Helper](https://threejs.org/docs/#api/helpers/Box3Helper), [GridHelper](https://threejs.org/docs/#api/helpers/GridHelper) and [PolarGridHelper](https://threejs.org/docs/#api/helpers/PolarGridHelper), and finally [PlaneHelper](https://threejs.org/docs/#api/helpers/PlaneHelper).

We'll the look at the rest of the helpers in other sections since it will make more sense to look at them in context - we'll leave [CameraHelper](https://threejs.org/docs/#api/helpers/A) for Section 3 when we look at cameras in depth, the various light helpers for Section 5, [FaceNormalHelper](https://threejs.org/docs/#api/helpers/A) and [VertexNormalHelper](https://threejs.org/docs/#api/helpers/A) for Section 6 when examine Geometry and BufferGeometry, and finally the [SkeletonHelper](https://threejs.org/docs/#api/helpers/) will make more sense in the context of skeletal animation, which we'll take a look at in Section 8.

In total there are 16 helper objects in the three.js core. As usual, they all inherit from [Object3D](https://threejs.org/docs/#api/core/Object3D) - some directly, and some via [Line](https://threejs.org/docs/#api/objects/Line) or [LineSegments](https://threejs.org/docs/#api/objects/LineSegments), so we can treat them as normal 3D objects - this means that we need to add them to our scene to see them.

> A standalone helper

{{< code lang="js" linenos="false" hl_lines="" >}}
const size = 5;
const axesHelper = new THREE.AxesHelper( size );
scene.add( axesHelper );
{{< /code >}}

They come in roughly two types - the first are standalone helpers (ArrowHelper, AxesHelper, GridHelper, PolarGridHelper) which are created with their own set of parameters. The rest are created by passing an object that you want to visualize.

> A helper created from another object

{{< code lang="js" linenos="false" hl_lines="" >}}
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const helper = new THREE.CameraHelper( camera );
scene.add( helper );
{{< /code >}}

Most of the helpers we're looking at here are standalone helpers. The exceptions are BoxHelper, created to visualize the bounding box of any Object3D, and two mathematical helpers: Box3Helper, used to visualize a [Box3](https://threejs.org/docs/#api/math/Box3) and PlaneHelper which is used to visualize a [Plane](https://threejs.org/docs/#api/math/Plane) - _not_ a [PlaneGeometry](PlaneGeometry)!

Let's use these helpers to create a little mathematical playground.


> Empty functions just waiting to filled!

If you scroll down to around line 100 you'll see that there are lots of empty function, just waiting for us to add the code to create our helpers. Let's go through them one by one now and fill them in.

## ArrowHelper

## AxesHelper

## BoxHelper

## Box3Helper

## GridHelper

## PolarGridHelper

## Final Result

src="looeee/discoverthree.com-examples/tree/master/section-2/4-helpers-final" module="/js/app.js"
