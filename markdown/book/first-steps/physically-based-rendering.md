---
title: "Physically Based Rendering and Lighting"
description: "Amazingly, the tiny three.js core contains the same physically based rendering (PBR) algorithms used by giants like Unreal, Unity, Disney, and Pixar. Here, we show you how to use physically-accurate materials and lighting in your scenes."
date: 2018-04-02
weight: 104
chapter: "1.4"
available: true
showIDE: true
IDEFiles: [
  "worlds/first-steps/physically-based-rendering/src/World/components/camera.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/cube.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/lights.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/lights.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/scene.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/renderer.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/renderer.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/Resizer.js",
  "worlds/first-steps/physically-based-rendering/src/World/World.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/World.final.js",
  "worlds/first-steps/physically-based-rendering/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/physically-based-rendering/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/physically-based-rendering/'
IDEActiveDocument: 'src/World/components/cube.js'
---



# Physically Based Rendering and Lighting

Recently, [**physically based rendering**](https://en.wikipedia.org/wiki/Physically_based_rendering) (PBR) has become the industry-standard method of rendering both real-time and cinematic 3D scenes. As the name suggests, this rendering technique uses real-world physics to calculate the way surfaces react to light, taking the guesswork out of setting up materials and lighting in your scenes. PBR was created by Disney for their feature-length animations and is also used in modern game engines such as Unreal and Frostbite. Amazingly, the tiny (600kb when compressed) three.js core allows us to use the same physically correct rendering techniques as these industry-leading giants, and not only that, but we can run these even on low-power devices such as smartphones. Only a few years ago, this was cutting-edge tech that required huge banks of powerful computers, and now we can run this in a web browser, from anywhere.

{{< iframe src="https://threejs.org/examples/webgl_materials_standard.html" height="400" title="Physically based rendering in three.js" class="medium right" >}}

Using PBR in three.js is as simple as switching the material we use and adding a light source. We'll introduce the most important three.js PBR material, the `MeshStandardMaterial`, below. We won't get into the technical details of physically based rendering in this book, but if you're interested in learning more, the brilliant, Academy Award winning book (yes, they give Oscars to books, apparently) [Physically Based Rendering: From Theory To Implementation](http://www.pbr-book.org/) is completely free.

### Lighting and Materials

Lighting and materials are intrinsically linked in computer graphics rendering systems. We can't talk about one without the other, which is why, in this chapter, we're also introducing a new light: the `DirectionalLight`. This light type mimics rays from a faraway light source like the sun. We'll explore how lights and materials interact in more detail later in the book. To use PBR materials such as the `MeshStandardMaterial`, we must add a light to the scene. This makes sense - if there is no light, we cannot see. The `MeshBasicMaterial` we've been using so far is not physically based and does not require a light.

{{% note %}}
TODO-LINK: add link to relevant sections
{{% /note %}}

### Day to Night with the Flick of a Switch

Creating good-looking scenes using old-school, non-physically based rendering involves a lot of tedious tweaking. Consider this scenario: you've set up a day-time dining room scene for an architectural showcase, with sunlight streaming through the windows creating beautiful highlights and shadows around the room. Later, you decide to add a night-time mode to show off the lighting fixtures around the room. Using non-PBR techniques, setting this up would be a lot of work. All lighting and material parameters would need to be tweaked, and then re-tweaked and then re-tweaked again until the night scene looks as good as the day scene.

Now, imagine the same scenario, but this time you're using physically correct lighting and materials. To switch day-time to night-time, you simply turn off the light representing the sun and switch on the lights in the light fixtures. That main ceiling light is a hundred-watt incandescent bulb? Examine the packaging of the equivalent bulb in the real world, note how many lumens it outputs, and then use that value in your code, and you are done.

{{% note %}}
TODO-LOW: add an image to break up the above text
{{% /note %}}

**Well crafted physically based materials look great in all lighting conditions.**

## Enable Physically Correct Lighting

Before we add a light to our scene, we'll switch to using **physically correct lighting intensity calculations**. Physically correct _lighting_ is not the same thing as physically based _rendering_, however, it makes sense to use both together to give us a complete physically accurate scene. **Physically correct lighting** means calculating _how light fades with distance from a light source_ (attenuation) using real-world physics equations. This is fairly simple to calculate and you can find these equations in any physics textbook. On the other hand, **physically based rendering** involves calculating, in a physically correct manner, _how light reacts with surfaces_. These equations are much more complex, at least for any surface more complicated than a mirror. Fortunately, we don't have to understand them to use them!

To turn on physically correct lighting, simply enable the renderer's [`.physicallyCorrectLights`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.physicallyCorrectLights) setting:

{{< code file="worlds/first-steps/physically-based-rendering/src/World/systems/renderer.final.js" from="3" to="10" lang="js" linenos="true" hl_lines="6 7" caption="_**renderer.js**_: enable physical correct lights" >}}{{< /code >}}

This setting is disabled by default to maintain backward compatibility. However, there are no downsides to turning it on so we'll always enable it. There are a few more parameters we need to tweak to get colors and lighting working in a physically correct manner. However, by enabling this setting we've taken the important first step towards production-grade, physically-accurate lighting in our scenes.

{{% note %}}
TODO-LINK: add link to color spaces/grading sections
{{% /note %}}

## Create Physically Sized Scenes

For physically correct lighting to be accurate, you need to build physically sized scenes. There's no point in using data from a real bulb if your room is a thousand kilometers wide! If you want a hundred-watt bulb to light a room in the same way the equivalent bulb in the equivalent real room does, you have to build the room to the correct scale using meters.

### Units of size in three.js are meters

* The $2\times 2 \times 2$ cube we created earlier is two meters long on each side.
* `camera.far = 100` means we can see for a distance of one hundred meters.
* `camera.near = 0.1` means objects closer to the camera than ten centimeters will not be visible.

**Using meters is a convention rather than a rule. If you don't follow it, everything except for physically accurate lighting will still work.** Indeed, there are situations where it makes sense to use a different scale. For example, if you're building a huge-scale space simulation you might decide to use $ 1 \text{ unit} = 1000 \text{ kilometers}$. However, **if you want physically accurate lighting then you must build your scenes to real-world scale using this formula:**

> $ 1 \text{ unit} = 1 \text{ meter}$

If you bring in models built by another artist that are measured in feet, inches, centimeters, or furlongs, you should re-scale them to meters. {{< link path="/book/first-steps/transformations/" title="We'll show you how to scale objects in the next chapter" >}}.

## Lighting in three.js

If you turn on a lightbulb in a dark room, objects in that room will receive the light in two ways:

1. **Direct lighting**: light rays that come directly from the bulb and hit an object.
2. **Indirect lighting**: light rays that have bounced off the walls and other objects in the room before hitting an object, changing color, and losing intensity with each bounce.

Matching these, the light classes in three.js are split into two types:

1. **Direct lights**, which simulate direct lighting.
2. **Ambient lights**, which are a cheap and _somewhat_ believable way of faking indirect lighting.

{{% note %}}
TODO-DIAGRAM: add figure of direct and Indirect lighting
{{% /note %}}

We can simulate direct lighting easily. Direct light rays come out of a light source and continue in a straight line until they hit an object, or not. However, indirect lighting is much harder to simulate since doing so requires calculating an infinite number of light rays bouncing forever from all the surfaces in the scene. There is no computer powerful enough to do that, and even if we limit ourselves to merely calculating a few thousand light rays, each making just a couple of bounces (**[raytracing](https://en.wikipedia.org/wiki/Ray_tracing_(graphics))**), it still generally takes too long to calculate in real-time. As a result, if we want realistic lighting in our scene, we need some way of faking indirect lighting. There are several techniques for doing this in three.js, of which ambient lights are one. Other techniques are image-based lighting (IBL), and light probes, as we'll see later in the book.

{{% note %}}
TODO-LINK: add links to lighting chapters
{{% /note %}}

### Direct Lighting

In this chapter, we'll add the `DirectionalLight`, which simulates light from the sun or another very bright far away source. We'll come back to {{< link path="/book/first-steps/ambient-lighting/" title="ambient lighting" >}} later in this section. There are a total of four direct light types available in the three.js core, each of which simulates a common real-world source of light:

* **`DirectionalLight` => Sunlight**

* **`PointLight` => Light Bulbs**

* **`RectAreaLight` => Strip lighting or bright windows**

* **`SpotLight` => Spotlights**

### Shadows are Disabled By Default

{{% note %}}
TODO-DIAGRAM: add a diagram to illustrate light going through an object
{{% /note %}}

One difference between the real world and three.js, even when we use PBR, is that objects don't block light, by default. Every object in the path of a light will receive illumination, even if there is a wall in the way. The light falling on an object will illuminate it, but pass straight through and illuminate the objects behind as well. So much for physical correctness!

We can manually enable shadows, object by object, and light by light. However, shadows are expensive so we usually only enable shadows for one light or two lights, especially if our scene needs to work on mobile devices. Only direct light types can cast shadows, ambient lights cannot.

{{% note %}}
TODO-LINK: add link to shadows section
TODO-DIAGRAM: directional lightning diagram : the Sun should be bigger so it makes more sense visually that rays are parallel.
{{% /note %}}

## Introducing the `DirectionalLight`

{{< figure src="first-steps/directional_light.svg" alt="Light rays from a directional light" lightbox="true" caption="Light rays from a directional light" class="medium left" >}}

The [`DirectionalLight`](https://threejs.org/docs/#api/lights/DirectionalLight) is designed to mimic a distant source of light such as the sun. Light rays from a `DirectionalLight` don't fade with distance. **All objects in the scene will be illuminated equally brightly no matter where they are placed - even behind the light**.

**The light rays of a `DirectionalLight` are parallel and shine _from_ a position and _towards_ a target**. By default, the target is placed at the center of our scene (the point $(0, 0, 0)$), so as we move the light around it will always shine towards the center.

### Add a `DirectionalLight` to Our Scene

That's enough talk, let's add a `DirectionalLight` to our scene. Open or create the _**components/lights.js**_ module, which will follow the same pattern as the other components in this folder. First, we'll import the `DirectionalLight` class, then we'll set up a `createLights` function, and finally, we'll export the function:

{{< code lang="js" linenos="true" caption="_**lights.js**_: initial module structure" >}}
import { DirectionalLight } from 'three';

function createLights() {
  const light = null; // TODO

  return light;
}

export { createLights };
{{< /code >}}

#### Create a `DirectionalLight`

The [`DirectionalLight`](https://threejs.org/docs/#api/en/lights/DirectionalLight) constructor takes two parameters, **color**, and **intensity**. Here, we create a pure white light with an intensity of 8:

{{< code lang="js" linenos="true" linenostart="4" hl_lines="5 6" caption="_**lights.js**_: create a `DirectionalLight`" >}}
function createLights() {
  // Create a directional light
  const light = new DirectionalLight('white', 8);

  return light;
}
{{< /code >}}

All three.js lights have both color and intensity settings, inherited from [the `Light` base class](https://threejs.org/docs/#api/en/lights/Light.intensity).

#### Position the Light

**The `DirectionalLight` shines from `light.position`, to `light.target.position`**. As we mentioned above, the default position for both the light _and_ the target is the center of our scene, $(0, 0, 0)$. This means the light is currently shining from $(0, 0, 0)$, towards $(0, 0, 0)$. This does work, but it doesn't look great. We can improve the appearance of the light by adjusting the `light.position`.
We'll move it left, up, and towards us by setting the position to $(10, 10, 10)$.

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/lights.final.js" hl_lines="7 8" lang="js" linenos="true" caption="_**lights.js**_: Position the light" >}}{{< /code >}}

Now the light is shining from $(10, 10, 10)$, towards $(0, 0, 0)$.

#### World.js Setup

Over in _**World.js**_, import the new module:

{{< code file="worlds/first-steps/physically-based-rendering/src/World/World.final.js" hl_lines="3" from="1" to="7" lang="js" linenos="true" caption="_**World.js**_: imports" footer="..." >}}{{< /code >}}

Then create a light and add it to the scene. Adding a light to the scene works just like {{< link path="/book/first-steps/first-scene/#add-the-mesh-to-the-scene" title="adding a mesh" >}}:

{{< code file="worlds/first-steps/physically-based-rendering/src/World/World.final.js" hl_lines="21 23" from="13" to="26" lang="js" linenos="true" caption="_**World.js**_: create a light and add it to the scene" >}}{{< /code >}}

Note that we have added the light and the mesh in a single call of `scene.add`. We can add as many objects as we like, separated by commas.

## Switch to the Physically Based `MeshStandardMaterial`

Adding the light won't have any immediate effect since we're currently using a `MeshBasicMaterial`. As we mentioned earlier, this material ignores any lights in the scene. Here, we'll switch to a `MeshStandardMaterial`.

### The `MeshBasicMaterial`

As the name implies, [`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) is the most basic material available in three.js. It doesn't react to lights at all and the entire surface of a mesh is shaded with a single color. No shading based on viewing angle or distance is performed, so the object doesn't even look three dimensional. All we can see is a 2D outline.

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="The MeshBasicMaterial in action" caption="The `MeshBasicMaterial` in action" >}}

In the controls above, the `Material` menu has parameters that all three.js materials share, while the `MeshBasicMaterial` menu has parameters that come from this material type. It's possible to improve the appearance of this material by adjusting the parameters, in particular by using textures, which we'll explore in {{< link path="/book/first-steps/textures-intro/" title="" >}}. You can test the effect of the color map using the `map` parameter. Or, try setting the environment texture using the `envMap` parameter. Environment maps are an important form of **image-based lighting**. However, no matter how much we tweak these settings, we'll never reach the quality of a physically based material.

{{% note %}}
TODO-LINK: add link to envMap
{{% /note %}}

### Introducing the `MeshStandardMaterial`

In this chapter, we'll replace the basic material with a [`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial). This is a high-quality, general-purpose, physically-accurate material that reacts to light using real-world physics equations. As the name suggests, `MeshStandardMaterial` should be your go-to "standard" material for nearly all situations. With the addition of well-crafted textures, we can recreate nearly any common surface using the `MeshStandardMaterial`.

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshStandardMaterial" height="500" title="The MeshStandardMaterial in action" caption="The `MeshStandardMaterial` in action" >}}

If you look through the menus here, you'll see that three.js materials have a lot of settings! The controls in this scene only shows a few of the available `MeshStandardMaterial` parameters.

### The Material Base Class

If you open the Material menu in both of the above scenes, you'll see that both materials have many of the same settings, such as transparent (whether the material is see-through), opacity (how see-through it is), visible (true/false to show/hide the material), and so on. The reason for this is that both materials, and indeed, _all_ three.js materials, inherit from the [`Material` base class](https://threejs.org/docs/#api/en/materials/Material). You can't use `Material` directly. Instead, you must always use one of the derived classes like `MeshStandardMaterial` or `MeshBasicMaterial`.

{{% aside success %}}

## Lighting and Depth

Our eyes use subtle differences in shading across the surface of an object to determine depth. As a result, if we don't add some form of lighting to our scene, it will not look 3D. Lighting can be added using the direct or ambient light classes, or stored in textures as image-based lighting. Here, the left cube uses a `MeshStandardMaterial` illuminated by a `DirectionalLight`, while the right cube uses a `MeshBasicMaterial` (which ignores the light).

{{% inlineScene entry="first-steps/compare-basic-standard.js" %}}

{{% /aside %}}

### Switch the Cube's Material

Head over to _**cube.js**_ and we'll switch to this new material. First, we need to import it:

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js" from="1" to="1" lang="js" linenos="true" caption="_**cube.js**_: imports" >}}{{< /code >}}

Then, update the `createCube` function and switch the old, boring, basic material to a fancy new standard material:

{{< code lang="js" linenos="true" linenostart="3" hl_lines="6-8" caption="_**cube.js**_: switch to a MeshStandardMaterial" >}}
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // Switch the old "basic" material to
  // a physically correct "standard" material
  const material = new MeshStandardMaterial();

  const cube = new Mesh(geometry, material);

  return cube;
}
{{< /code >}}

### Change the Material's Color

{{% note %}}
TODO-LINK: add link to colors chapter
TODO-LINK: add link to named vs positional params in JS ref
{{% /note %}}

We'll make one more change in this module, and set the material's color to purple. Setting the material parameters is slightly different from other classes like the box geometry since we need to use a **specification object** with [named parameters](https://exploringjs.com/impatient-js/ch_callables.html#named-parameters):

{{< code lang="js" linenos="false" caption="Materials take a specification object" >}}
const spec = {
  color: 'purple',
}

const material = new MeshStandardMaterial(spec);
{{< /code >}}

To keep our code short and readable, we'll declare the specification object inline:

{{< code lang="js" linenos="true" linenostart="3" hl_lines="8" caption="_**cube.js**_: declare the spec object inline" >}}
``` js
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // Switch the old "basic" material to
  // a physically correct "standard" material
  const material = new MeshStandardMaterial({ color: 'purple' });

  const cube = new Mesh(geometry, material);

  return cube;
}
```
{{< /code >}}

When we {{< link path="book/first-steps/first-scene/#set-color" title="set the scene's background color" >}}, we used a CSS color name, and we've done the same here.

## Rotate the Cube

As a final touch, let's rotate the cube so we are no longer looking at it head-on. Adjusting the rotation of an object works in much the same way as setting the position. Add the following line to the cube module:

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="12" caption="_**cube.js**_: rotate the cube" >}}{{< /code >}}

Put any values you like in there for now. Now that we're no longer viewing the cube face on, it finally looks like a cube rather than a square.

{{< figure src="first-steps/cube-medium.png" alt="The rotated cube" lightbox="true" class="small right" >}}

**Rotation** is the second method of moving objects around that we have encountered, along with setting the position (**translation**). The technical term for _moving objects around_ is **transformation**, and the third method we'll use for transforming objects is **scaling**. **Translation**, **rotation**, and **scaling** (**TRS**) are the three fundamental transformations that we'll use for positioning objects in 3D space, and we'll examine each of these in detail in {{< link path="/book/first-steps/transformations/" title="the next chapter" >}}.

## Challenges

{{% aside success %}}
### Easy

1. Try changing the color of the material. All the normal colors like **red**, **green**, or **blue** will work, along with many more exotic colors such as **peachpuff**, **orchid**, or **papayawhip**. [Here's a complete list of the CSS color names](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).

2. Try changing the color of the light. Again, you can use any of the CSS color names. Watch how setting various light and material colors give the cube its final color.

3. Try moving the light around (using `light.position`) and observe the result.
{{% /aside %}}

{{% aside %}}
### Medium

1. Test out the other direct light types: [`PointLight`](https://threejs.org/docs/#api/en/lights/PointLight),  [`SpotLight`](https://threejs.org/docs/#api/en/lights/SpotLight), and [`RectAreaLight`](https://threejs.org/docs/#api/en/lights/RectAreaLight).

2. `MeshBasicMaterial` and `MeshStandardMaterial` are not the only materials available. There are a total of eighteen materials in the three.js core, and any material with the word "mesh" in its name will work with our cube mesh. Test some of these out (hint: [search the docs for "material"](https://threejs.org)).

_You need to import the other light and material classes before you can use them!_
{{% /aside %}}

{{% aside warning %}}
### Hard

1. Recreate the scene from [Lighting and Depth](#lighting-and-depth), minus the animation (hint: use two meshes and two materials).
{{% /aside %}}