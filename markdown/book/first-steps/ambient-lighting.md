---
title: "Ambient Lighting: Illumination from Every Direction"
description: "Ambient light is scene illumination that doesn't come from a specific point in space. There are two ambient light classes available in three.js: AmbientLight and HemisphereLight. Here we test each of these, observing the effect on our scene."
date: 2018-04-02
weight: 110
chapter: "1.10"
available: true
showIDE: true
IDEFiles: [
  "assets/textures/uv-test-bw.png",
  "assets/textures/uv-test-col.png",
  "worlds/first-steps/ambient-lighting/src/World/components/camera.js",
  "worlds/first-steps/ambient-lighting/src/World/components/cube.js",
  "worlds/first-steps/ambient-lighting/src/World/components/lights.start.js",
  "worlds/first-steps/ambient-lighting/src/World/components/lights.final.js",
  "worlds/first-steps/ambient-lighting/src/World/components/scene.js",
  "worlds/first-steps/ambient-lighting/src/World/systems/controls.js",
  "worlds/first-steps/ambient-lighting/src/World/systems/renderer.js",
  "worlds/first-steps/ambient-lighting/src/World/systems/Resizer.js",
  "worlds/first-steps/ambient-lighting/src/World/systems/Loop.js",
  "worlds/first-steps/ambient-lighting/src/World/World.start.js",
  "worlds/first-steps/ambient-lighting/src/World/World.final.js",
  "worlds/first-steps/ambient-lighting/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "vendor/three/examples/jsm/controls/OrbitControls.js",
  "worlds/first-steps/ambient-lighting/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['assets', 'systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/ambient-lighting/'
IDEActiveDocument: 'src/World/components/lights.js'
---



# Ambient Lighting: Illumination from Every Direction

{{< inlineScene entry="first-steps/illumination-problem.js" class="round small right" >}}

At the end of the last chapter, we discovered a rather glaring problem with our lighting setup. Our scene is illuminated using a single `DirectionalLight`, and although this type of light fills the entire scene with light rays, all the rays shine in a single direction. Faces of the cube in the direct path of the light are brightly illuminated. However, as soon as we rotate the camera to see another direction, we find that **any faces of the cube that point away from the direction of the light rays don't receive any light at all!**

{{< clear >}}

{{< figure src="first-steps/directional_light.svg" alt="Light rays of a directional light" lightbox="true" caption="Any faces of the cube not in the path of the light rays <br> don't receive any light at all" class="medium left" >}}

In this chapter, we'll investigate what's going on here, and explore some methods for improving our lighting setup. Along the way, we'll find the time for a brief review of some of lighting techniques commonly used when working with three.js.

### Lighting in the Real World

In the real world, an infinite number of light rays reflect and bounce an infinite number of times from all the objects in a scene, gradually fading and changing color with each bounce until finally, they reach our eyes or cameras. This creates the beautiful and subtle patterns of light and shadows we see every day in the world around us.

{{< figure src="first-steps/light_study.jpg" alt="A scene demonstrating the beauty of light in the real world" title="Photo credit: T Cud on Unsplash" alt="A scene demonstrating direct and indirect lighting." lightbox="false" class="" >}}

### Simulating Lighting in Real-Time

Unfortunately for us, computers have trouble simulating the infinite. A technique called [ray tracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) can be used to simulate a few thousand lights rays each bouncing a few times around the scene. However, it takes too much processing power to render frames in real-time using this technique, so ray-tracing and related techniques like [path tracing](https://en.wikipedia.org/wiki/Path_tracing) are better suited for creating pre-rendered images or animations.

Instead, as we discussed in {{< link path="/book/first-steps/physically-based-rendering/" title="" >}}, real-time graphics engines split lighting into two parts:

1. **Direct lighting**: light rays that come directly from a light source and hit an object.
2. **Indirect lighting**: light rays that have bounced off the walls and other objects in the room before hitting an object, changing color and losing intensity with each bounce.

There is a third category that aims to perform direct and indirect lighting at the same time, called [global illumination](https://en.wikipedia.org/wiki/Global_illumination), of which ray tracing and path tracing are two examples. Indeed, there are a huge number of techniques for simulating or approximating lighting in the field of 3D computer graphics. Some of these techniques simulate direct lighting, some simulate indirect lighting, while others simulate both. Most of these techniques are too slow to use on the web where we have to consider people accessing our app from low powered mobile devices. However, even when we limit ourselves to only the techniques suitable for real-time use _and_ available in three.js, the number of lighting methods we can use is still quite high.

Creating high-quality lighting using three.js is a matter of choosing a combination of these techniques to create a complete lighting setup. In three.js, the light classes are divided into two categories to match the two categories of lighting:

1. **Direct lights**, which simulate direct lighting.
2. **Ambient lights**, which are a cheap and somewhat believable way of faking indirect lighting.

The `DirectionalLight` currently illuminating our scene is a form of direct lighting. In this chapter, we'll pair this light with an ambient light. Ambient lighting is one of the simplest techniques for adding indirect lighting to your scenes, and a `DirectionalLight` paired with an ambient light is one of the most common lighting setups.

But first, let's take a brief tour of some of the lighting techniques available to us when using three.js.

## A Brief Overview of Lighting Techniques

### Multiple Direct Lights

One solution to the problem of our poorly illuminated cube is to add more direct lights, like the `DirectionalLight` or `SpotLight`, until the objects in your scene are illuminated from all angles. However, this approach creates a new set of problems:

1. We have to keep track of the lights to make sure all directions are illuminated.
2. Lights are expensive, and we want to add as few lights as possible to our scenes.

Adding more and more direct lights to your scene will quickly kill you framerate, so direct lights alone are rarely the best choice.

### No Lights at All!

Another lighting technique is to avoid using lights completely. Some materials, such as the `MeshBasicMaterial`, don't need lights to be seen. You can get nice results using a `MeshBasicMaterial` and appropriate {{< link path="/book/first-steps/textures-intro/" title="textures" >}}.

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="The MeshBasicMaterial in action" caption="The MeshBasicMaterial in action" >}}

In the above scene, first, set the color to white (`0xffffff`), and then change `.map` to the _bricks_ texture. Next, remove the brick texture and set the environment map (`.envMap`) to _reflection_. As you can see, the `MeshBasicMaterial` is not quite so basic as the name suggests. Nonetheless, this solution is more appropriate for intentionally low-fidelity scenes, or when performance is of utmost importance.

### Image-Based Lighting (IBL)

Image-based lighting is the name for a family of techniques that involve pre-calculating lighting information and storing it in textures. The most important IBL technique is [environment mapping](https://en.wikipedia.org/wiki/Reflection_mapping) (also known as reflection mapping), which you saw a moment ago when you set the `MeshBasicMaterial.envMap`.

{{< iframe src="https://threejs.org/examples/webgl_materials_envmaps.html" height="500" title="Image Based Lighting (IBL) in action" caption="Image Based Lighting (IBL): the scene background is reflected on the sphere" >}}

Environment maps are usually generated using specialized photography techniques or external 3D rendering programs. There are several formats used to store the resulting images, of which two are demonstrated in the above scene: cube maps and equirectangular maps. Click the options in the menu to see an example of each. Environment mapping is one of the most powerful lighting techniques available in three.js, and we'll explore this in detail later.

{{% note %}}
TODO-LINK: add link to IBL section

### Light Probes

{{< iframe src="https://threejs.org/examples/webgl_lightprobe.html" height="500" title="" >}}

{{% /note %}}

{{% note %}}
TODO-LOW: add light probes overview
{{% /note %}}

### The Fast and Easy Solution: Ambient Lighting

**Ambient lighting** is a method of faking indirect lighting which is both fast and easy to set up while still giving reasonable results. There are two ambient light classes available in the three.js core:

* **The [`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight) adds a constant amount of light to every object from all directions.**
* **The [`HemisphereLight`](https://threejs.org/docs/#api/en/lights/HemisphereLight) fades between a sky color and a ground color and can be used to simulate many common lighting scenarios.**

We mentioned these briefly back in {{< link path="/book/first-steps/physically-based-rendering/#the-three-js-light-classes" title="" >}}. Using either of these lights follows the same process as using the `DirectionalLight`. Simply create an instance of the light, then add it to your scene. The following scene demonstrates using a `HemisphereLight` in combination with a `DirectionalLight` to give the effect of a bright outdoor scene.

{{< iframe src="https://threejs.org/examples/webgl_lights_hemisphere.html" height="500" title="The HemisphereLight in action" caption="A simple scene lit by a directional light and a hemisphere light" >}}

As you can see, the result is not realistic. Ambient lighting paired with direct lighting is more geared towards performance than quality. However, you could hugely increase the quality of this scene without changing the lighting setup, by using a different model and background or improving the model's material.

#### Working with Ambient Lights

Like the direct lights, ambient lights inherit from [the base `Light` class](https://threejs.org/docs/#api/en/lights/Light), so they have `.color` and `.intensity` properties. `Light`, in turn, inherits from `Object3D`, so **all lights also have `.position`, `.rotation` and `.scale` properties.** However, rotating or scaling lights has no effect. Changing the position of the `AmbientLight` has no effect either.

Ambient lights affect all objects in the scene. **As a result, there's no need to add more than one ambient light to your scene.** Unlike the direct lights (except for `RectAreaLight`), ambient lights cannot cast shadows.

As usual, to use either of these light classes, you must first import them. Import both classes within the lights module now. We'll spend the rest of this chapter experimenting with them.

{{< code file="worlds/first-steps/ambient-lighting/src/World/components/lights.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="2 4"  caption="_**lights.js**_: import both ambient light classes" >}}{{< /code >}}

## The `AmbientLight`

The [`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight) is the cheapest way of faking indirect lighting in three.js. This type of light adds a constant amount of light from every direction to every object in the scene. It doesn't matter where you place this light, and it doesn't matter where other objects are placed relative to the light. This is not at all similar to how light in the real world works. Nonetheless, in combination with one or more direct lights, the `AmbientLight` gives OK results.

### Add an `AmbientLight` to the Scene

As with the `DirectionalLight`, pass the [`.color`](https://threejs.org/docs/#api/en/lights/Light.color) and [`.intensity`](https://threejs.org/docs/#api/en/lights/Light.intensity) parameters to the constructor:

{{< code lang="js" linenos="" linenostart="7" hl_lines="8 13" caption="_**lights.js**_: create an AmbientLight" >}}
function createLights() {
  const ambientLight = new AmbientLight('white', 2);

  const mainLight = new DirectionalLight('white', 5);
  mainLight.position.set(10, 10, 10);

  return { ambientLight, mainLight };
}
{{< /code >}}

Over in World, the `createLights` function now returns two lights. Add both of them to the scene:

{{< code file="worlds/first-steps/ambient-lighting/src/World/World.final.js" from="17" to="33" lang="js" linenos="true" hl_lines="27, 30"  caption="_**World.js**_: add the ambient light to the scene" >}}{{< /code >}}

{{% note %}}
TODO-LOW: once destructuring assignment is documented, link it here
{{% /note %}}

We'll usually set the intensity of the `AmbientLight` to a lower value than the direct light it has been paired with. Here, white light with a low intensity results in a dim gray ambient illumination. Combined with the single bright `DirectionalLight`, this dim ambient light solves our lighting issues and the rear faces of the cube become illuminated:

{{< inlineScene entry="first-steps/ambient-with-directional.js" >}}

{{% note %}}
TODO-LOW: the lighting in this chapter needs to be improved
TODO-LOW: add controls to disable direct light to allow viewing ambient on it's own
{{% /note %}}

However, the lighting on the rear faces of the cube looks rather dull. To make a setup based around `AmbientLight` and `DirectionalLight` look good, we would need to add multiple directional lights with varying direction and intensity. That runs into many of the same problems we described above for [a setup using multiple direct lights](#multiple-direct-lights). As we'll see in a moment, the `HemisphereLight` gives better results here, for almost no additional performance cost.

That doesn't mean the `AmbientLight` is useless. The `HemisphereLight` doesn't suit every scene, for example, in which case you can fall back to an `AmbientLight`. Also, this light is the cheapest way to increase the overall brightness or add a slight color tint to a scene. You'll sometimes find it useful for modulating other kinds of lighting such as environment maps or for adjusting shadow darkness.

### The `AmbientLight` Doesn't Show Depth {#no-depth}

As we mentioned in {{< link path="/book/first-steps/physically-based-rendering/#lighting-and-depth" title="" >}}, our eyes use differences in shading across the surface of an object to determine depth. However, the light from an ambient light shines equally in all directions, so the shading is uniform and gives us no information about depth. Consequently, any object illuminated using only an `AmbientLight` will not appear to be 3D.

This is similar to how the `MeshBasicMaterial` works, to the point of being indistinguishable. One of these cubes has a `MeshBasicMaterial` and one has a `MeshStandardMaterial` illuminated only by an `AmbientLight`. See if you can tell them apart:

{{< inlineScene entry="first-steps/ambient-basic-comparison.js" >}}

## The `HemisphereLight`

Light from a [`HemisphereLight`](https://threejs.org/docs/#api/en/lights/HemisphereLight) fades between a sky color at the top of the scene and a ground color at the bottom of the scene. Like the `AmbientLight`, this light makes no attempt at physical accuracy. Rather, the `HemisphereLight` was created after observing that in many of the situations where you find humans, the brightest light comes from the top of the scene, while light coming from the ground is usually less bright.

For example, in a typical outdoor scene, objects are brightly lit from above by the sun and sky and then receive secondary light from sunlight reflecting off the ground. Likewise, in an indoor environment, the brightest lights are usually on the ceiling and these reflect off the floor for dim secondary illumination.

We can adjust the fading between the sky and ground by changing the light's `.position`. As with all light types, `.rotation` and `.scale` have no effect. The `HemisphereLight` constructor takes the same `.color` and `.intensity` parameters as all the other lights, but has an additional [`.groundColor`](https://threejs.org/docs/#api/en/lights/HemisphereLight.groundColor) parameter. Generally, we will use a bright sky `.color`, and a much darker `.groundColor`:

{{< code from="10" to="14" file="worlds/first-steps/ambient-lighting/src/World/components/lights.final.js" lang="js" linenos="true" hl_lines="" caption="_**lights.js**_: create a `HemisphereLight`" header="" footer="" >}}{{< /code >}}

We can get decent results using a single `HemisphereLight` with **no direct lights at all**:

{{< inlineScene entry="first-steps/hemisphere-only.js" >}}

{{% note %}}
TODO-LOW: improve the above scene
{{% /note %}}

However, since the `HemisphereLight` light does not shine from any particular direction, **there are no shiny highlights (AKA _specular highlights_) in this scene**. This is why we usually pair this type of light with at least one direct light. For outdoor scenes, try pairing the `HemisphereLight` with a single bright `DirectionalLight` representing the sun. For indoor scenes, you might use a `PointLight` to represent a lightbulb, or a `RectAreaLight` to simulate light coming through a bright window or from a strip light.

Ambient lights, especially the `HemisphereLight`, give great results for low performance cost, making them suitable for use on low-power devices. However, scenes in the real world have shadows, reflections, and shiny highlights, none of which can be added using ambient lighting alone. This means ambient lighting is best used in a supporting role alongside other techniques such as direct lighting or IBL.

Throughout the book, we'll explore many lighting solutions. Many of these give better results than ambient lights, but virtually none have a better performance/quality tradeoff.

## Challenges

{{% aside success %}}
### Easy

1. Temporarily disable the `mainLight` in the editor and then test each of the two ambient light classes alone. There are several ways to disable a light. Set `.intensity` to zero, don't add the light to the scene, or set `mainLight.visible` to `false`.

2. The effect of the `HemisphereLight` comes from the interplay of four properties: the sky `.color`, the `.groundColor`, the `.intensity` and the `.position`. Try adjusting each of these and observe the results. You may find this easier to see if you disable the main light first.

{{% /aside %}}

{{% aside %}}
### Medium

1. In the editor, we've given the `HemisphereLight` and the `DirectionalLight` both an intensity of five. We did this to highlight the effect of the ambient light, however, usually, we would make the direct light stronger than the ambient light. Can you improve the quality of the lighting by adjusting the intensity and color of the two lights?

2. What about adding more direct lights, either the `DirectionalLight`, or one of the other types? Does the scene improve when you add more of these, pointing from different directions?

3. What about more ambient lights? Or an `AmbientLight` and a `HemisphereLight` at the same time? What effect does this have on the scene?

_Remember: light from the `DirectionalLight` shines {{< link path="/book/first-steps/physically-based-rendering/#introducing-the-directionallight" title="from `light.position` to `light.target.position`" >}} by default. If you adjust the light's position, it will continue to point at the same spot, but now the rays will come in at a different angle._

{{% /aside %}}

{{% aside warning %}}
### Hard

1. Another solution to our problem from the start of the chapter is to add a light as a child of the camera. That way, when the camera moves, the light moves too. You can think of this as being like a camera with a torch strapped to the side. Using this approach, we can light the scene using a single `DirectionalLight` or `SpotLight`. Try this out. First, remove the `ambientLight`, then add the camera to the scene, and finally, add the `mainLight` to the camera.

_Note: when you add the light to the camera instead of the scene, you are {{< link path="/book/first-steps/transformations/#moving-an-object-between-coordinate-systems" title="attaching it to the camera's local space" >}}. You may have to adjust the light's position for best results._

{{% /aside %}}

{{% note %}}
TODO-LOW: document adding light.target to the scene here
{{% /note %}}
