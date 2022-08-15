---
title: 'GitHub 上的three.js - 魔法出现的地方'
description: "three.js 是由一群充满激情的开源开发人员在three.js GitHub 仓库上构建的。 与three.js 项目正式相关的所有内容都保存在这里，并且还有大量免费的东西。"
date: 2018-04-02
weight: 5
chapter: '0.4'
available: true
---



# GitHub 上的three.js - 魔法出现的地方 {#github}

{{< figure src="app-logos/github.png" alt="GitHub logo" lightbox="false" class="small noborder" >}}

整个 three.js 项目是免费的开源软件 ( [FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software) )，所有开发都 [在Github上](https://github.com/mrdoob/three.js)的一个巨大仓库中进行。它由原始创建者 [@mrdoob](https://twitter.com/mrdoob)（又名 Ricardo Cabello）和一群开源爱好者维护。这是一个庞大而活跃的 repo，上面有 [React](https://github.com/facebook/react)、 [jQuery](https://github.com/jquery/jquery)和 [Node.js](https://github.com/nodejs/node)等超级明星。

与three.js项目正式相关的所有内容都在 repo 中：源代码、 [数百个演示](https://threejs.org/examples/)如何使用库的每个部分的示例、[文档](https://threejs.org/docs/)、 [交互式场景编辑器](https://threejs.org/editor/)以及大量插件和免费资源，例如3D模型、纹理、声音和 3D 字体。 [现在打开repo](https://github.com/mrdoob/three.js)，我们来一探究竟。有很多内容需要考虑，但目前只有几个文件夹与我们相关。

## {{< icon "solid/folder-open" >}} **build**文件夹 {#build-folder}

[**build**文件夹](https://github.com/mrdoob/three.js/tree/dev/build)是 repo 中最重要的文件夹，因为它包含最重要的 three.js 文件（库的核心 ）：

- _**build/three.module.js**_

**这是运行基本的three.js 应用程序所需的唯一文件。**

文件名中的**.module**告诉我们这是一个{{< link path="/book/appendix/javascript-modules/" title="JavaScript 模块" >}}。在此文件夹中，如果您想支持无法使用模块的过时浏览器，还可以使用两个旧版本的 three.js 核心：

- _**build/three.js**_
- _**build/three.min.js**_

在本书中，我们将始终使用**three.module.js**，因为上述2个老版本的文件将在即将发布的版本中删除。

## {{< icon "solid/folder-open" >}} _**examples/**_ 文件夹 {#examples-folder}

几乎同样重要的是， [_**examples/**_](https://github.com/mrdoob/three.js/tree/dev/examples)文件夹包含许多好东西，包括：

- 所有[官方示例](https://threejs.org/examples/)的[源代码](https://github.com/mrdoob/three.js/tree/master/examples/)，您应该将其作为主要学习资源之一进行学习。
- [_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm/)文件夹中的插件 ，例如相机控件和模型加载器，我们在整本书中都会用到它们。您也应该在这里学习代码，尽管它往往更高级，所以您可能要等到您先了解更多其他基础内容。
- [_**examples/js**_](https://github.com/mrdoob/three.js/tree/master/examples/js/)文件夹中的旧插件 。这些与您在examples/jsm中找到的插件集相同，但是，它们将适用于过时的浏览器。就像核心的遗留版本一样，遗留插件将很快被删除，我们将在本书中忽略它们。
- [3D 字体](https://github.com/mrdoob/three.js/tree/master/examples/fonts/)。
- 许多不同格式的[3D 模型](https://github.com/mrdoob/three.js/tree/master/examples/models/)。 
- [音效](https://github.com/mrdoob/three.js/tree/master/examples/sounds/)。
- [纹理](https://github.com/mrdoob/three.js/tree/master/examples/textures/)。
- ... 还有很多。

你需要学习three.js的一切都在那里——除了这本书！更重要的是，该文件夹中的几乎所有内容都包含在[MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE)中，这意味着您可以以任何您喜欢的方式自由使用项目中的任何内容。

## {{< icon "solid/folder-open" >}} _**src/**_ 文件夹 {#src-folder}

您将在[_**src/**_](https://github.com/mrdoob/three.js/tree/dev/src/)文件夹中找到 three.js 源代码。随着您对three.js 的熟练程度越来越高，您会想知道实际的three.js 代码是如何实现的。每个[文档](https://threejs.org/docs/)页面底部都有指向对应**src/**文件夹中相关源码文件的直接链接，因此您可以在阅读文档时快速导航到相关文件。

three.js 源代码简单、干净、简洁，与您对 3D 图形库的期望相比，它易于访问且易于理解。

## {{< icon "solid/folder-open" >}} 其他文件夹和文件 {#other-folders}

除了我们这里提到的之外，还有很多其他的文件夹和文件，包括[官方文档](https://threejs.org/docs/)的源代码和[three.js场景编辑器](https://threejs.org/editor/)。其中大部分与开发three.js有关，此处不再赘述，但请随意探索。

## Wiki （维基）

作为 repo 的一部分维护的还有[three.js wiki](https://github.com/mrdoob/three.js/wiki)。wiki 的主要目的是为希望为three.js 的开发做出贡献的人们提供指南。但是，还有另一个重要页面： [迁移指南](https://github.com/mrdoob/three.js/wiki/Migration-Guide)，它提供了three.js版本之间任何更改的快速列表。每当您需要将旧的 three.js 应用程序升级到新版本时，这里就是您的去处。