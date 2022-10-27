---
title: "内置几何体"
description: "在这里，我们使用three.js的BoxBufferGeometry和CylinderBufferGeometry来构建一个简单的玩具火车，借此机会探索构造更复杂场景组件的方法。"
date: 2018-04-02
weight: 112
chapter: "1.12"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/materials.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/materials.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/Train.start.js",
    "worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js",
    "worlds/first-steps/built-in-geometries/src/World/components/camera.js",
    "worlds/first-steps/built-in-geometries/src/World/components/helpers.js",
    "worlds/first-steps/built-in-geometries/src/World/components/lights.js",
    "worlds/first-steps/built-in-geometries/src/World/components/scene.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/controls.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/renderer.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/Resizer.js",
    "worlds/first-steps/built-in-geometries/src/World/systems/Loop.js",
    "worlds/first-steps/built-in-geometries/src/World/World.start.js",
    "worlds/first-steps/built-in-geometries/src/World/World.final.js",
    "worlds/first-steps/built-in-geometries/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/built-in-geometries/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/built-in-geometries/"
IDEActiveDocument: "src/World/components/Train/Train.js"
membershipLevel: free
---

# 使用内置几何体获得创意

three.js核心包含大量基本几何体形状。我们已经看到了其中的两个：[我们信赖的`BoxBufferGeometry`]({{< relref "/book/first-steps/first-scene#the-geometry" >}} "我们信赖的`BoxBufferGeometry`")和`SphereBufferGeometry`在上一章介绍的。除了这两种之外，还有许多其他形状，从基本的圆柱体和圆形到奇异的十二面体。你可以使用这些几何体形状，就像一个无限的弹性、松软的乐高盒子一样，几乎可以构建任何你能想到的东西。

内置的几何体形状范围很广：

{{< figure src="first-steps/geometries_basic.svg" alt="立方体，圆柱体和球体等几何体" lightbox="true" >}}

……到奇异的形状：

{{< figure src="first-steps/geometries_exotic.svg" alt="十二面体，二十面体和圆环结等几何体" lightbox="true" >}}

……还有一些特别的形状：

{{< figure src="first-steps/geometries_specialized.svg" alt="拉伸，车床和文本几何体" lightbox="true" >}}

