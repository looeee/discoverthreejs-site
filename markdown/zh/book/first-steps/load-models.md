---
title: "以glTF格式加载3D模型"
description: "在这里，我们向您展示如何加载复杂的动画模型并将它们添加到您的场景中。 这些模型最初是在 Blender 中创建的，并以 glTF 格式导出。"
date: 2018-04-02
weight: 113
chapter: "1.13"
available: true
showIDE: true
IDEFiles:
  [
    "assets/models/Flamingo.glb",
    "assets/models/Parrot.glb",
    "assets/models/Stork.glb",
    "worlds/first-steps/load-models/src/World/components/birds/birds.start.js",
    "worlds/first-steps/load-models/src/World/components/birds/birds.final.js",
    "worlds/first-steps/load-models/src/World/components/birds/setupModel.start.js",
    "worlds/first-steps/load-models/src/World/components/birds/setupModel.final.js",
    "worlds/first-steps/load-models/src/World/components/camera.js",
    "worlds/first-steps/load-models/src/World/components/lights.js",
    "worlds/first-steps/load-models/src/World/components/scene.js",
    "worlds/first-steps/load-models/src/World/systems/controls.js",
    "worlds/first-steps/load-models/src/World/systems/renderer.js",
    "worlds/first-steps/load-models/src/World/systems/Resizer.js",
    "worlds/first-steps/load-models/src/World/systems/Loop.js",
    "worlds/first-steps/load-models/src/World/World.start.js",
    "worlds/first-steps/load-models/src/World/World.final.js",
    "worlds/first-steps/load-models/src/main.start.js",
    "worlds/first-steps/load-models/src/main.final.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "vendor/three/examples/jsm/loaders/GLTFLoader.js",
    "worlds/first-steps/load-models/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/load-models/"
IDEActiveDocument: "src/World/components/birds/birds.js"
---

# 以glTF格式加载3D模型

{{< inlineScene entry="first-steps/birds-animated.js" class="round" >}}

在上一章中，我们使用一些内置的three.js几何图形创建了一个简单的玩具火车模型，很快就清楚地发现，仅使用这些几何图形很难构建任何复杂或现实的东西。要创建漂亮的3D模型，需要复杂的[建模程序](https://en.wikipedia.org/wiki/3D_modeling)。您可以使用three.js构建任何类型的3D应用程序，但是，从头开始构建建模应用程序将是一项巨大的工作。一个更简单的解决方案是使用现有程序并导出您的作品以在three.js中使用……或者，偷懒然后下载数以百万计的惊人模型和其他场景资产中的任何一个，这些模型和其他场景资产可在网络上的许多地方免费获得。

在本章中，我们将向您展示如何加载在[Blender](https://www.blender.org/)中创建的一些模型，这是一个开源3D图形应用程序，可用于建模、场景构建、材质创建、动画创作等。在Blender中创建模型后，您可以使用glTF等3D格式导出您的作品，然后使用[`GLTFLoader`插件](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)将模型导入到three.js中。

## 通过Web发送3D资源的最佳方式：glTF

在过去三十年左右的时间里， 人们在创建标准3D**资源交换格式**方面进行了许多尝试。直到最近，[FBX](https://threejs.org/examples/webgl_loader_fbx.html)、[OBJ (Wavefront)](https://threejs.org/examples/#webgl_loader_obj_mtl)和[DAE (Collada)](https://threejs.org/examples/?q=collada#webgl_loader_collada_skinning)格式仍然是其中最受欢迎的格式，尽管它们都存在阻碍其广泛采用的问题。比如OBJ不支持动画，FBX是属于Autodesk的封闭格式，Collada规范过于复杂，导致大文件难以加载。

{{% note %}}
TODO-LINK: add link to asset section
{{% /note %}}

然而，最近，一个名为**glTF**的新成员已成为在网络上交换3D资源的事实上的标准格式。[glTF](https://www.khronos.org/gltf/)（**GL传输格式**），有时被称为 _3D中的JPEG_，由[Kronos Group](https://www.khronos.org/)创建，他们负责WebGL、OpenGL和一大堆其他图形API。glTF最初于2017年发布，现在是在网络和许多其他领域交换3D资源的最佳格式。**在本书中，我们将始终使用glTF，如果可能，您也应该这样做**。它专为在网络上共享模型而设计，因此文件大小尽可能小，并且您的模型将快速加载。

但是，由于glTF相对较新，您最喜欢的应用程序可能还没有导出器。在这种情况下，您可以在使用模型之前将它们转换为glTF，或者使用其他加载器，例如`FBXLoaderor`或者`OBJLoader`。所有three.js加载器的工作方式相同，因此如果您确实需要使用另一个加载器，本章中的所有内容仍然适用，只有细微差别。

> 每当我们提到glTF时，我们指的是 _glTF Version 2_。最初的 _glTF Version 1_ 从未被广泛使用，并且不再被three.js支持

glTF文件可以包含模型、动画、几何图形、材质、灯光、相机，甚至整个场景。这意味着您可以在外部程序中创建整个场景，然后将其加载到three.js中。

{{< iframe src="https://threejs.org/examples/webgl_animation_keyframes.html" height="500" title="整个场景在单个`.glb`文件中。" class="" caption="整个场景在单个 _**.glb**_ 文件中。" >}}

### glTF文件的类型

glTF文件以标准和二进制形式出现。这些有不同的扩展名：

- **标准 _.gltf_ 文件未压缩，可能附带一个额外的 _.bin_ 数据文件。**
- **二进制 _.glb_ 文件将所有数据包含在一个文件中。**

标准和二进制glTF文件都可能包含嵌入在文件中的纹理或可能引用外部纹理。由于二进制 _**.glb**_ 文件要小得多，因此最好使用这种类型。另一方面，未压缩的 _**.gltf**_ 在文本编辑器中很容易阅读，因此它们可能对调试有用。

### three.js存储库上的免费glTF文件

[three.js存储库中有许多免费的glTF模型](https://github.com/mrdoob/three.js/tree/master/examples/models/gltf)，其中包括[parrot](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Parrot.glb)、[flamingo](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Flamingo.glb)和[stork](https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Stork.glb)的三个简单而漂亮的模型，由[mirada.com](http://mirada.com/)的天才创建 。这三个模型是[**低多边形**](https://en.wikipedia.org/wiki/Low_poly)的，这意味着它们甚至可以在最低功耗的移动设备上运行，它们甚至是动画的。

您可以在编辑器的 _**assets/models/**_ 文件夹中找到这三个文件。在本章中，我们将加载**_Parrot.glb_**、**_Flamingo.glb_**和**_Stork.glb_**，然后将每个文件包含的鸟形网格添加到我们的场景中。在下一章中，我们将向您展示如何播放包含在每只鸟中的飞行动画。

如果您在本地工作而不是使用内联代码编辑器，[则需要设置一个webserver]({{< relref "/book/introduction/prerequisites#a-web-server" >}} "则需要设置一个webserver")。否则，由于浏览器安全限制，您将无法从硬盘加载这些文件。

{{% aside  %}}

## 异步JavaScript

每当我们通过Internet加载模型时，我们需要以确保我们的应用程序在模型加载时继续平稳运行的方式这样做，并且在出现网络错误时也可以优雅地处理故障。有几种方法可以使用JavaScript解决这个问题，并且有一整章的附录专门讨论这个主题。

在本章中，我们将使用**异步函数**来加载模型，并且我们将假设您至少熟悉这些函数。如果这些对您来说是新的，或者您需要复习，请转到[异步JavaScript]({{< relref "/book/appendix/asynchronous-javascript" >}} "异步JavaScript")。

{{% /aside %}}

## `GLTFLoader`插件 {#gltf-loader}

要加载glTF文件，首先，您需要将[`GLTFLoader`插件](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)添加到您的应用程序中。这与添加[`OrbitControls`插件]({{< relref "/book/first-steps/camera-controls#importing-plugins" >}} "`OrbitControls`插件")的方式相同。您可以在repo的[_**examples/jsm/loaders/GLTFLoader.js**_](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js)中找到加载程序，我们也在编辑器中包含了这个文件。现在就立即去找到该文件吧。

导入和创建加载器实例的工作方式如下：

{{< code lang="js" linenos="false" caption="导入并创建一个`GLTFLoader`实例" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader();
{{< /code >}}

您可以使用加载程序的一个实例来加载任意数量的glTF文件。

### `.load`和`.loadAsync`方法

所有three.js加载器都有两种加载文件的方法：旧的基于回调的[`.load`](https://threejs.org/docs/#examples/en/loaders/GLTFLoader.load)方法和新的基于Promise的`.loadAsync`方法。再次参考第[A.5]({{< relref "/book/appendix/asynchronous-javascript" >}} "A.5")章，我们详细介绍了这两种方法之间的区别。Promise允许我们使用异步函数，这反过来会产生更简洁的代码，因此在本书中，我们将始终使用`.loadAsync`.

{{< code lang="js" linenos="false" caption="`GLTFLoader.loadAsync`" >}}
const loader = new GLTFLoader();

const loadedData = await loader.loadAsync('path/to/yourModel.glb');
{{< /code >}}

## 设置 _**Main.js**_ 和 _**World.js**_ 来处理Async/Await

关键字`await`意思是“在这里等到模型加载完毕”。如果您之前使用回调或Promises处理过加载模型，那么`await`它的简单性看起来几乎是神奇的。但是，我们需要对代码进行一些调整才能使用它，因为我们只能在已标记为`async`的函数内部使用`await`：

{{< code lang="js" linenos="false" caption="您只能在`async`函数内部使用`await`" >}}
async function loadingSuccess() {
// inside an async function: OK!
await loader.loadAsync('yourModel.glb');
}

function loadingFail() {
// not inside an async function: ERROR!
await loader.loadAsync('yourModel.glb');
}
{{< /code >}}

另一个问题是我们不能将构造函数标记为异步。一个常见的解决方案是创建一个单独的`.init`方法。

{{< code lang="js" linenos="false" caption="类的构造函数不能`async`" >}}
class Foobazzer {
constructor() {
// constructor cannot be async: ERROR!
await loader.loadAsync('yourModel.glb');
}

async init() {
// inside an async function: OK!
await loader.loadAsync('yourModel.glb')
}
}
{{< /code >}}

这样，构造函数可以像往常一样处理类的同步设置，然后init方法将接管异步设置。我们将使用这种方法，因此我们需要创建一个新`World.init`方法。

{{< code lang="js" linenos="" linenostart="1" hl_lines="" caption="我们将创建一个新`World.init`方法来处理异步设置" >}}

```js
class World {
  constructor() {
    // synchronous setup here
    // create camera, renderer, scene, etc.
  }

  async init() {
    // asynchronous setup here
    // load bird models
  }
}
```

{{< /code >}}

现在继续向World添加一个空`.init`方法，并确保标记它`async`。像这样将设置拆分为同步和异步阶段使我们可以完全控制应用程序的设置。在同步阶段，我们将创建不依赖加载资源的所有内容，在异步阶段，我们将创建所有依赖加载资源的内容。

### 将`main`函数标记为异步

在 _**main.js**_ 中，首先，我们还必须将main函数标记为异步。这是必需的，以便我们可以调用异步`World.init`方法。

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="3" to="3" lang="js" linenos="true" hl_lines="3" caption="_**main.js**_: 将main标记为`async`" >}}{{< /code >}}

现在我们可以调用设置World应用程序的两个阶段。首先是同步构造函数，像往常一样，然后是处理异步任务的新`.init`方法。

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="3" to="15" lang="js" linenos="true" hl_lines="8 11" caption="_**main.js**_: 调用World setup的同步和异步阶段" >}}{{< /code >}}

### 捕捉错误

除非我们还可以处理发生的任何错误，否则加载文件的方法是不完整的。错误可以像文件名中的拼写错误一样简单，也可以像网络错误那样更复杂。幸运的是，使用异步函数，错误处理也很简单。在 _**main.js**_ 的底部，替换这一行：

{{< code lang="js" linenos="" linenostart="17" caption="_**main.js**_: 调用main()函数" >}}
main();
{{< /code >}}

... 用这一行:

{{< code file="worlds/first-steps/load-models/src/main.final.js" from="17" to="19" lang="js" linenos="true" caption="_**main.js**_: 添加一个catch方法来处理错误" >}}{{< /code >}}

现在任何错误都将记录到控制台。在一个真实的应用程序中，您可能想要进行更复杂的错误处理，例如向用户显示一条消息，让他们知道出了点问题。但是，当我们处于开发模式时，最重要的是所有错误都会记录到我们可以看到的控制台。

## 创建 _**birds.js**_ 模块

现在一切都设置好了，我们可以继续加载我们的第一个模型。打开（或创建） _**components/birds/birds.js**_ 模块。首先导入`GLTFLoader`，然后创建一个异步`loadBirds`函数。在函数内部，创建loader的实例，最后在文件底部导出函数：

{{< code lang="js" linenos="" caption="_**birds/birds.js**_: 初始结构" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadBirds() {
const loader = new GLTFLoader();
}

export { loadBirds };
{{< /code >}}

这个新模块的结构你应该很熟悉，因为它几乎与[我们迄今为止创建的所有其他组件]({{< relref "/book/first-steps/world-app#systems-and-components" >}} "我们迄今为止创建的所有其他组件")相同。唯一的区别是`async`关键字。

在World中，更新导入列表：

{{< code from="1" to="4" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="1" caption="_**World.js**_: 导入组件" >}}{{< /code >}}

### 加载鹦鹉

现在，我们已经准备好使用`.loadAsync`加载 _**Parrot.glb**_ 文件了。完成后，将加载的数据记录到控制台：

{{< code lang="js" linenos="" linenostart="3" caption="_**birds.js**_: 加载鹦鹉" >}}
async function loadBirds() {
const loader = new GLTFLoader();

const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');

console.log('Squaaawk!', parrotData);
}
{{< /code >}}

接下来，在`World.init`中调用`loadBirds`：

{{< code lang="js" linenos="" linenostart="36" caption="_**World.js**_: 加载鸟类！" >}}
async init() {
await loadBirds();
}
{{< /code >}}

## `GLTFLoader`返回的数据 {#returned-gltf-data}

在将模型添加到场景之前，我们需要更深入地查看刚刚加载的数据，所以现在我们只是将数据记录到控制台。打开浏览器控制台（按 F12）。你应该看到 _Squaaawk!_ 这个词，并且后面跟着一个包含加载数据的对象。此对象包含文件中的网格、动画、相机和其他数据：

{{< code lang="js" linenos="false" caption="`GLTFLoader`返回的数据" >}}
{
animations: [AnimationClip]
asset: {generator: "Khronos Blender glTF 2.0 I/O", version: "2.0"}
cameras: []
parser: GLTFParser {json: {…}, extensions: {…}, options: {…}, cache: {…}, primitiveCache: {…}, …}
scene: Scene {uuid: "1CF93318-696B-4411-B672-4C12C46DF7E1", name: "Scene", type: "Scene", parent: null, children: Array(0), …}
scenes: [Scene]
userData: {}
**proto**: Object
}
{{< /code >}}

{{% note %}}
TODO-LOW: convert list to table without header
{{% /note %}}

- **`gltfData.animations`** 是一个动画剪辑数组。在这里，有一个飞行动画。我们将在[下一章中]({{< relref "/book/first-steps/animation-system" >}} "下一章中")使用它。
- **`gltfData.assets`** 包含显示此glTF文件的元数据 --- 使用[Blender](https://www.blender.org/)导出器创建。
- **`gltfData.cameras`** 是一组相机。该文件不包含任何摄像机，因此数组为空。
- **`gltfData.parser`** 包含关于`GLTFLoader`的技术细节。
- **`gltfData.scene`** 是一个包含文件中的任何网格的[`Group`]({{< relref "/book/first-steps/organizing-with-group#hello-group" >}} "`Group`")。**这是我们将找到鹦鹉模型的地方。**
- **`gltfData.scenes`**: glTF格式支持将多个场景存储在一个文件中。在实践中，很少使用此功能。
- **`gltfData.userData`** 可能包含额外的非标准数据。

_ `__proto__`是每个JavaScript对象都有的标准属性，你可以忽略它。_

通常，您只需要**`.animations`**、**`.cameras`**和**`.scene`**（而不是`.scenes`！），您可以放心地忽略其他所有内容。

{{% note %}}
TODO-LINK: link to animation chapter
{{% /note %}}

## 处理加载的数据

从glTF文件中提取数据通常遵循可预测的模式，尤其是当文件包含单个动画模型时，就像这三个文件一样。这意味着我们可以创建一个`setupModel`函数，然后在三个文件中的每一个上运行它。我们将在一个单独的模块中执行此操作。打开或创建 _**birds/setupModel.js**_ 模块，并按照现在熟悉的模式创建函数：

{{< code lang="js" linenos="" caption="_**birds/setupModel.js**_: 初始结构" >}}
function setupModel(data) {}

export { setupModel };
{{< /code >}}

这个函数的想法是我们可以传入加载的数据并取回鸟类模型，准备添加到场景中。接下来，将这个新模块导入到 _**birds.js**_ 中，然后传入加载的数据。最后，返回结果以在World中使用。

{{< code lang="js" linenos="" hl_lines="3 12 14" caption="_**birds.js**_: 处理加载的数据" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';

async function loadBirds() {
const loader = new GLTFLoader();

const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');

console.log('Squaaawk!', parrotData);

const parrot = setupModel(parrotData);

return { parrot }
}
{{< /code >}}

### 从加载的数据中提取网格

至此，我们在`setupModel`函数中有未处理的加载数据。下一步是提取模型，然后进行任何处理以准备使用。我们在这里需要做的工作量取决于模型，以及我们想用它做什么。在这里，我们需要做的就是提取网格，但在下一章中，我们将有更多工作要做，因为我们将动画剪辑连接到网格。

再次查看控制台中加载的数据，然后展开`gltfData.scene`。这是一个[`Group`]({{< relref "/book/first-steps/organizing-with-group#hello-group" >}} "`Group`")，并且文件中的任何网格都将是[该组的子级]({{< relref "/book/first-steps/transformations#the-scene-graph" >}} "该组的子级")。这些可以使用[`group.children`]({{< relref "/book/first-steps/transformations#accessing-a-scene-objects-children" >}} "`group.children`")数组访问。如果你往里面看，你会发现`glTF.scene.children`里面只有一个物体，所以那一定是我们的鹦鹉模型。

利用这些知识，我们可以完成`setupModel`函数：

{{< code file="worlds/first-steps/load-models/src/World/components/birds/setupModel.final.js" from="1" to="5" lang="js" linenos="true" hl_lines="2 4" caption="_**setupModel.js**_: 从加载的数据中提取模型" >}}{{< /code >}}

_注意 A：如果您在编辑器中单击切换完成场景，然后在控制台中查看`gltfData.scene.children`数组，它将为空。这是因为，当您查看它时，网格已经被移除并添加到场景中。_

_注意 B：您也可以将`gltf.scene`添加到您的场景中，因为它是一个组。这将为您的场景图添加一个额外的节点，但一切仍然有效。但是，最好让场景图尽可能简单，因为每个节点都意味着渲染场景需要额外的计算。_

### 将网格添加到场景中

在World中，`loadBirds`现在返回鹦鹉网格，您可以将其添加到场景中：

{{< code lang="js" linenos="" hl_lines="35 37" linenostart="34" caption="_**World.js**_: 将网格添加到场景中" >}}
async init() {
const { parrot } = await loadBirds();

    scene.add(parrot);

}
{{< /code >}}

## 加载其他两只鸟

您可以使用`GLTFLoader`的单个实例来加载任意数量的文件。当使用异步函数执行多个异步操作时，您应该（在大多数情况下）使用`Promise.all`。我们[在附录中]({{< relref "/book/appendix/asynchronous-javascript#loading-multiple-files-with-async-functions-first-attempt" >}} "在附录中")更详细地讨论了这个原因，但这里是简短的版本。

首先，这是加载其他两个文件的显而易见的方式：

{{< code lang="js" linenos="false" caption="加载多个glTF文件，错误的方式" >}}
// Don't do this!
const parrotData = await loader.loadAsync('/assets/models/Parrot.glb');
const flamingoData = await loader.loadAsync('/assets/models/Flamingo.glb');
const storkData = await loader.loadAsync('/assets/models/Stork.glb');

const parrot = setupModel(parrotData);
const flamingo = setupModel(flamingoData);
const stork = setupModel(storkData);
{{< /code >}}

这种方法有问题。[正如我们上面所说的](#set-up-main-js-and-world-js-to-handle-async-await)，`await`意味着 _在这里等待，直到文件加载完毕_。这意味着应用程序将等到鹦鹉完全加载，_然后_ 开始加载火烈鸟，等到 _它_ 完全加载，_最后_ 开始加载鹳。使用这种方法，加载时间将比应有的时间长近三倍。

相反，我们希望同时加载所有三个文件，最简单的方法是使用`Promise.all`。

{{< code lang="js" linenos="" linenostart="8" hl_lines="" caption="_**birds.js**_: 使用`Promise.all`加载其他两个文件" >}}

```js
const [parrotData, flamingoData, storkData] = await Promise.all([
  loader.loadAsync("/assets/models/Parrot.glb"),
  loader.loadAsync("/assets/models/Flamingo.glb"),
  loader.loadAsync("/assets/models/Stork.glb"),
]);
```

{{< /code >}}

然后我们可以使用`setupModel`函数处理每个文件的加载数据。一旦我们这样做了，这就是我们的（几乎完整的）`loadModels`函数：

{{< code lang="js" linenos="" hl_lines="8-12 17-18 22 23" linenostart="5" caption="_**birds.js**_: 加载并处理多个glTF文件" >}}
async function loadBirds() {
const loader = new GLTFLoader();

const [parrotData, flamingoData, storkData] = await Promise.all([
loader.loadAsync('/assets/models/Parrot.glb'),
loader.loadAsync('/assets/models/Flamingo.glb'),
loader.loadAsync('/assets/models/Stork.glb'),
]);

console.log('Squaaawk!', parrotData);

const parrot = setupModel(parrotData);
const flamingo = setupModel(flamingoData);
const stork = setupModel(storkData);

return {
parrot,
flamingo,
stork,
};
}
{{< /code >}}

在World中，您现在拥有所有三个模型。将它们添加到您的场景中：

{{< code lang="js" linenos="" linenostart="36" caption="_**World.js**_: 将另外二只鸟添加到场景中" >}}
async init() {
const { parrot, flamingo, stork } = await loadBirds();

scene.add(parrot, flamingo, stork);
}
{{< /code >}}

非常不错！额...

{{< inlineScene entry="first-steps/birds-jumbled.js" >}}

就像参观动物园一样！

### 将小鸟移动到位

从glTF文件加载的模型可能已经指定了位置，但这里不是这种情况，所以所有三个模型都从点$(0,0,0)$开始, 都在彼此之上混杂在一起。我们将调整每只鸟的位置，使其看起来像是在编队飞行：

{{< code from="16" to="23" file="worlds/first-steps/load-models/src/World/components/birds/birds.final.js" lang="js" linenos="true" hl_lines="17 20 23" caption="_**birds.js**_: 将小鸟移动到位" >}}{{< /code >}}

### 最终的 _**birds.js**_ 模块

_**birds.js**_ 模块现已完成。这是最终的代码：

{{< code file="worlds/first-steps/load-models/src/World/components/birds/birds.final.js" from="1" to="32" lang="js" linenos="true" caption="_**birds.js**_: 最终代码" >}}{{< /code >}}

### 将相机对准鹦鹉

我们要做的最后一件事是[调整`OrbitControls`目标]({{< relref "/book/first-steps/camera-controls#manually-set-the-target" >}} "调整`OrbitControls`目标")。目前，它位于其默认位置，即场景的中心。现在我们已经将鸟儿排成队形，这最终会出现在鹦鹉尾巴周围的某个地方。如果相机聚焦在鸟的中心而不是它的尾巴上会更好看。我们可以轻松设置它通过复制`parrot.position`给`controls.target`。但是，要做到这一点，我们需要访问`.init`里的`controls`，所以首先，让我们将其转换为模块作用域的变量。

{{< code from="11" to="15" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="12" caption="_**World.js**_: 定义`controls`一个模块作用域变量" >}}{{< /code >}}

{{< code from="18" to="32" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="24" caption="_**World.js**_: 定义`controls`一个模块作用域变量" >}}{{< /code >}}

现在，可以在`.init`里面访问controls，我们可以将目标移动到鹦鹉的中心。

{{< code from="34" to="41" file="worlds/first-steps/load-models/src/World/World.final.js" lang="js" linenos="true" hl_lines="38" caption="_**World.js**_: 使用相机瞄准鹦鹉" >}}{{< /code >}}

{{< inlineScene entry="first-steps/birds-still.js" class="" >}}

接下来，我们将介绍three.js动画系统，并向您展示如何播放与鸟类模型一起加载的动画片段。

## 挑战

{{% aside success %}}

### 简单

1. 看看那只抢风头的鹦鹉！切换鸟的位置，让鹳和火烈鸟各自轮流带领鸟群。

2. 或者，将鸟类留在原地，并尝试将`controls.target`注意力集中在另外两只鸟中的一只而不是鹦鹉身上。

{{% /aside %}}

{{% aside %}}

### 中等

1. 添加一个带有 _Switch Focus_ 文本的`<button>`的元素。每当您单击此按钮时，相机应聚焦在下一只鸟身上。你可以随心所欲地实现它，但是，如果你想按照我们目前的工作来做，你应该在 _**main.js**_ 中设置按钮，然后用一个方法[扩展World类接口]({{< relref "/book/first-steps/world-app#the-world-interface" >}} "扩展World类接口")，将焦点移到下一个鸟。您可以命名此方法为`World.focusNext`或类似的方法。

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 实现上面的按钮后，您将拥有三个摄像机视图，每只鸟一个。添加第四个视图，它是场景的缩小概览，可让您看到所有三只鸟。对于这第四个视图，您可能需要调整`camera.position`以及`controls.target`。

2. 现在，让相机从一个视点平滑地动画化到下一个视点。您必须同时为camera.position和controls.target设置动画。最好的地方是在`controls.tick`方法内。

{{% note %}}
TODO-LOW: test the above challenges
{{% /note %}}

{{% /aside %}}
