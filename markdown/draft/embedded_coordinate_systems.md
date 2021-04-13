### Every Object is a Tiny Universe

One interesting

It means that, just like the scene, every object is _also_ a tiny universe!

We can add objects to these inner universes, just like we do with the scene.

Every object that we can add to the scene, such as lights, cameras, meshes, also has an `.add` method: `light.add`, `mesh.add`, `camera.add` and so on.

Once again, rather than redefining `.add` for every class, it's defined once on [the `Object3D` base class](#the-object3d-base-class) and all the other classes inherit [`Object3D.add`](https://threejs.org/docs/#api/en/core/Object3D.add).

When we add a child object to a parent object that is not the scene, the child will become embedded in the parent's local space, and when we transform the child, the child will move relative to the parent object rather than relative to the scene.

If the parent object has _also_ been moved, then to calculate where the child object will be drawn on screen we need calculate the child's position in world space.

That's a lot to take in, so let's look at some examples. First, we'll create a scene and two meshes. Then we'll add mesh $A$ to the scene and we'll add mesh $B$ to mesh $A$:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="We can add objects to other objects" >}}
const scene = new Scene();

// meshA and meshB start out at (0,0,0)
const meshA = new Mesh(...);
const meshB = new Mesh(...);

// add meshA to the scene, as usual
scene.add(meshA);

// add meshB to meshA instead of the scene
meshA.add(meshB);
{{< /code >}}

Everything starts out at the point $(0,0,0)$ _within its parent's coordinate system_. So, mesh $A$ is at the center of the scene and mesh $B$ is at the center of mesh $A$.

We'll move these meshes and observe what happens. First, mesh $A$:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="meshA will move relative to the scene" >}}
meshA.position.x = 5;
{{< /code >}}

Mesh $A$ is a child of the scene, or in other words it's embedded in world space. When we move it, the transformation is relative to the scene's center (relative to world space).

Next, let's move mesh $B$:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="meshB will move relative to meshA" >}}
meshB.position.x = 5;
{{< /code >}}

Mesh $B$ is a child of mesh $A$, that is, it's embedded in the local space of mesh $A$. When we move it, it will move relative to mesh $A$. Since mesh $A$ has already moved, the final position will be $x=5+5 = 10$ units to the right.

### Taking Our Tiny Universe for a Spin

Let's look at a less abstract example.

Suppose we have a car model, composed of many separate parts - doors, windows, wheels, seats, steering wheel, and so on.

When we move the car around in the scene, we want all the other parts to move around too. When we open a door, we want the door to open relative to the car body. When we spin the wheels, we want them to spin around in place. If the car is moving forwards, we want the wheels to continue spinning even as they move along with the car.

{{< iframe src="https://threejs.org/examples/webgl_materials_car.html" height="500" >}}

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
const scene = new Scene();
const car = new Mesh(...);
const door = new Mesh(...);
const wheel = new Mesh(...);

// add the car as a child of the scene
scene.add(car);

// add the door as a child of the car
car.add(door);

// add the wheel as a child of the car
car.add(wheel);

// open the door
door.rotation.y = 2;

// rotate the wheel
door.rotation.x = 3;

// move the car (and door and wheel)
car.position.x = 5;
{{< /code >}}

### Illumination Demonstration

Here's another example. Suppose we have a cylinder shaped mesh representing a torch that a character in our game will carry. A torch needs to emit light, so we'll create a `SpotLight` to represent the bulb. When we add the light to the torch mesh, then move the torch around, the light will move too.

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
const torch = new Mesh(...);
const light = new SpotLight(...);

torch.add(light);

// when we move the torch, the light will also move
torch.position.set(5,0,0);
{{< /code >}}

However, there's a problem: the light is at the point $(0,0,0)$, that is, the center of the torch mesh, while, usually, a torch emits light from one end.

To fix this, we'll move the light within the torches local space, to the top of the cylinder. Assuming that the cylinder is $4$ units tall, we need to move the light up by half of the cylinders height:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
light.position.set(0,2,0);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagram of light and cylinder
{{% /note %}}
