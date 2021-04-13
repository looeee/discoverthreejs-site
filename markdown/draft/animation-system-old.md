


And here's a `KeyframeTrack` with scale data:

1. **At $0$ seconds scale is $(1,1,1)$.**
2. **At $1$ seconds scale is $(2,2,2)$.**
3. **At $5$ seconds scale is $(4,4,4)$.**
4. **At $7$ seconds scale is $(1,1,1)$.**

We'll break down using the animation system down into two steps:

1. **Creating an animation clip.**
2. **Connecting the clip up to an object and playing it.**

Step one involves creating some keyframe tracks and then combining them into a single `AnimationClip`.

We will come back to this later in the book and show you how to create your own clips, but for now, we will concentrate on step two and show you how to play the animation clips that were loaded with the bird models.

{{% note %}}
TODO-LINK: add link to animation section
{{% /note %}}

### How to Play an Animation Clip

Here are the steps involved in playing an animation clip:

1. **Create an `AnimationMixer` and connect it to the object we wish to animate.**
2. **Create an `AnimationAction` to connect the clip to the mixer.**
3. **Set the action's state to "playing".**
4. **Each frame, tell the mixer how much time has passed so it can update the animation.**


Let's imagine we are animating a `ballMesh` with a `bounceClip`. Here's the code we need to set that up:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Animation System basic setup" >}}
import  { AnimationMixer } from 'three';

// step 1. create the mixer connected to the model
const mixer = new AnimationMixer(ballMesh);

// step 2. create an action to connect the clip to the mixer
const action = mixer.clipAction(bounceClip);

// step 3. start the animation
action.play();
{{< /code >}}

Look at what we did for step two. We didn't create the `AnimationAction` directly, but instead we used [`mixer.clipAction`](https://threejs.org/docs/#api/en/animation/AnimationMixer.clipAction):

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Creating an AnimationAction instance using mixer.clipAction (good)" >}}
const action = mixer.clipAction(bounceClip);
{{< /code >}}

This allows three.js to set up caching of the animated objects, so it's important to always do it this way instead of
creating the `AnimationAction` directly:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Creating an AnimationAction instance using the constructor (bad)" >}}
// never do this!
const action = new AnimationAction(mixer, bounceClip);
{{< /code >}}




#### Update the Mixer in the Animation Loop

Finally, in our animation loop, we need to {{< link path="/book/first-steps/animation-loop/#timing-inside-the-animation-loop" title="tell the mixer how much time has passed since the previous frame" >}}.

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="World.update" >}}
update() {
  // delta === time passed since last frame
  const delta = this.clock.getDelta();

  // step 4. update the mixer with the elapsed time
  mixer.update(delta);
}
{{< /code >}}

The final call to `mixer.update(delta)` performs all the work of moving the object into the new position - bouncing the ball, lifting the knee, flapping the wings, or whatever the animation consists of.

## Play the Loaded `AnimationClips`

Now, we are ready to play the animation clips that came with our bird models.

Just like setting the position of the loaded models, we need to set up the animations after the model has loaded in the `onLoad` callback. This means that all the code related to setting up the animations needs to go inside the `ModelLoader` class.

All the bird models have the same format, so we just need to set up animations for one bird and the others will automatically work too.

### Import the `AnimationMixer`

Start by importing the `AnimationMixer` at the top of the `ModelLoader` module:

{{% note %}}
{{< code file="worlds/first-steps/animation-system/src/World/components/birds/birds.js" from="1" to="3" lang="js" linenos="true"
hl_lines="1" caption="ModelLoader" >}}{{< /code >}}
{{% /note %}}



We will always place imports from the three.js core first, before plugins or imports from our own files.

### Find the Animation Clip in `gltfData`

As we mentioned above, the animation clip is in `gltfData.animations[0]`. Save a reference to this in a new variable called `clip`:

{{< code lang="js" linenos="true" linenostart="18" hl_lines="5" caption="ModelLoader" >}}
  // Called when a glTF file has finished loading
  onLoad(gltf, position) {
    const model = gltf.scene.children[0];
    const clip = gltf.animations[0];

    model.position.copy(position);

    this.scene.add(model);
  }
{{< /code >}}

### The `setupAnimation` Method

We'll create a new method called `setupAnimation` to handle creation of the `AnimationMixer` and `AnimationAction`. This method will take two parameters: the `model` we want to animate, and the `clip` we will use to animate it.

