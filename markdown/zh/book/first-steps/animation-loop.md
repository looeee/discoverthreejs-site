---
title: "动画循环"
description: "在本章中，我们构建了一个动画循环，它将生成一个帧流，使我们能够将动画和其他效果添加到我们的场景中。"
date: 2018-04-02
weight: 107
chapter: "1.7"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/animation-loop/src/World/components/camera.js",
    "worlds/first-steps/animation-loop/src/World/components/cube.start.js",
    "worlds/first-steps/animation-loop/src/World/components/cube.final.js",
    "worlds/first-steps/animation-loop/src/World/components/lights.js",
    "worlds/first-steps/animation-loop/src/World/components/scene.js",
    "worlds/first-steps/animation-loop/src/World/systems/renderer.js",
    "worlds/first-steps/animation-loop/src/World/systems/Resizer.js",
    "worlds/first-steps/animation-loop/src/World/systems/Loop.start.js",
    "worlds/first-steps/animation-loop/src/World/systems/Loop.final.js",
    "worlds/first-steps/animation-loop/src/World/World.start.js",
    "worlds/first-steps/animation-loop/src/World/World.final.js",
    "worlds/first-steps/animation-loop/src/main.start.js",
    "worlds/first-steps/animation-loop/src/main.final.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/animation-loop/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/animation-loop/"
IDEActiveDocument: "src/World/systems/Loop.js"
---

# 动画循环

{{< inlineScene entry="first-steps/static-cube.js" class="small right" caption="单次调用<br>renderer.render的输出" >}}

在过去的几章中，我们的应用程序取得了惊人的进步。我们有灯光、颜色、物理上正确的渲染、抗锯齿、自动调整大小，我们知道如何在3D空间中移动对象，而且我们的代码干净、模块化且结构良好。但是我们的场景缺少一个重要的元素：**运动！**

我们正在使用该`renderer.render`方法来绘制场景。此方法将场景和相机作为输入，并将单个静止图像输出到HTML`<canvas>`元素。输出是您可以在上面看到的不动的紫色盒子。

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="32" to="36" lang="js" hl_lines="34" linenos="true" caption="_**World.js**_: 使用`renderer.render`方法画出一帧" >}}{{< /code >}}

{{< inlineScene entry="first-steps/animation-loop.js" class="small right" >}}

在本章中，我们将为立方体添加一个简单的旋转动画。我们将这样做：

- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **稍微旋转立方体一点**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **稍微旋转立方体一点**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **稍微旋转立方体一点**
- ...

......等等在一个称为**动画循环**的无限循环中。设置这个循环很简单，因为three.js通过`renderer.setAnimationLoop`方法为我们完成了所有困难的工作。

我们还将在本章中介绍three.js的`Clock`，一个简单的秒表类，我们可以使用它来保持动画同步。我们将在本章中处理小于一秒的时间值，因此我们将使用毫秒 (ms)，即千分之一秒。

一旦我们设置了循环，我们的目标就是以每秒60帧(60FPS)的速率生成稳定的帧流，这意味着我们需要大约每16毫秒调用一次`.render`。换句话说，我们需要确保我们在一帧中所做的所有处理的花费都少于16毫秒（这有时被称为**frame budget - 帧预算**）。这意味着我们需要更新动画，执行任何其他需要跨帧计算的任务（例如物理），并在我们打算支持的最低规格硬件上在不到16毫秒的时间内渲染帧。在本章的其余部分，当我们设置循环并为立方体创建一个简单的旋转动画时，我们将讨论如何最好地实现这一点。

## 与游戏循环的相似之处

大多数游戏引擎使用每帧运行一次的**游戏循环**的概念，用于更新和渲染游戏。一个基本的游戏循环可能包含以下四个任务：

1. **获取用户输入**
2. **计算物理**
3. **更新动画**
4. **渲染一帧**

