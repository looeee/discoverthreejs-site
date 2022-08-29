---
title: "What Do You Need to Run a three.js App?"
description: "Let's start with the basics: what do you need to build a three.js application? And what do your users need to be able to run it? The answers are simple: a text editor to write code, a browser to run it, and that's all."
date: 2018-04-02
weight: 3
chapter: "0.2"
available: true
---

# What Do You Need to Run a three.js App?

In this chapter, we'll briefly go over the hardware and software you need to build and run a three.js app as well as introducing a few key concepts.

## A Computer

First of all, you need a computer, but it doesn't need to be fast, fancy, or have a powerful graphics card. It may even be more useful to have a slow computer with a weak GPU, as that way, you'll experience your applications as the majority of your users do.

## A three.js Developer

This means you! Welcome to the club! As a three.js developer, you need to know some basic HTML and CSS, and some slightly less basic JavaScript. However, you don't need to be an expert in any of these things. If you are new to web development, don't worry because we'll cover everything you need to know as we go along, and in more depth in the {{< link path="/book/appendix/" title="Appendices" >}}.

## A Text Editor

You will need some way of editing text files. The most popular editor for web development is [VSCode](https://code.visualstudio.com/), followed by [Atom](https://atom.io/) and [Sublime Text](https://www.sublimetext.com/). These editors allow you to install plugins, for example, linters and formatters that check your code style as you type, and if you install enough plugins, you can ~~make the editor crash~~ end up with something quite similar to a more traditional full-featured IDE.

## A Web Browser

Almost any web browser can run three.js, and the number of outdated browsers that cannot is tiny and shrinking fast. You can even get a three.js app to run on Internet Explorer 9, released way back in 2011, and that represents less than 0.1% of web users at the time of writing this chapter. Nowadays, the majority of users access the internet with a modern browser, and browser support is not something we need to worry about.

You can also make three.js apps run in all kinds of exotic environments like [Node.js](https://nodejs.org/), [Electron.js](https://electronjs.org/), or [React Native](https://reactnative.dev/), although doing so takes a bit of work and is beyond the scope of this book. Here, we'll focus on running your app in modern web browsers such as Firefox, Chrome, Edge, and Safari.

## A Web Server

You can open an HTML file directly in a web browser, and any JavaScript referenced in the file will run. Many simple three.js examples work fine this way. However, **you cannot load textures or 3D models without setting up a web server due to browser security restrictions**. If you want to run a three.js scene that uses assets such as models or textures, you will have to set up a local **development server**.

All the examples in this book run in {{< link path="/book/introduction/about-the-book/#code-examples" title="a fancy custom-built inline code editor" >}} within the page, which allows us to avoid this requirement, but later, once you are creating apps of your very own, you'll need to set up a server. There are many simple development web servers available. These are easy to set up, but cannot handle more than a handful of people viewing the site at the same time. Nonetheless, they are perfect for testing your work locally before you publish it. Later, when you put your website online, you'll switch to a high-performance **production server** such as Apache or Nginx (pronounced _engine-x_, apparently). These can handle thousands or even millions of people viewing your site at the same time, but they are complicated to set up. Fortunately, there are many web hosting companies that will take care of this for you.

When you want to set up a development server, check out the [how to run things locally](https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally) guide in the three.js docs which has lots of useful info on this topic.

## The Browser Developer Console

At some point, your code will stop working and you'll need to figure out why. Techniques for doing this are referred to as _debugging_. The most basic debugging technique in web development, and often the only one you need, is {{< link path="book/appendix/dom-api-reference/#your-browser-s-developer-console" title="the browser developer console" >}}. Every popular browser has one of these, and you can usually open it by pressing the **F12** key.

There's a lot to see there, but for this book, you only need to make sure that you can see messages logged to the console, which also makes a handy JavaScript scratchpad. Go ahead and check open the console now, then type in some simple mathematical statements like `1 + 2`, `45 * 23`, or `1 / 0` to make sure that it's working.

## A Device Capable of Running WebGL

{{< figure src="app-logos/webgl.svg" alt="WebGL logo" lightbox="false" class="tiny left noborder" >}}

[WebGL](https://en.wikipedia.org/wiki/WebGL) is a JavaScript API, or _programmable interface_, for drawing interactive 2D and 3D graphics in web pages. WebGL connects your web browser up to your device's graphics card, providing you with far more graphical processing power than is available on a traditional website.

three.js uses WebGL for displaying 3D graphics, but it can also be used for 2D graphics, as this lovely [Short Trip](https://alexanderperrin.com.au/paper/shorttrip/) by Alexander Perrin, or even GPGPU (General Purpose GPU) computing, as you can see in these [flocking behavior](https://threejs.org/examples/webgl_gpgpu_birds.html) and [protoplanet](https://threejs.org/examples/webgl_gpgpu_protoplanet.html) examples.

<div class="fig-comparison">
  {{< iframe src="https://threejs.org/examples/webgl_gpgpu_birds_gltf.html" height="500" title="GPGPU flocking example" caption="GPGPU flocking example" >}}
  {{< iframe src="https://threejs.org/examples/webgl_gpgpu_protoplanet.html" height="500" title="GPGPU protoplanet example" caption="GPGPU protoplanet example" >}}
</div>

To use WebGL, you need a device and browser that supports it. Not so long ago, this was something that you had to worry about, but these days you can take it for granted that all devices support WebGL and that every modern smartphone, tablet, PC, laptop, and even smartwatch, has a graphics card capable of running a basic 3D scene. According to [caniuse.com](https://caniuse.com/#search=WebGL) and [webglstats.com](https://webglstats.com/), at the time of writing this chapter, around 98% of internet users access the internet using WebGL capable devices. If you do need to support that final 2%, the [WebGL compatibility check](https://threejs.org/docs/#manual/en/introduction/WebGL-compatibility-check) describes how to provide a fallback or warning message to any users whose device doesn't support WebGL.
