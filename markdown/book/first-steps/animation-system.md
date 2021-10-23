---
title: "The three.js Animation System"
description: "In this final chapter of the free section, we introduce the three.js animation system, and show you how to play the animations from the bird models we loaded in the previous chapter."
date: 2018-04-02
weight: 114
chapter: "1.14"
available: true
showIDE: true
IDEFiles: [
  "assets/models/Flamingo.glb",
  "assets/models/Parrot.glb",
  "assets/models/Stork.glb",
  "worlds/first-steps/animation-system/src/World/components/birds/birds.start.js",
  "worlds/first-steps/animation-system/src/World/components/birds/birds.final.js",
  "worlds/first-steps/animation-system/src/World/components/birds/setupModel.start.js",
  "worlds/first-steps/animation-system/src/World/components/birds/setupModel.final.js",
  "worlds/first-steps/animation-system/src/World/components/camera.js",
  "worlds/first-steps/animation-system/src/World/components/lights.js",
  "worlds/first-steps/animation-system/src/World/components/scene.js",
  "worlds/first-steps/animation-system/src/World/systems/controls.js",
  "worlds/first-steps/animation-system/src/World/systems/renderer.js",
  "worlds/first-steps/animation-system/src/World/systems/Resizer.js",
  "worlds/first-steps/animation-system/src/World/systems/Loop.js",
  "worlds/first-steps/animation-system/src/World/World.start.js",
  "worlds/first-steps/animation-system/src/World/World.final.js",
  "worlds/first-steps/animation-system/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "vendor/three/examples/jsm/controls/OrbitControls.js",
  "vendor/three/examples/jsm/loaders/GLTFLoader.js",
  "worlds/first-steps/animation-system/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['assets', 'systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/animation-system/'
IDEActiveDocument: 'src/World/components/birds/setupModel.js'
nextURL: "/book/appendix/"
nextTitle: "Production Ready three.js"
---



# The three.js Animation System

In the previous chapter, we introduced the glTF model format and showed you how to load three simple yet beautiful models of a parrot, a flamingo, and a stork.

{{< inlineScene entry="first-steps/birds-animated-small.js" id="scene-A" class="round right medium" >}}

These models were loaded from the {{< link path="/book/first-steps/load-models/#types-of-gltf-files" title="binary glTF files" >}} [**_parrot.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Parrot.glb), [**_flamingo.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Flamingo.glb), and [**_stork.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Stork.glb). Alongside the bird models, each of these files also contains an animation clip of the bird flying.

In this final chapter of the introductory section, we will introduce the three.js animation system and show you how to attach these animation clips to the bird models so that they can take flight.

{{% note %}}
TODO-LINK: link to skinned mesh and morph targets sections
{{% /note %}}

**The three.js animation system is a complete animation mixing desk.** Using this system you can animate virtually any aspect of an object, such as position, scale, rotation, a material's color or opacity, the bones of a [skinned mesh](https://threejs.org/examples/#webgl_animation_skinning_blending), [morph targets](https://threejs.org/examples/#webgl_buffergeometry_morphtargets), and many other things besides. You can also blend and mix animations, so, for example, if you have a "walk" animation and a "run" animation attached to a human character you can make the character speed up from a walk to a run by blending these animations.

**The animation system uses keyframes to define animations**. To create an animation, we set keyframes at particular points in time, and then the animation system fills in the gaps for us using a process known as **tweening**. To animate a bouncing ball, for example, you can specify the points at the top and bottom of the bounce, and the ball will smoothly animate across all the points in between. The amount of keyframes you need depends on the complexity of the animation. A very simple animation may only need one keyframe per second, or less, while a complex animation will need more, up to a maximum of sixty keyframes per second (any more than this will be ignored on a standard 60Hz display).

{{% note %}}
TODO-DIAGRAM: add diagram of keyframe animations and possibly explain about curved vs linear interpolation
{{% /note %}}

The animation system is built from a number of components that work together to create animations, attach them to objects in the scene, and control them. We'll split these into two categories, **animation creation**, and **animation playback and control**. We'll briefly introduce both categories here, and then we'll use our new knowledge to set up the flying animations that we have loaded from the three glTF files.

## The Animation System: Creating Animations

{{% note %}}
TODO-DIAGRAM: add diagram of animation system
{{% /note %}}

We'll start by examining how to create some simple animations that change the visibility, scale, or position of an object. However, it should be noted that most people don't use the three.js animation system to create animations by hand. It's best suited for use with animations that were created in external software like Blender. Instead, to create animations in code, most people prefer to use [Tween.js](https://threejs.org/examples/#webgl_loader_collada_kinematics) for simple animations and [GSAP](https://greensock.com/gsap/) for more complex animations (although any JavaScript animation library will work with three.js). Even [official examples](https://threejs.org/examples/#webgl_loader_collada_kinematics) on the three.js website use Tween.js! Nonetheless, it's important for us to understand how animation clips are created and structured, so let's get started, and soon we'll have those lazy birds up in the sky!

There are three elements involved in creating animations: keyframes, `KeyframeTrack`, and `AnimationClip`.

### 1. Keyframes {#keyframes}

The lowest conceptual level in the animation system is a [keyframe](https://en.wikipedia.org/wiki/Key_frame). Each keyframe consists of three pieces of information: a **_time_**, a _**property**_, and a **_value_**, for example:

* **At 0 seconds `.position` is $(0,0,0)$.**
* **At 3 seconds `.scale` is $(1,1,1)$.**
* **At 12 seconds `.material.color` is red.**

These three keyframes each describe the value of some property at a specific time. **Keyframes don't specify any particular object**, though. A position keyframe can be used to animate any object with a `.position` property, a scale keyframe can animate any object with a `.scale` property, and so on. However, keyframes _do_ specify a data type. The `.position` and `.scale` keyframes above specify vector data, while `.material.color` keyframe specifies color data. Currently, the animation system supports five data types.

Data type | Description | Examples
---------|----------|---------
 **Number** | Animate any property that is a single number | [MeshStandardMaterial.opacity](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.opacity)<br> [PerspectiveCamera.zoom](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.zoom)
 **Vector** | Animate any property that is a {{< link path="/book/first-steps/transformations/#positions-are-stored-in-the-vector3-class" title="vector" >}} | {{< link path="/book/first-steps/transformations/#our-first-transformation-translation" title="Object3D.position" >}}<br> {{< link path="/book/first-steps/transformations/#our-second-transformation-scaling" title="Object3D.scale" >}}<br> {{< link path="/book/first-steps/camera-controls/#manually-set-the-target" title="OrbitControls.target" >}}
 **Quaternion** | Animate rotations stored as {{< link path="/book/first-steps/transformations/#the-other-rotation-class-quaternions" title="quaternions" >}} | [Object3D.quaternion](https://threejs.org/docs/#api/en/core/Object3D.quaternion)
 **Boolean** | Animate any Boolean property. This is less commonly used because there are no values between true and false so the animation will jump | [MeshStandardMaterial.wireframe](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.wireframe)<br> [DirectionalLight.castShadow](https://threejs.org/docs/#api/en/lights/DirectionalLight.castShadow)
 **String** | Animate any property that is a string | Not commonly used

Notably missing from this list are {{< link path="/book/first-steps/transformations/#representing-rotations-the-euler-class" title="Euler angles" >}}, which, if you recall from our chapter on transformations, are similar to vectors and are used to store rotations in [`Object3D.rotation`](https://threejs.org/docs/#api/en/core/Object3D.rotation). To animate rotations, you must use [`Object3D.quaternion`](https://threejs.org/docs/#api/en/core/Object3D.quaternion). As we mentioned back in the chapter on transformations, quaternions are a bit harder to work with than Euler angles, so, to avoid becoming bamboozled, we'll ignore rotations and focus on position and scale for now.

To create an animation, we need at least two keyframes. The simplest possible example is two number keyframes, say, animating a material's opacity (how transparent/see-through it is):

1. **At 0 seconds `.material.opacity` is 0.**
2. **At 3 seconds `.material.opacity` is 1.**

An opacity of zero means fully invisible, and opacity of one means fully visible. When we animate an object using these two keyframes, it will fade into view over three seconds. It doesn't matter what the actual opacity of the object is, the keyframes will override that. In other words, if we manually set:

{{< code lang="js" linenos="false" hl_lines="" caption="Values set on an object are overridden by the animation system" >}}
``` js
mesh.material.opacity = 0.5;
```
{{< /code >}}

... and then animate the object's opacity, this value of 0.5 will be ignored, and the value in the keyframes will be used. Let's take another example. Here are three vector keyframes representing positions:

1. **At 0 seconds `.position` is $(0,0,0)$.**
2. **At 3 seconds `.position` is $(5,5,0)$.**
3. **At 6 seconds `.position` is $(0,0,0)$.**

When we animate a mesh with these keyframes, it will start at the center of the scene, then it will {{< link path="/book/first-steps/transformations/#directions-in-world-space" title="move to the top right" >}} over three seconds before reversing direction and moving back to the center, again taking three seconds to do so. The total animation will take six seconds (and you can choose whether to loop it or end there).

### 2. `KeyframeTrack` {#keyframetrack}

There's no class representing a single keyframe. Rather, keyframes are raw data stored in two arrays, _times_ and _values_, within a [`KeyframeTrack`](https://threejs.org/docs/#api/en/animation/KeyframeTrack). From here on, we'll refer to a `KeyframeTrack` as simply a _track_. A track also stores the property being animated, such as `.position`, or `.scale`.

As with keyframes, keyframe tracks do not specify any particular object. A `.material.opacity` track can animate any object with a material that supports opacity, a `.quaternion` track can animate any object with a quaternion property, and so on.

`KeyframeTrack` is the base class, and there's one sub-class for each data type:

* [`NumberKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/NumberKeyframeTrack)
* [`VectorKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/VectorKeyframeTrack)
* [`QuaternionKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/QuaternionKeyframeTrack)
* [`BooleanKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/BooleanKeyframeTrack)
* [`StringKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/StringKeyframeTrack)

We never use `KeyframeTrack` directly, instead, we will choose whichever subclass matches the data type being animated. Let's look at a couple of examples. First, we'll use a `NumberKeyframeTrack` to store these five `.opacity` keyframes:

1. **At 0 seconds `.material.opacity` is 0.**
2. **At 1 second `.material.opacity` is 1.**
3. **At 2 seconds `.material.opacity` is 0.**
4. **At 3 seconds `.material.opacity` is 1.**
5. **At 4 seconds `.material.opacity` is 0.**

These keyframes will make an object blink in and out for four seconds. To create a keyframe track, we will create one array containing the times, and one array containing the values, and then pass those into the `NumberKeyframeTrack` constructor along with the property we want to animate.

{{< code lang="js" linenos="false" hl_lines="" caption="Creating a number keyframe track representing opacity, with five keyframes" >}}
``` js
import { NumberKeyframeTrack } from 'three';

const times = [0, 1, 2, 3, 4];
const values = [0, 1, 0, 1, 0];

const opacityKF = new NumberKeyframeTrack('.material.opacity', times, values);
```
{{< /code >}}

Note how each entry in the `times` array maps to one entry in the `values` array. Next, let's try some position keyframes and a `VectorKeyframeTrack`:

1. **At 0 seconds `.position` is $(0,0,0)$.**
2. **At 3 seconds `.position` is $(2,2,2)$.**
3. **At 6 seconds `.position` is $(0,0,0)$.**

These three keyframes will make an object start at the center of the scene, move right, up, and forwards over three seconds, then reverse direction and move back to the center. Next, we'll create a vector track with these keyframes.

{{< code lang="js" linenos="false" hl_lines="" caption="Creating a vector keyframe track representing positions, with three keyframes" >}}
``` js
import { VectorKeyframeTrack } from 'three';

const times = [0, 3, 6];
const values = [0, 0, 0, 2, 2, 2, 0, 0, 0 ];

const positionKF = new VectorKeyframeTrack('.material.opacity', times, values);
```
{{< /code >}}

This time, note how each entry in the times array matches with _three_ entries from the values array, representing a position in 3D space. This means the `values` array is three times larger than the `times` array.

{{< code lang="js" linenos="false" hl_lines="" caption="Each time maps to an $(x, y, z)$ position" >}}
``` js
const times = [0, 3, 6];
const values = [
  0, 0, 0, // (x, y, z) at t = 0
  2, 2, 2, // (x, y, z) at t = 3
  0, 0, 0  // (x, y, z) at t = 6
];
```
{{< /code >}}

### 3. `AnimationClip` {#animationclip}

{{< iframe src="https://threejs.org/examples/webgl_loader_fbx.html" height="500" caption="A dancing character from Mixamo.com" title="A dancing character from Mixamo.com" class="medium right" >}}

An animation of a character dancing like the one in this scene consists of many separate movements: feet pivot, knees bend, arms swing wildly, the head nods to the beat (soundtrack not provided). Each individual movement is stored in a separate keyframe track, so for, example, there is one track controlling the rotation of the dancer's left foot, another controlling the rotation of his right foot, a third control the rotation of his neck, and so on. In fact, this dancing animation is made from fifty-three keyframe tracks, of which fifty-two are `.quaternion` tracks controlling individual joints like the dancer's knees, elbow, and ankles. Then there is a single `.position` track that moves the figure back and forth across the floor.

These fifty-three tracks come together to create the animation, which we call an **animation clip**. An animation clip, then, is a collection of any number of keyframes attached to a single object, and the class representing clips is [`AnimationClip`](https://threejs.org/docs/#api/en/animation/AnimationClip). From here on, we'll refer to an animation clip as simply a _clip_. Animation clips can be looped, so, while this dancer's animation is eighteen seconds long, when it reaches the end it loops and the dancer appears to dancer forever.

Animation clips store three pieces of information: the name of the clip, the length of the clip, and finally, an array of tracks that make up the clip. If we set the length to -1, the array of tracks will be used to calculate the length (which is what you want in most cases). Let's create a clip containing the single position track from earlier:

{{< code lang="js" linenos="false" hl_lines="" caption="Create an `AnimationClip` using a single track of position keyframes" >}}
``` js
import { AnimationClip, VectorKeyframeTrack } from 'three';

const times = [0, 3, 6];
const values = [0, 0, 0, 2, 2, 2, 0, 0, 0];

const positionKF = new VectorKeyframeTrack('.position', times, values);

// just one track for now
const tracks = [positionKF];

// use -1 to automatically calculate
// the length from the array of tracks
const length = -1;

const clip = new AnimationClip('slowmove', length, tracks);
```
{{< /code >}}

Since we've set the length to -1, the tracks will be used to calculate the length, in this case, six seconds. We've given the clip a descriptive name, to make using it later easier.

The `AnimationClip` is _still_ not attached to any particular object. We'll have to wait for the `AnimationAction` below for that. We can use this simple clip we have created with any object that has a `.position` property. However, as clips become more complex and contain more tracks, they start to become more deeply tied to a particular object. For example, you can't use the dancing clip with one of the birds we loaded, since those don't have the same internal structure as the human figure. However, you can use the clip with any other humanoid figure that has **the same internal structure**. Since this model was downloaded from mixamo.com, the dancing clip should work with other characters from mixamo.com, but it's unlikely to work with just any humanoid model you download.

Now, let's try making a clip that contains the opacity keyframes from earlier, as well as the position keyframes. This time, to save some space, we'll write the times and values arrays inline rather than saving them to variables first, and we have also added a couple of extra opacity keyframes to make both tracks six seconds long.

{{< code lang="js" linenos="false" hl_lines="" caption="A clip that animates both position and opacity" >}}
``` js
import {
  AnimationClip,
  NumberKeyframeTrack,
  VectorKeyframeTrack,
} from 'three';

const positionKF = new VectorKeyframeTrack(
  '.position',
  [0, 3, 6],
  [0, 0, 0, 2, 2, 2, 0, 0, 0],
);

const opacityKF = new NumberKeyframeTrack(
  '.material.opacity',
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 0, 1, 0, 1, 0],
);

const moveBlinkClip = new AnimationClip('move-n-blink', -1, [
  positionKF,
  opacityKF,
]);
```
{{< /code >}}

This animation clip will work with any object that has a `.position` property and also a material with an `.opacity` property. In other words, it should work with a mesh. It will make a mesh move while blinking in an out. Once again, we have given the clip a memorable name. Later, we might have lots of separate clips, and we can blend and mix them together. Giving each a unique name will make this easier for us. This time, note that the position track has three keyframes, while the opacity track has seven keyframes. Also, the length of each track is the same. This is not required, but the animation will look better if the lengths of the tracks match.

## The Animation System: Playback and Control

Now, we have a simple animation clip that makes an object move while fading in and out. The next step is to attach this clip to an object and then play it. This brings us to the final two components of the animation system. First, the `AnimationMixer` allows us to turn a static object into an animated object, and finally, the `AnimationAction` connects a clip to the object and allows us to control it using actions such as play, pause, loop, reset, and so on.

### 4. `AnimationMixer` {#animationmixer}

To animate an object such as a mesh using the animation system, we must connect it to an [**`AnimationMixer`**](https://threejs.org/docs/#api/en/animation/AnimationMixer). From here on, we'll refer to an `AnimationMixer` as simply a _mixer_. **We need one mixer for each animated object in the scene.** The mixer does the technical work of making the model move in time to the animation clip, whether that means moving the feet, arms, and hips of a dancer, or the wings of a flying bird.

{{< code lang="js" linenos="false" caption="Each `AnimationMixer` controls the animation of one object" >}}
import { Mesh, AnimationMixer } from 'three';

// create a normal, static mesh
const mesh = new Mesh();

// turn it into an animated mesh by connecting it to a mixer
const mixer = new AnimationMixer(mesh);
{{< /code >}}

We also need to update the mixer each frame, but we'll come back to that in a moment.

### 5. `AnimationAction` {#animationaction}

The final piece of the puzzle, the [`AnimationAction`](https://threejs.org/docs/#api/en/animation/AnimationAction) connects an animated object to an animation clip. The `AnimationAction` class is also where the controls such as pause, play, loop, and reset are located. We'll shorten `AnimationAction` to _action_ from here on (it helps if you shout out "action" like a director whenever you create one). Unlike the other animation system classes, we never create an action directly. Instead, we'll use [`AnimationMixer.clipAction`](https://threejs.org/docs/#api/en/animation/AnimationMixer.clipAction), which ensures the action is cached by the mixer.

Let's see this in action. Here, we take the `moveBlinkClip` we created a few moments ago, then connect a mesh to a mixer, and finally. we use `.clipAction` along with the clip to create an action.

{{< code lang="js" linenos="false" hl_lines="" caption="Create an `AnimationAction` using `.clipAction`" >}}
``` js
import {
  AnimationClip,
  AnimationMixer,
} from 'three';

const moveBlinkClip = new AnimationClip('move-n-blink', -1, [
  positionKF,
  opacityKF,
]);

const mixer = new AnimationMixer(mesh);
const action = mixer.clipAction(moveBlinkClip);
```
{{< /code >}}

Let's look at another example. Suppose we have a model of a human and a clip of the character walking. Once again, we connect the model to a mixer and then create an action using `.clipAction`. We then immediately set the action's state to playing:

{{< code lang="js" linenos="false" caption="Create an and then set its state to playing" >}}
const mixer = new AnimationMixer(humanModel);

const action = mixer.clipAction(walkClip);

// immediately set the animation to play
action.play();

// later, you can stop the action
action.stop();
{{< /code >}}

Note that, although we called `.play`, the animation will not start yet. We still need to update the mixer in the animation loop, which we'll do in a moment.

Suppose this character can run and jump as well. Each animation will come in a separate clip, and each clip must be connected to one action. So, just as there is a **one to one relationship between a mixer and a model**, there is a **one to one relationship between an action and an animation clip**.

{{< code lang="js" linenos="false" caption="Each animation clip needs a separate animation action" >}}
const mixer = new AnimationMixer(humanModel);

const walkAction = mixer.clipAction(walkClip);
const runnAction = mixer.clipAction(runClip);
const jumpAction = mixer.clipAction(jumpClip);
{{< /code >}}

The next step is to choose which one of these actions to play. How you go about this will depend on what kind of scene you're building. For example, if it's a game, you'll connect these actions up to the user controls, so the character will walk, run, or jump when the appropriate button is pressed. On the other hand, if it's a non-playable character, you might connect these up to an AI system and let that control the character's movements.

Another thing you need to consider is what happens when the character stops walking and starts running. If you move instantly from one animation to another, it won't look very good. Fortunately, the `AnimationAction` contains controls that allow you to blend two clips, gradually slow a clip to a stop, loop a clip, play in reverse, or at a different speed, and lots more. At the start of the chapter, we claimed that the three.js animation system is a complete animation mixing desk. More accurately, we should have said that `AnimationAction` is a complete animation mixing desk since this is where most of the controls are.

{{< iframe src="https://threejs.org/examples/webgl_animation_skinning_blending.html" height="500" title="Animation blending example" >}}

### Update the Animation in the Loop

There is just one thing left to do before any animations can play. We need to update the animated object in the animation loop. The mixer has an update method, which takes a time `delta` parameter. Whatever amount of time we pass in to `mixer.update`, all actions connected to the mixer will move forward by that amount.

{{< code lang="js" linenos="false" hl_lines="" caption="Move all animations connected to the mesh forward by one second" >}}
``` js
const mixer = new AnimationMixer(mesh);

const updateAmount = 1; // in seconds

mixer.update(updateAmount)
```
{{< /code >}}

However, normally we don't want to jump forward an entire second. Each frame, we want to move the animation forward by a tiny amount, so that when we render sixty frames a second, we see a smooth animation. We'll use the technique that we derived a few chapters ago, when we first created the animation loop and used it to drive a simple rotating cube, so refer back to {{< link path="/book/first-steps/animation-loop/#timing-in-the-animation-system" title="" >}} for a refresher. In short, we measure how long each frame takes to render, store that in a variable called `delta`, and then pass that into the mixer's update method.

{{< code lang="js" linenos="false" hl_lines="" caption="We need to update the mixer by `delta` every frame" >}}
``` js
const mixer = new AnimationMixer(mesh);
const clock = new Clock();

// you must do this every frame
const delta = clock.getDelta();
mixer.update(delta);
```
{{< /code >}}

As usual, we'll do this by giving each animated object a {{< link path="/book/first-steps/animation-loop/#the-tick-method" title="`.tick` method" >}}. Here, `.tick` will call the mixer's update method.

{{< code lang="js" linenos="false" caption="Use the animated object's `.tick` method to update the mixer" >}}
const mixer = new AnimationMixer(mesh);

mesh.tick = (delta) => mixer.update(delta);

updatables.push(mesh);
{{< /code >}}

This is similar to {{< link path="/book/first-steps/camera-controls/#update-the-controls-in-the-animation-loop" title="the orbit control's `.tick` method" >}} from a few chapters ago.

## Play the Animation Clips from _**Parrot.glb**_, _**Flamingo.glb**_, and _**Stork.glb**_

Now that we have seen how to create a very simple if somewhat boring animation clip that moves an object across the scene while fading it in and out, let's turn our attention to the more interesting clips that we have loaded alongside our three bird models. Each of the three files, _**Parrot.glb**_, _**Flamingo.glb**_, and _**Stork.glb**_, contain both a model and an animation clip of that model flying. These models are not that different from the {{< link path="/book/first-steps/first-scene/#our-first-visible-object-mesh" title="simple cube mesh" >}} we've used in several previous chapters. Each bird is a single `Mesh`, with a `geometry` and a `material`, although the geometry has a feature called [**morph targets**](https://en.wikipedia.org/wiki/Morph_target_animation) (AKA **blend shapes**). Morph targets allow us to define two (or more) different shapes for a single geometry. Here, there is one shape with the wings up and one with the wings down. The flying clip animates between these two shapes to make it look like the bird's wings are flapping.

{{% note %}}
TODO-LINK: link to morph targets
{{% /note %}}

Let's put everything we have learned so far into action. Here's what we need to do to play the animation clips that come with each bird:

1. Locate the flying clip from the {{< link path="/book/first-steps/load-models/#returned-gltf-data" title="data loaded from each glTF file" >}}.
2. Create an `AnimationMixer` to control each bird model.
3. Create an `AnimationAction` to connect the clip to the mixer.
4. Add a {{< link path="/book/first-steps/animation-loop/#the-tick-method" title="`.tick` method to each bird" >}} and update the bird's mixer every frame.

Nearly everything can be done in a couple of lines within _**birds/setupModel.js**_. Over in World, we need to add the birds to {{< link path="/book/first-steps/animation-loop/#the-updatables-array" title="the `updatables` array" >}} so that the animations will be updated in the loop.

### Where to Find the Loaded Animation Clips

Inside the _**components/birds/birds.js**_ module, we currently log the raw data loaded from _**Parrot.glb**_ to the console:

{{< code lang="js" linenos="" linenostart="14" caption="_**birds.js**_: log loaded data" >}}
console.log('Squaaawk!', parrotData);
{{< /code >}}

Open the browser console and take a look now. {{< link path="/book/first-steps/load-models/#returned-gltf-data" title="We described this data in detail" >}} in the previous chapter, so check back there if you need a refresher. The data contains two elements of interest: a bird-shaped mesh that we extracted in the last chapter, and an animation clip of the bird flying. In the last chapter, {{< link path="/book/first-steps/load-models/#extract-the-mesh-from-the-loaded-data" title="we located the mesh in `gltf.scene`" >}}. Here, we'll extract the animation clip and attach it to the mesh to make the bird take flight. You'll find the animation clip in the `gltfData.animations` array:

{{< code lang="js" hl_lines="2" linenos="false" caption="Locate the animation clip in the loaded data" >}}
{
  animations: [AnimationClip]
  asset: {…}
  cameras: []
  parser: GLTFParser {…}
  scene: Scene {…}
  scenes: […]
  userData: {}
  __proto__: Object
}
{{< /code >}}

Here, each file contains just a single clip, but a glTF file can contain any number of animation clips. For example, a file containing a model of a human might also have clips of the character walking, running, jumping, sitting down, and so on.

Next, update `setupModels` to extract the clip:

{{< code lang="js" linenos="" hl_lines="3" caption="_**setupModel.js**_: extract the clip from the loaded data" >}}
``` js
function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  return model;
}
```
{{< /code >}}

### Create the Mixer and Action

Now, we'll create the mixer and the action. First, import the `AnimationMixer`. We'll use [`AnimationMixer.clipAction` to create the action](#animationaction), so there's no need to import `AnimationAction`. Then, create the mixer, passing the bird model into the constructor.

{{< code lang="js" linenos="" hl_lines="1,7" caption="_**setupModel.js**_: import and create the mixer" >}}
``` js
import { AnimationMixer } from 'three';

function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  const mixer = new AnimationMixer(model);

  return model;
}
```
{{< /code >}}

Next, use `.clipAction` to create the action, passing in the clip, then immediately set the action to playing:

{{< code lang="js" linenos="" linenostart="3" hl_lines="8,9" caption="_**setupModel.js**_: create the AnimationAction using `.clipAction`" >}}
function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  const mixer = new AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();

  return model;
}
{{< /code >}}

That's all there is to it. All that remains is to update the now animated bird in the loop.

### Create the `.tick` Method

Still in `setupModel`, add a `.tick` method to the model:

{{< code file="worlds/first-steps/animation-system/src/World/components/birds/setupModel.final.js" from="3" to="14" lang="js" linenos="true" hl_lines="11" caption="_**setupModel.js**_: create the .tick method">}}{{< /code >}}

Inside this method, we're calling [`mixer.update`](https://threejs.org/docs/#api/en/animation/AnimationMixer.update) each frame, passing in `delta`, which is {{< link path="/book/first-steps/animation-loop/#timing-in-the-update-loop" title="the amount of time the previous frame took to render" >}}. The mixer uses `delta` to keep the animation in sync even when the frame rate fluctuates. Again, refer back to {{< link path="/book/first-steps/animation-loop/" title="Ch 1.7" >}} for a more detailed discussion.

### Add the Birds to `updatables`

Finally, over in World, add all three birds to the `updatables` array:

{{< code file="worlds/first-steps/animation-system/src/World/World.final.js" from="34" to="42" lang="js" linenos="true" hl_lines="40" caption="_**World.js**_: add the birds to the updatables array">}}{{< /code >}}

At this point, if everything has been set up correctly, your birds will take flight!

{{< inlineScene entry="first-steps/birds-animated.js" class="round" >}}

## You've Reached the End of the Book - for now :)

With our birds on the wing, you have reached the end of the book. Congratulations!

We've covered a lot here in a short time, including cameras, geometry, meshes, textures, physically based materials, direct and ambient lighting, rendering our scenes with WebGL, transformations, coordinate systems, and the scene graph, vectors, loading external models, the glTF asset format, and even the three.js animation system, which is a complex beast. While learning about all that, we also found the time to create a simple but well-structured application that you can build on for three.js applications of any size.

But, don't stop now! We've laid the groundwork, but we still have a long way to go on our journey to becoming three.js experts. It's time for you to take things to the next level on your own. Good luck!

P.S. we're not quite done yet, you still have to complete all the challenges!

## Challenges

{{% aside success %}}
### Easy

The `AnimationAction` has lots more animation controls `.play` and `.stop`. Try out some of these now.

1. You can delay the start of the animation using [`.startAt`](https://threejs.org/docs/#api/en/animation/AnimationAction.startAt). Test this out.

2. You can control the speed of the animation using [the `.timeScale` property](https://threejs.org/docs/#api/en/animation/AnimationAction.timeScale). You can either set the value directly, or using the [`.setEffectiveTimeScale`](https://threejs.org/docs/#api/en/animation/AnimationAction.setEffectiveTimeScale) method.

3. Use [`.halt`](https://threejs.org/docs/#api/en/animation/AnimationAction.halt) to gradually slow the animation to a stop.

_Note: all the methods listed here can be chained, so you can write them like this:_

{{< code lang="js" linenos="false" caption="`AnimationAction` methods can be chained" >}}
action
  .startAt(2)
  .setEffectiveTimeScale(0.5)
  .play();
{{< /code >}}

_There are many other controls besides the one we listed here. Experiment!_

{{% /aside %}}

{{% aside %}}
### Medium

1. Add a [range slider input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) to the page. Use the value of the slider to set [`.setEffectiveWeight`](https://threejs.org/docs/#api/en/animation/AnimationAction.setEffectiveWeight) and control how strongly the flying animation affects the birds. Zero is no effect and one is full effect.

2. Create a simple animation clip of your own using [the position track](#keyframetrack) and [clip](#animationclip) we described earlier. Attach the clip to the bird instead of the flying animation.

3. Create a new track of your own. This time, animate the scale of the model. Create a single clip from both tracks so that the bird's position and scale are both animated. Make both tracks the same length. Now, make both tracks a different length.

4. Make the first and final keyframes of each track equal, so the animation can loop without jumping. Now try giving the first and last keyframes different values, and make each track a different length. Observe how the animation jumps between loops.

_Note: the position track will overwrite the `bird.position`, so the birds will be all jumbled on top of each other again. That's OK for this exercise. If you like, remove all but one bird from the scene._

{{% /aside %}}

{{% aside warning %}}
### Hard

1. Combine the position, scale, _and_ the loaded flying animation in a single clip. There are a couple of ways to do this. For example, you could look inside the loaded clip's `.tracks` array, and extract any tracks you find there to create a new clip. Or, you could try adding your tracks to the existing clip's `.tracks`. Note that if you use the latter method, you'll have to call [`clip.resetDuration`](https://threejs.org/docs/#api/en/animation/AnimationClip.resetDuration) after adding the new tracks.

2. The position and scale tracks you created are probably longer than the flying animation. When you combine the tracks, the bird's wings will flap once and then freeze until the other tracks have completed. Can you overcome this so that the wings flap continuously, no matter how long the other tracks are? No tips for this one!

{{% /aside %}}

{{% aside %}}
### Bonus

1. If you have been following along so far using the inline code editor, take the code from this chapter and make it run on locally on your computer. You'll need to set up {{< link path="/book/introduction/prerequisites/#a-web-server" title="a development server" >}}.
{{% /aside %}}
