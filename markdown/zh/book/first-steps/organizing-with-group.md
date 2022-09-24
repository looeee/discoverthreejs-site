---
title: "组织你的场景"
description: "在这里，我们创建了一个更复杂的场景，并探索了保持场景图和我们的代码有效组织和可管理的方法。 我们还介绍了Group对象和clone方法。"
date: 2018-04-02
weight: 111
chapter: "1.11"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/first-steps/organizing-with-group/src/World/components/camera.js",
    "worlds/first-steps/organizing-with-group/src/World/components/lights.js",
    "worlds/first-steps/organizing-with-group/src/World/components/meshGroup.start.js",
    "worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js",
    "worlds/first-steps/organizing-with-group/src/World/components/scene.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/controls.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/renderer.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/Resizer.js",
    "worlds/first-steps/organizing-with-group/src/World/systems/Loop.js",
    "worlds/first-steps/organizing-with-group/src/World/World.start.js",
    "worlds/first-steps/organizing-with-group/src/World/World.final.js",
    "worlds/first-steps/organizing-with-group/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/organizing-with-group/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/organizing-with-group/"
IDEActiveDocument: "src/World/components/meshGroup.js"
membershipLevel: free
---

# 组织你的场景

到目前为止，在每一章中，我们只使用我们可信赖的多维数据集创建了示例。你不认为是时候我们转向其他形状了吗？或者甚至（喘气！）同时不止一个物体？切换到新几何体很容易，因为我们可以使用three.js核心附带的大约20种几何中的任何一种，我们将在下一章中看到。然而，一旦我们开始向场景中添加大量对象，我们还需要考虑如何在场景的3D空间和代码中组织和跟踪它们。

在本章中，我们将介绍一个名为`SphereBufferGeometry`的新几何体，我们将使用它来展示一些可以用来保持场景和代码有效组织的特性：`Group`类，用于组织[场景图]({{< relref "/book/first-steps/transformations#the-scene-graph" >}} "场景图")中的对象的类，`.clone`方法，您可以使用它在一行代码中创建现有对象的相同副本。

## 介绍`SphereBufferGeometry`

{{< iframe src="https://threejs.org/docs/scenes/geometry-browser.html#SphereGeometry" height="500" title="The SphereBufferGeometry in action" caption="`SphereBufferGeometry`示例" >}}

