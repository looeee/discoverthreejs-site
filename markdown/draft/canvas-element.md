The automatically created `<canvas>` has a default size, although this time it's set by the browser rather than three.js. Currently on Chrome that default size is 150 x 300 pixels, which is rather small, so let's tell the renderer the size that we _do_ want.

The approach we're taking to set up the canvas here is:

- create an HTML `<div class="container">` element to hold the `<canvas>`
- set the size of the container using CSS (in this case, we've set it to the full window)
- get a reference to this element in JavaScript as the variable `container`
- use the size of the `container` to set the size of the `<canvas>` element

The `renderer.setSize()` method takes care of the final step for us. We just need to pass in the correct width and height (in pixels). [`container.clientWidth`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth) and [`container.clientHeight`](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight) give us these values.

{{% aside %}}
Note that we don't _have_ to use the `<canvas>` element that the `renderer` created for us. We can create one manually and tell the renderer to use that instead if we need greater control. For now though, this default one will do fine.
{{% /aside %}}
