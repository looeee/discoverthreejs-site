
### Material Compilation and the `Material.needsUpdate` Flag


However, this comes with an important caveat. If the material has been compiled by the time you change the property, you need to force an update by setting the [`material.needsUpdate`](https://threejs.org/docs/#api/en/materials/Material.needsUpdate) flag to `true`.

Material compilation happens automatically the first time an object wearing the material is rendered. This leads to a potentially confusing situation. This will work:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Create a material and then immediately enable flat shading" >}}
const material = new MeshStandardMaterial({
  color: 'red',
});

// This works just fine
material.flatShading = true;
{{< /code >}}

However, more realistically you won't change the property until sometime later, after the scene has renderer. This won't work:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Changing the flat shading property after the material has compiled" >}}
const material = new MeshStandardMaterial({
  color: 'red',
});

const mesh = new Mesh(geometry, material);

scene.add(mesh);

renderer.render(scene, camera);

// now, the material has been compiled and this will not work!
material.flatShading = true;
{{< /code >}}

Instead, you must set the `.needsUpdate` flag:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Once the material has compiled, set the .needsUpdate flag when changing certain properties" >}}
material.flatShading = true;
material.needsUpdate = true;
{{< /code >}}

Now, you can change any material property at any time.

The problem is that updating a material can take a few milliseconds, and this can cause noticeable jank.

If possible, once you have created a material, you should avoid changing any property that requires an update. Instead, you could create two version of the material, one with flat shading and one without, then switch between them as required.

Fortunately, not all material properties require an update to take effect.