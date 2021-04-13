---
title: "Rendering Your Scenes with WebGL"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 1300
chapter: "13"
---

# Rendering Your Scenes with WebGL

{{< figure src="rendering/banner.jpg" alt="" class="banner" >}}

In the case of the three.js WebGLRenderer, we're using a technique known as **forward shading**, AKA **forward rendering**, which means that the process is actually very linear, and the above 3 step process is a fairly accurate description of how lighting is applied to our surfaces.

Another popular pipeline variation is called **deferred shading/rendering**, and is the default rendering pipeline used by game engines such as [Unreal](https://www.unrealengine.com/en-US/what-is-unreal-engine-4) and [Unity](https://unity3d.com/).


In a forward rendering pipleine, each light we add to our scene has a significant overhead, and as a result we'll find ourself severely limited in the amount and types of lighting that we can use. By contrast, in the deferred rendering pipeline, lighting is taken out of the process and applied at the end, meaning that we can add many more lights and have them move around in our scene.

There is good argument to be made that the deferred rendering pipeline is superior, but unfortunately this is one area where the limitations of WebGL become apparent, and in practice for WebGL applications, forward rendering will have better performance and we'll have to live with the limitations on lighting.

https://gamedevelopment.tutsplus.com/articles/forward-rendering-vs-deferred-rendering--gamedev-12342

## Chapter 11.1 [The WebGLRenderer in Depth](/book/rendering/webglrenderer/)

## Chapter 11.2 [Rendering Off-Screen to a WebGLRendererTarget](/book/rendering/render-targets/)



The [`WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer) takes as input a Scene filled with 3D objects, and a Camera, and outputs beautiful pictures onto your screen using the power of your graphics card. We'll dedicate this entire section to learning how this powerful renderer works.

There are other renderers available, although you'll need to include them separately to the main three.js script. Most useful are the [CSS2DRender](https://threejs.org/docs/#examples/renderers/CSS2DRenderer) and [CSS3DRender](https://threejs.org/docs/#examples/renderers/CSS3DRenderer) which can be used to combine HTML elements seamlessly with your 3D scenes.

Other renderers, such as the [RayTraceRender](https://threejs.org/examples/#raytracing_sandbox), the [SoftwareRenderer](https://threejs.org/examples/#software_geometry_earth), and the [https://threejs.org/examples/#svg_lines](SVGRenderer) serve as replacements for the WebGLRenderer. These days though, they are much less useful and you should always use the WebGLRenderer in a production app, so we will not cover them further here.