尽管three.js不是游戏引擎并且我们将循环称为**动画循环**，但我们的目标非常相似。这意味着，我们可以从游戏引擎设计中借鉴一些久经考验且值得信赖的想法，而不是从头开始。我们在本章中创建的循环非常简单，但是如果您以后发现自己需要一个更复杂的循环，可能以与渲染场景不同的速率更新动画和物理，您可以参考[一本关于游戏开发的书](https://gameprogrammingpatterns.com/game-loop.html)了解更多信息信息。

稍后，我们将使我们的场景具有交互性。幸运的是，由于有了[`addEventListener`]({{< relref "book/appendix/dom-api-reference#listening-for-events" >}} "`addEventListener`")，在浏览器中处理用户输入很容易，所以我们不需要在循环中处理这个任务。此外，我们暂时不会进行任何物理计算（尽管有几个很棒的物理库能和three.js一起使用），所以我们可以跳过物理步骤。渲染已经被`renderer.render`处理。这给我们留下了本章中的两个任务：设置循环本身，然后创建一个更新动画的系统。

我们将首先设置循环以生成帧流，然后设置动画系统。

## 用three.js创建一个动画循环

### _**Loop.js**_ 模块

打开（或创建）_**systems/Loop.js**_ 模块并在其中创建一个新`Loop`类。这个类将处理所有的循环逻辑和动画系统。您会注意到我们已经导入`Clock`了 ，我们将在下面使用它来保持动画同步。接下来，由于我们将使用`renderer.render(scene, camera)`生成帧，因此可以肯定的是，我们需要在`Loop`类中使用`camera`、`scene`和`renderer`，因此需要将它们传递给构造函数并将它们保存为实例变量。最后，创建我们以后可以用来启动/停止循环的方法：`.start`和`.stop`。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**Loop.js**_: 初始化设置" >}}

```js
import { Clock } from "three";

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
  }

  start() {}

  stop() {}
}

export { Loop };
```

{{< /code >}}

在World中，将这个新类添加到导入列表中：

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="1" to="8" lang="js" linenos="true" hl_lines="8" caption="_**World.js**_: 导入`Loop`类" >}}{{< /code >}}

将循环创建为[模块作用域变量]({{< relref "book/first-steps/world-app#set-up-the-camera-renderer-and-scene" >}} "模块作用域变量")，如`camera`、`renderer`和`scene`一样，因为我们不希望从`World`类外部访问它：

{{< code lang="js" linenos="" linenostart="10" hl_lines="13 20" caption="_**World.js**_: 创建一个`loop`实例" >}}

```js
let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    ...
  }
```

{{< /code >}}

最后，添加`.start`和`.stop`方法到`World`中，它们只是调用它们在`Loop`中的对应项。这就是我们如何从 _**main.js**_ 中提供对循环的访问：

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="33" to="44" lang="js" linenos="true" hl_lines="38-44" caption="_**World.js**_: 创建`.start`和`.stop`方法" >}}{{< /code >}}

然后，在 _**main.js**_ 中，切换成`world.render`：

{{< code file="worlds/first-steps/animation-loop/src/main.start.js" from="3" to="12" lang="js" linenos="true" hl_lines="10 11" caption="_**main.js**_: 渲染单个静止帧" >}}{{< /code >}}

... 对于`world.start`:

{{< code file="worlds/first-steps/animation-loop/src/main.final.js" from="3" to="12" lang="js" linenos="true" hl_lines="10 11" caption="_**main.js**_: 启动动画循环" >}}{{< /code >}}

当你这样做时，场景会变黑，但不要担心。一旦我们完成创建循环，它会在片刻后再次恢复活力。

### 使用`.setAnimationLoop`创建循环

现在，一切都设置好了，我们可以创建循环了。正如我们上面提到的，我们不需要担心创建动画循环的技术细节，因为three.js提供了一个为我们做所有事情的方法：[`WebGLRenderer.setAnimationLoop`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop)。

{{< code lang="js" linenos="false" caption="使用`.setAnimationLoop`创建循环" >}}
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();

// start the loop
renderer.setAnimationLoop(() => {
renderer.render(scene, camera);
});
{{< /code >}}

这将一遍又一遍地调用`renderer.render`以生成帧流。我们可以通过传递`null`作为回调来取消正在运行的循环：

{{< code lang="js" linenos="false" caption="停止正在运行的循环" >}}
// stop the loop
renderer.setAnimationLoop(null);
{{< /code >}}

