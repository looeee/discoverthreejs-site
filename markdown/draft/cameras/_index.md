---
title: "Cameras and Camera Controls"
description: "There are two main camera types in three.js - the Perspective camera, that mimics the way our eyes see the world, and the Orthographc camera, which can be used to create 2D scenes or 2D graphical overlays"
date: 2018-04-02
sectionHead: true
weight: 500
chapter: "5"
kind: "page"
---

# Cameras and Camera Controls

{{< figure src="cameras/banner2.jpg" alt="Photo credit D A V I D S O N L U N A from Unsplash" class="banner" >}}

**Coming up in Section Four: Cameras, Cameras, Cameras!**

Welcome back! Now that we've finished Section Three, we have all the basics covered. We know all about how to set up a highly performant, professional quality three.js application, we're up to speed with modern JavaScript and next-gen web development techniques, and we have a streamlined app template that we can use to quickly get up and running with every kind of project from tiny experiments to full-scale professional applications.

We've also started to look under the hood of three.js to really understand the inner workings of the library, and we now have a fairly good idea of how it's put together, how inheritance works and how the Scene graph is used position and control objects in our scene. We've even started to delve into the really technical stuff such as **transformation matrices** and **coordinate systems**.

Now it's time to start going deeper into each part of the library. From here on, each section will lead gracefully into the next, but while it's recommended that you at least skim the first three sections before moving on, from now on you can read the sections in the order that you prefer. We'll try to make as few assumptions as possible about how much of the other sections you've read, and when we do use info from another section we'll be sure to reference it clearly.