[`SphereBufferGeometry`](https://threejs.org/docs/#api/en/geometries/SphereBufferGeometry)几何体最多需要七个参数，都是可选的。我们将重点关注前三个：

{{< code lang="js" linenos="false" hl_lines="" caption="创建一个`SphereBufferGeometry`" >}}

```js
import { SphereBufferGeometry } from "three";

const radius = 0.25;
const widthSegments = 16;
const heightSegments = 16;

const geometry = new SphereBufferGeometry(
  radius,
  widthSegments,
  heightSegments
);
```

{{< /code >}}

半径定义了球体的大小。更有趣的是接下来的两个参数，它们分别指定几何体在其宽度（赤道）和高度周围有多少细节。[`BoxBufferGeometry`具有相似的参数]({{< relref "/book/first-steps/first-scene#the-geometry" >}} "`BoxBufferGeometry`具有相似的参数")，但是它们不太重要，因为它们不会改变盒子的形状。这样做的原因是所有的几何体都是由三角形组成的 —— 你可以在上面的场景中的球体上看到这些轮廓。要创建一个像球体一样的曲面，我们需要使用许多非常小的三角形。

尝试使用不同的值`widthSegments`和`heightSegments`来查看这些设置如何影响几何体的质量。使用对两种设置都适用的最小值很重要。当您为这些参数使用较大的值时，构建球体的三角形数量会迅速增加。您正在寻找的是质量和性能之间的权衡。如果球体离相机很远或非常小，您可能会使用由极少数三角形组成的低质量几何体，而如果球体是场景的主要焦点（例如地球仪或行星），您可能希望使用更高质量的几何体。

## 向场景中添加许多对象

稍后，我们将创建21个球形网格并将它们添加到我们的场景中，围绕中心排列成一个圆圈。当然，我们可以将每个球体一个一个地添加到场景中（在以下示例中，为简洁起见，我们跳过了设置球体的位置）。

{{< code lang="js" linenos="false" hl_lines="" caption="向场景中添加大量球体，一个一个的添加" >}}

```js
const sphere1 = new Mesh(geometry, material);
const sphere2 = new Mesh(geometry, material);
const sphere3 = new Mesh(geometry, material);
// ...
const sphere20 = new Mesh(geometry, material);
const sphere21 = new Mesh(geometry, material);

scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
// ...
scene.add(sphere20);
scene.add(sphere21);
```

{{< /code >}}

有点乏味，你不觉得吗？这是使用循环的最佳时机：

{{< code lang="js" linenos="false" hl_lines="" caption="在循环中创建许多球体" >}}

```js
for (let i = 0; i < 21; i++) {
  const sphere = new Mesh(geometry, material);
  scene.add(sphere);
}
```

{{< /code >}}

这样更好。我们已经从40多行代码减少到了4行。但是，我们必须从两个角度考虑这个问题：简洁的代码和简洁的场景图。从技术上讲，像这样直接将大量对象添加到场景中并没有错。性能或其他方面没有问题。当我们想对球体做一些事情时，问题就会出现。也许我们想一次显示/隐藏它们，或者我们想为它们设置动画（将如下所示）。在这种情况下，我们必须在我们的代码中跟踪它们所有并逐个更改它们，并且要为它们设置动画，我们必须向所有21个球体添加一个`.tick`方法。

如果我们有办法把他们当作一个群体来对待会好得多，你不觉得吗？

{{% note %}}
TODO-DIAGRAM: diagram of scene graph with twenty spheres
TODO-DIAGRAM: improve diagram of group in scene graph to show twenty spheres
{{% /note %}}

## `Group`对象 {#hello-group}

[组](https://threejs.org/docs/#api/objects/Group)在[场景图中占据一个位置]({{< relref "/book/first-steps/transformations#the-object3d-base-class-and-the-scene-graph" >}} "场景图中占据一个位置")并且可以有子对象，但它们本身是不可见的。如果`Scene`代表整个宇宙，那么您可以将`Group`视为该宇宙中的单个 _复合_ 对象。

{{< figure src="first-steps/scene_tree.svg" caption="场景图中的`Group`" >}}

当我们移动一个组时，它的所有子对象也会移动。同样，如果我们旋转或缩放一个组，它的所有子项也将被旋转或缩放。但是，子对象也可以独立平移、旋转或缩放。这正是对象在现实世界中的行为方式。例如，汽车由车身、车窗、车轮、发动机等独立部件组成，当您移动汽车时，它们都会随之移动。但是轮子可以独立转动，你可以开门、摇下车窗、转动方向盘等等。

当然，所有这些都适用于 _每个_ 场景对象。每个场景对象都有继承自`Object3D`的`.add`和`.remove`的方法，就像`Group`和`Scene`本身一样，[每个对象都可以在场景图中占据一个位置并拥有子对象]({{< relref "/book/first-steps/transformations#working-with-the-scene-graph" >}} "每个对象都可以在场景图中占据一个位置并拥有子对象")。不同之处在于组是 _纯粹的可组织对象_。其他场景对象，如网格、灯光、相机等，除了在场景图中占据一席之地外，还有其他用途。但是，组的存在纯粹是为了帮助您操纵其他场景对象。

### 使用组`Groups`

与`Scene`构造函数一样，`Group`构造函数不带任何参数：

{{< code lang="js" linenos="false" caption="导入和创建`Group`" >}}
import {
Group,
} from 'three.module.js';

const group = new Group();
{{< /code >}}

您可以[`.add`](https://threejs.org/docs/#api/en/core/Object3D.add)和[`.remove`](https://threejs.org/docs/#api/en/core/Object3D.remove)组中的子对象：

{{< code lang="js" linenos="false" caption="在组`Group`中添加和删​​除对象" >}}
group.add(mesh);
group.add(light);

// later
group.remove(light);
{{< /code >}}

将组添加到场景后，该组的任何子对象也将成为场景的一部分：

{{< code lang="js" linenos="false" caption="将组添加到您的场景" >}}
// the mesh (and light if we didn't remove it)
// will become visible
scene.add(group);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams for each block of code describing how to use a group
{{% /note %}}

回到我们的球体，我们将像以前一样在循环中创建球体，但现在我们将它们添加到一个组中，然后我们将该组添加到场景中。

{{< code lang="js" linenos="false" hl_lines="" caption="将球体添加到组而不是场景中允许我们将它们作为一个单元进行操作" >}}

```js
const scene = new Scene();
const group = new Group();
scene.add(group);

for (let i = 0; i < 21; i++) {
  const sphere = new Mesh(geometry, material);
  group.add(sphere);
}
```

{{< /code >}}

{{< iframe src="https://threejs.org/examples/webgl_loader_collada_kinematics.html" height="500" title="`group`示例" caption="`Group`示例" class="medium right" >}}

如果我们简单的球体组无法说服您，那么将对象分组的一个典型例子就是机械臂。这个场景中的手臂由至少四个独立移动的部分组成，它们通过层次结构的关节连接，手臂的基座在底部，“手”在顶部。想象一下，如果这些都直接添加到场景中，彼此没有任何联系，我们的任务是为它们设置动画。手臂中的每个关节都要求其前面的关节在移动时保持连接。如果我们必须在各个部分之间没有任何联系的情况下考虑这一点，那么将会涉及很多痛苦的数学运算。但是，当我们在场景图中以父子关系连接各个部分时，逻辑上会遵循层次运动。当我们移动整个组时，整个手臂都会移动。如果我们旋转底座，上部关节会移动，但组和底座不会移动。当我们旋转中间关节时，顶部关节也会旋转，最后，当我们旋转顶部关节时，不会强迫其他任何东西一起移动。

对象之间的这种逻辑连接是在场景图中对对象进行分组变得容易的事情之一。

{{% note %}}
TODO-DIAGRAM: add diagram of robot arm in scene graph
{{% /note %}}

## `.clone`方法 {#introduce-clone}

在上面我们创建了许多球体的示例中，我们跳过了必须将每个球体移动到新位置的部分。如果我们不这样做，所有球体都将保持在场景的正中心，所有球体都相互重叠。这就是克隆对象有用的地方。我们可以按照我们喜欢的方式设置一个对象，然后我们可以创建一个精确的克隆。这个克隆将具有相同的变换、相同的形状、相同的材质，如果是灯光，它将具有相同的颜色和强度，如果是相机，它将具有相同的视野和纵横比，等等。然后，我们可以对克隆进行任何我们想要的调整。

three.js中几乎所有的对象都有一个`.clone`方法，它允许您创建该对象的相同副本。所有场景对象都继承自[`Object3D.clone`](https://threejs.org/docs/#api/en/core/Object3D.clone)，而几何体继承自[`BufferGeometry.clone`](https://threejs.org/docs/#api/en/core/BufferGeometry.clone)，材质继承自[`Material.clone`](https://threejs.org/docs/#api/en/materials/Material.clone)。

在本章中，我们将专注于克隆网格，其工作原理如下：

{{< code lang="js" linenos="false" caption="克隆网格" >}}
const mesh = new Mesh(geometry, material);
const clonedMesh = mesh.clone();
{{< /code >}}

如果我们设置`mesh`的位置、旋转和缩放，然后克隆它，`clonedMesh`将具有与原始对象相同的位置、旋转和缩放。

{{< code lang="js" linenos="false" caption="克隆对象与原始对象具有相同的变换" >}}
const mesh = new Mesh(geometry, material);
mesh.position.set(1, 1, 1);
mesh.rotation.set(0.5, 0.5, 0.5);
mesh.scale.set(2, 2, 2);

const clonedMesh = mesh.clone();
// clonedMesh.position === (1, 1, 1)
// clonedMesh.rotation === (0.5, 0.5, 0.5)
// clonedMesh.scale === (2, 2, 2)
{{< /code >}}

克隆后，您可以分别调整原始网格和克隆网格上的变换。

{{< code lang="js" linenos="false" caption="调整原始网格和克隆网格的变换" >}}
// only mesh will move
mesh.position.x = 20;

// only clonedMesh will increase in size
clonedMesh.scale.set(5, 5, 5);
{{< /code >}}

`clonedMesh`也具有与`mesh`相同的几何体和材料。**但是，几何体和材质不是克隆的，它们是共享的**。如果我们对共享材质进行任何更改，例如，更改其颜色，**所有克隆的网格将与原始网格一起更改**。如果您对几何体进行任何更改，这同样适用。

{{< code lang="js" linenos="false" caption="对材质或几何体的更改将影响所有克隆" >}}
// mesh AND clonedMesh will turn red
mesh.material.color.set('red');

// mesh AND clonedMesh will turn blue
clonedMesh.material.color.set('blue');
{{< /code >}}

但是，您可以给一个克隆一个全新的材料，而原来的材料不会受到影响。

{{< code lang="js" linenos="false" hl_lines="" caption="您可以通过为克隆提供新材料或几何体来断开连接" >}}

```js
clonedMesh.material = new MeshStandardMaterial({ color: "indigo" });

// mesh.material -> still red
```

{{< /code >}}

### 自定义属性不会克隆（如`.tick`）

一个重要的最后说明。只会克隆对象的默认属性。如果您像我们用来创建动画的[`.tick`方法]({{< relref "/book/first-steps/animation-loop#the-tick-method" >}} "`.tick`方法")方法一样创建自定义属性，这些将不会被克隆。您必须在克隆的网格上再次设置任何自定义属性。

## 创建 _**meshGroup.js**_ 模块

现在，我们最终将这21个球体添加到我们的场景中。将上一章中的 _**cube.js**_ 模块重命名为 _**meshGroup.js**_，并删除其中的所有内容（在编辑器中，我们已经为您完成了此操作）。在这个新模块中，我们将使用`SphereBufferGeometry`、`Group`和`.clone`创建一堆球体，然后花一些时间对它们进行试验。

首先，设置导入。这些与上一章基本相同，只是我们用`SphereBufferGeometry`和`Group`替换了`BoxBufferGeometry`和`TextureLoader`。接下来，创建`createMeshGroup`函数，最后在模块底部导出这个函数：

{{< code lang="js" linenos="" caption="_**meshGroup.js**_: 初始结构" >}}
import {
SphereBufferGeometry,
Group,
MathUtils,
Mesh,
MeshStandardMaterial,
} from 'three';

function createMeshGroup() {}

export { createMeshGroup };
{{< /code >}}

### 创建`Group`

在函数内部，创建一个新组，然后给它一个`.tick`方法：

{{< code lang="js" linenos="" linenostart="9" hl_lines="12-16" caption="_**meshGroup.js**_: 创建一个组" >}}
function createMeshGroup() {
// a group holds other objects
// but cannot be seen itself
const group = new Group();

group.tick = (delta) => {};

return group;
}

export { createMeshGroup };
{{< /code >}}

这样就完成了新模块的骨架结构。在World中，将`createCube`导入切换为`createMeshGroup`（同样，已经在编辑器中为您完成了）：

{{< code file="worlds/first-steps/organizing-with-group/src/World/World.final.js" from="1" to="8" lang="js" linenos="true" hl_lines="3" caption="_**World.js**_: 导入新`meshGroup`模块" >}}{{< /code >}}

在构造函数中进行类似的更改：

{{< code file="worlds/first-steps/organizing-with-group/src/World/World.final.js" from="17" to="32" lang="js" linenos="true" hl_lines="26-29" caption="_**World.js**_: 创建组并将其添加到场景和动画循环中" >}}{{< /code >}}

此时，您的场景将包含一个空组，仅此而已。但是，组是不可见的，因此您只会看到蓝色背景。

### 创建原型球体

接下来，我们将创建球体并将它们添加到组中。我们将通过创建一个 _原型_ 球体来做到这一点，然后我们将克隆它二十次，总共有21个球体。

首先，创建一个`SphereBufferGeometry`给原型网格它的形状。该几何体将由所有球体共享。我们将其`radius`设为0.25，并将`widthSegments`和`heightSegments`设置16：

{{< code lang="js" linenos="true" linenostart="14" caption="_**meshGroup.js**_: 创建一个`SphereBufferGeometry`" >}}
const geometry = new SphereBufferGeometry(0.25, 16, 16);
{{< /code >}}

将`widthSegments`和`heightSegments`设置为16可以让我们在质量和性能之间取得不错的平衡，只要我们不要放大得太近。通过这些设置，每个球体将由480个小三角形组成。

接下来，创建一个`MeshStandardMaterial`。这里没有什么新东西，除了这次我们[将颜色设置]({{< relref "/book/first-steps/physically-based-rendering#change-the-materials-color" >}} "将颜色设置")为靛蓝。再一次，这种材料将被所有领域共享。

{{< code lang="js" linenos="true" linenostart="16" caption="_**meshGroup.js**_: 创建一个MeshStandardMaterial" >}}
const material = new MeshStandardMaterial({
color: 'indigo',
});
{{< /code >}}

最后，创建网格，然后将其添加到组中：

{{< code lang="js" linenos="true" linenostart="20" caption="_**meshGroup.js**_: 创建原型网格" >}}
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);
{{< /code >}}

我们将`.clone`这个网格来创建其余的网格，因此命名为`protoSphere`。将所有这些放在一起，这是`createMeshGroup`迄今为止的功能：

{{< code lang="js" linenos="" linenostart="9" caption="_**meshGroup.js**_: 当前进度" >}}
function createMeshGroup() {
// a group holds other objects
// but cannot be seen itself
const group = new Group();

const geometry = new SphereBufferGeometry(0.25, 16, 16);

const material = new MeshStandardMaterial({
color: 'indigo',
});

// create one prototype sphere
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

group.tick = (delta) => {};

return group;
}
{{< /code >}}

{{< figure src="first-steps/proto-sphere.png" alt="圆形球体" lightbox="true" class="medium right" >}}

此时，`protoSphere`应该出现在场景的中心。

请注意我们在上一章中添加的`HemisphereLight`如何与球体的颜色相结合以在整个表面上创建不同的阴影。另外，仔细观察球体的轮廓。你能看出它是由许多短直线组成的吗？如果您使用轨道控件放大然后旋转相机，这应该会变得更加明显。显然，`widthSegments`和`heightSegments`在等于16时并没有为我们提供全屏球体的足够细节。现在，缩小到原始大小。球体现在应该看起来更好，向我们展示了这个质量水平对于小的或遥远的球体来说是好的。

### 克隆`protoSphere`

这个小标题最有可能成为一部俗气的科幻电影中的对白。

随着我们的原型网格设置，我们将克隆它以创建其他网格。

{{< code lang="js" linenos="false" hl_lines="" caption="克隆`protoSphere`" >}}

```js
const clonedSphere = protoSphere.clone();
```

{{< /code >}}

我们将使用[**for循环**]({{< relref "/book/appendix/javascript-reference#for-loop" >}} "**for循环**")创建20个新球体，并在创建它们时将每个球体添加到组中。通常，要循环二十次，我们会这样做：

{{< code lang="js" linenos="false" caption="运行20次的最基本for循环" >}}
for (let i = 0; i < 20; i++) {
console.log('Hello twenty times!');
}
{{< /code >}}

但是，稍后，我们将使用一些三角函数将克隆的球体排列成一个圆圈，我们需要`i`介于0和1之间的值。因为$\frac{1}{20}=0.05$，我们可以这样写循环：

{{< code lang="js" linenos="false" caption="一个for循环，运行20次，`i`值介于0和1之间" >}}
for (let i = 0; i < 1; i += 0.05) {
console.log('Hello twenty times!');
}
{{< /code >}}

添加此循环到`createMeshGroup`以创建二十个新球体：

{{< code lang="js" linenos="true" linenostart="18" hl_lines="25-31" caption="_**meshGroup.js**_: 创建二十个克隆球体" >}}
...

const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create twenty clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.05) {
const sphere = protoSphere.clone();

group.add(sphere);
}

...
{{< /code >}}

现在我们总共有21个球体（原始球体加上20个克隆）。但是，我们还没有移动任何球体，所以它们都在场景中心完全重叠放置，看起来仍然只有一个球体。

### 将克隆球体放置在一个圆圈中

我们将使用一些三角函数将克隆的球体放置在围绕`protoSphere`的圆圈上。这是编写半径为1的圆方程的一种方法，其中$0 \le i \le 1$：

$$
\begin{aligned}
  x &= \cos(2 \pi i) \cr
  y &= \sin(2 \pi i) \cr
\end{aligned}
$$

如果我们输入的值$i$在0和1之间，我们将得到散布在圆周上的点。我们可以[使用内置`Math`类]({{< relref "/book/appendix/javascript-reference#the-math-object" >}} "使用内置`Math`类")在JavaScript中轻松重写这些函数：

{{< code lang="js" linenos="false" caption="圆上的点方程" >}}
const x = Math.cos(2 _ Math.PI _ i);
const y = Math.sin(2 _ Math.PI _ i);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagram of points around circle
{{% /note %}}

接下来，将方程移动到你的for循环中（现在你能明白为什么我们想要`i`的值介于0和1之间了吗？）：

{{< code lang="js" linenos="true" linenostart="27" hl_lines="31 32" caption="_**meshGroup.js**_: 将克隆的网格定位为围绕一个圆圈" >}}
for (let i = 0; i < 1; i += 0.05) {
const sphere = protoSphere.clone();

// position the spheres on around a circle
sphere.position.x = Math.cos(2 _ Math.PI _ i);
sphere.position.y = Math.sin(2 _ Math.PI _ i);

this.group.add(sphere);
}
{{< /code >}}

完成此操作后，克隆的球体将移动到围绕原始`protoSphere`的圆圈。

### 缩放组

我们创建的圆的半径为1，非常小。我们将把组的规模扩大一倍以使其更大：

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="39" to="40" lang="js" linenos="true" caption="_**meshGroup.js**_: 缩放组" >}}{{< /code >}}

