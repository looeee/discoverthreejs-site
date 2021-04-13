---
title: "Basic Geometry Concepts: Vertices, Normals and UVs"
description: "TODO"
date: 2018-04-02
weight: 1001
chapter: "10.1"
---


## Basic Geometry Concepts: Vertices, Normals and UVs

Let's take a quick look under the hood of a geometry and see what makes it tick. We'll examine this in much more detail in Section 6, and even see how to make our own geometries from scratch. For now though, it will be useful for us to get a basic idea of the main concepts.

codesandbox src="looeee/discoverthree.com-examples/tree/master/first-steps/ch-3-resize" module="/js/app.js"

{{< figure src="first-steps/geometry_details.svg" alt="Vertices and normals of a cube geometry" >}}

### Vertex Positions

The bare minimum that geometry needs is information about the position of the _vertices_ that make up it's shape. A _vertex_ is a point in 3D space. For example, our `BoxBufferGeometry` has 8 vertices, one for each corner of the box... well, kind of. These vertices may need to be duplicated as we'll see below.

{{< figure src="first-steps/geometry_vertices.svg" alt="A box geometry's vertices" >}}

 Each vertex has an x, y and z position - that means that we have 3 pieces of information defining the position of each vertex.

### Normals

With just these 3 pieces of information - x, y and z positions - for each vertex, we can render the cube. However, for lighting to work, we need an additional piece of info called a **normal**. A normal contains information about the direction that a face or vertex is pointing - that is, the direction that light should bounce when it hits the surface.

{{< figure src="first-steps/geometry_normals.svg" alt="A box  geometry's normals" >}}

This diagram shows _face normals_. In this case a normal defined for each face. Our buffer geometry is actually using _vertex normals_, which means that a normals are defined for each vertex. However, the basic concept is the same and face normals are a bit easier to understand, so let's go with those for now.

Like vertex positions, each normal also has a x, y, and z component. Unlike the vertices though, these don't specify a position, instead they represent a _direction_. The position of a normal doesn't matter since that info is contained



> 3D vectors and points are both represented using a Vector3 object

{{< code lang="js" linenos="false" hl_lines="" >}}
var point = new THREE.Vector3( 0, 1, 2 );
var vector = new THREE.Vector3( 0, 1, 2 );
{{< /code >}}

> Vectors can represent lots of different things

{{< code lang="js" linenos="false" hl_lines="" >}}
var velocity = new THREE.Vector3( 0, 1, 2 );
var position = new THREE.Vector3( 0, 1, 2 );
var scale = new THREE.Vector3( 0, 1, 2 );
{{< /code >}}
{{% aside success %}}
#### The Vector Classes

When working with vectors and points, you should use the built-in [`Vector3`](https://threejs.org/docs/#api/math/Vector3) class.

We've talked about two different uses for this, but actually a vector can be used to represent all kinds of things, such as scales, rotation, position, velocity and many others.

Since we're working in 3D they're the ones we usually need 3D vectors. However, we may sometimes need 2D or 4D vectors as well. In all cases, three.js has you covered since there are also [`Vector2`](https://threejs.org/docs/#api/math/Vector2) and [`Vector4`](https://threejs.org/docs/#api/math/Vector4) classes.
{{% /aside %}}


### UVs

Finally, and most importantly for us in the chapter, we come to UVs. The are used to map a 2D texture onto a 3D object. As we mentioned above, this will be easy to do on our square since all the sides are flat, so we can just place a square image directly onto the surface. Fortunately, our `BoxBufferGeometry` has already set this up for us so we don't need to do it manually. But let's take a moment to understand what's going on.

What we want to do here is map a 3D position on our object onto a 2D position.

The 3D position is a vertex, specified by an `(x, y, z)` coordinate. We already have that. What should our 2D position be? To understand this, let's create a texture and divide it up into a grid, with `(0, 0)` at the top left corner and `(1,1)` at the bottom right. It will look something like this:

{{< figure src="first-steps/uv_test_512.png" alt="UV test grid texture" >}}

Now we will give every vertex, that is, every `(x, y, z)` point in our geometry a place on this grid. But since we've already used the letters `x` and `y`, we need some new letters. Let's use `u` and `v`. So our UV map is a map from `(x,y,z)` $\rightarrow $ `(u, v)` for every vertex in our geometry.

Mathematically speaking, this is a 1-1 mapping. Each 3D vertex position, `(x,y,z)`, maps to exactly one 2D texture coordinate `(u, v)`.

For example, if we create a 2x2x2 `BoxBufferGeometry`, the top right corner will be positioned at `(1,1,1)` and this will be mapped to the texture's top right corner, that is `(1,0)`.

Let's see what that looks like:

{{< code lang="js" linenos="false" hl_lines="" >}}
// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {

  // Get a reference to the container element that will hold our scene
  container = document.querySelector( '#scene-container' );

  // create a Scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0x6AC174 );
  scene.background = new THREE.Color( 0x8FBCD4 );

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 0.1, 50 );

  // every object is initially created at ( 0, 0, 0 )
  // we'll move the camera back a bit so we can view the scene
  camera.position.set( -2, 2, 5 );

  var controls = new THREE.OrbitControls( camera, container );

  // create a geometry
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

  console.log( 'BoxBufferGeometry\'s position, normals and uv:' );
  console.log( geometry.attributes );

  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'anonymous';

  const texture = textureLoader.load( '/images/first-steps/uv_test_512.png' );

  texture.anisotropy = 16;

  // create a Standard material
  const material = new THREE.MeshBasicMaterial( {
    map: texture
  } );

  // create a Mesh containing the geometry and material
  mesh = new THREE.Mesh( geometry, material );

  // add the mesh to the scene object
  scene.add( mesh );

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  // add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );

  renderer.animate( () => {

    update();
    render();

  } );

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

  // nothing for now

}

