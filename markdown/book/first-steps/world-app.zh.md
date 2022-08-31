---
title: "介绍世界应用程序"
description: "创建复杂的3D应用程序时，良好的代码架构至关重要。 在本章中，我们将单个main.js文件重构为几个小模块，以创建一个可以用于任意大小的three.js应用程序的模板。"
date: 2018-04-02
weight: 103
chapter: "1.3"
available: true
showIDE: true
IDEFiles:
  [
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/world-app/index.html",
    "worlds/first-steps/world-app/src/World/components/camera.start.js",
    "worlds/first-steps/world-app/src/World/components/cube.start.js",
    "worlds/first-steps/world-app/src/World/components/scene.start.js",
    "worlds/first-steps/world-app/src/World/systems/renderer.start.js",
    "worlds/first-steps/world-app/src/World/systems/Resizer.start.js",
    "worlds/first-steps/world-app/src/World/World.start.js",
    "worlds/first-steps/world-app/src/main.start.js",
    "worlds/first-steps/world-app/src/World/components/camera.final.js",
    "worlds/first-steps/world-app/src/World/components/cube.final.js",
    "worlds/first-steps/world-app/src/World/components/scene.final.js",
    "worlds/first-steps/world-app/src/World/systems/renderer.final.js",
    "worlds/first-steps/world-app/src/World/systems/Resizer.final.js",
    "worlds/first-steps/world-app/src/World/World.final.js",
    "worlds/first-steps/world-app/src/main.final.js",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/world-app/"
IDEActiveDocument: "src/World/World.js"
---

# 介绍世界应用程序

在本书中，我们的目标是创建简单但功能齐全的 three.js 应用程序，类似于您在专业环境中可能创建的应用程序。完成这些章节后，您将能够使用您在此处学到的内容创建任何大小的面向客户的精美 Web 应用程序，无论是[3D 产品展示](https://www.threekit.com/)、 [令人惊叹的官网页面](https://cineshader.com/)、 [视频](https://felixmariotto.itch.io/edelweiss)、[游戏](https://lazykitty.itch.io/ex-nihilo)或[游戏引擎](https://github.com/Usnul/meep)、 [音乐视频](http://www.ro.me/film)、 [3D 或 CAD 软件](https://clara.io/)、 [新闻可视化](https://www.nytimes.com/interactive/2019/04/17/world/europe/notre-dame-cathedral-fire-spread.html)，或几乎[任何您可以梦想的东西](https://dddance.party/?ref=three)。不仅如此，您还可以 _立即_ 使用这些章节中的代码作为构建您自己的应用程序的模板。

在上一章中，我们创建了第一个 three.js 应用程序，并在此过程中介绍了许多新的 three.js 和计算机图形信息。但是，我们没有注意我们编写的代码的质量或结构。在这里，我们将重构这个简单的单体应用程序以创建一个模板，我们可以将其用作本书其余示例的起点。为了确保我们的代码保持可访问性和易于理解，我们将应用程序拆分为多个小模块，每个模块处理复杂整体中的一小部分。

HTML 和 CSS 文件将保持不变，这里只需要重构 JavaScript。

### 模块化软件设计

在编写模块化 JavaScript 时，每个文件都是一个模块。因此，我们可以通过文件名来引用模块，例如 _**main.js**_，或者简单地称为 _主_ 模块。模块化软件设计的一个重要部分是选择模块的结构和名称。打开内联代码编辑器，您会看到本章所需的所有文件都已创建，尽管它们一开始都是空的。如果您愿意，请点击比较开关以查看已完成的代码，否则，请在阅读时尝试自己完成模块。

_附录中有一整章专门介绍[JavaScript 模块]({{< relref "/book/appendix/javascript-modules" >}} "JavaScript 模块")。如果这个主题对你来说是新的，那么现在是查看它的好时机。_

## 网页和世界应用程序

在前两章中，我们创建了一个由 _**index.html**_ 和 _**main.css**_ 组成的基本网页，然后我们在 _**main.js**_ 中编写了我们的 three.js 应用程序。但是，如果您还记得，在[0.7 中：将 three.js 与 React、Vue.js、Angular、Svelte、TypeScript 一起使用...]({{< relref "/book/introduction/threejs-with-frameworks" >}} "0.7 中：将 three.js 与 React、Vue.js、Angular、Svelte、TypeScript 一起使用...")，我们说过我们的目标是创建一个可以放入任何网络应用程序的组件，就像它可以与像这样的简单网页一起使用一样容易。为此，我们需要添加另一个小的抽象层。我们将从删除 _**main.js**_ 中的所有内容开始。现在，我们有一个简单的 Web 应用程序，由三个文件组成： _**index.html**_、 _**main.css**_ 和 _**main.js**_ （目前为空）。我们会制定一个规则：**这个 web 应用程序不能知道 three.js 的存在**。一旦我们构建了我们的 three.js 应用程序，所有 Web 应用程序都应该知道我们有一个能够生成 3D 场景的组件，但不知道该组件是 _如何_ 生成的。在现实世界中，这个 Web 应用程序可能要复杂得多，并且使用诸如 React 或 Svelte 之类的框架构建。但是，使用我们的 three.js 组件不会比这里更复杂。

为此，我们将把与 three.js 相关的所有内容移动到一个单独的应用程序（或组件）中，我们将把它放在 _**src/World**_ 文件夹中。在这个文件夹中，我们可以随意使用 three.js，但是在这个文件夹之外，我们将被禁止使用 three.js。此外，此文件夹中的文件应形成一个独立的组件，该组件对显示它的 Web 应用程序一无所知。这意味着我们可以拿着 _**World/**_ 文件夹，然后将其放入任何 Web 应用程序中，无论是像这样的简单 HTML 页面，还是使用 React、Angular 或 Vue 等框架制作的应用程序。这样想吧：您应该能够将您的 three.js 组件提供给另一个对 three.js 一无所知的开发人员，并在五分钟或更短的时间内跟他们解释如何将其集成到他们的 Web 应用程序中，而无需解释如何实现 three.js 工作。

从这里开始，我们将此文件夹及其内容称为**_World 应用程序_**。

## 世界应用

目前，我们的 three.js 场景比较简单。要设置它，我们需要再次遵循[上一章中概述]({{< relref "/book/first-steps/first-scene#simple-steps" >}} "上一章中概述")的六步程序：

1. 初始设置
2. [创建场景]({{< relref "book/first-steps/first-scene#create-scene" >}} "创建场景")
3. [创建相机]({{< relref "book/first-steps/first-scene#create-camera" >}} "创建相机")
4. [创建立方体并将其添加到场景中]({{< relref "book/first-steps/first-scene#create-visible" >}} "创建立方体并将其添加到场景中")
5. [创建渲染器]({{< relref "book/first-steps/first-scene#create-the-renderer" >}} "创建渲染器")
6. [渲染场景]({{< relref "book/first-steps/first-scene#render-scene" >}} "渲染场景")

但是，_使用_ 世界应用程序应如下所示：

1. 创建 World 应用程序的实例
2. 渲染场景

第一组六个任务是 _执行细节_。第二组两个任务是我们将要提供给包含 Web 应用程序的 _接口_。

### `World` 接口

目前接口非常简单。在 _**main.js**_ 中使用它看起来像这样：

{{< code lang="js" linenos="false" hl_lines="" caption="_**main.js**_: 创建world实例" >}}

```js
// 1. Create an instance of the World app
const world = new World(container);

// 2. Render the scene
world.render();
```

{{< /code >}}

应该隐藏与 _实现_ 世界应用程序不相关的所有内容。在 _**main.js**_ 中，我们应该无法访问场景、相机、渲染器或立方体。如果我们以后需要添加额外的功能，我们将通过扩展接口来实现，而 _不是_ 通过向外界公开 three.js 函数来实现。

请注意，我们将一个容器传递给 World 构造函数，它将再次成为我们的场景容器。在 World 中，我们将把画布附加到这个容器中，[就像我们在上一章中所做的那样]({{< relref "book/first-steps/first-scene#add-canvas" >}} "就像我们在上一章中所做的那样")。

_在阅读下一部分之前，如果需要，请查看附录以[复习 JavaScript 类]({{< relref "/book/appendix/javascript-reference#classes" >}} "复习 JavaScript 类")_。

## `World`类

现在，我们可以继续并开始构建`World`类。我们需要一个`constructor`方法来处理设置（创建场景、渲染器、立方体和相机，设置场景的大小，并将画布元素添加到容器中），以及一个`render`方法来渲染场景。打开或创建 _**src/World/World.js**_ 模块，创建 World 类，并在其中添加这两个方法。在文件的底部，导出类，以便我们可以从 _**main.js**_ 中使用它。

{{< code lang="js" linenos="false" caption="_**World.js**_: 初始设置" >}}
class World {
// 1. Create an instance of the World app
constructor(container) {}

// 2. Render the scene
render() {}
}

export { World };
{{< /code >}}

至此，我们的接口就完成了。其他一切都是实现。虽然这个接口还没有 _做_ 任何事情，但它已经 _可以使用了_ 。换句话说，我们可以继续完全设置 _**main.js**_，在适当的地方调用这些函数。稍后，一旦我们填写详细信息，该应用程序将神奇地开始工作。这是创建接口的常用方法。首先，决定它的外观并为接口的每个部分创建存根，_然后_ 关注细节。

## 设置 _**main.js**_

在 _**main.js**_ 中，现在应该是空的，我们将首先导入新的 World 类，然后我们将创建一个 main 函数并立即调用它来启动应用程序：

{{< code lang="js" linenos="true" caption="_**main.js**_: 初始设置" >}}
import { World } from './World/World.js';

// create the main function
function main() {
// code to set up the World App will go here
}

// call main to start the app
main();
{{< /code >}}

### 设置 World 应用程序

接下来，我们将执行两步 World 应用程序设置。首先，就像上一章一样，我们需要一个对容器的引用。然后我们将创建一个`new World`，最后，一切都设置好了，我们可以调用`world.render`来绘制场景。

{{< code from="3" to="12" file="worlds/first-steps/world-app/src/main.final.js" lang="js" linenos="true" caption="_**main.js**_: 创建一个全新的世界">}}{{< /code >}}

至此，_**main.js**_ 模块就完成了。稍后，当我们填写 World 应用程序的详细信息时，我们的场景就会栩栩如生。

## World 应用程序实现

当然，构建接口是很容易的部分。现在我们必须让它工作。幸运的是，从这里开始，主要是从前一章复制代码。再次查看这些我们设置的任务。

1. ~~初始设置~~
2. [创建场景]({{< relref "book/first-steps/first-scene#create-scene" >}} "创建场景")
3. [创建相机]({{< relref "book/first-steps/first-scene#create-camera" >}} "创建相机")
4. [创建立方体并将其添加到场景中]({{< relref "book/first-steps/first-scene#create-visible" >}} "创建立方体并将其添加到场景中")
5. [创建渲染器]({{< relref "book/first-steps/first-scene#create-the-renderer" >}} "创建渲染器")
6. [渲染场景]({{< relref "book/first-steps/first-scene#render-scene" >}} "渲染场景")

第一个完成并划掉。剩下的是后面五个。但是，我们将创建一个附加任务，该任务将在步骤 5 和 6 之间进行：

- 设置场景的大小。

我们将为每个剩余的任务创建一个新模块。目前，这些模块将非常简单，但随着应用程序规模的扩大，它们可能会变得更加复杂。像这样将它们拆分意味着复杂性永远不会变得不堪重负，World 类将保持可控，而不是螺旋式上升到千行级的厄运。

我们将这些模块分为两类：组件**components**和系统**systems**。组件是可以放置到场景中的任何东西，例如立方体、相机和场景本身，而系统是在组件或其他系统上运行的东西。在这里，是渲染器和大小调整函数，我们将其称为`Resizer`. 稍后您可能想要添加其他类别，例如实用程序**utilities**、商店**stores**等。

这为我们提供了以下新模块：

- _**components/camera.js**_
- _**components/cube.js**_
- _**components/scene.js**_
- _**systems/renderer.js**_
- _**systems/Resizer.js**_

如果您在本地工作，请立即创建这些文件，否则，请在编辑器中找到它们。`Resizer`有一个大写的`R`因为它将是一个类。其他四个模块每个都包含一个遵循这个基本模式的函数：

{{< code lang="js" linenos="false" caption="我们大多数新模块的基本模式" >}}
import { Item } from 'three';

function createItem() {
const instance = new Item();

return instance;
}

export { createItem }
{{< /code >}}

…其中`createItem`替换为`createCamera`, `createCube`, `createRenderer`, 或`createScene`。如果您不清楚这些模块中的任何代码，请返回上一章详细解释。

### Systems: Renderer 模块

首先是[渲染器系统]({{< relref "/book/first-steps/first-scene#create-the-renderer" >}} "渲染器系统"):

{{< code file="worlds/first-steps/world-app/src/World/systems/renderer.final.js" lang="js" linenos="true" hl_lines="4"
caption="_**systems/renderer.js**_" >}}{{< /code >}}

稍后，我们将调整渲染器的一些设置以提高渲染质量，但现在，具有默认设置的基本渲染器就可以了。

### Components: Scene 模块

接下来，场景组件：

{{< code file="worlds/first-steps/world-app/src/World/components/scene.final.js" lang="js" linenos="true" hl_lines="4 6"
caption="_**components/scene.js**_" >}}{{< /code >}}

在这里，我们创建了`Scene`该类的一个实例，然后使用`Color`将背景设置为`skyblue`，就像我们[在上一章中]({{< relref "/book/first-steps/first-scene#create-scene" >}} "在上一章中")所做的那样。

### Components: Camera 模块

第三个是[相机组件]({{< relref "/book/first-steps/first-scene#create-camera" >}} "相机组件"):

{{< code file="worlds/first-steps/world-app/src/World/components/camera.final.js" lang="js" linenos="true" hl_lines="4-9 11,12"
caption="_**components/camera.js**_" >}}{{< /code >}}

这与我们在上一章中用于设置相机的代码 _几乎_ 相同，只是这次我们使用了一个虚拟值`1`作为纵横比，因为它依赖于`container`的尺寸。我们想避免不必要地传递东西，所以我们将推迟设置纵横比，直到后面我们创建`Resizer`系统。

另一个区别：在上一章中，我们将相机的四个参数中的每一个都声明为变量，然后将它们传递给构造函数。在这里，我们切换到将它们声明为内联以节省一些空间。将此代码与上一章进行比较以查看差异。

{{< code from="20" to="26" file="worlds/first-steps/first-scene/src/main.final.js" lang="js" linenos="true" hl_lines="" caption="Ch 1.2: 你的第一个three.js场景：创建相机" header="" footer="" >}}{{< /code >}}

### Components: Cube 模块

第四个是立方体组件，它包括创建[几何体]({{< relref "/book/first-steps/first-scene#create-geometry" >}} "几何体")、[材质]({{< relref "/book/first-steps/first-scene#create-material" >}} "材质")和 [网格]({{< relref "/book/first-steps/first-scene#create-mesh" >}} "网格")。再次提醒，这里突出显示的行与上一章的代码相同。

{{< code file="worlds/first-steps/world-app/src/World/components/cube.final.js" lang="js" linenos="true" hl_lines="4,5,7,8,10,11"
caption="_**components/cube.js**_" >}}{{< /code >}}

稍后，我们可能会添加比这个简单立方体复杂得多的可见对象，在这种情况下，我们会将它们拆分为子模块。例如，游戏中的可玩角色可能是一个包含许多独立部分的复杂组件，因此我们将其放入 _**components/mainCharacter/**_ 中，其中我们将有诸如 _**mainCharacter/geometry.js**_、 _**mainCharacter/materials.js**_、_**mainCharacter/animations.js**_ 等之类的子模块。

### Systems: Resizer 模块

最后，我们将为`Resizer`模块创建一个存根。这个与其他的有点不同，因为它是一个类而不是一个函数（请注意，文件名以大写 _**R**_ 开头表示它是一个类）：

{{< code lang="js" linenos="" linenostart="0" hl_lines="" caption="_**systems/Resizer.js**_: 初始设置" >}}

```js
class Resizer {
  constructor() {}
}

export { Resizer };
```

{{< /code >}}

我们将在下面完成这门课。

## 设置`World`类

有了这个，我们的大部分组件`components`和系统`systems`都准备好了，我们可以填写`World`类的详细信息。首先，导入我们刚刚在 _**World.js**_ 上面创建的五个模块：

{{< code from="1" to="6" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true"
caption="_**World.js**_: 模块导入" >}}{{< /code >}}

### 设置相机、渲染器和场景

接下来，我们将设置相机、场景和渲染器，它们都需要在构造函数中创建，然后在`World.render`方法中访问。通常，这意味着我们会将它们保存为类成员变量：`this.camera`、`this.scene`和`this.renderer`：

{{< code lang="js" linenos="false" caption="类成员变量可从类外部访问" >}}

```js
class World {
  constructor() {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
  }
```

{{< /code >}}

但是，成员变量可以在 _**main.js**_ 中访问，这是我们 _**不想**_ 要的。

{{< code lang="js" linenos="false" caption="_**main.js**_: 不是我们想要的" >}}

```js
const world = new World();

// We can access member variables from the instance
console.log(world.camera);
console.log(world.renderer);
console.log(world.scene);
```

{{< /code >}}

### 好好保护你的秘密

我们希望 _仅_ 使用我们设计的接口与 World 应用程序进行交互，并且我们希望隐藏其他所有内容。为什么？想象一下，您长期努力地创建了一个美观、结构良好的 three.js 应用程序，然后您将其传递给您的客户端，以便他们集成到一个更大的应用程序中。他们对 three.js 一无所知，但他们是称职的开发人员，因此当他们需要更改某些内容时，他们开始翻找代码，并最终弄清楚他们可以访问相机和渲染器。他们打开了 three.js 文档，在阅读了五分钟后，更改了一些设置。这些可能会破坏应用程序的其他一些部分，因此它们会进行更多更改，更多更改，最终……混乱。_您_ 将被要求修复。

**通过将实现隐藏在一个简单的接口后面，您可以使您的应用程序万无一失且易于使用。它只做它应该做的，_没有别的_。** 通过隐藏实现，我们对使用我们代码的人实施了良好的编码风格。您可以访问的实现越多，它就越有可能成为您以后必须处理的复杂的半生不熟的“修复”。

六个月后用 _你_ 替换 _客户_ 这个词，一切仍然有效。如果您以后需要对应用程序进行一些快速更改，如果您除了简单的接口之外无法访问任何东西，您就不会想以一种 hacky 的方式进行更改。相反，您必须打开 World 应用程序并 _正确_ 修复问题（至少在理论上）。

当然，有时您确实想将相机和其他组件暴露给外界。但是，隐藏它们应该是默认设置。保护好你的秘密，只有在你有充分理由这样做时才公开它们。

### 但是该怎么做呢？

大多数语言都有私有类字段让你可以这么做，并且它们也将很快出现在 JavaScript 中。不幸的是，在撰写本章时，[支持并不好](https://caniuse.com/#search=private%20class%20fields)，所以现在我们必须寻找替代方案。

#### 模块作用域变量

我们可以通过在[模块作用域内]({{< relref "/book/appendix/javascript-reference#scope-and-closures" >}} "模块作用域内")声明变量来创建类似于私有变量的东西：

{{< code from="0" to="18" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="10-12 16-18" caption="_**World.js**_: 将相机、渲染器和场景创建为模块作用域变量" footer="  }" >}}{{< /code >}}

这样，我们可以从 World 模块中的任何位置访问`camera`和`renderer`，但 _不能_ 从 _**main.js**_ 访问。这正是我们想要的。

**重要说明**：如果我们创建`World`类的 _两个_ 实例，此解决方案将不起作用，因为模块作用域变量将在两个实例之间共享，因此第二个实例将覆盖第一个实例的变量。然而，我们只打算一次创建一个世界，所以我们会接受这个限制。

### 将画布添加到容器中

这样，我们的大部分设置就完成了。我们现在有了相机、场景和渲染器。[如果您还记得上一章]({{< relref "book/first-steps/first-scene#add-canvas" >}} "如果您还记得上一章")，当我们创建渲染器时，`<canvas>`元素也会被创建并存储在`renderer.domElement`中。 下一步是将其添加到容器中。

{{< code lang="js" linenos="" linenostart="14" hl_lines="19" caption="_**World.js**_: 将画布附加到容器" >}}

```js
class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);
  }
```

{{< /code >}}

### 渲染场景

接下来，我们将设置`World.render`以便我们可以看到结果。代码再次与[上一章]({{< relref "book/first-steps/first-scene#render-scene" >}} "上一章")相同。

{{< code from="28" to="31" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="30" caption="_**World.js**_: 完成渲染方法" >}}{{< /code >}}

{{< figure src="first-steps/world_app_unsized_background.png" caption="画布是红色矩形" lightbox="true" class="medium right" >}}

完成此操作后，如果一切设置正确，您的场景将被绘制到画布中。然而，cavnas 并没有占据容器的全部大小，因为我们还没有完成`Resizer`。相反，它是以`<canvas>`元素的默认大小创建的，即$300 \times 150$像素（至少在 Chrome 中）。

这不会很明显，因为我们已经将容器背景设置为与场景背景相同的颜色——它们都是“天蓝色”。但是，尝试暂时将画布设置为“红色”，这将变得很明显。

{{< code lang="js" linenos="" linenostart="6" hl_lines="" caption="_**scene.js**_: 暂时将画布设为红色以表明它还没有占据整个容器" >}}

```js
scene.background = new Color("red");
```

{{< /code >}}

我们稍后会解决这个问题，但首先，让我们将立方体添加到场景中。

### 创建立方体

立方体不需要是模块作用域变量，因为它只在构造函数中使用，所以调用`createCube`，将结果保存在一个名为`cube`的普通变量中，然后将其添加到场景中。

{{< code from="15" to="23" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="21 23" caption="_**World.js**_: 创建立方体并将其添加到场景中" footer="  }" >}}{{< /code >}}

现在，白色方块将出现在蓝色背景上。仍然大小为$300 \times 150$像素虽然。

## Systems: Resizer 模块

剩下的就是设置`Resizer`类。收集上一章中我们用来设置场景大小的所有代码，我们得到以下内容：

{{< code lang="js" linenos="false" caption="`Resizer`类中我们所需要做的" >}}

```js
// Set the camera's aspect ratio to match the container's proportions
camera.aspect = container.clientWidth / container.clientHeight;

// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);

// finally, set the pixel ratio to ensure our scene will look good on mobile devices
renderer.setPixelRatio(window.devicePixelRatio);
```

{{< /code >}}

在这里，我们将把这些行移到`Resizer`类中。为什么是一个类（为什么是 _Re_-sizer）？稍后，这个类会有更多的工作要做，例如，在[1.6：让我们的场景具有响应性（以及处理锯齿）]({{< relref "book/first-steps/responsive-design" >}} "1.6：让我们的场景具有响应性（以及处理锯齿）")中，我们将在浏览器窗口改变大小时设置自动调整大小。将它创建为一个类为我们提供了更多的空间，可以在以后添加功能而无需重构。

通过以上几行，我们可以看到`Resizer`需要容器、相机和渲染器（`devicePixelRatio`在[全局作用域内]({{< relref "book/appendix/javascript-reference#global-scope" >}} "全局作用域内")，这意味着它无处不在）。在 World 中，确保`Resizer`在导入列表中：

{{< code from="0" to="6" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="6" caption="_**World.js**_: 模块导入" >}}{{< /code >}}

…然后在构造函数中创建一个`resizer`实例：

{{< code from="15" to="26" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true" hl_lines="25" caption="_**World.js**_: 创建resizer" >}}{{< /code >}}

接下来，将我们在上一章收集的代码行复制到构造函数中，并更新方法的签名以包括容器、相机和渲染器。

{{< code lang="js" linenos="" linenostart="0" hl_lines="2 4 7 10" caption="_**Resizer.js**_: 几乎完成！" >}}

```js
class Resizer {
  constructor(container, camera, renderer) {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}
```

{{< /code >}}

{{< figure src="first-steps/perspective_frustum.svg" alt="透视相机平截头体" class="medium right" lightbox="true" >}}

这几乎完成了，尽管我们还需要做一件事。如果你回想一下上一章，相机使用纵横比以及视野以及近远裁剪平面来计算它的[视锥]({{< relref "/book/first-steps/first-scene#viewing-frustum" >}} "视锥")。**平截头体不会自动重新计算，因此当我们更改存储在`camera.aspect`、`camera.fov`、`camera.near`和`camera.far`中的任何这些设置时，我们还需要更新平截头体。**

相机将其平截头体存储在称为[**投影矩阵**](https://threejs.org/docs/#api/en/cameras/Camera.projectionMatrix)的数学对象中，为了更新它，我们需要调用相机的[`.updateProjectionMatrix`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.updateProjectionMatrix)方法。添加这一行为我们提供了完成 Resizer 类的最后一行：

{{< code from="1" to="15" file="worlds/first-steps/world-app/src/World/systems/Resizer.final.js" lang="js" linenos="true" hl_lines="7" caption="_**Resizer.js**_: 完成！" >}}{{< /code >}}

{{< figure src="first-steps/world_app_fullsized.png" caption="终于全尺寸了！" lightbox="true" class="medium right" >}}

这样，我们的重构就完成了，场景将扩大到占据整个窗口的大小。

### 最终的`World`类

一切就绪后，这是 _**World.js**_ 模块的完整代码。如您所见，此类协调着我们的 3D 场景的设置，同时将复杂性转移到单独的模块上。

{{< code from="1" to="47" file="worlds/first-steps/world-app/src/World/World.final.js" lang="js" linenos="true"
caption="_**World.js**_: 完整代码" >}}{{< /code >}}

哇！就是这些重构！如果你习惯于使用模块来构建你的代码，那么这一章可能会轻而易举。另一方面，如果这对您来说是全新的，那么可能需要一些时间来适应拆分这样的应用程序的想法。希望通过一步一步的完成，您现在可以更清楚地了解我们为什么选择这样做。

我们的应用程序现在可以启动了。在接下来的几章中，我们将添加光照、移动、用户控件、动画，甚至是一些比我们简陋的正方形更有趣的形状。你准备好了吗？

## 挑战

{{% aside success %}}

#### 简单

1. 更改场景背景的颜色。您可以输入任何标准颜色名称，例如红色、绿色、紫色等，以及一些不常见的名称，例如海蓝宝石或珊瑚色。你能猜出 140 个 CSS 颜色名称中的多少个？

{{% /aside %}}

{{% aside %}}

#### 中等

1. 将立方体更改为其他形状，例如矩形、球体、三角形或圆环。（提示：[在文档中搜索](https://threejs.org/docs)“BufferGeometry”。）

2. 添加第二个立方体并使用`mesh.position.set(x, y, z)`移动它（您需要找出从`createCube`函数返回两个多维数据集的某种方法，或者添加第二个模块，如 _**cube2.js**_）。

{{% /aside %}}

{{% aside warning %}}

#### 困难

_对于已经熟悉构建网站的人来说，这是一个挑战。如果您是 Web 开发的新手，可以跳过这个。_

1. 向 HTML 页面添加一个按钮，并延迟渲染场景，直到单击该按钮。_无需_ 对 World 应用程序进行任何更改即可执行此操作。相反，在 _**index.html**_ 中创建按钮并在 _**main.js**_ 中设置它。

{{% /aside %}}
