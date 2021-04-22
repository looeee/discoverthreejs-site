 ---
title: 'Using three.js with React, Vue.js, Angular, Svelte, TypeScript...'
description: "Do you use React, Vue.js, Angular, Svelte, or any other framework? And do you prefer to write TypeScript instead of plain JavaScript? No matter! Using three.js with any framework or JS flavor is a breeze! Here, we'll explain why."
date: 2019-01-01
weight: 8
chapter: '0.7'
available: true
nextURL: "/book/first-steps/"
nextTitle: "Getting Started: Here's Where the Real Fun Begins!"
---



# Using three.js with React, Vue.js, Angular, Svelte, TypeScript and More

In the last chapter, we showed you how to include three.js in a simple web page consisting of just three files: _**index.html**_, _**src/main.js**_, and _**styles/main.css**_. Throughout the book, we'll continue to use this minimal setup to showcase the applications we build.

However, out there in the real world, away from these safe and comforting pages, it's increasingly rare to see web pages built this way. In recent years, the web development ecosystem has exploded, with what seems like hundreds of different libraries and frameworks for building web applications, such as [React](https://reactjs.org/), [Angular](https://angular.io/), [Vue.js](https://vuejs.org/), and with new ones arriving all the time ([Svelte](https://svelte.dev/), anyone?). Each of these is highly opinioned, following different design philosophies and paradigms, and even adding extensions of JavaScript such as [JSX](https://en.wikipedia.org/wiki/React_(web_framework)#JSX). And that's not even mentioning completely new languages built on top of JavaScript such as [TypeScript](https://en.wikipedia.org/wiki/TypeScript).

We said earlier in the book that our goal is to show you how to build a real-world, professional-quality three.js application. In a world where frameworks are king, it seems like using such a simple web page to showcase our work is at odds with this claim. Fortunately, that's not the case, since three.js scenes are always displayed within a single HTML `<canvas>` element.

If you wish, you can create this canvas directly in HTML:

{{< code lang="html" linenos="false" hl_lines="" caption="three.js scenes are always displayed inside a single canvas element" >}}
``` js
<canvas id="scene"></canvas>
```
{{< /code >}}

However, you can also create the canvas using your favorite framework, whether that's React, Vue.js, Svelte, or even your own hand-crafted custom framework, and then hand it over to three.js.

In this book, we'll write code that is _framework agnostic_, which means you can connect it up to any framework you like. Most web frameworks work by building your app out of discrete, modular components. For example, a React component may be a contact form, or a drop-down menu, or an image gallery. We'll structure our three.js applications in the same way, so that in the end we have a single top-level component called a `World` that creates a three.js scene inside a `<canvas>` element. To use this `World` component with React, you can wrap it inside a [React Component](https://reactjs.org/docs/components-and-props.html), to use it with Vue.js, you can wrap it inside a [Vue Component](https://vuejs.org/v2/guide/components.html), to use it with Angular, you can wrap it inside an [Angular Component](https://angular.io/api/core/Component), to use it with Svelte... well, you get the picture. In other words, you can create your main app the _React way,_ or the _Angular way_, or the _Svelte way_, and create your three.js app the _three.js way_, and then connect them up with very little effort.

Of course, you may prefer to write the three.js part of your app the Svelte/Angular/React/Vue.js way as well, which is absolutely possible. In that case, you'll need to do some work to refactor the code in the book before you can use it, but the theory we cover will remain useful to you.

## What About TypeScript?

While the three.js library itself is not written in TypeScript, there are "types" included in {{< link path="/book/introduction/github-repo/" title="the repo" >}} and {{< link path="/book/introduction/get-threejs/#package-manager" title="NPM package" >}} (these are files ending in _**.d.ts**_ that live alongside [the JavaScript files in the repo](https://github.com/mrdoob/three.js/tree/master/src)). This means that three.js will work seamlessly with a TypeScript project.