在内部，循环是使用[`.requestAnimationFrame`]({{< relref "/book/appendix/dom-api-reference#drawing-animation-frames" >}} "`.requestAnimationFrame`")。这种内置的浏览器方法可以智能地安排帧与显示器的刷新率同步，如果您的硬件跟不上，它会平滑地降低帧率。由于`.setAnimationLoop`是最近添加的，较旧的three.js示例和教程通常直接使用`.requestAnimationFrame`设置循环，这样做相当简单。然而，`.setAnimationLoop`还有一点额外的魔力可以确保循环在虚拟现实和增强现实环境中工作。

{{% note %}}
TODO-LOW: possible move discussion of Hz and framerates here, or otherwise link to later in the chapter
TODO-LINK: link to "creating an animation loop with JavaScript" if/when the chapter is added
{{% /note %}}

{{% aside success %}}

### 虚拟现实、增强现实和动画循环

**Web虚拟现实**(**WebVR**)和**Web增强现实**(**WebAR**)组合成一个统一的API，称为[**WebXR Device API**](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)。2018 年初左右，three.js添加了对这些API的支持。如果您有幸拥有虚拟现实设备，请查看[three.js VR示例](https://threejs.org/examples/?q=webxr)。

在撰写本文时，2020年的WebXR API相对较新，并且会随着开发的进行而发生变化。通过使用`.setAnimationLoop`，我们无需担心任何这些更改，只需让three.js保持最新。此外，如果您现在创建一个场景，然后决定添加VR功能，那么这样做很容易。

{{% /aside %}}

### `Loop.start`和`Loop.stop`方法

现在，我们可以创建循环了。我们将在`Loop.start`中使用`.setAnimationLoop`：

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="13" to="22" lang="js" linenos="true" hl_lines="" skip_lines="15,16,17" caption="_**Loop.js**_: 创建`.start`方法" >}}{{< /code >}}

接下来，创建对应的`.stop`方法，传入`null`作为回调以停止循环：

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="23" to="25" lang="js" linenos="true" hl_lines="" skip_lines="15,16,17" caption="_**Loop.js**_: 创建`.stop`方法" >}}{{< /code >}}

进行这些更改后，您的应用程序将开始以大约每秒60帧的速度输出帧（或者可能更高，具体取决于显示器的刷新率）。但是，您不会 _看到_ 任何区别。什么都没有动，因为我们只是一遍又一遍地画同一个帧。我们的循环现在看起来像这样：

- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- ...

如果你将它与我们在本章开头描述的循环进行比较，你会发现我们遗漏了一个重要步骤：

- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **旋转立方体一点点**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **旋转立方体一点点**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **旋转立方体一点点**
- ...

在渲染每一帧之前，我们需要一些方法来调整立方体的旋转，并且我们需要以适用于任何类型的动画对象的方式进行调整，而不仅仅是旋转的立方体。更一般地说，我们的循环应该是这样的：

- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **将动画向前移动一帧**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **将动画向前移动一帧**
- **调用`renderer.render(...)`**
- **等待。。。直到是时候画下一帧**
- **将动画向前移动一帧**
- ...

### 移除`onResize`钩子

首先，让我们整理一下。现在循环正在运行，每当我们调整窗口大小时，都会在循环的下一次迭代中生成一个新帧。这足够快，您不会注意到任何延迟，因此我们不再需要在调整大小时手动重绘场景。从World中移除`resizer.onResize`钩子：

{{< code lang="js" linenos="" linenostart="17" hl_lines="31-33" caption="_**World.js**_: 删除高亮所在行" >}}

```js
constructor(container) {
  camera = createCamera();
  scene = createScene();
  renderer = createRenderer();
  container.append(renderer.domElement);

  const cube = createCube();
  const light = createLights();

  updatables.push(cube);

  scene.add(cube, light);

  const resizer = new Resizer(container, camera, renderer);
  resizer.onResize = () => {
    this.render();
  };
}
```

{{< /code >}}

现在，尝试调整场景的大小并注意它运行顺畅。这表明我们的循环运行正常。

## 动画系统

考虑一个简单的游戏，您可以在其中探索地图并挑选苹果。以下是您可以添加到此游戏中的一些动画对象：

- 女主角，拥有各种动画，如步行/跑步/跳跃/攀爬/挑选。
- 苹果树。苹果随着时间长大，树叶随风飘扬。
- 一些可怕的蜜蜂会试图把你从花园里赶出去。
- 一个有趣的环境，其中包含水、风、树叶和岩石等物体。
- 以悬停在地面上的旋转立方体的形式加能量。

