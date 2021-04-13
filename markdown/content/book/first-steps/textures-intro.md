---
title: "A Brief Introduction to Texture Mapping"
description: "Textures are used to store surface details of the objects in our scenes, such as color, bumps, small shadows, and more. Here, we load a texture with the TextureLoader and apply it to our cube mesh."
date: 2018-04-02
weight: 108
chapter: "1.8"
available: true
showIDE: true
IDEFiles: [
  "assets/textures/uv-test-col.png",
  "assets/textures/uv-test-bw.png",
  "worlds/first-steps/textures-intro/src/World/components/camera.js",
  "worlds/first-steps/textures-intro/src/World/components/cube.start.js",
  "worlds/first-steps/textures-intro/src/World/components/cube.final.js",
  "worlds/first-steps/textures-intro/src/World/components/lights.js",
  "worlds/first-steps/textures-intro/src/World/components/scene.js",
  "worlds/first-steps/textures-intro/src/World/systems/renderer.js",
  "worlds/first-steps/textures-intro/src/World/systems/Resizer.js",
  "worlds/first-steps/textures-intro/src/World/systems/Loop.js",
  "worlds/first-steps/textures-intro/src/World/World.js",
  "worlds/first-steps/textures-intro/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/textures-intro/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/textures-intro/'
IDEActiveDocument: 'src/World/components/cube.js'
---

{{% note %}}
THIS CHAPTER IS COMPLETE!
B-GRADE: was not in perfect head space while correcting. Come back to this post launch
{{% /note %}}

# A Brief Introduction to Texture Mapping


When we create a mesh, such as our humble cube, {{< link path="/book/first-steps/first-scene/#our-first-visible-object-mesh" title="we pass in two components" >}}: a geometry and a material.

{{< code lang="js" linenos="false" hl_lines="" caption="A mesh requires two sub-components: a geometry and a material" >}}
``` js
const mesh = new Mesh(geometry, material);
```
{{< /code >}}

{{< inlineScene entry="first-steps/static-cube-no-texture.js" class="small left" >}}

The geometry defines the mesh's shape, and the material defines various surface properties of the mesh, in particular, how it reacts to light. The geometry and the material, along with any light and shadows affecting the mesh, control the appearance of the mesh when we render the scene. Currently, our scene contains a single mesh with a shape defined by a `BoxBufferGeometry` and a surface defined by a `MeshStandardMaterial` with the color parameter set to purple. This is illuminated by a single `DirectionalLight`, and when we render the scene, the result is this simple purple box.

{{< figure src="/first-steps/concrete-cube.jpg" alt="" lightbox="true" class="noborder small right" alt="Courtesy of @christianfregnan from unsplash" caption="A cube made from concrete." >}}

Compare this to a concrete box in the real world - or a wooden box, or a metal box, or a box made from nearly any substance except smooth plastic, and we can immediately see that our 3D box is not at all realistic. Objects in the real world are usually scratched, broken, and dirty. However, the material applied to our box doesn't look like this. Rather, it consists of a single color applied smoothly over the entire surface of the mesh. Unless we want all of our creations to look like brand-new plastic, this won't do.

Materials have many parameters besides {{< link path="/book/first-steps/physically-based-rendering/#change-the-materials-color" title="color" >}}, and we can use these to adjust various attributes of an object's surface, like the roughness, metalness, opacity, and so on. However, just like {{< link path="/book/first-steps/physically-based-rendering/#change-the-materials-color" title="the color parameter" >}}, these parameters are applied uniformly over the entire surface of the mesh. If we increase the material's `.roughness` property, for example, the entire surface of the object will become rougher. If we set the `.color` to red, the entire object will become red.

{{< iframe src="https://threejs.org/examples/webgl_materials_normalmap.html" height="500" title="The material of a human face" class="small left" >}}

By contrast, the surface properties of most real-world objects change from one point to the next. Consider a mesh representing a human face. Once again, it consists of a geometry and a material, just like our cube mesh. The large scale features, like the eyes, nose, ears, neck, and chin, are defined by the geometry. However, a lot more than a well-crafted geometry goes into creating a realistic face. Looking closely at the skin, we can see there are many small bumps, wrinkles, and pores, not to mention eyebrows, lips, and a slight beard. When creating a complex model like a face, an artist must decide what parts of the model to represent using geometry, and what parts to represent at the material level, bearing in mind that it's usually cheaper to represent things using the material than the geometry. This is an especially important consideration when the model has to run on a mobile device, where high performance is paramount. For example, while it would be possible to model every hair in the eyebrows in geometry, doing so would make this model unsuitable for real-time use on all but the most powerful of devices. Instead, we must represent small features like hair at the material level, and reserve the geometry for large scale features like the eyes, nose, and ears.

Note, also, that this face is made from a single geometry. We usually want to avoid splitting a geometry up more than necessary since every mesh can have only one geometry, so each separate geometry corresponds to a new mesh in our scene. Having fewer objects in a scene usually results in better performance, and it's also easier for both the developer and the 3D artist to work with. In other words, we don't want to be forced to create different geometries for the ears, and eyes. In any case, this wouldn't be practical. Looking closely at the lips, we can see there is no sharp divide between the red of the lips and the skin tone of the chin. This means we need some way of modifying material properties so that they can change smoothly across the surface of an object. We need to be able to say things like this:

* the part of the geometry making up the lips is red
* the part of the geometry making up the chin is a skin tone overlaid by a slight beard
* the part of the geometry making up the eyebrows is hair colored

... and so on. And this doesn't only apply to color. The skin is shinier than the hair and lips, for example. So, we also need to be able to specify how other properties like roughness change from one point to the next across the geometry.

{{< clear >}}

{{< figure src="first-steps/lee-perry-smith-color.jpg" caption="This color texture is mapped onto<br> the face geometry using UV mapping" alt="lee-perry-smith-color.jpg" lightbox="true" class="small right" >}}

This is where [**texture mapping**](https://en.wikipedia.org/wiki/Texture_mapping) comes in. In the simplest possible terms, texture mapping means taking an image and stretching it over the surface of a 3D object. We refer to an image used in this manner as a **texture**, and we can use textures to represent material properties like color, roughness, and opacity. For example, to change the color of an area of the geometry, we change the color the area of the texture that lies on top, as you can see in this color texture which is attached to the face model.

While it's easy to take a 2D texture and stretch it over a regular shape like a cube, it's much harder to do that with an irregular geometry like a face, and over the years, many texture mapping techniques have been developed. Perhaps the simplest technique is [projection mapping](https://en.wikipedia.org/wiki/Projective_texture_mapping), which projects the texture onto an object (or scene) as if it has been shone through a film projector. Imagine holding your hand in front of a film projector and seeing the image projected onto your skin.

{{< figure src="first-steps/uv-test-bw.jpg" caption="A test texture with the UV coordinates<br>explicitly written onto the texture." lightbox="true" class="small left" >}}

While projection mapping and other techniques are still widely used for things like creating shadows (or simulating projectors), that's not going to work for attaching the face's color texture to the face geometry. Instead, we use a technique called [**UV mapping**](https://en.wikipedia.org/wiki/UV_mapping) which allows us to create a connection between points on the geometry and points on the face. Using UV mapping, we divide the texture up into a 2D grid with the point $(0, 0)$ at the bottom left and the point $(1,1)$ at the top right. Then, the point $(0.5,0.5)$ will be at the exact center of the image. Likewise, every point in a geometry has a position in the 3D {{< link path="/book/first-steps/transformations/#local-space" title="local space of the mesh" >}}. UV mapping, then, is the process of assigning 2D points in the texture to 3D points in the geometry. For example, suppose the lips in the face model are at the point $(0,0,0)$. We can see that the lips in the texture are close to the center, somewhere around $(0.5,0.5)$. So, we'll create a mapping:

$$ ( 0.5, 0.5 ) \longrightarrow ( 0,0,0 ) $$

Now, when we assign the texture as a color map in the material, the center of the texture will be mapped onto the lips. Next, we must do the same for many other points in the geometry, assigning the ears, eyes, eyebrows, nose, and chin to the appropriate points of the texture. If this sounds like a daunting procedure, don't worry, because it's rare to do this manually. For this model, the UV mapping was created in an external program, and in general, that's the recommended way to create UV mappings.

Data representing the UV mapping is stored on the geometry. The three.js geometries like the `BoxBufferGeometry` have already got UV mapping set up, and in most cases, when you load a model like a face that was created in an external program, it will also have UV mapping ready for use. Later in this chapter, we'll explore the UV mapping of the box geometry in more detail, and assign the black and white test texture to our box mesh.

{{< iframe src="https://threejs.org/examples/webgl_geometry_cube.html" height="300" title="A cube mesh with a wooden crate texture" class="small right" >}}

Once we have a geometry with a UV mapping, we can take any texture and apply it to the geometry and it will immediately work. However, it might be hard to find other textures that will look good with a face model since the UV map must be carefully coordinated to match the texture to the correct points on the face, and doing this well is the work of a skilled 3D artist. However, for simple shapes like a cube we can use nearly any image as a texture, turning the box into a wooden box, or a concrete box, or a crate, and so on.

## Types of Data that can be Stored in a Texture

{{% note %}}
TODO-POSTLAUNCH: add example images of textures in use here: see this link
 https://conceptartempire.com/texture-maps/
{{% /note %}}

In this chapter, we'll focus on using a texture to represent color. We'll take the _**uv-test-bw.png**_ texture, which you can find in _**/assets/textures/**_ folder in the editor, and stretch it over our cube. When we do this, by default, three.js will stretch one copy of the texture across each of the cube's faces, for six copies in total.

In the early days of computer graphics, textures were only used to store the color of an object. However, nowadays, textures can be used to store all kinds of data, such as color, bumpiness, opacity, small shadows on the surface (known as **ambient occlusion**), lighting, metalness, and roughness, to name just a few. Different materials accept different kinds and combinations of textures, so the `MeshBasicMaterial` does not accept all of the same textures as the `MeshStandardMaterial`, for example. We'll look at the type of data that can be stored in a texture in more detail later in the book.

{{% note %}}
TODO-LINK: add link to materials/textures section
{{% /note %}}

## Types of Texture

The _**uv-test-bw.png**_ is a normal 2D image file stored in PNG format and below, we'll load it using the `TextureLoader`, which will return an instance of the [`Texture`](https://threejs.org/docs/#api/en/textures/Texture) class. You can use any image format that your browser supports, such as PNG, JPG, GIF, BMP, in the same way. This is the most common and simplest type of texture we will encounter: data stored in simple 2D image files.

There are also loaders for specialized image formats like HDR, EXR, and TGA that have corresponding loaders like the [`TGALoader`](https://threejs.org/docs/#examples/en/loaders/TGALoader). Again, once loaded, we'll get a `Texture` instance, and we can use this in mostly the same way as a loaded PNG or JPG image.

Beyond these, three.js supports many other types of textures that are not simple 2D images, such as [**video textures**](https://threejs.org/examples/?q=video#webgl_materials_video), [**3D textures**](https://threejs.org/examples/#webgl2_volume_instancing), [**canvas textures**](https://threejs.org/examples/#webgl_materials_texture_canvas), [**compressed textures**](https://threejs.org/examples/?q=texture#webgl_loader_texture_basis), [**cube textures**](https://threejs.org/examples/?q=cubemap#webgl_materials_cubemap_dynamic), [**equirectangular textures**](https://threejs.org/examples/?q=equirectangular#webgl_panorama_equirectangular), and more. Again, we'll explore these in more detail later in the book. For the rest of this chapter, we'll focus on 2D textures stored in PNG or JPG format.

{{% note %}}
TODO-LINK: change above links to relevant sections in the book
{{% /note %}}

## The `Texture` Class

The `Texture` class is a wrapper around an [HTML image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) with some extra settings related to being used as a texture instead of a normal image. We can access the original image under `image.texture`. It's the most common class we'll use when working with textures, although there are several derived classes like [`VideoTexture`](https://threejs.org/docs/#api/en/textures/VideoTexture) or [`CubeTexture`](https://threejs.org/docs/#api/en/textures/CubeTexture) for working with other types of texture. Usually, though, we won't create a `Texture` directly, since the `TextureLoader` will automatically create one for us, as we'll see below.

Examples of the settings available through the texture class are `.wrapS` and `.wrapT`, which control how the texture wraps when it reaches the edge (for example, does it repeat, simply stop, or do we stretch the edges of the texture to the edges of the mesh?). We can also specify various filtering (using `.minFilter` and `.magFilter`) to control how the texture is filtered when seen far away or up close. In other words, these settings control what algorithm is used to zoom in or out on the image.

There are also several properties like `.offset`, `center`, and `.rotation` that allow us to control the position of the texture. Two other important settings are `.flipY`, which flips the texture along the $Y$-axis (for compatibility with models created in certain external programs), and the `.encoding` property, which, as we'll see later, must be set correctly for best results.

Take a few minutes to explore the documentation page and check out the options available when working with textures. We'll explore most of them in more detail later in the book.

{{% note %}}
TODO-LINK: add link to textures section
{{% /note %}}

## Creating Textures

There are many ways of preparing images for use as textures, but the easiest is to take a photograph of an object. For example, if you take a photo of a brick wall and assign it to a material's color slot, you'll see a decent likeness of a 3D wall in your scene. We can improve this by creating by using the original image to create additional textures for other material properties like bumps or roughness. Check out this set of textures on [freepbr.com](https://freepbr.com/materials/worn-out-old-brick-wall-pbr-material/) for an example (choose the Unreal Engine version for use with three.js, and note that _albedo_ is another term for _color_). We'll explore using a set of textures like this to create photorealistic materials later in the book.

{{% note %}}
TODO-LINK: add link to page using a texture set like this
{{% /note %}}

While it's a simple matter to take a photo of a flat wall, curved surfaces like a face, a tree, or a rabbit, present more of a challenge. For surfaces like these, an artist has to flatten out the photo and connect each point in the flattened image to a corresponding point on the 3D model, again using UV mapping. This is typically done in an external modeling program, not in three.js.

For common surfaces like brick walls and wooden floors, you can find high-quality texture sets (like the one above) around the web, many of them for free. In this book, we'll use [textures from the three.js repo](https://github.com/mrdoob/three.js/tree/dev/examples/textures) and sites like [freepbr.com](https://freepbr.com/) or [Quixel megascans](https://quixel.com/).

## Texture Terminology

Before we proceed with loading a texture and applying it to our cube, let's go over all the technical terms that we'll be using when working with textures.

### What's the Difference Between an Image and a Texture? {#texture-vs-image}

You'll see the terms **texture** and **image** a lot in computer graphics literature. These are even often stored in the same format, such as PNG or JPG. What's the difference?

* **An image is a 2D picture designed to be viewed by a human.**
* **A texture is specially prepared data used for various purposes in 3D graphics**.

The individual pixels that make up an image represent color. Another way of looking at this is that an image is a 2D array of colors. In the early days of computer graphics, that was the case for textures too, but over time more and more uses were found for textures and now it's more correct to say that a texture is a 2D array of data. This data can represent anything. Nowadays it's even possible to store geometry or animations in a texture.

When a texture is stored in an image format like PNG or JPG, we can open it in any image viewer. In this chapter, the texture we'll load represents color data, so if we open it in a viewer it will look like an image. However, textures used for other purposes, such as bump maps, opacity maps, lightmaps, so on, often won't look like anything in particular until they have been applied to a material and interpreted by the renderer.

{{% note %}}
TODO-DIAGRAM: add diagram of color map and normal map side by side
{{% /note %}}

### Texture Map

Although technically incorrect, a texture is also often referred to as a **map**, or even a **texture map**, although **map** is most commonly used when assigning a texture to a material. When using a texture to represent color, we'll say that we are **assigning a texture to the color map slot on a material**. Below, we show you how to assign the _uv-test-bw.png_ texture to the color map slot of the `MeshStandardMaterial`.

### Pixel and Texel

A digital image is a 2D array of pixels, each of which is a tiny dot that contains a single color. Our screen is also made up of a 2D array of tiny dots, each of which displays a single color, and we call these pixels too. However, the pixels that make up a screen are actual physical objects, LEDs or OLEDs or some other high-tech device, while the pixels that make up an image are just numbers stored in a file.

**To prevent confusion, we'll continue to call the points that make up our screen _pixels_, but we'll refer to the points that make up a texture as _texels_**.

### UV Mapping

UV mapping is a method for taking a 2-dimensional texture and mapping it onto a 3-dimensional geometry. Imagine a 2D coordinate system on top of the texture, with $(0,0)$ in the bottom left and $(1,1)$ in the top right. Since we already use the letters $X$, $Y$ and $Z$ for our 3D coordinates, we'll refer to the 2D texture coordinate using the letters $U$ and $V$. This is where the name **UV mapping** comes from.

Here's the formula used in UV mapping:

$$ ( u, v ) \longrightarrow ( x, y, z ) $$

$( u, v )$ represents a point on the texture, and $( x, y, z )$ represents a point on the geometry, {{< link path="/book/first-steps/transformations/#coordinate-systems-world-space-and-local-space" title="defined in local space" >}}. Technically, a point on a geometry is called a **vertex**.

{{< figure src="first-steps/geometry_uv_map.svg" caption="UV mapping a texture onto the `BoxBufferGeometry`" lightbox="true" >}}

In the figure above, the top left corner of the texture has been mapped to a vertex on the corner of the cube with coordinates $(-1,1,1)$:

$$ ( 0, 1 ) \longrightarrow ( -1 , 1, 1 ) $$

Similar mappings are done for the other five faces of the cube, resulting in one complete copy of the texture on each of the cube's six faces:

{{< inlineScene entry="first-steps/texture-map.js" >}}

Note that there is no mapping for the point $(0.5,0.5)$, the center of the texture. Only the corners of the texture are mapped, onto the eight corners of the cube, and the rest of the points are "guessed" from these. By contrast, a complex model like a face must have many more UV coordinates defined to map the parts of the texture representing the nose, ears, eyes, lips, and so on, to the correct points of the geometry.

We'll come back to UV mapping later in the book, once we've looked more deeply at how geometry works. Fortunately, we rarely need to set up UV mapping manually since all the three.js geometries, including the `BoxBufferGeometry`, have UV mapping built-in. We only need to load the texture and apply it to our material and everything will work.

{{% note %}}
TODO-LINK: Add link to geometry section
{{% /note %}}

Over the rest of this chapter, we'll show you how to do just that.

> **Important notice**: from here on, if you're working locally, [you'll need to set up a web server](https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally), otherwise, you won't be able to load the texture due to browser security restrictions.

For everyone who's following along using the inline code editor, it's business as usual. Let's press on.

## The `Texture` Class

The `Texture` class is a wrapper around an [HTML image element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) with some extra settings related to being used as a texture instead of a normal image.

## Loading a Texture

Now that we have all the theory out of the way, loading a texture and applying it to our cube is simple. All the code we add in this chapter will go inside the _**cube.js**_ module. We'll use the three.js [`TextureLoader`](https://threejs.org/docs/#api/en/loaders/TextureLoader) class to load textures, so add `TextureLoader` to the list of imports at the top of _**cube.js**_:

{{< code from="1" to="7" file="worlds/first-steps/textures-intro/src/World/components/cube.final.js" lang="js" linenos="true" hl_lines="6" caption="_**cube.js**_: import the `TextureLoader`" >}}{{< /code >}}

### Move Material Set up into a Separate Function

To prevent the `createCube` function from growing too large, let's move material creation into a new function:

{{< code lang="js" linenos="true" linenostart="7" hl_lines="7-12 17" caption="_**cube.js**_: Move material setup into a new function" >}}
function createMaterial() {
  // create a "standard" material
  const material = new MeshStandardMaterial({ color: 'purple' });

  return material;
}

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  const material = createMaterial();

  const cube = new Mesh(geometry, material);

  ...
}
{{< /code >}}

### Create a `TextureLoader` Instance

Next, create a new `TextureLoader` instance at the top of the new `createMaterial` function:

{{< code lang="js" linenos="true" linenostart="7" hl_lines="8 9" caption="_**cube.js**_: Create a texture loader instance" >}}
function createMaterial() {
  // create a texture loader.
  const textureLoader = new TextureLoader();

  // create a "standard" material using
  const material = new MeshStandardMaterial({ color: 'purple' });

  return material;
}
{{< /code >}}

### Use `TextureLoader.load` to Load a Texture

The [`TextureLoader.load`](https://threejs.org/docs/#api/en/loaders/TextureLoader.load) method can load textures in any standard image format, such as PNG, JPEG, GIF, BMP, and so on. Here, we'll load the **_uv-test-bw.png_** file from the _**assets/textures**_ folder:

{{< code lang="js" linenos="true" linenostart="7" hl_lines="11-14" caption="_**cube.js**_: load a texture" >}}
function createMaterial() {
  // create a texture loader.
  const textureLoader = new TextureLoader();

  // load a texture
  const texture = textureLoader.load(
    '/assets/textures/uv-test-bw.png',
  );

  // create a "standard" material using
  const material = new MeshStandardMaterial({ color: 'purple' });

  return material;
}
{{< /code >}}

When we call `.load`, something interesting happens. Even though loading the texture will take some time (probably a few hundred milliseconds), the `TextureLoader` _immediately_ returns an _empty_ instance of the [`Texture`](https://threejs.org/docs/#api/en/textures/Texture) class. Above, we have stored this in a variable called `texture`.

We can use this empty `texture` immediately, even before the image has finished loading. However, until the image data has fully loaded, the texture will show as black. In other words, if we assign this texture to the color map slot of a material, the material will show up in your scene as black until the texture finishes loading.

Once loading has finished, the `TextureLoader` will insert the correct image automatically and the material will change color from black to whatever is in the image. This process will be especially obvious with a slow internet connection. If you update the scene using the inline editor you might be able to see this happening, although the image data should load in a fraction of a second. You might prefer to avoid showing black meshes in your scenes, in which case you can wait until all textures have loaded before rendering the scene. We'll explore the options you have here later in the book.

## Assign the Texture to the Material's Color Map Slot

Previously, we set the material's color using the [`.color`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.color) property. Here, we will assign the `texture` to the [`material.map`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.map) property, which describes how the color varies over the object's surface. `.map` _should_ be named `.colorMap`, however, since it's used so often this is shortened for convenience.

**Usually, we set _either_ `.color` or `.map`, but not both**. If we do set both the colors in the texture will be _multiplied_ by the `.color` property. For example, if we keep the purple color, this black and white texture will gain a purple tint. A common use case here is to set the color to a shade of gray to darken the texture. Since white is the default color, setting `.color` to white will not affect on the texture. As a result, it's not possible to use the `.color` to lighten the texture, you can only darken it.

Like the color parameter, we can either pass the texture into the material's constructor:

{{< code lang="js" linenos="false" caption="Assign the texture to the material in the constructor" >}}
const material = new MeshStandardMaterial({
  map: texture,
});
{{< /code >}}

Or, we can set the `.map` after creating the material:

{{< code lang="js" linenos="false" caption="Assign the texture after we have created the material" >}}
const material = new MeshStandardMaterial();

material.map = texture;
{{< /code >}}

We'll use the first approach here. Once again, update `createMaterial`:

{{< code from="9" to="25" file="worlds/first-steps/textures-intro/src/World/components/cube.final.js" lang="js" linenos="true"
hl_lines="18-22" caption="_**cube.js**_: assign the texture to the material's color map slot" >}}{{< /code >}}

Now, your scene will update and you should see the texture mapped onto each of the cube's six faces.

{{< inlineScene entry="first-steps/texture-map-duplicate.js" >}}

There are six copies of the texture, one for each face of the cube. Take special note of what happens at the corners.

In the above scene, you can rotate the cube using the mouse or touch. Actually, it's the camera that moves, not the cube, since we have added a camera control plugin to this scene. This plugin allows you to pan, rotate, and zoom/dolly the camera to view the scene from any angle, which is great when we are setting up a scene and want to get a close look at everything. In the next chapter, we'll add this plugin to our app.

## Challenges

{{% aside success %}}
### Easy

1. Change the material's color. Try purple, red, green, blue, or any other colors you like. Take note of how each color is combined with the black and white texture.

2. Included in the **_/assets/textures_** folder is a second texture file called **_uv-test-col.png_**. Can you load this file and apply it to the material's `.map` slot?

3. Try switching the cube for some other shapes. [Search the docs](https://threejs.org/docs/) for "BufferGeometry" to see all the available geometries. Note how the texture gets mapped onto different shapes.

4. [Open up the `MeshStandardMaterial` doc page](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial). This material has a total of eleven texture maps slots, each of which has the work _map_ in their name. Can you find all of them?

{{% /aside %}}

{{% aside %}}
### Medium

1. Try assigning the texture we loaded to other map slots on the material. They may not all work, but you'll get some interesting results.

2. Do the same with **_uv-test-col.png_**. Then, load both textures at once and assign them to various slots at the same time.

3. [Open up the `Texture` docs](https://threejs.org/docs/#api/en/textures/Texture). Read through the various properties you can set on the texture. Try adjusting the `.offset`, `.repeat`, `.rotation`, and `.center` properties. Each of these (except `.rotation`) is a `Vector2`, so you can use `.set(x,y)` to adjust them.

_Note A: if you assign a texture to the `.alphaMap` you also have to set `material.transparent = true`._

_Note B: The two textures provided in the editor can be assigned to any map slot except for the environment map, which requires special types of texture. Whether they look good in a given slot is another matter!_

{{% /aside %}}

{{% aside warning %}}
### Hard

1. Each texture slot in a material is associated with one or more properties (like `.color` and `.map`). The map either [modulates a property](#types-of-texture) like (again, like `.color` and `.map`), or is itself modulated by some other property (like `.bumpMap` and `.bumpScale`). As you test out the textures in various slots, try adjusting the modulating properties as well. Some of them are colors (like `.color` and `emissive`), others are vectors (like `.normalScale`), but most are simple numbers (like `.bumpScale` and `.displacementScale`). In each case, the documentation notes this clearly.

2. We noted above that the `Texture` class is a wrapper for an HTML image. If you log the `texture` to the console, you should be able to find the image. Can you find the URL of `uv-test-bw.png` and open it in a new tab, from within the console?

{{% /aside %}}