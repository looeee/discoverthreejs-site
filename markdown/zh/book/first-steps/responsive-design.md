---
title: "使我们的场景具有响应性（以及处理锯齿）"
description: "在本章中，我们将响应式设计引入到我们的three.js应用程序中，确保我们的场景能够平滑地调整大小以适应任何浏览器窗口。 我们还打开了抗锯齿，大大提高了最终渲染的质量。"
date: 2018-04-02
weight: 106
chapter: "1.6"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/responsive-design/src/World/components/camera.js",
    "worlds/first-steps/responsive-design/src/World/components/cube.js",
    "worlds/first-steps/responsive-design/src/World/components/lights.js",
    "worlds/first-steps/responsive-design/src/World/components/scene.js",
    "worlds/first-steps/responsive-design/src/World/systems/renderer.start.js",
    "worlds/first-steps/responsive-design/src/World/systems/renderer.final.js",
    "worlds/first-steps/responsive-design/src/World/systems/Resizer.start.js",
    "worlds/first-steps/responsive-design/src/World/systems/Resizer.final.js",
    "worlds/first-steps/responsive-design/src/World/World.start.js",
    "worlds/first-steps/responsive-design/src/World/World.final.js",
    "worlds/first-steps/responsive-design/src/main. js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/responsive-design/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["components", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/responsive-design/"
IDEActiveDocument: "src/World/systems/Resizer.js"
---

# 使我们的场景具有响应性（以及处理Jaggies）

欢迎回来！上一章很长，充满了数学和计算机图形学理论。在这里，我们将放慢速度，看看我们应用程序的当前状态。

由于我们在几章前创建了[World应用程序]({{< relref "/book/first-steps/world-app" >}} "World应用程序")，因此我们的代码结构良好，可以在接下来的章节中添加功能时进行扩展。接下来，我们切换到[物理上正确的照明和渲染]({{< relref "/book/first-steps/physically-based-rendering" >}} "物理上正确的照明和渲染")，并解释了我们将如何（几乎总是）使用单位米来构建我们的场景。我们的大脑习惯于欣赏物理上正确的照明和颜色，所以当我们以这种方式设置场景时，我们已经完成了很多让它们看起来很棒的艰苦工作。这甚至适用于具有卡通或抽象外观的场景。

在上一章中，我们探讨了用于在3D空间中移动对象的坐标系和称为变换的数学运算。在接下来的几章中，我们将使用到目前为止所学的一切，并开始创建比单个立方体更有趣的场景。

但首先，仔细看看立方体：

{{< figure src="first-steps/cube-medium.png" alt="我们不起眼的立方体" class="left small noborder" lightbox="false" >}}

Closer...

{{< figure src="first-steps/cube-medium.png" alt="我们不起眼的立方体更近了" class="large noborder" lightbox="false" >}}

更近了……

{{% note %}}
TODO-DIAGRAM: take all screenshots at same zoom level for identical aliasing
{{% /note %}}

{{< figure src="first-steps/cube-closeup-text.png" alt="直到你能看到它的眼白！（译者：指离得非常近的意思，都能看到眼白了）" class="noborder" lightbox="false" >}}

仔细观察立方体的边缘。你能看出它们不是笔直的，而是看起来参差不齐和不干净的吗？从技术上讲，这称为**aliasing**，但非正式地我们将它们称为锯齿。额…

还有一个问题。尝试在编辑器中调整预览窗口的大小，您会发现场景无法适应新的大小（预览可能刷新得太快而无法轻易看到，在这种情况下，请尝试使用{{< icon "solid/external-link-alt" >}}按钮）。**在网页设计语言中，我们的场景不是 _响​​应式_ 的**。在本章中，我们将解决这两个问题。

## 抗锯齿 {#antialiasing}

{{< figure src="first-steps/antialias.svg" alt="抗锯齿打开和关闭状态" class="" lightbox="false" >}}

