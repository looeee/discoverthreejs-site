---
title: "How to Include three.js in Your Projects"
description: "The first step in building a three.js app is importing the three.js files. There are three main ways to do this: download the files, use the NPM package, or import from a CDN."
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

# How to Include three.js in Your Projects

There are several ways to include three.js in your JavaScript application, some simple, some a little more complex, but they all boil down to this: you need to include the three.js core in your project, which you can find in this file on the three.js repo:

- [_**three.module.js**_](https://github.com/mrdoob/three.js/tree/master/build)

In addition to the core file, we'll often add {{< link path="/book/introduction/github-repo/#examples-folder" title="plugins" >}} such as {{< link path="book/first-steps/camera-controls/" title="camera controls" >}} or post-processing. You can find plugins in the [_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm/) folder on the repo, and including them works in much the same way as for the core file. For the rest of this chapter, we'll use the `OrbitControls` plugin (a popular camera controls plugin) for demonstration, which you can find on the repo here:

- [_**examples/jsm/controls/OrbitControls.js**_](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/OrbitControls.js)

Open up the editor on this page by clicking the {{< icon "solid/columns" >}} icon, and you'll see that we have included these two files inside the _**vendor/**_ folder:

- The core is in _**vendor/three/build/three.module.js**_
- `OrbitControls` is in _**vendor/three/examples/jsm/controls/OrbitControls.js**_.

We have also set up a very simple web page consisting of these three files:

- _**index.html**_
- _**src/main.js**_
- _**styles/main.css**_

Check out _**index.html**_ now, and you'll see that we have referenced _**main.js**_ in the `<head>` section:

{{< code lang="js" linenos="true" linenostart="14" hl_lines="" caption="_**index.html**_: referencing the main JavaScript file" >}}

```js
<script type="module" src="./src/main.js"></script>
```

{{< /code >}}

Take special notice of `type="module"`, which we're using to tell the browser the linked file is a JavaScript module. If anything in _**index.html**_ is unfamiliar to you, check out the [HTML and CSS Reference]({{< relref "/book/appendix/html-and-css-reference" >}} "HTML and CSS Reference"). If using JavaScript modules is new to you, or you need a refresher, check out [JavaScript Modules Reference]({{< relref "/book/appendix/javascript-modules" >}} "JavaScript Modules Reference"), both in the appendices.

## Importing three.js Modules

The core and `OrbitControls` plugins are JavaScript modules. To use them, first, we need to _import_ them into _**main.js**_, so open up that file now. Over the rest of this chapter, we'll demonstrate various ways to import _**three.module.js**_ and _**OrbitControls.js**_ here.

### Importing the three.js Core

The three.js core contains hundreds of classes such as cameras, materials, geometries, textures, lights, shadows, the animation system, various loaders, audio, the renderer, 2D shapes, helpers, fog, and so on. We'll never need to use all of them at once, and in fact, it's almost certain you'll never need to use all of them across an entire application, no matter how big it is. So, for this chapter, let's assume we want to import just three classes from _**three.module.js**_: the [`PerspectiveCamera`](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera), the [`MeshStandardMaterial`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial), and the [`WebGLRenderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer).

#### Import the Entire three.js Core

The simplest approach is to {{< link path="book/appendix/javascript-modules/#using-namespaces-with-named-imports" title="import _everything_" >}} from the three.js core into _**main.js**_ under the `THREE` namespace:

{{< code lang="js" linenos="false" caption="_**main.js**_: import the entire three.js core" >}}
import \* as THREE from './vendor/three/build/three.module.js';
{{< /code >}}

Then we can use any element of the core by referencing them under the `THREE` namespace:

{{< code lang="js" linenos="false" caption="_**main.js**_: accessing classes from the core under the `THREE` namespace" >}}

```js
THREE.PerspectiveCamera;
THREE.MeshStandardMaterial;
THREE.Texture;
// ... and hundreds more
```

{{< /code >}}

#### Import Individual Components from the Core

However, in this book we'll prefer to import only the classes that we need in any given module:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing class as we need them" >}}

```js
import {
  PerspectiveCamera,
  MeshStandardMaterial,
  WebGLRenderer,
} from "./vendor/three/build/three.module.js";
```

{{< /code >}}

Now instead of hundreds of properties being imported, there are only the three that we need:

{{< code lang="js" linenos="false" caption="_**main.js**_: accessing individually imported classes" >}}

```js
PerspectiveCamera;
MeshStandardMaterial;
WebGLRenderer;
```

{{< /code >}}

Doing this forces us to think more carefully about the classes we're using in a given module, which means we're more likely to follow best practices and keep our modules small and focused. We can also avoid using the `THREE` namespace this way.

### Importing Plugins

The _**OrbitControls.js**_ module contains a single export, the `OrbitControls` class. Importing this works the same way as importing classes from the core:

{{< code lang="js" linenos="false" caption="_**main.js**_: import `OrbitControls`" >}}

```js
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";
```

{{< /code >}}

Now the `OrbitControls` class is available within _**main.js**_. With both the core files and a camera controls plugin, we are ready to start building our app.

## How to Obtain the three.js Files

Not so fast! How do we get our hands on the files in the first place? In the editor, we have already got the files for you, but if you're working locally, you'll have to handle that yourself. Here are three common approaches.

### 1: Download Them All! {#download-files}

The easiest method is to download the entire three.js Github repo onto your computer. Here's the [latest release of three.js as a zip file](https://github.com/mrdoob/three.js/archive/master.zip). Download it and look inside the _**build/**_ and _**examples/jsm/**_ folders and you'll find the necessary files. Extract everything from the zip file into _**vendor/**_ and proceed as described above.

If you're new to web development, you'll probably find this method the easiest. You can graduate to a more sophisticated approach later.

### 2: Link to the files from a CDN {#use-a-cdn}

A second approach is to link the files from a CDN (Content Delivery Network), which is a remote site dedicated to hosting files so you can use them in a web page without downloading them first. There are lots of CDNs around, however, many of them don't support loading modules. One that does is [skypack.dev](https://www.skypack.dev/view/three) which allows you to load any published NPM package. You can find the core _**three.module.js**_ file here:

- https://cdn.skypack.dev/three@0.132.2

Note that we're specifying the version. You can also leave out the version which will always return the latest version

- https://cdn.skypack.dev/three

However, doing this means that a new release of three.js might break your app while you're not looking so it's a good idea to alway lock down the version.

When it comes to loading plugins, you can reference them using the structure of the repo, so you'll find _**OrbitControls.js**_ here:

- https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js

To find a file from the repo, take the URL from GitHub (such as _**examples/jsm/controls/OrbitControls.js**_) and prepend _**{{< t.inline >}}https://cdn.skypack.dev/0.{version}.0{{< /t.inline >}}**_, where _{version}_ is the release of three.js that you're using.

At the time of writing, the latest version is r132, and the final `.2` in `0.132.2` means there have been some hotfixes applied to the release after publising it to NPM. A new version is released every month. It's not necessary to use the latest version, but it _is necessary_ to use the same version for the main build file _and_ any extensions you use.

Importing the files from a CDN works the same way as importing them from your local file system, except that now we are loading the files from skypack.dev instead of from our hard drive:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing three.js files from a CDN" >}}

```js
import {
  Camera,
  Material,
  Texture,
} from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
```

{{< /code >}}

### 3: Install three.js as an NPM package {#package-manager}

_Note: This section assumes that you have a basic understanding of how JavaScript package management works. If you don't, get the files using another method for now._

three.js is also available as a [package on NPM](https://www.npmjs.com/package/three). If you have [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) (Node Package Manager) installed on your computer, you can open a command prompt and enter the following commands:

{{< code lang="js" linenos="false" caption="_**Command prompt**_: install the _three_ npm package" >}}
// set up a project
npm init

// once the project is set up, install the three npm package
npm install --save three
{{< /code >}}

Once again, importing the files works the same way, except that now we can replace the big ugly CDN URL with the name of the package, in this case, _three_:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing class from the three.js core using the NPM package" >}}
import {
Camera,
Material,
Texture,
} from 'three';
{{< /code >}}

When you do this, your bundler will automatically resolve `three` to the main export of the package, in this case `three/build/three.module.js`. You can also import this file directly, there's no difference:

{{< code lang="js" linenos="false" caption="_**main.js**_: directly referencing the core file from the _three_ package" >}}
import {
Camera,
Material,
Texture,
} from 'three/build/three.module.js';
{{< /code >}}

Importing plugins is not quite so convenient as an NPM package can only have one main file. To import `OrbitControls`, we need to reference the containing module directly:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing three.js plugins using the NPM package" >}}
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
{{< /code >}}

There are many bundlers available, such as Rollup, Webpack, ESBuild, and Parcel, and setting these up is beyond the scope of this book. However, they all resolve modules in the same way so you can write this code and then bundle it using whichever one you like.

## Import Style Used in this Book

In the examples throughout this book, we'll use NPM style imports since these are both the shortest way of writing the import statements, and the style you are most likely to encounter in a professional setting.

In most chapters, in the editor, you can switch between NPM and CDN imports (using _**skypack.dev**_). However, if you download the code from the editor, the downloaded code will use CDN imports. This means you can use the downloaded code immediately on your local computer without the trouble of setting up a bundler or installing NPM packages. You will, however, need to {{< link path="/book/introduction/about-the-book/#code-examples" title="set up a local development server" >}}.
