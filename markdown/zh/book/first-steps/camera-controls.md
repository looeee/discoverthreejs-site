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

控件controls就位后，我们将相机的控制权交给了他们。但是，有时您需要收回控制权以手动定位相机。有两种方法可以解决这个问题：

1. 剪切/跳转到新的摄像机位置
2. 平滑动画到新的相机位置

我们将简要介绍一下您将如何处理这两个问题，但我们不会将代码添加到我们的应用程序中。

#### 剪切到新的摄像机位置

要执行相机剪切，请照常更新相机的变换，然后调用`controls.update`：

{{< code lang="js" linenos="false" caption="使用`OrbitControls`时手动调整相机变换" >}}
// move the camera
camera.position.set(1,2,3);

// and/or rotate the camera
camera.rotation.set(0.5, 0, 0);

// then tell the controls to update
controls.update();
{{< /code >}}

如果您在循环中调用`.update`，则无需手动操作，只需移动相机即可。如果你 _不_ 调用`.update`就移动相机，会发生奇怪的事情，所以要小心！

这里需要注意一件重要的事情：当您移动相机时，`controls.target`不会移动。如果您没有移动它，它将保持在场景的中心。当您将相机移动到新位置但保持目标不变时，相机不仅会移动，还会旋转，以便继续指向目标。这意味着在使用控件时，相机移动可能无法按预期工作。通常，您需要同时移动相机和目标以获得所需的结果。

#### 平滑过渡到新的相机位置

如果您想将相机平滑地动画移动到一个新位置，您可能需要同时转换相机和目标，而最好的做这件事的地方就是`controls.tick`方法中。但是，您需要在动画期间禁用控件，否则，如果用户在动画完成之前尝试移动相机，您最终会遇到与动画冲突的控件，通常会导致灾难性的后果。

{{< code lang="js" linenos="false" hl_lines="" caption="为相机或目标设置动画时禁用控件" >}}

```js
controls.enabled = false;
```

{{< /code >}}

### 保存和恢复视图状态

您可以使用[`.saveState`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.saveState)保存当前视图，然后使用[`.reset`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.reset)恢复它：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 保存和恢复状态" >}}
controls.saveState();

// sometime later:
controls.reset();
{{< /code >}}

如果我们在没有先调用`.saveState`的情况下调用`.reset`，相机将跳回到我们创建控件时的位置。

### 销毁控件Controls

