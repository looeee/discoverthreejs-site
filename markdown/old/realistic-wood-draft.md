---
title: "Case Study: A Realistic Wooden Material"
description: "Here we'll be examining real-world scenarios and methods of solving them using the techniques that we have just learned. Up first: how to create a photorealistic wooden texture and apply it to a ready built model."
menuImage: 'geometries/torusKnot.png'
date: 2018-04-02
weight: 109
chapter: "B.9"
draft: true
---
{{% fullwidth %}}

# A realistic wooden material

Currently, we are still using the UV test material from way back in Chapter 1.4 to texture our toy car, which is simply applying the UV test texture over the whole surface of the model.

{{< codesandbox src="looeee/discoverthree.com-examples/tree/master/first-steps/6-shapes-transformations" preview="true" >}}

We're going to take this prebuilt model and apply a realistic looking wooden material to it. Everything is set up from the previous chapters, we just need to create a new material, and perhaps adjust the lighting.

To create a material that looks like wood, we have a couple of choices:

* lots and lots of maths until we create something resembling wood ( a **procedural** texture )
* paint some wooden textures in a 2D graphics program
* go and take some photographs of wood and use them to create the material

The last option sounds like the easiest here, and it will give by far the best results for the amount of effort that we put in. The other options are only likely to be chosen to suit a particular art style - in general, if you are going for photorealism you will always use textures based on photographs to create your materials. However, we do need to do some work to make sure that the textures are correctly set up.

We're using a `MeshStandardMaterial`, which is part of a  **Physically Based Rendering** workflow (**PBR** for short). Specifically, this material uses a **PBR metalness-roughness workflow**. We'll explain what this means in **Section 4: Materials and Textures**. For now just think of it as a physically accurate simulation of the way that light interacts with a surface.

## Set Up Textures



For this material to look good, we will need to prepare textures that suit this workflow. Remember that we are using the terms **map**, **texture**, and **map** interchangeably here, although generally when we say **map** we are talking about using a **texture** in a specific material slot.

We'll need:

* A **diffuse** or **color** `map` to replace the current `UV_grid.png`
* Either a `.bumpMap` or a `.normalMap` to describe what the bumps and grooves on the surface of the wood look like
* A `.roughnessMap` that describes the roughness property of the material in the roughness-metalness workflow
* A `.metalnessMap` that that describes the metalness property of the material in the roughness-metalness workflow

We should also add an `.envMap` (environment map), which adds subtle reflections from the environment that the object is in. We're going to skip this for now though to keep things simple.

Damn, that actually sounds like a lot of work! How would we even go about creating a texture the represents the 'metalness' of wood?

Wouldn't it be great if someone else has already set these up and made them available for free on the internet?

Sure enough, a quick search for **free PBR materials** brings up this glossy {{< externalLink src="https://freepbr.com/materials/bamboo-wood-pbr-material/" name="Bamboo Wood PBR Material" >}} from {{< externalLink src="https://freepbr.com/" name="freePBR.com" >}}. The textures are in PNG format and are extremely high quality - much higher than we need.

The textures are all 2048 x 2048 in PNG format and in total come to around 20MB. Remember that we want our app to load fairly quickly over even a slow internet connection, and be able to run on a mid-range phone. It's likely that 20MB for an _entire_ app is too much, so we'll need to reduce these.

