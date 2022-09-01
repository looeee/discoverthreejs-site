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

一个点沿$X$轴 _右侧_ 移动一个单位，沿$Y$轴 _上方_ 移动两个单位，沿$Z$轴 _外向_ 移动三个单位被写作$(1,2,3)$。 一个点沿$X$轴 _左侧_ 移动二个单位，沿$Y$轴 _下方_ 移动四个单位，沿$Z$轴 _内向_ 移动八个单位被写作$(-2,-4,-8)$。

> We call an ordered list of numbers like this a **vector**, and since there are three numbers, it's a **3D vector**.

### Translating an Object

We can translate along the $X$, $Y$, and $Z$ axes one by one, or we can translate along all three axes at once using `position.set`. The final result in both cases will be the same.

{{< code lang="js" linenos="false" caption="Two ways of translating an object" >}}
// translate one axis at a time
mesh.position.x = 1;
mesh.position.y = 2;
mesh.position.z = 3;

// translate all three axes at once
mesh.position.set(1,2,3);
{{< /code >}}

When we perform the translation $(1,2,3)$, we are performing the mathematical operation:

$$(0,0,0) \longrightarrow (1,2,3)$$

This means: move from the point $(0,0,0)$ to the point $(1,2,3)$.

{{% note %}}
TODO-DIAGRAM: add diagram of vector moving 0,0,0 -> 1,2,3
{{% /note %}}

### The Unit of Translation is Meters

When we perform the translation `mesh.position.x = 2`, we move the object **two three.js units to the right** along the $X$-axis, and [as we mentioned previously]({{< relref "/book/first-steps/physically-based-rendering#create-physically-sized-scenes" >}} "as we mentioned previously"), we'll always take one three.js unit to be equal to one meter.

### Directions in World Space

{{< figure src="first-steps/coordinate_system.svg" caption="Directions within World Space" class="medium left" lightbox="true" >}}

Above we mentioned moving an object left or right on the $X$-axis, up or down on the $Y$-axis, and in or out on the $Z$-axis. These directions are relative to your screen and assume that you have not rotated the camera. In that case, the following directions hold:

{{< clear >}}

* The positive $X$-axis points to the _right_ of your screen.
* The positive $Y$-axis points _up_, towards the top of your screen.
* The positive $Z$-axis points _out_ of the screen towards you.

Then, when you move an object:

* A positive translation on the $X$-axis moves the object to the _right_ on your screen.
* A positive translation on the $Y$-axis moves the object _up_ towards the top of your screen.
* A positive translation on the $Z$-axis moves the object _out_ towards you.

When we put a minus sign into the translation, we reverse those directions:

* A negative translation on the $X$-axis moves the object to the _left_ on your screen.
* A negative translation on the $Y$-axis moves the object _down_ towards the bottom of your screen.
* A negative translation on the $Z$-axis moves the object _in_, away from you.

But of course, you can rotate the camera in any direction, in which case these directions will no longer hold. After all, what you see on your screen is the viewpoint of the camera. However, it's useful to be able to describe directions in world space using "normal" language, so we'll treat this camera position as the default view and continue to describe directions using this terminology, no matter where the camera happens to be.

## Positions are stored in the `Vector3` Class

