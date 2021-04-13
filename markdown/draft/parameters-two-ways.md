{{% aside %}}

## Two Ways of Passing in Parameters to a Constructor

When we passed in the color parameter to our material, we did it by name:

```js
new MeshBasicMaterial({ color: 'purple' });
```

These are referred to as **named parameters**.

However, for the `BoxBufferGeometry`, `PerspectiveCamera` and `Mesh` constructors we passed in parameters like `length`, `width` and `height` directly, making sure that we put the parameters in the right order. These are referred to as **positional parameters**.

### Positional Parameters

Positional parameters are so called because the position matters - we have to remember to always put them in the right order:

```js
// the parameters are
// 1. length
// 2. width
// 3. height
const geometry = new BoxBufferGeometry(2, 2, 2);
```

```js
// the parameters are
// 1. field of view
// 2. aspect ratio
// 3. near clipping plane
// 4. far clipping plane
const camera = new PerspectiveCamera(35, 1, 1, 100);
```

### Named Parameters

Positional parameters are quick to write, but it can be hard to remember the order. You'll rarely see a function that takes more than six or seven positional parameters.

However, the `MeshBasicMaterial` constructor takes somewhere around $40$ parameters! Imagine trying to remember the order of these. Hmm, does color go in position $23$, or $27$? That's not going to work. Instead, we'll use a **specification object** containing named parameters, which we can put in any order and leave out or include as we need.

```js
const spec = {
  color: 'white',
  transparent: false,
  opacity: 1,
  ...
  // and lots more
};

const material = new MeshBasicMaterial( spec );
```

Or, declaring the spec object inline, as we did above:

```js
const material = new MeshBasicMaterial({
  color: 'white',
  transparent: false,
  opacity: 1,
});
```

All of `MeshBasicMaterial` constructor's parameters are optional, and as with the color, three.js will set sensible default for anything we leave out. Most of the parameters are for advanced use cases and you may never find a use for them.

{{% /aside %}}