---
title: "Three.js应用的结构"
description: "为了展示我们的three.js场景，我们需要一个网页。 在这里，我们使用HTML和CSS创建一个基本页面。 但是，我们将从这个简单的页面开始逐步的构建我们的three.js应用程序，以便您可以轻松地将其与React或Vue等框架集成，而不仅仅是个简单的页面。"
date: 2018-04-02
weight: 101
chapter: "1.1"
available: true
showIDE: true
IDEFiles:
  [
    "assets/models/Flamingo.glb",
    "assets/textures/uv-test-bw.png",
    "worlds/first-steps/app-structure/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/loaders/GLTFLoader.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/app-structure/index.html",
  ]
IDEClosedFolders: ["assets", "vendor"]
IDEStripDirectory: "worlds/first-steps/app-structure/"
IDEActiveDocument: "index.html"
IDESwitchImportsAllow: false
prevURL: "/book/first-steps/"
prevTitle: "入门：真正的乐趣从这里开始！"
---

# Three.js应用的结构

在我们构建一个three.js 应用程序之前，我们需要创建一个网页。我们在简介中简要讨论了我们将如何做到这一点（{{< link path="/book/introduction/get-threejs/" title="Ch 0.5" >}}和{{< link path="/book/introduction/threejs-with-frameworks/" title="Ch 0.6" >}}），但现在让我们更深入地了解一下。正如我们在上一章中提到的，我们的目标是尽可能创建最基本、最简单、最平淡无奇的网页，而无需对使用three.js的真实Web应用程序的外观做出任何假设。通过这样做，我们确保我们编写的代码可以适应任何地方，而无需太多努力。

我们将只用两个文件创建这个基本网页：_**index.html**_和_**styles/main.css**_。就是这样。现在按下{{< icon "solid/columns" >}}按钮打开编辑器并查看这两个文件。

> 如果您对本章的任何内容不熟悉，请参阅{{< link path="/book/appendix/html-and-css-reference" title="A.1：本书中使用的 HTML 和 CSS" >}}，在那里我们介绍了如何深入了解简单网页的构建。

## _**index.html**_

_**index.html**_ 是我们应用程序的根文件。它是我们在浏览器中直接打开的唯一文件，所有 CSS 和 JavaScript 文件都是通过该文件的引用加载的。

{{< code file="worlds/first-steps/app-structure/index.html" lang="html" linenos="true" caption="_**index.html**_: 我们网页的根目录" >}}{{< /code >}}

## _**styles/main.css**_

在 _**index.html**_ 的`<head>`部分中，其中一个`<link>`元素引用了 _**styles/main.css**_ 文件：

