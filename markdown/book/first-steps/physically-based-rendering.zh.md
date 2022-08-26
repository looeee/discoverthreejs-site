---
title: "基于物理的渲染和照明"
description: "令人惊讶的是，微小的three.js核心包含与Unreal、Unity、Disney和Pixar等巨头使用的相同的基于物理的渲染 (PBR) 算法。 在这里，我们将向您展示如何在场景中使用物理精确的材质和照明。"
date: 2018-04-02
weight: 104
chapter: "1.4"
available: true
showIDE: true
IDEFiles: [
  "worlds/first-steps/physically-based-rendering/src/World/components/camera.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/cube.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/lights.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/lights.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/components/scene.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/renderer.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/renderer.final.js",
  "worlds/first-steps/physically-based-rendering/src/World/systems/Resizer.js",
  "worlds/first-steps/physically-based-rendering/src/World/World.start.js",
  "worlds/first-steps/physically-based-rendering/src/World/World.final.js",
  "worlds/first-steps/physically-based-rendering/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/physically-based-rendering/index.html",
]
IDEComparisonMode: true
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/physically-based-rendering/'
IDEActiveDocument: 'src/World/components/cube.js'
---



# 基于物理的渲染和照明

最近， [**基于物理的渲染**](https://en.wikipedia.org/wiki/Physically_based_rendering) （PBR）已成为渲染实时和电影3D场景的行业标准方法。顾名思义，这种渲染技术使用真实世界的物理学来计算表面对光的反应方式，从而避免在场景中设置材质和照明时进行猜测。PBR是迪士尼为其长篇动画创建的，也用于现代游戏引擎，如Unreal和Frostbite。令人惊讶的是，微小的（压缩后为600kb）three.js内核允许我们使用与这些行业领先巨头相同的物理正确渲染技术，不仅如此，我们甚至可以在智能手机等低功耗设备上运行这些技术。就在几年前，这是一项需要大量功能强大的计算机的尖端技术，而现在我们可以在任何地方的网络浏览器中运行它。

{{< iframe src="https://threejs.org/examples/webgl_materials_standard.html" height="400" title="在three.js中基于物理的渲染" class="medium right" >}}

在three.js中使用PBR就像切换我们使用的材质并添加光源一样简单。我们将在下面介绍最重要的three.js PBR材料，即`MeshStandardMaterial`。我们不会在本书中深入探讨基于物理渲染的技术细节，但如果您有兴趣了解更多信息，请阅读这本出色的奥斯卡获奖书（是的，他们显然将奥斯卡奖授予书籍）[基于物理的渲染：从理论到实现](http://www.pbr-book.org/)是完全免费的。

### 照明和材料

光照和材质在计算机图形渲染系统中有着内在的联系。我们不能谈论一个而不说另一个，这就是为什么在本章中，我们还介绍了一种新的光源：`DirectionalLight`。这种光类型模仿来自遥远光源（如太阳）的光线。我们将在本书后面更详细地探讨灯光和材质如何相互作用。要使用诸如`MeshStandardMaterial`的PBR材质，我们必须在场景中添加灯光。这是很显然的——如果没有光，我们就看不到。到目前为止，我们一直在使用的材料`MeshBasicMaterial`不是基于物理的，也不需要灯光。

{{% note %}}
TODO-LINK: add link to relevant sections
{{% /note %}}

### 轻按开关即可昼夜交替

使用老式的、非基于物理的渲染创建好看的场景需要进行大量繁琐的调整。考虑一下这种情况：您已经为建筑展示设置了一个日间餐厅场景，阳光透过窗户在房间周围形成美丽的高光和阴影。稍后，您决定添加夜间模式以展示房间周围的照明设备。使用非PBR技术进行设置将是一项繁重的工作。所有照明和材质参数都需要调整，然后重新调整，然后再次重新调整，直到夜景看起来和白天一样好。

现在，想象同样的场景，但这次您使用的是物理上正确的照明和材料。要将白天切换到夜间，您只需关闭代表太阳的灯并打开灯具中的灯。那个主吸顶灯是一个百瓦的白炽灯泡？检查现实世界中等效灯泡的包装，注意它输出多少流明，然后在代码中使用该值，就完成了。

{{% note %}}
TODO-LOW: add an image to break up the above text
{{% /note %}}

**精心制作的基于物理的材料在所有照明条件下看起来都很棒。**

## 启用物理上正确的光照

在向场景添加灯光之前，我们将切换到使用**物理上正确的光照强度计算**。物理上正确的 _照明_ 与基于物理的 _渲染_ 不同，但是，将两者结合使用来为我们提供完整的物理上准确的场景是有意义的。**物理上正确的照明**意味着使用真实世界的物理方程计算 _光如何随着与光源的距离（衰减）而衰减_。这计算起来相当简单，你可以在任何物理教科书中找到这些方程。另一方面，**基于物理的渲染**涉及以物理上正确的方式 _计算光与表面的反应_。这些方程要复杂得多，至少对于任何比镜子更复杂的表面来说是这样。幸运的是，我们不必了解它们即可使用它们！

要打开物理上正确的照明，只需启用渲染器的[`.physicallyCorrectLights`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.physicallyCorrectLights)设置：

{{< code file="worlds/first-steps/physically-based-rendering/src/World/systems/renderer.final.js" from="3" to="10" lang="js" linenos="true" hl_lines="6 7" caption="_**renderer.js**_: 启用物理正确的照明" >}}{{< /code >}}

默认情况下禁用此设置以保持向后兼容性。但是，打开它没有缺点，因此我们将始终启用它。我们还需要调整一些参数，以使颜色和照明以物理上正确的方式工作。但是，通过启用此设置，在我们的场景中，我们在产品级别、物理精确照明方面迈出了重要的第一步。

{{% note %}}
TODO-LINK: add link to color spaces/grading sections
{{% /note %}}

## 创建物理大小的场景

为了使物理上正确的照明准确，您需要构建物理大小的场景。如果你的房间有1000公里宽，那么使用真实灯泡的数据是没有意义的！如果你想让一个百瓦的灯泡以与等效真实房间中的等效灯泡相同的方式照亮房间，则必须使用米将房间建造成正确的比例。

### three.js中的大小单位是米

* 我们之前创建的$2\times 2 \times 2$的立方体每边长为两米。
* `camera.far = 100`意味着我们可以看到一百米的距离。
* `camera.near = 0.1`意味着距离相机不到十厘米的物体将不可见。

**使用米为单位是一种约定，而不是规则。如果您不遵循它，那么除了物理上精确的照明之外的一切都仍然有效。** 事实上，在某些情况下使用不同的比例是有意义的。例如，如果您正在构建一个大规模的空间模拟，您可能会决定使用 $ 1 \text{单位} = 1000 \text{公里}$。**但是，如果您想要物理上准确的照明，那么您必须使用以下公式将场景构建到真实世界的规模：**

> $ 1 \text{单位} = 1 \text{米}$

如果您引入由另一位艺术家制作的以英尺、英寸、厘米或弗隆为单位的模型，您应该将它们重新缩放为米。{{< link path="/book/first-steps/transformations/" title="我们将在下一章向您展示如何缩放对象" >}}。

## Three.js中的光照

如果你在一个黑暗的房间里打开一个灯泡，那个房间里的物体会以两种方式接收到光：

1. **直接照明**：直接来自灯泡并撞击物体的光线。
2. **间接照明**：光线在击中物体之前已经从墙壁和房间内的其他物体反弹，每次反弹都会改变颜色并失去强度。

与这些相匹配，three.js中的灯光类分为两种类型：

1. **直接光照**，模拟直接光照。
2. **环境光**，这是 _一种_ 廉价且可信的间接照明方式。

{{% note %}}
TODO-DIAGRAM: add figure of direct and Indirect lighting
{{% /note %}}

我们可以轻松模拟直接照明。直接光线从光源出来并沿直线继续，直到它们击中或不击中物体。然而，间接照明更难模拟，因为这样做需要计算从场景中所有表面永远反射的无限数量的光线。没有足够强大的计算机来做到这一点，即使我们限制自己仅计算几千条光线，每条光线只产生几次反弹（**[光线追踪](https://en.wikipedia.org/wiki/Ray_tracing_(graphics))** )，实时计算通常仍然需要很长时间。因此，如果我们想要场景中的真实光照，我们需要某种方式来伪造间接光照。在three.js中有几种技术可以做到这一点，其中环境光就是其中之一。其他的几种技术分别是基于图像的照明 (IBL) 和光探测器，我们将在本书后面看到。

{{% note %}}
TODO-LINK: add links to lighting chapters
{{% /note %}}

### 直接照明

在本章中，我们将添加`DirectionalLight`，它模拟来自太阳或另一个非常明亮的遥远光源的光。我们将在本节稍后部分回到{{< link path="/book/first-steps/ambient-lighting/" title="环境照明" >}}。three.js核心中总共有四种直接光源类型可用，每一种都模拟一个常见的现实世界光源：

* **`DirectionalLight` => 阳光**

* **`PointLight` => 灯泡**

* **`RectAreaLight` => 条形照明或明亮的窗户**

* **`SpotLight` => 聚光灯**

### 默认情况下禁用阴影

{{% note %}}
TODO-DIAGRAM: add a diagram to illustrate light going through an object
{{% /note %}}

即使我们使用PBR，现实世界和three.js之间的一个区别是默认情况下对象不会阻挡光线。光路径中的每个物体都会收到照明，即使路上有一堵墙。落在物体上的光会照亮它，但也会直接穿过并照亮后面的物体。物理正确性就这么多！

我们可以逐个对象的、逐个光照的手动启用阴影。但是，阴影很昂贵，因此我们通常只为一盏灯或两盏灯启用阴影，尤其是当我们的场景需要在移动设备上工作时。只有直接光类型可以投射阴影，环境光不能。

{{% note %}}
TODO-LINK: add link to shadows section
TODO-DIAGRAM: directional lightning diagram : the Sun should be bigger so it makes more sense visually that rays are parallel.
{{% /note %}}

## 介绍`DirectionalLight`

{{< figure src="first-steps/directional_light.svg" alt="来自定向光的光线" lightbox="true" caption="来自定向光的光线" class="medium left" >}}

[`DirectionalLight`](https://threejs.org/docs/#api/lights/DirectionalLight)设计的目的是模仿遥远的光源，例如太阳。来自`DirectionalLight`的光线不会随着距离而消失。**场景中的所有对象都将被同样明亮地照亮，无论它们放在哪里——即使是在灯光后面**。

`DirectionalLight`的光线是平行的，从一个位置照向一个目标。默认情况下，目标放置在我们场景的中心（点$(0, 0, 0)$)，所以当我们移动周围的光线时，它总是会向中心照射。

### 添加一个`DirectionalLight`到我们的场景

说得够多了，让我们在场景中添加一个`DirectionalLight`。打开或创建 _**components/lights.js**_ 模块，该模块将遵循与此文件夹中其他组件相同的模式。首先，我们将导入`DirectionalLight`类，然后我们将设置一个`createLights`函数，最后，我们将导出该函数：

{{< code lang="js" linenos="true" caption="_**lights.js**_: 初始化模块结构" >}}
import { DirectionalLight } from 'three';

function createLights() {
  const light = null; // TODO

  return light;
}

export { createLights };
{{< /code >}}

#### 创建一个`DirectionalLight`

[`DirectionalLight`](https://threejs.org/docs/#api/en/lights/DirectionalLight)构造函数有两个参数，颜色**color**和强度**intensity**。在这里，我们创建一个强度为8的纯白光：

{{< code lang="js" linenos="true" linenostart="4" hl_lines="5 6" caption="_**lights.js**_: 创建一个`DirectionalLight`" >}}
function createLights() {
  // Create a directional light
  const light = new DirectionalLight('white', 8);

  return light;
}
{{< /code >}}

所有three.js灯都有颜色和强度设置，继承自[`Light`基类](https://threejs.org/docs/#api/en/lights/Light.intensity)。

#### 定位灯光

`DirectionalLight`从`light.position`照向`light.target.position`。正如我们上面提到的，灯光和目标的默认位置都是我们场景的中心，$(0, 0, 0)$。这意味着光线当前正在从$(0, 0, 0)$照向$(0, 0, 0)$。 这确实有效，但看起来不太好。我们可以通过调整`light.position`来改善灯光的外观。我们将通过将位置设置为$(10, 10, 10)$来达到向左、向上和朝向我们移动它的效果。

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/lights.final.js" hl_lines="7 8" lang="js" linenos="true" caption="_**lights.js**_: 定位灯光" >}}{{< /code >}}

现在灯光从$(10, 10, 10)$照向$(0, 0, 0)$。

#### World.js设置

在 _**World.js**_ 中，导入新模块：

{{< code file="worlds/first-steps/physically-based-rendering/src/World/World.final.js" hl_lines="3" from="1" to="7" lang="js" linenos="true" caption="_**World.js**_: 导入新模块" footer="..." >}}{{< /code >}}

然后创建一个灯光并将其添加到场景中。向场景中添加灯光就像{{< link path="/book/first-steps/first-scene/#add-the-mesh-to-the-scene" title="添加网格" >}}一样：

{{< code file="worlds/first-steps/physically-based-rendering/src/World/World.final.js" hl_lines="21 23" from="13" to="26" lang="js" linenos="true" caption="_**World.js**_: 创建一个灯光并将其添加到场景中" >}}{{< /code >}}

请注意，我们仅在一次`scene.add`调用中就添加了灯光和网格。我们可以添加任意数量的对象，用逗号分隔。

## 切换到基于物理的`MeshStandardMaterial`

添加灯光不会有任何立竿见影的效果，因为我们目前使用的是`MeshBasicMaterial`。 正如我们前面提到的，这种材质会忽略场景中的任何灯光。在这里，我们将切换到`MeshStandardMaterial`。

### `MeshBasicMaterial`

顾名思义，[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)是three.js中提供的最基本的材料。它根本不会对灯光做出反应，并且网格的整个表面都用单一颜色着色。不执行基于视角或距离的着色，因此对象看起来甚至不是三维的。我们所能看到的只是一个二维轮廓。

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="The MeshBasicMaterial in action" caption="`MeshBasicMaterial`示例" >}}

在上面的控件中，`Material`菜单具有所有three.js材质共享的参数，而`MeshBasicMaterial`菜单具有来自此材质类型的参数。可以通过调整参数来改善这种材质的外观，特别是通过使用纹理，我们将在{{< link path="/book/first-steps/textures-intro/" title="1.8：纹理映射简介" >}}中进行探讨。您可以使用`map`参数测试颜色图的效果。或者，尝试使用参数`envMap`设置环境纹理。环境贴图是**基于图像的照明**的一种重要形式。但是，无论我们如何调整这些设置，我们都无法达到基于物理的材质的质量。

{{% note %}}
TODO-LINK: add link to envMap
{{% /note %}}

### 介绍`MeshStandardMaterial`

在本章中，我们将用[`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)代替基本材料`MeshBasicMaterial`。这是一种高质量、通用、物理精确的材料，可以使用真实世界的物理方程对光做出反应。顾名思义，`MeshStandardMaterial`应该是几乎所有情况下的首选“标准”材料。通过添加精心制作的纹理，我们可以使用`MeshStandardMaterial`重建几乎任何常见的表面。

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshStandardMaterial" height="500" title="The MeshStandardMaterial in action" caption="`MeshStandardMaterial`示例" >}}

如果你看这里的菜单，你会看到three.js的素材有很多设置！此场景中的控件仅显示了部分可用`MeshStandardMaterial`参数。

### Material基类

如果你在上面两个场景中打开Material菜单，你会看到这两种材质有很多相同的设置，比如透明（材质是否透明）、不透明度（透明程度）、可见（true/false 显示/隐藏材质），等等。这样做的原因是这两种材料，实际上，_所有的_ three.js材料，都继承自[`Material`基类](https://threejs.org/docs/#api/en/materials/Material)。你不能直接使用Material。相反，您必须始终使用它的派生类中的某一个，例如`MeshStandardMaterial`或者`MeshBasicMaterial`。

{{% aside success %}}

## 照明和深度

我们的眼睛使用物体表面阴影的细微差异来确定深度。因此，如果我们不在场景中添加某种形式的光照，它看起来就不是3D的。可以使用直接或环境光类添加光照，或者将光照作为基于图像的光照存储在纹理中。在这里，左边的立方体使用由`DirectionalLight`照亮的`MeshStandardMaterial`，而右边的立方体仅使用`MeshBasicMaterial`（它忽略了光照）。

{{% inlineScene entry="first-steps/compare-basic-standard.js" %}}

{{% /aside %}}

### 切换立方体的材质

转到 _**cube.js**_，我们将切换到这个新材料。首先，我们需要导入它：

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js" from="1" to="1" lang="js" linenos="true" caption="_**cube.js**_: 导入新模块" >}}{{< /code >}}

然后，更新`createCube`函数并将旧的、枯燥的、基本的材料切换到花哨的新标准材料：

{{< code lang="js" linenos="true" linenostart="3" hl_lines="6-8" caption="_**cube.js**_: 切换到MeshStandardMaterial" >}}
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // Switch the old "basic" material to
  // a physically correct "standard" material
  const material = new MeshStandardMaterial();

  const cube = new Mesh(geometry, material);

  return cube;
}
{{< /code >}}

### 更改材质的颜色

{{% note %}}
TODO-LINK: add link to colors chapter
TODO-LINK: add link to named vs positional params in JS ref
{{% /note %}}

我们将在这个模块中再做一个更改，并将材质的颜色设置为紫色。设置材质参数与盒子几何体等其他类略有不同，因为我们需要使用具有[命名参数](https://exploringjs.com/impatient-js/ch_callables.html#named-parameters)的**规范对象**：

{{< code lang="js" linenos="false" caption="材料采用规范对象" >}}
const spec = {
  color: 'purple',
}

const material = new MeshStandardMaterial(spec);
{{< /code >}}

为了使我们的代码简短易读，我们将内联声明规范对象：

{{< code lang="js" linenos="true" linenostart="3" hl_lines="8" caption="_**cube.js**_: 内联声明规范对象" >}}
``` js
function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // Switch the old "basic" material to
  // a physically correct "standard" material
  const material = new MeshStandardMaterial({ color: 'purple' });

  const cube = new Mesh(geometry, material);

  return cube;
}
```
{{< /code >}}

当我们{{< link path="book/first-steps/first-scene/#set-color" title="设置场景的背景颜色" >}}时，我们使用了一个CSS颜色名称，我们在这里也做了同样的事情。

## 旋转立方体

最后，让我们旋转立方体，这样我们就不再直视它了。调整对象的旋转与设置位置的方式大致相同。将以下几行添加到立方体模块：

{{< code file="worlds/first-steps/physically-based-rendering/src/World/components/cube.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="12" caption="_**cube.js**_: 旋转立方体" >}}{{< /code >}}

现在把你喜欢的任何值放在那里。现在我们不再查看立方体的正面，它最终看起来像一个立方体而不是正方形。

{{< figure src="first-steps/cube-medium.png" alt="旋转后的立方体" lightbox="true" class="small right" >}}

**旋转**是我们遇到的第二种移动物体的方法，以及设置位置（**平移**）。_移动物体_ 的技术术语是**变换**，我们将用于变换物体的第三种方法是**缩放**。**平移**、**旋转**和**缩放**( **TRS** ) 是我们将用于在3D空间中定位对象的三个基本变换，我们将在{{< link path="/book/first-steps/transformations/" title="下一章" >}}中详细研究这些变换。

## 挑战

{{% aside success %}}
### 简单

1. 尝试改变材料的颜色。所有正常的颜色，如**red**、**green**或**blue**，以及更多奇特的颜色，如**peachpuff**、**orchid**或**papayawhip**，都可以使用。[这是CSS颜色名称的完整列表](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)。

2. 尝试改变灯光的颜色。同样，您可以使用任何CSS颜色名称。观看如何设置各种灯光和材质颜色为立方体提供最终颜色。

3. 尝试移动灯光（使用`light.position`）并观察结果。
{{% /aside %}}

{{% aside %}}
### 中等

1. 测试其他直射光类型：[`PointLight`](https://threejs.org/docs/#api/en/lights/PointLight)，[`SpotLight`](https://threejs.org/docs/#api/en/lights/SpotLight)，和[`RectAreaLight`](https://threejs.org/docs/#api/en/lights/RectAreaLight)。

2. `MeshBasicMaterial`并且`MeshStandardMaterial`不是唯一可用的材料。three.js核心中共有十八种材质，任何名称中带有“mesh”字样的材质都可以与我们的立方体网格一起使用。测试其中一些（提示：[在文档中搜索"material"](https://threejs.org)）。_您需要先导入其他灯光和材质类，然后才能使用它们！_
{{% /aside %}}

{{% aside warning %}}
### 困难

1. 重新创建场景[Lighting and Depth](#lighting-and-depth)，减去动画（提示：使用两个网格和两个材质）。
{{% /aside %}}