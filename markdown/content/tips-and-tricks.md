---
title: "The Big List of three.js Tips and Tricks!"
date: 2018-01-01
description: "Here lie hundreds of tips, tricks, and suggestions for best practices while building a high performance three.js application."
weight: 9999
chapter: 'R'
contents: false
available: true
pagination: false
excludeFromTOC: false
hideWordCount: true
---

# The Big List of three.js Tips and Tricks!

Hey everyone! While writing the book I've been gathering a big list of tips, tricks, caveats, and gotchas. This page contains everything that I've found so far.

Not all the tips here have been experimentally verified, especially the performance tips. There are too many variables involved to blindly follow a list, so always make sure to test your app thoroughly and see what works for you. These are suggestions, not rules (mostly). That said, this page will have lots of useful tips for apps of any size.

If you have anything to add or notice any mistakes, [let me know](/contact/) and I'll update the page.

Most of the info here is not specific to three.js, or even WebGL, but will work in any real-time graphics application or framework.

Happy Coding!

## Beginner Friendly Tips, or *Help! Why Can't I See Anything?* {#basic}

You've followed a couple of basic tutorials and everything worked out fine. Now you're creating an app of your own and you've set everything up _exactly_ as the tutorial says. But you just can't see anything! WTH??

Here are some things you can do to help figure out the problem.

### 1. Check the [browser console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console) for error messages {#error-message-check}

But you already did that, right?

### 2. Set the background color to something other than black {#background-color-check}


Staring at a black canvas? It's hard to tell whether something is happening or not if all you can see is black. Try setting the background color to red:

{{< code lang="js" linenos="false" >}}
``` js
import {
  Color
} from './vendor/three/build/three.module.js';

scene.background = new Color('red');
```
{{< /code >}}

If you get a red canvas, then at least your `renderer.render` calls are working, and you can move on to figuring out what else is wrong.

### 3. Make sure you have a light in your scene and that it's illuminating your objects {#light-check}

Just as in the real world, most materials in three.js need light to be seen.

### 4. Overide all materials in the scene with a `MeshBasicMaterial` {#material-check}

One material that doesn't require light to be visible is the [`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial). If you are having trouble getting objects to show up, you can temporarily override all the materials in your scene with `MeshBasicMaterial`. If the objects magically appear when you do this, then your problem is a lack of light.

{{< code lang="js" linenos="false" >}}
``` js
import {
  MeshBasicMaterial
} from './vendor/three/build/three.module.js';

scene.overrideMaterial = new MeshBasicMaterial({color: 'green'});
```
{{< /code >}}

### 5. Is your object within the camera's viewing frustum? {#frustum-check}

