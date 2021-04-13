A total of five different coordinate systems are used to get an object from creation onto your screen:

1. **local space**: when we do `new Mesh` or `new DirectionalLight`, the newly created object exists in it's own local coordinate system
2. **world space**: when we do `scene.add(mesh)`, the mesh is transformed to world space
3. **view space**: next, the object is transformed to point of view of the camera
4. **clip space**: is an intermediate space used to convert the 3D camera POV to the 2D screen space
5. **screen space**: the final position of an object on the 2D surface of your screen

Another important 2D coordinate system is texture space, which we will introduce in {{< link path="/book/first-steps/textures-intro/" anchor="" title="" >}}
