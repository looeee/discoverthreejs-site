---
title: "The Structure of a three.js App"
description: "To showcase our three.js scenes, we need a web page. Here, we create a basic page using HTML and CSS. However, we'll structure our three.js app so you can just as easily integrate it with a framework such as React or Vue instead of this simple page."
date: 2018-04-02
weight: 101
chapter: "1.1"
available: true
showIDE: true
IDEFiles:
  [
    "assets/models/Flamingo.glb",
    "assets/textures/uv-test-bw.png",
    "worlds/first-steps/app-structure/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "vendor/three/examples/jsm/loaders/GLTFLoader.js",
    "vendor/three/examples/jsm/controls/OrbitControls.js",
    "worlds/first-steps/app-structure/index.html",
  ]
IDEClosedFolders: ["assets", "vendor"]
IDEStripDirectory: "worlds/first-steps/app-structure/"
IDEActiveDocument: "index.html"
IDESwitchImportsAllow: false
prevURL: "/book/first-steps/"
prevTitle: "Getting Started: Here's Where the Real Fun Begins!"
---

# The Structure of a three.js App

Before we can build a three.js app, we need to create a web page. We briefly discussed how we're going to do that in the introduction ({{< link path="/book/introduction/get-threejs/" title="Ch 0.5" >}} and {{< link path="/book/introduction/threejs-with-frameworks/" title="Ch 0.6" >}}), but let's take a deeper look now. As we mentioned in the last chapter, our goal here is to create the most basic, simple, unexciting webpage possible, without making any assumptions about what a real-world web application that uses three.js might look like. By doing this, we ensure the code we write can be adapted to work anywhere without too much effort.

We'll create this basic web page out of just two files: _**index.html**_, and _**styles/main.css**_. That's it. Open up the editor by pressing the {{< icon "solid/columns" >}} button now and take a look at both of these files now.

> If anything from this chapter is unfamiliar to you, refer to {{< link path="/book/appendix/html-and-css-reference" title="" >}} where we take a deeper look at the construction of a simple web page.

## _**index.html**_

_**index.html**_ is the root file of our app. It's the only file we open directly in the browser, and all CSS and JavaScript files are loaded via references from this file.

{{< code file="worlds/first-steps/app-structure/index.html" lang="html" linenos="true" caption="_**index.html**_: the root of our web page" >}}{{< /code >}}

## _**styles/main.css**_

Within the `<head>` section of _**index.html**_, one of the `<link>` elements references the _**styles/main.css**_ file:

{{< code from="12" to="12" hl_lines="" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: Referencing _**main.css**_" >}}{{< /code >}}

... which contains some simple styles for controlling the appearance of our page:

{{< code file="styles/main.css" linenos="false" lang="css" caption="_**styles/main.css**_">}}{{< /code >}}

We'll take a closer look at the styles for the `#scene-container` in a moment, while the rest of this file is explained in more detail {{< link path="/book/appendix/html-and-css-reference/#main-css" title="in the appendices" >}}.

## _**src/main.js**_: the JavaScript Entry Point

Back in _**index.html**_, just below the styles `<link>` is a `<script>` tag referencing the `src/main.js` file:

{{< code from="14" to="14" hl_lines="" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: Referencing _**main.js**_" >}}{{< /code >}}

... which is currently empty:

{{< code file="worlds/first-steps/app-structure/src/main.js" lang="js" linenos=""
caption="_**src/main.js**_: coming soon!" >}}{{< /code >}}

_**main.js**_ is the entry point for our JavaScript application, and we'll fill it up in the next chapter. The `type="module"` attribute tells the browser we're writing JavaScript modules. If this is new to you, head over to {{< link path="/book/appendix/javascript-modules/" title="" >}}, which has everything you need to know about JavaScript modules to follow the code in this book.

There's another advantage to the `module` attribute: the browser will automatically _defer_ running this file until the HTML has been parsed. This will prevent errors caused by trying to access an HTML element before the browser has read that far (browsers read HTML from top to bottom).

## Adding a three.js Scene to the Page

The next point of interest in _**index.html**_ is the scene container element:

{{< code from="17" to="23" hl_lines="20 21 22" file="worlds/first-steps/app-structure/index.html" lang="html" linenos="" caption="_**index.html**_: The scene container" >}}{{< /code >}}

All three.js scenes are rendered inside a [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element. Once we have set up our app, three.js will create a canvas for us, and then we'll insert it inside the scene container:

{{< code lang="html" linenos="false" caption="_**index.html**_: once our app is running we'll insert the three.js canvas into the scene container" >}}

<div id="scene-container">
  <canvas></canvas>
</div>
{{< /code >}}

We can then control the position and size of our scene by styling the scene container element. If you turn your attention back to _**main.css**_, you'll see that we have already created some styles for this element. By setting the position, width, and height, we're telling the browser this element should take up the full window:

{{< code from="24" to="35" hl_lines="" file="styles/main.css" lang="css" linenos="false" caption="_**main.css**_: styling the scene container" >}}{{< /code >}}

Finally, we have set the background color to sky blue since that's the background color we'll give most of our three.js scenes in this section. Our scene will take a few milliseconds to get ready, while the browser parses JavaScript, loads 3D models, and builds the scene, and while all that is going on the scene container will be visible. By making the container the same color as the scene we ensure that the transition is as smooth as possible.

## Other Folders

Turn your attention to the file tree in the editor. There are two folders we haven't looked at so far: _**assets/**_, and _**vendor/**_.

### {{< icon "solid/folder-open" >}} The _**vendor/**_ Folder

The _**vendor/**_ folder is where we put JavaScript files that _other people_ have written. For most of the examples in this book, that means files from the three.js library, downloaded from the {{< link path="/book/introduction/github-repo/" title="three.js GitHub repo" >}}. In this book, we'll use just three files from the library:

- _**vendor/three/build/three.module.js**_: the main three.js file.
- _**vendor/three/examples/jsm/controls/OrbitControls.js**_: a camera control plugin that we'll introduce in {{< link path="/book/first-steps/camera-controls/" title="Ch 1.9" >}}.
- _**vendor/three/examples/jsm/loaders/GLTFLoader.js**_: a loader for 3D models that we'll introduce in {{< link path="/book/first-steps/load-models/" title="Ch 1.13" >}}.

The _**vendor/three**_ folder mirrors the structure of the GitHub repo, but for clarity, we'll include only the files needed in each chapter. To import these files within _**main.js**_, we'll use _NPM style imports_:

{{< code lang="js" linenos="false" caption="_**src/main.js**_: importing three.js files, NPM style" >}}
import {
Camera,
Group,
Scene,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
{{< /code >}}

If you prefer to {{< link path="/book/introduction/about-the-book/#working-on-your-own-machine" title="work locally" >}}, you can download the files from the editor as a zip archive using the {{< icon "solid/download" >}} button. Within the zip file, any three.js imports will be converted to CDN imports from skypack.dev:

{{< code lang="js" linenos="false" caption="_**src/main.js**_: importing three.js files, CDN style" >}}

```js
import { Camera, Group, Scene } from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js?module";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js?module";
```

{{< /code >}}

Refer back to {{< link path="/book/introduction/get-threejs/" title="" >}} for more details.

## {{< icon "solid/folder-open" >}} The _**assets**_ Folder

{{< inlineScene entry="first-steps/flamingo-animated.js" class="medium right round" >}}

Finally, there's the _**assets/**_ folder. **Anything used in our app that is not HTML, CSS, or JavaScript goes in here**: textures, 3D models, fonts, sounds, and so on. Currently, there's one test texture that we'll use in {{< link path="/book/first-steps/textures-intro/" title="" >}}, and one model of a flamingo that we'll use in {{< link path="/book/first-steps/load-models/" title="" >}}.

{{% note %}}
TODO-LOW: apply test texture to the flamingo in this scene
{{% /note %}}

{{< clear >}}

With that out of the way, it's time to get down to business! In the next chapter, we'll create our first simple three.js application.
