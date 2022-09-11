---
title: "变换和坐标系"
description: "在这里，我们将探索如何使用平移、旋转和缩放以及构成空间本身的坐标系在 3D 空间中移动对象。 我们还介绍了场景图，这是一种用于在three.js场景中对对象进行分组的结构。"
date: 2018-04-02
weight: 105
chapter: "1.5"
available: true
showIDE: true
IDEFiles:   [
  "worlds/first-steps/transformations/src/World/components/camera.js",
  "worlds/first-steps/transformations/src/World/components/cube.js",
  "worlds/first-steps/transformations/src/World/components/lights.js",
  "worlds/first-steps/transformations/src/World/components/scene.js",
  "worlds/first-steps/transformations/src/World/systems/renderer.js",
  "worlds/first-steps/transformations/src/World/systems/Resizer.js",
  "worlds/first-steps/transformations/src/World/World.js",
  "worlds/first-steps/transformations/src/main.js",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "worlds/first-steps/transformations/index.html",
]
IDEClosedFolders: ['systems', 'styles', 'vendor']
IDEStripDirectory: 'worlds/first-steps/transformations/'
IDEActiveDocument: 'src/World/components/cube.js'
membershipLevel: free
---



# 变换、坐标系和场景图

本章介绍了在3D空间中移动对象。

很多东西共同组成了一个漂亮的3D场景，比如灯光、材质、模型、纹理、相机设置、后期处理、粒子效果、交互性等等，但无论我们创建什么样的场景，没有什么比组成它的各个部分的排列和移动更重要的了。