If your object is not inside the [viewing frustum](/book/first-steps/first-scene/#viewing-frustum), it will get clipped. Try making your far clipping plane really big:

{{< code lang="js" linenos="false" >}}
``` js
camera.far = 100000;
camera.updateProjectionMatrix();
```
{{< /code >}}

Remember this is just for testing though! The camera's frustum is measured in meters, and you should make it as small as possible for best performance. Once your scene is set up and working correctly, reduce the size of your frustum as much as possible.

### 6. Is your camera inside the object? {#camera-check}

By default, everything gets created at the point $(0,0,0)$, AKA the **origin**. Make sure you have moved your camera back so that you can see your scene!

{{< code lang="js" linenos="false" >}}
``` js
camera.position.z = 10;
```
{{< /code >}}

### 7. Think carefully about the scale of your scene {#scale-check}

Try to visualize your scene and remember that one unit in three.js is one meter. Does everything fit together in a reasonably logical manner? Or perhaps you cannot see anything because the object you just loaded is only 0.00001 meters wide. Wait, what's that tiny black dot in the middle of the screen?

## General Tips

1. Object creation in JavaScript is expensive, so don't create objects in a loop. Instead, create a single object such as a [Vector3](https://threejs.org/docs/#api/en/math/Vector3) and use [`vector.set()`](https://threejs.org/docs/#api/en/math/Vector3.set) or similar methods to reuse a that inside the loop.
2. The same goes for your render loop. To make sure your app runs at a buttery smooth sixty frames per second, do as little work as possible in your render loop. Don't create new objects every frame.
3. Always use [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry) instead of [`Geometry`](https://threejs.org/docs/#api/en/core/Geometry), it's faster.
4. The same goes for the pre-built objects, always use the buffer geometry version ([`BoxBufferGeometry`](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry) rather than [`BoxGeometry`](https://threejs.org/docs/#api/en/geometries/BoxGeometry)).
5. Always try to reuse objects such as objects, materials, textures etc. (although updating some things may be slower than creating new ones, see texture tips below).

## Work in SI Units

three.js is uses SI units everywhere. If you also use SI units, you will find that things work more smoothly. If you do use a different kind of unit for some reason, such as inches (_shudder_), make sure that you have a good reason for doing so.

### SI Units

* Distance is measured in **meters** (1 three.js unit = 1 meter).
* Time is measured in seconds.
* Light is measured in SI light units, [Candela](http://www.si-units-explained.info/luminosity/) (cd), Lumen (lm), and Lux (lx) (as long as you turn on `renderer.physicallyCorrectLights`, at least).

If you are creating things on a truly epic scale (space simulations and things like that), either use a scaling factor or switch to using a [logarithmic depth buffer](http://threejs.org/examples/#webgl_camera_logarithmicdepthbuffer).

## Accurate Colors

For (nearly) accurate colors, use these settings for the renderer:

{{< code lang="js" linenos="false" >}}
``` js
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
```
{{< /code >}}

For colors do this:

{{< code lang="js" linenos="false" >}}
``` js
const color = new Color(0x800080);
color.convertSRGBToLinear();
```
{{< /code >}}

Or, in the more common case of using a color in a material:

{{< code lang="js" linenos="false" >}}
``` js
const material = new MeshBasicMaterial({ color:0x800080});
material.color.convertSRGBToLinear();
```
{{< /code >}}

Finally, to get (nearly) correct colors in your textures, **you need to set the texture encoding for the color, environment, and emissive maps _only_**:

{{< code lang="js" linenos="false" >}}
``` js
import {
  sRGBEncoding
} from './vendor/three/build/three.module.js';

const colorMap = new TextureLoader().load('colorMap.jpg');
colorMap.encoding = sRGBEncoding;
```
{{< /code >}}

All other texture types should remain in linear color space. This is the default, so you don't need to change the encoding for any textures other than color, environment, and emissive maps.

Note that I'm saying **nearly correct** here since three.js color management is not quite correct at the moment. Hopefully, it will be fixed soon, but in the meantime, any inaccuracy in color will be so minor that it's very unlikely anybody will notice unless you are doing scientific or medical renderings.

## JavaScript

### Don't assume you know what will be faster

The JavaScript engines used by web browsers change frequently and do an amazing amount of optimization of your code behind the scenes. Don't trust your intuition about what will be faster, always test. Don't listen to articles from a few years ago telling you to avoid certain methods such as `array.map` or `array.forEach`. Test these for yourself, or find articles from the last few months with proper tests.

### Use a style guide and linter

Personally, I use a combination of [Eslint](https://eslint.org/), [Prettier](https://prettier.io/), and the [Airbnb style guide](https://github.com/airbnb/javascript). This took me around 30 minutes to set up in VSCode using [this tutorial](https://www.robinwieruch.de/how-to-use-prettier-vscode) ([part 2](https://www.robinwieruch.de/prettier-eslint)), and now I never have to waste my time with formatting, linting, or wondering whether a particular piece of syntax is a good idea, ever again.

Many people who work with three.js prefer [**Mr.doob's Code Style™**](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style%E2%84%A2) over Airbnb, so if you prefer to use that just replace [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) plugin with [eslint-config-mdcs](https://www.npmjs.com/package/eslint-config-mdcs).

## Models, Meshes and Other Visible Thing

1. Avoid using common text-based 3D data formats, such as Wavefront OBJ or COLLADA, for asset delivery. Instead, use formats optimized for the web, such as glTF.
2. Use Draco mesh compression with glTF. Sometimes this reduces glTF files to less than 10% of their original size!
3. Alternatively, there is a new kid on the block called [gltfpack](https://github.com/zeux/meshoptimizer#gltfpack) which in some cases may give even better results than Draco.
4. If you need to make large groups of objects visible and invisible (or add/remove them from your scene), consider using [Layers](https://threejs.org/docs/#api/en/core/Layers) for best performance.
5. Objects at the same exact same position cause flickering (Z-fighting). Try offsetting things by a tiny amount like 0.001 to make things look like they are in the same position while keeping your GPU happy.
6. Keep your scene centered around the origin to reduce floating-point errors at large coordinates.
7. Never move your `Scene`. It gets created at $(0,0,0)$, and this is the default frame of reference for all the objects inside it.

## Camera

1. Make your frustum as small as possible for better performance. It's fine to use a large frustum in development, but once you are fine-tuning your app for deployment, make your frustum as small as possible to gain a few vital FPS.
2. Don't put things right on the far clipping plane (especially if your far clipping plane is really big), as this can cause flickering.

## Renderer

1. Don't enable [`preserveDrawingBuffer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) unless you need it.
2. Disable the alpha buffer unless you need it.
3. Don't enable the stencil buffer unless you need it.
4. Disable the depth buffer unless you need it (but you probably do need it).
5. Use `powerPreference: "high-performance"` when creating the renderer. This _may_ encourage a user's system to choose the high-performance GPU, in multi-GPU systems.
6. Consider only rendering when the camera position changes by epsilon or when an animation happens.
7. If your scene is static and uses `OrbitControls`, you can listen for the control's `change` event. This way you can render the scene only when the camera moves:

{{< code lang="js" linenos="false" >}}
``` js
OrbitControls.addEventListener( 'change', () => renderer.render( scene, camera ) );
```
{{< /code >}}

You won't get a higher frame rate from the last two, but what you will get is less fans switching on, and less battery drain on mobile devices.

Note: I've seen a few places around the web recommending that you disable anti-aliasing and apply a post-processing AA pass instead. In my testing, this is not true. On modern hardware built-in MSAA seems to be extremely cheap even on low-power mobile devices, while the post-processing FXAA or SMAA passes cause a considerable frame rate drop on every scene I've tested them with, and are also lower quality than MSAA.

## Lights

1. Direct lights (`SpotLight`, `PointLight`, `RectAreaLight`, and `DirectionalLight`) are slow. Use as few direct lights as possible in your scenes.
2. Avoid adding and removing lights from your scene since this requires the `WebGLRenderer` to recompile all shader programs (it does cache the programs so subsequent times that you do this it will be faster than the first). Instead, use `light.visible = false` or `light.intensiy = 0`.
3. Turn on `renderer.physicallyCorrectLights` for accurate lighting that uses SI units.

## Shadows

1. If your scene is static, only update the shadow map when something changes, rather than every frame.
2. Use a [`CameraHelper`](https://threejs.org/docs/#api/en/helpers/CameraHelper) to visualize the shadow camera's viewing frustum.
3. Make the shadow frustum as small as possible.
4. Make the shadow texture as low resolution as possible.
5. Remember that point light shadows are more expensive than other shadow types since they must render six times (once in each direction), compared with a single time for `DirectionalLight` and `SpotLight` shadows.
6. While we're on the topic of `PointLight` shadows, note that the `CameraHelper` only visualizes **one out of six** of the shadow directions when used to visualize point light shadows. It's still useful, but you'll need to use your imagination for the other five directions.

## Materials

1. `MeshLambertMaterial` doesn't work for shiny materials, but for matte materials like cloth it will give very similar results to `MeshPhongMaterial` but is faster.
2. If you are using morph targets, make sure you set [`morphTargets = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphTargets) in your material, or they won't work!
3. Same goes for [morph normals](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphNormals).
4. And if you're using a [SkinnedMesh](https://threejs.org/docs/#api/en/objects/SkinnedMesh) for skeletal animations, make sure that [`material.skinning = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.skinning).
5. Materials used with morph targets, morph normals, or skinning can't be shared. You'll need to create a unique material for each skinned or morphed mesh ([`material.clone()`](https://threejs.org/docs/#api/en/materials/Material.clone) is your friend here).

## Custom Materials

1. Only update your uniforms when they change, not every frame.

## Geometry

1. Avoid using [`LineLoop`](https://threejs.org/docs/#api/en/objects/LineLoop) since it must be emulated by line strip.

## Textures

1. All of your textures need to be power of two (POT) size: $1, 2, 4, 8, 16, \dots, 512, 2048, \dots$.
2. Don't change the dimensions of your textures. Create new ones instead, [it's faster](http://webglinsights.github.io/tips.html)
3. Use the smallest texture sizes possible (can you get away with a 256x256 tiled texture? You might be surprised!).
4. Non-power-of-two (NPOT) textures require linear or nearest filtering, and clamp-to-border or clamp-to-edge wrapping. Mipmap filtering and repeat wrapping are not supported. But seriously, just don't use NPOT textures.
5. All textures with the same dimensions are the same size in memory, so JPG may have a smaller file size than PNG, but it will take up the same amount of memory on your GPU.

## Antialiasing

1. The worst-case scenario for antialiasing is geometry made up of lots of thin straight pieces aligned parallel with one another. Think metal window blinds or a lattice fence. If it's at all possible, **don't include geometry like this in your scenes.** If you have no choice, consider replacing the lattice with a texture instead, as that may give better results.

## Post-Processing

1. The built-in antialiasing doesn't work with post-processing (at least in WebGL 1). You will need to do this manually, using [FXAA](https://threejs.org/examples/#webgl_postprocessing_fxaa) or [SMAA](https://threejs.org/examples/#webgl_postprocessing_smaa) (probably faster, better)
2. Since you are not using the built-in AA, be sure to disable it!
3. three.js has loads of post-processing shaders, and that's just great! But remember that each pass requires rendering your entire scene. Once you're done testing, consider whether you can combine your passes into one single custom pass. It's a little more work to do this, but can come with a considerable performance increase.

## Disposing of Things

Removing something from your scene?

First of all, **consider not doing that**, especially if you will add it back again later. You can hide objects temporarily using `object.visible = false` (works for lights too), or `material.opacity = 0`. You can set `light.intensity = 0` to disable a light without causing shaders to recompile.

If you do need to remove things from your scene *permanently*, read this article first: [How to dispose of objects](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).

## Updating Objects in Your Scene?

Read this article: [How to update things](https://threejs.org/docs/#manual/en/introduction/How-to-update-things).

## Performance

1. Set `object.matrixAutoUpdate = false` for static or rarely moving objects and manually call `object.updateMatrix()` whenever their position/rotation/quaternion/scale are updated.
2. **Transparent objects are slow.** Use as few transparent objects as possible in your scenes.
3. use [`alphatest`](https://threejs.org/docs/#api/en/materials/Material.alphaTest)  instead of standard transparency if possible, it's faster.
4. When testing the performance of your apps, one of the first things you'll need to do is check whether it is CPU bound, or GPU bound. Replace all materials with basic material using `scene.overrideMaterial` (see beginners tips and the start of the page). If performance increases, then your app is GPU bound. If performance doesn't increase, your app is CPU bound.
5. When performance testing on a fast machine, you'll probably be getting the maximum frame rate of 60FPS. Run chrome using `open -a "Google Chrome" --args --disable-gpu-vsync` for an unlimited frame rate.
6. Modern mobile devices have high pixel ratios as high as 5 - consider limiting the max pixel ratio to 2 or 3 on these devices. At the expense of some very slight blurring of your scene you will gain a considerable performance increase.
7. Bake lighting and shadow maps to reduce the number of lights in your scene.
8. Keep an eye on the number of drawcalls in your scene. A good rule of thumb is fewer draw calls = better performance.
9. Far away objects don't need the same level of detail as objects close to the camera. There are many tricks used to increase performance by reducing the quality of distant objects. Consider using a [LOD](https://threejs.org/docs/#api/en/objects/LOD) (Level Of Detail) object. You may also get away with only updating position / animation every 2nd or 3rd frame for distant objects, or replacing them with a billboard - that is, a drawing of the object.

## Advanced Tips

1. Don't use `TriangleFanDrawMode`, it's slow.
2. Use geometry instancing when you have hundreds or thousands of similar geometries.
3. Animate on the GPU instead of the CPU, especially when animating vertices or particles (see [THREE.Bas](https://github.com/zadvorsky/three.bas) for one approach to doing this).

## Read These Pages Too!

The Unity and Unreal docs also have pages with lots of performance suggestions, most of which are equally relevant for three.js. Read over these as well:

* [Optimizing graphics performance (Unity)](https://docs.unity3d.com/Manual/OptimizingGraphicsPerformance.html)
* [Performance Guidelines for Artists and Designers (Unreal)](https://docs.unrealengine.com/en-us/Engine/Performance/Guidelines)

WebGL Insights has lots of tips collected from throughout the book. It's more technical, but worth reading too, especially if you are writing your own shaders.

* [WebGL Insights Tips](http://webglinsights.github.io/tips.html)

## References

* [@jackrugile and @mrdoob on Twitter](https://mobile.twitter.com/jackrugile/status/966440290885156864)
* [A-Painter performance optimizations](https://blog.mozvr.com/a-painter-performance-optimizations)
