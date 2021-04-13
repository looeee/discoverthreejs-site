### Set The Texture Parameters {#texture-parameters}

The next step is to setup the texture for use in the material. The `Texture` class has lots of options that we can set, and we will explore all of them later. For now, there are two setting we need to change - the encoding, and the anisotropic filtering level.

#### Set the `Texture.encoding`

As we mentioned above, textures can be used to represent many different things. When we are using a texture in a material, these fall into two categories:

1. colors designed to be seen by human eyes
2. "something else"

The "something else" category can be quite varies - bumps on the surface, small shadows on the surface (ambient occlusion), how see-through (transparent/opaque) the surface is and so on. We'll explore all of the possibilities later.

three.js needs to interpret the data differently depending on the intended use, and we tell it how to do this by setting the `encoding` property. This property tell three.js what _color space_ the texture is in, and we'll thoroughly explain what that means in the next section. For now, you need to know that we are usually dealing with two color spaces, related to the two categories above.

In short, computer monitors are not perfect at displaying colors, and, bad as they are now, fifty or so years ago, they were a lot worse. To make images look better when displayed on the screen, colors are converted using a _gamma curve_ into a color space designed to look good to the human eye. The industry standard color space for displaying on computer monitors, TVs, phones, projectors, and so so, is called the **sRGB color space**.

However, this presents us with a problem - it's not easy to do accurate mathematical calculations with colors that have been converted like this. As a result, we need to convert all colors to **linear color space** before we use them in three.js.

When it comes to textures, we will use the **sRGB color space** for colors designed to be seen (category 1.) and the **linear color space** for everything else (category 2.).


Linear encoding is the default setting, so whenever we use a texture as a color map, we need to set the encoding.

By default textures are assumed to have colors **encoded in linear space** - so we'll need to tell the renderer that this texture has colors encoded in sRGB space instead:

```js
texture.encoding = sRGBEncoding;
```

#### Reduce Texture Blurring by Setting the Anistropic Filtering Level

Next up is a parameter which will improve the appearance of nearly every scene that uses textures, although again, this only needs to be applied to textures representing colors designed to be seen by your eyes. This parameter is the **anisotropic filtering level**, which is stored in [`texture.anisotropy`](https://threejs.org/docs/#api/en/textures/Texture.anisotropy).

By default, this is set to $1$, which applies no filtering. We will increase this to &16&, which is the maximum level supported by most graphics cards:

```js
texture.anisotropy = 16;
```

{{% aside %}}

#### Anisotropic Filtering

What does this setting do? It's easiest to describe with a picture - here's our cube with a more detailed UV test image applied. You'll quickly see on the left side that the top of the cube looks blurred, while on the right-hand cube, which has anisotropy set to 16, the top is sharp.

{{< figure src="first-steps/anisotropy.svg" alt="Anisotropic filtering level 1 and level 16" lightbox="true" >}}

We won't get into the details of how this works here, but the purpose of anisotropic filtering is to make your textures look good at glancing angles.

The maximum value this setting can have depends on your graphics card but don't worry if you set it too high. If you set it level $16$, as we have here, but your graphics card supports a maximum level of $8$, it will automatically downgrade it.

Valid anisotropic filtering levels are powers of two - $1$, $2$, $4$, $8$, up to the maximum level of $16$.

Values higher than $16$ are generally not supported as this technique uses a lot of graphics memory and it's hard to see any further increase in quality at higher levels.

This high memory usage is also the reason why this is not set to a higher value by default. You should only enable this when needed, or use lower values, especially if you need to support mobile devices or integrated GPUs.

Always experiment with your apps to get the best trade-off between visual quality and performance.
{{% /aside %}}