……除此之外还有更多。在[文档](https://threejs.org/docs/)中搜索“Geometry”以查看所有这些。

{{< inlineScene entry="first-steps/toy-train.js" class="round medium right" >}}

在本章中，我们将使用前几章学习的变换（[平移、旋转和缩放]({{< relref "/book/first-steps/transformations" >}} "平移、旋转和缩放")）来操作这些几何图形并构建一个简单的玩具火车模型。同时，我们将以此为契机探索构建场景组件的方法，这些组件比我们迄今为止创建的任何东西都更复杂。我们还将更深入地了解如何使用变换，特别是旋转，这是三种变换中最棘手的。我们将只使用两种几何形状来构建玩具火车：用于机舱的盒子几何形状，以及用于车轮、鼻子和烟囱的圆柱几何形状。

{{% aside success %}}

### `Geometry`和`BufferGeometry`

从技术上讲，我们将创建的几何体是“缓冲区”几何体，这意味着它们的数据存储在称为 _**缓冲区**_ 的平面数组中。`BoxBufferGeometry`是[`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry)类的一个扩展。与老旧的`Geometry`类相比，这是一种更新、更快的几何体表示方式。在three.js r125之前，`Geometry`和`BufferGeometry`都包含在three.js核心中，但从three.js r126开始，`Geometry`已被删除。它在示例文件夹中仍然可用，但如果您想使用它，则必须手动包含它。

但是，除非您有充分的理由并且知道自己在做什么，**否则您应该 _始终_ 使用`BufferGeometry`**。`Geometry`仍然在[repo的示例文件夹中](https://github.com/mrdoob/three.js/blob/master/examples/jsm/deprecated/Geometry.js)仅用于向后兼容。

{{% /aside %}}

## `Material.flatShading`属性

我们还将在本章中介绍一种新的材料属性。 [`Material.flatShading` ](https://threejs.org/docs/#api/en/materials/Material.flatShading)在基类`Material`中定义，这意味着它可用于每种材料。默认情况下，它设置为false。

[正如我们在上一章中提到的]({{< relref "/book/first-steps/organizing-with-group#introducing-spherebuffergeometry" >}} "正如我们在上一章中提到的")，所有的几何体都是由三角形组成的。**您可以使用WebGL绘制的唯一形状是点、线和三角形**，所有其他形状都是由这些组成的。但是，**`Mesh`对象完全由三角形组成**，而不是点或线。当它们是网格的一部分时，这些三角形称为**面**。要创建平滑曲线，三角形需要非常小。然而，为了减少三角形的数量，通常需要在光照计算中混合相邻的面。一旦我们在本书后面解释什么是 _**法线**_，我们将更详细地解释它是如何工作的。

{{% note %}}
TODO-LINK: add link to normals explanation
{{% /note %}}

如果启用`.flatShading`，则不再混合相邻面。您可以使用它为对象赋予雕刻或多面的外观，这对于像我们的火车这样的低多边形对象可能是一个很好的效果。

{{< inlineScene entry="first-steps/flatshading.js" caption="左边: flatShading禁用。右边: flatShading启用。" >}}

您可以通过将参数传递给构造函数来创建启用了平面着色的材质：

{{< code lang="js" linenos="false" caption="创建一个红色的启用flatShading的`MeshStandardMaterial`" >}}
const material = new MeshStandardMaterial({
color: 'red',
flatShading: true,
});
{{< /code >}}

您也可以在创建材质后设置`material.flatShading`属性。但是，如果您已经在渲染场景中使用过材质（从技术上讲，如果材质已被 _编译_），您还需要设置[`material.needsUpdate`](https://threejs.org/docs/#api/en/materials/Material.needsUpdate)标志：

{{< code lang="js" linenos="false" caption="材料编译后，在更改某些属性时设置`.needsUpdate`标志" >}}
const material = new MeshStandardMaterial({
color: 'red',
flatShading: false, // default
});

material.flatShading = true;
material.needsUpdate = true;
{{< /code >}}

{{% note %}}
TODO-LINK: add link to material needs update section
{{% /note %}}

## 介绍`CylinderBufferGeometry`

这是我们第一次使用[`CylinderBufferGeometry`](https://threejs.org/docs/#api/en/geometries/CylinderBufferGeometry)，所以现在让我们花点时间考察一下。

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#CylinderGeometry" height="500" title="CylinderBufferGeometry示例" caption="The CylinderBufferGeometry in action" >}}

前三个参数定义圆柱体的形状和大小：

- **`radiusTop`: 圆柱体顶部的半径。**
- **`radiusBottom`: 圆柱底部的半径。**
- **`height`: 圆柱体的高度。**

通过设置`radiusTop`不同于`radiusBottom`的尺寸，您可以创建圆锥体而不是圆柱体。还有一个[`ConeBufferGeometry`](https://threejs.org/docs/#api/en/geometries/ConeBufferGeometry)，但在本质上，它只是一个`radiusBottom`设置为零的`CylinderBufferGeometry`。

接下来的两个参数定义几何体的详细程度：

- **`radialSegments`: 圆柱体在其弯曲边缘周围的详细程度。默认值为8，但在大多数情况下，您需要增加此值以使圆柱体更平滑。**
- **`heightSegments`: 圆柱体沿其高度的详细程度。默认值1通常就可以了。**

最后三个参数定义了圆柱体的 _完整程度_：

- **`openEnded`: 是否在圆柱体的顶部和底部绘制盖子。**
- **`thetaStart`: 圆柱体从曲率周围的哪个点开始绘制。**
- **`thetaLength`: 围绕曲率绘制多远。**

通过设置`openEnded`为false，您可以创建管而不是圆柱。如果您在上面的实时示例或您自己的代码中使用它们，`thetaStart`和`thetaLength`很容易理解。创建`CylinderBufferGeometry`时您不需要填满所有参数，在大多数情况下，前四个就足够了。

通过改变初始参数，这种“圆柱”几何体可用于创建圆锥、管和各种槽状形状。大多数其他几何体都具有类似的灵活性，这意味着最初的二十个几何体可用于创建近乎无限的各种形状。

## 助手（帮助方法）

在编辑器中，我们添加了几个帮助方法，让您更轻松地构建火车。有一个[`AxesHelper`](https://threejs.org/docs/#api/en/helpers/AxesHelper)，它有三条线分别代表$X$、$Y$和$Z$轴， 还有一个[`GridHelper`](https://threejs.org/docs/#api/en/helpers/GridHelper)，它是一个矩形网格，粗黑线穿过场景中心，较小的灰线以一个单位为间隔。

在构建场景时，您通常会发现添加这样的帮助方法很有用，尤其是在您习惯使用three.js坐标系系统时。除了这两个之外，还有许多其他帮助方法可以帮助我们可视化场景中的各种事物，例如盒子、相机、灯光、箭头、平面等。

在这里，注意坐标轴助手中线条的颜色：RGB，代表XYZ：$X$轴是红色的，$Y$轴是绿色的，而$Z$轴为蓝色。接下来，注意网格助手的每个正方形都是$1 \times 1$正方形，您可以使用它来帮助可视化火车各部分的大小。我们的这一列火车最后大约有9米长，对于玩具火车来说可能有点大（或者可能不是），但我们暂时不用担心。您还可以在助手中调整方块的大小，这在构建大型或小型场景时很有用。

{{% note %}}
TODO-LINK: link to helpers section
{{% /note %}}

## 使用旋转

{{< figure src="first-steps/coordinate_system.svg" caption="世界空间坐标系" class="medium left" lightbox="true" >}}

为了构建火车，我们将创建几个形状，然后将它们转换（平移、旋转和缩放）到指定位置。尽管我们在几章前介绍了3D变换的技术细节，但将理论付诸实践需要一些工作。只要牢记坐标系，平移和缩放对象通常会按预期进行。另一方面，[使用旋转]({{< relref "/book/first-steps/transformations#our-final-transformation-rotation" >}} "使用旋转")可能会很棘手。在这里，我们将花一些时间来检查构建火车所需的旋转操作。

看上面的[世界空间坐标系]({{< relref "/book/first-steps/transformations#coordinate-systems-world-space-and-local-space" >}} "世界空间坐标系")。首先最开始，$(0,0,0)$, 位于场景的中心。在本章中使用转换时，请牢记此图。另外，请注意图表中的颜色如何与编辑器中轴助手的颜色匹配：RGB表示XYZ。

{{< clear >}}

{{< inlineScene entry="first-steps/toy-train-rotated.js" class="small right" >}}

接下来，看看火车。机舱由盒子几何体制成，其他一切都由圆柱体制成。就连烟囱也是由一个底部半径比顶部半径小的圆柱体制成。红鼻子是沿着$X$轴，而黑色轮子沿$Z$轴。最后，烟囱朝上是$Y$轴。当我们说圆柱体 _沿轴_ 定向时，我们的意思是该轴平行于通过圆柱体中心绘制的线。

在我们继续将碎片移动到位之前，请记住，**three.js中的正旋转方向是逆时针方向**。这可能与您的直觉所期望的相反，也与CSS旋转相反，因此请特别注意：

> **正旋转 = 逆时针！**

{{< figure src="first-steps/cylinder_initial_rotation.svg" caption="`CylinderBufferGeometry`初始方向" class="medium left" lightbox="true" >}}

当我们创建一个`CylinderBufferGeometry`时，它开始像树干一样向上指向，**沿着的是$Y$轴**。我们如何计算出将其移动到位所需的旋转，来创建轮子、烟囱和鼻子？当然，我们 _可以_ 使用试错法。但是，我们更愿意使用更巧妙的方法。

{{< clear >}}

{{< figure src="first-steps/cylinder_final_rotation.svg" caption="圆柱体围绕Z轴旋转$90^{\circ}$后" class="medium right" lightbox="true" >}}

让我们首先考虑大红鼻子。我们希望鼻子沿着$X$轴。这意味着我们需要旋转它$90^{\circ}$， 或者$\frac{\pi}{2}$弧度，**逆时针**围绕$Z$轴。

{{< clear >}}

{{< figure src="first-steps/wheel_initial_rotation.svg" caption="轮子几何体的初始方向" class="large noborder" lightbox="true" caption="Initial orientation of the wheels" class="medium left" >}}

火车的大红鼻子放好了。那轮子呢？同样的，我们为轮子创建的圆柱体将开始它的生命，沿着$Y$轴。

{{< clear >}}

{{< figure src="first-steps/wheel_final_rotation.svg" alt="轮子几何体的最终方向" class="large noborder" lightbox="true" caption="圆柱体围绕X轴旋转$90^{\circ}$后" class="medium right" >}}

我们希望轮子平行于$Z$轴，所以这一次，我们将围绕$X$轴。再次，这是一个$90^{\circ}$逆时针（正）旋转。

{{< clear >}}

我们需要考虑的最后一个网格是烟囱。再一次，我们将创建一个几何体（这次是锥形），它开始沿着$Y$轴。烟囱也指向上方，所以我们不需要在创建后旋转这个网格。

{{% note %}}
TODO-DIAGRAM: seems kind of sad there is no chimney diagram
(comment from a reader)
{{% /note %}}

在使用旋转时，我们通常会使用[three.js辅助函数`.degToRad`](https://threejs.org/docs/#api/en/math/MathUtils.degToRad)将[度数转换为弧度数]({{< relref "/book/first-steps/animation-loop#scale-the-cubes-rotation-by-delta" >}} "度数转换为弧度数")。然而，许多度数很容易写成弧度，因为$180^{\circ} = \pi$弧度，如此简单的除法会给我们提供一系列其他弧度值，特别是， $90^{\circ} = \frac{\pi}{2}$和$45^{\circ} = \frac{\pi}{4}$。

{{< code lang="js" linenos="false" caption="各种顺时针和逆时针旋转" >}}
// 90 degrees anti-clockwise around the X-axis
mesh.rotation.x = Math.PI / 2;

// 90 degrees clockwise around the X-axis
mesh.rotation.x = -Math.PI / 2;

// 90 degrees anti-clockwise around the Y-axis
mesh.rotation.y = Math.PI / 2;

// 90 degrees clockwise around the Z-axis
mesh.rotation.z = -Math.PI / 2;

// 45 degrees clockwise around the X-axis
mesh.rotation.x = -Math.PI / 4;

// 45 degrees anti-clockwise around the Y-axis
mesh.rotation.y = Math.PI / 4;
{{< /code >}}

## 一个简单的玩具火车模型

有了这么多关于旋转的话题，希望火车的建造会很容易，所以让我们开始吧。我们还将使用这个简单的模型作为为未来更复杂的场景组件构建模板的机会。为此，我们将为几何体、材质和网格创建单独的模块，然后创建一个`Train`类来协调其他模块并提供一个最小的接口在`World`内使用。

如果这听起来很熟悉，那是因为这是我们如何设置[World应用程序]({{< relref "/book/first-steps/world-app#the-world-app" >}} "World应用程序")的一个缩影。有两个原因：

1. **熟悉度**: 我们代码的各个部分越相似，切换焦点时我们就越不需要考虑。
2. **可重用性**: 正如我们希望能够将 _**World/**_ 文件夹交给另一个开发人员，只需一段说明如何使用它，我们希望能够在我们的应用程序之间轻松复制 _**Train/**_ 组件。

另一方面，对于您创建的每个可能的组件，这种结构并不是最好的。始终确保您的代码结构支持您尝试构建的内容，而不是让您与之抗争。

在编辑器中，我们删除了上一章中的 _**meshGroup.js**_ 模块，并将其替换为新的 _**components/Train/**_ 文件夹。如果您在自己的机器上做开发，那么现在就去做吧。在这个文件夹中，有四个模块：

- _**components/Train/geometries.js**_
- _**components/Train/materials.js**_
- _**components/Train/meshes.js**_
- _**components/Train/Train.js**_

### _**geometries.js**_、_**materials.js**_、和 _**meshes.js**_ 的初始结构

前两个模块遵循与我们迄今为止创建的所有其他[组件和系统]({{< relref "/book/first-steps/world-app#systems-and-components" >}} "组件和系统")类似的格式。

{{< code lang="js" linenos="" caption="_**Train/geometries.js**_: 初始结构" >}}
import { BoxBufferGeometry, CylinderBufferGeometry } from 'three';

function createGeometries() {}

export { createGeometries }
{{< /code >}}

{{< code lang="js" linenos="" caption="_**Train/materials.js**_: 初始结构" >}}
import { MeshStandardMaterial } from 'three';

function createMaterials() {}

export { createMaterials }
{{< /code >}}

最后是网格模块。这与其他两个类似，但是，网格将需要其他两个模块创建的几何体和材质，因此在我们从three.js核心导入`Mesh`之后，将它们导入模块顶部（vendor导入将始终在我们的本地导入之前）。最后，调用每个函数并将结果存储在`geometries`和`materials`变量中。

{{< code lang="js" linenos="" caption="_**Train/meshes.js**_: 初始结构" >}}
import { Mesh } from 'three';

import { createGeometries } from './geometries.js';
import { createMaterials } from './materials.js';

function createMeshes() {
const geometries = createGeometries();
const materials = createMaterials();
}

export { createMeshes }
{{< /code >}}

### `Train`类继承自`Group`

接下来，`Train`类。在这里，我们将做一些新的事情并[_继承_ `Group`类]({{< relref "/book/appendix/javascript-reference#class-inheritance-and-the-extends-keyword" >}} "_继承_ `Group`类")：

{{< code lang="js" linenos="" caption="_**Train.js**_: 继承group类" >}}
import { Group } from 'three';

class Train extends Group {
constructor() {
super();
}
}

export { Train }
{{< /code >}}

注意`super()`的使用。这意味着`Train`类现在具有`Group`的所有常规功能。特别是，我们可以向其中添加对象，我们可以直接将其添加到我们的场景中：

{{< code lang="js" linenos="false" caption="通过继承`Group`，一旦我们创建了一个火车，我们就可以将它直接添加到我们的场景中。" >}}
const train = new Train();

// we can add objects to our train
train.add(mesh);

// and we can add the train directly to the scene
scene.add(train);
{{< /code >}}

我们还可以从类本身向火车添加对象，使用`this.add`：

{{< code lang="js" linenos="false" caption="通过继承`Group`，我们可以在构造函数中为火车添加一个网格。" >}}
class Train extends Group {
constructor() {
super();

    const mesh = new Mesh(...);

    this.add(mesh);

}
}
{{< /code >}}

### 导入网格

使用这些知识，我们可以完成`Train`类的设置。首先，导入`createMeshes`函数，然后调用它并将结果存储在成员变量`this.meshes`中。在本章的最后，我们将为轮子添加一些动画，这意味着我们需要从构造函数外部访问网格，因此这里使用了成员变量。

{{< code lang="js" linenos="" linenostart="1" hl_lines="3 4 5 11" caption="_**Train.js**_: 导入和创建网格" >}}

```js
import { Group } from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";
import { createMeshes } from "./meshes.js";

class Train extends Group {
  constructor() {
    super();

    this.meshes = createMeshes();
  }
}

export { Train };
```

{{< /code >}}

### _**World.js**_ 设置

在World中，导入`Train`类。如果您正在使用上一章中的代码，请从文件中删除对`meshGroup`的所有引用。

{{< code file="worlds/first-steps/built-in-geometries/src/World/World.final.js" from="1" to="13" lang="js" hl_lines="8" linenos="true" caption="_**World.js**_: 导入火车" >}}{{< /code >}}

接下来，创建火车实例并将其添加到场景中。

{{< code lang="js" linenos="" linenostart="21" hl_lines="30 32" caption="_**World.js**_: 创建火车实例并将其添加到场景中" >}}

```js
constructor(container) {
  camera = createCamera();
  renderer = createRenderer();
  scene = createScene();
  loop = new Loop(camera, scene, renderer);
  container.append(renderer.domElement);

  const controls = createControls(camera, renderer.domElement);
  const { ambientLight, mainLight } = createLights();
  const train = new Train();

  scene.add(ambientLight, mainLight, train);

  const resizer = new Resizer(container, camera, renderer);

  scene.add(createAxesHelper(), createGridHelper());
}
```

{{< /code >}}

### 其他改变

请注意，我们还对 _**camera.js**_ 中的相机位置进行了一些小调整，稍微移动了controls.js中的[`controls.target`]({{< relref "/book/first-steps/camera-controls#manually-set-the-target" >}} "`controls.target`")位置以更好地展示火车，并降低了 _**lights.js**_ 中两个灯光的强度。

### 创建材质

至此，我们已经完成了新场景组件的结构创建。剩下的就是设置材质、几何形状和网格。这些不必采取构建火车的形式。您可以使用此结构作为模板来创建您梦寐以求的任何形状。

我们将为火车创建两种材质：一种用于烟囱和车轮的深灰色材质，一种用于车身的淡红色材质。我们将对两者都使用启用了[`.flatShading`](#the-material-flatshading-property)的[`MeshStandardMaterial`]({{< relref "/book/first-steps/physically-based-rendering#introducing-the-meshstandardmaterial" >}} "`MeshStandardMaterial`")。除了`.flatShading`，这里没有什么新东西。这是完整的材质模块：

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/materials.final.js" from="1" to="17" lang="js" linenos="true" caption="_**materials.js**_: 完整代码" >}}{{< /code >}}

我们为车身选择了`firebrick`红色，同时为车轮和烟囱选择了`darkslategray`，但您可以查看[CSS颜色列表](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)并挑选出您喜欢的两种。在模块的最后，我们返回一个包含两种材质的对象，以便在 _**meshes.js**_ 中使用。

### 创建几何体

对于火车的每个部分，我们将只使用两种类型的几何体：用于货舱的盒子几何体，以及用于其他所有部分的具有各种参数的[圆柱几何体](#introducing-the-cylinderbuffergeometry)。

#### 货舱几何体

首先是箱形货舱。一个`BoxBufferGeometry`就够了。使用以下参数创建一个：

| 长度 | 宽度  | 高度 |
| ------ | ------ | ------ |
| $2$    | $2.25$ | $1.5$  |

{{< code lang="js" linenos="" linenostart="3" hl_lines="4" caption="_**geometries.js**_: 创建货舱几何体" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);
}
```

{{< /code >}}

长度、宽度和高度的不同值会给我们一个矩形盒，这与我们在前几章中使用的立方体不同。

#### 鼻子几何体

接下来，使用以下参数为鼻子创建第一个`CylinderBufferGeometry`：

| 顶部半径 | 底部半径 | 高度 | 径向段 |
| ---------- | ------------- | ------ | --------------- |
| $0.75$     | $0.75$        | $3$    | $12$            |

`radiusTop`和`radiusBottom`相等，所以我们将得到一个圆柱体。`radialSegments`的值为$12$，与`Material.flatShading`结合使用时，会使圆柱体看起来像是经过粗略雕刻的。

{{< code lang="js" linenos="" linenostart="3" hl_lines="6" caption="_**geometries.js**_: 创建鼻子几何体" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);
}
```

{{< /code >}}

#### 车轮几何体

我们可以为所有四个轮子重复使用一个`CylinderBufferGeometry`，甚至是大后轮。您可以在任意数量的网格中重复使用几何体，然后为每个网格更改`.position`、`.rotation`和`.scale`。这比为每个网格创建新几何体更有效，您应该尽可能这样做。使用以下参数创建圆柱几何体：

| 顶部半径 | 底部半径 | 高度 | 径向段 |
| ---------- | ------------- | ------ | --------------- |
| $0.4$      | $0.4$         | $1.75$ | $16$            |

较高的值为16的`radialSegments`将使车轮看起来更圆润。我们正在为三个较小的车轮创建正确尺寸的几何体，因此，稍后我们将不得不增加较大后轮的尺寸。

{{< code lang="js" linenos="" linenostart="3" hl_lines="9" caption="_**geometries.js**_: 创建车轮几何体" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
}
```

{{< /code >}}

#### 烟囱几何体

最后是烟囱。它是一个圆锥体，而不是圆柱体，但如上所述，如果我们创建一个`radiusTop`和`radiusBottom`具有不同值的圆柱体几何体，结果将是一个圆锥体形状。这一次，保留`radialSegments`默认值8。

| 顶部半径 | 底部半径 | 高度 | 径向段 |
| ---------- | ------------- | ------ | --------------- |
| $0.3$      | $0.1$         | $0.5$  | default value   |

{{< code lang="js" linenos="" linenostart="3" hl_lines="12" caption="_**geometries.js**_: 创建烟囱几何体" >}}

```js
function createGeometries() {
  const cabin = new BoxBufferGeometry(2, 2.25, 1.5);

  const nose = new CylinderBufferGeometry(0.75, 0.75, 3, 12);

  // we can reuse a single cylinder geometry for all 4 wheels
  const wheel = new CylinderBufferGeometry(0.4, 0.4, 1.75, 16);

  // different values for the top and bottom radius creates a cone shape
  const chimney = new CylinderBufferGeometry(0.3, 0.1, 0.5);
}
```

{{< /code >}}

#### 最终几何体模块

最后，在函数末尾将所有几何体作为对象返回。将所有这些放在一起，这是最终的几何体模块：

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/geometries.final.js" from="1" to="22" hl_lines="14-19" lang="js" linenos="true" caption="_**geometries.js**_: 最终代码" >}}{{< /code >}}

### 创建网格

剩下的就是创建网格。首先，我们将分别创建货舱、鼻子和烟囱，然后[我们将创建一个轮子然后`.clone`它]({{< relref "/book/first-steps/organizing-with-group#clone-the-protosphere" >}} "我们将创建一个轮子然后`.clone`它")来创建其他三个轮子。

#### 货舱和烟囱网格

[像往常一样创建货舱和烟囱网格]({{< relref "/book/first-steps/first-scene#our-first-visible-object-mesh" >}} "像往常一样创建货舱和烟囱网格")，使用货舱的主体材料和烟囱的细节材料，然后将每个网格移动到位。

{{< code lang="js" linenos="" linenostart="6" hl_lines="10 11 13 14" caption="_**meshes.js**_: 创建货舱和烟囱" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);
}
```

{{< /code >}}

为位置输入的值是一些反复试验的结果。但是，通过练习，您会发现定位对象变得更加直观和快捷。正如我们上面提到的，不需要旋转烟囱，因为在我们创建它时它已经正确定向。

#### 鼻子网格

接下来是大红鼻子。使用`geometries.nose`和`materials.body`正常创建网格。这次[我们需要旋转](#working-with-rotations)和定位网格：

{{< code lang="js" linenos="" linenostart="6" hl_lines="16-18" caption="_**meshes.js**_: 创建鼻子" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;
}
```

{{< /code >}}

这样就完成了火车的红色车身以及烟囱。

#### 创建车轮原型

现在，轮子。我们将首先创建`smallWheelRear`，然后克隆它以创建其余部分，就像我们[在上一章中创建`protoSphere`那样]({{< relref "book/first-steps/organizing-with-group#create-the-prototype-mesh" >}} "在上一章中创建`protoSphere`那样")。创建`smallWheelRear`网格，然后**沿$Y$轴将其向下平移半个单位**将其定位在火车下方。然后，[沿着$X$轴旋转它](#working-with-rotations)。

{{< code lang="js" linenos="" linenostart="6" hl_lines="20-22" caption="_**meshes.js**_: 创建第一个轮子" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;
}
```

{{< /code >}}

当我们克隆这个轮子来创建其余的轮子时，**克隆的网格将继承原型的变换**。这意味着克隆的轮子将开始正确旋转并定位在火车的底部，我们只需要将它们沿着$X$轴正确定位即可。

#### 创建其他小轮子 {#create-small-wheels}

克隆proto-wheel以创建另外两个小轮子，然后将每个轮子移动以沿$X$轴正确定位：

{{< code lang="js" linenos="" linenostart="6" hl_lines="24 25 27 28" caption="_**meshes.js**_: 创建其他小轮子" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;
}
```

{{< /code >}}

#### 创建大后轮

我们火车的最后一块是大后轮。再次克隆小轮子，然后将其移动到火车后部的位​​置。这一次，我们还需要对其进行缩放以使其更大：

{{< code lang="js" linenos="" linenostart="6" hl_lines="30-32" caption="_**meshes.js**_: 创建大后轮" >}}

```js
function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const cabin = new Mesh(geometries.cabin, materials.body);
  cabin.position.set(1.5, 1.4, 0);

  const chimney = new Mesh(geometries.chimney, materials.detail);
  chimney.position.set(-2, 1.9, 0);

  const nose = new Mesh(geometries.nose, materials.body);
  nose.position.set(-1, 1, 0);
  nose.rotation.z = Math.PI / 2;

  const smallWheelRear = new Mesh(geometries.wheel, materials.detail);
  smallWheelRear.position.y = 0.5;
  smallWheelRear.rotation.x = Math.PI / 2;

  const smallWheelCenter = smallWheelRear.clone();
  smallWheelCenter.position.x = -1;

  const smallWheelFront = smallWheelRear.clone();
  smallWheelFront.position.x = -2;

  const bigWheel = smallWheelRear.clone();
  bigWheel.position.set(1.5, 0.9, 0);
  bigWheel.scale.set(2, 1.25, 2);
}
```

{{< /code >}}

通过缩放，我们将大轮的直径增加了一倍，并将其长度增加了1.25。但是我们如何确定要在哪些轴上进行缩放？

{{< figure src="first-steps/wheel_initial_rotation.svg" class="medium left noborder" lightbox="true" caption="初始圆柱几何体方向" >}}

再次查看新创建的`CylinderBufferGeometry`的初始位置。**缩放独立于旋转发生，因此即使我们旋转了网格，我们也必须根据原始的、未旋转的几何体来决定如何缩放**。通过检查此图，我们可以看到要增加高度，我们需要在$Y$轴进行缩放，而为了增加直径，我们需要在$X$轴和$Z$轴同时进行等比例缩放。这给了我们最终的`.scale`值$(2, 1.25, 2)$。

#### 最终网格模块

综上所述，这是最终的网格模块。再一次，我们返回了一个对象，其中包含用于火车模块的所有网格。

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/meshes.final.js" from="1" to="45" hl_lines="34-42" lang="js" linenos="true" caption="_**meshes.js**_: 完整代码" >}}{{< /code >}}

### 将网格添加到火车

接下来，我们将网格添加到火车。我们将在火车的构造函数中执行此操作。

{{< code lang="js" linenos="" linenostart="7" hl_lines="13-21" caption="_**Train.js**_: 将网格添加到Train组中" >}}

```js
class Train extends Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.nose,
      this.meshes.cabin,
      this.meshes.chimney,
      this.meshes.smallWheelRear,
      this.meshes.smallWheelCenter,
      this.meshes.smallWheelFront,
      this.meshes.bigWheel
    );
  }
}
```

{{< /code >}}

这样，火车应该出现在您的场景中。

{{< inlineScene entry="first-steps/toy-train-autorotate.js" >}}

### 旋转车轮！

最后，让我们让轮子旋转。[按照我们对所有动画对象使用的相同模式]({{< relref "/book/first-steps/animation-loop#the-cubetick-method" >}} "按照我们对所有动画对象使用的相同模式")，给火车一个`.tick`方法。

{{< code lang="js" linenos="" linenostart="7" hl_lines="12" caption="_**Train.js**_: 创建一个空的tick方法" >}}

```js
class Train extends Group {
  constructor() {
    // ... lines skipped for clarity
  }

  tick(delta) {}
}
```

{{< /code >}}

接下来，在World中，将火车添加到updatables数组中。

{{< code file="worlds/first-steps/built-in-geometries/src/World/World.final.js" from="21" to="38" hl_lines="32" lang="js" linenos="true" caption="_**World.js**_: 将火车添加到updatables数组中" >}}{{< /code >}}

{{< figure src="first-steps/wheel_initial_rotation.svg" class="small right noborder" lightbox="true" caption="初始圆柱几何方向" >}}

现在，我们需要弄清楚轮子在哪个轴上旋转。再次参考初始圆柱几何方向图。我们希望它围绕通过其中心的轴旋转，即是$Y$轴。事实上，我们已经沿着$Z$轴旋转了轮子并不会改变这一点。

接下来，我们需要弄清楚轮子旋转的速度。我们将以$24^{\circ}$每秒的速度给我们每十五秒一个完整的旋转。像往常一样，我们必须使用`degToRad`辅助函数将其转换为弧度。

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js" from="1" to="7" hl_lines="1 5" lang="js" linenos="true" caption="_**Train.js**_: 以每秒度数计算轮速" >}}{{< /code >}}

最后，更新tick方法以旋转四个轮子中的每一个。像往常一样，我们必须在这里按delta缩放每秒速度。请参考[动画循环]({{< relref "/book/first-steps/animation-loop#timing-in-the-animation-system" >}} "动画循环")，了解我们为什么这样做。

{{< code file="worlds/first-steps/built-in-geometries/src/World/components/Train/Train.final.js" from="24" to="29" hl_lines="25-28" lang="js" linenos="true" caption="_**Train.js**_: 旋转轮子，按delta缩放每秒速度" >}}{{< /code >}}

进行此更改后，轮子应该开始旋转，这样，我们的玩具火车就完成了！

## 简单的形状以外的世界

{{< iframe src="https://threejs.org/examples/webgl_materials_normalmap.html" width="500" title="使用内置几何创建这样的复杂模型是不可能的" caption="使用内置几何创建这样的复杂模型是不可能的" class="medium right" >}}

最后两章向我们展示了内置three.js几何体的优势和局限性。在循环中创建10或1000个网格克隆很容易，同样创建玩具火车这样的简单模型相对容易。然而，创造像猫或人这样的真实世界对象很快就会让我们不知所措。即使对于像这个模型这样基本的模型，将火车部件移动到位所需的反复试验也需要一些时间。

要创建真正令人惊叹的模型，我们需要使用为此目的设计的外部程序，然后将模型加载到three.js中。在下一章中，我们将看到如何做到这一点。

## 挑战

{{% aside success %}}

### 简单

1. 有什么比玩具火车更好的呢？两个玩具火车怎么样？你可以`.clone`整个火车之后在创建它。现在就这样做，然后调整第二列火车的`.position`。不要忘记将它添加到场景中！

2. 有什么比两辆玩具火车更好的呢？[在循环中创建一大堆火车]({{< relref "/book/first-steps/organizing-with-group#clone-the-protosphere" >}} "在循环中创建一大堆火车")。在循环中，确保移动每辆新火车，使它们不会全部堆叠在一起，然后将它们添加到场景中。看看有多少有趣的方式可以定位克隆的火车。

_这两个任务都应该在**World.js**中完成。_

{{% /aside %}}

{{% aside %}}

### 中等

1. 你能在货舱里创造一个窗户吗？没有办法在几何体上打孔（不使用外部库），因此您必须从几个盒子几何体中重建货舱。一种方法是为地板创建一个大盒子，然后为屋顶创建另一个大盒子，最后，围绕屋顶边缘创建四个用于支柱的小盒子（或圆柱体）。

2. 没有轨道的火车走不了多远！在车轮下添加一些轨道。创建两个主要轨道，然后在轨道下创建一个枕木并使用克隆创建其余部分。

3. 每辆火车都需要一名售票员！创建一个站在火车旁边的简单人形（如乐高角色）。

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 你还能做些什么来改善这个场景？从火车的烟囱冒出一些气泡怎么样（用`SphereBufferGeometry`来制造气泡）。天上有些云怎么样？如何为烟雾和云设置动画？

{{% /aside %}}
