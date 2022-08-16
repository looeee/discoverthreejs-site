---
title: "如何在你的项目中引入three.js"
description: "构建three.js 应用程序的第一步是导入three.js文件。 有三种主要方法可以做到这一点：下载文件、使用 NPM 包或从 CDN 导入。"
date: 2018-04-02
weight: 6
chapter: "0.5"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/introduction/get-threejs/src/main.start.js",
    "worlds/introduction/get-threejs/src/main.final.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/introduction/get-threejs/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["styles"]
IDEStripDirectory: "worlds/introduction/get-threejs/"
IDEActiveDocument: "src/main.js"
IDESwitchImportsAllow: false
---

# 如何在你的项目中引入three.js

有几种方法可以在你的 JavaScript 应用程序中引入three.js，有些简单，有些复杂一些，但它们都归结为：你需要在你的项目中包含 three.js 核心，你可以在three.js仓库找到这个文件：

- [_**three.module.js**_](https://github.com/mrdoob/three.js/tree/master/build)

除了核心文件，我们经常会添加一些{{< link path="/book/introduction/github-repo/#examples-folder" title="插件" >}}，比如{{< link path="book/first-steps/camera-controls/" title="相机控制" >}}或后期处理。您可以在仓库的[_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm/)文件夹中找到插件 ，并且包含他们与核心文件大致相同的工作方式。在本章的其余部分，我们将使用该`OrbitControls`插件（一种流行的相机控制插件）进行演示，您可以在此处的 repo 中找到该插件：

- [_**examples/jsm/controls/OrbitControls.js**_](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js)

通过单击图标{{< icon "solid/columns" >}}打开此页面上的编辑器，您会看到我们已将这两个文件包含在**vendor**文件夹中：

- 核心文件夹在 _**vendor/three/build/three.module.js**_ 文件中
- `OrbitControls` 在 _**vendor/three/examples/jsm/controls/OrbitControls.js**_中。

我们还建立了一个非常简单的网页，由这三个文件组成：

- _**index.html**_
- _**src/main.js**_
- _**styles/main.css**_

现在查看**index.html**，您会看到我们在该文件的`<head>`部分中引用了**main.js**：

{{< code lang="js" linenos="true" linenostart="14" hl_lines="" caption="_**index.html**_: 引入了main.js文件" >}}

```js
<script type="module" src="./src/main.js"></script>
```

{{< /code >}}

特别需要注意的是`type="module"`，我们用它来告诉浏览器链接的文件是一个 JavaScript 模块。如果您对**index.html**中的任何内容不熟悉，请查看{{< link path="/book/appendix/html-and-css-reference/" title="" >}}。如果您对使用 JavaScript 模块不熟悉，或者您需要复习，请查看{{< link path="/book/appendix/javascript-modules/" title="" >}}。

## 导入three.js模块

核心和`OrbitControls`插件是 JavaScript 模块。要使用它们，首先，我们需要将它们导入到**main.js**中，所以现在打开那个文件。在本章的其余部分，我们将在此处演示导入**three.module.js**和**OrbitControls.js**的各种方法。

### 导入the three.js核心文件

three.js核心包含相机、材质、几何、纹理、灯光、阴影、动画系统、各种加载器、音频、渲染器、2D 形状、帮助文件、雾等数百个类。我们永远不会需要一次使用所有这些，事实上，几乎可以肯定你永远不需要在整个应用程序中使用所有这些，无论它有多大。因此，对于本章，假设我们只想从**three.module.js**导入三个类：[`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera), [`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial), 和 [`WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)。

#### 导入整个three.js核心文件

最简单的方法是将three.js核心中的{{< link path="book/appendix/javascript-modules/#using-namespaces-with-named-imports" title="所有内容导入" >}}**main.js**的THREE命名空间下：

{{< code lang="js" linenos="false" caption="_**main.js**_: 导入整个three.js核心文件" >}}
import \* as THREE from './vendor/three/build/three.module.js';
{{< /code >}}

然后我们可以通过在`THREE`命名空间下引用它们来使用核心的任何元素：

{{< code lang="js" linenos="false" caption="_**main.js**_: 再`THREE`命名空间下访问类" >}}

```js
THREE.PerspectiveCamera;
THREE.MeshStandardMaterial;
THREE.Texture;
// ... 剩下的几百个
```

{{< /code >}}

#### 从核心导入单个组件

然而，在本书中，我们宁愿只导入任何给定模块中我们需要的类：

{{< code lang="js" linenos="false" caption="_**main.js**_: importing class as we need them" >}}

```js
import {
  PerspectiveCamera,
  MeshStandardMaterial,
  WebGLRenderer,
} from "./vendor/three/build/three.module.js";
```

{{< /code >}}

现在，我们不需要导入数百个属性，而只需要三个：

{{< code lang="js" linenos="false" caption="_**main.js**_: accessing individually imported classes" >}}

```js
PerspectiveCamera;
MeshStandardMaterial;
WebGLRenderer;
```

{{< /code >}}

这样做会迫使我们更仔细地考虑我们在给定模块中使用的类，这意味着我们更有可能遵循最佳实践并保持我们的模块小而专注。我们也可以避免以`THREE`这种方式使用命名空间。

### 导入插件

**OrbitControls.js**模块包含一个导出，即类`OrbitControls`。导入它的工作方式与从核心导入类的方式相同：

{{< code lang="js" linenos="false" caption="_**main.js**_: import `OrbitControls`" >}}

```js
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";
```

{{< /code >}}

现在`OrbitControls`该类在**main.js**中可用。有了核心文件和相机控制插件，我们就可以开始构建我们的应用程序了。

## 如何获取three.js文件

没那么快！首先，我们如何获得这些文件？在编辑器中，我们已经为您获取了文件，但如果您在本地开发，则必须自己处理。以下是三种常见的方法。

### 1: 下载所有文件！ {#download-files}

最简单的方法是将整个 three.js Github 仓库下载到您的计算机上。这是[zip文件形式的three.js](https://github.com/mrdoob/three.js/archive/master.zip)的最新版本。下载它并查看**build/**和**examples/jsm/**文件夹，您会找到必要的文件。将zip文件中的所有内容提取到**vendor/**中，然后如上所述继续。

如果您是Web开发新手，您可能会发现这种方法最简单。您可以稍后升级到更复杂的方法。

### 2: 从CDN中引入需要的文件 {#use-a-cdn}

第二种方法是从CDN（内容交付网络）引入文件，这是一个专用于托管文件的远程站点，因此您可以在网页中使用它们而无需先下载它们。网络上有很多CDN，但是，其中许多不支持加载模块。其中可以用来加载模块的有[skypack.dev](https://www.skypack.dev/view/three)，它允许您加载任何已发布的 NPM 包。您可以在此处找到核心的**three.module.js**文件：

- https://cdn.skypack.dev/three@0.132.2

请注意，我们指定了版本号。您也可以省略从而始终返回最新版本的版本

- https://cdn.skypack.dev/three

但是，这样做意味着three.js的新版本可能会在您不注意时破坏您的应用程序，因此最好始终锁定该版本。

在加载插件时，您可以使用 repo 的结构来引用它们，因此您会在这里找到**OrbitControls.js**：

- https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js

要从 repo 中查找文件，请从 GitHub 获取 URL（例如**examples/jsm/controls/OrbitControls.js**）并在URL前面添加_**{{< t.inline >}}https://cdn.skypack.dev/0.{version}.0{{< /t.inline >}}**_，其中{version}是您正在使用的three.js 的发布版本。

在撰写本文时，最新版本是r132，在`0.132.2`末尾的`.2`代表发布到 NPM 后，已经有一些修补程序应用于该版本。每个月都会发布一个新版本。不必使用最新版本，但必须对主构建文件和您使用的任何扩展使用相同的版本。

从CDN导入文件的工作方式与从本地文件系统导入文件的方式相同，只是现在我们从skypack.dev而不是从我们的硬盘驱动器加载文件：

{{< code lang="js" linenos="false" caption="_**main.js**_: 从CDN中引入需要的three.js文件" >}}

```js
import {
  Camera,
  Material,
  Texture,
} from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
```

{{< /code >}}

### 3: 将three.js安装为NPM包 {#package-manager}

_注意：本节假设您对 JavaScript 包管理的工作原理有基本的了解。如果您不太了解这些的话，请暂时使用另一种方法获取文件。._

three.js也可以作为[NPM上的一个包](https://www.npmjs.com/package/three)使用。如果您的计算机上安装了[Node.js](https://nodejs.org/en/)和[NPM](https://www.npmjs.com/)（Node包管理器），则可以打开命令提示符并输入以下命令：

{{< code lang="js" linenos="false" caption="_**Command prompt**_: 将three.js安装为NPM包" >}}
// 初始化NPM项目
npm init

// 一旦初始化了NPM项目，就可以安装three的npm包了
npm install --save three
{{< /code >}}

再次，导入文件的工作方式相同，除了现在我们可以用包的名称替换大而丑陋的CDN URL，在本例中为_三个_：

{{< code lang="js" linenos="false" caption="_**main.js**_: 使用NPM包来导入three.js中的类" >}}
import {
Camera,
Material,
Texture,
} from 'three';
{{< /code >}}

当您这样做时，您的捆绑器将自动解析`three`为包的主要导出，在这种情况下为`three/build/three.module.js`. 也可以直接导入这个文件，没有区别：

{{< code lang="js" linenos="false" caption="_**main.js**_: 直接从three包中引入核心文件" >}}
import {
Camera,
Material,
Texture,
} from 'three/build/three.module.js';
{{< /code >}}

导入插件不是很方便，因为一个 NPM 包只能有一个主文件。要导入OrbitControls，我们需要直接引用包含模块：

{{< code lang="js" linenos="false" caption="_**main.js**_: 使用NPM包导入three.js插件" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
{{< /code >}}

有许多可用的打包工具，例如 Rollup、Webpack、ESBuild 和 Parcel，设置这些工具超出了本书的范围。但是，它们都以相同的方式解析模块，因此您可以编写此代码，然后使用您喜欢的任何一个打包它。

## 本书中使用的导入模式

在本书的示例中，我们将使用NPM模式导入，因为它们既是编写导入语句的最短方式，也是您在专业环境中最有可能遇到的模式。

在大多数章节中，在编辑器中，您可以在NPM和CDN导入之间切换（使用_**skypack.dev**_）。但是，如果您从编辑器下载代码，下载的代码将使用CDN导入。这意味着您可以立即在本地计算机上使用下载的代码，而无需设置打包程序或安装NPM包。但是，您需要{{< link path="/book/introduction/about-the-book/#code-examples" title="设置本地开发服务器" >}}。