… 等等。每次循环运行时，我们都希望通过将它们向前移动一帧来更新所有这些动画。就在我们渲染每一帧之前，我们会让女主角向前迈出一点点，我们会让每只蜜蜂向她移动，我们会让叶子移动，苹果长大，能量立方体旋转，每一个都有一点点, 几乎是肉眼无法看到的微小量，但随着时间的推移会产生流畅的动画效果。

### `Loop.tick`方法

为了处理所有这些，我们需要一个 _更新_ 所有动画的函数，并且这个函数应该在每一帧开始时运行一次。然而，_update_ 这个词已经在整个three.js中被大量使用，所以我们将选择 _tick_ 这个词。在我们绘制每一帧之前，我们会让每个动画 _tick_ 向前移动一帧。在`Loop`类的末尾添加`Loop.tick`方法，然后在动画循环中调用它：

{{< code lang="js" linenos="" linenostart="13" hl_lines="16 27-29" caption="_**Loop.js**_: 创建`.tick`方法" >}}

```js
start() {
  this.renderer.setAnimationLoop(() => {
    // tell every animated object to tick forward one frame
    this.tick();

    // render a frame
    this.renderer.render(this.scene, this.camera);
  });
}

stop() {
  this.renderer.setAnimationLoop(null);
}

tick() {
  // Code to update animations will go here
}
```

{{< /code >}}

### 中心化还是去中心化？

在实现这种新`.tick`方法时，我们必须做出一些设计选择。一个明显的解决方案是创建一个复杂的集中更新函数来控制我们场景中的所有动画对象。它可能看起来像这样：

{{< code lang="js" linenostart="27" linenos="false" hl_lines="" caption="中心化的动画系统" >}}

```js
tick() {
  if(controls.state.run) {
    character.runAnimation.nextFrame();
  }

  beeA.moveTowards(character.position);
  beeB.moveTowards(character.position);
  beeC.moveTowards(character.position);

  powerupA.rotation.z += 0.01;
  powerupB.rotation.z += 0.01;
  powerupC.rotation.z += 0.01;

  leafA.rotation.y += 0.01;

  // ... and so on
}
```

{{< /code >}}

好吧，你应该明白了。如果我们的场景中只有几个动画对象，这可能没问题，但它不会很好地扩展。如果有五十或一百个动画对象，它会非常丑陋。它还打破了各种软件设计原则，因为现在`Loop`类必须深入了解每个动画对象的工作原理。

这里有一个更好的主意：我们将在 _对象本身上_ 定义更新每个对象的逻辑。每个对象都将使用自己的通用`.tick`方法暴露该逻辑。现在，`Loop.tick`方法会很简单。每一帧，我们将遍历一个动画对象列表，并告诉它们每个`.tick`向前一帧。它看起来像这样：

{{< code lang="js" linenostart="23" linenos="false" hl_lines="" caption="去中心化的动画系统" >}}

```js
// somewhere in the Loop class:
this.updatables = [character, beeA, beeB, beeC, powerupA, powerupB, powerupC, leafA, ... ]
...

tick() {
  for(const object of this.updatables) {
    object.tick();
  }
}
```

{{< /code >}}

这要好得多。现在，`Loop`类都知道的是“_动画对象有一个`.tick`方法_”。这些方法可以根据每个对象的需要复杂或简单。例如，这是一个简单的旋转电源可能的样子：

{{< code lang="js" linenos="false" linenostart="1" hl_lines="" caption="使用`.tick`方法创建一个旋转电源" >}}

```js
function createPowerup() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: "purple" });
  const powerup = new Mesh(geometry, material);

  // this method will be called once per frame
  powerup.tick = () => {
    // increase the powerup's rotation each frame
    powerup.rotation.z += 0.05;
  };

  return powerup;
}
```

{{< /code >}}

如果将其与 _**components/cube.js**_ 进行比较，您会发现这非常相似。我们只需要添加一个`cube.tick`方法。

这种方法更适合我们用于设计应用程序的模块化理念。我们不会让应用程序的某个部分变得越来越复杂，而是将复杂性分解成小块，每个逻辑块都在使用它的地方定义。这样，我们可以将每个对象设计为一个独立的实体。**每一个物体，从不起眼的旋转立方体到摘苹果的女主角，都会封装它的行为**。这是一个强大的概念，我们将在整本书中建立它。

