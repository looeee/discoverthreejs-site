If you look at the [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry) docs page, you'll see that there are a number of methods for applying transformations directly to the geometry. The one we want is called [BufferGeometry.rotateX](https://threejs.org/docs/#api/geometries/BufferGeometry.rotateX), so go ahead and add the above line and then our geometry will be ready for use.

{{% aside %}}

### Transforming Meshes vs Transforming Geometries

Transforming the geometry will give us the same visual result as transforming the mesh. There are, however, a couple of important differences. We'll investigate this thoroughly later, but for now, make a special note of this:

#### Transforming the Mesh is **MUCH** More Efficient

When you transform a `Mesh` you're only updating a few numbers describing the position, rotation, and scale of the `Mesh`, which is a fast operation that we can easily do thousands of times each frame without slowing our app down.

However, when you transform a geometry, you are applying a transformation to the **vertices** and **normals** that make it up (we'll explain what these are in [Section 8: Understanding Geometry](/book/geometry/)), resulting in hundreds of thousands or possibly even millions of operations.

In the case of our `CylinderBufferGeometry`, this is not an issue since it's a simple geometric shape. But a more complex geometry on low power hardware might take quite a while.

Whenever you _do_ transform the geometry rather than the mesh, always try to do it as a one-time operation when you are creating the geometry, and _never_ do it every frame in the `update` function.

Updating the transform of a mesh, or even hundreds of meshes, in `update()` is completely fine though.

{{% /aside %}}
