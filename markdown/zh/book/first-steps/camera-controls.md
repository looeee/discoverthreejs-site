---
title: "使用相机控制插件扩展three.js"
description: "在这里，我们使用名为OrbitControls的相机控制插件扩展了three.js核心。这个插件允许我们旋转/平移/缩放到相机以从任何角度查看我们的场景。"
date: 2018-04-02
weight: 109
chapter: "1.9"
available: true
showIDE: true
IDEFiles:
  [
    "assets/textures/uv-test-bw.png",
    "assets/textures/uv-test-col.png",
    "worlds/first-steps/camera-controls/src/World/components/camera.js",
    "worlds/first-steps/camera-controls/src/World/components/cube.js",
    "worlds/first-steps/camera-controls/src/World/components/lights.js",
    "worlds/first-steps/camera-controls/src/World/components/scene.js",
    "worlds/first-steps/camera-controls/src/World/systems/renderer.js",
    "worlds/first-steps/camera-controls/src/World/systems/Resizer.js",
    "worlds/first-steps/camera-controls/src/World/systems/controls.start.js",
    "worlds/first-steps/camera-controls/src/World/systems/controls.final.js",
    "worlds/first-steps/camera-controls/src/World/systems/Loop.js",
    "worlds/first-steps/camera-controls/src/World/World.start.js",
    "worlds/first-steps/camera-controls/src/World/World.final.js",
    "worlds/first-steps/camera-controls/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/camera-controls/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["assets", "components", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/camera-controls/"
IDEActiveDocument: "src/World/systems/controls.js"
---

# 使用相机控制插件扩展three.js

three.js核心是一个功能强大、轻量级且专注的**渲染框架**，具有故意限制的功能。它拥有创建和渲染物理上正确的场景所需的一切，但是，它不具备创建游戏或产品配置器所需的一切。即使在构建相对简单的应用程序时，您也会经常发现自己需要的功能不在核心库中。发生这种情况时，在您自己编写任何代码之前，请检查是否有可用的插件。three.js仓库包含数百个扩展，位于[_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm)文件夹中。对于那些使用包管理器的人，这些也包含在[NPM 包](https://www.npmjs.com/package/three)中。

还有大量的插件散布在网络上。但是，这些有时维护不善，可能无法与最新的three.js版本一起使用，因此在本书中，我们将限制自己使用来自仓库的官方插件。在那里，我们会找到各种插件，其中大部分都在其中某一个[示例中](https://threejs.org/examples/)展示。这些插件添加了各种功能，例如镜面：

{{< iframe src="https://threejs.org/examples/webgl_mirror.html" title="three.js节点材质镜像示例" height="500" >}}

或者，Lego LDraw格式的加载器怎么样：

{{< iframe src="https://threejs.org/examples/webgl_loader_ldraw.html" height="500" title="three.js LDraw格式示例" >}}

这里还有一些：

- [众多后处理效果之一](https://threejs.org/examples/?q=postprocessing#webgl_postprocessing_glitch)
- [Autodesk FBX格式的加载器](https://threejs.org/examples/?q=loader#webgl_loader_fbx)
- [glTF格式的导出器](https://threejs.org/examples/?q=exporter#misc_exporter_gltf)
- [物理上准确的海洋和天空](https://threejs.org/examples/?q=ocean#webgl_shaders_ocean)

每个扩展都存储在 _**examples/jsm**_ 中的一个单独模块中，要使用它们，我们只需将它们导入我们的应用程序，就像任何其他three.js类一样。

## 我们的第一个插件：`OrbitControls`

最受欢迎的扩展之一是[`OrbitControls`](https://threejs.org/docs/#examples/en/controls/OrbitControls)相机控制插件，它允许您使用触摸、鼠标或键盘来环绕、平移和缩放相机。通过这些控件，我们可以从各个角度查看场景，放大以检查微小细节，或缩小以鸟瞰概览。轨道控制允许我们以三种方式控制相机：

1. **使用鼠标左键或单指轻扫，围绕固定点旋转。**
2. **使用鼠标右键、箭头键或两指滑动来平移相机。**
3. **使用滚轮或捏合手势缩放相机。**

您可以在three.js仓库中的 _**examples/jsm/controls/**_ 文件夹中的名为 _**[OrbitControls.js](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js)**_ 的文件中找到包含`OrbitControls`的模块。还有一个[官方示例展示`OrbitControls`](https://threejs.org/examples/?q=controls#misc_controls_orbit)。 要快速参考所有控件的设置和功能，请转到[`OrbitControls`文档页面](https://threejs.org/docs/#examples/en/controls/OrbitControls)。

### 导入插件

由于插件是three.js仓库的一部分并包含在NPM包中，因此导入它们的工作方式与从[three.js核心导入类]({{< relref "/book/first-steps/first-scene#import-classes-from-threejs" >}} "three.js核心导入类")的方式大致相同，只是每个插件都在一个单独的模块中。请参阅[0.5：如何在您的项目中包含three.js]({{< relref "/book/introduction/get-threejs" >}} "0.5：如何在您的项目中包含three.js")以提醒您如何在您的应用程序中包含three.js文件，或转到[A.4：JavaScript模块]({{< relref "/book/appendix/javascript-modules" >}} "A.4：JavaScript模块")以更深入地探索JavaScript模块的工作原理。

在编辑器中，我们将 _**OrbitControls.js**_ 文件放在repo的等效目录中，在 _**vendor/**_ 下。继续并立即找到该文件。由于编辑器使用NPM模式导入，我们可以像这样从代码中的任何位置导入`OrbitControls`，如下所示：

{{< code lang="js" linenos="false" caption="使用NPM模式导入来导入`OrbitControls`扩展" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
{{< /code >}}

同样的，如果您在本地开发而不使用捆绑程序，则必须更改导入路径。例如，您可以改为从skypack.dev导入。

{{< code lang="js" linenos="false" caption="使用相对导入导入`OrbitControls`扩展" >}}
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js?module';
{{< /code >}}

> 重要提示：确保从 _**examples/jsm/**_ 导入插件，而不是从 _**examples/js/**_ 导入旧插件！

### _**controls.js**_ 模块

像往常一样，我们将在我们的应用程序中创建一个新模块来处理设置控件。由于控件在相机上运行，​​因此它们将进入[系统分类]({{< relref "/book/first-steps/world-app#systems-and-components" >}} "系统分类")。打开或创建模块 _**systems/controls.js**_ 来处理设置相机控件。这个新模块与我们大多数其他模块具有相同的结构。首先导入`OrbitControls`类，然后添加`createControls`函数，最后导出函数：

{{< code lang="js" linenos="true" caption="_**systems/controls.js**_: 初始化设置" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createControls() {}

export { createControls };
{{< /code >}}

回到World中，将新函数添加到导入列表中：

{{< code from="1" to="9" file="worlds/first-steps/camera-controls/src/World/World.final.js" lang="js" linenos="true" hl_lines="6" caption="_**World.js**_: 导入controls模块" >}}{{< /code >}}

接下来，调用函数并将结果存储在名为`controls`的变量中。当你在这里时，注释掉添加`cube`到`updatables`数组中的行。这将阻止立方体旋转并使控件的效果更容易看到：

{{< code lang="js" linenos="true" linenostart="17" hl_lines="22 27 28" caption="_**World.js**_: 停止立方体的动画" >}}

```js
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    const controls = createControls();

    const cube = createCube();
    const light = createLights();

    // disabled mesh rotation
    // updatables.push(cube);

    scene.add(cube, light);

    this.canvas = renderer.domElement;
  }
```

{{< /code >}}

### 初始化控件

如果您查看[`OrbitControls`文档页面](https://threejs.org/docs/#examples/en/controls/OrbitControls)，您会看到构造函数有两个参数：`Camera`和[`HTMLDOMElement`](https://developer.mozilla.org/en-US/docs/Web/API/Element)。我们将使用相机作为第一个参数，使用存储在`renderer.domElement`中的画布作为第二个参数。

在内部，`OrbitControls`使用`addEventListener`监听用户输入。控件将侦听诸如`click`、`wheel`、`touchmove`和`keydown`等事件，并使用这些事件来移动相机。我们之前在设置自动调整大小时使用此方法来[监听`resize`事件]({{< relref "/book/first-steps/responsive-design#listen-for-resize-events-on-the-browser-window" >}} "监听`resize`事件")。在那里，我们在整个`window`上监听`resize`事件。而在这里，控件将监听我们作为第二个参数传入的元素上的用户输入。页面的其余部分将不受影响。换句话说，在我们传入画布后，当鼠标/触摸在画布上时控件将起作用，但页面的其余部分将继续正常工作而不受影响。

将相机和画布传递给`createControls`函数，然后创建控件controls：

{{< code lang="js" linenos="true" linenostart="3" caption="_**controls.js**_: 创建控件controls" >}}
function createControls(camera, canvas) {
const controls = new OrbitControls(camera, canvas);

return controls;
}
{{< /code >}}

回到world模块，传入`camera`和`renderer.domElement`：

{{< code lang="js" linenos="" linenostart="18" hl_lines="24" caption="_**World.js**_: 初始化控件controls" >}}

```js
constructor(container) {
  camera = createCamera();
  scene = createScene();
  renderer = createRenderer();
  container.append(renderer.domElement);

  const controls = createControls(camera, renderer.domElement);

  // ...
}
```

{{< /code >}}

有了这个，控件controls应该开始工作。带他们去兜风吧！

您会立即注意到[立方体没有从背面照亮](#a-glaring-problem)。我们将在下一章解释为什么以及如何解决这个问题。

{{% note %}}
TODO-LOW: add a "using the controls section" that explains how the controls work
{{% /note %}}

## 使用控件Controls

### 手动设置目标

默认情况下，控件围绕场景中心旋转，即点$(0,0,0)$。 这存储在`controls.target`属性中，即`Vector3`。我们可以将这个目标移动到一个新的位置：

{{< code lang="js" linenos="false" caption="设置控件的目标" >}}
controls.target.set(1,2,3);
{{< /code >}}

我们还可以通过复制对象的位置来将控件指向对象。

{{< code lang="js" linenos="false" caption="_**World.js**_: 指向对象的位置" >}}
controls.target.copy(cube.position);
{{< /code >}}

{{% note %}}
TODO-LOW: what is mobile control for pan?
{{% /note %}}

每当您平移控件（使用鼠标右键）时，目标也会平移。如果需要固定目标，可以使用`controls.enablePan = false`禁用平移。

### 启用阻尼以增加真实感

一旦用户停止与场景交互，相机就会突然停止。现实世界中的物体是有惯性的，永远不会像这样突然停止，所以我们可以通过启用[阻尼](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.enableDamping)来使控制感觉更真实。

{{< code lang="js" linenos="false" caption="_**controls.js**_: 启用阻尼" >}}
controls.enableDamping = true;
{{< /code >}}

启用阻尼后，控件将在几帧后减速停止，这给它们一种重量感。您可以调整[`.dampingFactor`](https://threejs.org/docs/#examples/en/controls/OrbitControls.dampingFactor)以控制相机停止的速度。但是，为了使阻尼起作用，我们必须在动画循环中的每一帧都调用`controls.update`。如果我们是[按需渲染帧](#rendering-on-demand-with-orbitcontrols)而不是使用循环，我们就不能使用阻尼。

### 更新动画循环中的控件

每当我们需要在循环中更新一个对象时，我们将使用我们在创建[立方体动画]({{< relref "/book/first-steps/animation-loop#create-the-animation" >}} "立方体动画")时设计的技术。换句话说，我们将给控件一个`.tick`方法，然后将它们添加到`loop.updatables`数组中。首先是`.tick`方法：

{{< code file="worlds/first-steps/camera-controls/src/World/systems/controls.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="12" caption="_**controls.js**_: 添加controls.tick" >}}{{< /code >}}

在这里，`.tick`只需调用`controls.update`。接下来，将控件添加到`updatables`数组中：

{{< code file="worlds/first-steps/camera-controls/src/World/World.final.js" from="18" to="37" lang="js" linenos="true" hl_lines="29" caption="_**World.js**_: 将控件添加到updatables数组" >}}{{< /code >}}

现在，`controls.tick`将在[更新循环]({{< relref "/book/first-steps/animation-loop#the-update-loop" >}} "更新循环")中每帧调用一次，并且阻尼将起作用。测试一下。你能看到区别么？

### 在使用`OrbitControls`时让相机工作

With the controls in place, we have relinquished control of the camera to them. However, sometimes you need to take back control to manually position the camera. There are two ways to go about this:

1. Cut/jump to a new camera position
2. Smoothly animate to a new camera position

We'll take a brief look at how you would go about both of these, but we won't add the code to our app.

#### Cut to a New Camera Position

To perform a camera cut, update the camera's transform as usual, and then call `controls.update`:

{{< code lang="js" linenos="false" caption="Manually adjust the camera transform while using `OrbitControls`" >}}
// move the camera
camera.position.set(1,2,3);

// and/or rotate the camera
camera.rotation.set(0.5, 0, 0);

// then tell the controls to update
controls.update();
{{< /code >}}

If you're calling `.update` in the loop, you don't need to do it manually and you can simply move the camera. If you move the camera _without_ calling `.update`, weird things will happen, so watch out!

One important thing to note here: when you move the camera, the `controls.target` does not move. If you have not moved it, it will remain at the center of the scene. When you move the camera to a new position but leave the target unchanged, the camera will not only move but also _rotate_ so that it continues to point at the target. This means that camera movements may not work as you expect when using the controls. Often, you will need to move the camera and the target at the same time to get your desired outcome.

#### Smoothly Transition to a New Camera Position

If you want to smoothly animate the camera to a new position, you will probably need to transition the camera and the target at the same time, and the best place to do this is in the `controls.tick` method. However, you will need to disable the controls for the duration of the animation, otherwise, if the user attempts to move the camera before the animation has completed, you'll end up with the controls fighting against your animation, often with disastrous results.

{{< code lang="js" linenos="false" hl_lines="" caption="Disable the controls while animating the camera or target" >}}

```js
controls.enabled = false;
```

{{< /code >}}

### Save and Restore a View State

You can save the current view using [`.saveState`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.saveState), and later restore it using [`.reset`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.reset):

{{< code lang="js" linenos="false" caption="_**controls.js**_: save and restore state" >}}
controls.saveState();

// sometime later:
controls.reset();
{{< /code >}}

If we call `.reset` without first calling `.saveState`, the camera will jump back to the position it was in when we created the controls.

### Disposing of the Controls

If you no longer need the controls, you can clean them up using [.dispose](https://threejs.org/docs/#examples/en/controls/OrbitControls.dispose), which will remove all event listeners created by the controls from the canvas.

{{< code lang="js" linenos="false" caption="_**controls.js**_: remove all event listeners from the canvas" >}}
controls.dispose();
{{< /code >}}

## Rendering on Demand with `OrbitControls`

A couple of chapters ago we set up the [animation loop]({{< relref "/book/first-steps/animation-loop" >}} "animation loop"), a powerful tool that allows us to create beautiful animations with ease. On the other hand, as we discussed at the end of that chapter, [the loop does have some downsides]({{< relref "/book/first-steps/animation-loop#to-loop-or-not-to-loop" >}} "the loop does have some downsides"), such as increased battery use on mobile devices. As a result, sometime we'll choose to render frames **on demand** instead of generating a constant stream of frames using the loop.

Now that our app has orbit controls, whenever the user interacts with your scene, the controls will move the camera to a new position, and when this occurs you must draw a new frame, otherwise, you won't be able to see that the camera has moved. If you're using the animation loop, that's not a problem. However, if we're rendering on demand we'll have to figure something else out.

Fortunately, `OrbitControls` provides an easy way to generate new frames whenever the camera moves. The controls have a custom event called `change` which we can listen for using [`addEventListener`]({{< relref "/book/appendix/dom-api-reference#listening-for-events" >}} "`addEventListener`"). This event will fire whenever a user interaction causes the controls to move the camera.

To use rendering on demand with the orbit control, you must render a frame whenever this event fires:

{{< code lang="js" linenos="false" caption="Rendering on demand with `OrbitControls`" >}}
controls.addEventListener('change', () => {
renderer.render(scene, camera);
});
{{< /code >}}

To set this up inside _**World.js**_, you'll use `this.render`:

{{< code lang="js" linenos="false" caption="_**World.js**_: Rendering on demand with `OrbitControls`" >}}
controls.addEventListener('change', () => {
this.render();
});
{{< /code >}}

Next, over in _**main.js**_, make sure we're no longer starting the loop. Instead, render the initial frame:

{{< code lang="js" linenos="" linenostart="10" hl_lines="" caption="_**main.js**_: render a single frame instead of starting the loop" >}}

```js
// render the inital frame
world.render();
```

{{< /code >}}

If you make these changes in your app, you'll see that this results in a slight problem. When we render the initial frame in _**main.js**_, the texture has not yet loaded, so the cube will look black. If we were running the loop, this frame would almost instantly be replaced with a new one after the texture loads, so it might not even be noticeable that the cube was black for a few milliseconds. However, with rendering on demand, we are now only generating new frames when the user interacts with the scene and moves the camera. As soon as you move the controls, sure enough, a new frame will be created and the texture will show up.

{{% note %}}
TODO-LOW: add inline scene demonstrating the above
{{% /note %}}

As a result, you also need to generate a new frame after the texture has loaded. We won't cover how to do that here, but hopefully, it highlights why rendering on demand is trickier than using the loop. You have to consider all situations where you need a new frame (for example, don't forget that you'll also need to [render a frame on resize]({{< relref "/book/first-steps/responsive-design#create-an-onresize-hook" >}} "render a frame on resize")).

## `OrbitControls` Configuration

The controls have lots of options that allow us to adjust them to our needs. Most of these are [well explained in the docs](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls), so we won't cover them exhaustively here. The following are some of the most important.

### Enable or Disable the Controls

We can [enable or disable the controls](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.enabled) entirely:

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable or disable" >}}
controls.enabled = false;
{{< /code >}}

Or, we can disable any of the three modes of control individually:

{{< code lang="js" linenos="false" caption="_**controls.js**_: disable individual modes" >}}
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
{{< /code >}}

You can optionally listen for key events and use the arrow keys to pan the camera:

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable arrow keys" >}}
controls.listenToKeyEvents(window);
{{< /code >}}

### Auto Rotate

[`.autoRotate`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.autoRotate) will make the camera automatically rotate around the `.target`, and [`.autoRotateSpeed`](https://threejs.org/docs/#examples/en/controls/OrbitControls.autoRotateSpeed) controls how fast:

{{< code lang="js" linenos="false" caption="_**controls.js**_: enable auto-rotation" >}}
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
{{< /code >}}

As with `.enableDamping`, you must call `controls.update` every frame for this to work. Note that `.autoRotate` will still work if the controls are disabled.

### Limiting Zoom

We can limit how far the controls will zoom in or out:

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit zoom" >}}
controls.minDistance = 5;
controls.maxDistance = 20;
{{< /code >}}

Make sure `minDistance` is not smaller than [the camera's near clipping plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.near) and `maxDistance` is not greater than [the camera's far clipping plane](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.far). Also, `minDistance` must be smaller than `maxDistance`.

### Limiting Rotation

We can limit the control's rotation, both horizontally (azimuth angle):

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit horizontal rotation" >}}
controls.minAzimuthAngle = - Infinity; // default
controls.maxAzimuthAngle = Infinity; // default
{{< /code >}}

... and vertically (polar angle)

{{< code lang="js" linenos="false" caption="_**controls.js**_: limit vertical rotation" >}}
controls.minPolarAngle = 0; // default
controls.maxPolarAngle = Math.PI; // default
{{< /code >}}

Remember, [rotations are specified using radians]({{< relref "/book/first-steps/transformations#the-unit-of-rotation-is-radians" >}} "rotations are specified using radians"), not degrees, and $\pi$ radians is equal to $180^{\circ}$.

## A Glaring Problem!

As soon as we rotate the camera using our fancy new orbit controls, we'll see a glaring problem. The camera rotates, but the light is fixed and shines only from one direction. The rear faces of the cube receive no light at all!

In the real world, light bounces and reflects off every surface, so the rear of the cube would be dimly lit. There's nothing in this simple scene aside from the cube, so there's nothing for the light to bounce off. But, even if there was, performing these calculations is much too expensive for us to do in real-time. In the next chapter, we will look at a technique for overcoming this problem known as **ambient lighting**.

## Challenges

{{% aside success %}}

### Easy

1. Try adjusting the control's [minimum and maximum zoom levels](#limiting-zoom). What happens if you make these two values equal? Or make `minDistance` greater than `maxDistance`?

2. Enable [auto-rotation](#auto-rotate) and then try adjusting the rotation speed.

3. Try [disabling each of the three modes of control](#enable-or-disable-the-controls), one at a time, and observe the results.

4. [Adjust the damping speed](#enable-damping-for-added-realism) (`.dampingFactor`) to get a feel for how damping works. Values greater than 0 and less than 1 work best.

{{% /aside %}}

{{% aside %}}

### Medium

1. Try adjusting the control's [horizontal and vertical rotation limits](#limiting-rotation). Remember, if you are working in degrees you must convert to radians. Look inside _**cube.js**_ if you need a reminder of how that works.

2. Add a button (or a click event listener) to the page, and whenever you click the button, move the camera and control's target to a new, random position. Try and constrain the movement so that the cube is always still somewhere on the screen.

{{% /aside %}}

{{% aside warning %}}

### Hard

1. Set up [rendering on demand](#rendering-on-demand-with-orbitcontrols) while using the controls, including generating a new frame after the texture has loaded, and whenever the scene is resized.

2. Can you make the camera and the control's target animate to a new position over a few seconds? Maybe add a button to the page, and when you click it, play the animation. See what happens when you animate just the camera, or just the target, or what happens when you don't disable the controls while animating. The best place to set up this animation is in the controls module.

{{% /aside %}}