### `Loop.updatables`

为此，我们需要循环类中的动画对象列表。为此，我们将使用一个简单的数组，我们将此列表称之为`updatables`。继续并立即创建它。

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="6" to="11" lang="js" linenos="true" hl_lines="10" caption="_**Loop.js**_: 创建一个列表来保存动画对象" >}}{{< /code >}}

接下来， 在`Loop.tick`内部，遍历这个列表并调用在此列表中任何对象的`.tick`方法。

{{< code lang="js" linenos="" linenostart="27" hl_lines="" caption="_**Loop.js**_: 循环动画对象并调用它们的`.tick`方法" >}}

```js
tick() {
  for (const object of this.updatables) {
    object.tick();
  }
}
```

{{< /code >}}

请注意`Loop.tick`将在每一帧中都运行，这是事实，这意味着它将每秒运行60次。将此处完成的工作量保持在最低限度很重要，这意味着每个动画对象的`.tick`方法必须尽可能简单。

### `cube.tick`方法

在我们添加`cube`到`updatables`列表之前，它需要一个`.tick`方法，所以继续创建一个。我们将在此`.tick`方法中定义旋转立方体的逻辑。

每种类型的动画对象都有不同的`.tick`方法。在我们的[苹果采摘游戏](#the-animation-system)中，女主角的tick方法会检查她是在走、跑、跳还是站着不动，然后从其中一个动画中播放一帧，而苹果树的tick方法会检查苹果的成熟度和树叶沙沙作响，每只邪恶蜜蜂的tick方法都会检查女主人公的位置，然后将蜜蜂移向她一点点。如果她离得足够近，蜜蜂会试图蜇她。

在这里，我们将简单地在$X$、$Y$和$Z$轴每帧少量的更新立方体。这将使它看起来随机翻滚。

{{< code lang="js" linenos="" linenostart="8" hl_lines="16-21" caption="_**cube.js**_: 创建`.tick`方法" >}}

```js
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: "purple" });
  const cube = new Mesh(geometry, material);

  cube.rotation.set(-0.5, -0.1, 0.8);

  // this method will be called once per frame
  cube.tick = () => {
    // increase the cube's rotation each frame
    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  };

  return cube;
}
```

{{< /code >}}

**注意**：像这样在运行时向现有类添加属性称为[_猴子补丁_](https://en.wikipedia.org/wiki/Monkey_patch)（这里，我们添加`.tick`到`Mesh`实例）。这是常见的做法，在我们简单的应用程序中不会引起任何问题。但是，我们不应该养成这样粗心大意的习惯，因为在某些情况下它会导致性能问题。我们只允许自己在这里这样做，因为替代方案更复杂。

0.01是一个相当慢的旋转速度的值，我们通过反复试验发现了它。 [three.js中的旋转以弧度为单位]({{< relref "/book/first-steps/transformations#the-unit-of-rotation-is-radians" >}} "three.js中的旋转以弧度为单位")，因此在内部这个值被解释为 _0.01弧度_，大约是半度。因此，我们每帧将立方体在每个轴上旋转大约半度。每秒六十帧，这意味着我们的立方体将旋转$60 \times 0.5 = 30 ^{\circ}$每秒，或围绕$X$, $Y$和$Z$轴大约每十二秒一整圈。

#### 添加`cube`到`Loop.updatables`

接下来，在World中，将立方体添加到`Loop.updatables`列表中。

{{< code file="worlds/first-steps/animation-loop/src/World/World.final.js" from="16" to="31" lang="js" linenos="true" hl_lines="26" caption="_**World.js**_: 添加立方体到`Loop.updatables`中" >}}{{< /code >}}

立方体应该立即开始旋转。

## 动画系统中的计时

再看这句话：_**每秒六十帧**，这意味着我们的立方体将旋转$60 \times 0.5 = 30 ^{\circ}$每秒，或围绕$X$, $Y$和$Z$轴大约每十二秒一整圈_。但是，如果我们的应用程序 _没有_ 以每秒60帧的速度运行怎么办？如果它以低于60FPS的速度运行，动画将运行缓慢，而如果它运行得更快，动画将运行得更快。换句话说，我们动画的速度取决于观看它的设备。这并不好。要了解如何解决此问题，我们需要更深入地了解我们所说的 _帧_ 这个词的含义。

### 固定帧和动态帧

我们在本章中讨论的帧类型与构成电视节目或电影的帧类型之间有一个重要的区别。**电影中的帧速率是 _固定_ 的**。电影通常以每秒24帧 (FPS) 的速度拍摄，而电视节目的标准是30FPS，尽管一些较新的节目可能以60FPS的速度拍摄。无论选择何种帧速率，该速率在电影或节目的整个持续时间内都不会改变。

但是，**我们的动画循环不会以固定速率生成帧**。该循环将尝试以硬件定义的屏幕刷新率渲染帧（在场景后面，浏览器使用`.requestAnimationFrame`执行此操作）。在撰写本文时，大多数屏幕都有60Hz的刷新率，但在新屏幕上这个值可以高达240Hz，而在VR中至少会达到90Hz。这意味着，在60Hz屏幕上，**目标帧率**为60FPS，在90Hz 屏幕上，目标帧率为90FPS，以此类推。

但是，我们可能无法成功的快速生成帧。如果运行您的应用程序的设备功能不足以达到目标帧速率，则动画循环将运行得更慢。即使在快速硬件上，您的应用程序也必须与其他应用程序共享计算资源，而且可能并不总是足够的。在每一种情况下，动画循环都会以较低的速率生成帧，并且这个速率可能会因为许多因素从一个时刻到下一个时刻波动。这称为**_可变帧速率_**。

这意味着，由于我们目前已经设置了立方体的动画，它会在旧的慢速设备上旋转得更慢，而在花哨的新240Hz游戏显示器上它将进入超高速状态。$240 = 4\times60$，这意味着立方体将以所需速度的四倍旋转！

为了防止这种情况，**我们需要将动画速度与帧速率解耦**。我们将这样做：**当我们告诉一个对象`.tick`前进一帧时，我们将根据前一帧花费的时间来缩放移动的大小**。这样，随着帧速率的变化，我们将不断调整每个`.tick`的大小，以使动画保持流畅。我们的调整总是会落后一帧，但是这些帧生成得如此之快，以至于用户看不到。这样，动画将在所有设备上以相同的速度运行。

### 测量跨帧时间

这就是`Clock`类的用武之地。我们将用[`Clock.getDelta`](https://threejs.org/docs/#api/en/core/Clock.getDelta)来衡量前一帧花了多长时间。

{{< code lang="js" linenos="false" caption="`Clock.getDelta`方法" >}}
import { Clock } from 'three';

const clock = new Clock();

const delta = clock.getDelta();
{{< /code >}}

**`.getDelta`告诉我们自上次调用`.getDelta`以来已经过去了多少时间**。如果我们在每一帧开始时调用它一次，并且只调用一次，它将告诉我们前一帧花了多长时间。**注意：如果您每帧调用`.getDelta`不止一次，后续调用的测量值将接近于零**。只在一帧开始时调用`.getDelta`一次！

{{% aside %}}

#### $Δ$ (Delta) {#delta}

Delta 是希腊字母，大写$Δ$, 小写$δ$。

$Δ$符号通常用于表示某个数量的变化。在这里，`Clock.getDelta`告诉我们时间的变化率。
{{% /aside %}}

### 创建`clock`

在循环中，在文件顶部创建一个模块作用域的`clock`实例。

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="3" caption="_**Loop.js**_: 创建`clock`" footer="  ..." >}}{{< /code >}}

### 在每帧开始时调用`.getDelta`

接下来，我们将在`Loop.tick`的开头调用`.getDelta`，将结果保存在一个名为`delta`的变量中，然后我们将其传递给每个动画对象的`.tick`方法。

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="27" to="38" skip_lines="31 32 33 34" lang="js" linenos="true" hl_lines="29 32" caption="_**Loop.js**_: 将时间增量传递给动画对象" >}}{{< /code >}}