[`.multiplyScalar`](https://threejs.org/docs/#api/en/math/Vector3.multiplyScalar)方法[将一个向量的$x$, $y$, 和$z$分量乘以一个数字]({{< relref "/book/first-steps/transformations#the-multiplyscalar-method" >}} "将一个向量的$x$, $y$, 和$z$分量乘以一个数字")。当我们将组的规模扩大一倍时，组内的每个对象的大小也会增加一倍。

### 缩放球体

为了获得一些额外的视觉效果，让我们将克隆的球体从小缩放到大。将以下行添加到循环中：

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="27" to="37" lang="js" linenos="true" caption="_**meshGroup.js**_: 缩放克隆的球体"  hl_lines="34" >}}{{< /code >}}

变量`i`在范围$0 \le i \le 1$内，所以在这里，我们将网格从几乎为零缩放到全尺寸。

### 旋转轮子

最后，更新`group.tick`方法设置球体运动。我们将使用与[创建立方体动画]({{< relref "/book/first-steps/animation-loop#rotate-the-cube" >}} "创建立方体动画")相同的方法，除了这次我们在单轴上旋转，所以它是一个简单的旋转运动，就像一个轮子围绕其中心旋转。

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="42" to="47" lang="js" linenos="true" caption="_**meshGroup.js**_: 为组设置动画">}}{{< /code >}}

