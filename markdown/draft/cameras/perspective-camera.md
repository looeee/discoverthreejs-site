---
title: "Working with the PerspectiveCamera"
description: "TODO"
date: 2018-04-02
weight: 501
chapter: "5.1"
---

# Better than Real Life: Working with the `PerspectiveCamera`

[PerspectiveCamera](https://threejs.org/docs/#api/cameras/PerspectiveCamera)

## The Camera Base Class

### Properties Common to all Cameras

* .isCamera
* .layers
* .matrixWorldInverse
* .projectionMatrix
* .projectionMatrixInverse

### Methods Common to all Cameras

* .clone()
* .copy()
* getWorldDirection( targetVector3 )

## The PerpectiveCamera Properties

* .aspect
* .far
* .filmGauge
* .filmOffset
* .focus
* .fov
* .isPerspectiveCamera
* .near
* .view
* .zoom

## The PerpectiveCamera Methods

* .clearViewOffset
* .getEffectiveFOV
* .getFilmHeight
* .getFilmWidth
* .getFocalLength
* .setFoclaLength
* .setViewOffset
* .updateProjectionMatrix
* .toJSON


{{% aside success %}}
#### Frustum Culling

You may have heard this term before - it's one of the most important ways in which the renderer automatically speeds up your scene. Objects that lie outside the frustum cannot be seen by the camera and they are culled (not renderered) by default. In general this is a good thing, however, sometimes it is not what you want and you can disable it for a specific object by setting [Object3D.frustumCulled](https://threejs.org/docs/#api/core/Object3D.frustumCulled) to `false`.

{{% /aside %}}

In practice you want the area contained within the viewing frustum to be as small as possible, both to increase performance and to reduce dreaded floating-point errors which will make object pop in out and of existence. So you'll set near as big as possible and far as small as possible. For now the values which we set above will be fine.