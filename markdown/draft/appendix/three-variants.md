---
title: "How to Choose the Correct three.js Core Variant"
description: "There are three variants of the core three.js code, and two versions of each plugin. We'll take a look at how to choose the one you need here."
date: 2018-04-02
weight: 9
chapter: "0.8"
available: true
draft: true
---

# How to Choose the Correct three.js Core Variant

As we saw in [earlier]({{< relref "//book/introduction/get-threejs" >}} "earlier"), the three.js core comes in three versions, each contained in a single file. You can find these in the _**build/**_ folder [in the repo](https://github.com/mrdoob/three.js/tree/master/build):

- _**three.js**_
- _**three.min.js**_
- _**three.module.js**_

Each of these files contains the complete three.js core, and **you only need to include one of them in your app.**

_**three.min.js**_ is just a compressed version of _**three.js**_, so there are two distinct variants of the core code.

## Plugin Variants Must Match the Core Variant!

Each plugin comes in two flavors, which must be used with the correct variant of the core file.

- plugins in [_/examples/**jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm) must be used with _**three.module.js**_
- Plugins in [_/examples/**js**_](https://github.com/mrdoob/three.js/tree/master/examples/js) must be used with _**three.js**_ or _**three.min.js**_

## What's the Difference Between the Two Variants?

In short, _**three.module.js**_ is the modern version of three.js, while _**three.js**_ and _**three.min.js**_ are legacy files designed to support outdated browsers.

To put it in more technical terms:

- _**three.module.js**_ is an ES6 module.
- _**three.js**_ and _**three.min.js**_ are ES5 legacy files.

To understand what this means, we need to learn some history of JavaScript, what the terms ES5 and ES6 means, and what JavaScript modules are.

{{% aside %}}

### A Very Short History of JavaScript

JavaScript has gone through many iterations over the years, from the first version, called **ES1**, back in 1996, through to version **ES5** in 2009. It stagnated there for a couple of years, with a single minor update to **ES5.1** in 2011.

All browsers support ES5 JavaScript, and **the ES5 variant of the three.js core in _three.js_ and _three.min.js_ will work in any browser**.

However, ES5 JavaScript lacks a lot of the functionality needed for building complex, high performance, modern applications. Nobody gave much thought for a future where we would be creating complex 3D environments using this simple scripting language.

To address this, **in 2015 a much-needed modern update of JavaScript, called ES6 or ES2015, was released**.

The committee that oversees the development of JavaScript ([Ecma International](https://en.wikipedia.org/wiki/Ecma_International)) announced that, from 2015 on, they would release one new JavaScript version a year, called **ES2015**, **ES2016**, and so on. Collectively, we refer to all versions beyond ES6 as **ES6+** or **ESNext**.

At the time of writing, we are now up to **ES2019**, and most people agree that the problems that plagued old-school ES5 JavaScript have largely been solved.

Note that the naming conventions are a bit confused, and in particular the terms **ES6**, **ES2015**, and **ESNext** are often used interchangeably. This is because Ecma International initially named the release ES6, and then later changed that to ES2015, but by that time the term ES6 had stuck.

### JavaScript Modules

Perhaps **the most important new feature added in the ES6 release was the ability to split our code up into small modules** (hence the name _three.**module**.js_). In old-style JavaScript we would have to write everything in one huge file, sometimes thousands of lines long, or use a non-standard solution such as [browserify](http://browserify.org/).

Since the introduction of modules, we can easily break our app into small, modular components, which is a huge improvement in code style.

If you are not familiar with ES6 modules, now would be a good time to look over {{< link path="/book/appendix/javascript-modules" title="" >}} in the appendix.

{{% /aside %}}

## The Clear Winner: _three.module.js_

Once we understand all of that, the choice is clear. **We will use _three.module.js_ and enjoy all the new features that will improve our code and make our lives so much easier**.

### Support for Outdated Browsers

However, there is a catch. Not all browsers have been updated in the last few years, so there will be people who cannot use an app written in modern JavaScript.

Until recently, this was a real concern. However, it has become less and less of an issue as time goes by, and at the time of writing this chapter, **the majority of internet users ($>85\%$) use browsers that support most ES6 features**.

That's fine for our purposes in this book. **We will assume that you are using a modern browser and write in modern JavaScript without worrying about support for outdated browsers.**

However, once you take the knowledge you learn here and go out into the real world, you will inevitably encounter situations where you need to support older browsers.

Fortunately, in these cases, we can get the best of both worlds. **We can write our app using modern syntax and features, and then automatically convert our code to work in older browsers**.

### Automatically Convert Modern JavaScript to Run in Outdated Browsers

This automatic conversion is split into two parts:

#### 1. Bundle the Modules into a Single Script

First, we need to **_bundle_ the separate modules that make up our code into a single script**. Tools that perform this step are called **bundlers**. The most popular of these are [Webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/) and [rollup.js](https://rollupjs.org/guide/en/).

three.js itself is bundled using rollup.js, and you'll find the hundreds of unbundled tiny modules that make up the library in the [_/src_](https://github.com/mrdoob/three.js/tree/master/src) folder on the repo.

A large app may end up being split into hundreds of tiny modules, and each new download results in a new network request. This may add significantly to the load time of a website for users with poor network quality and slow mobile devices. **In production, you will probably want to bundle your code even if you don't need to support outdated browsers**.

However, in this book we will skip the bundling step and allow you to choose the approach that works best for your app.

#### 2. Transpile the ESNext Syntax into ES5 Syntax that Outdated Browsers can Understand

Tool that perform this step are called **transpilers**, and the most popular of these is [Babel.js](https://babeljs.io/).

Transpilation comes at a slight cost in performance and code size, but not as much as you might think.

Further discussion of bundling and transpilation is beyond the scope of this book. In any case, the best answer is changing rapidly as more and more internet users browse the web with up-to-date browsers. By the time you read this, it may not be something that you need to worry about at all.

One other point, in case you are not convinced yet: the legacy _**three.js**_ and _**three.min.js**_ scripts will be removed at some point, leaving us with no choice but to use the modern variant.

### Browser Modules

Closely related to JavaScript modules is the concept of **browser modules**. These allow us to use ES6 modules directly in our HTML, inside a `<script>` element.

To do this, we need to add a type attribute to the script tag:

{{< code lang="html" linenos="false" hl_lines="" >}}

<script type="module">
  // here, we can use ES6 modules directly without bundling
</script>

{{< /code >}}

Refer to {{< link path="/book/appendix/javascript-modules" title="" >}} in the appendix for more details on how browser modules work.

## How to Use the Module Based Variant: _**three.module.js**_

_**three.module.js**_ is a **JavaScript Module**. This means that we use it with the [`import` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import), either by importing the entire core under the `THREE` _namespace_:

{{< code lang="js" linenos="false" hl_lines="" >}}
import \* as THREE from './build/three.module.js';

// later
const geometry = new THREE.BoxBufferGeometry();
{{< /code >}}

...or by importing components by name as we need them:

{{< code lang="js" linenos="false" hl_lines="" >}}
import {
BoxBufferGeometry,
CylinderBufferGeometry,
} from './build/three.module.js';

// later
const geometry = new BoxBufferGeometry();
{{< /code >}}

Importing plugins works similarly. Here, we are importing the `OrbitControls` plugin:

{{< code lang="js" linenos="false" hl_lines="" >}}
import { OrbitControls } from './examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls();
{{< /code >}}

Note that we are including the `.js` part of the file name when using `import`. **This is required for browser modules to work**.

## How to Use the Old-School Variants: _**three.js**_ and _**three.min.js**_

For historical purposes, here is how to use the legacy _**three.js**_ and _**three.min.js**_ files. These files must be included via a `<script>` tag in your HTML file:

{{< code lang="html" linenos="false" hl_lines="" >}}

<!-- The three.js core -->
<script src="build/three.js"></script>

<!-- The OrbitControls plugin -->
<script src="examples/js/controls/OrbitControls.js"></script>

<!-- main.js contains our app -->
<script src="src/main.js"></script>

{{< /code >}}

Once you've included the script correctly, the `THREE` namespace will be _globally available_ in all JavaScript scripts loaded _after_ the _**three.js**_ script:

{{< code lang="js" linenos="false" hl_lines="" >}}
// main.js

const geometry = new THREE.BoxBufferGeometry();

const controls = new THREE.OrbitControls();
{{< /code >}}

If you are following along with old tutorials and books or working with code that was written a few years ago, you'll see this pattern a lot.