Three.js has a special class for representing 3D vectors called [`Vector3`](https://threejs.org/docs/#api/math/Vector3). This class has `.x`, `.y` and `.z` properties and methods like `.set` to help us manipulate them. Whenever we create any scene object, such as a `Mesh`, a `Vector3` is created automatically and stored in `.position`:

{{< code lang="js" linenos="false" caption="An object's translation is stored in a `Vector3`" >}}
// when we create a mesh ...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.position = new Vector3();
{{< /code >}}

We can also create `Vector3` instances ourselves:

{{< code lang="js" linenos="false" caption="Creating a `Vector3` instance" >}}
import { Vector3 } from 'three';

const vector = new Vector3(1, 2, 3);
{{< /code >}}

We can access and update the `.x`, `.y` and `.z` properties directly, or we can use `.set` to change all three at once:

{{< code lang="js" linenos="false" caption="The `Vector3` class: changing property values" >}}
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

As with nearly all three.js classes, we can omit the parameters to use default values. If we omit all three parameters the `Vector3` created will represent the origin, with all zero values:

{{< code lang="js" linenos="false" caption="The `Vector3` class: default parameters" >}}
const origin = new Vector3();

origin.x; // 0
origin.y; // 0
origin.z; // 0

mesh.position = new Vector3();
mesh.position.x; // 0
mesh.position.y; // 0
mesh.position.z; // 0
{{< /code >}}

three.js also has classes representing [2D vectors](https://threejs.org/docs/#api/en/math/Vector2) and [4D vectors](https://threejs.org/docs/#api/en/math/Vector4), however, 3D vectors are by far the most common type of vector we'll encounter.

### Vectors are General Purpose Mathematical Objects

Vectors can represent all kinds of things, not just translations. Any data that can be represented as an ordered list of two, three, or four numbers are usually stored in one of the vector classes. These data types fall into three categories:

1. A point in space.
2. **A length and direction within a coordinate system**.
3. A list of numbers with no deeper mathematical meaning.

Category two is the mathematical definition of a vector, and translation falls into this category.  Categories one and three are not technically vectors. However, it's useful to reuse the code within the vector classes so we'll turn a blind eye to this.

## Our Second Transformation: Scaling

{{% note %}}
TODO-DIAGRAM: add diagram of scaling
{{% /note %}}

Scaling an object makes it larger or smaller, so long as we scale by the same amount on all three axes. If we scale the axes by different amounts, the object will become squashed or stretched. As a result, scaling is the only one of the three fundamental transformations that can change the shape of an object.

Like `.position`, `.scale` is stored in a `Vector3`, and the initial scale of an object is $(1,1,1)$:

{{< code lang="js" linenos="false" caption="An object's scale is stored in a `Vector3`" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates a Vector3 for us:
mesh.scale = new Vector3(1, 1, 1);
{{< /code >}}

### Scale Values are Relative to the Initial Size of the Object

Since `.scale` and `.position` are both stored in a `Vector3`, scaling an object works much the same way as translating it. However, while translation uses three.js units, scale does not use any units. Instead, scale values are proportional to the initial size of the object: 1 means 100% of initial size, 2 means 200% of initial size, 0.5 means 50% of initial size, and so on.

### Uniform Scaling: Use the Same Value for all Three Axes

When we scale all three axes by the same amount, the object will expand or shrink, but maintain its proportions. This is called **uniform scaling**. A scale of $(1,1,1)$, meaning 100% scale on the $X$-axis, $Y$-axis, and $Z$-axis, is the default value:

{{< code lang="js" linenos="false" caption="Reset the object to its initial scale" >}}
mesh.scale.set(1, 1, 1);
{{< /code >}}

A scale of $(2,2,2)$ means 200% scale on the $X$-axis, $Y$-axis, and $Z$-axis. The object will grow to twice its initial size:

{{< code lang="js" linenos="false" caption="Double the object's size" >}}
mesh.scale.set(2, 2, 2);
{{< /code >}}

A scale of $(0.5,0.5,0.5)$ means 50% scale on the $X$-axis, $Y$-axis, and $Z$-axis. The object will shrink to half its initial size:

{{< code lang="js" linenos="false" caption="Shrink the object to half size" >}}
mesh.scale.set(0.5, 0.5, 0.5);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of uniform scale
{{% /note %}}

### Non-Uniform Scaling: Different Scale Values on Each Axis

If we scale individual axes the object will lose its proportions and become squashed or stretched. This is called **non-uniform scaling**. If we scale just the $X$-axis, the object will become wider or narrower:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $X$-axis" >}}
// double the initial width
mesh.scale.x = 2;

// halve the initial width
mesh.scale.x = 0.5;
{{< /code >}}

Scaling on the $Y$-axis will make the object taller or shorter:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $Y$-axis" >}}
// squash the mesh to one quarter height
mesh.scale.y = 0.25;

// stretch the mesh to a towering one thousand times its initial height
mesh.scale.y = 1000;
{{< /code >}}

Finally, if we scale on the $Z$-axis, the depth of the object will be affected:

{{< code lang="js" linenos="false" caption="Non-uniform scale on the $Z$-axis" >}}
// stretch the object to eight times its initial depth
mesh.scale.z = 8;

// squash the object to one tenth of its initial depth
mesh.scale.z = 0.1;
{{< /code >}}

Once again, we can use `.set` to scale on all three axes at once:

{{< code lang="js" linenos="false" caption="Non-uniform scale on multiple axes" >}}
mesh.scale.set(2, 0.5, 6);
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of non-uniform scale
{{% /note %}}

### Negative Scale Values Mirror an Object

Scale values less than zero will mirror the object in addition to making it smaller or larger. A scale value of $-1$ _on any single axis_ will mirror the object without affecting the size:

{{< code lang="js" linenos="false" caption="Mirror an object" >}}
// mirror the mesh across the X-axis
mesh.scale.x = -1;

// mirror the mesh across the Y-axis
mesh.scale.y = -1;

// mirror the mesh across the Z-axis
mesh.scale.z = -1;
{{< /code >}}

Values less than zero and greater than $-1$ will mirror _and_ squash the object:

{{< code lang="js" linenos="false" caption="Mirror and shrink object" >}}
// mirror and squash mesh to half width
mesh.scale.x = -0.5;
{{< /code >}}

Values less than $-1$ will mirror _and_ stretch the object:

{{< code lang="js" linenos="false" caption="Mirror and stretch object" >}}
// mirror and stretch mesh to double height
mesh.scale.y = -2;
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: add diagrams of mirror scale
{{% /note %}}

#### Uniform Scale and Mirror

To mirror an object while maintaining its proportions, use the same value for all three axes but make one of them negative. For example, to double an object's size and mirror on the $Y$-axis, use a scale value of $(2, -2, 2)$:

{{< code lang="js" linenos="false" caption="Uniform scale and mirror" >}}
mesh.scale.set(2, -2, 2);
{{< /code >}}

Or, to shrink the object to one-tenth size and mirror on the $X$-axis, use a scale value of $(-0.1,0.1,0.1)$:

{{< code lang="js" linenos="false" caption="Uniform scale and mirror" >}}
mesh.scale.set(-0.1, 0.1, 0.1);
{{< /code >}}

### Cameras and Lights Cannot be Scaled

Not all objects can be scaled. For example, cameras and lights (except for `RectAreaLight`) don't have a size, so scaling them doesn't make sense. Changing `camera.scale` or `light.scale` will have no effect.

## Our Final Transformation: Rotation

{{% note %}}
TODO-DIAGRAM: add diagram of rotation
{{% /note %}}

Rotation requires a little more care than translation or scaling. There are several reasons for this, but the main one is **the order of rotation matters**. If we translate or scale an object on the $X$-axis, $Y$-axis, and $Z$-axis, it doesn't matter which axis goes first. These three translations give the same result:

1. Translate along $X$-axis, then along the $Y$-axis, then along the $Z$-axis.
2. Translate along $Y$-axis, then along the $X$-axis, then along the $Z$-axis.
3. Translate along $Z$-axis, then along the $X$-axis, then along the $Y$-axis.

These three scale operations give the same result:

1. Scale along $X$-axis, then along the $Y$-axis, then along the $Z$-axis.
2. Scale along $Y$-axis, then along the $X$-axis, then along the $Z$-axis.
3. Scale along $Z$-axis, then along the $X$-axis, then along the $Y$-axis.

However, these three rotations _may_ not give the same result:

1. Rotate around $X$-axis, then around the $Y$-axis, then around the $Z$-axis.
2. Rotate around $Y$-axis, then around the $X$-axis, then around the $Z$-axis.
3. Rotate around $Z$-axis, then around the $X$-axis, then around the $Y$-axis.

As a result, the humble `Vector3` class that we used for both `.position` and `.scale` is not sufficient for storing rotation data. Instead, three.js has not one, but _two_ mathematical classes for storing rotation data. We'll look at the simpler of these here: [Euler angles](https://en.wikipedia.org/wiki/Euler_angles). Fortunately, it's similar to the `Vector3` class.

### Representing Rotations: the `Euler` class

Euler angles are represented in three.js using the [`Euler`](https://threejs.org/docs/#api/en/math/Euler) class. As with `.position` and `.scale`, an `Euler` instance is automatically created and given default values when we create a new scene object.

{{< code lang="js" linenos="false" caption="An object's rotation is stored as an `Euler` angle" >}}
// when we create a mesh...
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();
{{< /code >}}

As with `Vector3`, there are `.x`, `.y` and `.z` properties and a `.set` method:

{{< code lang="js" linenos="false" caption="The `Euler` class is similar to `Vector3`" >}}
mesh.rotation.x = 2;
mesh.rotation.y = 2;
mesh.rotation.z = 2;

mesh.rotation.set(2, 2, 2);
{{< /code >}}

Once again, we can create `Euler` instances ourselves:

{{< code lang="js" linenos="false" caption="Creating an `Euler` instance" >}}
import { Euler } from 'three';

const euler = new Euler(1, 2, 3);
{{< /code >}}

Also like `Vector3`, we can omit the parameters to use default values, and again, the default is zero on all axes:

{{< code lang="js" linenos="false" caption="The `Euler` class: default parameters" >}}
const euler = new Euler();

euler.x; // 0
euler.y; // 0
euler.z; // 0
{{< /code >}}

{{% note %}}
TODO-DIAGRAM: diagram of rotations
{{% /note %}}

#### Euler Rotation Order

By default, three.js will perform rotations around the $X$-axis, then around the $Y$-axis, and finally around the $Z$-axis, in an object's local space. We can change this using the [`Euler.order` property](https://threejs.org/docs/#api/en/math/Euler.order). The default order is called 'XYZ', but 'YZX', 'ZXY', 'XZY', 'YXZ' and 'ZYX' are also possible.

We won't get into rotation order further here. Usually, the only time you need to change the order is when dealing with rotation data from another app. Even then, this is usually taken care of by the three.js loaders. For now, if you like, you can simply think of `Euler` as a `Vector3`. Until you start to create animations or perform complex mathematical operations involving rotations, it's unlikely you'll run into any problems by doing so.

### The Unit of Rotation is Radians

{{% note %}}
TODO-DIAGRAM: add degrees and radian diagram
{{% /note %}}

You may be familiar with expressing rotations using **degrees**. There are $360^{\circ}$ in a circle, $90^{\circ}$ in a right-angle, and so on. The [perspective camera's field of view]({{< relref "/book/first-steps/first-scene#field-of-view-fov" >}} "perspective camera's field of view"), which we encountered earlier, is specified in degrees.

However, **all other angles in three.js are specified using [_radians_](https://en.wikipedia.org/wiki/Radian) rather than _degrees_**. Instead of $360^{\circ}$ in a circle, there are $2\pi$ radians. Instead of  $90^{\circ}$ in a right-angle, there are $\frac{\pi}{2}$ radians. If you're comfortable using radians, great! As for the rest of us, we can use the [`.degToRad`](https://threejs.org/docs/#api/en/math/MathUtils.degToRad) utility to convert from degrees to radians.

{{< code lang="js" linenos="false" caption="Converting degrees to radians" >}}
import { MathUtils } from 'three';

const rads = MathUtils.degToRad(90); // 1.57079... = π/2
{{< /code >}}

Here, we can see that $90^{\circ}$ is equal to $1.57079...$, or $\frac{\pi}{2}$ radians.

### The _Other_ Rotation Class: Quaternions

{{% note %}}
TODO-LINK: Add link to quaternions chapter
{{% /note %}}

We mentioned above that three.js has two classes for representing rotations. The second, which we'll mention only in passing here, is the [`Quaternion` class](https://threejs.org/docs/#api/en/math/Quaternion). Along with the `Euler`, a `Quaternion` is created for us and stored in the `.quaternion` property whenever we create a new scene object such as a mesh:

{{< code lang="js" linenos="false" caption="An object's rotation is stored as an `Euler` angle" >}}
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates an Euler for us:
mesh.rotation = new Euler();

// .. AND a Quaternion:
mesh.quaternion = new Quaternion();
{{< /code >}}

We can use **quaternions** and **Euler angles** interchangeably. When we change `mesh.rotation`, the `mesh.quaternion` property is automatically updated, and vice-versa. This means we can use Euler angles when it suits us, and switch to quaternions when it suits us.

Euler angles have a couple of shortcomings that become apparent when creating animations or doing math involving rotations. In particular, we cannot add two Euler angles together (more famously, they also suffer from something called [gimbal lock](https://en.wikipedia.org/wiki/Gimbal_lock)). Quaternions don't have these shortcomings. On the other hand, they are harder to use than Euler angles, so for now we'll stick with the simpler `Euler` class.

For now, make a note of these two ways to rotate an object:

1. **Using Euler angles, represented using the `Euler` class and stored in the `.rotation` property.**
2. **Using quaternions, represented using the `Quaternion` class and stored in the `.quaternion` property.**

### Important Things to Know About Rotating Objects

Despite the issues we highlighted in this section, rotating object is generally intuitive. Here are a couple of important things to take note of:

{{% note %}}
TODO-LOW: if non-targeted DirectionalLight is ever added revisit
{{% /note %}}

1. Not all objects can be rotated. For example, [the `DirectionalLight` we introduced in the last chapter]({{< relref "/book/first-steps/physically-based-rendering#introducing-the-directionallight" >}} "the `DirectionalLight` we introduced in the last chapter") cannot be rotated. The light shines _from_ a position, _towards_ a target, and the angle of the light is calculated from the target's position, not the `.rotation` property.
2. Angles in three.js are specified using radians, not degrees. The only exception is the [`PerspectiveCamera.fov`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov) property which uses degrees to match real-world photography conventions.

## Transformation Matrices

We've covered a lot of ground in this chapter. We've introduced Cartesian coordinate systems, world space and local space, the scene graph, translations, rotations, and scaling and the associated `.position`, `.rotation`, and `.scale` properties, and three mathematical classes used for storing transformations: `Vector3`, `Euler`, and `Quaternion`. Surely we couldn't cram anything else in?

Well, just one more thing. We can't end a chapter on transformations without discussing [**transformation matrices**](https://en.wikipedia.org/wiki/Transformation_matrix). While vectors and Euler angles are (relatively) easy for us humans to work with, they are not efficient for computers to process. As we chase the elusive goal of sixty frames per second, we must walk a fine line between ease of use and efficiency. To this end, the translation, rotation, and scale of an object are combined into a single mathematical object called a matrix. Here's what the matrix for an object that has not been transformed looks like.

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

It has four rows and four columns, so it's a $4 \times 4$ matrix, and it's storing an object's complete transform which is why we refer to it as a **transformation matrix**. Once again, there is a three.js class to handle this type of mathematical object, called [`Matrix4`](https://threejs.org/docs/#api/en/math/Matrix4). There's also a class for $3\times3$ matrices called `Matrix3`. When the matrix has all ones on the [main diagonal](https://en.wikipedia.org/wiki/Main_diagonal) and zeros everywhere else like the one above, we call it the [**identity matrix**, $I$](https://en.wikipedia.org/wiki/Identity_matrix).

Matrices are much more efficient for your CPU and GPU to work with than the individual transforms, and represents a compromise that gives us the best of both worlds. We humans can use the simpler `.position`, `.rotation`, and `.scale`, properties, then, whenever we call `.render`,  the renderer will update each object's matrices and use them for internal calculations.

We'll spend a bit of time here going into how transformation matrices work, but if you're allergic to math, it's absolutely fine to skip this section (for now). You don't need a deep understanding of how matrices work to use three.js. You can stick with using `.position`, `.rotation`, and `.scale` and let three.js handle the matrices. On the other hand, if you're a mathematical wizard, working directly with the transformation matrix opens up a whole new range of opportunities.

### The Local Matrix

Every object has, in fact, not one, but two transformation matrices. The first of these is the **local matrix**, which holds the combined `.position`, `.rotation`, and `.scale` of an object. The local matrix is stored in the [`Object3D.matrix`](https://threejs.org/docs/#api/en/core/Object3D.matrix) property. Every object that inherits from `Object3D` has this property.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="When we create a mesh, a local transformation matrix is created automatically" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates a Matrix4 for us:
mesh.matrix = new Matrix4();
```
{{< /code >}}

At this point, the matrix will look like the identity matrix above, with ones on the main diagonal and zeros everywhere else. If we change the position of the object, and then force the matrix to update:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changes to the transform of an object are reflected in the local matrix" >}}
``` js
mesh.position.x = 5;

mesh.updateMatrix();
```
{{< /code >}}

... now, the local matrix of the mesh will look like this:

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

Normally, we don't need to call `.updateMatrix` manually, since the renderer will update the matrix of every object before it's rendered. Here, though, we want to see the change in the matrix immediately so we must force an update.

If we change the position on all three axes and update the matrix again:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changing the object's translation and then updating the matrix" >}}
``` js
mesh.position.x = 2;
mesh.position.y = 4;
mesh.position.z = 6;

mesh.updateMatrix();
```
{{< /code >}}

... now we can see that translations are stored in the first three rows of the last column of the matrix.

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

Next, let's do the same for scale:

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Changing the object's scale and then updating the matrix" >}}
``` js
mesh.scale.x = 5;
mesh.scale.y = 7;
mesh.scale.z = 9;

mesh.updateMatrix();
```
{{< /code >}}

... and we'll see that the scale values are stored on the main diagonal.

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

Great! That means we can write a formula for storing translation and scale in a transformation matrix. If we write the translation values as $T_{x}, T_{y}, T_{z}$, and the scale values as $S_{x}, S_{y}, S_{z}$:

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

... now the transformation matrix looks like this:

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

Finally, let's see how rotation is stored. First, let's reset the position and scale:

{{< code lang="js" linenos="false" hl_lines="" caption="Reset the position and scale" >}}
``` js
mesh.position.set(0, 0, 0);
mesh.scale.set(1, 1, 1);
mesh.updateMatrix();
```
{{< /code >}}

Now the matrix will look like the identity matrix again, with ones on the main diagonal and zeros everywhere else. Next, let's try a thirty degree rotation around the $X$-axis:

{{< code lang="js" linenos="false" hl_lines="" caption="Thirty degree rotation around the $X$-axis" >}}
``` js
mesh.rotation.x = MathUtils.degToRad(30);

mesh.updateMatrix();
```
{{< /code >}}

... then the matrix will look like this:

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

Hmmm... weird. However, this makes more sense when we see the following equations:

<section>
$$
\begin{aligned}
\cos(30) &= 0.866\dots \\
\sin(30) &= 0.5
\end{aligned}
$$
</section>

So, this matrix is actually:

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

Unfortunately, this is not nearly as intuitive as the transform and scale examples above. However, once again we use it to write a formula. If we write the rotation around the $X$-axis as $R_{x}$, here's the formula for rotation around the $X$-axis:

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

Similarly, here's the formula for rotation around the $Y$-axis, $R_{y}$:

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

And finally, rotation around the $Z$-axis, $R_{z}$:

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

### The World Matrix

As we've mentioned a few times, what's important to us is the final position of an object in world space, since that's what we see once the object is rendered. To help with calculating this, every object has a second transformation matrix, the **world matrix**, stored in  [`Object3D.matrixWorld`](https://threejs.org/docs/#api/en/core/.matrixWorld). There's no difference, mathematically, between these two matrices. They're both $4 \times 4$ transformation matrices, and when we create a mesh or any other scene object, both the local and world matrices are created automatically.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="When we create a mesh, both local and world matrices are created automatically" >}}
``` js
// when we create a mesh
const mesh = new Mesh();

// ... internally, three.js creates the local matrix and the world matrix
mesh.matrix = new Matrix4();
mesh.matrixWorld = new Matrix4();
```
{{< /code >}}

**The world matrix stores the position of the object in world space**. If the object is a direct child of the scene, these two matrices will be identical, but if the object resides somewhere further down the scene graph, the local and world matrices will most likely be different.

To help us understand this, let's look at our [objects $A$ and $B$ from earlier](#working-with-the-scene-graph) once again:

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

Once again, we must force the matrices to update. Alternatively, you could call `.render` and the matrices of all objects in the scene will be automatically updated.

If you recall from earlier, we calculated the final positions of $A$ and $B$ in world space and found that $A$ is at $(5, 0, 0)$, while $B$ ends up at $(8, 0, 0)$. Let's examine how this works for each object's local and world matrices. First up is $A$'s local matrix.

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

As we saw above, the position of an object on the $X$-axis is stored in the last column of the top row of its local matrix. Now, let's look at $A$'s world matrix:

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

Since $A$ is a direct child of the scene, the local and world matrices are identical. Now, let's take a look at $B$. First, the local matrix:

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

And finally, here is $B$'s world matrix:

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

This time, the local and world matrices are different since $B$ is not a direct child of the scene.

### Working with Matrices Directly

Hopefully, this brief introduction has taken away some of the mystery of how matrices work. They are not as complicated as they look, rather, they are just a compact way of storing lots of numbers. However, keeping all those numbers in mind takes some practice, and doing calculations involving matrices by hand is tedious. Fortunately, three.js comes with many functions that allow us to work with matrices with ease. There are obvious functions like add, multiply, subtract, as well as functions to set and get the translation, rotation, or scale components of a matrix, and many others.

Working with the matrix directly, rather than setting `.position`, `.rotation`, and `.scale` separately is almost never _required_, but it does allow for powerful manipulations of an object's transform. Think of it like a superpower that you'll unlock once you level up your three.js skills enough.

When used together, all of the properties we've encountered in this chapter - `.position`, `.rotation`, `.scale`, `.quaternion`, `.matrix`, and `.matrixWorld` - have tremendous expressive power, and enable you to create scenes like an artist with a paintbrush.

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="Every scene object has many properties for transformation" >}}
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

Learning how to use the `.position`, `.rotation`, and `.scale` is a fundamental skill that you need to work with three.js. However, learning to use the `.quaternion` and transformation matrices is an advanced skill that you don't need to master immediately.

## Challenges

{{% aside success %}}

### Easy

1. Open up the _**cube.js**_ module and experiment with `cube.position`, `cube.rotation`, and `cube.scale`.

2. Open up the _**lights.js**_ module and experiment with `light.position`. Note how `light.rotation` and `light.scale` have no effect.

3. Experiment with `camera.position` and `camera.rotation` in the _**camera.js**_ module. Note how `camera.scale` has no effect.

{{% /aside %}}

{{% aside %}}

### Medium

1. Create a second mesh called `meshB`. Make it a different color or a different shape so you can recognize it. [Add this new mesh as a child of the first mesh](#nesting-coordinate-systems). Start with one axis - perhaps the $X$-axis - and adjust the position of each mesh. Try and guess where both meshes will end up when you do so. Notice how translations are _additive_. If you translate both meshes five units, the child will move a total of ten units.

2. Now try setting the rotation of both meshes. Again, start by constraining yourself to a single axis. Once again, note that rotations are additive. If you rotate the parent $45^{\circ}$, and the child $45^{\circ}$, the final rotation of the child will be ninety degrees. Remember to use `MathUtils.degToRad` to convert degrees to radians.

3. Finally, try setting the scale of both meshes. This time, note that scales are _multiplicative_. If you scale the parent mesh by two and the child by four, the child will grow to eight times its initial size.

_Note: you can add the second mesh to the first mesh in **cube.js**:_

{{< code lang="js" linenos="false" caption="_**cube.js**_: creating a second mesh" >}}
const cube = new Mesh(geometry, material);
const cubeB = new Mesh(geometry, material);

cube.add(cubeB);
{{< /code >}}

{{% note %}}
TODO-LOW: code block above has messed up indentation
{{% /note %}}

{{% /aside %}}

{{% aside warning %}}

### Hard

1. If you're familiar with radians, try doing the above exercises without the `.degToRad` method. [You can access $\pi$ in JavaScript using `Math.PI`]({{< relref "/book/appendix/javascript-reference#the-math-object" >}} "You can access $\pi$ in JavaScript using `Math.PI`").

{{% /aside %}}
