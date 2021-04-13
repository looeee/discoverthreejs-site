---
title: "Common Material Properties And Methods"
description: "TODO"
date: 2018-04-02
weight: 802
chapter: "8.2"
---

# Common Material Properties And Methods


# alphaTest

Very short example showing how to use a cutout material for a leaf

# Blending equations

Reference the three.js official examples

https://threejs.org/examples/#webgl_materials_blending
https://threejs.org/examples/#webgl_materials_blending_custom

# Clipping

Reference the three.js official examples

https://threejs.org/examples/?q=clipping#webgl_clipping
https://threejs.org/examples/?q=clipping#webgl_clipping_advanced
https://threejs.org/examples/?q=clipping#webgl_clipping_intersection

https://codepen.io/looeee/pen/qKdQKZ

# Color Write Occlusion

https://codepen.io/looeee/pen/ryqQVo

# CustomDepthMaterial: documented in wrong place! Should be property of Object3D

https://threejs.org/examples/#webgl_buffergeometry_instancing_lambert
https://threejs.org/examples/#webgl_shadowmap_pointlight

# defines



# depthFunc, depthTest, depthWrite



# dithering

This parameter was added quite recently and _should_ be able to help in cases where you see dithering occurring on materials.

It only works for the following materials:

* [`MeshLamberMaterial`](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
* [`MeshPhongMaterial`](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)
* [`MeshToonMaterial`](https://threejs.org/docs/#api/en/materials/MeshToonMaterial)
* [`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
* [`MeshPhysicalMaterial`](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)

Setting `dithering = true` on any other materials will have no effect.

This page has [more info on dithering and possible solutions](http://loopit.dk/banding_in_games.pdf).

# fog



# flat shading

Covered in CH 1.6

# ID

This is used internally by the render.

# isMaterial

You can use this to check whether an object is a material or not

# Lights

Whether this material type is affected by lights. You can't change this.

It's set to false for
[`LineBasicMaterial`](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
[`LineDashedMaterial`](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)
[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
[`MeshDepthMaterial`](https://threejs.org/docs/#api/en/materials/MeshDepthMaterial)
[`MeshNormalMaterial`](https://threejs.org/docs/#api/en/materials/MeshNormalMaterial)
[`SpriteMaterial`](https://threejs.org/docs/#api/en/materials/SpriteMaterial) and true for every other material type.

# name

Just like Object3D, you can name you material and use that to reference it in your code later, or if you are loading a material created in a seperate app, you can name it there and then reference it in your three.js code. Very handy!

# .needsUpdate

When the material is first used by the render, it gets "compiled" - that is, it gets turned into a GLSL shader program. We'll take a brief look at how to write a custom shader program in Ch 4.9, but for now you just need to know that GLSL is a special language that is used for writing materials that your graphics card can understand. It's syntax is quite similar to the C programming language.

Once the material has been compiled, we can still update some of the properties, such as `color`, `opacity` and so on, but we can't update others. If we change these properties we'll need to set the `needsUpdate` flag to true on the material, which will tell the renderer to recompile it.

Actually, it's just a little bit more complex that this since the compiled material also has information about things
like the renderer's [`WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer), so if we change that
we'll need to update all the materials in the scene as well.

You can use this function to do set the flag to true on every material in the scene:

{{< code lang="js" linenos="false" hl_lines="" >}}
function updateMaterials( scene ) {

  scene.traverse( ( child ) => {

    if ( child.material ) {

      if ( !Array.isArray( child.material ) ) {

        child.material.needsUpdate = true;

      } else {

        child.material.forEach( ( mat ) => { mat.needsUpdate = true; } );

      }
    }

  } );

}
{{< /code >}}

Materials that are in your app but haven't been added to the scene yet will not be updated by this function, but in general those won't have been compiled yet.

# opacity

If we've set `material.transparent = true`, this will control how see through the material is and can be set from 0 (completely see through or transparent) to 1 (not at all transparent, or completely opaque)

# polygon offset, polygonOffsetFactor, polygonOffsetUnits

You can see these in action in

https://threejs.org/examples/#webgl_decals

Basically, your would use this feature whenever you are drawing to objects in EXACTLY the same location in 3D space. The typical example given is when you draw a mesh and then draw a wireframe of the same mesh over it to give a glowing outline.

The problem is that when two 3D object are drawn in the same location, the graphics card doesn't know which one to draw first and they end up flickering nastily.

In the decal example above, the paint splatters are drawn mapped exactly onto the poor guy's skin. Polygon offset and polygonOffsetFactor are used to offset this by a tiny amount to prevent flickering.

Here's the official WebGL definition for these terms

Definition:

_When enabled, the depth value of each fragment is added to a calculated offset value. The offset is added before the depth test is performed and before the depth value is written into the depth buffer. The offset value o is calculated by:
o = m * factor + r * units
where m is the maximum depth slope of the polygon and r is the smallest value guaranteed to produce a resolvable difference in window coordinate depth values. The value r is an implementation-specific constant._

Check out this chapter in the [book](https://www.glprogramming.com/red/chapter06.html) for a slightly more in depth discussion of how this work.

# precision

If you want to, you can override the material's default [Qualifier](http://www.shaderific.com/glsl-qualifiers/#precisionqualifiers)

In practice, the only reason that you will likely have for doing this is to overcome a bug on some old mobile device. In that case however, if you think you have found a bug related to shader precision you might be better off opening an issue over on GitHub.

# premultipliedAlpha

https://threejs.org/examples/#webgl_materials_transparency


# side

By default, the polygons that make up your geometry are only visible from the front side. Which side is considered to be the front is determined by something known as the Winding Order. We'll explore how that works in Section 6: Geometry.

If the polygon is determined to be facing the camera, it gets rendered, and if not then it gets culled.

There are times when this is not what you want, especially when you are dealing with transparent objects. In these cases, you can set [the material's side to one of these values](https://threejs.org/docs/#api/en/constants/Materials).

* `THREE.FrontSide` - the default, cull faces that are pointing away from the camera
* `THREE.BackSide` - cull faces pointing towards the camera, allowing you to see "inside" objects
* `THREE.DoubleSide` - don't perform culling based on the polygon's direction

# shadowSide

This takes the same three options as the `material.side`.

You can use this to take fine control over which side of the polygons that make up your mesh cast shadows.

In practice, you'll use this whenever your shadow seems to have unexpected gaps or holes in it.

We'll come back to this on in Ch 5.3 when we look at shadows.

# transparent

Whether or not your material is allowed to be transparent. Transparency can occur when you set the `.opacity` less than one, or when you use a transparent image as a texture `map` or `alphaMap` on a material that supports those.

If you leave this set to it's default value of `false`, then `opacity` will have to effect and transparent areas of textures will be rendered with the material's color.

# UUID


An [auto generated](https://threejs.org/docs/#api/en/math/Math.generateUUID) [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) for this material. You can use this to reference the material if you like, although it's better to name the material instead.

# type

For the base material class, this will be `Material`. For derived classes it will be the name of the derived class, for example, `MeshBasicMaterial`.

# vertexColors

The parrot model that we've been using in our examples is actually just using a plain white `MeshStandardMaterial`!

The secret to the way it's colored is that it's geometry has an extra attribute defining the color of each vertex, and we can tell the material to use these or ignore them by setting this to `THREE.NoColors` or `THREE.VertexColors`.

There's actually a third setting left over from the old `Geometry` type called `THREE.FaceColors`, however, for `BufferGeometry` this has the same effect as `THREE.VertexColors`.

We'll explore how to add vertex colors to a geometry in Section 6: Geometry.

# visible

You can quickly hide all the objects using a particular material in your scene by setting `material.visible = false`

# userData

We're using userData in our App class to store a custom `onUpdate` function that we call once per frame. We could do something similar with materials, or we can store any other data that we like here.

Be warned that if you add a function or anything else that can't be serialised to JSON here, then when you clone or copy the material that function won't get copied over to the new material.

# Material Methods

The base Material class also has a couple of handy methods that all derived classes have access to. As with most three.js classes, there are `.copy`, `.clone` and `.toJSON` which work the same way as usual.

In addition to those we have:

## Dispose()

Dispose of the material and remove it from memory. However, this _doesn't_ dispose of the textures used as maps in the material. That's a good thing since you might be sharing textures across a few materials, however, it's important to also dispose of those once you are done with them since they take up a lot of memory!

## onBeforeCompile



## setValues

This gets called internally when you create the material with whatever properties you passed to the constructor. We can use it again later to set multiple parameters at one by passing in a new spec object here.