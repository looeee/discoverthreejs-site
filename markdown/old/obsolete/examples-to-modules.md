---
title:  "Adapting three.js Plugins For Use As ES6 Modules"
date: 2018-02-02
description: "How to convert three.js plugins such as OrbitControls or loaders to ES6 modules"
menuImage: 'geometries/extrude.png'
tags: ['threejs', 'plugins', 'examples', 'controls', 'loaders', 'ES6', 'modules', 'import']
weight: 105
chapter: "B.5"
draft: true
---
{{% fullwidth %}}
# ADAPTING three.js pLUGINS FOR USE AS ES6 MODULES
{{% /fullwidth %}}

One question that comes up again and again on GitHub and the forum is how to use three.js as part of a modern ES6 setup, complete with `import` statements.

We've covered how to set up a bundler and import the main three.js code as an NPM module already in a previous post. While setting up build tools is a bit trickier, the only unusual part of that was that we needed a way to compile GLSL shader files. Otherwise the setup was much the same as it would have been for any other library.

Next, we want to do the same thing for the plugins / examples, such as [OrbitControls](https://threejs.org/docs/#examples/controls/OrbitControls), or the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader) or other loaders.

Or perhaps you want to use [decals](https://threejs.org/docs/#examples/geometries/DecalGeometry), or the [CanvasRenderer](https://threejs.org/docs/#examples/renderers/CanvasRenderer)? There are many plugins that come with three.js, and one thing that they all have in common is that they need to be included separately. Traditionally, you would do this as using `<script>` tags:

{% highlight html %}
// first include the main three.js file
<script src="three.js"></script>

// then include any plugins
<script src="OrbitControls.js"></script>
<script src="GLTFLoader.js"></script>
<script src="DecalGeometry.js"></script>
<script src="CanvasRenderer.js"></script>
{% /highlight %}

We want to change this, so that we have just a single `<script>`:

{% highlight html %}
// bundled script including three.js, your code and all plugins
<script src="bundle.js"></script>
{% /highlight %}

Then we want out JavaScript to look something like:

{% highlight js %}
// import main three.js code as an NPM module
import * as THREE from 'three';

import OrbitControls from './OrbitControls.module.js`;
import GLTFLoader from './GLTFLoader.module.js`;
import DecalGeometry from './DecalGeometry.module.js`;
import CanvasRenderer from './CanvasRenderer.module.js`;

// The rest of your code
{% /highlight %}

Unfortunately, there is one other thing that all the plugins have in common - they are all written in ES5 and are totally unsuited to being imported in this manner. We'll need to change them a bit so that they work.

I've done the following procedure for quite a few plugins, and it's pretty much the same in each case. It would probably be possible to write a script to so it in most cases, although some plugins would probably need to be changed.

### Converting OrbitControls to an ES6 Module.