// render, or 'draw a still image', of the scene
function render() {

  renderer.render( scene, camera );

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

// call the init function to set everything up
init();

{{< /code >}}

{{% aside success %}}
Take a few minutes to examine the texture and the way that it maps onto the cube now.

You may notice something odd - that is, every corner of the cube has three little arrows coming out of it, pointing to three different UV coordinates. So, does that mean that each corner of the cube has 3 different `(u, v)` coordinates? Didn't I just say that each `(x, y, z)` coordinate is mapped to exactly one, unique, `(u,v)` coordinate?

Well, yes. Each vertex can only map to one UV position, but each vertex _needs_ to be mapped to _3 different_ UV coordinates. The solution? Each corner of the cube is duplicated 3 times. That means our cube actually has 24 vertices rather than 8.

Every vertex needs to be mapped to 3 different normals as well. This is something that will happen every time you have a hard edge in your geometry. Remember this:

* **hard edge: more than one normal per vertex, vertex needs to be duplicated**
* **texture edge: more than one UV per vertex, vertex needs to be duplicated**

It so happens that our texture edge and geometric hard edge in our cube are the same, so we're duplicating the same vertices for each.

Don't worry if that is a lot to take in for now, we'll come back to it in Section 6.

{{% note %}}
TODO-LINK: add link to section 6
{{% /note %}}

{{% /aside %}}

{{% aside success %}}

### Interpolation

Before we proceed to actually loading out texture, let's briefly introduce another important concept that is used a lot in 3D graphics. It's called `Interpolation`.

Whenever you had finished being bamboozled by the fact that each vertex in the cube is actually _three_ vertices, you might have noticed something else. Or, you might not. I never notice the things that authors say that you _might have noticed_! Just take it as a literary technique for introducing a new concept. Anyway, you _might_ have wondered, well, OK, the vertices are being mapped to the corners of the texture. But what about the spaces _between_ the vetices?

The gaps are _linearly interpolated_. That means that if we have the top left corner of the cube at `(-1, 1, 1)` and the top right at `(1,1,1)` in 3D space and these map to texture space like this:

$$
\begin{aligned}
(-1,1,1) \rightarrow (0, 0) \cr
(1,1,1) \rightarrow (1,0)
\end{aligned}
$$

So what about the point on the edge halfway between those two vertices? It's position in 3D space is `(0, 1, 1)`, and as you might expect get it gets mapped to the point halfway between the two UV coordinates:

$$(0, 1, 1) \rightarrow (0.5, 0)$$

We won't get into the mathematics here, although they are fairly simple. But you can probably see intuitively how the rest of the points on the texture are _interpolated_ between the vertices.

{{% /aside %}}

src="looeee/discoverthree.com-examples/tree/master/first-steps/ch-4-textures-intro" module="/js/app.js"