事实证明，除非直线完全水平或垂直，否则使用方形像素绘制直线是很困难的。我们将使用一种称为**抗锯齿**(**AA**) 的技术来解决这个问题。

### 启用抗锯齿

我们可以通过将一个新参数传递给`WebGLRenderer`构造函数来打开抗锯齿。与[`MeshStandardMaterial`]({{< relref "/book/first-steps/physically-based-rendering#change-the-material-s-color" >}} "`MeshStandardMaterial`")一样，`WebGLRenderer`构造函数采用带有命名参数的规范对象。在这里，我们将`antialias`参数设置为`true`：

{{< code file="worlds/first-steps/responsive-design/src/World/systems/renderer.final.js" from="3" to="9" lang="js" linenos="true" hl_lines="4" caption="_**renderer.js**_: 启用抗锯齿" >}}{{< /code >}}

请注意，**一旦创建了渲染器，就无法更改此设置**。要更改它，您需要创建一个全新的渲染器。不过，这几乎不是问题，因为您会希望在大多数场景中都使用它。

{{% note %}}
TODO-DIAGRAM: add comparison of cube with and without AA
{{% /note %}}

### 多重采样抗锯齿 (MSAA)

**抗锯齿是使用内置的WebGL方法执行的，即[多重采样抗锯齿](https://en.wikipedia.org/wiki/Multisample_anti-aliasing) (MSAA)**。根据您的浏览器和显卡，这可能会不可用或被禁用，尽管在现代硬件上这不太可能。如果您的应用最终在没有MSAA的设备上运行，此设置将被忽略，但您的场景不会受到影响。

MSAA不是一个完美的解决方案，即使启用了AA，也会有场景仍然显示锯齿。特别是具有许多细长直线（如铁丝网或电话线）的场景很难消除锯齿。如果可能，请避免创建此类场景。另一方面，有些场景在没有AA的情况下看起来也还不错，在这种情况下，您可能会选择将其关闭。在笔记本电脑强大的GPU上，您不太可能注意到性能上的任何差异。但是，移动设备是另一回事，您可以通过禁用AA获得​​一些宝贵的帧/每秒。

其他抗锯齿技术（如SMAA和FXAA）可用作后处理通道，我们将在本书后面看到。但是，这些通道是在CPU上执行的，而MSAA是在GPU上完成的（对于大多数设备），因此如果再次使用其他技术，您可能会看到性能下降，尤其是在移动设备上。

{{% note %}}
TODO-LINK: add link to FXAA/SMAA
{{% /note %}}

## 无缝处理浏览器窗口大小变化 {#seamless-resize}

目前，我们的应用程序无法处理像旋转手机或调整浏览器大小这样简单的用户操作。**我们需要以一种对我们的用户不可见的自动方式来优雅地处理调整窗口大小**，并且这仅需要我们付出最少的努力。与抗锯齿不同，没有神奇的设置可以解决这个问题。但是，我们已经有一个`Resizer`类，所以在这里，我们将扩展它以在窗口改变大小时重置大小。毕竟，这就是为什么我们先前将这个类称为[Re-sizer]({{< relref "/book/first-steps/world-app#systems-the-resizer-module-1" >}} "Re-sizer")。

### 监听浏览器窗口上的`resize`事件

首先，我们需要某种方式来监听浏览器，然后在窗口大小发生变化时采取行动。在web-dev术语中，我们想**监听resize events**。一个名为`element.addEventListener`的内置浏览器方法使我们在这里的工作变得容易。我们可以使用这个方法来侦听任何HTML元素上的各种事件，例如`click`、`scroll`、`keypress`等等。每当事件发生时，我们就说**该事件已触发**。当用户单击鼠标时，`click`事件将触发，当他们旋转滚轮时，`scroll`事件将触发，当他们调整浏览器窗口大小时，`resize`事件将触发，等等。

稍后，我们将使用事件侦听器为场景添加交互性。在这里，我们要监听[`resize`](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event)事件，该事件会在浏览器窗口大小改变时触发。将移动设备从横向旋转到纵向，在多显示器设置的显示器之间拖动窗口，以及通过用鼠标拖动窗口边缘来调整浏览器大小都会`resize`触发事件，这意味着我们在此处添加的代码将处理所有这些情况。

{{% note %}}
TODO-LINK: add link to interactivity chapter
{{% /note %}}

_如果您不熟悉事件侦听器，请查看附录中的[DOM API参考]({{< relref "/book/appendix/dom-api-reference#listening-for-events" >}} "DOM API参考")以获取更多信息。_

我们可以在任何HTML元素上侦听大多数事件，例如`click`或`scroll`。但是，`resize`事件侦听器必须附加到[全局`window`对象]({{< relref "book/appendix/dom-api-reference#global-object" >}} "全局`window`对象")。还有另一种监听调整大小事件的方法，它适用于任何元素：[`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver)。 然而，它是相当新的，在撰写本章时还没有得到广泛的支持。此外，设置的工作量更大，所以我们现在将坚持使用久经考验且值得信赖的`resize`事件。

### 在浏览器控制台中测试`addEventListener`

在我们设置自动调整大小之前，我们将使用浏览器控制台来测试`addEventListener`和`resize`事件。按F12键打开浏览器控制台，粘贴以下代码，然后按 _Enter_：

{{< code lang="js" linenos="false" caption="将此代码粘贴到浏览器控制台中，然后调整页面大小" >}}
function onResize() {
console.log('You resized the browser window!');
}

window.addEventListener('resize', onResize);
{{< /code >}}

{{< figure src="first-steps/console-resize.png" alt="打印调整大小的事件日志到控制台" lightbox="true" class="medium right" >}}

每次调整窗口大小时都会调用`onResize`函数。输入代码后，请尝试调整浏览器的大小，同时注意控制台。您应该会看到类似下图的内容。

当我们调整窗口大小时，`onResize`回调可能会被多次调用。您可能认为您执行了一次调整大小，但发现该`resize`事件已触发十次或更多次。结果，在`onResize`中做太多的工作会导致“口吃”。保持这个函数简单很重要。

> 不要在 resize 函数中进行大量计算。

如果您发现此函数的大小越来越大，您可能会考虑使用诸如[lodash库的`_.throttle`](https://lodash.com/docs#throttle)类的节流函数来防止它被过于频繁地调用。

### 扩展Resizer类

现在我们已经确认一切都按预期工作，我们将继续扩展`Resizer`类以自动处理大小调整。这意味着我们需要在两种情况下调用大小调整代码：首先，在加载时设置初始大小，然后在大小发生变化时再次调用。因此，让我们将该代码移动到一个单独的函数中，然后在我们的场景加载时调用它一次：

{{< code lang="js" linenos="" linenostart="1" hl_lines="1-7 12" caption="_**Resizer.js**_: 将大小调整代码移动到setSize函数中并在加载时调用它" >}}

```js
const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container, camera, renderer) {
    // set initial size on load
    setSize(container, camera, renderer);
  }
}