First up is cameras, concentrating on the base [Camera](https://threejs.org/docs/#api/en/cameras/Camera) class and the two main derived classes, the [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera), which mimics the way that you eyes view the world, and the [OrthographicCamera](https://threejs.org/docs/#api/en/cameras/OrthographicCamera), which we can use for everything 2D, such as full 2D scenes and in-game GUI systems (things like health bars and timers), as well as for situations in which we need an accurate representation of the size of our objects, such as architectural, CAD, or modeling programs.

## Chapter 4.1 [Working with the PerspectiveCamera](/book/cameras/perspective-camera/)

{{< figure src="first-steps/perspective_frustum.svg" alt="The Perspective Camera" lightbox="true" title="The Perspective Camera" class="" >}}

We originally introduced the PerspectiveCamera way back in [Ch 1.1: Hello Cube!](/book/first-steps/first-scene/#the-camera) This camera mimics the way that your eyes see the world, and you'll use this camera whenever you want to create a realistic looking 3D scene.

The `PerspectiveCamera` uses [perspective projection](https://en.wikipedia.org/wiki/Perspective_(graphical)) to map our 3D scenes onto our 2D screens. This kind of projection is important because it most closely mimics the way that our eyes view 3D. In other words, if we draw a 3D scene onto a 2D plane (paper, a computer screen, the wall of a cave or whatever) using perspective projection, then our eyes will interpret the 2D scene as if it was still three dimensional. In general, that's exactly what we want from our art, and the history of using this technique goes as far back as the ancient Egyptians, although it wasn't until the early Renaissance that it was given a mathematical basis, probably by [Brunelleschi and Toscanelli](https://en.wikipedia.org/wiki/Perspective_(graphical)#Renaissance:_mathematical_basis). If you want to read a bit of the history from an artistic perspective here's a nice short article from the [University of Carlow, Ireland](http://glasnost.itcarlow.ie/~powerk/GeneralGraphicsNotes/projection/perspective_projection.html).

Of particular importance when working with this type of camera is understanding at an intuitive level how to the camera's [frustum](https://en.wikipedia.org/wiki/Frustum) works, so we'll spend a good bit of this chapter focusing on the properties of the camera that  are used to define the frustum: the [Field of View](http://glasnost.itcarlow.ie/~powerk/GeneralGraphicsNotes/projection/perspective_projection.html), the [Aspect Ratio](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.aspect), the [Near Clipping Plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.near), and the [Far Clipping Plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.far).

{{< figure src="cameras/perspective-frustum.jpg" alt="The Perspective Camera's Viewing Frustum" lightbox="true" title="The Perspective Camera's Viewing Frustum" class="" >}}

It's important to note that, while the PerspectiveCamera is not a true physical camera, many of its properties do match up to a real world camera.

## Chapter 4.2 [Creating 2D Scenes and Overlays: The OrthographicCamera](/book/cameras/orthographic-camera/)

The OrthoGraphicCamera uses [orthographic projection](https://en.wikipedia.org/wiki/Orthographic_projection) to solve the problem of drawing 3D onto 2D.

From a mathematical perspective, the main difference between the two projection types is that there's no "vanishing point" - that is, parallel lines to not join up in the distance. This means that things do not get smaller as they move away from the camera. A cube 1 unit from the camera will be drawn at exactly the same size as a cube 1000 units from the camera.

The main applications of this are 2D scenes, and architectural or engineering applications such as CAD tools. If we look at the shape of the frustum, we'll see that it's similar to the perspective frustum, except that the top and bottom are of the same size.

{{< figure src="cameras/orthographic-frustum.jpg" alt="The Orthographic Camera's Viewing Frustum" lightbox="true" title="The Orthographic Camera's Viewing Frustum" class="" >}}

One common use case for orthographic projection is blueprints for things like houses, electronics, and so on. As you can see in the screenshot of the default viewport setup for most 3D modeling apps ([clara.io](https://clara.io/) in this case), one viewport shows us the model in perspective projection, while the other three show us orthographic views.

{{< figure src="cameras/viewports.png" alt="3D Modelling App Viewports" lightbox="true" title="3D Modelling App Viewports" class="border" >}}

When it comes to actually using this type of camera, most people will find that it's not as intuitive to set up as the `PerspectiveCamera`. After all, it's not natural for an apple one meter away to be the same size as an apple one kilometer away!

Fortunately, we'll find that with a bit of practice intuition comes quickly as we work through this chapter.

## Chapter 4.3 [Camera Controls: You've Seen OrbitControls, Now What About the Rest?](/book/cameras/camera-controls/)

In the final chapter of this section, we'll look at camera controls. Back in [Ch 1.5: Camera Controls and Global Illumination](/book/first-steps/camera-controls/#adding-camera-controls-to-our-app), we introduced the [`OrbitControls`](https://threejs.org/docs/#examples/controls/OrbitControls), which allows our camera to orbit around a target. Setting up these controls is as simple as adding the line:

{{< code lang="js" linenos="false" hl_lines="" >}}
const controls = new OrbitControls( camera, container );
{{< /code >}}

However, there's quite a few additional setting we can use to fine tune the orbit control's behavior and we'll take a look at those here.

After that, we'll take a brief look at the other control types available in the three.js repo. Most of them are just as easy to set up as the OrbitControls were. In total, there are seven types of controls types designed for moving the camera around:

* `DeviceOrientationControls` work with the gyroscope in your mobile device to move the camera around as reorient the device. They won't work on a device without the appropriate motion sensors
* `FirstPersonControls` allow you to move around your scene in the way you would move around the level in a first-person video game
* `FlyControls` would also be useful in a video game, but this time a space or airplane simulation
* `MapControls` are similar to `OrbitControls`, but the camera moves in a manner similar to the camera in Google maps
* `OrbitControls` should need no further explanation at this point
* `TrackballControls` and `OrthographicTrackballControls` are also quite similar to the `OrbitControls` and `MapControls`. The difference is that they don't retain the "up" direction, meaning that your scene will quickly end up "upside down" as you move the camera around.
* `PointerLockControls` take over your mouse completely so you no longer have to click to move the camera. However, you can no longer use the mouse to select anything on screen

Next, there are two control typed designed for moving objects around in the scene rather than the camera. Even though they don't technically fit in this section, we'll include them here as well:

* DragControls:  When applied to an object, these will allow us to click or touch to drag it around
* TransformControls: When applied to an object, these will overlay a "Transform Gizmo" on the object, which we can then use to either translate, scale, or rotate it

And then finally, there's the `EditorControls`, which we won't look at since they are used for control in the three.js [editor](https://threejs.org/editor/).

### Cameras _Not_ Covered in the Section

There are a couple of other camera types available in the three.js core, which we will not consider for now since they have special use cases or are rarely needed:

* the [ArrayCamera](https://threejs.org/docs/#api/en/cameras/ArrayCamera), it will not surprise you to hear, is an array of cameras, which can be used for [various effects](https://threejs.org/examples/#webgl_camera_array), but its most important function is that it's used by the renderer when viewing scenes in Virtual Reality mode. As such, it's rarely necessary to use an `ArrayCamera` directly
* [CubeCamera](https://threejs.org/docs/#api/en/cameras/CubeCamera) - this camera can be used to render a dynamic environment map, as you can see in the [dynamic cubemap](https://threejs.org/examples/#webgl_materials_cubemap_dynamic) example on the main three.js site. We'll learn how to do this for ourselves once we know what a Render Target is, in [Section 11: Rendering Your Scenes with WebGL](/book/rendering/)
* the [StereoCamera](https://threejs.org/docs/#api/en/cameras/StereoCamera) is a combination of two PerspectiveCameras used to create scenes that can be viewed with 3D glasses using either the [Anaglyph Effect](https://threejs.org/examples/#webgl_effects_anaglyph) (the older style of 3D that uses glasses with one red lens and one green lens) and the [parallax barrier](https://threejs.org/examples/#webgl_effects_parallaxbarrier) effect (the newer style of 3D that's all the rage in cinemas these days, as well as being used in 3D TVs)

One thing that all of these cameras have in common is that they solve the problem of projecting a 3D scene onto a 2D screen (or screens plural in the case of VR).