### 完成`createMeshGroup`函数

With all that in place, here's the complete `createMeshGroup` function:

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="9" to="50" lang="js" linenos="true" caption="_**meshGroup.js**_: complete createMeshGroup function">}}{{< /code >}}

## 实验！

最后，我们有一个可以玩的场景。通过在循环中进行微小的更改，您可以获得有趣的结果。例如，尝试在循环中使用不同的步长来创建更多或更少的球体：

{{< code file="worlds/first-steps/organizing-with-group/src/World/components/meshGroup.final.js" from="27" to="27" lang="js" linenos="true" caption="_**meshGroup.js**_: 尝试不同的值而不是0.05">}}{{< /code >}}

{{% note %}}
TODO-LOW: the example scene in the editor looks better with 101 spheres than 20
Try these:
const geometry = new SphereBufferGeometry(0.25, 2, 8);

const material = new MeshStandardMaterial({
color: 'indigo',
flatShading: true
});

const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create 20 clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.01) {

{{% /note %}}

如果将0.05更改为0.001会发生什么？在您开始注意到帧速率下降之前，该值可以有多小？

或者，改变$z$轴位置会怎么样，以及$x$和$y$轴呢?

{{< code lang="js" linenos="true" linenostart="31" caption="_**meshGroup.js**_: 改变球体的z轴位置" >}}
sphere.position.x = Math.cos(2 _ Math.PI _ i);
sphere.position.y = Math.sin(2 _ Math.PI _ i);
sphere.position.z = -i \* 5;
{{< /code >}}

{{< inlineScene entry="first-steps/snake.js" class="round" >}}

{{% note %}}
TODO-LOW: better position controls target on snake scene
{{% /note %}}

您还必须调整相机以获得精确的视图。这听起来像是一个“艰难”的挑战！

## 挑战

{{% aside success %}}

### 简单

1. 通过更改循环中的值0.05来增加和减少球体的数量。在进行更改之前尝试计算您想要多少个球体，而不是输入随机数。

2. 尝试除球体和盒子之外的其他形状。比如[锥体](https://threejs.org/docs/#api/en/geometries/ConeBufferGeometry)、[圆柱体](https://threejs.org/docs/#api/en/geometries/CylinderBufferGeometry)、[圆环](https://threejs.org/docs/#api/en/geometries/RingBufferGeometry)，或[正十二面体](https://threejs.org/docs/#api/en/geometries/DodecahedronBufferGeometry)？对于本练习，只需将`SphereBufferGeometry`替换为其他缓冲区几何体类之一。每种几何体的构造函数采用不同的参数，因此请仔细阅读文档，并记住在使用之前导入它们。

3. 尝试调整`widthSegments`和`heightSegments`。在您注意到帧速率下降之前，您最高可以设置多高？值非常低的球体是什么样的？如果两个参数不使用相同的数字会怎样？

{{% /aside %}}

{{% aside %}}

### 中等

1. 在`group.tick`方法内部，我们每一帧都减去一个旋转：`.rotation.z -= ...`。这将导致 _顺时针_ 旋转。切换到`+=`，并注意旋转如何变为 _逆时针_。如果添加旋转，则运动将逆时针。如果减去旋转，运动将是顺时针方向。**three.js中的正旋转是逆时针的**。

2. 你能在这里创建一些其他的动画吗？请记住，您可以 _为任何可以更改的属性_ 设置动画。

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 你猜对了！你能让编辑器中的场景与上面的场景完全匹配吗？

2. 回到原来的场景，你能在圆圈周围交替使用两种不同的形状吗？比如说，十个球体和十个盒子？如何在三种不同的形状之间交替？或者十种不同的形状呢？

3. 虽然您确实可以为任何属性设置动画，但最难的部分是制作平滑、重复的运动。旋转是一种特殊情况，因为您可以不断增加，并且物体会绕圈转。要为其他属性创建类似的行为，您可以使用三角函数sin、cos和tan。我们使用cos和sin将球体放置在一个圆圈中，您可以执行类似的操作来将组的位置移动到一个圆圈中。你能做到吗？没有提示，毕竟，这应该是一个艰巨的挑战！

{{% /aside %}}
