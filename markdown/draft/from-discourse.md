metalness
Regarding metalness, it’s simple - nearly all materials are either metal, or not metal. There’s no in-between, at least at the molecular level, so you should usually use a value of either 0 for metal, or 1 for non-metal.

Things do get a bit more complicated when you’re talking about things like slightly rusted metal. For these materials, you may find that you’ll get better results using values other than 0 or 1. However, you will find that for realistic rusty materials you should always use values near the ends of the scales (0 -> 0.2, high rust, or 0.8->1 low rust) and never in the middle.

Also, there are unusual exotic materials such as metaloids 1 that may require in between values - Antimony is one example.

Antimony-4

Otherwise, for 99% of materials, it’s either 0 or 1 for metalness.

The unreal docs have this to say about metalness setting:

You may be reluctant at first to make any Material completely metallic. Resist!

roughness (AKA glossiness, microsurface)
Once you know that metalness is either 0 or 1, then it makes your roughness value much easier to reason about. This means that you don’t need a chart.

What’s the roughness of plastic? Set metalness = 0. Then, shiny plastic is around 0.1 and less shiny plastic maybe up around 0.8. So just play around with the roughness until your plastic is as shiny as you want it to be.

What’s the roughness of metal? Set metalness = 1. Then it depends whether it’s polished metal or rough metal.

What’s the roughness of wood? Set metalness = 0. Then think about whether your wood has been polished or just cut from the tree.

And so on.

Color (AKA base color/diffuse/albedo)
Next is the color - I guess a chart would be useful here, especially for metals.

Here’s one from the unreal docs 1.

The thing to remember is that this specifies something different for metals than for non-metals.

For metals, the color is the reflectivity - that is, the color that gets added to the reflection, or to put it in technical terms the color and intensity of the specular reflections. .

For non-metals (AKA dielectrics) the color is the normal diffuse color.

This will give you a basic setup for your materials.
To make them look good you’ll need to add maps - diffuse, normal, ao, roughness, metalness.

References
Here’s some good places to learn more about PBR:

https://marmoset.co/posts/physically-based-rendering-and-you-can-too/ 7

https://docs.unrealengine.com/en-us/Engine/Rendering/Materials/PhysicallyBased/ 4

https://seblagarde.wordpress.com/2011/08/17/feeding-a-physical-based-lighting-mode/ 4

Also this thread on polycount has loads of interesting info:
https://polycount.com/discussion/136390/pbr-physically-based-rendering-bible 9