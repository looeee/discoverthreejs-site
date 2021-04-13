{{% aside %}}

## Inheritance Documentation in three.js

You can see the inheritance chain for an object at the top of the docs page. For the `DirectionalLight` it looks like this:

**[Object3D](https://threejs.org/docs/#api/en/core/Object3D) → [Light](https://threejs.org/docs/#api/en/lights/Light) →**

This means that the `DirectionalLight` inherits all the properties and methods from `Light`, and `Light` in turn inherits all the properties and methods from `Object3D`. You will need to follow this inheritance chain to find all the documentation for an object.

Nearly everything inherits from `Object3D` - `Scene`, `Mesh`, `PerspectiveCamera` all do - since it contains all the methods and properties required for moving objects around in 3D space.

{{% /aside %}}