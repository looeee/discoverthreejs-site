To do so, we'll use a method that is built into every modern browser, called `requestAnimationFrame()`, or [ `window.requestAnimationFrame`](/book/introduction/browser-api/#global-object) to give it it's full title:

{{% aside success %}}

### The `window.requestAnimationFrame()` Method

'_The_ [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) _method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the **next repaint**. The method takes a callback as an argument to be invoked before the repaint_.'

#### - MDN

{{% /aside %}}

### Recursively Calling `animate()` Using `requestAnimationFrame()`

> The updated, recursive animate function

{{< highlight js >}}
function animate() {

// call animate recursively
requestAnimationFrame( animate );

// render, or 'create a still image', of the scene
// this will create one still image / frame each time the animate
// function calls itself
renderer.render( scene, camera );

}
{{< /highlight >}}

Using `requestAnimationFrame` is pretty straightforward - the trick is to call it recursively. A recursive function is simply a function that calls itself repeatedly - refer back to our brief [JavaScript Tutorial](/book/introduction/javascript-tutorial-1/#recursion) in the intro if this concept is unfamiliar to you.

So, we'll call our `animate` function _within_ our `animate` function, using `requestAnimationFrame` to handle the timing. Once we've done so, our app should be updating at a smooth 60 frames per second.
