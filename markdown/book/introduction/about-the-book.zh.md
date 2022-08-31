---
title: "如何使用本书"
description: "本书是使用three.js创建专业质量品质3D应用程序的完整指南。每章都附带一个实时代码编辑器，因此您可以编辑我们描述的代码并立即查看更改。"
date: 2018-04-02
weight: 2
chapter: "0.1"
available: true
showIDE: true
IDEFiles:
  [
    "assets/models/Horse.glb",
    "assets/models/Parrot.glb",
    "assets/textures/sprites/spark1.png",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "vendor/three/examples/jsm/loaders/GLTFLoader.js",
    "worlds/introduction/about-the-book/index.html",
    "worlds/introduction/about-the-book/src/main.final.js",
    "worlds/introduction/about-the-book/src/main.start.js",
    "worlds/introduction/about-the-book/src/World/components/camera.js",
    "worlds/introduction/about-the-book/src/World/components/lights.js",
    "worlds/introduction/about-the-book/src/World/components/scene.final.js",
    "worlds/introduction/about-the-book/src/World/components/scene.start.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/sparkleHorse.final.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/sparkleHorse.start.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/convertMeshToPoints.final.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/convertMeshToPoints.start.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSizesAttribute.final.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSizesAttribute.start.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSparkleMaterial.final.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSparkleMaterial.start.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/setupAnimation.final.js",
    "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/setupAnimation.start.js",
    "worlds/introduction/about-the-book/src/World/systems/controls.js",
    "worlds/introduction/about-the-book/src/World/systems/renderer.js",
    "worlds/introduction/about-the-book/src/World/systems/Resizer.js",
    "worlds/introduction/about-the-book/src/World/systems/Loop.js",
    "worlds/introduction/about-the-book/src/World/World.final.js",
    "worlds/introduction/about-the-book/src/World/World.start.js",
  ]
IDEComparisonMode: true
IDEStripDirectory: "worlds/introduction/about-the-book/"
IDEClosedFolders: ["systems", "components", "styles", "vendor", "textures"]
IDEActiveDocument: "src/World/components/SparkleHorse/sparkleHorse.js"
IDEEntry: "index.html"
prevURL: "/book/introduction/"
prevTitle: "欢迎来打Discover three.js!"
---

{{% note %}}
TODO-LOW: go over sparkleHorse code: before comparison should be non-sparkle horse
{{% /note %}}

# 如何使用本书

