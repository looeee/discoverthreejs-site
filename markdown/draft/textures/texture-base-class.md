---
title: "Loading and Working with Textures, and Preparing Textures for Use in Your Scenes"
description: "TODO"
date: 2018-04-02
weight: 901
chapter: "9.1"
---

# Loading and Working with Textures, and Preparing Textures for Use in Your Scenes

In this chapter, we'll mainly use the `MeshStandardMaterial` and the color `.map` slot for demonstration.

## Terminology

As we discussed in [Ch 1.5](/book/first-steps/textures-intro/#texture-vs-image), there's quite a bit of terminology thrown around regarding textures, and it's important to get it straight.

In short, the textures that we are dealing with here are **2D textures**, and they can hold any kind of data that can be stored in a 2D array. One very common type of data that can be stored in this manner is an **image**, and the 2D array in this case is a grid of pixels. Then, the data in the array is the Red, Green, Blue, and optionally Alpha (transparency) value of each pixel.

Fortunately since people need to look at images so often, there are already a huge range of formats optimized for viewing images on the web, and we can reuse these, in particular JPG and PNG for storing our textures.

3D textures also exist and are used for things like [medical imaging](https://threejs.org/examples/#webgl2_materials_texture3d), but we'll stick with plain old 2D textures here.

Finally, we'll be referring to textures as **maps** quite a bit, especially when we're talking about a texture designed for a specific use in the material, such as a bump map or color map, and we'll call the place it goes in the material a **slot** - the bump map goes in the `material.bumMap` slot, for example. The map slots available depend on the material, and there are quite a few of them. We'll cover all of them as we go through the chapters in this section.

There's one other important word that we'll introduce here, that exists purely to avoid the confusion when we're talking about pixels.

{{% aside success %}}
#### Definition: Texel

A texel is a pixel, from a texture. Pixels are the tiny lights on your screen that make up the final rendered image, and we'll be talking about them a _lot_ throughout this book.

However, the word pixel is also used to describe the individual colored dots that make up an image on a computer, abd we'll also be talking about these a lot, so suddenly we have a problem - we are referring to two similar but different things as pixels. The solution is to rename one of them, and we'll rename the smallest unit in our texture a **texel**, and we'll keep the definition of **pixel** to mean the smallest unit in an image that is being displayed on your screen.
{{% /aside %}}

## Texture Mapping

Textures describe properties that change across the surface of a material. But, how do we know which part of the texture describes which part of the material? There are several methods of doing this, but for most standard textures we'll use **UV Mapping**, which uses a property defined on the geometry to map each vertex to a point on the texture.

Refer back to [Chapter 1.4](/book/first-steps/textures-intro/#uv-map) if you need a reminder of how that works, or skip ahead to [Section 8: Understanding Geometry](/book/geometry/) if you want to go deeper.

The exception to this is the environment map, which, depending on the type of map used, uses one of the mapping modes described on the [Texture Contants](https://threejs.org/docs/#api/en/constants/Textures) page in the docs.

## Color Spaces Used by the Textures

While there are no hard requirements on the color space used by textures, it will nearly always be the case that the maps designed to show colors that you can view directly will be in sRGB space, and the rest will be in linear space.

### Textures that You Should Assume are in sRGB Color Space

* Diffuse color `.map`
* Environment maps of all kinds (anything that goes in the `.envMap` slot)
* The `emissiveMap`

The most likely exception here will be environment maps, especially if they are in HDR format. But unless you know for sure, it's safest to assume that they are in sRGB.
For all sRGB textures, you will need to set

{{< code lang="js" linenos="false" hl_lines="" >}}
texture.encoding = sRGBEncoding;
{{< /code >}}

### Textures that You Should Assume are in Linear Color Space

The rest of the texture will almost certainly be in Linear color space. The default encoding is `LinearEncoding`, so we don't need to change any settings.

### Textures Need to Be Square, Power of 2 Size

The following are valid texture sizes, _width_ x _height_ in pixels:

* 1x1
* 2x2
* 4x4
* 8x8
* 16x6
* 32x32
* 64x64
* 128x128
* 256x256
* 512x512
* 1024x1024
* 2048x2048
* 4096x4096
* 8192x8192
* 16384x16384

Well, actually the last two might not work. Your graphics card has a maximum size for textures, which may be as low as 4096x4096 on an older mobile device. In any case, large textures take up a lot of memory - once a PNG image at 16384x16384 has decompressed, it will take up around 1 gigabyte of graphics memory! Even the most powerful of gaming pcs will struggle with more than one or two textures at that size.

As a rule of thumb, don't exceed 2048x2048, and always try to get away with even smaller textures than that. As usual, you will need to experiment to find the sweet spot between great performance and beautiful visuals.

{{% aside warning %}}
If your texture is not a power of 2 size, for example, if you use a 600x400 texture, then it will be automatically resized _down_, and a warning will be logged to the console. So in this case your 600x400 texture will be resized down to 256x256.

But don't let this happen because it wastes valuable processing power and has other less obvious negative effects, which we'll cover later.
{{% /aside %}}


## The Suitablility of JPG and PNG for Storing Textures

JPG and PNG formats are especially useful since they are great at compressing image data down to a small size, which makes them very well suited for transmission across the web.

JPG in particular can achieve very small file sizes. However, it's important to note that JPG compresses images in a _lossy_ manner that's optimized for visual imagery. That means that the result we get when we uncompress the JPG is not exactly the same as the result that we put in. We'll often see that, while JPG is great for things like photographs, it's not great for images with lots of small detail such as text.

Let's see what happens when we take an image with text like this one:

{{< figure src="textures/artefacts-demo.png" alt="Image with Text Overlay" title="Image with Text Overlay" >}}

If we save this as as PNG, and then zoom into part of it, we'll see that the quality degrades due to zooming but is otherwise good:

{{< figure src="textures/no-artefacts.png" alt="Zooming in to a PNG Shows Only Zoom Artifacts" title="Zooming in to a PNG Shows Only Zoom Artifacts" >}}

However, this changes a lot when we save it as a low quality JPG and then zoom in. We see lots of square blocks known as **JPG Artifacts**:

{{< figure src="textures/many-artefacts.jpg" alt="Zooming in to show JPG Artifacts" title="Zooming in to show JPG Artifacts" >}}

On the other hand, the PNG is 585kb, while the JPG is only 17kb. Saving that much data sure is tempting!

This is an extreme example, caused by using a JPG quality of 0 on a scale of 100. Settings of around 50 to 100 are much more common, at which levels the artifacts would be much less obvious.

Much less obvious to our eyes, that is. That all changes when it comes to using the texture for non-visual data, _especially_ normal maps. In these cases, you will want to use a non-lossy format such as PNG.

It's also worth pointing out that, while the JPG file size is smaller, once uncompressed both JPG and PNG take up the same amount of memory. This means that using JPG files will make your app load faster, they will probably not make your app _run_ faster.




## Set Up a Texture for Use in three.js

The texture above was already set up for use in your app. When preparing textures yourself, you'll need to make sure that they are correctly prepared to get good results. We'll cover this in much more detail in **Section 4: Materials and Textures**. For now, you just need to know the accepted formats and one other important thing:

{{% aside success %}}


### Accepted Texture Formats

Any texture that can be viewed directly in your browser can be loaded by the `TextureLoader`, so these formats will definitely work:

* **JPG/JPEG**
* **PNG**
* GIF
* SVG
* BMP

However, you should nearly always choose either JPG or PNG, with JPG as the first choice. Let's take a quick look at the pros and cons of each now.

### JPG / JPEG

Usually shortened to JPG, [JPEG](https://en.wikipedia.org/wiki/JPEG) generally gives the best compression and should be your go-to texture format.

{{% aside success %}}
#### JPEG Pros

* Generally best compression /  smallest size.
* You can set the level of compression in an image editor.
{{% /aside %}}

{{% aside warning %}}
#### JPEG Cons

* Compression is _**lossy**_ - the image you get out is not the same as the image you put in. This will be especially obvious with high compression levels.
* No support for transparency (or **alpha channel** as it's known in the computer graphics world).
* Not great at compressing images with small details - especially text.
{{% /aside %}}

{{< figure src="first-steps/jpg_artefacts.jpg" alt="Extreme JPEG artifacts" lightbox="true" class="small left">}}

Here's the UV test grid from above in JPG format at a high compression ratio.

Not pretty. But it is _much_ smaller - less than 12KB for this JPG version vs 90KB for the PNG version that we used above. It's not exactly a fair comparison though since the compression is set to maximum and visual quality is ignored. By the time that I had reduced compression enough that I could no longer see the artifacts easily, the JPG version was closer to 60KB. However, this image is a bad candidate for JPEG compression due to the small details and text.

### PNG

[PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) should be your second choice texture whenever PNG falls short. Let's see how it holds up.

{{% aside success %}}
#### PNG Pros

* Compression is _**lossless**_. This means that the image you get out is _exactly_ the same as the image that you put it.
* Fully preserves small details such as text.
* Supports transparency.
{{% /aside %}}

{{% aside warning %}}
#### PNG Cons

* Potentially much bigger file size.
{{% /aside %}}

Actually, compression is still good with PNG. The UV test file above saved as BMP (an uncompressed format), for example, is 768KB, versus 90KB as a PNG.

## Other Texture Formats

There are other texture formats that you might come across, which are commonly used in 3D applications but can't be loaded directly in the browser. For example: TGA, DDS, EXR and others. Each has a corresponding loader that you need to include in your app in addition to the core three.js script: `TGALoader`, `DDSLoader`, `EXRLoader`, etc.

However, unless you know what these textures are for and have a good reason for using them, you should generally avoid them and load up your fancy TGA texture in Photoshop or Gimp and convert it to a PNG or JPG.