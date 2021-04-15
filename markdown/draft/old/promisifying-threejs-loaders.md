---
title:  "Promisifying three.js Loaders"
date: 2018-02-12
description: "In this post we'll go over a method for turning three.js loaders into promises. We'll create a simple function that takes any loader and spits out a ready to go 'promisified' version."
menuImage: 'geometries/icosahedron.png'
tags: ['loading', 'promises', 'modules', 'ES6', 'GLTFLoader']
weight: 106
chapter: "B.6"
draft: true
---
{{% fullwidth %}}
# PROMISIFYING three.js LOADERS


https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65
https://itnext.io/promise-loading-with-three-js-78a6297652a5

{{% /fullwidth %}}

[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are great! Promises are the future! Well, async/await is probably the future, but lets take things one step at a time here.

In case you don't know, promises simplify the process of dealing with asynchronous operations.

An asynchronous operation is something that might take a while - you don't want to halt the program while you are waiting, so you need some way of waiting until your time taking task has run, and then resuming operation at that point in the program.

In this post we'll go over the motivation for turning three.js loaders into promises, and then look at how to actually do it. It turns out to be fairly simple - in fact we can create a `promisifyLoader` function that takes any loader and spits out a `promiseLoader` version. Not even that that, but we can continue to use the [LoadingManager](https://threejs.org/docs/#api/loaders/managers/LoadingManager) and all our pretty `onLoad`, `onProgress` and `onError`. Although it will turn out that we may not want to... read on!

### Callbacks

Traditionally in JavaScript, callbacks have been (and are) used to deal with asynchronous operations, and they are used liberally throughout the three.js source code and the [official examples](https://threejs.org/examples/).

In particular, callbacks are used every time a model is  loaded. Here is how you would load an FBX model, for example:

{{< highlight js >}}
{{< /highlight >}}
{{< highlight js >}}
const loader = new THREE.FBXLoader( manager );

loader.load( 'duck.fbx', ( loadedObject ) => {

  scene.add( loadedObject );

}, onProgress, onError );

{{< /highlight >}}

There are actually three callback functions here, but the one we are interested in is the so called `onLoad` callback, which gets called once the model has finished loading:

{{< highlight js >}}
( loadedObject ) => {

  scene.add( loadedObject );

}
{{< /highlight >}}

The others are `onProgress`, and `onError` which we'll ignore for now.

There is nothing wrong with the callback approach in many cases. However, there are times when they lead to complex and hard to read code, and they have limitations. In these cases, we can turn to a new (to JavaScript) approach, called [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### Promises, Promises

Yes, that joke heading probably gets used in every single article on promises. I'd hate to break the trend.
Anyway, let's take a look at how we would rewrite the above model loading code if the `FBXLoader` returned a Promise instead of waiting for a callback:

{{< highlight js >}}
const promiseLoader = new THREE.FBXPromiseLoader();

const promiseOfADuck = promiseLoader.load( 'duck.fbx' );

promiseOfADuck
  .then( ( loadedObject ) => {

    scene.add( loadedObject );

  } )
  .catch( ( err ) => { console.error( err );  } );
{{< /highlight >}}

Here the `catch` statement has taken over the role of `onError`.

In this case it doesn't look like much of an improvement. It's actually a bit longer, and it still has exactly the same callback function inside it.

The advantages of promises don't become apparent until you are dealing with more complex code situations, so let's dive straight in and make things more complicated and see what happens.

Also, once we have converted the loader to a promise we'll be able to use it with `async`/`await`, which will make things even cleaner. That's beyond the scope of this post, but we'll come back to it later.

### Loading Multiple Groups of Models

You can find lots of other examples if you search the web, but here is the most common case I have found where things are simplified in three.js: waiting for multiple groups of models to load.

In our hypothetical examples, our first group is a set of farm buildings (a farmyard ), and our second set is a group of farm animals.

Let's assume that we have already loaded the farm buildings, so that `loadingManager.onLoad` would have already fired, in a traditional setup. We could get around this by having multiple loading managers, but lets use promises instead.

We now want to load models for duck, sheep, pig, cow and chicken. The farmyard is already loaded and displayed, and we want to add them all at once, not have them appear one by one.

#### Introducing Promise.all

With promises we can wait until a whole batch of them have resolved and _then_ do something, using [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).

Here's how the code will look:

{{< highlight js >}}
const promiseLoader = new THREE.FBXPromiseLoader( manager );

const farmYardPromises = [];

const farmYardAnimals = new THREE.Group();

const onLoad = ( ( loadedObject ) => {

  farmYardAnimals.add( loadedObject );

} );

const onError = ( ( err ) => { console.error( err ); } );

const promiseOfADuck = promiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );
const promiseOfASheep = promiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );
const promiseOfAPig = promiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );
const promiseOfACow = promiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );
const promiseOfAChicken = promiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );

Promise.all( this.loadingPromises ).then( () => {

  scene.add( farmYardAnimals );

} );
{{< /highlight >}}

Here are a couple of examples of things that you can do here that would be hard to do using `LoadingManager.onLoad`, or without promises. All of these are examples from my own projects:

* remove a loading overlay, _before_ textures have finished loading. `LoadingManager.onLoad` will wait until _everything_ has finished loading, which may not be what you want (see [Faking a progress bar in three.js](/blog/progress-bar)).
* have two separate sets of objects loading, and do something when each set has finished (such as our farmyard).

Another example of the latter from an app I developed: I had a one set of models, and a set of animations for each model. Each model had an initial animation built-in, so it could start playing immediately, and then a set of additional animations (run, crouch, jump etc) that were added later.

As you use promises, you will find more and more reasons why they are cleaner and easier to structure code around than callbacks.

### Converting Loaders to Promises

Now that we have the motivation, let's look at how to actually convert a `Loader` to a `PromiseLoader`. It turns out to be pretty simple. In fact, we'll create a function that will take any three.js loader and output a promisified version of that loader.

We'll take the `FBXLoader` as an example, you could use any loader though, including the ones in three.js core such as the [BufferGeometryLoader](https://threejs.org/docs/#api/loaders/BufferGeometryLoader).

{{< highlight js >}}
function promisifyLoader ( loader, onProgress ) {

  function promiseLoader ( url ) {

    return new Promise( ( resolve, reject ) => {

      loader.load( url, resolve, onProgress, reject );

    } );
  }

  return {
    originalLoader: loader,
    load: promiseLoader,
  };

}
{{< /highlight >}}

Remember that the promise's `.then` has taken the place of `onLoad` and the `.catch` has taken the place of `onError`. This just leaves `onProgress`, which you can pass in to the function, or omit. I don't find this function useful so I usually omit it. See [Faking a progress bar](/blog/progress-bar/) for more details.

With this function set up, we can then turn the `FBXLoader` into an `FBXPromiseLoader`:

{{< highlight js >}}
const FBXPromiseLoader = promisifyLoader( new THREE.FBXLoader() );
{{< /highlight >}}

Note that, even though the promises have largely taken over the role of the `LoadingManager`, you can still use it of you want. All the methods like [LoadingManager.onLoad](https://threejs.org/docs/#api/loaders/managers/LoadingManager.onLoad), [LoadingManager.onProgress](https://threejs.org/docs/#api/loaders/managers/LoadingManager.onProgress) and [LoadingManager.onError](https://threejs.org/docs/#api/loaders/managers/LoadingManager.onError) will still work:

{{< highlight js >}}
const loadingManager = new THREE.LoadingManager();
const FBXPromiseLoader = promisifyLoader( new THREE.FBXLoader( loadingManager ) );
{{< /highlight >}}

{:paragraph-notice}
One reason why you may still need to use the loading manager is the [LoadingManager.setURLModifier](https://threejs.org/docs/#api/loaders/managers/LoadingManager.setURLModifier) method, which enables you create file upload interfaces, such as the one in my [loader](/loader/). We'll cover this in more detail in a forthcoming post: URL-transform in three.js loaders.

Now we can load the duck like this:

{{< highlight js >}}
const promiseOfADuck = FBXPromiseLoader.load( 'duck.fbx' ).then( onLoad ).catch( onError );
{{< /highlight >}}

We've also retained a reference to the original loader as `FBXPromiseLoader.originalLoader` which means that you can still access internal methods such as `parse`, `setCrossOrigin` and so on. Whether you need them will largely depend on the loader, although in most cases you won't.

### Polyfilling Promises

Promises are pretty well supported across [all modern browsers](https://caniuse.com/#search=promise). The outlier here, as usual, is Internet Explorer 11 (although whether this should be called a modern browser is debatable). It currently accounts for about 3% of global browser usage, and if you want to support it you will need to include a promise polyfill. I use [ES6-promise](https://www.npmjs.com/package/es6-promise) which only adds about 7kb to a minified build. There are lots of other polyfill out there and they should all work fine so take your pick.

### The Final Result

Finally, here is avery simple example of using the above approach to convert the [GLTFLoader](https://threejs.org/docs/#examples/loaders/GLTFLoader) into a `GLTFPromiseLoader`:

codepen "baaBee"
