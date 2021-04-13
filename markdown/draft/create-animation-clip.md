### Step One: Create an Animation Clip

1. Create one or more `KeyframeTrack` objects, specifying a range of times and values for a single properties such as `.position`, `.rotation` OR `.scale`. These are not specific to a particular object. If we create a track with position values, we can use it with any object that has the `.position` property. We can even use the same track for lots of different objects!
2. Combine one or more tracks into an `AnimationClip` representing a complete animation, such as "bounce", "walk", or "fly"



Let's say our animation clip  is called `bounce`:

``` js
const mesh = new Mesh( ... );
const bounce = new AnimationClip( ... );
```

_In the case of our bird models, this step has already been completed and we have a ready to use `AnimationClip`. We will explain in detail how to author your own animation clips later in the book._