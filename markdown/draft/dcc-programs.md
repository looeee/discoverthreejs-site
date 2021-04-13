## Digital Content Creation

There are a huge number of programs that we can use to create 3D assets for our three.js scenes.

These programs fall into various categories, the most important of which are modeling, animation, and material creation. Many programs do all three of these, for example, [3D Studio Max](https://www.autodesk.com/products/3ds-max/overview), [Maya](https://www.autodesk.com/products/maya/overview), [Blender](https://www.blender.org/), [Cinema 4D](https://www.maxon.net/en/products/cinema-4d/overview/), or hundreds of others. Other programs specialize in one thing only. Examples of these are  [Substance Painter](https://www.substance3d.com/products/substance-painter/) (material creation), or [MotionBuilder](https://www.autodesk.com/products/motionbuilder/overview) (character animation).

Also related are texture creation programs, of which [Photoshop](https://www.adobe.com/sea/products/photoshop.html) and [Gimp](https://www.gimp.org/) are the most well known. There is also a newcomer to the free image editing scene called [photopea](https://www.photopea.com/), which looks very promising. We will explore best practices for creating textures in later chapters.

{{% note %}}
TODO-LINK: add link to textures section
{{% /note %}}

Many of these tools are expensive and require yearly subscriptions in the hundreds or thousands of dollars, while others, such as Blender and Gimp, are completely free.

**These programs (2D and 3D) are often referred to as DCC (Digital Content Creation) tools.**

## Get Your Assets Out of a DCC Program (Exporting)

Most DCC programs use their own file format for saving files. For example, 3DS Max saves files in **_.max_** format, Blender saves files in **_.blend_** format and Maya saves in **_.mb_** format. On the 2D side, Photoshop saves in **_.psd_** format.

However, three.js can't load any of these formats, and in any case, they are often far to large to share over the internet. Before we can use content created in an external program, we need to save it in some kind of [**exchange format**](https://en.wikipedia.org/wiki/Data_exchange). The process of saving assets to an exchange format is known as exporting.

For 2D image files, we will export using either JPG or PNG, which you may already be familiar with. These image exchange formats are supported basically everywhere, from smart TVs to smartphones to smart watches, and in all web browsers. If we export a PNG file from Photoshop, we can load it in our browsers via HTML or three.js, or on our phones, laptops, TVs and using any operating system.

Until recently, there was no equivalent 3D exchange format - in fact, three.js has loaders for around [thirty 3D asset formats](https://threejs.org/examples/?q=loader)!

There have been many attempts at creating a standard 3D exchange format over the last thirty years or so. FBX, OBJ (Wavefront) and DAE (Collada) formats were the most popular of these until recently, although they all have problems. However, recently, one format called **glTF** has become the de-facto standard for exchanging 3D assets on the web.

### Data May Be Lost When Saving in an Exchange Format

Exchange formats tend to be more limited than the DCC program's own file format, and as a result some data may be lost. For example, Photoshop used the concept of layers to blend multiple images together. These layers can be saved to Photoshop's native _**.psd**_, however, when you export an image to PNG or JPG, any layer data will be lost.

The same applies to 3D DCC programs. It often takes some work to figure out what is supported and what is not for a given program, but as a general rule of thumb:

1. Geometry usually exports well.
2. Animations sometimes export well.
3. Materials often lose data when exported.

We will go into this in more detail later.

{{% note %}}
TODO-LINK: add link to assets section

{{% /note %}}