{{% aside success %}}

### 帧速率永远不会完全稳定

在内联代码编辑器中，我们添加了一条日志语句：

{{< code file="worlds/first-steps/animation-loop/src/World/systems/Loop.final.js" from="31" to="33" lang="js" linenos="true" caption="_**Loop.js**_: 以毫秒为单位记录经过的时间" >}}{{< /code >}}

`delta`以秒为单位，因此我们将其乘以一千以转换为毫秒。这些行被注释掉以避免用数百条日志语句填充控制台，但是如果您删除`//`字符并按F12打开控制台，您将看到一个快速更新的日志列表，告诉您每帧渲染花费了多长时间. 如果您在刷新率为 60Hz 的显示器上查看此页面，它将如下所示：

{{< code lang="bash" linenos="false" caption="记录到控制台的帧时间" >}}
The last frame rendered in $17.40000000083819$ milliseconds
The last frame rendered in $15.710000006947666$ milliseconds
The last frame rendered in $16.574999986914918$ milliseconds
...
{{< /code >}}

即使有一个强大的GPU和一个像这个单一立方体这样简单的场景，我们也不会达到每秒60帧的精度。有些帧渲染得有点快，有些帧渲染得有点慢。这个是正常的。部分原因是，[出于安全原因](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#Reduced_time_precision)，浏览器会在`.getDelta`的结果中增加大约1毫秒的抖动。

{{% /aside %}}

### 通过`delta`来缩放立方体的旋转

通过`delta`按比例缩放运动很容易。我们只需决定在一秒钟内要移动一个对象多少，然后在`objects.tick`方法中将该值乘以`delta`。在`cube.tick`中，我们发现了一个值，该值导致立方体在60FPS时每秒旋转大约30度。

{{< code lang="js" linenos="" linenostart="18" hl_lines="" caption="_**cube.js**_: 未缩放的tick方法" >}}

```js
cube.tick = () => {
  // increase the cube's rotation each frame
  cube.rotation.z += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
};
```

{{< /code >}}

现在，我们将解决这个问题，使立方体在 _任何_ FPS都以每秒30度旋转。首先，我们需要将30度转换为弧度，为此，我们将使用[`MathUtils.degToRad`]({{< relref "/book/first-steps/transformations#the-unit-of-rotation-is-radians" >}} "`MathUtils.degToRad`")方法（如果您需要回忆它是如何工作的，请参阅转换章节）：

{{< code lang="js" linenos="false" caption="将度数转换为弧度" >}}
import { MathUtils } from 'three';

const radiansPerSecond = MathUtils.degToRad(30);
{{< /code >}}

接下来，我们在每一帧将`radiansPerSecond`缩放`delta`。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**cube.js**_: 修改后的tick方法, 现在按比例缩放`delta`" >}}

```js
cube.tick = (delta) => {
  // increase the cube's rotation each frame
  cube.rotation.z += radiansPerSecond * delta;
  cube.rotation.x += radiansPerSecond * delta;
  cube.rotation.y += radiansPerSecond * delta;
};
```

{{< /code >}}

把所有这些放在一起，这是我们最终的 _**cube.js**_ 模块：

{{< code file="worlds/first-steps/animation-loop/src/World/components/cube.final.js" from="1" to="26" lang="js" linenos="true"
hl_lines="3 15 18-23" caption="_**cube.js**_: 最终代码" >}}{{< /code >}}

{{< inlineScene entry="first-steps/animation-loop-duplicate.js" class="small right">}}

现在，立方体将再次围绕每个轴每秒旋转30度，但有一个重要的区别：无论我们在哪里运行动画，无论是在以90FPS运行的VR装备上，还是在十年前的智能手机几乎不能达到10FPS，或者是3000年以后以10亿FPS运行的未来系统。**帧率可能会改变，但动画速度不会**。

通过这一更改，**我们成功地将动画速度与帧速率解耦。**

## 循环或不循环

现在我们已经开始了循环，`.render`被一遍又一遍地调用，创建了一个稳定的帧流，在我们渲染每一帧之前，我们将立方体旋转了一小部分。只要以足够的速度（大约 12FPS或更高）生成帧，并且连续帧之间的差异足够小，我们就会将其视为动画。

动画循环将成为许多应用程序的驱动力。这个循环与将动画逻辑封装在每个对象的`.tick`方法中的想法相结合，是一个强大的工具，我们将在本书中继续探索和构建。稍后，我们将使用循环来驱动比简单的旋转立方体更复杂和有趣的行为，无论是[在我们的代码中创建的](https://threejs.org/examples/webgl_buffergeometry_instancing.html)还是[从外部应用程序加载的](https://threejs.org/examples/webgl_loader_fbx.html)。

<div class="fig-comparison">
  {{< iframe src="https://threejs.org/examples/webgl_buffergeometry_instancing.html" height="500" title="在我们的代码中创建的动画" caption="在我们的代码中创建的动画" >}}
  {{< iframe src="https://threejs.org/examples/webgl_loader_fbx.html" height="500" title="在外部应用程序中创建的动画" caption="在外部应用程序中创建的动画" >}}
</div>

像这样的动画很漂亮。但是，它们是有代价的，如果您在低功率设备上查看它，这对您现在来说可能很明显。当您追求每秒60帧的目标时，您必须努力保持循环快速运行。这是您的应用程序中需要持续警惕、分析和优化的地方。

但并非所有场景都有动画。某些场景仅偶尔更新，例如仅在用户交互期间。一个常见的例子是产品展示应用程序。此类应用程序用于显示3D产品，例如鞋子或奶瓶，用户可以旋转或缩放这些产品以获得更好的外观。在这种类型的场景中，只要用户 _不_ 进行交互，场景将在帧之间保持不变。这是另一个没有动画循环的场景示例。

{{< iframe src="https://threejs.org/examples/webgl_decals.html" height="500" title="没有动画循环并不意味着没有运动！" caption="没有动画循环并不意味着没有运动！" >}}

为这样的应用程序运行循环将是一种浪费。这在移动设备上尤其明显，因为持续的GPU和CPU的循环会耗尽电池电量。因此，您应该只在需要时使用循环。

`World.render`和`World.start`给我们两种生成帧的方法。对于具有恒定动画的应用程序，我们将使用`.start`循环运行，对于偶尔更新的应用程序，我们将在需要新帧时调用`.render`。我们将第二种技术称为**_按需渲染_**。

{{< code lang="js" linenos="false" caption="_**main.js**_: 生成帧的两种方式" >}}
const world = new World();

// produce a single frame (render on demand)
world.render();

// start the loop (produce a stream of frames)
world.start();
{{< /code >}}

按需渲染可能会减少电池使用，但另一方面，使用循环更简单。它无需考虑需要在何时何地绘制帧，您只需生成持续的稳定的帧即可，因此，本书中的大多数示例都将使用循环。但是，这并不是说按需渲染比循环更好。由您决定哪种方法适合您的应用程序。

接下来，我们将看到如何使用纹理使我们的材质更有趣。

## 挑战

{{% aside success %}}

### 简单

1. 玩一玩动画速度。使立方体每百秒旋转一圈，然后每秒旋转一圈。

2. 您可以为任何东西设置动画，而不仅仅是旋转。尝试为网格的其他一些属性设置动画。

{{% /aside %}}

{{% aside %}}

### 中等

1. 给相机添加一个`.tick`方法，然后让它慢慢缩小。尝试以每秒一米左右的速度缩小。

2. 向灯光添加一个`.tick`方法，并对`light.position.x`, `.y`或`.z`参数进行动画处理。

3. 添加一个启动和停止动画循环的`click`事件监听器（或者，如果你想花哨的话，一个按钮）。在 _**main.js**_ 中使用`World.start`和`World.stop`执行此操作。

不要忘记将相机和灯光添加到`updatables`列表中！要缩小，请增加`camera.position.z`。

{{% /aside %}}

{{% aside warning %}}

### 困难

旋转是一个很容易制作动画的属性，因为旋转是循环的。当我们在任何轴上到达$360^\circ$，我们都会回到我们开始的地方。这意味着我们可以无限增加旋转，结果是一个漂亮的动画。如果我们对位置或缩放做同样的事情，被动画的对象将很快从我们的屏幕上消失。但是，我们可以使用[模运算符`%`]({{< relref "/book/appendix/javascript-reference#the-modulo-operator" >}} "模运算符`%`")创建其他属性的循环动画。

1. 使用模运算符为立方体、相机或灯光设置`.position`动画。让相机反复缩小十米。让立方体一遍又一遍地从屏幕的左到右进行动画。

2. 让相机缩小十米，然后反方向再次放大。在屏幕上从左到右为立方体设置动画，然后，当它到达屏幕的右边缘（大致）时，让它反向并移回起点。

{{% /aside %}}
