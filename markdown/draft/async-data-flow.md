o overcome this, we have two options:

1. **Send `parrotModel` into `World`**.
2. **Send the `scene` into `ModelLoader.onLoad`**.

The first option is the "correct" choice from a software design viewpoint. `World` is our main controlling class, so we would like data to flow from `ModelLoader` into Three`View`, but not the other way around. In fact, `ModelLoader` should know nothing about `World` at all.

In this scenario, our data flow would look like this:

$$\text{ModelLoader} \longrightarrow \text{World}$$

Here's how this would work:

{{< highlight js "linenos=table,linenostart=61" >}}
loadModels() {
  const modelLoader = new ModelLoader(this.scene);

  const parrotModel = modelLoader.load('/assets/models/Parrot.glb');

  this.scene.add(parrotModel);
}
{{< /highlight >}}

Unfortunately, due to the nature of async programming using callbacks, this is not possible. Later, we'll see that we can achieve this using `async/await` and `Promises`, but for now, we'll have to use option two.

Option two creates tight coupling between modules. Data is flowing in both directions:

$$\text{ModelLoader} \longleftrightarrow \text{World}$$

`World` knows about `ModelLoader`, and `ModelLoader` knows about `World`.