本书完整介绍了如何使用 web 作为平台，使用 three.js 创建专业品质的 3D 应用程序。有很多很棒的有关 three.js 的教程，更不用说 three.js 网站上的大量[示例](https://threejs.org/examples/)了。但是，这些教程和示例使用小代码片段逐个介绍了 three.js。这可能很有用，但在创建一个真实的、面向客户的应用程序时会有所不足。

在本书中，我们采用了更全面的方法。在这里，我们演示了如何使用 three.js 创建完整、健壮、专业品质的应用程序，这些应用程序遵循最佳实践，并且可以在所有设备和现代浏览器中轻松运行。这样做的同时，我们会将代码拆分为小模块，每个模块都处理整个复杂模块的一个方面。这意味着我们可以向您展示“真正的”three.js 应用程序的外观，同时仍然编写易于理解的代码。

{{% note %}}
如果不做出自以为是的设计决策，就不可能构建像这样的真实世界应用程序。 我们将在本书中编写的代码并非旨在展示唯一甚至最好的做事方式。 相反，我们将专注于创建易于理解的应用程序，以便您可以遵循我们介绍的主题而不会被复杂的代码结构所迷惑。 当您毕业并构建自己的应用程序时，您必须自己决定哪种样式最适合您的需求。

我们将从小处着手，在您知道之前，我们将逐步完成一个完整的应用程序。
{{% /note %}}

在本简介中，我们涵盖了您在开始之前需要了解的所有内容。[主章节]({{< relref "/book/first-steps/" >}} "主章节") 涵盖了在 Web 浏览器中运行基本 3D 场景所需的一切，包括如何创建对象、灯光、相机、相机控件，以及如何在场景中组织和移动对象。最后，我们将了解如何加载在外部程序中创建的复杂动画模型。

## 预备知识

创建在浏览器中运行的 3D 应用程序属于 Web 开发和计算机图形学的交叉点，当你读完本书时，你将对这两个领域有深入的了解。然而，在本书的开头，我们将假设几乎为零的预备知识，并且只要有可能，我们将在遇到主题和专业术语时对其进行解释。在极少数情况下，介绍一个主题会打断一章的流程，我们会将您推荐到其他地方或本书的其他部分，您可以在其中进一步研究它。

### JavaScript 和 Web 开发

我们在本书中使用的主要语言是 JavaScript。您需要了解该语言的基础知识才能使用 three.js，但您不需要成为专家，这同样适用于 HTML、CSS 和 Web 开发的其他方面。然而，将这本书变成关于 Web 开发或 JavaScript 的教程会分散我们学习 three.js 的目标。因此，大部分 JavaScript 技术细节都被放到了[附录]({{< relref "book/appendix" >}} "附录")中。每当我们遇到一个新的 JavaScript 特性时，我们都会提供一个指向附录中相关部分的链接，或者一个可靠的外部站点，例如 [MDN](https://developer.mozilla.org/en-US/)。

### 数学知识

为了在 3D 空间中移动对象，我们将使用[线性代数](https://en.wikipedia.org/wiki/Linear_algebra)中的一些概念，例如向量和矩阵，而 3D 空间本身则使用[笛卡尔坐标系](https://en.wikipedia.org/wiki/Cartesian_coordinate_system)来描述。但是，您可能会惊讶于使用 three.js 所需的数学知识如此之少。该库在隐藏所有复杂的技术细节方面做得非常出色。直到你需要它们，就是这样。

如果在某个时候你想更深入地学习线性代数或任何其他数学主题， [可汗学院](https://www.khanacademy.org/)是网络上学习数学的最佳资源之一，他们的[线性代数课程](https://www.khanacademy.org/math/linear-algebra)有你阅读本书所需的一切。

## 代码示例

本书具有一个定制的实时代码编辑器，您可以使用它来跟随文本中描述的代码。这让我们可以避开设置 Web 服务器的复杂性，专注于学习 Three.js。如果您在大屏幕上查看此页面，编辑器将在文本旁边自动打开，否则，请单击导航栏左上角的{{< icon "solid/columns" >}}按钮。您对代码所做的任何更改都会立即显示在预览窗口中。

### 前后代码对比

看到编辑器左上角的大切换开关了吗？来吧，试一试。大多数章节都从一个部分完成的示例开始，供您使用，还可以让您只需轻按一下此切换按钮即可完成代码。您可以在完整状态和初始状态之间来回切换，并分别对两者进行更改。

## 在自己的机器上编码

在您自己的计算机上编码在 Web 开发领域被称为本地编码。如果您喜欢这样做而不是使用编辑器，您可以使用{{< icon "solid/download" >}}按钮将文件下载为 zip 文件。此 zip 文件将包含当前显示的文件。换句话说，如果比较开关在右侧，您将获得完整的代码，如果在左侧，您将获得起始代码，以及在这两种情况下您所做的任何更改。

如果您在本地编码，一旦我们在[1.5：变换和坐标系]({{< relref "/book/first-steps/transformations" >}} "1.5：变换和坐标系")和[1.13：加载 glTF 格式的 3D 模型]({{< relref "/book/first-steps/load-models" >}} "1.13：加载 glTF 格式的 3D 模型")中加载纹理和 3D 模型，您将需要设置本地开发服务器。这样做的原因是网络浏览器有安全限制，以防止恶意网站直接从您的计算机文件系统加载文件。查看 three.js 文档中的[How to Run Things Locally](https://threejs.org/docs/#manual/introduction/How-to-run-things-locally)以获取有关此主题的更多信息。

## 官方文档和源码

您应该将本书与[官方的 three.js 文档](https://threejs.org/docs/)和[官方示例](https://threejs.org/examples/)一起使用，您在阅读本书过程中将经常被提及看这些。一旦您对该库更加熟悉，您还会发现[three.js 源码](https://github.com/mrdoob/three.js/tree/dev/src)和[插件的源码](https://github.com/mrdoob/three.js/tree/dev/examples/jsm)有助于加深您的理解。
