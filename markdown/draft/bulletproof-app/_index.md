---
title: "Production Ready three.js"
description: "In this section we'll create a bulletproof, production-ready three.js that uses industrial strength, cross-browser best standards to display your 3D scenes"
date: 2018-04-02
sectionHead: true
weight: 200
chapter: "2"
summaryAvailable: true
includeInSitemap: false
prevURL: "/book/first-steps/animation-system/"
prevTitle: "The three.js Animation System"
membershipLevel: paid
---

# Production Ready three.js

![test](/static/images/bulletproof-app/intro-header.png)

**Congratulations! You have made it to Section Two!**

By now, you should have a basic understanding of how to set up a three.js scene, camera, and renderer, how to add objects to the scene and set up the render loop, how to add animations to those objects and controls to your camera, how to perform transformations such as rotation, scale and translation to move your objects around in 3D space, and even how to load complex models and animations created in other applications.

You can *already* create stunning 3D web applications that run equally well on mobile or desktop, across all major browsers and operating system, and we've barely scratched the surface of what three.js is capable of.

On the other hand, we're using a very old-school style of JavaScript - as somebody said on Twitter of similar code recently, our current application is "very 2014". There have been a *lot* of developments in the world of web applications since then, and we'll spend this section bringing our application into the glorious future of ES6+ and HTML5. It's a good time to be a web developer.

Here's a brief summary of what we'll be doing in Section 2.

## Chapter 2.1 [Welcome to the Future: JavaScript Classes and Modules](/book/bulletproof-app/create-class/)

First, we'll fully embrace a modern style of JavaScript, in particular using **classes** which will make our code cleaner, and **modules**, which will allow us to split our code up into separate files. As our applications get more complicated, the ability to write modular code becomes more and more important as it allows us to compartmentalize our app and free up space in our short term memories.

If classes or modules are unfamiliar to you, make sure to read over the [Brief JavaScript Tutorial: Part 2](/book/introduction/javascript-tutorial-2/) in the introduction.

In Chapter 2.1 we'll do two things - first, we'll start _importing_ just the parts of three.js that we need. This means that we'll switch to using the [***three.module.js***](https://raw.githubusercontent.com/mrdoob/three.js/master/build/three.module.js) file instead of the [***three.js***]([https://github.com/mrdoob/three.js/blob/dev/build/three.js](https://raw.githubusercontent.com/mrdoob/three.js/master/build/three.js)) file that we've been using up until now. Then we can import things from that file into our ***app.js*** file like this:

{{< code lang="js" linenos="false" hl_lines="" >}}
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
{{< /code >}}

And we can use the things that we import like this:

{{< code lang="js" linenos="false" hl_lines="" >}}
const scene = new Scene();
{{< /code >}}

It's nearly exactly the same, except that we no longer have to use the ugly `THREE` namespace all over the place.

We'll also turn all of our code into a single big class. The modules were nice, but the class *may* not immediately seem like a huge improvement, which *may* leave you wondering whether it was worth the effort. Hopefully, the next chapter will change your mind about that!

## Chapter 2.2 A Bullet-Proof Reusable App

In this chapter, we'll take a long hard look at our code and decide that we can split it into two parts:

1. _setup_ code, that will be nearly identical in 99% percent of all the apps that we build
2. _app specific_ code - creating meshes, lights, and animations, loading models and so on

The setup code is all the things like creating a camera, scene, renderer, setting up the animation loop, the camera controls, the resizing code and so on.

Since we'll use the setup code so often, we'll pay special attention to it and make sure that it's as close to perfect as possible. We'll move it into a second file called ***App.js*** (note the capital letter) and we'll create a class called `App` inside that.

Once we've perfected this app, getting a scene started will be as simple as:

{{< code lang="js" linenos="false" hl_lines="" >}}
import App from 'App.js';

const app = new App( {
  container: '#scene-container',
} );
{{< /code >}}

Then we'll be able to move onto making beautiful things and not have to worry about the technicalities of setting up renderers, loops, resize event listeners and so on.

_This_ is where the magic of modules and classes becomes apparent. As a programmer, your goal should always be to have to think about as few elements of your app as possible at any given time. We humans can hold just a few items at once in our working memory, and the fewer things we have in there, the smoother our thoughts will flow. On the other hand, cram in too much and everything gets jumbled up, our brains overheat and smoke starts to come out of our ears.

This is not a metaphor. Literal smoke, I tell you! Keep your programmes modular or your brain will burn out like a cheap laptop trying to play a badly optimized WebGL application.

Anyway, moving on...

Now that we have modules working, we'll split our app into a bunch of files:

* App.js
* main.js
* lights.js
* materials.js
* geometries.js
* meshes.js
* models.js
* animations.js

... an so on. However, we'll only use the files (_modules_, that is) that we need at any given time. If our scene is not animated, we'll leave out ***animation.js***. If we don't load any models we'll leave out ***models.js***, and so on.

We'll _always_ have at least ***App.j***s and ***main.js*** though.

## Chapter 2.3 [Using async/await with three.js Loaders](/book/bulletproof-app/3-async-loader/)

Next up, we'll tackle the problem of **callbacks**. If you recall from the [previous chapter](/book/first-steps/load-models/#onload-callback), when we load a model we then have to set it up and add it to our scene inside the `onLoad` callback function:

{{< code lang="js" linenos="false" hl_lines="" >}}
loader.load( '/models/Parrot.glb', ( gltf ) => {

  // all setup and processing of the model has to happen inside here

  // ALSO, every other part of our app that uses the model has to be
  // set up in here too

} );
{{< /code >}}

It's not ideal, but until the introduction of `Promises` and the `async`/`await` keywords over the last couple of years, we had no other options.

Now, we can do this instead:

{{< code lang="js" linenos="false" hl_lines="" >}}
const model = await loader.load( '/models/Parrot.glb' );

scene.add( model );
{{< /code >}}

That's a little bit of a simplification, but we'll reveal all the magic in this chapter.

This way of loading models gives us _much_ simpler control over the flow of the asynchronous part of our code.

Of course, there's a catch. The three.js loaders are designed to be used with callbacks, _not_ `async`/`await`. To overcome this, we'll write a short utility function called `createAsyncLoader` which will turn any normal three.js *callback loader* into an *async loader*:

{{< code lang="js" linenos="false" hl_lines="" >}}
const loader = createAsyncLoader( new GLTFLoader() );

const model = await loader.load( '/models/Parrot.glb' );
{{< /code >}}

Fair warning: the `createAsyncLoader` function is short, but if you're new to the concept of `Promises` it may be hard to understand. If that's the case for you, don't worry, because you don't need to *understand* it to *use* it.

Once again, if this is the first time you've heard of all of this stuff, be sure to check out the [Brief JavaScript Tutorial: Part 2](http://book/introduction/javascript-tutorial-2/#async-await) from the intro.

## Chapter 2.4 [Using three.js with package managers such as NPM and Yarn](/book/bulletproof-app/package-managers/)

NA!

## Chapter 2.5 [Bundling your JavaScript modules into a Single File](/book/bulletproof-app/module-bundling/)

OK, we've split all of our code up into small modules that we can read over in a few seconds. Now we need to **bundle** it all back up into a single file.

Wait, what?

You see, browsers don't deal with loading lots of tiny files well (yet), and older browsers don't support modules at all. If we want to run our app on older browser, or at the speeds required for a production-ready app on modern browsers, we'll need to remove all the `import` and `export` stuff and serve our app in a single file.

Come to that, older browsers don't understand all the ES6+ syntax either - even worse, we can't easily tell _how much_ of it a given browser will understand, so while we're *bundling* our modules into a single file, we'll also compile our fancy ES6+ classes and other things down into ES5 JavaScript which can be used by all browsers.

Next, we'll take a look at [rollup.js](https://rollupjs.org/guide/en) which is the bundling tool that three.js itself uses (yes, the three.js library is also written as hundred of small modules which are then combined into the large ***three.js*** and ***three.module.js*** files). It requires a little more setup than Parcel.js, but it's lightweight and quite easy to use. It just deals with processing your JavaScript and doesn't try to do anything else.

At the other end of the scale is [webpack](https://webpack.js.org/), which does a lot more than just bundle JavaScript. It's also much harder to set up (although, thankfully, recent versions are a *lot* better in that regard). Webpack is a complete web application solution and bundles _everything_, JavaScript, HTML, glTF models, images, and so on.

All of these bundling tools use [Babel.js](https://babeljs.io/) to compile your ES6+ code into ES5 code as well. In the case of Parcel, it does this (mostly) automatically, while for rollup.js and Webpack we need to set up this step manually.

Once we have completed this section, we will have a future proof and highly performant, production-ready three.js app template that we can reuse again and again going forwards, in projects of all scales from tiny experiments to full featured professional web apps designed to be used by millions of customers.

## Chapter 2.6 [A Secret Weapon: Introducing Draco Compression](/book/bulletproof-app/6-draco-compression/)

In the final chapter of this section, we'll introduce an amazing secret weapon in the quest to make our 3D models as tiny as possible to ensure they load quickly over the internet. Draco mesh compression does for 3D geometry something analogous to what JPG does for images.

We'll use it on this highly detailed [3D scan of a Rhino statue](https://sketchfab.com/3d-models/rhinoceros-in-orsay-museum-paris-b824332212fc48e2adfff4eab46d9485) from the Orsay Museum in Paris, available for free on Sketchfab.com. It has a little under 200,000 vertices and the model comes in at around 20mb, which is probably too big for most websites.

Downloadable models on Sketchfab are available in glTF format, but in ASCII (.gltf) style rather than compressed (.glb) style. That's easy to fix and once we've converted the model to a single ***rhino.glb*** file, we are down to around 13mb.

However, when we then take this model and apply Draco compression, the size drops all the way down to 1.7mb!

That's right, we took a 20mb model and with just a little bit of processing that takes around 5 minutes (and can be automated if we're doing it often), we reduced the size to only 8.5% of the original!

The compression is _lossy_, just like JPG, meaning that you do not get back _exactly_ the same model that you put in. However, viewing the compressed and original models side by side you will be hard pressed to see any difference.

The downside to Draco compression is that the model needs to be de-compressed before viewing, which may take a couple of seconds, especially on a slower mobile device. However, this will generally be offset by the much faster download time.

