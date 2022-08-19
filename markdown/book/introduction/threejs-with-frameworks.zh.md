 ---
title: '将three.js与React、Vue.js、Angular、Svelte、TypeScript等一起使用'
description: "你是否使用React、Vue.js、Angular、Svelte或任何其他框架？ 你更喜欢编写TypeScript而不是纯JavaScript？ 没关系！在任何框架或JS风格代码中使用three.js都是轻而易举的事！ 在这里，我们将解释原因。"
date: 2019-01-01
weight: 8
chapter: '0.7'
available: true
nextURL: "/book/first-steps/"
nextTitle: "入门：真正的乐趣从这里开始！"
---



# 将three.js与React、Vue.js、Angular、Svelte、TypeScript等一起使用

在上一章中，我们向您展示了如何在一个仅包含三个文件的简单网页中包含three.js：_**index.html**_、_**src/main.js**_和_**styles/main.css**_。在整本书中，我们将继续使用这个最小设置来展示我们构建的应用程序。

然而，在现实世界中，远离这些安全和舒适的页面，越来越少见以这种方式构建的网页。近年来，Web开发生态系统呈爆炸式增长，似乎有数百种不同的库和框架用于构建 Web应用程序，例如[React](https://reactjs.org/)、 [Angular](https://angular.io/)、 [Vue.js](https://vuejs.org/)，并且不断出现新的库和框架（[Svelte](https://svelte.dev/)，还有吗？）。 其中每一个都受到高度评价，遵循不同的设计理念和范式，甚至添加了JavaScript的扩展，例如[JSX](https://en.wikipedia.org/wiki/React_(web_framework)#JSX)。这甚至没有提到建立在JavaScript之上的全新语言，例如[TypeScript](https://en.wikipedia.org/wiki/TypeScript)。

我们在本书前面说过，我们的目标是向您展示如何构建一个真实的、专业品质的three.js应用程序。在一个框架为王的世界里，使用如此简单的网页来展示我们的工作似乎与这种说法不符。幸运的是，情况并非如此，因为three.js场景总是显示在单个HTML`<canvas>`元素中。

如果您愿意，可以直接在HTML中创建此画布canvas：

{{< code lang="html" linenos="false" hl_lines="" caption="three.js场景始终显示在单个画布元素中" >}}
``` js
<canvas id="scene"></canvas>
```
{{< /code >}}

但是，您也可以使用自己喜欢的框架创建画布canvas，无论是React、Vue.js、Svelte，甚至是您自己手工制作的自定义框架，然后将其交给 three.js。

在本书中，我们将编写与框架无关的代码，这意味着您可以将其连接到您喜欢的任何框架。大多数Web框架通过使用离散的模块化组件构建您的应用程序来工作。例如，React组件可以是联系人表单、下拉菜单或图片库。我们将以相同的方式构建我们的three.js应用程序，这样最终我们就有了一个名为`World`的顶级组件，它在一个`<canvas>`元素内创建了一个three.js场景。要将此`World`组件与React一起使用，您可以将其包装在[React Component](https://reactjs.org/docs/components-and-props.html)中，要与Vue.js一起使用，您可以将其包装在[Vue Component](https://vuejs.org/v2/guide/components.html)中，要与Angular一起使用，您可以将其包装在[Angular Component](https://angular.io/api/core/Component)中，将它与Svelte一起使用……好吧，你应该明白了。换句话说，您可以使用_React方式_、 _Angular方式_或_Svelte方式_创建您的主应用程序，然后使用_three.js方式_创建您的three.js应用程序，然后轻松地将它们连接起来。

当然，您可能更喜欢以Svelte/Angular/React/Vue.js的方式编写应用程序的three.js部分，这绝对是可能的。在这种情况下，您需要做一些工作来重构本书中的代码，然后才能使用它，但我们介绍的理论对您仍然有用。

## TypeScript 怎么样？

虽然three.js库本身不是用TypeScript编写的，但{{< link path="/book/introduction/github-repo/" title="repo" >}}和{{< link path="/book/introduction/get-threejs/#package-manager" title="NPM包" >}}中包含“类型” （这些以_**.d.ts**_结尾的文件与[repo中的JavaScript文件一起](https://github.com/mrdoob/three.js/tree/master/src)存在）。这意味着three.js将与TypeScript项目无缝协作。
