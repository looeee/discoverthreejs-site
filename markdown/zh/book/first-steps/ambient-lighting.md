---
title: "环境光：来自各个方向的光照"
description: "环境光并非是来自空间中特定点的场景照明。three.js中有两个环境光类可用：AmbientLight和HemisphereLight。在这里，我们测试每一个，并观察对我们场景的影响。"
date: 2018-04-02
weight: 110
chapter: "1.10"
available: true
showIDE: true
IDEFiles:
  [
    "assets/textures/uv-test-bw.png",
    "assets/textures/uv-test-col.png",
    "worlds/first-steps/ambient-lighting/src/World/components/camera.js",
    "worlds/first-steps/ambient-lighting/src/World/components/cube.js",
    "worlds/first-steps/ambient-lighting/src/World/components/lights.start.js",
    "worlds/first-steps/ambient-lighting/src/World/components/lights.final.js",
    "worlds/first-steps/ambient-lighting/src/World/components/scene.js",
    "worlds/first-steps/ambient-lighting/src/World/systems/controls.js",
    "worlds/first-steps/ambient-lighting/src/World/systems/renderer.js",
    "worlds/first-steps/ambient-lighting/src/World/systems/Resizer.js",
    "worlds/first-steps/ambient-lighting/src/World/systems/Loop.js",
    "worlds/first-steps/ambient-lighting/src/World/World.start.js",
    "worlds/first-steps/ambient-lighting/src/World/World.final.js",
    "worlds/first-steps/ambient-lighting/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/ambient-lighting/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["assets", "systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/ambient-lighting/"
IDEActiveDocument: "src/World/components/lights.js"
---

# 环境光：来自各个方向的光照

{{< inlineScene entry="first-steps/illumination-problem.js" class="round small right" >}}

在上一章的最后，我们发现了我们的照明设置存在一个相当明显的问题。我们的场景使用单一的`DirectionalLight`照明，尽管这种类型的光用光线填充整个场景，但所有光线都在一个方向上发光。在光的直接路径中的立方体的面被明亮地照亮。然而，当我们旋转相机看另一个方向时，我们会发现**立方体背向光线方向的其他任何面都没有收到任何光线！**

{{< clear >}}

{{< figure src="first-steps/directional_light.svg" alt="定向光的光线" lightbox="true" caption="立方体的任何不在光线路径中的面<br />都不会收到任何光线" class="medium left" >}}

在本章中，我们将研究这里发生的事情，并探索一些改进照明设置的方法。在此过程中，我们将花时间简要回顾一下使用three.js时常用的一些光照技术。

### 现实世界中的照明

在现实世界中，无数光线从场景中的所有物体表面反射和反弹无数次，随着每次反射或反弹颜色会逐渐消退变淡并改变颜色，直到最终到达我们的眼睛或相机。这创造了我们每天在周围世界看到的美丽而微妙的光影图案。

{{< figure src="first-steps/light_study.jpg" alt="A scene demonstrating the beauty of light in the real world" title="图片来源: T Cud on Unsplash" alt="展示直接照明和间接照明的场景。" lightbox="false" class="" >}}

### 实时模拟光照

对我们来说不幸的是，计算机无法模拟无限。一种称为[光线追踪](<https://en.wikipedia.org/wiki/Ray_tracing_(graphics)>)的技术可用于模拟几千条光线，每条光线在场景中反弹几次。但是，使用这种技术实时渲染帧需要太多的处理能力，因此光线追踪和[路径追踪](https://en.wikipedia.org/wiki/Path_tracing)等相关技术更适合创建预渲染图像或动画。

相反，正如我们在[1.4：基于物理的渲染和光照中]({{< relref "/book/first-steps/physically-based-rendering" >}} "1.4：基于物理的渲染和光照中")所讨论的，实时图形引擎将光照分为两部分：

1. **直接照明**: 直接来自光源并撞击物体的光线。
2. **间接照明**: 光线在击中物体之前从房间的墙壁和其他物体反射回来，每次反射都会改变颜色并失去强度。

还有第三类旨在同时执行直接和间接照明，称为[全局照明](https://en.wikipedia.org/wiki/Global_illumination)，其中光线追踪和路径追踪是两个例子。事实上，在3D计算机图形领域有大量用于模拟或近似照明的技术。其中一些技术模拟直接照明，一些模拟间接照明，而另一些则模拟两者。这些技术中的大多数都太慢而无法在web上使用，我们必须考虑人们从低功耗的移动设备访问我们的应用程序。但是，即使我们将自己限制在仅适用于实时使用且在three.js中可用的技术，我们可以使用的光照方法的数量仍然相当多。

使用three.js创建高质量的照明就是选择这些技术的组合来创建完整的照明设置。在three.js中，将灯光类分为两类，以匹配两类灯光：

1. **直接光照**，模拟直接光照。
2. **环境光**，这是一种廉价且可信的间接照明方式。

当前`DirectionalLight`照亮我们的场景是直接照明的一种形式。在本章中，我们将把这种光与环境光配对。环境照明是向场景添加间接照明的最简单技术之一，`DirectionalLight`与环境光配对使用是最常见的照明设置之一。

但首先，让我们简要介绍一下使用three.js时我们可以使用的一些光照技术。

## 照明技术的简要概述

### 多个直射灯

解决我们光照不佳的立方体问题的一种方法是添加更多直射光，例如`DirectionalLight`或`SpotLight`，直到场景中的对象从各个角度都被照亮。但是，这种方法会产生一系列新问题：

1. 我们必须跟踪灯光以确保所有方向都被照亮。
2. 灯光很昂贵，我们希望在场景中添加尽可能少的灯光。

在场景中添加越来越多的直射光会很快降低帧率，因此单独使用直射光几乎不是最佳选择。

### 根本没有灯光！

另一种照明技术是完全避免使用灯光。某些材料，例如`MeshBasicMaterial`，不需要看到灯光。`MeshBasicMaterial`使用适当的[纹理]({{< relref "/book/first-steps/textures-intro" >}} "纹理")可以得到很好的结果。

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="MeshBasicMaterial示例" caption="MeshBasicMaterial示例" >}}

在上面的场景中，首先将颜色设置为白色（`0xffffff`），然后更改`.map`为 _砖块_ 纹理。接下来，移除砖块纹理并将环境贴图 (`.envMap`) 设置为 _reflection_。正如你所看到的，`MeshBasicMaterial`它并不像名字所暗示的那么基本。尽管如此，这种解决方案更适合故意低保真度的场景，或者性能至关重要的场景。

### 基于图像的照明(Image-Based Lighting: IBL)

基于图像的照明是一系列技术的名称，这些技术涉及预先计算照明信息并将其存储在纹理中。最重要的IBL技术是[环境映射](https://en.wikipedia.org/wiki/Reflection_mapping)（也称为反射映射），也就是您刚才设置的MeshBasicMaterial.envMap的值。

{{< iframe src="https://threejs.org/examples/webgl_materials_envmaps.html" height="500" title="基于图像的照明 (IBL)示例" caption="基于图像的照明 (IBL)：场景背景反映在球体上" >}}

环境贴图通常使用专门的摄影技术或外部3D渲染程序生成。有几种格式用于存储生成的图像，其中两种在上面的场景中进行了演示：立方体贴图和等距矩形贴图。单击菜单中的选项以查看每个选项的示例。环境映射是three.js中最强大的光照技术之一，我们稍后会详细探讨。

{{% note %}}
TODO-LINK: add link to IBL section

### 光探测器

{{< iframe src="https://threejs.org/examples/webgl_lightprobe.html" height="500" title="" >}}

{{% /note %}}

{{% note %}}
TODO-LOW: add light probes overview
{{% /note %}}

### 快速简便的解决方案：环境照明

**环境照明**是一种伪造间接照明的方法，它既快速又易于设置，同时仍能提供合理的结果。three.js核心中有两个环境光类可用：

- **[`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight)从各个方向向每个对象添加恒定数量的光。**
- **天空颜色和地面颜色之间的[`HemisphereLight`](https://threejs.org/docs/#api/en/lights/HemisphereLight)渐变，可用于模拟许多常见的照明场景。**

我们在[基于物理的渲染和光照]({{< relref "/book/first-steps/physically-based-rendering#the-three-js-light-classes" >}} "基于物理的渲染和光照")中简要提到了这些。使用这些灯中的任何一个都遵循与使用`DirectionalLight`一样的规则. 只需创建一个灯光实例，然后将其添加到您的场景中。下面的场景演示了使用一个`HemisphereLight`与一个`DirectionalLight`的组合来产生明亮的户外场景的效果。

{{< iframe src="https://threejs.org/examples/webgl_lights_hemisphere.html" height="500" title="HemisphereLight示例" caption="由定向光和半球光照亮的简单场景" >}}

如您所见，结果是不现实的。与直接照明相结合的环境照明更注重性能而不是质量。但是，通过使用不同的模型和背景或改进模型的材质，您可以在不更改照明设置的情况下极大地提高该场景的质量。

#### 使用环境光

与直射光一样，环境光也继承自[基类`Light`](https://threejs.org/docs/#api/en/lights/Light)，因此它们具有`.color`和`.intensity`属性。`Light`，反过来，继承自`Object3D`，所以**所有的灯光也有`.position`、`.rotation`和`.scale`属性**。但是，旋转或缩放灯光没有效果。改变`AmbientLight`的位置也没有效果。

环境光会影响场景中的所有对象。**因此，无需为场景添加多个环境光。** 与直射光不同（除了`RectAreaLight`），环境光不能投射阴影。

像往常一样，要使用这些光照类中的任何一个，您必须首先导入它们。现在在灯光模块中导入这两个类。我们将在本章的剩余部分中对它们进行实验。

{{< code file="worlds/first-steps/ambient-lighting/src/World/components/lights.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="2 4"  caption="_**lights.js**_: 导入两个环境光类" >}}{{< /code >}}

## `AmbientLight`

[`AmbientLight`](https://threejs.org/docs/#api/en/lights/AmbientLight)是在three.js中伪造间接照明的最廉价的方法。这种类型的光会从各个方向向场景中的每个对象添加恒定数量的光照。放置此灯的位置无关紧要，相对于灯光放置其他对象的位置也无关紧要。这与现实世界中光的工作方式完全不同。尽管如此，结合一个或多个直射光一起使用，`AmbientLight`效果还不错。

### 添加一个`AmbientLight`到场景

与`DirectionalLight`一样，将[`.color`](https://threejs.org/docs/#api/en/lights/Light.color)和[`.intensity`](https://threejs.org/docs/#api/en/lights/Light.intensity)参数传递给构造函数：

{{< code lang="js" linenos="" linenostart="7" hl_lines="8 13" caption="_**lights.js**_: 创建一个AmbientLight" >}}
function createLights() {
const ambientLight = new AmbientLight('white', 2);

const mainLight = new DirectionalLight('white', 5);
mainLight.position.set(10, 10, 10);

return { ambientLight, mainLight };
}
{{< /code >}}

在World中，`createLights`函数现在返回两个灯。将它们都添加到场景中：

{{< code file="worlds/first-steps/ambient-lighting/src/World/World.final.js" from="17" to="33" lang="js" linenos="true" hl_lines="27, 30"  caption="_**World.js**_: 将环境光添加到场景中" >}}{{< /code >}}

{{% note %}}
TODO-LOW: once destructuring assignment is documented, link it here
{{% /note %}}

我们通常会将`AmbientLight`的强度设置为低于与之配对的直射光的值。在这里，低强度的白光会导致昏暗的灰色环境照明。结合单色亮度的`DirectionalLight`，这种昏暗的环境光解决了我们的照明问题，并且立方体的背面被照亮：

{{< inlineScene entry="first-steps/ambient-with-directional.js" >}}

{{% note %}}
TODO-LOW: the lighting in this chapter needs to be improved
TODO-LOW: add controls to disable direct light to allow viewing ambient on it's own
{{% /note %}}

然而，立方体背面的照明看起来相当暗淡。为了使基于`AmbientLight`和`DirectionalLight`灯光照明的场景看起来不错，我们需要添加具有不同方向和强度的多个定向灯。对于[使用多个直射灯的设置](#multiple-direct-lights)，这会遇到我们上面描述的许多相同问题。正如我们稍后会看到的，`HemisphereLight`这里给出了更好的结果，几乎没有额外的性能成本。

这并不意味着`AmbientLight`是没用的。例如`HemisphereLight`，它并不适合所有场景，在这种情况下，您可以退回到`AmbientLight`。此外，这种灯照是增加整体亮度或为场景添加轻微色调的最廉价的方法。您有时会发现它对调制其他类型的光照（例如环境贴图）或调整阴影暗度很有用。

### `AmbientLight`不显示深度 {#no-depth}

正如我们在[1.4：基于物理的渲染和光照]({{< relref "/book/first-steps/physically-based-rendering#lighting-and-depth" >}} "1.4：基于物理的渲染和光照")中提到的，我们的眼睛使用物体表面的阴影差异来确定深度。然而，来自环境光的光线在所有方向上都是一样的，所以阴影是均匀的，并且没有给我们提供关于深度的信息。因此，任何仅使用`AmbientLight`照明的对象都不会是3D的。

这与`MeshBasicMaterial`的运作方式相似，以至于无法区分。其中一个立方体有一个`MeshBasicMaterial`，另一个是`MeshStandardMaterial`，都只被一个`AmbientLight`灯光照亮。看看你能不能把它们区分开：

{{< inlineScene entry="first-steps/ambient-basic-comparison.js" >}}

## `HemisphereLight`

来自[`HemisphereLight`](https://threejs.org/docs/#api/en/lights/HemisphereLight)的光在场景顶部的天空颜色和场景底部的地面颜色之间渐变。与`AmbientLight`一样，此灯不尝试物理精度。相反，`HemisphereLight`是在观察到在您发现人类的许多情况下创建的，最亮的光来自场景的顶部，而来自地面的光通常不太亮。

例如，在典型的户外场景中，物体从上方被太阳和天空照亮，然后从地面反射的阳光中接收二次光。同样，在室内环境中，最亮的灯通常位于天花板上，这些灯会反射到地板上以形成昏暗的二次照明。

我们可以通过改变灯光的`.position`来调整天空和地面之间的渐变。与所有灯光类型一样，`.rotation`和`.scale`没有效果。`HemisphereLight`构造函数采用与所有其他灯光相同的`.color`和`.intensity`参数，但有一个附加[`.groundColor`](https://threejs.org/docs/#api/en/lights/HemisphereLight.groundColor)参数。通常，我们会使用明亮的天空`.color`和更暗的地面`.groundColor`：

{{< code from="10" to="14" file="worlds/first-steps/ambient-lighting/src/World/components/lights.final.js" lang="js" linenos="true" hl_lines="" caption="_**lights.js**_: 创建一个`HemisphereLight`" header="" footer="" >}}{{< /code >}}

我们可以使用一个**完全没有直射光**的`HemisphereLight`获得不错的结果：

{{< inlineScene entry="first-steps/hemisphere-only.js" >}}

{{% note %}}
TODO-LOW: improve the above scene
{{% /note %}}

但是，由于`HemisphereLight`光线不会从任何特定方向照射，**因此该场景中没有闪亮的高光（又名 _镜面高光_）**。这就是为什么我们通常将这种类型的灯与至少一个直射灯配对。对于户外场景，请尝试将`HemisphereLight`与单个亮光的`HemisphereLight`配对代表太阳。对于室内场景，您可以使用`PointLight`来表示灯泡，或者使用`RectAreaLight`来模拟从明亮的窗户或带状灯发出的光线。

环境光，尤其是`HemisphereLight`，在降低性能成本方面取得了很好的效果，使其适合在低功率设备上使用。然而，现实世界中的场景有阴影、反射和闪亮的高光，这些都不能单独使用环境照明来添加。这意味着环境照明最好与直接照明或IBL等其他技术一起用作辅助角色。

在整本书中，我们将探索许多照明解决方案。其中许多提供了比环境光更好的结果，但几乎没有一个具有更好的性能/质量折衷。

## 挑战

{{% aside success %}}

### 简单

1. 暂时在编辑器中禁用`mainLight`，然后单独测试两个环境光类中的每一个。有几种方法可以禁用灯光。设置`.intensity`为零，不向场景添加灯光，或设置`mainLight.visible`为`false`。

2. `HemisphereLight`的效果来自四个属性的相互作用：天空`.color`、`.groundColor`、`.intensity`和`.position`。尝试调整其中的每一个并观察结果。如果您先禁用主灯，您可能会发现这更容易查看。

{{% /aside %}}

{{% aside %}}

### 中等

1. 在编辑器中，我们给`HemisphereLight`和`DirectionalLight`都赋予了5的强度。我们这样做是为了突出环境光的效果，但是，通常情况下，我们会使直射光比环境光强。你可以通过调整两盏灯的强度和颜色来提高照明质量吗？

2. 添加更多的直射光怎么样，`DirectionalLight`或者是其他类型的一种？当你添加更多这些光照，并从不同的方向照射过来时，场景光照会有所改善吗？

3. 更多的环境光呢？还是同时添加一个`AmbientLight`和一个`HemisphereLight`？这对现场有什么影响？

_请记住：默认情况下，来自`DirectionalLight`的光默认[从`light.position`到`light.target.position`]({{< relref "/book/first-steps/physically-based-rendering#introducing-the-directionallight" >}} "从`light.position`到`light.target.position`")。如果调整灯光的位置，它将继续指向同一个点，但现在光线将以不同的角度进入。_

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 从本章开始我们的问题的另一个解决方案是添加一个光作为相机的子级。这样，当相机移动时，光线也会移动。你可以把它想象成一个相机和手电筒绑在一边。使用这种方法，我们可以使用单个`DirectionalLight`或`SpotLight`照亮场景。试试这个。首先，删除`ambientLight`，然后将相机添加到场景中，最后将`mainLight`添加到相机中。

_注意：当您将灯光添加到相机而不是场景时，您将其[附加到相机的本地空间]({{< relref "/book/first-steps/transformations#moving-an-object-between-coordinate-systems" >}} "附加到相机的本地空间")。您可能需要调整灯光的位置以获得最佳效果。_

{{% /aside %}}

{{% note %}}
TODO-LOW: document adding light.target to the scene here
{{% /note %}}
