## Improving Our Animation Loop

> Our current animation loop function

{{< highlight js >}}
{{< codesnippet file="worlds/first-steps/lighting/src/app.js" from="62" to="77" >}}
{{< /highlight >}}

Take a look at the `animate()` function. Ignoring `requestAnimationFrame` for now, we can see that it's currently doing two things - first, it's updating the rotation of the mesh, and then it's rendering the scene.

### Introducing the Game Loop

Most game engines use the concept of a **game loop**, which is called once per frame and is used to update the game and then render the scene. A minimal game loop might look something like this:

1. Get user input
2. Update animations
3. Render the frame

Looks familiar? Even though three.js is not a game engine and we are calling our loop an **animation loop** rather than a game loop, most of the same logic applies here, so we'll take some ideas for this part of our app from game engine theory.

### Split the Animation Loop into `update()` and `render()`

We're not currently getting any user input so we'll ignore step 1 for now and come back to it in [Chapter 1.5: Camera Controls](/book/first-steps/camera-controls/). That leaves the last two steps, "Update animations", and "Render the frame". So let's split our app into two functions called `update()` and `render()`, adding these functions to the end of our _app.js_ file, just before the call to `init()`.

#### The `update()` Function

{{< highlight js "hl_lines=11-20" >}}
{{< codesnippet file="worlds/first-steps/resize/src/app.js" from="68" to="85" >}}
// call the init function to set everything up
init();
{{< /highlight >}}

Anything that involves updating the scene should go in here. The only thing that we're currently updating each frame is the rotation of the mesh, so move those three lines into this function.

In a more complex app, this function could be doing a lot more. For example, if we were creating a driving game it would be calculating the direction, position, and velocity of each car from frame to frame. Physics is usually calculated separately to this function though, often on a separate thread.

#### The `render()` Function

{{< highlight js "hl_lines=1-11 18-20" >}}
{{< codesnippet file="worlds/first-steps/resize/src/app.js" from="68" to="85" >}}
// call the init function to set everything up
init();
{{< /highlight >}}

We're currently rendering our frame using a single line, so it may seem like overkill to put it inside its own function and generally, this function won't get _that_ much more complicated.

However, you might want to do things like post-processing, or drawing to a separate frame buffer, or scissor tests or... OK, sorry, we won't introduce too much advanced terminology just yet. We'll explore these in much more detail in **Section 8: The WebGLRenderer**.

For now, we'll just keep the call to `renderer.render()` separate to make sure our app is fully future-proof.

### Introducing the `setAnimationLoop` Method

Virtual Reality devices handle `requestAnimationFrame()` differently than normal web pages. This means that our current `animate` function will not work as a WebVR app.

To make dealing with this easier, a new method called [`setAnimationLoop`](https://threejs.org/docs/#api/renderers/WebGLRenderer.setAnimationLoop) was recently added to the `WebGLRenderer`. This handles setting up of the animation loop for us and makes sure that it works no matter what kind of device we are viewing our app on.

As an added bonus using this method actually makes our code a little cleaner, since calling `requestAnimationFrame` is handled automatically for us.

{{% aside %}}

#### Virtual Reality on the Web

Web Virtual Reality - **WebVR** - and the related Web Augmented Reality or **WebAR** (which are combined into a unified API called **WebXR**) - are both new technologies and are likely to change considerably as they are developed.

Support for these APIs was added to three.js around the start of 2018, and if you're fortunate enough to own a virtual reality device you can view some [three.js based VR examples](https://threejs.org/examples/?q=webxr).

By abstracting our animation loop into `setAnimationLoop()`, we can guarantee that we don't need to worry about any changes to these APIs beyond keeping three.js up to date, and if we later want to update a standard scene to work in VR or AR, we'll just need to change one or two lines.

{{% /aside %}}

### Using `setAnimationLoop()`

> Setting up the animation loop using the setAnimationLoop method

{{< highlight js "hl_lines=1 11-99" >}}
{{< codesnippet file="worlds/first-steps/resize/src/app.js" from="57" to="68" >}}
{{< /highlight >}}

Switching to the `setAnimationLoop` method allows us to abstract away `requestAnimationFrame()` completely. Delete your current `animate()` function and replace with the `setAnimationLoop` code.

If we want to stop the animation loop at any time, we can pass in `null` to the method like this:

```js
renderer.setAnimationLoop(null);
```

For example, at a later date we might want to add `play` and `stop` functions like this:

```js
function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function stop() {
  renderer.setAnimationLoop(null);
}
```