如果不再需要控件，可以使用[.dispose](https://threejs.org/docs/#examples/en/controls/OrbitControls.dispose)清理它们，这将从画布中删除控件创建的所有事件侦听器。

{{< code lang="js" linenos="false" caption="_**controls.js**_: 从画布中删除所有事件侦听" >}}
controls.dispose();
{{< /code >}}

## 使用`OrbitControls`按需渲染

几章前我们设置了[动画循环]({{< relref "/book/first-steps/animation-loop" >}} "动画循环")，这是一个强大的工具，可以让我们轻松创建漂亮的动画。另一方面，正如我们在那几章末尾所讨论的那样，[循环确实有一些缺点]({{< relref "/book/first-steps/animation-loop#to-loop-or-not-to-loop" >}} "循环确实有一些缺点")，例如增加移动设备上的电池耗电量。因此，有时我们会选择**按需**渲染帧，而不是使用循环生成恒定的帧流。

现在我们的应用有了轨道控件，每当用户与你的场景交互时，控件都会将相机移动到一个新的位置，当这种情况发生时你必须绘制一个新的帧，否则你将无法看到相机已移动。如果您使用的是动画循环，那不是问题。但是，如果我们是按需渲染，我们将不得不想出其他办法来解决这个问题。

幸运的是，`OrbitControls`提供了一种在相机移动时生成新帧的简单方法。控件有一个自定义事件`change`，我们可以使用[`addEventListener`]({{< relref "/book/appendix/dom-api-reference#listening-for-events" >}} "`addEventListener`")来监听。每当用户交互导致控件移动相机时，都会触发此事件。

要使用轨道控件按需渲染，您必须在此事件触发时渲染一帧：

{{< code lang="js" linenos="false" caption="使用`OrbitControls`按需渲染" >}}
controls.addEventListener('change', () => {
renderer.render(scene, camera);
});
{{< /code >}}

要在 _**World.js**_ 中进行设置，您将使用`this.render`：

{{< code lang="js" linenos="false" caption="_**World.js**_: 使用`OrbitControls`按需渲染" >}}
controls.addEventListener('change', () => {
this.render();
});
{{< /code >}}

接下来，在 _**main.js**_ 中，确保我们不再启动循环。相反，渲染初始帧：

{{< code lang="js" linenos="" linenostart="10" hl_lines="" caption="_**main.js**_: 渲染单个帧而不是开始循环" >}}

```js
// render the inital frame
world.render();
```

{{< /code >}}

如果您在应用程序中进行这些更改，您会发现这会导致一个小问题。当我们在 _**main.js**_ 中渲染初始帧时，纹理还没有加载，所以立方体看起来是黑色的。如果我们运行循环，则在纹理加载后，这一帧几乎会立即被新帧替换，因此只有在几毫秒内立方体是黑色的甚至可能都不会引起注意。然而，通过按需渲染，我们现在只在用户与场景交互和移动相机时生成新帧。一旦您移动控件，果然，将创建一个新帧并显示纹理。

{{% note %}}
TODO-LOW: add inline scene demonstrating the above
{{% /note %}}

因此，您还需要在纹理加载后生成一个新帧。我们不会在这里介绍如何做到这一点，但希望它能强调为什么按需渲染比使用循环更棘手。您必须考虑需要新帧的所有情况（例如，不要忘记您还需要在[resize时渲染一帧]({{< relref "/book/first-steps/responsive-design#create-an-onresize-hook" >}} "resize时渲染一帧")）。

## `OrbitControls`配置

控件有很多选项，可让我们根据需要进行调整。其中大部分[在docs中有很好的解释](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls)，所以我们不会在这里详尽地介绍它们。以下是一些最重要的。

### 启用或禁用控件

我们可以完全[启用或禁用控件](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.enabled)：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 启用或禁用" >}}
controls.enabled = false;
{{< /code >}}

或者，我们可以单独禁用三种控制模式中的任何一种：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 单独禁用模式" >}}
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
{{< /code >}}

您可以选择监听按键事件并使用箭头键平移相机：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 启用箭头键" >}}
controls.listenToKeyEvents(window);
{{< /code >}}

### 自动旋转

[`.autoRotate`](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls.autoRotate)将使相机自动围绕`.target`旋转，然后[`.autoRotateSpeed`](https://threejs.org/docs/#examples/en/controls/OrbitControls.autoRotateSpeed)控制速度：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 启用自动旋转" >}}
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
{{< /code >}}

与`.enableDamping`一样，您必须在每一帧都调用`controls.update`才能使其正常工作。请注意，如果控件被禁用，`.autoRotate`仍然可以工作。

### 限制缩放

我们可以限制控件放大或缩小的距离：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 限制缩放" >}}
controls.minDistance = 5;
controls.maxDistance = 20;
{{< /code >}}

确保`minDistance`不小于[相机的近剪裁平面](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.near)且`maxDistance`不大于[相机的远剪裁平面](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.far)。此外，`minDistance`必须小于`maxDistance`。

### 限制旋转

我们可以限制控件的水平旋转（方位角）：

{{< code lang="js" linenos="false" caption="_**controls.js**_: 限制水平旋转" >}}
controls.minAzimuthAngle = - Infinity; // default
controls.maxAzimuthAngle = Infinity; // default
{{< /code >}}

…和垂直（极角）

{{< code lang="js" linenos="false" caption="_**controls.js**_: 限制垂直旋转" >}}
controls.minPolarAngle = 0; // default
controls.maxPolarAngle = Math.PI; // default
{{< /code >}}

请记住，[旋转是使用弧度指定的]({{< relref "/book/first-steps/transformations#the-unit-of-rotation-is-radians" >}} "旋转是使用弧度指定的")，而不是度数，并且$\pi$弧度等于$180^{\circ}$。

## 一个明显的问题！

一旦我们使用我们花哨的新轨道控件旋转相机，我们就会看到一个明显的问题。相机旋转，但光线是固定的，只从一个方向照射。立方体的背面完全没有光线！

在现实世界中，光线会从每个表面反弹并反射掉，因此立方体的后部会昏暗。在这个简单的场景中，除了立方体之外什么都没有，所以光线不会反弹。但是，即使有，实时执行这些计算对于我们来说也太昂贵了。在下一章中，我们将研究一种用于克服这个问题的技术，即**环境光**。

## 挑战

{{% aside success %}}

### 简单

1. 尝试调整控件的[最小和最大缩放级别](#limiting-zoom)。如果你让这两个值相等会发生什么？或使`minDistance`大于`maxDistance`？

2. 启用[自动旋转](#auto-rotate)，然后尝试调整旋转速度。

3. 尝试[禁用三种控件模式中的每一种](#enable-or-disable-the-controls)，一次禁用一种，然后观察结果。

4. [调整阻尼速度](#enable-damping-for-added-realism) (`.dampingFactor`)以了解阻尼的工作原理。大于0和小于1的值效果最好。

{{% /aside %}}

{{% aside %}}

### 中等

1. 尝试调整控件的[水平和垂直旋转限制](#limiting-rotation)。请记住，如果您以度为单位，则必须转换为弧度。如果您需要提醒它是如何工作的，请查看 _**cube.js**_。

2. 向页面添加一个按钮（或单击事件侦听器），并且每当您单击该按钮时，将相机和控件的目标移动到一个新的随机位置。尝试限制移动，使立方体始终位于屏幕上的某个位置。

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 设置在使用控件时[按需渲染](#rendering-on-demand-with-orbitcontrols)，包括在纹理加载后以及在调整场景大小时生成新帧。

2. 你能在几秒钟内让相机和控件的目标动画到一个新的位置吗？也许在页面上添加一个按钮，当你点击它时，播放动画。看看当您只为相机或目标设置动画时会发生什么，或者当您在制作动画时不禁用控件时会发生什么。设置此动画的最佳位置是在控件controls模块中。

{{% /aside %}}