{{< code from="12" to="12" hl_lines="" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: 引用 _**main.css**_" >}}{{< /code >}}

... 其中包含一些用于控制页面外观的简单样式：

{{< code file="styles/main.css" linenos="false" lang="css" caption="_**styles/main.css**_">}}{{< /code >}}

稍后我们将仔细查看样式`#scene-container`，而该文件的其余部分将在{{< link path="/book/appendix/html-and-css-reference/#main-css" title="附录" >}}中更详细地解释。

## _**src/main.js**_: JavaScript 入口点

回到 _**index.html**_，样式`<link>`的正下方是一个`<script>`标签引用了`src/main.js`文件：

{{< code from="14" to="14" hl_lines="" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: 引用 _**main.js**_" >}}{{< /code >}}

... 目前是空的：

{{< code file="worlds/first-steps/app-structure/src/main.js" lang="js" linenos=""
caption="_**src/main.js**_: 即将推出！" >}}{{< /code >}}

_**main.js**_ 是我们的JavaScript应用程序的入口点，我们将在下一章中填充它。该`type="module"`属性告诉浏览器我们正在编写JavaScript模块。如果这对您来说是新的，请转到{{< link path="/book/appendix/javascript-modules/" title="A.4：JavaScript 模块" >}}，其中包含您需要了解的有关JavaScript模块的所有信息，以遵循本书中的代码。

`module`属性还有另一个优点：浏览器将自动 _推迟_ 运行此文件，直到HTML被解析。这将防止由于在浏览器读取之前尝试访问HTML元素而导致的错误（浏览器从上到下读取HTML）。

## 向页面添加three.js场景

下一个在 _**index.html**_ 中的关注点是场景scene容器元素：

{{< code from="17" to="23" hl_lines="20 21 22" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: 场景scene容器" >}}{{< /code >}}

所有three.js场景都在一个[`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)元素内呈现。一旦我们设置了我们的应用程序，three.js将为我们创建一个画布，然后我们将它插入到场景scene容器中：

{{< code lang="html" linenos="false" caption="_**index.html**_: 一旦我们的应用程序运行，我们将把 three.js 画布插入到场景容器中" >}}

<div id="scene-container">
  <canvas></canvas>
</div>
{{< /code >}}

然后，我们可以通过设置场景容器元素的样式来控制场景的位置和大小。如果你把注意力转回_**main.css**_，你会看到我们已经为这个元素创建了一些样式。通过设置位置、宽度和高度，我们告诉浏览器这个元素应该占据整个window窗口：

{{< code from="24" to="35" hl_lines="" file="styles/main.css" lang="css" linenos="false" caption="_**main.css**_: 设置场景容器的样式" >}}{{< /code >}}

最后，我们将背景颜色设置为天蓝色，因为这是我们将在本节中为大部分的three.js场景提供的背景颜色。我们的场景需要几毫秒才能准备好，而浏览器会解析 JavaScript、加载3D模型并构建场景，而所有这些场景容器上的内容都是可见的。通过使容器与场景颜色相同，我们确保过渡尽可能平滑。

## 其他文件夹

将注意力转向编辑器中的文件树。到目前为止，我们还没有查看两个文件夹：_**assets/**_ 和 _**vendor/**_。

### {{< icon "solid/folder-open" >}} _**vendor/**_ 文件夹

_**vendor/**_ 文件夹是我们放置 _其他人_ 编写的JavaScript文件的地方。对于本书中的大多数示例，这意味着来自three.js库的文件，从{{< link path="/book/introduction/github-repo/" title="three.js GitHub仓库" >}}下载。在本书中，我们将只使用库中的三个文件：

- _**vendor/three/build/three.module.js**_: 主three.js文件.
- _**vendor/three/examples/jsm/controls/OrbitControls.js**_: 我们将在{{< link path="/book/first-steps/camera-controls/" title="Ch 1.9" >}}中介绍的相机控制插件。
- _**vendor/three/examples/jsm/loaders/GLTFLoader.js**_: 我们将在{{< link path="/book/first-steps/load-models/" title="Ch 1.13" >}}中介绍的3D模型加载器。

_**vendor/three**_ 文件夹反映了GitHub仓库的结构，但为了清楚起见，我们将仅包含每章所需的文件。我们将使用NPM的方式导入这些文件到 _**main.js**_ 中：

{{< code lang="js" linenos="false" caption="_**src/main.js**_: NPM的方式导入three.js文件" >}}
import {
Camera,
Group,
Scene,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
{{< /code >}}

如果您喜欢在{{< link path="/book/introduction/about-the-book/#working-on-your-own-machine" title="本地工作" >}}，您可以使用{{< icon "solid/download" >}}按钮从编辑器下载zip打包文件。在zip文件中，任何three.js导入都将转换为来自skypack.dev的CDN导入：

{{< code lang="js" linenos="false" caption="_**src/main.js**_: 通过CDN方式引入的three.js文件" >}}

```js
import { Camera, Group, Scene } from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js?module";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js?module";
```

{{< /code >}}

请参阅{{< link path="/book/introduction/get-threejs/" title="0.5：如何在您的项目中包含three.js" >}}以了解更多详细信息。

## {{< icon "solid/folder-open" >}} _**assets**_ 文件夹

{{< inlineScene entry="first-steps/flamingo-animated.js" class="medium right round" >}}

最后是 _**assets/**_ 文件夹。**我们的应用程序中使用的任何非HTML、CSS或JavaScript的东西都在这里**：纹理、3D模型、字体、声音等等。目前，我们将在{{< link path="/book/first-steps/textures-intro/" title="1.8 中使用一个测试纹理：纹理映射简介" >}}，以及我们将在{{< link path="/book/first-steps/load-models/" title="1.13 中使用的一个火烈鸟模型：以glTF格式加载3D模型" >}}。

{{% note %}}
TODO-LOW: apply test texture to the flamingo in this scene
{{% /note %}}

{{< clear >}}

有了这些，是时候开始做真正的工作了！在下一章中，我们将创建我们的第一个简单的three.js应用程序。
