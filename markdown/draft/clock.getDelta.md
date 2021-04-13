{{% aside %}}

### Using `Clock.getDelta`

This method measures the amount of time that has passed since it was last called. That means that if we make sure to call it _once_ per frame, then we'll get an accurate measure of how long the last frame took to render.

On the other hand, if you call `getDelta` multiple times per frame then the subsequent calls after the first will return a tiny value since only a fraction of a millisecond will have passed since the previous call.

**GOOD**

```js
function update() {
  const delta = clock.getDelta();

  // both of these mixer will update by the same amount each frame
  mixerA.update(delta);
  mixerB.update(delta);
}
```

**BAD**

```js
function update() {
  // this animation will play correctly
  mixerA.update(clock.getDelta());

  // but this animation will play extremely slowly!
  mixerB.update(clock.getDelta());
}
```

{{% /aside %}}