---
title: "入门：真正的乐趣从这里开始！"
description: "从零到three.js英雄！ 本节是一个独立的（免费的！）教程系列，旨在让您尽快掌握three.js！ 从一个空白画布开始，我们将逐渐完善它，直到我们拥有一个完全成熟的、专业品质的three.js应用程序。"
date: 2018-04-02
sectionHead: true
weight: 100
chapter: "1"
available: true
nextURL: "/book/first-steps/app-structure/"
nextTitle: "Three.js应用的结构"
prevURL: "/book/introduction/threejs-with-frameworks/"
prevTitle: "将three.js与React、Vue.js、Angular、Svelte、TypeScript等一起使用"
hideWordCount: true
---

# 入门：真正的乐趣从这里开始！

{{< inlineScene entry="first-steps/birds-animated.js" class="round" >}}

**欢迎来到 Discoverthree.js！**

本书是一个**完整的介绍性教程系列**，旨在让您快速掌握 three.js，同时为您提供更深入地探索 three.js 和计算机图形学所需的技术语言和概念。

{{< inlineScene entry="first-steps/animation-loop.js" class="small right round" >}}

像所有伟大的艺术家一样，我们将从一个空白开始`<canvas>`，在接下来的章节中，我们将逐渐完善它，直到我们创建了一个小而强大的 three.js 应用程序，其中包含灯光、纹理、材质和相机控制。在本节的最后几章中，我们将向您展示如何加载像上面场景中的鸟一样的 3D 模型，甚至使用如何使用 three.js 动画系统。

我们将在本节中介绍许多新概念、理论和术语，的确有很多内容，但请不要担心。我们的目标是快速向您介绍一个全新的信息世界，然后我们将在后面的章节中详细的介绍这些。在这里，我们将介绍足够详细的概念，让您在不牺牲任何技术准确性的情况下开始思考和使用它们。一旦你熟悉了基础知识，本书后面的章节将填补缺失的细节。

如果您是从 Web 开发人员的背景来到 three.js，或者即使您在这里开始您的整个软件开发生涯，您会发现这一点尤其重要。**使用 three.js 意味着在计算机图形和 Web 开发的交叉领域工作**，无论您的背景是什么，您都可能至少会遇到一些新概念。在浏览器中显示 3D 图形将许多不同的领域联系在一起。我们需要使用 HTML、CSS、JavaScript、一点数学知识、大量计算机图形，当然还有 three.js API。值得庆幸的是，three.js 出色地完成了隐藏所有这些复杂性的工作，直到您需要它为止。为了保持简洁，JavaScript 和浏览器 API 的技术细节已降级到 {{< link path="/book/appendix/" title="附录" >}} 中所以我们可以在正文中专注于 three.js 和计算机图形。每当我们遇到新的 JavaScript 功能或浏览器功能时，我们都会将您引导至附录中的相关部分。

让我们直接开始吧。很快你就会使用听起来很疯狂的东西，比如*四元数 quaternions*、*变换矩阵 transformation matrices*和*缓冲几何 buffer geometries*，这些你可能从未见过。