export { Resizer };
```

{{< /code >}}

非常好。现在，让我们添加一个事件侦听器并在事件触发时再次调用`setSize`。

{{< code lang="js" linenos="" linenostart="9" hl_lines="14-17" caption="_**Resizer.js**_: 设置事件监听器" >}}

```js
class Resizer {
  constructor(container, camera, renderer) {
    // set initial size
    setSize(container, camera, renderer);

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
    });
  }
}
```

{{< /code >}}

{{< figure src="first-steps/cube-stretched.png" caption="立方体滥用！" lightbox="true" class="medium left" >}}

现在，`setSize`只要`resize`事件触发就会调用。但是，我们还没有完成。如果您现在尝试调整窗口大小，您会看到场景会扩展或收缩以适应新的窗口大小。然而，奇怪的事情正在发生在立方体上。它似乎被压扁和拉伸，而不是随窗口调整大小。这是怎么回事？

{{< figure src="first-steps/cube-flattened.png" caption="哦，人类啊！" lightbox="true" class="medium right" >}}

{{< clear >}}

相机、渲染器和`<canvas>`元素都已正确调整大小。但是，我们只调用了`.render`一次，它在画布中绘制了一个帧。当画布被调整大小时，这个框架被拉伸以适应新的大小。

### 创建一个`onResize`钩子

这意味着我们需要在每次调整大小事件触发时生成一个新帧。为此，在`Resizer`类的事件侦听器中，我们需要在`setSize`后面紧接着调用`World.render`方法。但是，我们不愿将整个World类传递给Resizer。相反，我们将创建一个`Resizer.onResize`钩子。这使我们能够在发生调整大小时执行一些自定义行为。

{{< code from="9" to="23" file="worlds/first-steps/responsive-design/src/World/systems/Resizer.final.js" lang="js" linenos="true" hl_lines="18 22" caption="_**Resizer.js**_: 用于自定义调整大小行为的空onResize方法" header="" footer="" >}}{{< /code >}}

`.onResize`是一个[空方法]({{< relref "book/appendix/javascript-reference#empty-functions" >}} "空方法")， 我们可以从`Resizer`类的外部自定义。

### 在World中自定义`Resizer.onResize`

在World中，将空的`.onResize`替换为一个新的调用`World.render`。

{{< code from="14" to="29" file="worlds/first-steps/responsive-design/src/World/World.final.js" lang="js" linenos="true" hl_lines="26-28" caption="_**World.js**_: 自定义Resizer.onResize" header="    ...." footer="" >}}{{< /code >}}

这样，自动调整大小就完成了。

现在自动调整大小和抗锯齿功能就实现了，我们的应用程序看起来更加专业。在下一章中，我们将设置一个动画循环，它会以每秒60帧的速度稳定地输出帧流。一旦我们这样做了，我们将不再需要担心在调整大小后重新渲染帧。

## 挑战

{{% aside success %}}

### 简单

1. 启用和禁用AA并比较差异。

2. 旋转立方体，直到边缘垂直和水平。现在，你能看出禁用AA时有什么不同吗？

3. 注释掉 _**World.js**_ 中调整大小的代码，并比较调整窗口大小时的差异。

4. 注释掉 _**World.js**_ 中的自定义`onResize`钩子，看看当你调整窗口大小时会发生什么。

{{% /aside %}}

{{% aside %}}

### 中等

1. 禁用抗锯齿。现在，放大立方体以更好地查看锯齿伪影。不要使用浏览器的缩放功能。相反，请尝试以下方法：

   - 使用`cube.scale`放大立方体。
   - 使用`cube.position.z`使立方体更靠近您。
   - 使用`camera.position.z`使相机更靠近立方体。<br><br>

2. 仍然禁用AA，使用`camera.position.x`(水平移动)和`camera.position.y`(垂直移动)放大立方体的右上角。

3. 重复2.，但这一次，使用`cube.position.x`和`cube.position.y`。

_请注意，当您四处移动立方体或放大和缩小时，锯齿伪影（锯齿）如何变化。_

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 不要使用容器来调整场景大小，而是尝试手动输入一些数字。例如，创建一个宽高64像素或宽高256像素的场景。您可能希望在此处更改场景的背景颜色以更轻松地查看。

2. 玩玩`devicePixelRatio`。尝试为DPR设置更高的值，例如4或8（不过不要太高！）。如果您将值设置为低于1，例如0.5，会发生什么情况？如果您为DPR设置高值并禁用AA，会发生什么情况？立方体的边缘看起来如何？

_`devicePixelRatio`除了1以外的值以更高或更低的分辨率渲染场景，然后将其缩放以适合画布。DPR为2将以双倍分辨率渲染场景并按比例缩小，而DPR为0.5将以一半分辨率渲染并按比例放大。可以想象，高DPR值的渲染成本非常高！_

{{% /aside %}}