Inside this new method, we will create the `AnimationMixer` and `AnimationAction` exactly [as described above](#how-to-play-an-animation-clip):

{{< code lang="js" linenos="true" linenostart="11" hl_lines="" caption="ModelLoader" >}}
setupAnimation(model, clip) {
  const mixer = new AnimationMixer(model);

  const action = mixer.clipAction(clip);
}
{{< /code >}}

### Call `setupAnimation` in `.onLoad`

Next, we'll call our new method in `.onLoad`, passing the `model` and `clip` as parameters:

{{< code file="worlds/first-steps/animation-system/src/World/components/birds/birds.js" from="19" to="29" lang="js" linenos="true" hl_lines="8" caption="ModelLoader" >}}{{< /code >}}

Note this animation is not affected by the position of the model. The wings will flap exactly the same way no matter where in the scene we place the bird, as the keyframes that make up this animation clip do not contain `.position` data.

### Set the Animation State to Playing

Finally, tell the `action` to `play` immediately:

{{< code lang="js" linenos="true" linenostart="10" hl_lines="5" caption="" caption="ModelLoader" >}}
setupAnimation(model, clip) {
  const mixer = new AnimationMixer(model);

  const action = mixer.clipAction(clip);
  action.play()
}
{{< /code >}}

However, the animation will not start yet. We are still missing a vital ingredient: **time!**

**We need to pass the elapsed time, or `delta`, to `mixer.update` each frame**, and we need to do that back in `World` once again.

We are already passing the `scene` and `position` from `World` into `ModelLoader`. Passing data back and forth between modules like this is called [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)), and it's something we want to reduce as much as possible. In other words, we want our modules to be [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling) rather than tightly coupled.

Let's think about how we can update the mixer in an elegant manner that avoids any additional coupling between these modules.

{{% note %}}
TODO-LINK: add link to async/await
{{% /note %}}



## Make the Animated Model Responsible for Updating Itself

We can't avoid passing the `scene` and `position` data into `ModelLoader` until we switch to `async/await` asynchronous model loading, which we'll do later in the book. But we can avoid passing the `mixer` back into `World`.

**Let's think of the animated model/mixer combo as a single entity. Then, what if we make this entity responsible for updating itself?**

To do that, we could add an update method to the model itself, and have that update the mixer:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="World.update" >}}
model.update = (delta) => mixer.update(delta);
{{< /code >}}

The model is stored in `scene.children`, which we already have access to in `World`. So will just need to loop over the `scene.children` every frame, check if each child has an `.update` method, and if so then update it:


{{< code lang="js" linenos="true" linenostart="116" hl_lines="5-7" caption="World.update" >}}
update() {
  const delta = this.clock.getDelta();

  for (const child of this.scene.children) {
    if (child.update) child.update(delta);
  }

  this.controls.update();
}
{{< /code >}}

While the models are loading, `scene.children` will be empty so this loop will run zero times. Then, once a model has been loaded and added to the scene, its animation will immediately start to be updated in this loop.

This seems like a simple and elegant solution, and we will no longer have to worry about passing the `mixer` into `World`. Even with a few thousand or tens of thousands of objects in our scenes, this should run quickly enough that it won't affect our frame rate, although for extremely complex scenes we'll probably have to look for another solution.

On the other hand, **it's bad practice to add custom properties to a class provided by a library**. We might run into nasty bugs later when we try to update to a new version of three.js. So, what should we do?

### The `.userData` Property

The normal approach when faced with this problem is to create a custom class that extends our model class. In this case, we would be creating a `CustomMesh` class that extends the three.js `Mesh` with an additional `.update` method.

That seems kind of overkill though, just to add a single extra method. Fortunately, three.js provides a simpler solution: **the `.userData` property**. This is an empty object and we can add any kind of data we like to it.

We will find the `.userData` property on most three.js classes, for example:

* **`BufferGeometry` and all derived classes such as `BoxBufferGeometry`, `CylinderBufferGeometry`, and `SphereBufferGeometry`.**
* **`Material` and all derived classes such as `MeshBasicMaterial` and `MeshStandardMaterial`.**
* **`Object3D` and all derived classes such as `Light`, `DirectionalLight`, `Mesh`, `Camera`, `PerspectiveCamera`, and so on.**

So, rather than `model.update`, we will add `model.userData.update`:

{{< code file="worlds/first-steps/animation-system/src/World/components/birds/birds.js" from="11" to="17" lang="js" linenos="true"
hl_lines="6" caption="ModelLoader" >}}{{< /code >}}

By doing this, we have ensured that our app is future proof and follows good software design practices.

{{% aside %}}

If you look at the [docs page for the `.userData` property](https://threejs.org/docs/#api/en/core/Object3D.userData), you'll see this:

_**Object3D.userData**: An object that can be used to store custom data about the Object3D. **It should not hold references to functions** as these will not be cloned._

Well, we're clearly ignoring that advice here. This is fine, as long as we remember that the custom  `.update` method we created here will be ignored by the `.clone` and `.copy` methods.

**If we clone or copy this model, we will need to take care of recreating the `userData.update` method ourselves.**

{{% /aside %}}

### Update the Models in the Animation Loop

Finally, we will add the code we described above to our animation loop, to loop over all the children in the scene, check if they have a `.userData.update` method, and if so then call that method:

{{< code file="worlds/first-steps/animation-system/src/World/World.js" from="121" to="129" lang="js" linenos="true" hl_lines="4-6" caption="World.update" >}}{{< /code >}}