If you recall from [Chapter 1.4](/book/first-steps/textures-intro/#accepted-texture-formats), the rule of thumb in choosing a texture format is that, so long as we don't need to worry about transparency or tiny details such as text, we should always choose JPG for our images.

Sure enough, converting all the images to high-quality JPGs reduces the size to just under 5MB, and personally, I was unable to see any difference in quality between the PNG and JPG versions. Feel free to compare the images from the link above with the ones below yourself to verify this.

Note that 5MB of textures for a single material is still a little on the high side, but since it's the only material in our scene we'll let that slide for now.

Here are the textures in JPG format - if you are working locally, right click and "save-as" to store them in your local folder.

### Diffuse (Color) Texture

{{< figure src="first-steps/bamboo/bamboo-diffuse.jpg" alt="Bamboo diffuse color texture" height="20rem" lightbox="true" class="small left" >}}

This is a direct replacement for the UV test texture that we've been using so far it will go into the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.map" name="MeshStandardMaterial.map" >}} slot. Of all the textures below, it's the one that actually _looks_ like wood. Actually, it's just a simple photograph of a wooden surface that has had some minor lighting and color correction applied.

If you look closely, you will notice that it has also be modified so that it is _tileable_ - that is, if you stack copies of the texture next to each other, or above and below, then they will fit seamlessly. So you can make an infinitely large wooden surface from this single texture. All the other textures below are also tileable.

### Normal Map

{{< figure src="first-steps/bamboo/bamboo-normal.jpg" alt="Bamboo normal texture" height="20rem" lightbox="true" class="small right" >}}

A normal map describes the pattern of bumps and dents across the surface of a material. The detail added in this way is _fake_ - the shape of the surface of the object is not actually changed, it's just some clever mathematics that describes how light should bounce off the material so that it looks like it is bumpy.

There is an older technique similar to normal mapping called bump mapping, which can be a little faster and generally has smaller texture sizes, however, the results are usually not as good. The main difference you will see in the textures is that a bump map is grey-scale, whereas a normal map uses all the red, green and blue color channels to store information.

The normal map goes into the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.normalMap" name=".normalMap" >}} slot, and as you might expect there is a corresponding {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.bumpMap" name="bumpMap" >}} slot if you choose to use that instead (there's no point in using both together).

There's a final type of texture that can affect how bumpy the surface looks, and that is called a height or displacement map. Unlike the bump and normal maps, a displacement map literally does change the surface of a material. The position of the vertices are passed to your graphics card along with the displacement map, and a new position is calculated based on how white the texture is at that point. Displacement maps go into the  {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.displacementMap" name=".displacementMap" >}} slot, although we won't be using one for now.

### Roughness Texture

{{< figure src="first-steps/bamboo/bamboo-roughness.jpg" alt="Bamboo roughness texture" height="20rem" lightbox="true" class="small left" >}}

As we mentioned above, the material that we are using - `MeshStandardMaterial` - uses a 'roughness-metalness' workflow to describe how the surface of the material reacts to light. This is one of two standard models for materials, the other one being a 'specular - shininess' workflow (also called a 'specular - glossiness' workflow), as used in the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshPhongMaterial" name="MeshPhongMaterial" >}} and {{< externalLink src="https://threejs.org/docs/#api/materials/MeshLambertMaterial" name="MeshLambertMaterial" >}}, two older materials that come with three.js.

Both of these workflows describe how the surface of the material reacts to light. In the 'roughness-metalness' workflow, the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.roughnessMap" name=".roughnessMap" >}} and corresponding {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.roughness" name=".roughness" >}} setting describe the 'microsurface' properties of the material. That is, if the normal/bump/displacement maps describe the large-scale dents and scratches of a material, the roughness map describes the microscopic details.

### Metalness Texture

{{< figure src="first-steps/bamboo/bamboo-metal.jpg" alt="Bamboo metalness texture" height="20rem" lightbox="true" class="small right" >}}

The {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.metalnessMap" name="metalnessMap" >}} and corresponding {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.metalness" name=".metalness" >}} property describe how metallic a material is. This is a fundamental property of real-world materials - since metals are conductors they do not reflect all photons but instead absorb them and may reflect them in a different wavelength (color). The `.metalness` property of a material is used to simulate how much the material should absorb photons, and if it is high, or the metalness map is close to white, then the color or color map properties will be used to determine what color the photon should be once it is re-emitted.

That's right, we are literally simulating the properties of a surface down to the level of absorption and re-emittance of photons! At least when using the Standard material. The older Phong and Lambert materials don't use this level of accuracy in simulating materials.

In this case, the texture just looks black, which is what we would expect since wood is not at all metal. This means that wood does not absorb photons, it simply reflects and scatters them.

### Other Textures

If you download the files from the site above (we're using the Unreal version rather than the Unity version), you'll see that there is another texture included as well - the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.aoMap" name=",.aoMap" >}}, or Ambient Occlusion map. We'll skip this for now, since three.js doesn't currently support this easily, meaning that and we cannot use this texture directly. Hopefully, this will change in the near future. This map type describes how shadows form in the bumps, crevices and folds of a material and adds quite a lot of realism if used correctly.

For a highly realistic texture, we should also be including an {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.envMap" name="envMap" >}} or Environment Map, which is an image of the environment the object is in - it adds subtle reflection details to the material. This also takes a bit of setting up, so we'll skip that as well for now, and come back to both of these in **Section 4**, along with other maps such as the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.alphaMap" name="alphaMap" >}}, which describes the transparency of an object, the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.emissiveMap " name="emissiveMap " >}} which describes whether the object gives off light over its surface, and the {{< externalLink src="https://threejs.org/docs/#api/materials/MeshStandardMaterial.lightMap " name="lightMap " >}} which creates fake lighting effects across the surface the object.

{{% /fullwidth %}}

## Creating a Realistic Material

### 1. Load The Textures {#load-textures}

> Load the texture for the material

{{< highlight js >}}
file="resources/examples/misc/x-realistic-texture/js/app.js" from="71" to="80"
{{< /highlight >}}

Notice that we've replaced the `uv_test.png` with `bamboo-diffuse.png`. We are still setting the anisotropy here, although we'll only do this for the diffuse map. There's no need to do this for the `normalMap` and the `roughnessMap`. High values of anisotropy use a lot of graphics memory and it's unlikely that you will be able to see any difference when changing this setting on the other textures. Feel free to experiment yourself to confirm this.

