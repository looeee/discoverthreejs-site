To understand why we need to interpret these colors differently in different situations, we'll need to digress for a moment and introduce the concept of a **color space**.

{{% aside success %}}

### [Color Space](https://en.wikipedia.org/wiki/Color_space) {#color-space}

In the field of 3D rendering, we generally have to deal with two different **color spaces**. The first is called sRGB, and it's the colors space used by colors that end up on your screen. The second is called **linear space** and it's the color space used inside the renderer.

#### [sRGB Color Space](https://en.wikipedia.org/wiki/SRGB)

The historical reason for these different color spaces is that, in the early days of television when screens used cathode ray tubes, they did not reproduce colors equally well across the whole visual spectrum, so a [gamma correction](https://en.wikipedia.org/wiki/Gamma_correction) was applied - generally using a **gamma factor** of $2.2$.

Newer screens, such as LCD or OLED screens, have better color reproduction ability and no longer _need_ to apply gamma correction. However, they still do - first, for backward compatibility, and second, because due to a happy coincidence, gamma corrected colors match up quite well to how our eyes see color, meaning that we can store most of the range of human color vision using less data.

sRGB color space is not _exactly_ the same as gamma corrected color space, but it's close enough for this introduction. It's a standard specification that was created by Microsoft and HP in the early days of the internet as a way of ensuring that color reproduction across devices and printers was universal, and it's the color space used by basically every modern electronic device.

However, this presents us with a problem, because these gamma corrected colors don't follow a linear pattern - that is, if we double the amount of blue in a color, we don't necessarily end up with a color that is twice as blue. This makes doing math with gamma corrected colors much more complicated than it should otherwise be.

#### Linear Color Space

The solution is to remove the gamma correction from the colors before we pass them into the renderer. Once we remove gamma correction from a color, it will be in **linear color space** and we can safely do mathematical operations such as doubling the brightness or tripling the amount of blue and get the results that we expect.

The final step in the rendering pipeline is then to convert the colors _back_ into sRGB space, ready to be displayed on our screens.

This is a brief and intentionally partial introduction to color spaces. It's a complex topic and one that's often neglected since if you forget to take gamma correction into account your colors will be only a little bit off, and if you are not paying close attention to your final renderings you may not even notice any difference.

However, our goal here is to create professional quality renderings and this one of the many small pieces of the puzzle that come together to make your final result really stand out.

If you want to read further on this topic, there's a good introduction on kinematicsoup.com: [GAMMA AND LINEAR SPACE - WHAT THEY ARE AND HOW THEY DIFFER](http://www.kinematicsoup.com/news/2016/6/15/gamma-and-linear-space-what-they-are-how-they-differ).

We'll cover all of this in much more detail in [Section 7: Textures](/book/textures/).

{{% /aside %}}


#### Color Spaces Again

As with our texture in [Ch 1.4: Introduction to Textures](/book/first-steps/textures-intro/#color-space), in order for colors to end up looking correct once they have passed through the renderer and ended up on our screens, we'll need to convert them to linear color space.

If you recall from way back in [Ch 1.2: Lights! Color! Action!](/book/first-steps/lighting/#color-in-three-js), when we pass in the in `color` parameter to a material, internally it's creating a [`Color`](https://threejs.org/docs/#api/en/math/Color) object, which we can then access in `material.color`. If we later want to change the material's color to red, we can use `material.color.set( 0xff3333 );`.

When we do this, we are setting the color using the hex number `0xff3333`, which corresponds to the [CSS hex color](https://www.color-hex.com/) `#ff3333`, a bright red. These colors are specified in sRGB color space, as we discussed in Chapter 1.4. If we care about accurate color presention in our final rendered image (and we should), then we'll need to convert this **sRGB red** to **linear red** before passing it into the renderer.

```js
const color = new Color(0xff3333);

color.convertSRGBToLinear();
```

In the case of our material, we can do do this after we have created the material, using `material.color`:

```js
const body = new MeshStandardMaterial({
  color: 0xff3333, // red
  flatShading: true,
});

body.color.convertSRGBToLinear();
```
