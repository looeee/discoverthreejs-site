---
title: "你的第一个three.js场景：你好，立方体！"
description: "在本章中，我们构建了第一个three.js场景并创建了three.js的Hello World应用程序：一个简单的白色立方体。 在此过程中，我们引入了许多重要的概念，例如场景、渲染器和相机。"
date: 2018-04-02
weight: 102
chapter: "1.2"
available: true
showIDE: true
IDEFiles: [
  'styles/main.css',
  'vendor/three/build/three.module.js',
  'worlds/first-steps/first-scene/index.html',
  'worlds/first-steps/first-scene/src/main.start.js',
  'worlds/first-steps/first-scene/src/main.final.js',
]
IDEComparisonMode: true
IDEClosedFolders: ['styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/first-scene/'
IDEActiveDocument: 'index.html'
IDEActiveDocument: 'src/main.js'
---

# 你的第一个 three.js 场景：你好，立方体！

在本章中，我们将创建 three.js 的 Hello World 应用程序：一个简单的白色立方体。由于我们已经建立了一个简单的网页，如上一章所述，我们需要做的就是在 _**src/main.js**_ 中编写几行 JavaScript 代码，我们的应用程序就会运行起来。我们将在此过程中介绍相当多的理论，但实际代码很短。下面是该文件在本章结束时的样子。不算导入语句和注释，总共有不到二十行代码。这就是创建一个简单的“你好，立方体！”的 three.js 应用程序所需要的全部内容。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" linenos="" caption="_**main.js**_: 最终结果" >}}{{< /code >}}

点击在编辑器左上角的<input type="checkbox" class="simple-toggle" title="Find the real toggle!">切换按钮以[查看此代码的运行情况]({{< relref "/book/introduction/about-the-book#before-and-after-code-comparison" >}} "查看此代码的运行情况")，或者，如果您更喜欢在 [本地工作]({{< relref "/book/introduction/about-the-book#working-on-your-own-machine" >}} "本地工作")，您可以单击{{< icon "solid/download" >}}按钮下载包含编辑器中所有文件的 zip 存档。如果您不熟悉此处的 JavaScript，请参阅附录中的 [A.2：JavaScript 参考]({{< relref "/book/appendix/javascript-reference" >}} "A.2：JavaScript 参考") 和 [A.3：文档对象模型和 DOM API]({{< relref "/book/appendix/dom-api-reference" >}} "A.3：文档对象模型和 DOM API")。

## 实时 3D 应用程序组件

{{% note %}}
TODO-DIAGRAM: This graph is confusing - Annie Chen
{{% /note %}}

{{< figure src="first-steps/rendered_scene_canvas.svg" alt="A basic scene" lightbox="true" >}}

在开始编写代码之前，让我们先看看构成每个 three.js 应用程序的基本组件。首先是场景、相机和渲染器，它们构成了应用程序的基本脚手架。接下来是 HTML[`<canvas>`元素]({{< relref "/book/first-steps/app-structure#adding-a-three-js-scene-to-the-page" >}} "`<canvas>`元素")，我们可以在其中看到结果。最后但并非最不重要的一点是，有一个可见的对象，例如网格。除了画布 canvas（特定于浏览器）之外，在任何 3D 图形系统中都可以找到与这些组件中的每一个等效的组件，从而使您在这些页面中获得的知识具有高度可转移性。

### 场景：小宇宙

**场景是我们能看到的一切的载体**。您可以将其视为所有 3D 对象都存在于其中的“小宇宙”。我们用来创建场景的 three.js 类简称为[`Scene`](https://threejs.org/docs/#api/en/scenes/Scene). 其构造函数不带参数。

{{< code linenos="false" caption="创建一个`scene`" >}}
import { Scene } from 'three';

const scene = new Scene();
{{< /code >}}

{{< figure src="first-steps/coordinate_system_simple.svg" caption="世界空间坐标系，由场景定义" class="small left" lightbox="true" >}}

{{% note %}}
TODO-LOW: replace all coordinate diagrams with a 3D coordinate systems
{{% /note %}}

场景`scene`定义了一个名为**World Space（世界空间）**的坐标系，它是我们在 three.js 中处理可见对象时的主要参考框架。世界空间是一个[3D 笛卡尔坐标系](https://mathinsight.org/cartesian_coordinates)。我们将在[1.5：变换和坐标系中]({{< relref "/book/first-steps/transformations#coordinate-systems" >}} "1.5：变换和坐标系中")更详细地探讨这个怎么理解以及如何使用世界空间。

场景的中心是点$(0,0,0)$，也称为坐标系的**原点**。每当我们创建一个新对象并将其添加到我们的场景中时，它将被放置在原点，并且每当我们移动它时，我们说的都是在这个坐标系中移动它。

{{< figure src="first-steps/scene_graph.svg" caption="添加到场景中的对象存在于场景图中，<br> 可见对象的树" class="small right" lightbox="true" >}}

当我们将对象添加到场景中时，它们会被放入[**场景图中**](http://what-when-how.com/advanced-methods-in-computer-graphics/scene-graphs-advanced-methods-in-computer-graphics-part-1/)，这是一个树形结构，场景位于顶部。

{{< clear >}}

{{< figure src="appendix/html-tree.svg" caption="HTML页面上的元素也形成树状结构" class="small left" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: improve scene graph diagram - add at least a camera as well
{{% /note %}}

这类似于 HTML 页面上元素的结构方式，不同之处在于 HTML 页面是 2D 而场景图是 3D。

### 相机：指向小宇宙的望远镜

场景的小宇宙是指纯数学的领域。要查看场景，我们需要打开一个进入这个领域的窗口，并将其转换为对我们人眼感觉合理的东西，这就是相机的用武之地。有几种方法可以将场景图形转换为人类视觉友好的格式，使用称为**投影**的技术。对我们来说，最重要的投影类型是**透视投影**，它旨在匹配我们的眼睛看待世界的方式。要使用透视投影查看场景，我们使用[`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)。 这种类型的相机是现实世界中相机的 3D 等效物，并使用许多相同的概念和术语，例如视野和纵横比。与场景`Scene`不同的是，`PerspectiveCamera`构造函数有几个参数，我们将在下面详细解释。

{{% note %}}
TODO-DIAGRAM: add simple diagram of perspective projection here
{{% /note %}}

{{< code linenos="false" caption="创建一个`PerspectiveCamera`" >}}
import { PerspectiveCamera } from 'three';

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
{{< /code >}}

另一种重要的投影类型是**正交投影**，我们可以使用[`OrthographicCamera`](https://threejs.org/docs/#api/en/cameras/OrthographicCamera)。 如果您曾经研究过工程图或蓝图，您可能会熟悉这种类型的投影，它对于创建 2D 场景或覆盖 3D 场景的用户界面很有用。在本书中，我们将使用 HTML 来创建用户界面，并使用 three.js 来创建 3D 场景，所以我们将在大部分情况下坚持使用`PerspectiveCamera`。

以下示例显示了这两款相机之间的区别。左侧显示使用`OrthographicCamera`（按键 O）或`PerspectiveCamera`（按键 P）渲染的场景，而视图右侧显示相机的缩小概览：

{{< iframe src="https://threejs.org/examples/webgl_camera.html" height="500" title="OrthographicCamera 和 PerspectiveCamera 的实际应用" caption="OrthographicCamera 和 PerspectiveCamera 的实际应用" >}}

{{% note %}}
TODO-LOW: improve this - simple show ortho left and perspective right
{{% /note %}}

### 渲染器：具有非凡才能和速度的艺术家

如果场景是一个小宇宙，而相机是一个指向那个宇宙的望远镜，那么渲染器就是一个艺术家，他通过望远镜观察并将他们看到的东西 _非常快_ 的绘制到一个`<canvas>`中去。 我们把这个过程叫做**渲染**，得到的图片就是一个渲染效果图。在本书中，我们将专门使用[`WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) —— 它使用[**WebGL2**](https://en.wikipedia.org/wiki/WebGL)来渲染我们的场景 （如果可用），如果不可用则回退到**WebGL V1**。渲染器的构造函数确实接受了几个参数，但是，如果我们不显示传入这些参数，它将使用默认值，目前这对于我们来说没问题。

{{% note %}}
TODO-LOW: if WEBGPU becomes a thing this will have to be updated
{{% /note %}}

{{< code linenos="false" caption="使用默认参数创建渲染器" >}}
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();
{{< /code >}}

**场景、相机和渲染器一起为我们提供了 three.js 应用程序的基本脚手架**。但是，_一个都看不到_。在本章中，我们将介绍一种称为**网格**的可见对象。

## 我们的第一个可见对象：网格 Mesh

{{< figure src="first-steps/mesh_details.svg" caption="网格包含几何体和材质" lightbox="true" class="medium left" >}}

**[网格](https://threejs.org/docs/#api/en/objects/Mesh)是 3D 计算机图形学中最常见的可见对象**，用于显示各种 3D 对象——猫、狗、人类、树木、建筑物、花卉和山脉都可以使用网格来表示。还有其他种类的可见对象，例如线条、形状、精灵和粒子等，我们将在后面的部分中看到所有这些，但在这些介绍性章节中我们将坚持使用网格。

{{< code linenos="false" caption="创建一个网格对象" >}}
import { Mesh } from 'three';

const mesh = new Mesh(geometry, material);
{{< /code >}}

如您所见，`Mesh`构造函数有两个参数：**几何**和**材质**。在创建网格之前，我们需要创建这两个。

### 几何体

**几何体定义了网格的形状**。我们将使用一种称为[`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry)的几何体。在这里，我们需要一个盒子形状，所以我们将使用[`BoxBufferGeometry`](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry)，它是 three.js 核心中提供的几个基本形状之一。

{{< code linenos="false" caption="创建2x2x2盒形几何体" >}}
import { BoxBufferGeometry } from 'three';

const length = 2;
const width = 2;
const depth = 2;

const geometry = new BoxBufferGeometry(length, width, depth);
{{< /code >}}

构造函数最多需要六个参数，但在这里，我们只提供前三个参数，它们指定盒子的长度、宽度和深度。默认值将被提供给我们省略的任何其他参数。您可以在下面的场景中使用所有六个参数。

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#BoxGeometry" height="500" title="The BoxBufferGeometry in action" caption="BoxBufferGeometry示例" >}}

### 材料

虽然几何体定义了形状，**但材质定义了网格表面的外观**。我们将在本章中使用[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) ，这是可用的最简单的材质，更重要的是，不需要我们在场景中添加任何灯光。现在，我们将省略所有参数，这意味着将创建默认的白色材质。

{{< code linenos="false" caption="创建基本材料" >}}
import { MeshBasicMaterial } from 'three';

const material = new MeshBasicMaterial();
{{< /code >}}

许多参数可在此处进行测试。_Material_ 菜单具有所有 three.js 材质通用的参数，而 _MeshBasicMaterial_ 菜单具有仅属于该材质的参数。

{{< iframe src="https://threejs.org/docs/scenes/material-browser.html#MeshBasicMaterial" height="500" title="The MeshBasicMaterial in action" caption="`MeshBasicMaterial`示例" >}}

## 我们的第一个 three.js 应用程序 {#simple-steps}

现在我们准备好编写一些代码了！我们已经介绍了构成我们简单应用程序的所有组件，因此下一步是弄清楚它们如何组合在一起。我们将把这个过程分成六个步骤。您创建的每个 three.js 应用程序都需要所有这六个步骤，尽管更复杂的应用程序通常需要更多。

1. **[初始设置](#setup)**
2. **[创建场景](#create-scene)**
3. **[创建相机](#create-camera)**
4. **[创建可见对象](#create-visible)**
5. **[创建渲染器](#create-renderer)**
6. **[渲染场景](#render-scene)**

## 1. 初始设置 {#setup}

初始设置的一个重要部分是创建某种网页来托管我们的场景，这个我们在上一章中已经介绍过。在这里，我们将专注于我们需要编写的 JavaScript。首先，我们将从 three.js 中导入必要的类，然后我们将从 _**index.html**_ 文件中获取对该`scene-container`元素的引用。

### 从 three.js 中导入类

总结到目前为止我们介绍的所有组件，我们可以看到我们需要这些类：

- `BoxBufferGeometry`
- `Mesh`
- `MeshBasicMaterial`
- `PerspectiveCamera`
- `Scene`
- `WebGLRenderer`

我们还将使用`Color`类来设置场景的背景颜色：

- `Color`

我们可以仅使用单个`import`语句从 three.js 核心导入我们需要的所有内容。

{{< code from="1" to="9" file="worlds/first-steps/first-scene/src/main.final.js" caption="_**main.js**_: 使用NPM模式导入需要的three.js类" >}}{{< /code >}}

如果您在本地工作（而不是使用 Webpack 之类的捆绑程序），则必须更改导入路径。例如，您可以改为从 skypack.dev 导入。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="_**main.js**_:  从CDN导入所需的three.js类" >}}

```js
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "https://cdn.skypack.dev/three@0.132.2";
```

{{< /code >}}

如果您需要有关导入 three.js 类的工作原理的提示，请参考[0.5：如何在您的项目中包含 three.js]({{< relref "/book/introduction/get-threejs#imports-in-the-inline-code-editor" >}} "0.5：如何在您的项目中包含 three.js") ，或者如果您想复习 JavaScript 模块，请跳至 [A.4：JavaScript 模块]({{< relref "/book/appendix/javascript-modules" >}} "A.4：JavaScript 模块")。

### JavaScript 中访问 HTML 的`scene-container`元素

在 _**index.html**_ 中，我们创建了一个`scene-container`元素。

{{< code from="17" to="23" hl_lines="20 21 22" file="worlds/first-steps/first-scene/index.html" lang="html" caption="_**index.html**_: 容器元素" >}}{{< /code >}}

渲染器会自动为我们创建一个`<canvas>`元素，我们将把它插入到这个容器中。通过这样做，我们可以通过使用 CSS 设置容器的大小来控制场景的大小和位置（如[上一章]({{< relref "/book/first-steps/app-structure#adding-a-three-js-scene-to-the-page" >}} "上一章")所述）。首先，我们需要在 JavaScript 中访问容器元素，我们将使用
[`document.querySelector`]({{< relref "/book/appendix/dom-api-reference#accessing-html-elements" >}} "`document.querySelector`")。

{{< code from="11" to="12" file="worlds/first-steps/first-scene/src/main.final.js" caption="_**main.js**_: 获取对场景容器的引用" >}}{{< /code >}}

## 2.创建场景 {#create-scene}

{{< figure src="first-steps/scene_only.svg" alt="场景" class="small left" >}}

设置好之后，我们将从创建场景开始，我们自己的小宇宙。我们将使用[`Scene`](https://threejs.org/docs/#api/scenes/Scene)构造函数（带有大写的“S”）来创建一个`scene`实例（带有小写的“s”）：

{{< code from="14" to="15" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: 创建场景" >}}{{< /code >}}

### 设置场景的背景颜色 {#set-color}

接下来，我们将[场景背景的颜色](https://threejs.org/docs/#api/en/scenes/Scene.background)更改为天蓝色。如果我们不这样做，将使用默认颜色，即黑色。我们将使用我们在上面导入的`Color`类，将字符串`'skyblue'`作为参数传递给构造函数：

{{< code from="17" to="18" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: 设置场景的背景颜色" >}}{{< /code >}}

`'skyblue'`是一个[CSS 颜色名称](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)，我们可以在这里使用全部 140 种命名颜色中的任何一种。当然，不仅限于使用这几种颜色。您可以使用您的显示器可以显示的任何颜色，并且有几种指定它们的方法，就像在 CSS 中一样。

{{% note %}}
If you recall from the last chapter, we also used `'skyblue'` for the container element's background. When three.js renders the scene and inserts the `<canvas>` element into the page, by giving the container and the scene the same background color, we ensure that the transition is seamless.

{{< code from="24" to="35" hl_lines="34" file="styles/main.css" linenos="false" lang="css" caption="_**styles/main.css**_: the scene container background color">}}{{< /code >}}

Of course, not every three.js scene will have a simple colored background, so this is not always possible.:
{{% /note %}}

{{% note %}}
TODO-LINK: add link to color chapter
{{% /note %}}

## 3.创建相机 {#create-camera}

{{< figure src="first-steps/camera.svg" alt="相机" class="small left" >}}

在 three.js 核心中有几个不同的相机可用，但正如我们上面讨论的，我们将主要使用[`PerspectiveCamera`](https://threejs.org/docs/#api/cameras/PerspectiveCamera)，因为它绘制的场景视图看起来类似于我们的眼睛看到的真实世界。`PerspectiveCamera`构造函数有四个参数：

1. `fov`，或**视野**：相机的视野有多宽，以度为单位。
2. `aspect`，或**纵横比**：场景的宽度与高度的比率。
3. `near`, 或**近剪裁平面**：任何比这更靠近相机的东西都是不可见的。
4. `far`，或**远剪裁平面**：任何比这更远离相机的东西都是不可见的。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="20" to="26" lang="js" linenos="true" caption="_**main.js**_" >}}{{< /code >}}

这四个参数一起用于创建一个有边界的空间区域，我们称之为[**视锥体**](https://en.wikipedia.org/wiki/Viewing_frustum)。

### 相机的视锥体 {#viewing-frustum}

{{< figure src="first-steps/frustum.png" alt="截头锥体" title="截头锥体" caption="截头锥体" class="small left" >}}

**如果`scene`是一个微小的宇宙，永远向四面八方延伸，那么相机的视锥体就是我们可以 _看到_ 的部分**。_平截头体_ 是一个数学术语，意思是一个顶部被切掉的四边矩形金字塔。当我们通过`PerspectiveCamera`查看场景时，截锥体内的一切都是可见的，而它外面的一切都是不可见的。在下图中，**Near Clipping Plane**和**Far Clipping Plane**之间的区域是相机的视锥。

{{< figure src="first-steps/perspective_frustum.svg" alt="透视相机平截头体" lightbox="true" >}}

我们传递给构造函数的四个参数`PerspectiveCamera`分别创建了截锥体的一个方面：

1. **视野**定义了平截头体扩展的角度。小视场会产生窄截锥体，而宽视场会产生宽截锥体。
2. **纵横比**将平截头体与场景容器元素相匹配。当我们将其设置为容器的宽度除以其高度时，我们确保可以将类似矩形的平截头体完美的扩展到容器中。如果我们弄错了这个值，场景看起来会伸展和模糊。
3. **近剪切平面**定义了平截头体的小端（最接近相机的点）。
4. **远剪裁平面**定义了平截头体的大端（距相机最远）。

渲染器不会绘制场景中不在平截头体内的任何对象。如果一个物体部分在平截头体体内部，部分在平截头体外部，则外部的部分将被切掉（**剪掉**）。

{{% note %}}
TODO-DIAGRAM: better diagram of viewing frustum
TODO-LINK: add link to cameras section
{{% /note %}}

### 定位相机 {#position-camera}

我们创建的每个对象最初都位于场景的中心，$(0,0,0)$。 这意味着我们的相机当前位于$(0,0,0)$，我们添加到场景中的任何对象也将定位在$(0,0,0)$, 都在彼此之上混杂在一起。艺术性地放置相机是一项重要的技能，但是，现在，我们将简单地将其移回（ _朝向我们_ ）以给我们一个场景的概览。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="26" to="30" lang="js" linenos="true" caption="_**main.js**_: 将相机移回Z轴" >}}{{< /code >}}

设置任何对象的位置的方法都是一样的，无论是相机，网格，灯还是其他任何东西。我们可以一次设置位置的所有三个组成部分，就像我们在这里所做的那样：

{{< code lang="js" linenos="false" caption="将X、Y和Z轴一起设置" >}}
camera.position.set(0, 0, 10);
{{< /code >}}

或者，我们可以单独设置 X，Y 和 Z 轴：

{{< code lang="js" linenos="false" caption="单独设置X，Y和Z轴" >}}
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
{{< /code >}}

两种设置位置的方式都会给出相同的结果。位置存储在一个[`Vector3`](https://threejs.org/docs/#api/en/math/Vector3)，一个表示 3D 向量的 three.js 类中，我们将在[1.5：变换和坐标系中]({{< relref "/book/first-steps/transformations" >}} "1.5：变换和坐标系中")更详细地探讨它。

## 4.创建一个可见对象 {#create-visible}

{{< figure src="first-steps/box.png" alt="可见对象" class="small left" >}}

我们创建了一个`camera`用来查看事物，以及一个`scene`用来把它们放进去。下一步是创建我们可以看到的东西。在这里，我们将创建一个简单的盒子形状[`Mesh`](https://threejs.org/docs/#api/objects/Mesh)。正如我们上面提到的，网格有两个我们需要首先创建的子组件：几何体和材质。

### 创建几何体 {#create-geometry}

网格的几何定义了它的形状。如果我们创建一个盒子形状的几何体（就像我们在这里所做的那样），我们的网格将被塑造成一个盒子。如果我们创建一个球形几何体，我们的网格将呈球体形状。如果我们创建一个猫形几何体，我们的网格将被塑造成一只猫……你明白了。在这里，我们使用[`BoxBufferGeometry`](https://threejs.org/docs/#api/geometries/BoxBufferGeometry)。 这三个参数定义了盒子的宽度、高度和深度：

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="32" to="33" lang="js" linenos="true" caption="_**main.js**_: 创建一个盒子几何体" >}}{{< /code >}}

大多数参数都有默认值，因此即使文档说`BoxBufferGeometry`应该采用六个参数，我们也可以省略大部分参数，而 three.js 将使用默认值填充空白。**我们不必传入 _任何_ 参数**。

{{< code lang="js" linenos="false" caption="创建一个默认几何体" >}}
const geometry = new BoxBufferGeometry();
{{< /code >}}

如果我们省略所有参数，我们将得到一个默认框，它是$1 \times 1 \times 1$立方体。我们想要一个更大的立方体，所以我们传入上面的参数来创建一个$2 \times 2 \times 2$盒子。

### 创建材质 {#create-material}

{{% note %}}
TODO-DIAGRAM: add examples of stone cars etc. Great for visual learners. (Annie-chen)
{{% /note %}}

材料定义了对象的表面属性，或者换句话说，定义了对象 _看起来_ 是由什么制成的。**几何体告诉我们网格是一个盒子、一辆汽车或一只猫，而材质告诉我们它是一个金属盒子、一辆石质汽车或一只涂成红色的猫**。

在 three.js 中有不少资料。在这里，我们将创建一个[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)，这是可用的最简单（也是最快）的材料类型。此材质还会忽略场景中的任何灯光，并根据材质的颜色和其他设置为网格着色（阴影），这非常棒，因为我们还没有添加任何灯光。我们将在不向构造函数传递任何参数的情况下创建材质，因此我们将获得默认的白色材质。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="35" to="36" lang="js" linenos="true" caption="_**main.js**_: 创建默认材质" >}}{{< /code >}}

{{% aside %}}

### 你（通常）需要一盏灯才能看到

如果我们现在使用除`MeshBasicMaterial`之外的几乎任何其他材质类型，我们将无法看到任何东西，因为场景完全处于黑暗中。**就像在现实世界中一样，我们通常需要光线才能看到场景中的事物**。`MeshBasicMaterial`是该规则的一个例外。

对于 three.js 的新手来说，这是一个常见的混淆点，所以如果您看不到任何东西，请确保您已经在场景中添加了一些灯光，或者暂时将所有材质切换为`MeshBasicMaterial`. 我们将在[1.4：基于物理的渲染和照明]({{< relref "/book/first-steps/physically-based-rendering" >}} "1.4：基于物理的渲染和照明")中为场景添加一些灯光。
{{% /aside %}}

### 创建网格 {#create-mesh}

{{< figure src="first-steps/mesh_details.svg" alt="网格由几何体和材料组成" class="large" >}}

现在我们有了几何体和材质，我们可以创建我们的网格，将两者都作为参数传入。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="32" to="39" lang="js" linenos="true" caption="_**main.js**_: 创建网格" >}}{{< /code >}}

之后，我们可以随时使用`mesh.geometry`和`mesh.material`访问几何体和材质。

### 将网格添加到场景中

创建完成`mesh`后，我们需要将其添加到场景中。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="41" to="42" lang="js" linenos="true" caption="_**main.js**_: 将网格添加到场景中" >}}{{< /code >}}

稍后，如果我们想删除它，我们可以使用`scene.remove(mesh)`。 一旦网格被添加到场景中，我们称网格为场景的 _子节点_，我们称场景为网格的 _父节点_。

## 5. 创建渲染器 {#create-the-renderer}

{{< figure src="first-steps/rendered_scene_canvas.svg" alt="渲染好的场景输出到canvas元素中" lightbox="true" class="medium right" >}}

{{% note %}}
TODO-LOW: update if WebGPURenderer becomes default
{{% /note %}}

我们这个简单应用程序的最后一个组件是渲染器，它负责将场景绘制（**渲染**）到`<canvas>`元素中。我们将在这里使用[`WebGLRenderer`](https://threejs.org/docs/#api/renderers/WebGLRenderer)。还有一些其他渲染器可用作插件，但`WebGLRenderer`是迄今为止最强大的渲染器，通常是您唯一需要的渲染器。让我们现在继续创建一个`WebGLRenderer`，再次使用默认设置。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="44" to="45" lang="js" linenos="true" caption="_**main.js**_: 创建渲染器" >}}{{< /code >}}

### 设置渲染器的大小 {#set-renderer-size}

我们快到完成了！接下来，我们需要使用容器的宽度和高度告诉渲染器我们的场景大小。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="47" to="48" lang="js" linenos="true" caption="_**main.js**_: 设置渲染器的大小" >}}{{< /code >}}

如果你还记得，我们使用 CSS 使容器占据了整个浏览器窗口的大小（如[上一章]({{< relref "/book/first-steps/app-structure#adding-a-three-js-scene-to-the-page" >}} "上一章")所述），因此场景也将占据整个窗口。

{{% aside notice %}}
我们已经将渲染器的大小设置为容器的宽度和高度，_就像现在一样_。如果我们调整浏览器窗口的大小，窗口的宽度和高度会改变，但画布的大小不会改变。我们将在 [1.6：让我们的场景具有响应性（以及处理 Jaggies）]({{< relref "/book/first-steps/responsive-design" >}} "1.6：让我们的场景具有响应性（以及处理 Jaggies") 中解决这个问题。
{{% /aside %}}

### 设置设备像素比（DPR） {#pixel-ratio}

我们还需要告诉渲染器设备屏幕的像素比是多少。**这是防止 HiDPI 显示器模糊所必需的** （也称为视网膜显示器）。

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="50" to="51" lang="js" linenos="true" caption="_**main.js**_: 设置像素比例" >}}{{< /code >}}

我们不会在这里讨论技术细节，但你不能忘记设置它，否则你的场景在你测试它的笔记本电脑上可能看起来很棒，但在带有视网膜显示器的移动设备上会模糊。与往常一样，[附录有更多细节]({{< relref "/book/appendix/dom-api-reference#the-virtual-viewport" >}} "附录有更多细节")。

### 将`<canvas>`元素添加到我们的页面 {#add-canvas}

渲染器将 ​​ 从相机的角度将我们的场景绘制到一个`<canvas>`元素中去。这个元素已经为我们自动创建并存储在`renderer.domElement`中，但是在我们看到它之前，我们需要将它添加到页面中。我们将使用一个[名为`.append`的内置 JavaScript 方法]({{< relref "/book/appendix/dom-api-reference#adding-the-new-elements-to-our-page" >}} "名为`.append`的内置 JavaScript 方法")来做到这一点：

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="53" to="54" lang="js" linenos="true" caption="_**main.js**_: 将画布添加到页面" >}}{{< /code >}}

现在，如果您打开浏览器的开发控制台（按 F12）并检查 HTML，您将看到如下内容：

{{< code lang="html" linenos="false" caption="_**index.html**_" >}}

```html
<div id="scene-container">
  <canvas
    width="800"
    height="600"
    style="width: 800px; height: 600px;"
  ></canvas>
</div>
```

{{< /code >}}

这假设浏览器窗口大小为 $800 \times 600$, 所以你看到的可能看起来略有不同。请注意，`renderer.setSize`它还设置了画布上的宽度、高度和样式属性。

## 6. 渲染场景 {#render-scene}

{{< figure src="first-steps/rendered_scene.svg" alt="渲染场景" class="" lightbox="true" class="medium left" >}}

<p style="clear:both"> </p>

一切就绪后，剩下要做的就是**渲染场景！**，将以下也是最后一行添加到您的代码中：

{{< code file="worlds/first-steps/first-scene/src/main.final.js" from="56" to="57" lang="js" linenos="true" caption="_**main.js**_: 渲染场景" >}}{{< /code >}}

通过这一行，我们告诉渲染器使用相机创建场景的静态图片并将该图片输出到`<canvas>`元素中。如果一切设置正确，您将看到蓝色背景下的白色立方体。很难看出它是一个立方体，因为我们直接看的是一个正方形的脸，但我们将在接下来的几章中解决这个问题。

做得好！**读完这一章，您已经迈出了作为 three.js 开发人员职业生涯的第一次巨大飞跃**。我们的场景可能还没有那么有趣，但我们已经奠定了一些重要的基础，并涵盖了计算机图形学的一些基本概念，您将在以后构建的每个场景中使用这些概念，无论您使用的是 three.js 还是任何其他 3D 图形系统。
