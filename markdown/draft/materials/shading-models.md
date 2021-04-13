---
title: "Shading Models Used by the Built-In Materials"
description: "TODO"
date: 2018-04-02
weight: 801
chapter: "8.1"
---


# Shading Models Used by the Built-In Materials

## The Shading Algorithm used by a Material Consists of an Illumination Model and an Interpolation Model

**The algorithms that we use for shading are defined in the material**, and can be slit into two parts, called the **Illumination Model**, and the **Shading Model**.

{{% aside %}}
A common point of confusion here is that some of the illumination and shading models have similar names, but are not actually related. For example, there's **Phong Lighting** (AKA **Phong Reflection**, or **Phong Illumination**), and also [Phong Shading](https://en.wikipedia.org/wiki/Phong_shading). However, these names come because they were created by a [guy named Phong](https://en.wikipedia.org/wiki/Bui_Tuong_Phong), and _not_ because they need to be used together. To make matters even more confusing, when they _are_ used together the combination is commonly referred to as just Phong shading. Cue rolling eyes emoji.
{{% /aside %}}

### The Illumination Model Describes How Lighting Effects an Object

Before we look at them, let's note that what we're thinking of as "lighting" should more accurately be referred to as "reflection" since we're actually talking about the way in which light reflects, or bounces, off an object to end up in our eyes.

From a physical perspective, when light hits and object, three things may happen:

1. The light gets absorbed by the material
2. The light goes through the material and gets refracted out of the other side
3. The light gets reflected, that is, it bounces off the surface of the material

Most real world materials do some amount of all three of these. However, the illumination model only considers the third, that is, the way in which light gets reflected from a surface.

We can further split reflection up into two parts:

1. Specular Reflection
2. Diffuse Reflection

Specular reflection is east to understand - for example, a perfect mirror reflects all light in a specular manner. So, specular reflection means that light comes in at one angle and simple bounces out again after hitting the surface:

Highly specular surfaces are very smooth or polished, meaning that at the "atomic" or texture level they don't change much.

{{< figure src="materials/specular_reflection.webp" alt="Specular Reflection of Light Rays" title="Specular Reflection of Light Rays" lightbox="true" >}}

### Ambient Lighting

Ambient Lighting doesn't fit into the above illumination models, and is often added as a "hack", separate to the above calculations.

By contrast, diffuse surfaces are very rough at the atomic level. This means that when light rays come in, they get reflected out at a range of angles

{{< figure src="materials/diffuse_reflection.gif" alt="Diffuse Reflection of Light Rays" title="Diffuse Reflection of Light Rays" lightbox="true" >}}

Most materials reflect light with of a combination of specular and diffuse reflection. In these materials, the specular part of the reflection will result in [**specular highlights**](https://en.wikipedia.org/wiki/Specular_highlight).

## Illumination Models Used by three.js Materials

In three.js, there are four main Illumination models in use:

1. No lighting - just ignore any lights in the scene, used for example in the `MeshBasicMaterial`
2. Diffuse Reflection only, using [Lambertian reflectance](https://en.wikipedia.org/wiki/Lambertian_reflectance) - this is a very basic way of interpreting lighting, which models **matte**, or non-shiny, surfaces such as paper or freshly cut wood fairly well. However, it cannot show , so it's not suitable for polished or shiny surfaces.
3. [Phong Lighting](https://en.wikipedia.org/wiki/Phong_reflection_model) splits the lighting into three components: ambient (constant lighting from all directions), [Diffuse](https://en.wikipedia.org/wiki/Diffuse_reflection), and [Specular](https://en.wikipedia.org/wiki/Specular_reflection)

#### Illumination Models can be Applied at Different Levels

The next step in deciding how to use the illumination model in a

### The Shading Model Describes How the Parts of the Object that were Skipped by the Illumination Model will Look

The term **Illumination Model** means the algorithm that we use to calculate the effect that lighting has on the objects in our scene, and there are several [popular shading models in common use](https://en.wikipedia.org/wiki/List_of_common_shading_algorithms).

## Shading Models Used by the main three.js Materials

As we mentioned above, the Lambertian Reflectance model just calculated lighting at the vertices of a model. In the case of a low-poly cube, for example, this would mean that the lighting is only calculated the four corners.

Calculating the in-between bits is where the shading model comes in, via a process known as **interpolation**, which is the process of calculating the unknown values in between a set of known values.

There are several Shading Models in use in three.js:

1. Flat Shading is what we get if we set `material.flatShading = true`, and it overrides the other shading model used by the material. As we saw back in [Chapter 1.6](/book/first-steps/shapes-transformations/#create-materials), this can be used to give a faceted, or carved, look to our objects
2. [Gouraud Shading](https://en.wikipedia.org/wiki/Gouraud_shading) is used when lighting has only

### MeshBasicMaterial, LineBasicMaterial, LineDashedMaterial, PointsMaterial, SpriteMaterial

These materials use an extremely simple shading model

