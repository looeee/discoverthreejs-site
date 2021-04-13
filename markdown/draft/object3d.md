### Classes that Inherit from `Object3D`

Here's a big of _all_ the classes that inherit from `Object3D`, either directly, like `Light` and `Mesh`, or thought an intermediate, like `DirectionalLight`.

All of these objects have `.position`, `.rotation`, and `.scale` properties, and the can all be added to our scene with `scene.add( object )` and removed with `scene.remove( object )`.

They have some other useful properties as well. Take a look at [the `Object3D` docs page](https://threejs.org/docs/#api/en/core/Object3D) now - everything in this list inherits every property and method listed there.

Some useful properties to take note of are:

- [`.name`](https://threejs.org/docs/#api/en/core/Object3D.name): very useful for organizing your scene
- [`.visible`](https://threejs.org/docs/#api/en/core/Object3D.visible): we can quickly hide an object, or disable a light, by setting this property to `false`
- [`.children`](https://threejs.org/docs/#api/en/core/Object3D.children): when we call `scene.add( mesh )`, the mesh gets stored in this array. We can add objects to any `Object3D`, not just the scene!
- [`.parent`](https://threejs.org/docs/#api/en/core/Object3D.children): the converse of children, when we call `scene.add( mesh )`, the scene gets stored in `mesh.parent`. An object can have many children, but only one parent

Take note of these methods too:

- [`.add()`](https://threejs.org/docs/#api/en/core/Object3D.add)
- [`.remove()`](https://threejs.org/docs/#api/en/core/Object3D.remove)
- [`.clone()`](https://threejs.org/docs/#api/en/core/Object3D.clone)
- [`.getObjectByName( string )`](https://threejs.org/docs/#api/en/core/Object3D.getObjectByName): search through `.children` and find the first one with the matching name.

#### Standard Visible Objects

- [Mesh](https://threejs.org/docs/api/en/objects/Mesh.html): the basic mesh object
- [Sprite](https://threejs.org/docs/api/en/objects/Sprite.html): used for rendering 3D images - if you want to make a Super Mario clone in three.js, you'll use this a lot
- [Line](https://threejs.org/docs/api/en/objects/Line.html), [LineLoop](https://threejs.org/docs/api/en/objects/LineLoop.html), [LineSegment](https://threejs.org/docs/api/en/objects/LineSegments.html)
- [Points](https://threejs.org/docs/api/en/objects/Points.html): the basic component of particle systems in three.js
- [LOD](https://threejs.org/docs/api/en/objects/LOD.html) (Level of Detail): this object automatically replaces a complex mesh with a simple mesh as the camera gets further away

#### Cameras

- [Camera](https://threejs.org/docs/api/en/cameras/Camera.html): The camera base class. We will ever use this directly
- [ArrayCamera](https://threejs.org/docs/api/en/cameras/ArrayCamera.html): An old approach for rendering in Virtual Reality
- [CubeCamera](https://threejs.org/docs/api/en/cameras/CubeCamera.html): We can render our scene to a _cubemap_ which we can then use to create [dynamic reflections](https://threejs.org/examples/#webgl_materials_cubemap_dynamic)
- [OrthographicCamera](https://threejs.org/docs/api/en/cameras/OrthographicCamera.html): this camera renders using orthographic projection. Useful for 2D scenes and user interfaces
- [PerspectiveCamera](https://threejs.org/docs/api/en/cameras/PerspectiveCamera.html): this camera renders using perspective projection. We will nearly always use this camera
- [CameraHelper](https://threejs.org/docs/api/en/helpers/CameraHelper.html): this work with the `OrthoGraphics` or `PerspectiveCamera` only

#### Organizational Objects

- [Scene](https://threejs.org/docs/api/en/scenes/Scene.html): our trust pocket universe
- [Group](https://threejs.org/docs/api/en/objects/Group.html): useful for grouping objects together, as we'll see shortly

#### Skeletal Animation Objects and Helpers

Skeletal animations enable us to place a skeleton inside a model (of, say, a human or a cat) and then play animations such as walking or running.

- [SkinnedMesh](https://threejs.org/docs/api/en/objects/SkinnedMesh.html): an enhanced version of Mesh that we can use for Skeletal animation
- [Skeleton](https://threejs.org/docs/api/en/objects/Skeleton.html)
- [Bone](https://threejs.org/docs/api/en/objects/Bone.html): the building block of skeletons
- [SkeletonHelper](https://threejs.org/docs/api/en/helpers/SkeletonHelper.html)

#### Audio and Audio Helpers

Various classes for playing sound in a 3D environment

- [Audio](https://threejs.org/docs/api/en/audio/Audio.html)
- [AudioListener](https://threejs.org/docs/api/en/audio/AudioListener.html)
- [PositionalAudio](https://threejs.org/docs/api/en/audio/PositionalAudio.html) and [PositionalAudioHelper](https://threejs.org/docs/api/en/helpers/PositionalAudioHelper.html)

#### Mathematical Helpers

A well as the helpers listed above, there's some extra math helpers to help you visualize the unthinkable:

- [ArrowHelper](https://threejs.org/docs/api/en/helpers/ArrowHelper.html)
- [AxesHelper](https://threejs.org/docs/api/en/helpers/AxesHelper.html)
- [BoxHelper](https://threejs.org/docs/api/en/helpers/BoxHelper.html)
- [Box3Helper](https://threejs.org/docs/api/en/helpers/Box3Helper.html)
- [FaceNormalsHelper](https://threejs.org/docs/api/en/helpers/FaceNormalsHelper.html)
- [GridHelper](https://threejs.org/docs/api/en/helpers/GridHelper.html)
- [PolarGridHelper](https://threejs.org/docs/api/en/helpers/PolarGridHelper.html)
- [PlaneHelper](https://threejs.org/docs/api/en/helpers/PlaneHelper.html)
- [VertexNormalsHelper](https://threejs.org/docs/api/en/helpers/VertexNormalsHelper.html)

#### Lights and Light Helpers

- [Light](https://threejs.org/docs/api/en/lights/Light.html): the light base class, never used directly
- [AmbientLight](https://threejs.org/docs/api/en/lights/AmbientLight.html)
- [DirectionalLight](https://threejs.org/docs/api/en/lights/DirectionalLight.html) and [DirectionalLightHelper](https://threejs.org/docs/api/en/helpers/DirectionalLightHelper.html)
- [HemisphereLight](https://threejs.org/docs/api/en/lights/HemisphereLight.html) and [HemisphereLightHelper](https://threejs.org/docs/api/en/helpers/HemisphereLightHelper.html)
- [PointLight](https://threejs.org/docs/api/en/lights/PointLight.html) and [PointLightHelper](https://threejs.org/docs/api/en/helpers/PointLightHelper.html)
- [RectAreaLight](https://threejs.org/docs/api/en/lights/RectAreaLight.html) and [RectAreaLightHelper](https://threejs.org/docs/api/en/helpers/RectAreaLightHelper.html)
- [SpotLight](https://threejs.org/docs/api/en/lights/SpotLight.html) and [SpotLightHelper](https://threejs.org/docs/api/en/helpers/SpotLightHelper.html)

#### Exotic Objects

- [ImmediateRenderObject](https://threejs.org/docs/api/en/extras/objects/ImmediateRenderObject.html): I wonder what this does?
