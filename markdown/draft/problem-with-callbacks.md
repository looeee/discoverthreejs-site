### The Problem with Callbacks

In a real-world, complex three.js app, once you have loaded a model you will probably need to do a lot more than just set the `.position`. For example, you might need to set up the materials, or shadows, or add and remove components of a model, or make changes to the geometry. _Everything_ has to be done in the `onLoad` callback.

Even worse, you might need to make models loaded from separate files interact with each other in some way.

Aside this, passing `scene` into `ModelLoader` like this makes our modules tightly coupled, and our code more complicated.

As we mentioned earlier, we want each module to do only one thing, and do that well. `ModelLoader` should load models **and nothing else**. Not add them to the scene, not position them, nothing else. The ideal `ModelLoader.load` implementation would load the models and pass them back to `World` for further processing, as we do with the `Texture` loaded using the `TextureLoader`:

``` js
// World module
loadModels() {
  const modelLoader = new ModelLoader(this.scene);

  const gltfData = modelLoader.load( '/assets/models/Parrot.glb' );

  this.scene.add(gltfData.scene.children[0]);
}
```

**This is not possible using callbacks.** We can do all sort of tricks with out code to make it manageable (indeed, we will be forced to), but we cannot avoid this problem.

### The Solution: Promises and `async`/`await`

There is a solution though, using modern JavaScript. We can wrap the `GLTFloader.load` method in a promise, and then we can use `async/await`. Once we do that, our final `loadModels` method will look like this:

``` js
// World module
async loadModels() {
  const modelLoader = new ModelLoader(this.scene);

  const gltfData = await modelLoader.load( '/assets/models/Parrot.glb' );

  this.scene.add(gltfData.scene.children[0]);
}
```

Unfortunately, three.js loaders are old-school and this won't work out of the box. It will take a bit of effort to set this up, so for now we will keep using the old-fashioned approach. Later in the book we'll show you how to switch to the improved style.
