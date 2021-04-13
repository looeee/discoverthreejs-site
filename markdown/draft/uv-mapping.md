## UV Mapping

Rectangular shapes and patterns, like walls and bricks, represent the easiest possible case for texture mapping. It is easy to apply a rectangular image to a rectangular 3D surface, but less easy if the surface is curved or has holes. three.js uses a technique called [**UV Mapping**](https://en.wikipedia.org/wiki/UV_mapping) to stretch a 2D texture over any kind of 3D surface.


{{< figure src="first-steps/geometry_vertices.svg" alt="A box geometry's vertices" class="small left" caption="Simplified box-shaped geometry"  >}}

Let's take a quick look at how that works now using the simple case of a cube.

The figure on the left is a simplified diagram of a `BoxBufferGeometry`. Each of the red dots is a [vertex](https://en.wikipedia.org/wiki/Vertex_(geometry)), and each vertex has a position in 3D space defined by $(x, y, z)$ coordinates.

{{< figure src="first-steps/uv-test-bw-1024.png" alt="UV test grid texture" class="small right" lightbox="true" caption="A UV Test Texture" >}}

_This is a simplification since WebGL cannot display square faces, only triangles. In the real `BoxBufferGeometry`, each square face is divided into two triangles. However, we won't lose anything by ignoring that for now._

Here, we will describe the process of taking the following black and white texture and mapping it onto our box geometry. We will map one copy of the texture onto each of the six faces of the box.

### The UV Coordinate System

Imagine a 2D coordinate system on top of the texture, with $(0,0)$ in the bottom left and $(1,1)$ in the top right. Since we have already used the letters $X$, $Y$ and $Z$ for our 3D coordinates, we'll call these 2D textures coordinates by the letters $U$ and $V$. This is where the name **UV mapping** comes from.

Here, we are using a texture with a simple black and white checker pattern and a few of the UV coordinates labeled to help us understand how this process works.

UV mapping is the process by which we map 2D $(u, v)$ coordinates onto 3D $(x, y, z)$ coordinates:

$$ ( u, v ) \longrightarrow ( x, y, z ) $$

The following figure shows how this mapping works for the front face of the cube. The other five faces will also have copies of the texture mapped onto them.

{{< figure src="first-steps/geometry_uv_map.svg" alt="3D coordinated mapped to UV coordinates" lightbox="true" >}}

This diagram includes the $(x, y, z)$ coordinates of the vertices that make up cube's the front face. Here, we are performing these mappings:

$$
\begin{aligned}
  (0,0) &\longrightarrow (-1,-1,1) \cr
  (0,1) &\longrightarrow (-1,1,1) \cr
  (1,1) &\longrightarrow (1,1,1) \cr
  (1,0) &\longrightarrow (1,-1,1)
\end{aligned}
$$

### Completed UV Mapping for the Cube

We can use similar mappings for the other five faces. Here's the result:

{{< inlineScene entry="first-steps/texture-map.js" >}}

Take a few moments to examine this mapping now. You can use your mouse or touch screen to move the camera around since we've added camera controls to the scene. We'll see how to do this for ourselves in the {{< link path="/book/first-steps/camera-controls.md" anchor="" title="next chapter" >}}.