要创建建筑效果图，我们必须成为建筑师和室内装饰师。一定要考虑建筑物的比例和里面的房间，巧妙地摆放家具和灯具。在自然场景中，无论是一朵花的特写，还是一望无际的山景，我们都需要将树木和岩石，或者叶子和花瓣，以一种自然而令人信服的方式排列。也许一大群[入侵的机器人](https://threejs.org/examples/#webgl_animation_skinning_morph)会横扫大地，眼睛闪闪发光，手臂和脚在齐齐行进时摆动，火箭冲向天空并在所到之处产生巨大的爆炸——在这种情况下，我们必须成为机器人设计师和弹道学专家。

即使是[纯粹的抽象场景](https://threejs.org/examples/#webgl_interactive_buffergeometry)也需要了解如何在3D空间中移动对象。

{{< iframe src="https://threejs.org/examples/webgl_buffergeometry_drawrange.html" height="500" title="three.js创建的的抽象场景示例" caption="[Fernando Serrano](https://twitter.com/fernandojsg)创建的three.js示例中的抽象场景" >}}

最后，我们还必须成为导演并定位相机以艺术地构思每个镜头。创建3D场景时，唯一的限制是您的想象力 - 以及您的技术知识深度。

在3D空间中移动对象是学习three.js的基本技能。我们将把这项技能分为两部分：首先，我们将探索用于描述3D空间的坐标系，然后我们将探索称为变换的数学运算，用于在坐标系内移动对象。

一路上，我们会遇到几个数学对象，例如**场景图**，一种用于描述构成我们场景的对象层次结构的结构，**向量**，用于描述3D空间中的位置（以及许多其他事物） ，还有不少于两种描述旋转的方式：欧拉角**Euler angles**和四元数**quaternions**。我们将通过向您介绍转换矩阵**transformation matrices**来结束本章，它用于存储对象的完整转换状态。

{{% aside success %}}

### 你好，线性代数（很高兴认识你！）

我们即将在本章中遇到的变换、坐标系和大多数其他数学术语都来自**线性代数**。你只需要高中水平就可以读完这本书，但如果你的代数技能有点生疏，或者即使你以前从未听说过坐标系，也不用担心。使用three.js时，您只需很少的数学知识就可以过关，并且three.js核心内置了一系列数学帮助方法，因此我们很少需要自己进行任何计算。

如果在某个时候你想更深入地研究这个主题，[可汗学院](https://www.khanacademy.org/)是网络上学习数学及其课程的最佳资源之一，尤其是[线性代数课程](https://www.khanacademy.org/math/linear-algebra)，拥有通读这本书所需的一切。如果您已经熟悉此主题并希望更深入地了解WebGL中使用的坐标系的技术概述，请查看[在learnopengl.com上的优秀文章](https://learnopengl.com/Getting-started/Coordinate-Systems)。

另一方面，如果所有这些关于数学的讨论听起来令人生畏，或者如果您发现本章比前几章更具挑战性，请慢慢来。你不需要一口气吸收这里的所有东西，尤其是如果你是新手，或者你已经多年没有接触过线性代数了。拿起你现在能做的，然后把这一章当作参考，等你的three.js技能成熟后再回来看。一旦您拥有更多创建3D场景的经验，此处描述的概念将变得更容易掌握。

{{% /aside %}}

## 平移、旋转和缩放：三个基本转换

**每当我们在3D空间中移动对象时，我们都会使用称为 _转换_ 的数学运算来进行**。我们已经看到了两种转换：平移**translation**，存储在对象的[`.position`](https://threejs.org/docs/#api/en/core/Object3D.position)属性中，以及旋转**rotation**，存储在[`.rotation`](https://threejs.org/docs/#api/en/core/Object3D.rotation)属性中。与存储在[`.scale`](https://threejs.org/docs/#api/en/core/Object3D.scale)属性中的缩放一起，这些构成了我们将用于在场景中移动对象的三个基本变换。我们有时会使用它们的首字母**TRS**来指代平移、旋转和缩放。

可以使用`scene.add`添加到场景中的每个对象都具有这些属性，包括网格、灯光和相机，而材质和几何图形则没有。我们之前使用`.position`用来[设置相机的位置]({{< relref "/book/first-steps/first-scene#position-camera" >}} "设置相机的位置")：

{{< code lang="js" linenos="false" caption="我们的第一个场景: _**main.js**_" >}}
camera.position.set(0, 0, 10);
{{< /code >}}

… 以及[设置定向光的位置]({{< relref "/book/first-steps/physically-based-rendering#position-the-light" >}} "设置定向光的位置")：

{{< code lang="js" linenos="false" caption="基于物理的渲染: _**lights.js**_" >}}
light.position.set(10, 10, 10);
{{< /code >}}

在上一章中，[我们使用`.rotation`更好地了解我们的立方体]({{< relref "/book/first-steps/physically-based-rendering#rotate-the-cube" >}} "我们使用`.rotation`更好地了解我们的立方体")：

{{< code lang="js" linenos="false" caption="基于物理的渲染: _**cube.js**_" >}}
cube.rotation.set(-0.5, -0.1, 0.8);
{{< /code >}}

到目前为止，我们唯一没有遇到的基本转换是`.scale`。

本章没有可写的代码。相反，编辑器设置了一个网格，应用了一些转换，您可以将其用作草稿本，以便在阅读时测试想法。

### 蝴蝶和毛毛虫

以这种方式使用**转换**这个词对您来说可能看起来很奇怪。一般而言，它更有可能唤起毛毛虫变成蝴蝶的想法，而不是让毛毛虫在一片叶子上向左移动两个单位。但从数学上讲，只有第二个是转换。平移、旋转和缩放是您将遇到的最重要的转换，稍后我们将详细探讨这些转换。

## `Object3D`基类

不是为每种类型的对象多次重新定义`.position`、`.rotation`和`.scale`属性，而是在[`Object3D`](https://threejs.org/docs/#api/en/core/Object3D)基类上定义一次这些属性，这样可以添加到场景中的所有其他类都[从该基类派生]({{< relref "/book/appendix/javascript-reference#class-inheritance-and-the-extends-keyword" >}} "从该基类派生")。这些包括网格、相机、灯光、点、线、助手，甚至场景本身。我们将非正式地将派生自`Object3D`的类称为 _场景对象_。

Object3D除了这三个之外，还有许多属性和方法，由每个场景对象继承。这意味着定位和设置相机或网格的工作方式与设置灯光或场景的方式大致相同。然后根据需要将其他属性添加到场景对象，以便灯光获得颜色和强度设置，场景获得背景颜色，网格获得材质和几何体，等等。

## 场景图

回想一下我们如何[将网格添加到场景中]({{< relref "/book/first-steps/first-scene#add-the-mesh-to-the-scene" >}} "将网格添加到场景中")：

{{< code lang="js" linenos="false" hl_lines="" caption="`scene.add`方法" >}}
``` js
scene.add(mesh);
```
{{< /code >}}

`.add`方法也是在`Object3D`中定义并在场景类上被继承，就像`.position`,`.rotation`和`.scale`。所有其他派生类也继承了这个方法，继承给了我们`light.add`、`mesh.add`、`camera.add`等等。这意味着我们可以将对象彼此互相添加，以创建一个顶部有场景的树结构。这种树状结构称为**场景图**。

{{< figure src="first-steps/scene_graph.svg" caption="场景图" class="" lightbox="true" >}}

当我们将一个对象添加到另一个对象时，我们称一个对象为**父对象**，另一个对象为**子对象**。

{{< code lang="js" linenos="false" caption="场景图中的对象具有父子关系" >}}
parent.add(child);
{{< /code >}}

场景是顶级父级。上图中的场景有三个孩子：一个灯光和两个网格。其中一个网格也有两个孩子。但是，每个对象（顶级场景除外）都只有一个父对象。

> 场景图中的每个对象（顶级场景除外）只有一个父对象，并且可以有任意数量的子对象。

当我们渲染场景时：

{{< code lang="js" linenos="false" hl_lines="" caption="渲染一帧" >}}
``` js
renderer.render(scene, camera);
```
{{< /code >}}

...渲染器遍历场景图，从场景开始，并使用每个对象相对于其父对象的位置、旋转和缩放来确定在哪里绘制它。

### 访问场景对象的子对象

您可以使用[`.children`](https://threejs.org/docs/#api/en/core/Object3D.children)数组访问场景对象的所有子对象：

{{< code lang="js" linenos="false" caption="访问组的子对象" >}}
scene.add(mesh);

// the children array contains the mesh we added
scene.children; // -> [mesh]

// now, add a light:
scene.add(light);

// the children array now contains both the mesh and the light
scene.children; // -> [mesh, light];

// now you can access the mesh and light using array indices
scene.children[0]; // -> mesh
scene.children[1]; // -> light
{{< /code >}}

有更复杂的方法可以访问特定的孩子，例如[`Object3d.getObjectByName`](https://threejs.org/docs/#api/en/core/Object3D.getObjectByName)方法。但是，当您不知道对象的名称或它没有名称时，直接访问`.children`数组很有用。

## 坐标系：世界空间和局部空间

3D空间使用3D[笛卡尔坐标系](https://en.wikipedia.org/wiki/Cartesian_coordinate_system)来描述。

{{% note %}}
TODO-LOW: make the coordinate system diagram 3D
{{% /note %}}

{{< figure src="first-steps/coordinate_system_simple.svg" caption="3D笛卡尔坐标系" class="medium left" lightbox="true" >}}

3D笛卡尔坐标系由$X$，$Y$和$Z$轴组成，三轴交叉于点$(0,0,0)$（称为原点）。二维坐标系相似，但只有$X$和$Y$轴。

{{% note %}}
TODO-DIAGRAM: add figure of 2D coords
{{% /note %}}

每个3D图形系统都使用这样的坐标系，从Unity和Unreal等游戏引擎，到Pixar用于创建电影的软件，再到3DS Max、Maya和Blender等专业动画和建模软件。甚至用于在网页上定位对象的语言CSS也使用笛卡尔坐标系。但是，这些系统之间可能存在细微的技术差异，例如轴的标记不同或指向不同的方向。

在使用three.js时，我们会遇到几个类型的2D和3D坐标系。在这里，我们将介绍其中最重要的两个：**世界空间**和**局部空间**。

### 世界空间

{{< figure src="first-steps/coordinate_system.svg" caption="我们的场景定义了世界空间" class="medium left" lightbox="true" >}}

我们`scene`定义了世界空间坐标系，系统的中心是`X`、`Y`和`Z`轴的交点。

还记得几章前，[当我们第一次介绍这个`Scene`类时]({{< relref "/book/first-steps/first-scene#the-scene" >}} "当我们第一次介绍这个`Scene`类时")，我们称它为“小宇宙”吗？ 这个微小的宇宙就是世界空间。

{{< figure src="first-steps/world_space_scene_graph.svg" caption="添加到场景中的对象存在于世界空间中" class="medium right" lightbox="true" >}}

当我们在场景中布置对象时——无论我们是在房间中放置家具、在森林中放置树木还是在战场上狂暴的机器人——我们在屏幕上看到的就是每个对象在世界空间中的位置。

**当我们直接将一个对象添加到场景中，然后平移、旋转或缩放它时，该对象将相对于世界空间移动——即相对于场景的中心。**.

{{< code lang="js" linenos="false" >}}
// add a cube to our scene
scene.add(cube);

// move the cube relative to world space
cube.position.x = 5;
{{< /code >}}

这两个语句是等价的，只要对象是场景的直接子对象：

1. 相对于世界空间变换对象。
2. 在场景中移动一个对象。

每当我们尝试在3D中可视化一些棘手的东西时，降低一个维度并考虑2D类比可能会很有用。所以，让我们考虑一个棋盘。当我们安排棋子开始新游戏时，我们将它们放置在棋盘上的特定位置。这意味着棋盘是场景，棋子是我们放置在场景中的对象。

{{< figure src="first-steps/chessboard.svg" caption="棋盘是国际象棋游戏中的世界空间" class="medium left" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: the points on the axes should match rows/columns on the board
{{% /note %}}

接下来，当我们向某人解释为什么我们这样排列棋子时，一边是白色的，一边是黑色的，走卒排在第二排，等等，我们这样做是相对于棋盘本身而言的。棋盘定义了一个坐标系，Y轴为行，X轴为列。这是棋盘的世界空间，我们解释每个棋子相对于这个坐标系的位置。

现在游戏开始了，我们开始移动棋子。当我们这样做时，我们遵循国际象棋规则。当我们在three.js场景中移动对象时，我们遵循笛卡尔坐标系的规则。这里的类比有点偏差，因为棋盘上的每一块棋子都有自己的移动方式，而在笛卡尔坐标系中，平移、旋转和缩放对于任何类型的对象都是相同的。

### 局部空间

{{% note %}}
TODO-DIAGRAM: diagram of local space within world space
{{% /note %}}

{{< figure src="first-steps/knight.svg" caption="棋子的局部空间" class="medium right" lightbox="true" >}}

现在，考虑其中一个棋子。如果被要求描述棋子的形状，你不会描述它相对于棋盘的外观，因为它可以放在棋盘上的任何地方，实际上，即使根本不在棋盘上，它也能保持其形状。相反，您将在脑海中创建一个新的坐标系并描述棋子在那里的外观。

就像棋盘上的棋子一样，**我们可以添加到场景中的每个对象也都有一个局部坐标系**，并且在这个局部坐标系中描述了对象的形状（几何形状）。当我们创建网格或灯光时，我们还创建了一个新的局部坐标系，网格或灯光位于其中心。这个局部坐标系有$X$、$Y$和$Z$轴，就像世界空间一样。对象的局部坐标系称为**局部空间**（或有时称为**对象空间**）。

{{% note %}}
TODO-LOW: check that local space and object space are the same
TODO-DIAGRAM: add diagram of mesh at the center of local coordinate system
{{% /note %}}

当我们创建一个$2 \times 2 \times 2$`BoxBufferGeometry`，然后使用几何体创建网格，几何体的大小在 _网格局部空间中_ 是每边两个单位：

{{< code lang="js" linenos="false" caption="几何体在网格的局部空间中的描述" >}}
const geometry = new BoxBufferGeometry(2, 2, 2);

const mesh = new Mesh(geometry, material);
{{< /code >}}

正如我们将在下面看到的，我们可以使用`.scale`拉伸或收缩网格，然后在我们的屏幕上绘制的网格大小会发生变化。但是，当我们缩放网格时，几何体的大小不会改变。当渲染器来渲染网格时，它会看到它已经被缩放，然后以不同的大小绘制网格。

{{% note %}}
TODO-DIAGRAM: add diagram of mesh being scaled
{{% /note %}}

### 每个对象都有一个坐标系

回顾一下：顶级场景定义了世界空间，而其他每个对象都定义了自己的局部空间。

{{< code lang="js" linenos="false"  >}}
// creating the scene creates the world space coordinate system
const scene = new Scene();

// mesh A has its own local coordinate system
const meshA = new Mesh();

// mesh B also has its own local coordinate system
const meshB = new Mesh();
{{< /code >}}

通过以上三行代码，我们创建了三个坐标系。这三个坐标系在数学上没有区别。我们可以在世界空间中进行的任何数学运算都将在任何对象的局部空间中以相同的方式进行。

很容易将坐标系视为大而复杂的事物，但是，在3D空间中工作时，您会发现周围有很多坐标系。每个对象至少有一个，有些有几个。渲染场景涉及另一整套坐标系，即将对象从3D世界空间转换为在屏幕的平面2D表面上看起来不错的东西。每个纹理甚至都有一个2D坐标系。最后，它们并没有那么复杂，而且创建起来非常容易。

## 使用场景图

使用每个对象的`.add`方法`.remove`方法，我们可以创建和操作场景图。

{{< figure src="first-steps/local_space_scene_graph.svg" caption="场景图是一系列嵌入式<br> 坐标系，顶部有世界空间" class="medium right" lightbox="true" >}}

{{% note %}}
TODO-DIAGRAM: could make this into a very cool diagram that shows the scene graph in 3D with one huge coordinate system and lots of small coordinate systems
{{% /note %}}

当我们使用`scene.add`向场景添加对象时，我们将这个对象嵌入到场景的坐标系世界空间中。当我们移动对象时，它将相对于世界空间（或等效地，相对于场景）移动。

当我们将一个对象添加到场景图中更深的另一个对象时，我们就将子对象嵌入到了父对象的本地空间中。当我们移动子对象时，它会相对于父对象的坐标系移动。坐标系像俄罗斯娃娃一样相互嵌套。

让我们看一些代码。首先，我们将添加一个对象$A$作为场景的子对象：

{{< code lang="js" linenos="false" caption="添加对象$A$到场景中" >}}
scene.add(meshA);
{{< /code >}}

现在，`scene`是$A$的父对象，或等效地，$A$是`scene`的子对象。接下来我们平移$A$对象：

{{< code lang="js" linenos="false" caption="在世界空间内移动$A$" >}}
meshA.position.x = 5;
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of $A$ moving relative to the scene
{{% /note %}}

现在，$A$对象已沿世界空间内的$X$轴正向平移了五个单位。**每当我们变换一个对象时，我们都是相对于它的父坐标系进行的**。接下来，让我们看看当我们添加第二个对象$B$时会发生什么，作为$A$的一个子对象：

{{< code lang="js" linenos="false" caption="添加$B$对象到$A$对象中" >}}
meshA.add(meshB);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of this simple scene graph: scene -> A -> B
{{% /note %}}

$A$还是场景的子对象，所以我们有关系$Scene \longrightarrow A \longrightarrow B$。 所以，$A$是场景的子对象，然后$B$是$A$的子对象。 或者，等效地，$A$对象现在生活在世界空间，$B$现在住在$A$的局部空间。当我们移动$A$对象时，它将在世界空间中移动，当我们移动$B$时, 它会在$A$的局部空间中移动。

接下来我们平移$B$：

{{< code lang="js" linenos="false" caption="在$A$对象的局部空间移动$B$对象" >}}
meshB.position.x = 3;
{{< /code >}}

你认为$B$对象最终会停在哪呢？

### 我们看到的是世界空间

当我们调用`.render`时，渲染器计算每个对象的世界空间位置。为此，它从场景图的底部开始并向上移动，结合每个父子节点的变换，计算每个对象相对于世界空间的最终位置。**我们最终在屏幕上看到的是世界空间**。在这里，我们将手动计算$A$和$B$。 请记住，每个对象最开始的位置都是相对于它的父对象的中心$(0,0,0)$。

{{< code lang="js" linenos="false" >}}
// A starts at (0,0,0) in world space
scene.add(meshA);

// B starts at (0,0,0) in A's local space
meshA.add(meshB);

meshA.position.x = 5;

meshB.position.x = 3;
{{< /code >}}


计算$A$的位置很简单，因为它是场景的直接子元素。我们沿着$X$轴的右侧平移了$A$五个单位，所以它的最终位置是$x=5, y=0, z = 0$， 或者$(5, 0, 0)$。

当我们平移$A$时，它的局部坐标系也随之移动，我们在计算$B$的世界空间位置时必须考虑到这一点。因为，$B$是$A$的子对象，这意味着它现在相对于世界空间在$(5, 0, 0)$的位置。接下来，我们相对于$A$沿着$X$轴平移了$B$三个单位, 所以最终$B$在$X$轴的位置是$5 + 3 = 8$。 最终$B$在世界空间的位置是：$(8, 0, 0)$。

### 在坐标系之间移动对象

如果我们将一个对象从一个坐标系移动到另一个坐标系会发生什么？换句话说，如果我们拿到对象$B$，然后在不改变它的`.position`的情况下，把它从$A$对象中移除并直接添加到场景中，会发生什么？我们可以仅使用一行代码做到这一点：

{{< code lang="js" linenos="false" caption="添加网格$B$到场景中，并删除任何以前它的父对象" >}}
scene.add(meshB);
{{< /code >}}

一个对象只能有一个父对象，因此任何先前$B$的父对象（在这种情况下，网格$A$）都会被移除。

以下陈述仍然成立：**$B$ _在其父坐标系内_ 已沿$X$轴正方向平移三个单位。** 然而，$B$的父对象现在是场景而不是$A$对象，所以现在我们必须重新计算$B$在世界空间而不是$A$的局部空间，它现在的位置应该是$(3, 0, 0)$。

这就是坐标系。在本章的其余部分，我们将深入了解三个基本变换中的每一个：平移、旋转和缩放。

## 我们的第一个转换：平移

{{% note %}}
TODO-DIAGRAM: add diagram of translation
{{% /note %}}

三种基本转换中最简单的一种是**平移**。我们已经在本章的几个示例中使用了它，并且还设置了场景中相机和灯光的位置。我们通过更改对象的[`.position`](https://threejs.org/docs/#api/en/core/Object3D.position)属性来执行平移。平移对象会将其移动到其直接父对象坐标系中的新位置。

为了完整地描述一个物体的位置，我们需要存储三个信息：

1. 物体在$X$轴上的位置，我们称之为$x$。
2. 物体在$Y$轴上的位置，我们称之为$y$。
3. 物体在$Z$轴上的位置，我们称之为$z$。

我们可以将这三个位置写成一个有序的数字列表：$(x, y, z)$。

所有三个轴上都是零写作$(0,0,0)$，[正如我们之前提到的]({{< relref "/book/first-steps/first-scene#the-scene" >}} "正如我们之前提到的")，这个点被称为**原点**。**每个对象都从其父对象坐标系内的原点开始。**

一个点沿$X$轴往 _右侧_ 移动一个单位，沿$Y$轴往 _上方_ 移动两个单位，沿$Z$轴往 _外侧_ 移动三个单位被写作$(1,2,3)$。 一个点沿$X$轴往 _左侧_ 移动二个单位，沿$Y$轴往 _下方_ 移动四个单位，沿$Z$轴往 _内侧_ 移动八个单位被写作$(-2,-4,-8)$。

> 我们称这样的有序列表数字为**向量**，因为有三个数字，所以它是一个**3D向量**。

### 平移一个对象

我们可以沿着$X$、$Y$和$Z$轴一个接一个的平移对象，或者我们可以使用`position.set`一次沿所有三个轴平移对象。两种情况下的最终结果将是相同的。

{{< code lang="js" linenos="false" caption="平移对象的两种方法" >}}
// translate one axis at a time
mesh.position.x = 1;
mesh.position.y = 2;
mesh.position.z = 3;

// translate all three axes at once
mesh.position.set(1,2,3);
{{< /code >}}

当我们进行平移$(1,2,3)$时，我们正在执行的是数学运算：

$$(0,0,0) \longrightarrow (1,2,3)$$

意思是：从点$(0,0,0)$移动到点$(1,2,3)$。

{{% note %}}
TODO-DIAGRAM: add diagram of vector moving 0,0,0 -> 1,2,3
{{% /note %}}

### 平移的单位是米

当我们执行平移`mesh.position.x = 2`时，我们将对象沿着$X$轴**向右移动两个three.js单位**，[正如我们之前提到的]({{< relref "/book/first-steps/physically-based-rendering#create-physically-sized-scenes" >}} "正如我们之前提到的")，我们总是认为一个three.js单位等于一米。

### 在世界空间中的方向

{{< figure src="first-steps/coordinate_system.svg" caption="世界空间内的方向" class="medium left" lightbox="true" >}}

上面我们提到了在$X$轴是向左或向右移动，在$Y$轴是向上或向下移动，在$Z$轴是向内或向外移动。这些方向是相对于您的屏幕的，并假设您没有旋转相机。在这种情况下，以下方向成立：

{{< clear >}}

* $X$轴正向指向屏幕 _右侧_。
* $Y$轴正向指向屏幕 _上方_，即屏幕顶部。
* $Z$轴正向指向屏幕 _外面_，即指向屏幕前的你。

这样，当你移动对象时：

* 沿$X$轴正向移动一个对象将会使对象移动到屏幕 _右侧_。
* 沿$Y$轴正向移动一个对象将会使对象移动到屏幕 _顶部_。
* 沿$Z$轴正向移动一个对象将会使对象往屏幕 _外侧_ 移动，即朝向你移动。

当我们在平移中加入减号时，我们就会反转这些方向：

* 沿$X$轴负向移动一个对象将会使对象移动到屏幕 _左侧_。
* 沿$Y$轴负向移动一个对象将会使对象移动到屏幕 _底部_。
* 沿$Z$轴负向移动一个对象将会使对象往屏幕 _内侧_ 移动，即背向你移动。

当然，您可以向任何方向旋转相机，在这种情况下，这些方向将不再成立。毕竟，您在屏幕上看到的是相机的视点。但是，能够使用“常规”语言描述世界空间中的方向是很有用的，所以我们将把这个相机位置作为默认视图，并继续使用这个术语来描述方向，不管相机碰巧在哪里。

## 位置被存储在`Vector3`类中

Three.js有一个用于表示3D向量的特殊类，称为[`Vector3`](https://threejs.org/docs/#api/math/Vector3)。 这个类有`.x`、`.y`和`.z`属性和方法`.set`来帮助我们操作它们。每当我们创建任何场景对象时，例如`Mesh`，`Vector3`都会被自动创建并存储在`.position`中：

{{< code lang="js" linenos="false" caption="对象的平移被存储在`Vector3`中" >}}
// when we create a mesh ...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.position = new Vector3();
{{< /code >}}

我们也可以自己创建`Vector3`实例：

{{< code lang="js" linenos="false" caption="创建一个`Vector3`实例" >}}
import { Vector3 } from 'three';

const vector = new Vector3(1, 2, 3);
{{< /code >}}

我们可以直接访问和更新`.x`、`.y`和`.z`属性，或者我们可以使用`.set`一次更改所有这三个属性：

{{< code lang="js" linenos="false" caption="`Vector3`类: 更改属性值" >}}
vector.x; // 1
vector.y; // 2
vector.z; // 3

vector.x = 5;

vector.x; // 5

vector.set(7, 7, 7);

vector.x; // 7
vector.y; // 7
vector.z; // 7
{{< /code >}}

与几乎所有three.js类一样，我们可以省略参数以使用默认值。如果我们省略所有三个参数，则创建的`Vector3`将表示原点，即所有值为零：

{{< code lang="js" linenos="false" caption="`Vector3`类: 默认参数" >}}
const origin = new Vector3();

origin.x; // 0
origin.y; // 0
origin.z; // 0

mesh.position = new Vector3();
mesh.position.x; // 0
mesh.position.y; // 0
mesh.position.z; // 0
{{< /code >}}

three.js也有表示[2D向量](https://threejs.org/docs/#api/en/math/Vector2)和[4D向量](https://threejs.org/docs/#api/en/math/Vector4)的类，但是，3D向量是迄今为止我们将遇到的最常见的向量类型。

### 向量是通用数学对象

向量可以代表各种事物，而不仅仅是平移。任何可以表示为两个、三个或四个数字的有序列表的数据通常都会存储在一个向量类中。这些数据类型分为三类：

1. 空间中的一个点。
2. **坐标系内的长度和方向。**.
3. 没有更深的数学含义的数字列表。

第二类是向量的数学定义，平移属于这一类。第一类和第三类在技术上不是向量。但是，在向量类中重用代码很有用，所以我们对此视而不见。

## 我们的第二类转换：缩放

{{% note %}}
TODO-DIAGRAM: add diagram of scaling
{{% /note %}}

只要我们在所有三个轴上缩放相同的数量，缩放对象就会使其变大或变小。如果我们按不同的量缩放轴，对象将被压扁或拉伸。因此，缩放是可以改变对象形状的三个基本变换中唯一的一个。

像`.position`一样，`.scale`也是存储在`Vector3`中的, 对象的初始缩放比例是$(1,1,1)$：

{{< code lang="js" linenos="false" caption="对象的缩放存储在`Vector3`中" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.scale = new Vector3(1, 1, 1);
{{< /code >}}

### 缩放的值是相对于对象的初始大小

由于`.scale`和`.position`都存储在于`Vector3`中，因此缩放对象的工作方式与平移对象的方式大致相同。但是，虽然平移使用了three.js单位，但缩放不使用任何单位。相反，比例值与对象的初始大小成比例：1表示初始大小的100%，2表示初始大小的200%，0.5表示初始大小的50%，依此类推。

### 统一缩放：对所有三个轴使用相同的值

当我们以相同的量缩放所有三个轴时，对象将扩大或缩小，但保持其比例。这称为**统一缩放**。一个$(1,1,1)$的缩放, 表示100%的比例缩放$X$轴、$Y$轴和$Z$轴，它是一个默认值：

{{< code lang="js" linenos="false" caption="将对象重置为其初始比例" >}}
mesh.scale.set(1, 1, 1);
{{< /code >}}

一个$(2,2,2)$的缩放表示200%的比例放大$X$轴、$Y$轴和$Z$轴。该对象将增长到其初始大小的两倍：

{{< code lang="js" linenos="false" caption="将对象的大小放大1倍" >}}
mesh.scale.set(2, 2, 2);
{{< /code >}}

一个$(0.5,0.5,0.5)$的缩放表示50%的比例缩小$X$轴、$Y$轴和$Z$轴。对象将缩小到其初始大小的一半：

{{< code lang="js" linenos="false" caption="将对象缩小到一半大小" >}}
mesh.scale.set(0.5, 0.5, 0.5);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of uniform scale
{{% /note %}}

### 非均匀缩放：每个轴上的缩放值不同

如果我们缩放单个轴，对象将失去其比例并被压扁或拉伸。这称为**非均匀缩放**。如果我们只缩放$X$轴，物体会变宽或变窄：

{{< code lang="js" linenos="false" caption="非均匀缩放$X$轴" >}}
// double the initial width
mesh.scale.x = 2;

// halve the initial width
mesh.scale.x = 0.5;
{{< /code >}}

缩放$Y$轴将使对象更高或更短：

{{< code lang="js" linenos="false" caption="非均匀缩放$Y$轴" >}}
// squash the mesh to one quarter height
mesh.scale.y = 0.25;

// stretch the mesh to a towering one thousand times its initial height
mesh.scale.y = 1000;
{{< /code >}}

最后，如果我们缩放$Z$轴，对象的深度会受到影响：

{{< code lang="js" linenos="false" caption="非均匀缩放$Z$轴" >}}
// stretch the object to eight times its initial depth
mesh.scale.z = 8;

// squash the object to one tenth of its initial depth
mesh.scale.z = 0.1;
{{< /code >}}

同样的，我们可以使用`.set`一次在所有三个轴上进行缩放：

{{< code lang="js" linenos="false" caption="多轴同时非均匀缩放" >}}
mesh.scale.set(2, 0.5, 6);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of non-uniform scale
{{% /note %}}

### 负比例值镜像对象

小于零的缩放值除了使对象变小或变大之外，还会镜像对象。缩放值$-1$ _在任何单轴上_ 都会镜像对象而不影响大小：

{{< code lang="js" linenos="false" caption="镜像对象" >}}
// mirror the mesh across the X-axis
mesh.scale.x = -1;

// mirror the mesh across the Y-axis
mesh.scale.y = -1;

// mirror the mesh across the Z-axis
mesh.scale.z = -1;
{{< /code >}}

小于0且大于$-1$的值将镜像并挤压对象：

{{< code lang="js" linenos="false" caption="镜像和缩小对象" >}}
// mirror and squash mesh to half width
mesh.scale.x = -0.5;
{{< /code >}}

值小于$-1$将镜像和拉伸对象：

{{< code lang="js" linenos="false" caption="镜像和拉伸对象" >}}
// mirror and stretch mesh to double height
mesh.scale.y = -2;
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of mirror scale
{{% /note %}}

#### 统一缩放和镜像

要在保持其缩放比例的同时镜像对象，请对所有三个轴使用相同的值，但将其中一个设为负值。例如，将对象的大小放大一倍并在$Y$轴镜像，使用缩放值$(2, -2, 2)$：

{{< code lang="js" linenos="false" caption="统一缩放和镜像" >}}
mesh.scale.set(2, -2, 2);
{{< /code >}}

或者，将对象缩小到十分之一大小并在$X$轴镜像，使用缩放比例值$(-0.1,0.1,0.1)$：

{{< code lang="js" linenos="false" caption="统一缩放和镜像" >}}
mesh.scale.set(-0.1, 0.1, 0.1);
{{< /code >}}

### 相机和灯光无法缩放

并非所有对象都可以缩放。例如，相机和灯光（除了`RectAreaLight`）没有大小，因此缩放它们没有意义。更改`camera.scale`或`light.scale`将没有效果。

## 我们的最后一个转换：旋转

{{% note %}}
TODO-DIAGRAM: add diagram of rotation
{{% /note %}}

与平移或缩放相比，旋转需要更加小心。这有几个原因，但主要是**旋转顺序很重要**。如果我们在$X$轴、$Y$轴和$Z$轴平移或缩放，哪个轴先设置并不重要。以下三个平移方法最终得到的结果是一样的：

1. 平移$X$轴，然后$Y$轴，最后是$Z$轴。
2. 平移$Y$轴，然后$X$轴，最后是$Z$轴。
3. 平移$Z$轴，然后$X$轴，最后是$Y$轴。

下面的三种缩放操作最终结果也是一样的：

1. 缩放$X$轴，然后$Y$轴，最后是$Z$轴。
2. 缩放$Y$轴，然后$X$轴，最后是$Z$轴。
3. 缩放$Z$轴，然后$X$轴，最后是$Y$轴。

但是，这三个旋转 _可能_ 不会给出相同的结果：

1. 旋转$X$轴，然后$Y$轴，最后是$Z$轴。
2. 旋转$Y$轴，然后$X$轴，最后是$Z$轴。
3. 旋转$Z$轴，然后$X$轴，最后是$Y$轴。

结果，我们用于`.position`和`.scale`的不起眼的`Vector3`类不足以存储旋转数据。相反，three.js不是使用一个，而是用 _两个_ 数学类用于存储旋转数据。我们将在这里查看到更详细的内容：[欧拉角](https://en.wikipedia.org/wiki/Euler_angles)。幸运的是，它与`Vector3`类相似。

### 表示旋转的类：`Euler`类

欧拉角在three.js中使用类[`Euler`](https://threejs.org/docs/#api/en/math/Euler)表示 。与`.position`和`.scale`一样，当我们创建一个新的场景对象时，会自动创建一个`Euler`实例并为其赋予默认值。

{{< code lang="js" linenos="false" caption="对象的旋转存储为`Euler`角" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();
{{< /code >}}

与`Vector3`一样，有`.x`、`.y`和`.z`属性，以及`.set`方法：

{{< code lang="js" linenos="false" caption="该`Euler`类似于`Vector3`类" >}}
mesh.rotation.x = 2;
mesh.rotation.y = 2;
mesh.rotation.z = 2;

mesh.rotation.set(2, 2, 2);
{{< /code >}}

同样的，我们可以自己创建`Euler`实例：

{{< code lang="js" linenos="false" caption="创建一个`Euler`实例" >}}
import { Euler } from 'three';

const euler = new Euler(1, 2, 3);
{{< /code >}}

与`Vector3`一样，我们可以省略参数以使用默认值，同样，所有轴的默认值为零：

{{< code lang="js" linenos="false" caption="`Euler`类: 默认值" >}}
const euler = new Euler();

euler.x; // 0
euler.y; // 0
euler.z; // 0
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of rotations
{{% /note %}}

#### 欧拉旋转顺序

默认情况下，three.js将在对象的局部空间中围绕$X$轴，然后围绕$Y$轴，最后围绕$Z$轴旋转。我们可以使用[`Euler.order`属性](https://threejs.org/docs/#api/en/math/Euler.order)来改变它。默认顺序称为“XYZ”，但也可以使用“YZX”、“ZXY”、“XZY”、“YXZ”和“ZYX”。

我们不会在这里进一步讨论旋转顺序。通常，您需要更改顺序的唯一时候是在处理来自另一个应用程序的旋转数据时。即便如此，这通常也是由three.js加载器处理。现在，如果您愿意，可以简单地将`Euler`视为`Vector3`. 在您开始创建动画或执行涉及旋转的复杂数学运算之前，您不太可能遇到任何问题。

### 旋转单位是弧度

{{% note %}}
TODO-DIAGRAM: add degrees and radian diagram
{{% /note %}}

您可能熟悉使用**度数**来表示旋转。$360^{\circ}$代表一圈，$90^{\circ}$代表一个直角，等等。我们之前遇到的[透视相机的视野]({{< relref "/book/first-steps/first-scene#field-of-view-fov" >}} "透视相机的视野")是用度数指定的。

但是，**three.js中的所有其他角度都是使用[_弧度_](https://en.wikipedia.org/wiki/Radian)而不是 _度数_ 指定的**。$360^{\circ}$是一个圆圈，与之对应的是$2\pi$弧度。$90^{\circ}$是一个直角，与之对应的是$\frac{\pi}{2}$弧度。如果您喜欢使用弧度，那就太好了！至于我们其他人，我们可以使用[`.degToRad`](https://threejs.org/docs/#api/en/math/MathUtils.degToRad)实用程序将度数转换为弧度。

{{< code lang="js" linenos="false" caption="将度数转换为弧度" >}}
import { MathUtils } from 'three';

const rads = MathUtils.degToRad(90); // 1.57079... = π/2
{{< /code >}}

在这里，我们可以看到$90^{\circ}$等于$1.57079...$…， 或者$\frac{\pi}{2}$弧度。

### _另一个_ 旋转类：四元数Quaternions

{{% note %}}
TODO-LINK: Add link to quaternions chapter
{{% /note %}}

我们在上面提到，three.js有两个表示旋转的类。第二个，我们在这里只是顺便提一下，是[`Quaternion`类](https://threejs.org/docs/#api/en/math/Quaternion)。与`Euler`一起，每当我们创建新的场景对象（例如网格）时，都会为我们创建一个`Quaternion`并存储在属性`.quaternion`中：

{{< code lang="js" linenos="false" caption="对象的旋转存储为`Euler`角中" >}}
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();

// .. AND a Quaternion:
mesh.quaternion = new Quaternion();
{{< /code >}}

我们可以互换使用**四元数**和**欧拉角**。当我们更改`mesh.rotation`时，`mesh.quaternion`属性会自动更新，反之亦然。这意味着我们可以在欧拉角适用时使用欧拉角，并在四元数适用时切换到四元数。

欧拉角有几个缺点，在创建动画或进行涉及旋转的数学时会变得很明显。特别是，我们不能将两个欧拉角相加（更著名的是，它们还存在一种叫做[万向锁](https://en.wikipedia.org/wiki/Gimbal_lock)的问题）。四元数没有这些缺点。另一方面，它们比欧拉角更难使用，所以现在我们将坚持使用更简单的`Euler`类。

现在，请记下这两种旋转对象的方法：

1. **使用欧拉角，使用`Euler`类表示并存储在`.rotation`属性中。**
2. **使用四元数，使用`Quaternion`类表示并存储在`.quaternion`属性中。**

### 关于旋转对象的重要事项

尽管我们在本节中强调了一些问题，但旋转对象通常很直观。以下是一些需要注意的重要事项：

{{% note %}}
TODO-LOW: if non-targeted DirectionalLight is ever added revisit
{{% /note %}}

1. 并非所有对象都可以旋转。比如[我们上一章介绍的`DirectionalLight`]({{< relref "/book/first-steps/physically-based-rendering#introducing-the-directionallight" >}} "我们上一章介绍的`DirectionalLight`")就不能旋转。灯光从某个位置照射到目标，灯光的角度是根据目标的位置而不是`.rotation`属性计算得出的。
2. three.js中的角度是使用弧度而不是度数指定的。唯一的例外是[`PerspectiveCamera.fov`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov)属性使用度数来匹配真实世界摄影惯例的。

## 转换矩阵

在本章中，我们已经介绍了很多内容。我们介绍了笛卡尔坐标系、世界空间和局部空间、场景图、平移、旋转和缩放以及相关的`.position`、`.rotation`、和`.scale`属性，以及用于存储变换的三个数学类：`Vector3`、`Euler`和`Quaternion`。我们肯定不能在本章中塞进别的东西了对吧？

好吧，还有一件事。如果不讨论[**变换矩阵**](https://en.wikipedia.org/wiki/Transformation_matrix)，我们就无法结束关于变换的一章。虽然向量和欧拉角对我们人类来说（相对）容易使用，但它们对于计算机处理的效率并不高。当我们追求每秒60帧这一难以捉摸的目标时，我们必须在易用性和效率之间找到一条平衡线。为此，将对象的平移、旋转和缩放组合成一个称为矩阵的数学对象。这是尚未转换的对象的矩阵的样子。

<section>
$$
\begin{pmatrix}
   1 & 0 & 0 & 0 \\
   0 & 1 & 0 & 0 \\
   0 & 0 & 1 & 0 \\
   0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

它有四行四列，所以它是一个$4 \times 4$矩阵，它存储了一个对象的完整变换，这就是我们将其称为**变换矩阵**的原因。同样的，也有一个three.js类来处理这种类型的数学对象，称为[`Matrix4`](https://threejs.org/docs/#api/en/math/Matrix4)。 还有一个类表示$3\times3$的矩阵称为`Matrix3`。当矩阵在[主对角线](https://en.wikipedia.org/wiki/Main_diagonal)上全为1而其他地方都为0时，就像上图这样，我们称其为[**单位矩阵**，$I$](https://en.wikipedia.org/wiki/Identity_matrix)。

与单独的变换相比，矩阵对CPU和GPU的处理效率要高得多，它代表了一种折衷方案，可以为我们提供两全其美的效果。我们人类可以使用更简单`.position`，`.rotation`和`.scale`属性，然后，每当我们调用`.render`时，渲染器都会更新每个对象的矩阵并将它们用于内部计算。

我们将在这里花一些时间来了解转换矩阵的工作原理，但是如果您对数学过敏，则可以跳过本节（暂时）。您无需深入了解矩阵的工作原理即可使用three.js。你可以坚持使用`.position`，`.rotation`和`.scale`属性，然后让three.js处理矩阵。另一方面，如果你是一个数学天才，直接使用变换矩阵会带来一系列全新的机会。

### 局部矩阵

事实上，每个对象都不止一个，而是有两个变换矩阵。其中第一个是**局部矩阵**，它包含一个对象的`.position`、`.rotation`和`.scale`组合。局部矩阵存储在 [`Object3D.matrix`](https://threejs.org/docs/#api/en/core/Object3D.matrix)属性中。继承自`Object3D`的每个对象都具有此属性。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="当我们创建一个网格时，会自动创建一个局部变换矩阵" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates a Matrix4 for us:
mesh.matrix = new Matrix4();
```
{{< /code >}}

在这一时刻，矩阵看起来就像上面的单位矩阵，主对角线上全是1，其他地方都是零。如果我们改变对象的位置，然后强制矩阵更新：

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="对象变换的变化反映在局部矩阵中" >}}
``` js
mesh.position.x = 5;

mesh.updateMatrix();
```
{{< /code >}}

…现在，网格的局部矩阵将如下所示：

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 5 \\
  0 & 1 & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

通常，我们不需要手动调用`.updateMatrix`，因为渲染器会在渲染之前更新每个对象的矩阵。但是，在这里，我们希望立即看到矩阵的变化，因此我们必须强制更新。

如果我们改变所有三个轴上的位置并再次更新矩阵：

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="更改对象的平移位置，然后更新矩阵" >}}
``` js
mesh.position.x = 2;
mesh.position.y = 4;
mesh.position.z = 6;

mesh.updateMatrix();
```
{{< /code >}}

…现在我们可以看到平移存储在矩阵前三行的最后一列中。

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 2 \\
  0 & 1 & 0 & 4 \\
  0 & 0 & 1 & 6 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

接下来，让我们对对象缩放做同样的事情：

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="更改对象的缩放比例，然后更新矩阵" >}}
``` js
mesh.scale.x = 5;
mesh.scale.y = 7;
mesh.scale.z = 9;

mesh.updateMatrix();
```
{{< /code >}}

…我们会看到缩放比例值存储在主对角线上。

<section>
$$
\begin{pmatrix}
  5 & 0 & 0 & 2 \\
  0 & 7 & 0 & 4 \\
  0 & 0 & 9 & 6 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

非常好！这意味着我们可以编写一个公式来将平移和缩放存储在转换矩阵中。如果我们将平移值写为$T_{x}, T_{y}, T_{z}$, 缩放值写为$S_{x}, S_{y}, S_{z}$：

{{< code lang="js" linenos="false" hl_lines="" caption="" >}}
``` js
mesh.position.x = Tx;
mesh.position.y = Ty;
mesh.position.z = Tz;

mesh.scale.x = Sx;
mesh.scale.y = Sy;
mesh.scale.z = Sz;
```
{{< /code >}}

…现在变换矩阵如下所示：

<section>
$$
\begin{pmatrix}
  S_{x} & 0 & 0 & T_{x} \\
  0 & S_{y} & 0 & T_{y} \\
  0 & 0 & S_{z} & T_{z} \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

最后，让我们看看旋转是如何存储的。首先，让我们重置位置和缩放：
Finally, let's see how rotation is stored. First, let's reset the position and scale:

{{< code lang="js" linenos="false" hl_lines="" caption="重置位置和缩放" >}}
``` js
mesh.position.set(0, 0, 0);
mesh.scale.set(1, 1, 1);
mesh.updateMatrix();
```
{{< /code >}}

现在矩阵将再次看起来像单位矩阵，主对角线上全是1，其他地方都是零。接下来，让我们尝试围绕$X$轴做30度旋转：

{{< code lang="js" linenos="false" hl_lines="" caption="围绕$X$轴30度旋转" >}}
``` js
mesh.rotation.x = MathUtils.degToRad(30);

mesh.updateMatrix();
```
{{< /code >}}

…然后矩阵将如下所示：

<section>
$$
\begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & 0.866\dots & 0.5\dots & 0 \\
  0 & -0.5\dots & 0.866\dots & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

嗯……很奇怪。但是，当我们看到以下等式时，这更具意义：

<section>
$$
\begin{aligned}
\cos(30) &= 0.866\dots \\
\sin(30) &= 0.5
\end{aligned}
$$
</section>

所以，这个矩阵实际上是：

<section>
$$
\text{X-Rotation} = \begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & \cos(30) & \sin(30) & 0 \\
  0 & -\sin(30) & \cos(30) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

不幸的是，这并不像上面的变换和缩放示例那么直观。但是，我们再次使用它来编写公式。如果我们写出围绕$X$轴为$R_{x}$，下面的公式是围绕$X$轴的旋转：

<section>
$$
\text{X-Rotation} = \begin{pmatrix}
  1 & 0 & 0 & 0 \\
  0 & \cos(R_{x}) & \sin(R_{x}) & 0 \\
  0 & -\sin(R_{x}) & \cos(R_{x}) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

同样，这是围绕$Y$轴旋转的公式，$R_{y}$：

<section>
$$
\text{Y-Rotation} = \begin{pmatrix}
  \cos(R_{y}) & 0 & \sin(R_{y}) & 0 \\
  0 & 1 & 0 & 0 \\
  -\sin(R_{y}) & 0 & \cos(R_{y}) & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

最后，这是围绕$Z$轴旋转的公式，$R_{z}$：

<section>
$$
\text{Z-Rotation} = \begin{pmatrix}
  \cos(R_{z}) & -\sin(R_{z}) & 0 & 0 \\
  \sin(R_{z}) & \cos(R_{z}) & 0 & 0 \\
  0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

### 世界矩阵

正如我们多次提到的，对我们来说重要的是对象在世界空间中的最终位置，因为这是我们在渲染对象后所看到的。为了帮助计算这一点，每个对象都有第二个变换矩阵，即**世界矩阵**，存储在[`Object3D.matrixWorld`](https://threejs.org/docs/#api/en/core/.matrixWorld)中。 这两个矩阵在数学上没有区别。他们都是$4 \times 4$变换矩阵，当我们创建网格或任何其他场景对象时，局部矩阵和世界矩阵都会自动创建。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="当我们创建网格时，会自动创建局部矩阵和世界矩阵" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates the local matrix and the world matrix
mesh.matrix = new Matrix4();
mesh.matrixWorld = new Matrix4();
```
{{< /code >}}

**世界矩阵存储对象在世界空间中的位置**。如果对象是场景的直接子对象，这两个矩阵将是相同的，但如果对象位于场景图更深的某个位置，则局部矩阵和世界矩阵很可能是不同的。

为了帮助我们理解这一点，让我们再次回顾一下我们[之前提到的对象$A$和$B$](#working-with-the-scene-graph)：

{{< code lang="js" linenos="false" hl_lines="" caption="" >}}
``` js
const scene = new Scene();
const meshA = new Mesh();
const meshB = new Mesh();

// A starts at (0,0,0) in world space
scene.add(meshA);

// B starts at (0,0,0) in A's local space
meshA.add(meshB);

// move A relative to its parent the scene
meshA.position.x = 5;

// move B relative to its parent A
meshB.position.x = 3;

meshA.updateMatrix();
meshA.updateMatrixWorld();

meshB.updateMatrix();
meshB.updateMatrixWorld();
```
{{< /code >}}

{{% note %}}
TODO-LOW: make sure that .render updates both matrices
TODO-DIAGRAM: add diagram of A and B in the scene graph
{{% /note %}}

同样的，我们必须强制更新矩阵。或者，您可以调用`.render`，这样场景中所有对象的矩阵将自动更新。

如果您还记得之前，我们计算了对象$A$和$B$在世界空间中的最终位置，发现$A$位于$(5, 0, 0)$， 而$B$最终在位置$(8, 0, 0)$。让我们看看每个对象的本地和世界矩阵是如何工作的。首先是$A$的局部矩阵。

<section>
$$
A_{local} = \begin{pmatrix}
1 & 0 & 0 & 5 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

正如我们在上面看到的，物体在$X$轴的位置存储在其局部矩阵顶行的最后一列。现在，让我们看看$A$的世界矩阵：

<section>
$$
A_{world} = \begin{pmatrix}
1 & 0 & 0 & 5 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

因为$A$是场景的直接子对象，局部矩阵和世界矩阵是相同的。现在，让我们来看看$B$。 一、局部矩阵：

<section>
$$
B_{local} = \begin{pmatrix}
1 & 0 & 0 & 3 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

最后，这里是$B$的世界矩阵：

<section>
$$
B_{world} = \begin{pmatrix}
1 & 0 & 0 & 8 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$
</section>

这一次，局部矩阵和世界矩阵是不同的，因为$B$不是场景的直接子对象。

### 直接使用矩阵

希望这个简短的介绍能够解开矩阵工作原理的一些奥秘。它们并不像看起来那么复杂，相反，它们只是一种存储大量数字的紧凑方式。然而，记住所有这些数字需要一些练习，并且手动进行涉及矩阵的计算是乏味的。幸运的是，three.js带有许多函数，使我们能够轻松地处理矩阵。有最基本的函数，如加法、乘法、减法，以及设置和获取矩阵的平移、旋转或缩放分量的函数等等。

直接使用矩阵大部分不是必要的（但你使用了它，几乎不需要单独设置`.position`、`.rotation`和`.scale`属性），但它确实允许对对象的变换进行强大的操作。把它想象成一个超能力，一旦你的three.js技能水平足够高，你就会解锁它。

当一起使用我们在本章中遇到的所有属性时，- `.position`、`.rotation`、`.scale`、`.quaternion`、`.matrix`和`.matrixWorld` - 具有巨大的表现力，使您能够像艺术家一样用画笔创建场景。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="每个场景对象都有许多用于转换的属性" >}}
``` js
// when we create a mesh,
// or any other object derived from Object3D
// such as lights, camera, or even the scene itself
const mesh = new Mesh();

// ... internally, three.js creates
// many different objects to help us transform the object
mesh.position = new Vector3();
mesh.scale = new Vector3();
mesh.rotation = new Euler();

mesh.quaternion = new Quaternion();
mesh.matrix = new Matrix4();
mesh.matrixWorld = new Matrix4();
```
{{< /code >}}

学习如何使用`.position`、`.rotation`和`.scale`是使用three.js所需的基本技能。但是，学习使用`.quaternion`和变换矩阵是一项高级技能，您不需要立即掌握。

## 挑战

{{% aside success %}}

### 简单

1. 打开 _**cube.js**_ 模块并尝试使用`cube.position`、`cube.rotation`和`cube.scale`。

2. 打开 _**lights.js**_ 模块并尝试使用`light.position`。注意设置`light.rotation`和`light.scale`没有效果。

3. 在 _**camera.js**_ 模块中对`camera.position`和`camera.rotation`进行实验。注意设置`camera.scale`没有效果。

{{% /aside %}}

{{% aside %}}

### 中等

1. 创建第二个网格，称为`meshB`。让它变成不同的颜色或不同的形状，这样你就可以识别它。[将此新网格添加为第一个网格的子对象](#nesting-coordinate-systems)。从一个轴开始——也许是$X$轴 - 并调整每个网格的位置。尝试猜测当你这样做时两个网格最终位置将在哪里。注意平移是如何 _叠加_ 的。如果您将两个网格平移5个单位，则子对象将总共移动10个单位。

2. 现在尝试设置两个网格的旋转。同样，首先将自己限制在一个轴上。再次注意，旋转是相加的。如果您旋转父对象$45^{\circ}$, 子对象$45^{\circ}$，则子对象的最终旋转将是九十度。请记住使用`MathUtils.degToRad`将度数转换为弧度。

3. 最后，尝试设置两个网格的缩放比例。这一次，请注意缩放比例是 _相乘_ 的。如果将父网格缩放2倍，将子网格缩放4倍，则子网格将增长到其初始大小的八倍。

_注意：您可以将第二个网格添加到**cube.js**中的第一个网格：_

{{< code lang="js" linenos="false" caption="_**cube.js**_: 创建第二个网格" >}}
const cube = new Mesh(geometry, material);
const cubeB = new Mesh(geometry, material);

cube.add(cubeB);
{{< /code >}}

{{% note %}}
TODO-LOW: code block above has messed up indentation
{{% /note %}}

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 如果您熟悉弧度，请尝试不使用`.degToRad`方法进行上述练习。[您可以使用`Math.PI`访问JavaScript中$\pi$]({{< relref "/book/appendix/javascript-reference#the-math-object" >}} "您可以使用`Math.PI`访问JavaScript中$\pi$")。

{{% /aside %}}
