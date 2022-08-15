---
title: '运行 three.js 应用程序需要什么？'
description: "让我们从基础知识开始：构建一个 three.js 程序需要什么？您的用户需要什么才能运行它？答案很简单：一个编写代码的文本编辑器，一个运行它的浏览器，仅此而已。"
date: 2018-04-02
weight: 3
chapter: '0.2'
available: true
---



# 运行 three.js 应用程序需要什么？

在本章中，我们将简要介绍构建和运行 three.js 应用程序所需的硬件和软件，并介绍一些核心概念。

## 一台电脑

首先，您需要一台计算机，但它不需要速度快、花哨或拥有强大的显卡。拥有一台速度较慢且 GPU 较弱的计算机可能更有用，因为这样，您将像大多数用户一样体验您的应用程序。

## 一个 three.js 开发者

这里说的就是你！欢迎来到俱乐部！作为 three.js 开发人员，您需要了解一些基本的HTML 和 CSS，以及一些稍微不那么基本的JavaScript。但是，您不需要成为任何以上这些技术之一的专家。如果您是 Web 开发的新手，请不要担心，因为我们会在进行过程中介绍您需要了解的所有内容，并且在{{< link path="/book/appendix" title="附录" >}}中进行更深入的介绍。

## 文本编辑器

您将需要某种方式来编辑文本文件。Web 开发最流行的编辑器是 [VSCode](https://code.visualstudio.com/)，其次是 [Atom](https://atom.io/) 和 [Sublime Text](https://www.sublimetext.com/)。这些编辑器允许您安装插件，例如，在您键入时检查代码样式的 linter 和 formatters，如果您安装了足够多的插件，您可以让编辑器崩溃，并最终得到与更传统的全能 IDE 非常相似的东西。

## Web 浏览器

几乎任何 Web 浏览器都可以运行three.js程序，而不能运行的过时浏览器的数量很少并且正在快速减少。你甚至可以在 2011 年发布的 Internet Explorer 9 上运行 three.js 应用程序，在撰写本章时，该应用程序还不到 0.1% 的网络用户。如今，大多数用户使用现代浏览器访问互联网，浏览器支持不是我们需要担心的。

你也可以让 three.js 应用程序在各种奇异的环境中运行，比如 [Node.js](https://nodejs.org/)、 [Electron.js](https://electronjs.org/)或 [React Native](https://reactnative.dev/)，尽管这样做需要一些工作而且已经超出了本书讨论的范围。在这里，我们将专注于在 Firefox、Chrome、Edge 和 Safari 等现代 Web 浏览器中运行您的应用程序。

## Web 服务器

您可以直接在 Web 浏览器中打开 HTML 文件，文件中引用的任何 JavaScript 都会运行。许多简单的 three.js 示例都可以通过这种方式正常工作。但是，**由于浏览器安全限制，您无法在不设置 Web 服务器的情况下加载纹理或 3D 模型。** 如果要运行使用模型或纹理等资源的 three.js 场景，则必须设置**本地开发服务器。**

本书中的所有示例都在页面内{{< link path="/book/introduction/about-the-book/#code-examples" title="一个精美的定制内联代码编辑器" >}}中运行，这使我们可以避免这种环境要求，但是稍后，一旦您创建了自己的应用程序，您就需要设置一个服务器. 有许多简单的开发 Web 服务器可用。这些很容易设置，但不能同时处理一堆人查看该网站。尽管如此，它们非常适合在您发布之前在本地测试您的作品。稍后，当您将网站上线时，您将切换到高性能**生产服务器**，例如 Apache 或 Nginx（发音为engine-x， 显然）。这些可以处理成千上万甚至数百万人同时查看您的网站，但设置起来很复杂。幸运的是，有许多网络托管公司会为您解决这个问题。

当您想设置开发服务器时，请查看 three.js 文档中的 [如何在本地运行程序](https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally)指南，其中包含有关此主题的大量有用信息。

## 浏览器开发者控制台

在某些时候，您的代码将停止工作，您需要找出原因。执行此操作的技术称为调试。Web 开发中最基本的调试技术，通常也是您唯一需要的一种，就是{{< link path="book/appendix/dom-api-reference/#your-browser-s-developer-console" title="浏览器开发者控制台" >}}。每个流行的浏览器中都有一个，您通常可以通过按**F12**键打开它。

控制台中有很多可看的东西，但是对于本书，你只需要确保你可以看到记录到控制台的消息，这也是一个方便的 JavaScript 便签本。请现在就打开控制台，然后输入一些简单的数学表达式然后回车，如1 + 2, 45 * 23 或1 / 0以确保它正常工作。

## 能够运行 WebGL 的设备

{{< figure src="app-logos/webgl.svg" alt="WebGL logo" lightbox="false" class="tiny left noborder" >}}

[WebGL](https://en.wikipedia.org/wiki/WebGL)是一种 JavaScript API 或可编程接口，用于在网页中绘制交互式 2D 和 3D 图形。WebGL 将您的Web浏览器连接到您设备的图形卡，为您提供比传统网站更强大的图形处理能力。

three.js 使用 WebGL 来显示 3D 图形，但它也可以用于 2D 图形，如 Alexander Perrin 的这篇可爱的[Short Trip](https://alexanderperrin.com.au/paper/shorttrip/)，甚至是 GPGPU（通用 GPU）计算，正如您在这些 [flocking behavior](https://threejs.org/examples/webgl_gpgpu_birds.html)和 [protoplanet](https://threejs.org/examples/webgl_gpgpu_protoplanet.html)示例中所见。

<div class="fig-comparison">
  {{< iframe src="https://threejs.org/examples/webgl_gpgpu_birds_gltf.html" height="500" title="GPGPU flocking example" caption="GPGPU flocking example" >}}
  {{< iframe src="https://threejs.org/examples/webgl_gpgpu_protoplanet.html" height="500" title="GPGPU protoplanet example" caption="GPGPU protoplanet example" >}}
</div>

要使用 WebGL，您需要支持它的设备和浏览器。不久前，这是您不得不担心的事情，但现在您可以理所当然地认为所有设备都支持 WebGL，并且每部现代智能手机、平板电脑、PC、笔记本电脑甚至智能手表都具有支持显卡的功能运行一个基本的 3D 场景。根据 [caniuse.com](https://caniuse.com/#search=WebGL)和 [webglstats.com](https://webglstats.com/)的数据，在撰写本章时，大约 98% 的互联网用户使用支持 WebGL 的设备访问互联网。如果您确实需要支持最后的 2%，[WebGL 兼容性检查](https://threejs.org/docs/#manual/en/introduction/WebGL-compatibility-check)将描述如何向其设备不支持 WebGL 的任何用户提供回退或警告消息。
