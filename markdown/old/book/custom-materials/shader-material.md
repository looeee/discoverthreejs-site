---
title: "Writing Your Own Materials With three.js: ShaderMaterial"
description: "TODO"
date: 2018-04-02
weight: 1601
chapter: "16.1"
---
{{% fullwidth %}}
# A BRIEF INTRO TO WRITING SHADERS WITH three.js: ShaderMaterial AND RawShadeMaterial
{{% /fullwidth %}}

## The ShaderMaterial

Require a vertex shader and a fragment shader.
These are two steps of the rendering pipeline that we are allowed to modify.
Lots of other steps that we can't modify.

CPU:

1. Set up app
2. Use WebGL API to send data to GPU

GPU:

1. receive data
2. transform vertices based on vertex shader
3. do other stuff, e.g. check what's visible and remove vertices that can't be seen
4. send remaining vertices to the fragment shader.

Basically, the fragment shader gets a big list of triangles as well as data about the 3 points of each triangle. It is then responsible for deciding what color each pixel inside the triangle should be.

In the simple example we're about to build, the fragment shader is just going to decide that each pixel should be purple.

## <Minimal example using ShaderMaterial - 4.4a>

### Variables type in GLSL code

All the normal variable types are available - integers, float, vectors and so on. However, there are also three "super" types, `uniform`, `attribute`,  and`varying`. These are declared at the start of the shader code.

* Uniform: this type of variable is the same in the vertex and the fragment shader, meaning that it is read only and stays the same across the entire frame being rendered. It may change from frame to frame though. A typical use case is to pass in the light color.

{{< highlight js >}}

// vertex or fragment shader
uniform vec3 lightColor;

{{< /highlight >}}

* Attribute: Vertex shader only. Contains attributes for the vertex, usually directly related the geometry attributes: normal, position, UV. There is one of each attribute for each vertex, that is, each vertex has it's own position, normal and UV coordinates. Just as with uniforms, the value of an attribute cannot be changed within the frame being rendered.

{{< highlight js >}}

attribute int myNumber


{{< /highlight >}}

* Varying: this type of variable is passed into the vertex shader, modifed, then sent on to the fragment shader. You must declare a varying variable of the same name in each shader. A typical example is a normal,

{{< highlight glsl >}}
// top of vertex shader - here's a vector 3 representing a color that we want to
// modify based on something about the vertex, for example, it's position

varying vec3 colorFactor;

{{< /highlight >}}

{{< highlight glsl >}}
// top of fragment shader - we declare the same varying vector 3. However,
// the fragment shader will receive the result of the computation from the vertex shader

varying vec3 colorFactor;

{{< /highlight >}}

## Difference between ShaderMaterial and RawShaderMaterial

Trick to see all the available variables in ShaderMaterial: put an error in your code!


## <Minimal example using RawShaderMaterial - 4.4b>




