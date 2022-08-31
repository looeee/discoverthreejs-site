---
title: "将 three.js 与 React、Vue.js、Angular、Svelte、TypeScript 等一起使用"
description: "你是否使用 React、Vue.js、Angular、Svelte 或任何其他框架？ 你更喜欢编写 TypeScript 而不是纯 JavaScript？ 没关系！在任何框架或 JS 风格代码中使用 three.js 都是轻而易举的事！ 在这里，我们将解释原因。"
date: 2019-01-01
weight: 8
chapter: "0.7"
available: true
nextURL: "/book/first-steps/"
nextTitle: "入门：真正的乐趣从这里开始！"
---

# 将 three.js 与 React、Vue.js、Angular、Svelte、TypeScript 等一起使用

在上一章中，我们向您展示了如何在一个仅包含三个文件的简单网页中包含 three.js：_**index.html**_、**_src/main.js_**和**_styles/main.css_**。在整本书中，我们将继续使用这个最小设置来展示我们构建的应用程序。

然而，在现实世界中，远离这些安全和舒适的页面，越来越少见以这种方式构建的网页。近年来，Web 开发生态系统呈爆炸式增长，似乎有数百种不同的库和框架用于构建 Web 应用程序，例如[React](https://reactjs.org/)、 [Angular](https://angular.io/)、 [Vue.js](https://vuejs.org/)，并且不断出现新的库和框架（[Svelte](https://svelte.dev/)，还有吗？）。 其中每一个都受到高度评价，遵循不同的设计理念和范式，甚至添加了 JavaScript 的扩展，例如[JSX](<https://en.wikipedia.org/wiki/React_(web_framework)#JSX>)。这甚至没有提到建立在 JavaScript 之上的全新语言，例如[TypeScript](https://en.wikipedia.org/wiki/TypeScript)。

我们在本书前面说过，我们的目标是向您展示如何构建一个真实的、专业品质的 three.js 应用程序。在一个框架为王的世界里，使用如此简单的网页来展示我们的工作似乎与这种说法不符。幸运的是，情况并非如此，因为 three.js 场景总是显示在单个 HTML`<canvas>`元素中。

如果您愿意，可以直接在 HTML 中创建此画布 canvas：

{{< code lang="html" linenos="false" hl_lines="" caption="three.js场景始终显示在单个画布元素中" >}}

```js
<canvas id="scene"></canvas>
```

{{< /code >}}

但是，您也可以使用自己喜欢的框架创建画布 canvas，无论是 React、Vue.js、Svelte，甚至是您自己手工制作的自定义框架，然后将其交给 three.js。

在本书中，我们将编写与框架无关的代码，这意味着您可以将其连接到您喜欢的任何框架。大多数 Web 框架通过使用离散的模块化组件构建您的应用程序来工作。例如，React 组件可以是联系人表单、下拉菜单或图片库。我们将以相同的方式构建我们的 three.js 应用程序，这样最终我们就有了一个名为`World`的顶级组件，它在一个`<canvas>`元素内创建了一个 three.js 场景。要将此`World`组件与 React 一起使用，您可以将其包装在[React Component](https://reactjs.org/docs/components-and-props.html)中，要与 Vue.js 一起使用，您可以将其包装在[Vue Component](https://vuejs.org/v2/guide/components.html)中，要与 Angular 一起使用，您可以将其包装在[Angular Component](https://angular.io/api/core/Component)中，将它与 Svelte 一起使用……好吧，你应该明白了。换句话说，您可以使用*React 方式*、 *Angular 方式*或*Svelte 方式*创建您的主应用程序，然后使用*three.js 方式*创建您的 three.js 应用程序，然后轻松地将它们连接起来。

当然，您可能更喜欢以 Svelte/Angular/React/Vue.js 的方式编写应用程序的 three.js 部分，这绝对是可能的。在这种情况下，您需要做一些工作来重构本书中的代码，然后才能使用它，但我们介绍的理论对您仍然有用。

## TypeScript 怎么样？

虽然 three.js 库本身不是用 TypeScript 编写的，但[repo]({{< relref "/book/introduction/github-repo" >}} "repo")和[NPM 包]({{< relref "/book/introduction/get-threejs#package-manager" >}} "NPM 包")中包含“类型” （这些以**_.d.ts_**结尾的文件与[repo 中的 JavaScript 文件一起](https://github.com/mrdoob/three.js/tree/master/src)存在）。这意味着 three.js 将与 TypeScript 项目无缝协作。