Hmmm... what happened to the metalness map? Well, each of these maps has a sister setting that modulates the map. Let's examine those, and we'll see why.

* For the diffuse / color `material.map` property, the sister setting is the `material.color`. If we leave out `.map`, then the material will apply the single `.color` over the whole surface. If we specify both, then the color of each pixel (technically, **texel**) of the texture will be multiplied with the `.color`. Note that `material.color` _always_ has some value - by default, it is `0xffffff`, white. However, white is equivalent to 1 when multiplying colors, so if we multiply our color map by a white color, it will be unchanged.

* Next, the `.normalMap` has a corresponding `.normalScale` property, which is a {{< externalLink src="https://threejs.org/docs/#api/math/Vector2" name="Vector2" >}} that says how strong the `.normalMap` should be. We'll explain how it works later, when we study materials in depth. As with the `.color`, `.normalScale` has a default value, in this case, it's the 2D Vector `(1, 1)`.

* `.roughnessMap` is connected to the `.roughness` property, which can be any value from 0 to 1 and has a default value of 0.5. If there is no `.roughnessMap`, then a uniform roughness based on the `.roughness` value is applied over the whole surface. If there is a `.roughnessMap`, then its ~~pixels~~ texels are multiplied by the `roughness` value.

* `.metalnessMap` is connected to the `.metalness` property, which can also be any value from 0 to 1 and also has a default value of 0.5. This works in exactly the same way as `.roughnessMap` / `.roughness`.

This final `.metallness` property explains why we can skip the `.metalnessMap`. Since our `.metalnessMap` is pure black, meaning that metalness is 0 over the whole surface, we can just skip the texture and set `.metalness` to 0 to get the same result.

### 4.3 Assign the Textures to the Material and Set the Material's Parameters {#assign-texture}

> Assign the textures to appropriate map slots in the material

{{< highlight js >}}
file="resources/examples/misc/x-realistic-texture/js/app.js" from="80" to="89"
{{< /highlight >}}

Finally, we want to apply the textures to their appropriate map slots in the material, and then adjust the settings of the material until we have something that looks like wood.

Set the `metalness` to 0 - as discussed above - since wood is not at all metallic. Next, set the `roughness` to 0.25. There is no special reason for this, I found that value purely by trial and error and it seems to give good result. Try other values yourself to see if you can improve this, and to experiment with the effects of this setting on the way light interacts with the material.

We started out with high quality and well-prepared textures, so we are able to get good results with minimal effort. Ultimately, the quality of your textures will determine how good your material looks.

## Adjusting the Lighting

> Turn the ambient lighting way down

{{< highlight js >}}
file="resources/examples/misc/x-realistic-texture/js/app.js" from="59" to="62"
{{< /highlight >}}

Now that we actually have a properly set up material and are not just staring at a UV test texture, the first thing that you may notice is that our lighting setup looks glaringly bright. This is to be expected, since our ambient is set to white with an intensity of 1. There is no way we would ever use this setting in a production app, so let's set it way down to a dim gray `0x333333`.

We can remove the intensity setting, which will leave it at the default of `1.0`. This is a common way of setting up ambient lighting, and you would usually use between `0x111111` for a dim interior or night scene, and `0x666666` for a bright outdoor scene. In the latter case you might also use a slightly yellow tinge to simulate daylight.

## Final result

Here's our final result. It may take a couple of seconds for the textures to load, depending on your internet speed, and in the meantime the textures will display as black. If you recall from [Chapter 1.4](/book/first-steps/textures-intro/#load-texture), this is because the textures are loaded _asynchronously_, allowing our app to load up and start running even if the textures have not finished downloading yet.

{{< codesandbox src="looeee/discoverthree.com-examples/tree/master/misc/x-realistic-texture" preview="true" >}}

{{% fullwidth %}}
## Conclusion

Well done! You made to the end of the first section! And the end of the free section! Don't forget to sign up to the mailing list to stay up to date with information regarding the release of the book, and any blog posts or tools I release in the meantime.

Thanks for sticking with me. I hope you found this easy to follow and learned something along the way. We covered a lot of theory here in quite a short time, but don't worry if you found it a lot to take in. The purpose of this section was to get you up to speed with a lot of terminology and concepts in as short a time as possible.

Everything that was introduced here will be explained in more depth in later chapters, and you will find it much easier to grasp now that you are already familiar with it.

Do make sure that you a good understanding of the code so far before continuing. Here it is in its entirety:

{{< inlineCode js >}}
file="resources/examples/misc/x-realistic-texture/js/app.js"
{{< /inlineCode >}}

{{% /fullwidth %}}