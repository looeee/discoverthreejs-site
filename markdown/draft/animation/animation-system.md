---
title: "Unraveling  the Animation System"
description: "TODO"
date: 2018-04-02
weight: 1401
chapter: "14.1"
---

# Unraveling  the Animation System



# It Start with an AnimationTrack

Animation tracks link up properties of an object with times and values.

Here's the simplest kind, a `NumberKeyFrameTrack` that can control any property consisting of a single number - for example, `material.opacity` or `object.position.x`:

const opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity',
[0, 1],
[1, 0.5]
);

This will animate the opacity from 1 (full) to 0.5 (half) over one second.

`Keyframetracks` don't care _which_ object they are controlling. This `opacityKF` just say "once I am connected to an object, I will look for the `.material.opacity` property on that object and if I find it, then I will animate it".

An object can be animated by lots of `Keyframetracks` at the same time - for example, we might want to control the opacity, scale and rotation at the same time. To do that we can just create 3 keyframetracks.

# Grouping tracks with AnimationClips

The next step is to group those 3 tracks into an AnimationClip. The clip _still_ doesn't care which object it gets attached to.

# Enter the AnimationMixer

So, how do we connect this AnimationClip up to an object?

Enter the AnimationMixer, which you can create like this:

`const mixer = new THREE.AnimationMixer( object );`

Then each frame we must update the mixer by the time since the last frame:

`mixer.update( delta );`

The animation mixer has connected the object we want to animate up to the animation system. We will use one AnimationMixer for each object that we want to animate, or for each group of objects (using AnimationObjectGroup).

So, we now have a working animation system. The building blocks are the tracks, and the are combined into clips. And at the other end we have the mixer which connects the object up to the clips and which we tell how much time has passed.

However, if this was all there was to it, it would be a very simplistic animation system.

We can control the mixer.timeScale to speed up or slow down the speed of the animation, and we can use mixer.update( newTime ) to make the animation progress, but otherwise these three objects (keyframe tracks, Animation clips, and mixers) are very simple and don't give us any control over the animation.

# The final piece of the puzzle: The AnimationAction

That's where the AnimationAction comes in. This is basically a powerful animation mixing desk with controls for looping animation, blending them together and so on.


Once we understand this, suddenly the otherwise intractable animation system becomes a lt simpler.

KeyFrameTracks: times and values connected up to animatable properties

AnimationClips: Collections of Tracks

AnimationMixer: connects the object to the keyframe tracks and sets the time of the animation

AnimationAction: Where all the magic happens.