{{% aside success %}}

### The three.js Animation System: a Quick Recap

Let's go over all the components that make up the three.js animation system again, since it was a lot to take in all at once.

#### 1. The `model`

First, we need something to animate. In this example, our models were loaded from glTF files.

#### 2. The [Clock](https://threejs.org/docs/#api/en/core/Clock)

A vital part of any animation system is something that keeps accurate time. We used the three.js built-in `Clock` to do that here, which is a basic stopwatch.

#### 3. The [AnimationClip](https://threejs.org/docs/#api/en/animation/AnimationClip)

The `AnimationClip` contains the actual animation data. Like the `model`, our animation clips came from the glTF files we loaded.

#### 3. The [AnimationMixer](https://threejs.org/docs/#api/en/animation/AnimationMixer)

This connects the model up to the `AnimationClip`, and sets the position of the model as the animation progresses. It's the things that tells the birds wings to flap, here. We need to update this every frame with the amount of time that has passed since the previous frame.

#### 5. The [AnimationAction](https://threejs.org/docs/#api/en/animation/AnimationAction)

This controls the state of the `AnimationClip` - whether it is playing, whether it should loop or stop at the end, and so on. In this example, we used it to immediately set the state to `playing`.

#### 6. `AnimationMixer.update` and `clock.getDelta`

The final piece of the puzzle is to get the elapsed time since the previous frame( AKA `delta` ) and inform the `mixer` so that it can move the animation forward by the correct amount.

{{% /aside %}}