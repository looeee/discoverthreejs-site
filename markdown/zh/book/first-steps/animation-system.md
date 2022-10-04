---
title: "three.js动画系统"
description: "在免费章程的最后一章中，我们将介绍three.js动画系统，并向您展示如何播放我们在上一章中加载的鸟类模型的动画。"
date: 2018-04-02
weight: 114
chapter: "1.14"
available: true
showIDE: true
IDEFiles:
  [
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
IDEClosedFolders: ["assets", "systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/animation-system/"
IDEActiveDocument: "src/World/components/birds/setupModel.js"
nextURL: "/book/appendix/"
nextTitle: "Production Ready three.js"
---

# three.js动画系统

在上一章中，我们介绍了glTF模型格式，并向您展示了如何加载鹦鹉、火烈鸟和鹳这三个简单而漂亮的模型。

{{< inlineScene entry="first-steps/birds-animated-small.js" id="scene-A" class="round right medium" >}}

这些模型是从[二进制glTF文件]({{< relref "/book/first-steps/load-models#types-of-gltf-files" >}} "二进制glTF文件") [**_parrot.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Parrot.glb), [**_flamingo.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Flamingo.glb), 和[**_stork.glb_**](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Stork.glb)加载的。除了鸟类模型，这些文件中的每一个还包含鸟类飞行的动画剪辑。

在介绍部分的最后一章中，我们将介绍three.js动画系统，并向您展示如何将这些动画剪辑附加到鸟类模型上，以便它们能够飞行。

{{% note %}}
TODO-LINK: link to skinned mesh and morph targets sections
{{% /note %}}

**three.js动画系统是一个完整的动画调音台。** 使用这个系统，您几乎可以为对象的任何方面设置动画，例如位置、缩放、旋转、材质的颜色或不透明度、[蒙皮网格](https://threejs.org/examples/#webgl_animation_skinning_blending)的骨骼、 [变形目标](https://threejs.org/examples/#webgl_buffergeometry_morphtargets)以及许多其他内容。您还可以合成和混合动画，例如，如果您将“行走”动画和“跑步”动画附加到人类角色上，您可以通过合成这些动画使角色从步行加速到奔跑。

**动画系统使用关键帧来定义动画**。为了创建动画，我们在特定时间点设置关键帧，然后动画系统使用称为**补间**的过程为我们填补空白。例如，要为弹跳的球设置动画，您可以指定弹跳的顶部和底部的点，球将在其间的所有点上平滑地设置动画。您需要的关键帧数量取决于动画的复杂性。一个非常简单的动画每秒可能只需要一个关键帧，或者更少，而复杂的动画则需要更多，每秒最多需要60个关键帧（在标准60Hz显示器上超过这个值将被忽略）。

{{% note %}}
TODO-DIAGRAM: add diagram of keyframe animations and possibly explain about curved vs linear interpolation
{{% /note %}}

动画系统由许多组件组成，这些组件协同工作以创建动画、将它们附加到场景中的对象并控制它们。我们将它们分为两类，**动画创建**和**动画播放和控制**。我们将在这里简要介绍这两个类别，然后我们将使用我们的新知识来设置我们从三个glTF文件中加载的飞行动画。

## 动画系统：创建动画

{{% note %}}
TODO-DIAGRAM: add diagram of animation system
{{% /note %}}

我们将首先研究如何创建一些简单的动画来改变对象的可见性、比例或位置。不过需要注意的是，大部分人不会使用three.js动画系统来手工制作动画。它最适合与在Blender等外部软件中创建的动画一起使用。相反，为了在代码中创建动画，大多数人更喜欢使用[Tween.js](https://threejs.org/examples/#webgl_loader_collada_kinematics)来制作简单的动画，而使用[GSAP](https://greensock.com/gsap/)来制作更复杂的动画（尽管任何JavaScript动画库都可以使用 three.js）。甚至[官方的例子](https://threejs.org/examples/#webgl_loader_collada_kinematics)在three.js网站上使用Tween.js！尽管如此，了解动画剪辑的创建和结构对我们来说很重要，所以让我们开始吧，很快我们就会让那些懒惰的小鸟飞上天空！

创建动画涉及三个元素：关键帧、`KeyframeTrack`和`AnimationClip`。

### 1. 关键帧 {#keyframes}

动画系统中最底层的概念级别是[关键帧](https://en.wikipedia.org/wiki/Key_frame)。每个关键帧由三部分信息组成：时间**_time_**、属性**_property_**和值 **_value_**，例如：

- **在0秒 `.position`是$(0,0,0)$。**
- **在3秒 `.scale`是$(1,1,1)$。**
- **在12秒 `.material.color`是红色。**

这三个关键帧分别描述了某个属性在特定时间的值。但是，**关键帧没有指定任何特定的对象**。位置关键帧可用于为任何具有`.position`属性的对象设置动画，缩放关键帧可以为任何具有`.scale`属性的对象设置动画，等等。但是，关键帧确实指定了数据类型。上面的`.position`和`.scale`关键帧指定矢量数据，而`.material.color`关键帧指定颜色数据。目前，动画系统支持五种数据类型。

| 数据类型      | 描述                                                                                                                                      | 例子                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Number**     | 为单个数字的任何属性设置动画                                                                                                     | [MeshStandardMaterial.opacity](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.opacity)<br> [PerspectiveCamera.zoom](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.zoom)                                                                                                                                                                                      |
| **Vector**     | 动画任何作为[矢量]({{< relref "/book/first-steps/transformations#positions-are-stored-in-the-vector3-class" >}} "矢量")的属性   | [Object3D.position]({{< relref "/book/first-steps/transformations#our-first-transformation-translation" >}} "Object3D.position")<br> [Object3D.scale]({{< relref "/book/first-steps/transformations#our-second-transformation-scaling" >}} "Object3D.scale")<br> [OrbitControls.target]({{< relref "/book/first-steps/camera-controls#manually-set-the-target" >}} "OrbitControls.target") |
| **Quaternion** | 动画旋转存储为[四元数]({{< relref "/book/first-steps/transformations#the-other-rotation-class-quaternions" >}} "四元数") | [Object3D.quaternion](https://threejs.org/docs/#api/en/core/Object3D.quaternion)                                                                                                                                                                                                                                                                                                           |
| **Boolean**    | 动画任何布尔属性。这不太常用，因为true和false之间没有值，所以动画会跳转           | [MeshStandardMaterial.wireframe](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.wireframe)<br> [DirectionalLight.castShadow](https://threejs.org/docs/#api/en/lights/DirectionalLight.castShadow)                                                                                                                                                                         |
| **String**     | 动画任何作为字符串的属性                                                                                                            | 不常用                                                                                                                                                                                                                                                                                                                                                                          |

此列表中明显缺少的是[欧拉角]({{< relref "/book/first-steps/transformations#representing-rotations-the-euler-class" >}} "欧拉角")，如果您从我们关于变换的章节中回想一下，它类似于向量并用于将旋转存储在[`Object3D.rotation`](https://threejs.org/docs/#api/en/core/Object3D.rotation)。 要为旋转设置动画，您必须使用[`Object3D.quaternion`](https://threejs.org/docs/#api/en/core/Object3D.quaternion)。正如我们在关于变换的章节中提到的，四元数比欧拉角更难处理，因此，为了避免被迷惑，我们现在将忽略旋转并专注于位置和比例。

要创建动画，我们至少需要两个关键帧。最简单的示例是两个数字关键帧，例如，动画材质的不透明度（它的透明/透视程度）：

1. **在0秒 `.material.opacity`是0。**
2. **在3秒 `.material.opacity`是1。**

不透明度为零表示完全不可见，不透明度为1表示完全可见。当我们使用这两个关键帧为对象设置动画时，它将在三秒内淡入视野。不管对象的实际不透明度是多少，关键帧都会覆盖它。也就是说，如果我们手动设置：

{{< code lang="js" linenos="false" hl_lines="" caption="对象上设置的值被动画系统覆盖" >}}

```js
mesh.material.opacity = 0.5;
```

{{< /code >}}

…然后对物体的不透明度进行动画处理，这个0.5的值将被忽略，而使用关键帧中的值。让我们再举一个例子。以下是表示位置的三个矢量关键帧：

1. **在0秒 `.position`等于$(0,0,0)$。**
2. **在3秒 `.position`等于$(5,5,0)$。**
3. **在6秒 `.position`等于$(0,0,0)$。**

当我们使用这些关键帧为网格设置动画时，它将从场景的中心开始，然后它将在三秒钟内[移动到右上角]({{< relref "/book/first-steps/transformations#directions-in-world-space" >}} "移动到右上角")，然后再反转方向并移回中心，再次需要三秒钟。整个动画将花费六秒钟（您可以选择是循环播放还是结束）。

### 2. `KeyframeTrack` {#keyframetrack}

没有代表单个关键帧的类。相反，关键帧是存储在两个数组中的原始数据，_时间_ 和 _值_，在[`KeyframeTrack`](https://threejs.org/docs/#api/en/animation/KeyframeTrack)中。从这里开始，我们将一个`KeyframeTrack`简称为 _track_。track还存储被动画的属性，例如`.position`、或`.scale`。

与关键帧一样，关键帧轨迹不指定任何特定对象。一个`.material.opacity`的track可以为任何支持不透明度的材质设置动画，一个`.quaternion`的track可以为任何支持四元数属性的对象设置动画，等等。

`KeyframeTrack`是基类，每种数据类型都有一个子类：

- [`NumberKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/NumberKeyframeTrack)
- [`VectorKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/VectorKeyframeTrack)
- [`QuaternionKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/QuaternionKeyframeTrack)
- [`BooleanKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/BooleanKeyframeTrack)
- [`StringKeyframeTrack`](https://threejs.org/docs/#api/en/animation/tracks/StringKeyframeTrack)

我们从不直接使用`KeyframeTrack`，相反，我们将选择与动画数据类型匹配的任何子类。让我们看几个例子。首先，我们将使用`NumberKeyframeTrack`来存储这五个`.opacity`关键帧：

1. **在0秒 `.material.opacity`等于0。**
2. **在1秒 `.material.opacity`等于1。**
3. **在2秒 `.material.opacity`等于0。**
4. **在3秒 `.material.opacity`等于1。**
5. **在4秒 `.material.opacity`等于0。**

这些关键帧将使对象闪烁四秒钟。要创建关键帧轨迹，我们将创建一个包含时间的数组和一个包含值的数组，然后将它们与我们想要动画的属性一起传递给`NumberKeyframeTrack`构造函数。

{{< code lang="js" linenos="false" hl_lines="" caption="创建一个代表不透明度的数字关键帧轨迹，包含五个关键帧" >}}

```js
import { NumberKeyframeTrack } from "three";

const times = [0, 1, 2, 3, 4];
const values = [0, 1, 0, 1, 0];

const opacityKF = new NumberKeyframeTrack(".material.opacity", times, values);
```

{{< /code >}}

请注意`times`数组中的每个条目如何映射到`values`数组中的一个条目。接下来，让我们尝试一些位置关键帧和一个`VectorKeyframeTrack`：

1. **在0秒 `.position`等于$(0,0,0)$。**
2. **在3秒 `.position`等于$(2,2,2)$。**
3. **在6秒 `.position`等于$(0,0,0)$。**

这三个关键帧将使对象从场景的中心开始，在三秒内向右、向上和向前移动，然后反向移动回到中心。接下来，我们将使用这些关键帧创建一个矢量轨迹。

{{< code lang="js" linenos="false" hl_lines="" caption="创建一个表示位置的矢量关键帧轨迹，包含三个关键帧" >}}

```js
import { VectorKeyframeTrack } from "three";

const times = [0, 3, 6];
const values = [0, 0, 0, 2, 2, 2, 0, 0, 0];

const positionKF = new VectorKeyframeTrack(".position", times, values);
```

{{< /code >}}

这一次，请注意times数组中的每个条目如何与values数组中的 _三个_ 条目匹配，表示3D空间中的位置。这意味着`values`数组比`times`数组大三倍。

{{< code lang="js" linenos="false" hl_lines="" caption="每次映射到一个$(x, y, z)$位置" >}}

```js
const times = [0, 3, 6];
const values = [
  0,
  0,
  0, // (x, y, z) at t = 0
  2,
  2,
  2, // (x, y, z) at t = 3
  0,
  0,
  0, // (x, y, z) at t = 6
];
```

{{< /code >}}

### 3. `AnimationClip` {#animationclip}

{{< iframe src="https://threejs.org/examples/webgl_loader_fbx.html" height="500" caption="来自 Mixamo.com 的舞蹈角色" title="来自 Mixamo.com 的舞蹈角色" class="medium right" >}}

像这个场景中的角色一样跳舞的动画由许多单独的动作组成：双脚转动、膝盖弯曲、手臂疯狂摆动、头部随着节拍点头（未提供配乐）。每个单独的动作都存储在单独的关键帧轨迹中，例如，有一个轨迹控制舞者左脚的旋转，另一个控制右脚的旋转，第三个控制他的脖子旋转，依此类推。事实上，这个舞蹈动画是由53个关键帧轨迹组成的，其中52个是`.quaternion`控制各个关节的轨迹，如舞者的膝盖、肘部和脚踝。然后有一条`.position`轨迹可以在地板上来回移动人物。

这53条轨迹共同创建了动画，我们称之为**动画剪辑**。因此，动画剪辑是附加到单个对象的任意数量的关键帧的集合，表示剪辑的类是[`AnimationClip`](https://threejs.org/docs/#api/en/animation/AnimationClip)。从这里开始，我们将动画剪辑简称为 _剪辑_。动画片段可以循环播放，因此，虽然这个舞者的动画时长为18秒，但当它到达结尾时，它会循环播放，并且舞者会永远跳下去。

动画剪辑存储三部分信息：剪辑的名称、剪辑的长度，最后是组成剪辑的轨迹数组。如果我们将长度设置为-1，轨迹数组将用于计算长度（在大多数情况下这是您想要的）。让我们创建一个包含之前的单个位置轨迹的剪辑：

{{< code lang="js" linenos="false" hl_lines="" caption="使用单个位置关键帧轨迹创建`AnimationClip`" >}}

```js
import { AnimationClip, VectorKeyframeTrack } from "three";

const times = [0, 3, 6];
const values = [0, 0, 0, 2, 2, 2, 0, 0, 0];

const positionKF = new VectorKeyframeTrack(".position", times, values);

// just one track for now
const tracks = [positionKF];

// use -1 to automatically calculate
// the length from the array of tracks
const length = -1;

const clip = new AnimationClip("slowmove", length, tracks);
```

{{< /code >}}

由于我们将长度设置为-1，轨迹将用于计算长度，在本例中为6秒。我们给剪辑起了一个描述性的名称，`slowmove`，以便以后更容易使用。

`AnimationClip`仍然没有附加到任何特定对象。我们将不得不等待下面的`AnimationAction`。我们可以将我们创建的这个简单剪辑与任何具有`.position`属性的对象一起使用。但是，随着剪辑变得更加复杂并包含更多轨迹，它们开始与特定对象更紧密地联系在一起。例如，您不能将跳舞剪辑与我们加载的一只鸟一起使用，因为它们的内部结构与人形不同。但是，您可以将剪辑与**具有相同内部结构**的任何其他人形图形一起使用。由于此模型是从mixamo.com下载的，因此舞蹈剪辑应该适用于来自mixamo.com的其他角色，但它不太可能适用于您下载的任何人形模型。

现在，让我们尝试制作一个包含之前的不透明度关键帧以及位置关键帧的剪辑。这一次，为了节省一些空间，我们将内联写入时间和值数组，而不是先将它们保存到变量中，并且我们还添加了几个额外的不透明度关键帧，以使两条轨迹都长6秒。

{{< code lang="js" linenos="false" hl_lines="" caption="动画位置和不透明度的剪辑" >}}

```js
import { AnimationClip, NumberKeyframeTrack, VectorKeyframeTrack } from "three";

const positionKF = new VectorKeyframeTrack(
  ".position",
  [0, 3, 6],
  [0, 0, 0, 2, 2, 2, 0, 0, 0]
);

const opacityKF = new NumberKeyframeTrack(
  ".material.opacity",
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 0, 1, 0, 1, 0]
);

const moveBlinkClip = new AnimationClip("move-n-blink", -1, [
  positionKF,
  opacityKF,
]);
```

{{< /code >}}

此动画剪辑适用于任何具有`.position`属性的对象以及具有`.opacity`属性的材质。换句话说，它应该与网格一起使用。它会在闪烁时使网格移动。再一次，我们给剪辑起了一个令人难忘的名字，`move-n-blink`。稍后，我们可能会有很多单独的剪辑，我们可以将它们合成并混合在一起。给每个动画剪辑一个唯一的名字将使我们更容易做到这一点。这一次，请注意位置轨迹有三个关键帧，而不透明度轨迹有七个关键帧。此外，每个轨迹的长度是相同的。这不是必需的，但如果轨迹的长度匹配，动画会更好看。

## 动画系统：播放和控制

现在，我们有一个简单的动画剪辑，它使对象在淡入和淡出时移动。下一步是将此剪辑附加到一个对象上，然后播放它。这将我们带到动画系统的最后两个组件。首先，`AnimationMixer`允许我们将静态对象转换为动画对象，最后，`AnimationAction`将剪辑连接到对象并允许我们使用播放、暂停、循环、重置等操作来控制它。

### 4. `AnimationMixer` {#animationmixer}

要使用动画系统为诸如网格之类的对象设置动画，我们必须将其连接到[**`AnimationMixer`**](https://threejs.org/docs/#api/en/animation/AnimationMixer)。从这里开始，我们将`AnimationMixer`简单地称为 _混合器_。**我们需要为场景中的每个动画对象使用一个混合器。** 混合器执行使模型及时移动到动画剪辑的技术工作，无论是移动舞者的脚、手臂和臀部，还是飞鸟的翅膀。

{{< code lang="js" linenos="false" caption="每个`AnimationMixer`控制一个对象的动画" >}}
import { Mesh, AnimationMixer } from 'three';

// create a normal, static mesh
const mesh = new Mesh();

// turn it into an animated mesh by connecting it to a mixer
const mixer = new AnimationMixer(mesh);
{{< /code >}}

我们还需要在每一帧更新混合器，但我们稍后会回到这个问题。

### 5. `AnimationAction` {#animationaction}

拼图的最后一块， [`AnimationAction`](https://threejs.org/docs/#api/en/animation/AnimationAction)将动画对象连接到动画剪辑。类`AnimationAction`也是暂停、播放、循环和重置等控件所在的位置。从这里开始，我们将简化`AnimationAction`为 _动作_（如果您在创建动作时像导演一样喊出“动作”，这会有所帮助）。与其他动画系统类不同，我们从不直接创建动作。相反，我们将使用[`AnimationMixer.clipAction`](https://threejs.org/docs/#api/en/animation/AnimationMixer.clipAction)，它确保动作被混合器缓存。

让我们看看这个示例。在这里，我们使用我们刚才创建的`moveBlinkClip`，然后将网格连接到混合器，最后。我们与剪辑一起使用`.clipAction`来创建一个动作。

{{< code lang="js" linenos="false" hl_lines="" caption="使用`.clipAction`创建一个`AnimationAction`" >}}

```js
import { AnimationClip, AnimationMixer } from "three";

const moveBlinkClip = new AnimationClip("move-n-blink", -1, [
  positionKF,
  opacityKF,
]);

const mixer = new AnimationMixer(mesh);
const action = mixer.clipAction(moveBlinkClip);
```

{{< /code >}}

让我们看另一个例子。假设我们有一个人类模型和一个角色行走的剪辑。再一次，我们将模型连接到混合器，然后使用`.clipAction`创建一个动作。然后我们立即将动作的状态设置为正在播放：

{{< code lang="js" linenos="false" caption="创建一个action然后将其状态设置为正在播放" >}}
const mixer = new AnimationMixer(humanModel);

const action = mixer.clipAction(walkClip);

// immediately set the animation to play
action.play();

// later, you can stop the action
action.stop();
{{< /code >}}

请注意，虽然我们调用了`.play`，但动画还没有开始。我们仍然需要更新动画循环中的混合器，我们稍后会做。

假设这个角色也可以跑和跳。每个动画都将出现在一个单独的剪辑中，并且每个剪辑必须连接到一个动作。因此，就像**混合器和模型之间存在一对一的关系**一样，**动作和动画剪辑之间也存在一对一的关系**。

{{< code lang="js" linenos="false" caption="每个动画剪辑都需要一个单独的动画动作" >}}
const mixer = new AnimationMixer(humanModel);

const walkAction = mixer.clipAction(walkClip);
const runnAction = mixer.clipAction(runClip);
const jumpAction = mixer.clipAction(jumpClip);
{{< /code >}}

下一步是选择要播放这些动作中的哪一个。你如何处理这些将取决于你正在构建什么样的场景。例如，如果它是一个游戏，您会将这些动作连接到用户控件，这样当按下相应的按钮时，角色就会行走、奔跑或跳跃。另一方面，如果它是一个不可玩的角色，你可以将它们连接到一个AI系统并让它控制角色的动作。

您需要考虑的另一件事是当角色停止行走并开始奔跑时会发生什么。如果您立即从一个动画移动到另一个动画，它看起来不会很好。幸运的是，`AnimationAction`包含控件允许您混合两个剪辑、逐渐将剪辑减慢到停止、循环播放剪辑、反向播放或以不同的速度播放等等。在本章的开头，我们声称three.js动画系统是一个完整的动画混合台。更准确地说，我们应该说`AnimationAction`是一个完整的动画混音台，因为这是大多数控件所在的地方。

{{< iframe src="https://threejs.org/examples/webgl_animation_skinning_blending.html" height="500" title="动画合成示例" >}}

### 更新循环中的动画

在播放任何动画之前只剩下一件事要做。我们需要在动画循环中更新动画对象。混合器有一个更新方法，它带有一个时间`delta`参数。无论我们传递多少时间给`mixer.update`，连接到混合器的所有操作都将向前移动该时间。

{{< code lang="js" linenos="false" hl_lines="" caption="将所有连接到网格的动画向前移动一秒" >}}

```js
const mixer = new AnimationMixer(mesh);

const updateAmount = 1; // in seconds

mixer.update(updateAmount);
```

{{< /code >}}

但是，通常我们不想向前跳一整秒。每一帧，我们都想将动画向前移动一个微小的量，这样当我们每秒渲染60帧时，我们会看到一个平滑的动画。我们将使用几章前衍生的技术，当我们第一次创建动画循环并使用它来驱动一个简单的旋转立方体时，请参考[动画循环]({{< relref "/book/first-steps/animation-loop#timing-in-the-animation-system" >}} "动画循环")进行复习。简而言之，我们测量每帧渲染所需的时间，将其存储在名为`delta`的变量中，然后将其传递给混合器的更新方法。

{{< code lang="js" linenos="false" hl_lines="" caption="我们需要每帧更新`delta`单位的混合器" >}}

```js
const mixer = new AnimationMixer(mesh);
const clock = new Clock();

// you must do this every frame
const delta = clock.getDelta();
mixer.update(delta);
```

{{< /code >}}

像往常一样，我们将通过给每个动画对象一个[`.tick`方法]({{< relref "/book/first-steps/animation-loop#the-tick-method" >}} "`.tick`方法")来做到这一点。在这里，`.tick`将调用混合器的更新方法。

{{< code lang="js" linenos="false" caption="使用动画对象的`.tick`方法更新混合器" >}}
const mixer = new AnimationMixer(mesh);

mesh.tick = (delta) => mixer.update(delta);

updatables.push(mesh);
{{< /code >}}

这类似于几章前的[轨迹控制`.tick`方法]({{< relref "/book/first-steps/camera-controls#update-the-controls-in-the-animation-loop" >}} "轨迹控制`.tick`方法")。

## 从**_Parrot.glb_**、**_Flamingo.glb_**和**_Stork.glb_**播放动画剪辑

现在我们已经了解了如何创建一个非常简单但有点无聊的动画剪辑，它可以在场景中移动对象同时淡入淡出，让我们将注意力转移到与三个鸟类模型一起加载的更有趣的剪辑上。**_Parrot.glb_**、**_Flamingo.glb_**和**_Stork.glb_**这三个文件中的每一个都包含模型和该模型飞行的动画剪辑。这些模型与我们在前几章中使用的[简单立方体网格]({{< relref "/book/first-steps/first-scene#our-first-visible-object-mesh" >}} "简单立方体网格")没有什么不同。每只鸟都是带有`geometry`和`material`的单一的`Mesh`，并且几何体有一个名为[**变形目标**](https://en.wikipedia.org/wiki/Morph_target_animation)的功能（又名**合成形状**）。变形目标允许我们为单个几何体定义两个（或更多）不同的形状。在这里，有一种翅膀向上的形状，一种翅膀向下的形状。飞行剪辑在这两个形状之间进行动画处理，使其看起来像鸟的翅膀在拍打。

{{% note %}}
TODO-LINK: link to morph targets
{{% /note %}}

让我们将迄今为止所学的一切付诸行动。以下是播放每只鸟附带的动画剪辑所需要做的事情：

1. [从每个glTF文件加载的数据]({{< relref "/book/first-steps/load-models#returned-gltf-data" >}} "从每个glTF文件加载的数据")中找到飞行剪辑。
2. 创建一个`AnimationMixer`来控制每个鸟模型。
3. 创建一个`AnimationAction`将剪辑连接到混合器。
4. [为每只鸟添加一个`.tick`方法]({{< relref "/book/first-steps/animation-loop#the-tick-method" >}} "为每只鸟添加一个`.tick`方法")，并在每一帧更新鸟的混合器。

几乎所有事情都可以在 _**birds/setupModel.js**_ 中用几行代码完成。在World中，我们需要将鸟类添加到[`updatables`数组中]({{< relref "/book/first-steps/animation-loop#the-updatables-array" >}} "`updatables`数组中")，以便动画将在循环中更新。

### 在哪里可以找到加载的动画剪辑

在 _**components/birds/birds.js**_ 模块中，我们目前将从 _**Parrot.glb**_ 加载的原始数据记录到控制台：

{{< code lang="js" linenos="" linenostart="14" caption="_**birds.js**_: 记录加载的数据" >}}
console.log('Squaaawk!', parrotData);
{{< /code >}}

打开浏览器控制台并立即查看。我们在上一章中[详细描述了这些数据]({{< relref "/book/first-steps/load-models#returned-gltf-data" >}} "详细描述了这些数据")，所以如果您需要复习，请返回那里查看。数据包含两个感兴趣的元素：我们在上一章中提取的鸟形网格，以及鸟飞翔的动画剪辑。在上一章中，[我们将网格定位在`gltf.scene`中]({{< relref "/book/first-steps/load-models#extract-the-mesh-from-the-loaded-data" >}} "我们将网格定位在`gltf.scene`中")。在这里，我们将提取动画剪辑并将其附加到网格上以使鸟飞起来。您将在`gltfData.animations`数组中找到动画剪辑：

{{< code lang="js" hl_lines="2" linenos="false" caption="在加载的数据中定位动画片段" >}}
{
animations: [AnimationClip]
asset: {…}
cameras: []
parser: GLTFParser {…}
scene: Scene {…}
scenes: […]
userData: {}
**proto**: Object
}
{{< /code >}}

在这里，每个文件只包含一个剪辑，但一个glTF文件可以包含任意数量的动画剪辑。例如，包含人类模型的文件可能还包含角色行走、奔跑、跳跃、坐下等的剪辑。

接下来，更新`setupModels`以提取剪辑：

{{< code lang="js" linenos="" hl_lines="3" caption="_**setupModel.js**_: 从加载的数据中提取剪辑" >}}

```js
function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  return model;
}
```

{{< /code >}}

### 创建混合器和动作

现在，我们将创建混合器和动作。首先，导入`AnimationMixer`。我们将用[`AnimationMixer.clipAction`](#animationaction)来创建动作，因此无需导入`AnimationAction`。然后，创建混合器，将鸟模型传递给构造函数。

{{< code lang="js" linenos="" hl_lines="1,7" caption="_**setupModel.js**_: 导入并创建混合器" >}}

```js
import { AnimationMixer } from "three";

function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  const mixer = new AnimationMixer(model);

  return model;
}
```

{{< /code >}}

接下来，使用`.clipAction`创建动作，传入剪辑，然后立即将动作设置为播放：

{{< code lang="js" linenos="" linenostart="3" hl_lines="8,9" caption="_**setupModel.js**_: 使用`.clipAction`创建AnimationAction" >}}
function setupModel(data) {
const model = data.scene.children[0];
const clip = data.animations[0];

const mixer = new AnimationMixer(model);
const action = mixer.clipAction(clip);
action.play();

return model;
}
{{< /code >}}

这里的所有都是它的。剩下的就是在循环中更新现在动画的鸟。

### 创建`.tick`方法

还是在`setupModel`中，给模型添加一个`.tick`方法：

{{< code file="worlds/first-steps/animation-system/src/World/components/birds/setupModel.final.js" from="3" to="14" lang="js" linenos="true" hl_lines="11" caption="_**setupModel.js**_: 创建`.tick`方法">}}{{< /code >}}

在这个方法中，我们将每一帧调用[`mixer.update`](https://threejs.org/docs/#api/en/animation/AnimationMixer.update)，传入`delta`，这是[前一帧渲染的时间量]({{< relref "/book/first-steps/animation-loop#timing-in-the-update-loop" >}} "前一帧渲染的时间量")。即使帧速率波动，混合器也使用`delta`保持动画同步。再次，请参阅[第1.7章]({{< relref "/book/first-steps/animation-loop" >}} "第1.7章")以获得更详细的讨论。

### 将鸟添加到`updatables`

最后，在World中，将所有三只鸟添加到`updatables`数组中：

{{< code file="worlds/first-steps/animation-system/src/World/World.final.js" from="34" to="42" lang="js" linenos="true" hl_lines="40" caption="_**World.js**_: 将鸟类添加到可更新数组">}}{{< /code >}}

此时，如果一切设置正确，您的鸟儿就会起飞！

{{< inlineScene entry="first-steps/birds-animated.js" class="round" >}}

## 你已经读到了本书的结尾 - 暂时 :)

随着我们的鸟儿在展翅飞翔，你已经到达了这本书的结尾。恭喜！

我们在短时间内介绍了很多内容，包括相机、几何体、网格、纹理、基于物理的材质、直接和环境照明、使用WebGL渲染我们的场景、转换、坐标系，以及场景图、向量、加载外部模型、glTF资源格式，甚至是three.js动画系统，这是一个复杂的野兽。在了解所有这些的同时，我们还找到了创建一个简单但结构良好的应用程序的时间，您可以在该应用程序的基础上构建任何规模的three.js应用程序。

然而，现在不要停下来！我们已经奠定了基础，但要成为three.js专家，我们还有很长的路要走。是时候让你自己把事情提升到一个新的水平了。祝你好运！

P.S. 我们还没有完成，你还需要完成所有的挑战！

## 挑战

{{% aside success %}}

### 简单

`AnimationAction`有更多的动画控件 `.play`和`.stop`。现在试试其中的一些。

1. 您可以使用[`.startAt`](https://threejs.org/docs/#api/en/animation/AnimationAction.startAt)延迟动画的开始。测试一下。

2. 您可以使用[`.timeScale`属性](https://threejs.org/docs/#api/en/animation/AnimationAction.timeScale)控制动画的速度。您可以直接设置值，也可以使用[`.setEffectiveTimeScale`](https://threejs.org/docs/#api/en/animation/AnimationAction.setEffectiveTimeScale)方法。

3. 利用[`.halt`](https://threejs.org/docs/#api/en/animation/AnimationAction.halt)逐渐减慢动画停止。

_注意：这里列出的所有方法都可以链接，所以你可以这样写：_

{{< code lang="js" linenos="false" caption="`AnimationAction`方法可以链接" >}}
action
.startAt(2)
.setEffectiveTimeScale(0.5)
.play();
{{< /code >}}

_除了我们在此处列出的控件之外，还有许多其他控件。实验！_

{{% /aside %}}

{{% aside %}}

### 中等

1. 添加一个[范围滑块输入元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)到页面。使用滑块的值来设置[`.setEffectiveWeight`](https://threejs.org/docs/#api/en/animation/AnimationAction.setEffectiveWeight)并控制飞行动画对鸟类的影响程度。零是没有效果，1是完全效果。

2. 使用[位置轨迹](#keyframetrack)和我们之前描述的[剪辑](#animationclip)创建一个您自己的动画剪辑。将剪辑附加到鸟而不是飞行动画上。

3. 创建自己的新轨迹。这一次，为模型的缩放设置动画。从两个轨迹创建一个剪辑，以便鸟的位置和缩放都具有动画效果。使两条轨迹的长度相同。现在，使两条轨迹的长度不同。

4. 使每个轨迹的第一个和最后一个关键帧相等，这样动画就可以循环而不跳动。现在尝试为第一个和最后一个关键帧赋予不同的值，并使每个轨迹具有不同的长度。观察动画如何在循环之间跳转。

_注意：位置轨迹会覆盖`bird.position`，所以鸟儿会再次混杂在一起。这个练习没问题。如果你愿意，可以从场景中移除其中一只鸟之外的所有鸟。_

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 将位置、比例和加载的飞行动画组合在一个剪辑中。有几种方法可以做到这一点。例如，您可以查看已加载剪辑的`.tracks`数组内部，并提取您在其中找到的任何轨迹以创建新剪辑。或者，您可以尝试将您的轨迹添加到现有剪辑的`.tracks`中. 请注意，如果您使用后一种方法，则必须在添加新轨迹后调用[`clip.resetDuration`](https://threejs.org/docs/#api/en/animation/AnimationClip.resetDuration)方法。

2. 您创建的位置和缩放轨迹可能比飞行动画长。当你组合轨迹时，鸟的翅膀会拍打一次，然后冻结，直到其他轨迹完成。无论其他轨迹有多长，您能否克服这一点，从而使翅膀不断拍打？这个没有提示！

{{% /aside %}}

{{% aside %}}

### 奖励

1. 如果到目前为止您一直在使用内联代码编辑器，请从本章中获取代码并使其在您的计算机上本地运行。您需要设置一个[开发服务器]({{< relref "/book/introduction/prerequisites#a-web-server" >}} "开发服务器")。
   {{% /aside %}}
