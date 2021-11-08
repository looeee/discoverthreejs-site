---
title: 'Asynchronous JavaScript'
description: 'Asynchronous coding means writing code in such a way that our app will keep working while a long task, like loading a model, is running. Here, we cover the different ways we can do this in JavaScript.'
date: 2019-01-01
weight: 9905
chapter: 'A.5'
available: true
showIDE: true
IDEFiles: [
  'worlds/appendix/asynchronous-javascript/src/1-asynchronous-callback.js',
  'worlds/appendix/asynchronous-javascript/src/2-multiple-asynchronous-callbacks.js',
  'worlds/appendix/asynchronous-javascript/src/3-promises.js',
  'worlds/appendix/asynchronous-javascript/src/4-multiple-promises.js',
  'worlds/appendix/asynchronous-javascript/src/5-multiple-promises-handle-error.js',
  'worlds/appendix/asynchronous-javascript/src/6-async-functions.js',
  'worlds/appendix/asynchronous-javascript/src/7-multiple-async-functions.js',
  'worlds/appendix/asynchronous-javascript/index.html',
]
IDEStripDirectory: 'worlds/appendix/asynchronous-javascript/'
IDEClosedFolders: ['styles']
IDEActiveDocument: 'src/6-async-functions.js'
IDESwitchImportsAllow: false
---



# Asynchronous JavaScript

{{< figure src="app-logos/javascript.png" alt="JavaScript logo" lightbox="false" class="tiny left noborder" >}}

Over the last couple of chapters, we've created a bunch of examples. They all have something in common: they are all [synchronous](https://developer.mozilla.org/en-US/docs/Glossary/Synchronous). This means the JavaScript statements are executed line by line, reading from top to bottom:

{{< code lang="js" linenos="true" linenostart="1" caption="Most JavaScript statements are synchronous" >}}
const x = 5; // executed first

const y = 100; // executed second

add(x, y); // executed third
{{< /code >}}



While working with three.js, we'll often load assets such as models, animations, textures, and other media. These files can be stored in many different file formats, and loading them over a slow and unreliable internet connection can take some time, or fail for any number of reasons from whale sharks snacking on undersea cables to a mistyped file name. If we take the obvious approach and run a long task like loading a model in the main thread, our entire page will freeze while we wait for the model to load.

In this chapter, we'll discuss the various methods JavaScript provides for performing long-running tasks such as loading models without causing your app to grind to a halt while the task is running. Collectively, these methods are referred to as **asynchronous programming**.

{{% aside %}}

**As of three.js r116, the new `loader.loadAsync` method is recommended over all the other techniques described here.**

Using [`.loadAsync`](https://threejs.org/docs/#api/en/loaders/Loader.loadAsync) means you no longer need most of the information from this chapter to follow the examples in this book. No more **asynchronous callback functions**, no more converting loaders to use **Promises**, instead, loading a model is now a single line operation:

{{< code lang="js" linenos="false" caption="Using loadAsync, an asynchronous operation can be performed in a single line" >}}
const modelData = loader.loadAsync('yourModel.file');
{{< /code >}}

However, the information here is not specific to three.js so we won't remove the chapter. If you want to skip ahead to the info you absolutely need to use this book, skip to the section on[*async functions**](#async-await). Otherwise, read on.
{{% /aside %}}

Let's look at what happens when we try to load a model synchronously.

{{< code lang="js" linenos="false" caption="Loading a huge model synchronously is a bad idea" >}}
const x = 5;

const y = 100;

const hugeModel = loadModel('path/to/hugeModel.file');

add(x, y);
{{< /code >}}

We're talking about loading things over the internet here. Connections are often slow and unreliable, and loading a model might take a long time or fail completely.

In the above example, the JavaScript engine will reach `loadModel(...)` and then pause until the model has loaded, which might take ten seconds or ten minutes. We'll have to wait until the model has finished loading before the line `add(x, y)` will execute. In practical terms, this means your page will freeze while waiting for the model to load, and while that's happening, your users will have to sit and wait. Or, more likely, they'll go and find a page that loads faster.

Clearly, synchronous code is not suitable for loading things over a network (or anywhere else, for that matter).

Whenever we need to load something, whether it's an image, a video, the response from a form a user has submitted, or a 3D model, we'll switch to an [asynchronous](https://developer.mozilla.org/en-US/docs/Glossary/Asynchronous) code style. There three main ways to perform **asynchronous operations** using JavaScript, and we'll look at each of them in turn here, from the old-school **asynchronous callbacks**, to modern **Promises**, and finally, cutting edge **async functions**.

In this chapter, we'll explore **callback functions**, **Promises**, and **async functions**. While doing so, we'll create imaginary `loadModel` functions in each of the three styles, although in place of displaying an actual 3D model we'll simply log a message to the console.

Loading files is not the only use case for asynchronous code. Whenever you _want_ or _need_ to wait a while before executing some code, you'll switch to an asynchronous code style. When we load a 3D model, we _need_ to wait a while before executing the code to add that model to the scene. Sometimes, you _want_ to wait a while, for example, before displaying a message to a user, in which case, you can use `setTimeout` to create an artificial asynchronous operation.


We've set up a few examples in the IDE in each of these three styles. In all of them (except _**1-synchronous-callback.js**_) we have used `setTimeout` to simulate a model that takes several seconds to load.

### Generating Asynchronous Code with `setTimeout`

To demonstrate asynchronous techniques, we need to perform an asynchronous operation. However, most asynchronous operations are kind of complicated, like loading a model, or submitting a form and waiting for a response from the server.

Fortunately, there's a function that allows us to perform a very simple asynchronous operation, called [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout). This method takes two arguments, a {{< link path="book/appendix/javascript-reference/#callback-functions" title="callback function" >}}, and the amount of time we want to wait (in milliseconds) before executing the callback function.

{{< code lang="js" linenos="false" caption="The setTimeout method allows us to wait for a set amount of time before executing a callback" >}}
onTimeout = () => {
  console.log('The time has passed');
}

// wait 3000 milliseconds (3 seconds), then execute the callback
setTimeout(onTimeout, 3000);
{{< /code >}}

Note that we'll usually wrap the callback in an anonymous {{< link path="book/appendix/javascript-reference/#arrow-functions" title="arrow function" >}}:

{{< code lang="js" linenos="false" caption="It's often required to wrap the setTimeout callback in an anonymous function" >}}
onTimeout = () => {
  console.log('The time has passed');
}

// wait 3000 milliseconds (3 seconds), then execute the callback
setTimeout(() => {
  onTimeout();
}, 3000);
{{< /code >}}

We won't get into the reasons for this here. It's all about {{< link path="book/appendix/javascript-reference/#scope-and-closures" title="scope" >}} and [the "this" problem](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#The_this_problem). In any case, you'll notice we do this a lot when using callback functions.

One final thing about `setTimeout`: it's not accurate. We have passed in 3000 milliseconds to the method above, but we cannot guarantee that exactly 3000 milliseconds will have passed by the time the callback executes. There are two reasons for this.

1. The callback we pass to `setTimeout` gets added to a stack of callbacks that need to be executed. If lots of callbacks pile up on the stack, you'll need to wait until yours gets executed. That can be a few milliseconds later than the time you specified.
2. Browsers currently reduce the accuracy of their timers to prevent malicious scripts from using [**time-based attacks**](https://en.wikipedia.org/wiki/Timing_attack) or [**browser fingerprinting**](https://pixelprivacy.com/resources/browser-fingerprinting/). For security, browsers don't let us measure sub-millisecond time, and a certain amount of jitter is added to the result (usually around one millisecond).

For these reasons, `setTimeout` (along with all JavaScript timer functions) is not accurate enough for things like scheduling animation frames. However, it's perfect for us to simulate a slow model loading since we don't care when the callback executes.

The callback we pass into `setTimeout` is an **asynchronous callback function**, the first of the three asynchronous techniques we'll cover in this chapter.

{{% aside  %}}

## Real World Asynchronous File Loading

Using `setTimeout` allows us to skip over all the annoying technical details of loading 3D models. But how does loading a file from a web server work in the real world?

There are two main Web APIs used to load files from servers: the old-school [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and the modern [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

`XMLHttpRequest` works via callbacks and is notorious for two things:

1. It's tedious to set up and use.
2. It's badly named (no one _ever_ uses it to load XML files).

The three.js loaders are currently implemented using [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest). Fortunately, they hide all the complexity from us.

The newer `Fetch` API uses Promises rather than callbacks and has a much-improved syntax. Whenever possible, you should choose `Fetch` instead of `XMLHttpRequest` for loading files from a web server.

{{% /aside %}}

## Asynchronous Callback Functions

A [callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) is a function that gets passed into another function as an argument. When the parent function is asynchronous, we refer to the callback as an **asynchronous callback function**.

In {{< link path="book/appendix/javascript-reference/#old-school-and-modern-javascript" title="old-school JavaScript" >}}, before the release of version ES6 sometime around 2015, the _only_ way to write asynchronous code in JavaScript was to use asynchronous callback functions. These are the simplest way of writing asynchronous code, although they do have some drawbacks which mean that we'll prefer to use other techniques.

We introduced callback functions back in {{< link path="/book/appendix/javascript-reference/#callback-functions" title="" >}}, however, aside from the ones we passed into `setTimeout` above, all the callbacks we have written so far are synchronous.

There's nothing different about the callback we passed into `setTimeout`. The only difference between a synchronous callback and an asynchronous callback is the context in which we use it. For example, we introduced callbacks using the {{< link path="book/appendix/javascript-reference/#foreach" title="`array.forEach` method" >}}. We can pass the same callback into `.forEach` and `setTimeout`. In the first case, the callback is synchronous, and in the second, it is asynchronous.

{{< code lang="js" linenos="false" caption="The same callback can be both synchronous and asynchronous" >}}
function callbackTest() {
  console.log('Callback executed');
}

const array = [1, 2, 3, 4];

array.forEach(callbackTest); // => 'Callback executed' (four times, synchronously)

setTimeout(callbackTest, 3000); // => 'Callback executed' (after 3000ms, asynchronously)
{{< /code >}}

What's the difference? Without going into much detail, the synchronous callback function is executed immediately and blocks the main thread. This can cause your application to freeze if it takes a long time to complete. By comparison, the asynchronous callback function is put onto something called a task queue which does not block the main thread. However, the callback must wait for its turn in the queue before being executed.

### A Synchronous Callback Operation

Rather than use `Array.forEach`, we can create a simple synchronous function that takes a callback.

{{< code lang="js" linenos="false" caption="A simple function that takes a callback and immediately executes it" >}}
function synchronousCallbackOperation(callback) {
  callback('Data passed to callback');
}

const onComplete = (result) => {
  console.log(result);
};

synchronousCallbackOperation(onComplete);
{{< /code >}}

There's no waiting involved here, the `synchronousCallbackOperation` function executes the `onComplete` callback immediately. The important thing to note here is the data passed to the callback by the parent function. Here, it's the string `'Data passed to callback'`. In a real example, this might be a loaded model or the data returned by the server after the user submits a form.

### An Asynchronous Callback Operation

We'll take the `synchronousCallbackOperation` and combine it with `setTimeout` to turn it into an asynchronous `loadModelUsingCallback` function.

{{< code lang="js" linenos="false" caption="A simple function that takes a callback, waits a while, then executes it" >}}
function asynchronousCallbackOperation(callback) {
  setTimeout(() => {
    callback('Data passed to callback');
  }, 3000);
}

const onComplete = (result) => {
  console.log(result);
};

asynchronousCallbackOperation(onComplete);
{{< /code >}}

Next, we'll take this and turn it into a fake `loadModelUsingCallback` function. Along with the name change, the function now takes an `url` argument, and we have renamed the callback to `onLoad`.

{{< code from="1" to="11" file="worlds/appendix/asynchronous-javascript/src/1-asynchronous-callback.js" lang="js" linenos="true" caption="1-asynchronous-callback.js" >}}{{< /code >}}

### Error Handling with Callbacks

What happens if loading the model fails? There are lots of reasons why a model might fail to load. For example, you might have typed the model's name wrong. Or a whale shark might decide to snack on an undersea cable at that exact moment.

To handle errors like these, we need to add a second callback to our `loadModelUsingCallback` function.

Then we'll have two callbacks: one for success which we'll call `onLoad`, and one for failure which we'll call `onError`.

At this point, using `setTimeout` to simulate loading a model falls short since there's no way for this method to fail, or to take a second callback. But here's what a `loadModel` function with both callbacks would look like:

{{< code lang="js" linenos="false" caption="Asynchronous error handling with callbacks" >}}
// This callback will be executed if loading succeeds
const onLoad = result => {
  addModelToScene(result);
};

// This callback will be executed if loading fails
const onError = error => {
  console.error(error);
};

loadModelUsingCallback('path/to/model.file', onLoad, onError);
{{< /code >}}

We have named the callbacks `onLoad` and `onError`, but you can call them whatever you like.

_Note: the three.js loaders also take an `onProgress` callback which we have skipped here to keep things simple._

### Performing Multiple Asynchronous Operations with Callbacks

When using callbacks, loading multiple models is easy. We simply need to run the `loadModelUsingCallback` function multiple times with different `url` arguments (and perhaps different callbacks).

To add a bit of spice here, for this example, we're using {{< link path="book/appendix/javascript-reference/#the-math-object" title="`Math.random`" >}} to add a bit of chaos to our fake model loading function. Now, every model will load in somewhere between zero and five seconds.

Which model will load first? A, B, C, or D?

{{< code from="1" to="16" file="worlds/appendix/asynchronous-javascript/src/2-multiple-asynchronous-callbacks.js" lang="js" linenos="true" caption="2-multiple-asynchronous-callbacks.js" >}}{{< /code >}}

The answer, of course, is that we have no idea.

When you load a model asynchronously, you no longer have any idea when, if at all, the model will load. This point holds for any asynchronous technique, not just callbacks. It's kind of the whole point of asynchronous code.

When we load multiple models, we have no idea which one will load first, or whether they will all load successfully. In this example, we've set a random time between zero and five seconds for each callback to complete. In the real world, the models might be different sizes, or even located on different servers in different countries. The server in one country might be down (whale sharks again). A 1kb model will probably load faster than a 100mb model even if we start loading the 100mb model first, but you can never be totally sure about that.

**The only safe approach: never make any assumptions about when, or if, a block of asynchronous code will run.**

## Problems with Callbacks

It's not obvious from these simple examples, but callbacks can become unpleasant to deal with once your app grows in size.

### The `onLoad` Callback Ends up Stuffed with Functionality

Here's the first problem: **You cannot easily access the loaded model from _outside_ the callback.** Everything that you want to do with the model has to be done _inside the callback_. That's fine if you simply want to log some data to the console or add the model to your scene, but in the real world, you'll probably want to so much more than that.

{{< code lang="js" linenos="false" caption="Accessing the model from outside the callback is hard" >}}
const onLoad = model => {
  // If we simply add the model to the scene
  // it's not a big deal.
  addModelToScene(model);

  // ... but what if we want to do more than that?
  setupControls(model);
  setupPhysics(model);
  adjustMaterials(model);
  adjustGeometry(model);
  // ... and so on.
};

loadModelUsingCallback('path/to/model.file', onLoad);
{{< /code >}}

If you are not careful, `onLoad` can end up containing almost your entire app.

### It's Hard for Loaded Models to Interact with Each Other

Next, what if you want two or more models to interact with each other in some way? This is a problem, because the other models can only be accessed (easily) from _their_ callback functions.

Suppose models A and B need to interact with each other inside a `setupPhysics` function. Where should we put that when loading the models using callbacks?

{{< code lang="js" linenos="false" caption="With callbacks, it's hard for multiple models to interact with each other" >}}
const onLoadModelA = model => {
  addModelToScene(model);
};

const onLoadModelB = model => {
  addModelToScene(model);
};

loadModelUsingCallback('path/to/modelA.file', onLoadModelA);
loadModelUsingCallback('path/to/modelB.file', onLoadModelB);
{{< /code >}}

You can't put it in model A's callback because we don't know if model B has loaded yet. You can't put it in model B's callback because we don't know if model A has loaded yet.

Of course, there are ways around these problems. You can build a complex system that collates the loaded data, keeps it in a central structure somewhere, then, once everything has finished loading, sets up the rest of your app. Sounds complicated though. While callbacks themselves are simple, using them usually means offloading the complexity to another part of your code.

There are other problems with callbacks besides these. We haven't even touched on **callback hell**, a problem so notorious [it has a website!](https://callbackhell.com/)

### Inversion of Control (IoC)

These issues stem from the fact that callbacks force us to use a programming pattern called [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control), so-called because we have passed control from our `loadModel` function into the callback function.

Inversion of control is not inherently a bad thing. The problem is being forced into this design choice when in many cases a different design would be better. Callbacks are relatively easy to understand, and for simple applications this way of writing asynchronous code is fine. However, as your app grows in size being forced to design your code around an IoC pattern becomes more and more stifling.

### The Perfect Solution

The "perfect" solution would be a `loadModel` function that directly _returns_ the loaded model for us to use.

{{< code lang="js" linenos="false" >}}
const model = loadModel('path/to/model.file');
{{< /code >}}

An asynchronous function like this would afford us complete freedom to design our app however we like.

{{< code lang="js" linenos="false" caption="A hypothetical perfect solution to loading a model" >}}
const model = loadModel('path/to/model.file');

addModelToScene(model);
setupControls(model);
setupPhysics(model);
adjustMaterials(model);
adjustGeometry(model);
{{< /code >}}

No inversion of control, `loadModel` is simply a normal function that returns a value. This code would shine when multiple models need to interact:

{{< code lang="js" linenos="false" caption="A hypothetical perfect solution to loading multiple models" >}}
const parrot = loadModel('path/to/parrotModel.file');
const rabbit = loadModel('path/to/rabbitModel.file');
const horse = loadModel('path/to/horseModel.file');

addModelsToScene(parrot, rabbit, horse);
setupPhysics(parrot, rabbit, horse);
{{< /code >}}

Well, that is how _using_ the function would work. Unfortunately, we have to _implement_ the function to use it, and there we run into trouble. This perfect function is not possible, in general. The three.js `TextureLoader` does work this way, since it returns a dummy texture for us to use while the real texture is loading.

{{< code lang="js" linenos="" linenostart="0" caption="The TextureLoader returns a dummy texture that we can use immediately" >}}
import { TextureLoader } from 'three';

const loader = new TextureLoader();

const texture = loader.load('kittens.png');
{{< /code >}}

However, this is a special case. Textures are simple image files, but most things we want to load are too complicated to use this approach. In other words, we know what's in an image before we load it (colored pixels), but we don't know what is going to be in most other files so we have to wait until they are loaded before can process them.

In general, we'll never reach this level of beauty and simplicity while asynchronously loading files, but we can get close.

First, **Promises** will enable us to get out of the IoC pattern, but we'll still need to use callbacks. Next, **async function** will take us the rest of the way. Our code will end up looking _almost_ like the "perfect" solution, except there will be a few `async` and `await` keywords in the mix. Async functions are built on top of promises but have a much nicer API.

> As of r116 three.js ships with the [`.loadAsync`](https://threejs.org/docs/#api/en/loaders/Loader.loadAsync) method that allows us to use [async functions](#async-await) directly.

Before we get to those, we'll continue our exploration of JavaScript's asynchronous toolkit with Promises.

## Promises

[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) are the second asynchronous technique we'll explore in this chapter. They were added to JavaScript in version ES6. We can create a `promise` (small p) using `new Promise` (capital P).

{{< code lang="js" linenos="false" >}}
const promise = new Promise(executorCallback);
{{< /code >}}

Promises are so-called because when we place a Promise in our code, we are promising we'll get the result of an asynchronous operation back at some point. The result will be either _success_ or _failure_.

In this section of this chapter of this book, we'll cover everything you need to know to get started with promises, and also to follow the examples in the book, but this is not a complete promise reference. In the interest of brevity, and of keeping _you_ interested while we cover all this dry theory, we'll skip quite a few features of promises.

Promises don't remove callbacks from our code. On the contrary, using promises requires a whole bunch of callbacks. It's also fair to say that promises are harder to understand than asynchronous callbacks, so you may find yourself wondering what the big deal is. After all, if the code we write is harder to understand _and_ still uses callbacks, we haven't solved anything, right?

It's hard to get across just why promises are such an improvement using simple examples like the ones in this chapter. However, once you start using them, their value will become apparent. Also, the biggest advantage of Promises is that they enable us to use [async functions](#async-await), the holy grail of asynchronous JavaScript techniques.

### Pending, Fulfilled, Rejected, Settled

Promises are always in one of three _states_:

1. **Pending**: When we create a `new Promise` (or get a promise back from an API like fetch), it is in _pending state_, and it will remain there until the asynchronous operation has succeeded or failed.
2. **Fulfilled**: If the asynchronous operation completes successfully, the promise will move into _fulfilled state_.
3. **Rejected**: If the asynchronous operation fails, the promise will move into _rejected state_.

Another possibility is that the asynchronous operation _never_ completes, in which case the promise will remain in pending state forever, or at least until you refresh the page. In other words, promises don't have a time limit on how long the operation can take.

There's a fourth state as well, called **settled**. This means _either_ fulfilled or rejected, and we can check for settled state when we want to know if the asynchronous operation has completed and we don't care if it was successful or not.

### Promise Based APIs

Usually, you don't need to create promises yourself, or in other words, you'll rarely need to type `new Promise`. Instead, you'll use promise-based APIs that create promises for you.

For example, here's how we can use [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to load a file from a web server:

{{< code lang="js" linenos="false" caption="Loading a file from the server using Fetch returns a promise" >}}
const filePromise = fetch('path/to/file.json');
{{< /code >}}

`fetch` returns a promise instance which we have called `filePromise`. Later, if loading the file succeeds, the promise will return any data contained in the file for us to process, and if loading fails, the promise will return an error object with details about the cause of the error.

For more information on how to use the Fetch API, check out the [using Fetch page](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) on MDN.

In this section, we'll look at how to use a generic promise created using `new Promise`, but the theory we cover here applies to any promise-based API.

### Using Promises

Here's a complete example of a promise in action:

{{< code lang="js" linenos="false" caption="Using a promise requires five callbacks" >}}
const executorCallback = (resolve, reject) => {
  resolve('Promise succeeded');
  reject('Promise failed');
}

const promise = new Promise(executorCallback);

// if the asynchronous operation succeeds, .then will run,
// and
promise
  .then((result) => {
    console.log(result); // => 'Promise succeeded'
  })
  .catch((err) => {
    console.error(error); // => 'Promise failed'
  });
{{< /code >}}

There's a lot to unpack here. There are three named callbacks: `executorCallback`, `resolve`, and `reject`, and then there's `.then` and `.catch`, each of which takes an anonymous callback of their own. That's five callbacks! Let's go over everything now, and hopefully, it will become more manageable.

_Note: the above promise will immediately execute `resolve('Promise succeeded')` and will never reach `reject('Promise failed')`. We've included both callbacks for illustration purposes._

_Second note: for many people, it takes a while to get a deep understanding of promises. However, **using** promises is much easier than **understanding** promises, so if you find yourself struggling with all the callbacks, focus on using promises for now. A deeper understanding will come later._

### The Executor Callback

The first callback we encounter when using promises is the **executor callback**.

{{< code lang="js" linenos="false" caption="The executor callback" >}}
const executorCallback = (resolve, reject) => {
  resolve('Promise succeeded');
  reject('Promise failed');
};

const promise = new Promise(executorCallback);
{{< /code >}}

You'll never see `executorCallback` explicitly typed out (except in a book). Instead, we'll write the executor callback inline.

{{< code lang="js" linenos="false" caption="The executor callback is always written inline" >}}
const promise = new Promise((resolve, reject) => {
  resolve('Promise succeeded');
  reject('Promise failed');
});
{{< /code >}}

### The `resolve` and `reject` Callbacks

The executor callback _itself_ takes two callbacks, called `resolve` and `reject`. If the promise succeeds, it will call `resolve`, and if it fails it will call `reject`. We don't need to write the `resolve` and `reject` callbacks ourselves, we simply pass them into the executor callback as arguments.

In other words, you will never do this:

{{< code lang="js" linenos="false" caption="Not required: resolve and reject are defined within the JavaScript engine" >}}
const resolve = (value) => {
  ...
}

const resolve = (err) => {
  ...
}
{{< /code >}}

#### Getting Data Back from a Promise: `resolve`

If the asynchronous operation succeeds, we use `resolve` to get any data from the operation out of the promise. For example, if we are loading a 3D model, then we'll call `resolve(loadedModelData)`. In this chapter, we'll return the string `'Promise succeeded'` in place of real data.

#### Return a Useful Error Message on Failure: `reject`

If the asynchronous operation fails, we use `reject` to get information about _why_ it failed.

Once again, we are using a string `'Promise failed'` as a placeholder, but in a real application, you'll probably get back an object with lots of info. For example, when using Fetch to load files from a web server, errors have codes like 404 (file not found), and 403 (access forbidden). You can use this data to create a helpful message for your users or otherwise handle the error.

### Handling a Successful Operation: `Promise.then`

If the asynchronous operation _succeeds_, the promise's state will move from _pending_ to _fulfilled_, and the `resolve` callback will be executed, sending any data into the [`Promise.then`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) callback.

In this example, that means `resolve('Promise succeeded')` will execute and `.then` will receive the string `'Promise succeeded'`. Here, we simply log that to the console. In a real app, we might add a loaded model to the scene, or do something with a file returned by `Fetch`.

{{< code lang="js" linenos="false" caption="Any data returned by a successful operation is passed into .then for us to process" >}}
promise
  .then((result) => {
    console.log(result); // => 'Promise succeeded'
  });
{{< /code >}}

The `.then` callback is equivalent to the `onLoad` callback from our earlier [asynchronous callback example](#an-asynchronous-callback-operation).

### Error Handling with `Promise.catch`

If the asynchronous operation _fails_, the promise's state will move from _pending_ to _rejected_, and the `reject` callback will be executed, sending any data into the [`Promise.catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) callback.

{{< code lang="js" linenos="false" caption="Any data returned by a failed operation is passed into .catch for us to process" >}}
promise
  .then((result) => {
    console.log(result); // => 'Promise succeeded'
  })
  .catch((error) => {
    console.error(error); // => 'Promise failed'
  });
{{< /code >}}


The `.catch` callback is equivalent to our [`onError` callback](#an-asynchronous-callback-operation) from earlier.

We can test `.catch` by making the promise fail immediately. To do that, comment out `resolve` in the above example.

{{< code lang="js" linenos="false" caption="A promise that rejects immediately" >}}
const promise = new Promise((resolve, reject) => {
  // resolve('Promise succeeded');
  reject('Promise failed'); // reject immediately
});
{{< /code >}}

#### Error Handling with `.then`

Rather than use `.catch`, we can pass both callbacks into `.then`:

{{< code lang="js" linenos="false" caption=".then can take two callbacks" >}}
promise.then(
  // onSuccess callback
  (result) => {
    console.log(result);
  },
  // onError callback
  (error) => {
    console.error(error);
  },
)
{{< /code >}}

However, using `.catch` results in cleaner code and we'll always prefer to use that rather than passing two callbacks into `.then`.

### Code that Needs to Run on Success or Failure: `Promise.finally`

If `.then` handles success, and `.catch` handles failure, what about code that needs to run in either case? For this case, there's a third method called [`Promise.finally`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally):

{{< code lang="js" linenos="false" caption=".finally runs once the promise has settled" >}}
promise
  .then((result) => {
    console.log(result); // => 'Promise succeeded'
  })
  .catch((error) => {
    console.error(error); // => 'Promise failed'
  })
  .finally(() => {
    console.log('Promise settled');
  });
{{< /code >}}

`.finally` will run when the promise reaches a settled state, meaning either resolved or rejected.

### Promises are Always Asynchronous

The promise example we have created is _nearly_ equivalent to the [synchronous callback operation](#a-synchronous-callback-operation) from earlier in the chapter.

{{< code lang="js" linenos="false" caption="A synchronous callback operation" >}}
function synchronousCallbackOperation(callback) {
  callback('Synchronous callback function executed');
}

synchronousCallbackOperation(result => {
  console.log(result);
});
{{< /code >}}

... is nearly equivalent to:

{{< code lang="js" linenos="false" caption="A simple promise example" >}}
const promise = new Promise((resolve, reject) => {
  resolve('Promise succeeded'); // => resolve immediately
});

promise
  .then((result) => {
    console.log(result); // => 'Promise succeeded'
  });
{{< /code >}}

However, there are differences. Promises are always asynchronous, so the above code is closer (but still has important differences) to this:

{{< code lang="js" linenos="false" caption="setTimeout with a delay of zero milliseconds" >}}
function asynchronousCallbackOperation(callback) {
  setTimeout(() => {
    callback('Data passed to callback');
  }, 0);
}

asynchronousCallbackOperation((result) => {
  console.log(result);
});
{{< /code >}}

If you test these two example, `promise` and `asynchronousCallbackOperation`, you'll find that `setTimeout` with a time of zero executes _after_ the promise resolves, even if we call `setTimeout` first. What's going on?

`setTimeout` with a time of zero schedules the callback to be executed immediately. This means the callback gets pushed onto the task queue. There may be other tasks already on the queue, so the callback has to wait for its turn to be executed.

When we create a promise and then call `resolve` immediately, `resolve` is pushed onto a different queue called the [microtask queue](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide). The microtask queue has a higher priority than the standard task queue, so the promise will resolve faster than the `setTimeout` callback.

If you want to go deeper into this, see [concurrency model and the event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop#Zero_delays) on MDN, as well as [this Stackoverflow post on `setTimeout(fn,0)`](https://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful) and [this Stackoverflow post on Promise vs `setTimeout`](https://stackoverflow.com/questions/38752620/promise-vs-settimeout).

### Loading a File with the Fetch API Using Promises

As a practical example, let's take a look at how to load a JSON file using the Fetch API.

{{< code lang="js" linenos="false" caption="Loading a JSON file with Fetch" >}}
const filePromise = fetch('path/to/file.json');

filePromise
  .then(fileData => {
    console.log(fileData);
  })
  .catch(error => {
    console.error(error);
  });
{{< /code >}}

There's usually no need to save the promise to a variable, so we can write this even more succinctly:

{{< code lang="js" linenos="false" >}}
fetch('path/to/file.json')
  .then(fileData => {
    console.log(fileData);
  })
  .catch(error => {
    console.error(error);
  });
{{< /code >}}

As you can see, using promises results in clear and simple code. We'll spare you the horror of the equivalent using `XMLHttpRequest`!

### Implementing `loadModel` Using Promises

Recall our [callback-based model loading function](#an-asynchronous-callback-operation) from earlier in the chapter:

{{< code from="1" to="7" file="worlds/appendix/asynchronous-javascript/src/1-asynchronous-callback.js" lang="js" linenos="true" caption="1-asynchronous-callback.js: a callback-based load model function" >}}{{< /code >}}

Let's rewrite this using Promises.

{{< code from="1" to="9" file="worlds/appendix/asynchronous-javascript/src/3-promises.js" lang="js" linenos="true" caption="3-promises.js: a Promise based load model function" >}}{{< /code >}}

It's quite similar. We're still using `setTimeout` to simulate loading a model (this time, one that loads in 4000 milliseconds). The important difference is that **the `loadModelUsingPromise` function returns a Promise**. Let's see the two versions in action. First, we'll load a (fake) URL using `loadModelUsingCallback`:

{{< code from="9" to="11"  hl_lines="1" file="worlds/appendix/asynchronous-javascript/src/1-asynchronous-callback.js" lang="js" linenos="true" caption="1-asynchronous-callback.js: loadModelUsingCallback in action" >}}{{< /code >}}

Next, we'll do the same with `loadModelUsingPromise`:

{{< code from="11" to="17" file="worlds/appendix/asynchronous-javascript/src/3-promises.js" lang="js" linenos="true" caption="3-promises.js: loadModelUsingPromise in action" >}}{{< /code >}}

This latter example is a bit longer since it includes the `.catch` method to handle errors.

### Loading Multiple Files with Promises, a First Attempt

Looking at those two examples, there's no obvious benefit to the version using a promise. Earlier, we claimed that promises shine when it comes to loading multiple models, so let's try doing that.

Once again, let's start with our [multiple callbacks example](#performing-multiple-asynchronous-operations-with-callbacks) from earlier:

{{< code from="9" to="16" file="worlds/appendix/asynchronous-javascript/src/2-multiple-asynchronous-callbacks.js" lang="js" linenos="true" caption="2-multiple-asynchronous-callbacks.js: loading multiple models with loadModelUsingCallback" >}}{{< /code >}}

Next, let's try the obvious approach to loading model with `loadModelUsingPromise`.

{{< code lang="js" linenos="false" caption="loading multiple models with loadModelUsingPromise, the obvious approach" >}}
const onResolve = (result) => {
  console.log(result);
};

const onReject = (error) => {
  console.error(error);
};


loadModelUsingPromise('promise_A.file')
  .then(onResolve)
  .catch(onReject);

loadModelUsingPromise('promise_B.file')
  .then(onResolve)
  .catch(onReject);

loadModelUsingPromise('promise_C.file')
  .then(onResolve)
  .catch(onReject);

loadModelUsingPromise('promise_D.file')
  .then(onResolve)
  .catch(onReject);
{{< /code >}}

One of the major problems with callbacks is that it's hard for the loaded models to interact with each other. Earlier, we claimed that promises would help with this. Here's the `setupPhysics` method we struggled with earlier:

{{< code lang="js" linenos="false" caption="As we saw, it can be hard to get loaded models to interact with each other" >}}
setupPhysics(modelA, modelB, modelC, modelD);
{{< /code >}}

It doesn't seem like we have improved anything here. There's still nowhere for us to put the `setupPhysics` function and give it access to all the loaded models. Each model is still being handled in a separate callback, so it doesn't look like we have solved anything. There is no obvious advantage at all here, we've simply renamed `onLoad` to `onResolve`.

Fortunately, promises give us more options when it comes to handling asynchronously loading files. Let's try out one called `Promise.all`.

### Loading Multiple Files with `Promise.all`

[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) allows us to handle multiple loading operations gracefully. Using this method, we even get the results of our operations back in the same order we started them (**deterministic ordering**), which is kind of a big deal when it comes to asynchronous operations.

`Promise.all` takes an array of promises and returns a single promise that will resolve when _all_ the promises are resolved, or reject when _one or more_ of the promises are rejected.

{{< code lang="js" linenos="false" caption="Promise.all takes an array of promises and returns a promise" >}}
Promise.all([
  promiseA,
  promiseB,
  promiseC,
  // ... and so on
  promiseZ,
]).then((allResults) => {
  console.log(allResults);
});
{{< /code >}}

The `allResults` argument is an array containing all of the loaded models, so **we can process them all at once in a single callback**.

We can use the fact that `allResults` returns the results in the same order as we loaded them, along with [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), to write very succinct code here.

{{< code from="11" to="23" file="worlds/appendix/asynchronous-javascript/src/4-multiple-promises.js" lang="js" linenos="true" caption="4-multiple-promises.js: loading multiple models using Promise.all" >}}{{< /code >}}

Finally, we have reached the point where all of the loaded models are in one place, and we have somewhere to put the `setupPhysics` method:

{{< code lang="js" linenos="false" caption="Finally, we can easily make the loaded models interact" >}}
Promise.all([
  // ...
]).then((results) => {
  const [modelA, modelB, modelC, modelD] = results;
  setupPhysics(modelA, modelB, modelC, modelD);
});
{{< /code >}}

### Error Handling with `Promise.all`

No asynchronous operation is complete unless it can handle errors, so let's make one of our promises fail. We'll add a second fake model loading function, but this time have it immediately reject.

{{< code from="1" to="33" file="worlds/appendix/asynchronous-javascript/src/5-multiple-promises-handle-error.js" lang="js" linenos="true" caption="5-multiple-promises-handle-error.js: error handling with Promise.all" >}}{{< /code >}}

Now model C will immediately reject. Just like when loading a single model, we can use `.catch` to handle the error.

Note that `Promise.all` will reject if _one or more_ of the promises rejects. In other words, if even one model fails to load none of the models will be returned.

We could use [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) to get data for successful models even when some fail to load. At the time of writing this chapter (July 2020), browser support for `.allSettled` is not great, so we will avoid using it in this book. Here, to keep things simple, we'll accept this limitation and continue to use `Promise.all`. After all, if any of your models fail to load it usually means there's a problem that needs to be fixed.

{{% note %}}
### Promise Chaining

No description of promises would be complete without mentioned chaining, which works the same way as it does when {{< link path="book/appendix/javascript-reference/#chaining-methods" title="chaining class methods" >}}.

Most promise methods return a new promise, so we can create a chain of asynchronous operations.

{{% /note %}}

## Async Functions {#async-await}

Earlier we tried to imagine [how the best possible version of a `loadModel` function would work](#the-perfect-solution), and came up with this:

{{< code lang="js" linenos="false" caption="A hypothetical 'perfect' model loading function" >}}
const modelData = loadModel('path/to/model.file');
{{< /code >}}

This is the "perfect" solution to the problem of loading a model or other data over a slow network such as the internet, but as we noted earlier, aside from some special cases, such a `loadModel` function is impossible to implement.

However, [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) get us very close. These are also the newest way of performing asynchronous operations, having been added to JavaScript only recently. Async functions are based on promises, so it will help if you have a basic understanding of those before you start to use async functions.

### `Loader.loadAsync`

Until recently, using async functions in three.js was difficult. Fortunately, as of r116 there is a new [`Loader.loadAsync` method](https://threejs.org/docs/#api/en/loaders/Loader.loadAsync) that allows us to use them immediately.

### The `await` Keyword

**Async functions introduce two new keywords: `async`, which we'll explain in a moment, and [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await), which we use to tell our program to wait for the result of an asynchronous operation.**

Using `await`, loading a model becomes as simple as this:

{{< code lang="js" linenos="false" caption="The await keyword tells JavaScript to wait for the result" >}}
const result = await loadModelAsync('path/to/model.file');
{{< /code >}}

Not a callback in sight!

**When an `await` is encountered, the JavaScript engine will stop executing the current function until the asynchronous operation has completed. However, the rest of your application will continue to run as normal.**

### The `async` Keyword

To use `await`, we need to mark the containing function as `async`. `await` can only be used inside an `async` function. Attempting to use it elsewhere will result in an error. Here, that means we need to create a new function to handle loading the model.

{{< code lang="js" linenos="false" caption="await must be used inside an async function" >}}
async function main() {
 const result = await loadModelAsync('path/to/model.file');
}

main();
{{< /code >}}

In a real app (a well designed one, at least), you would already have a special function or class method for this purpose, so this shouldn't disrupt the design of your code too badly.

### Implementing `loadModel` with Async Functions

As we mentioned earlier, async functions are implemented using [Promises](#promises). This means a `loadModelAsync` function looks exactly like the [`loadModelUsingPromise` function](#implementing-our-loadmodel-function-using-promises) we created earlier.

{{< code from="1" to="9" file="worlds/appendix/asynchronous-javascript/src/6-async-functions.js" lang="js" linenos="true" caption="6-async-functions.js: Async functions use Promises under the hood" >}}{{< /code >}}

However, now we'll use it like this:

{{< code lang="js" linenos="false" caption="6-async-functions.js: loading a model with async/await" >}}
async function main() {
 const result = await loadModelUsingPromise('path/to/model.file');

 console.log(result);
}

main();
{{< /code >}}

... AND THAT'S IT!!!

Sorry for shouting, it's just such a relief after dealing with all the callbacks from the last few sections. No callbacks!

### Loading a File using Fetch, `async`/`await` Version

OK, there are still some callbacks in the `loadModelUsingPromise` function. However, normally you wouldn't write that function yourself. It's more common to use a promise based loader that someone else wrote such as the three.js loaders or the Fetch API.

As a real world example, see how easy it is to load a file using the Fetch API and `async`/`await`:

{{< code lang="js" linenos="false" caption="Fetch with async/await" >}}
async function main() {
  const result = await fetch('path/to/file.json');

  console.log(result)
}

main();
{{< /code >}}

Now that's some succinct, beautiful code.

If you are familiar with Fetch, at this point you may be saying "_yes, but you also need to decode the file before you can read it, which is a second asynchronous operation_". Fair point. Here's how to load _and_ decode a JSON file using async functions:

{{< code lang="js" linenos="false" caption="Loading and decoding a JSON file can be accomplished in a single line with async/await" >}}
async function main() {
  const decodedJSON = await (await fetch('path/to/file.json')).toJSON();
}

main();
{{< /code >}}

Not one, but _two_ asynchronous operations in a single line of code, and it's still (fairly) readable. If you've spent years working with JavaScript callbacks, this will feel like magic.

### Error Handling with Async Functions and `.catch`

To test error handling, once again, [we'll make `loadModelUsingPromise` fail](#error-handling-with-promise-all):

{{< code lang="js" linenos="false" caption="6-async-functions.js: change the function so that it rejects immediately" >}}
function loadModelUsingPromiseFAIL(url) {
  return new Promise((resolve, reject) => {
    reject('`Model ${url} failed to load!`')
  });
}
{{< /code >}}

Currently, our code does nothing to handle errors, so when we load the model as before:

{{< code lang="js" linenos="false" caption="6-async-functions.js: our code does not handle errors" >}}
async function main() {
  const model = await loadModelUsingPromiseFAIL('path/to/model.file');

  scene.add(model);
}

main();
{{< /code >}}

... we'll get an ugly red error message in the console:

{{< code lang="null" linenos="false" caption="Chrome message for unhandled error in a Promise" >}}
Uncaught (in promise) Model async_test.file Failed!
{{< /code >}}

There are a few methods we could use to handle errors with `async`/`await`. For example, we could use a [`try...catch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch). In the interest of keeping this chapter short and [since we covered these already](#handling-errors-the-promise-catch-method), we'll use `.catch`.

`.catch` works a little differently with async functions than with Promises. Previously, we attached `.catch` directly to the promise. Here, **we'll attach `.catch` to the asynchronous function**:

{{< code lang="js" linenos="false" caption="Handling errors using .catch, async/await version" >}}
async function main() {
  const model = await loadModelUsingPromise('path/to/model.file');

  scene.add(model);
}

main().catch(err => {
  console.error(error);
});
{{< /code >}}

By the way, if you're thinking this must mean you can use [`.then`](#handling-a-successful-operation-promise-then) and [`.finally`](#code-that-needs-to-run-on-success-or-failure-promise-finally) with async functions, you would be right! `.then` will be passed the return value (if any) from the async function, while `.finally` runs after all operations have completed, as before.

### Be Careful Where You Place the `await` Call

The power of async functions lie in the `await` keyword, and the fact that promises are objects which we can pass around.

This means that we can start an asynchronous operation early and store the promise.

{{< code lang="js" linenos="false" caption="We can start loading early, set up the rest of the app, and finally await for the model" >}}
async function main() {
  // start loading the model (notice there's no "await")
  const pigPromise = modelPromise('model/pig.glb');

  // set up the app while the model is loading
  setupCamera();
  setupRenderer();
  setupControls();
  // etc.

  // finally, wait for the model to finish loading
  const pigModel = await pigPromise;

  // then add it to the scene
  scene.add(pigModel);
}
{{< /code >}}

This is a slightly contrived example since it's unlikely setting up the scene, camera, and renderer will take long enough for this to make any difference. However, the power of `await` will start to shine once you are dealing with a large application with many asynchronous components.

The point being made here is that async functions give us full control over the asynchronous sections of our code. Some of this is simply the result of cleaner and more readable code, but async functions also allow us to structure our code in a way that would simply not be possible with callbacks and `Promises` alone.

### Loading Multiple Files with Async Functions, First Attempt

_In this section, we're using [`console.time` and `console.timeEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Console/time), which time how long code in between those two statements takes to run._

Loading a single model is easy, but what happens when we try to load several at once?

Once again, we'll use the `loadModelUsingPromise`, this time set to resolve in exactly five seconds.

{{< code from="1" to="9" file="worlds/appendix/asynchronous-javascript/src/6-async-functions.js" lang="js" linenos="true" caption="loadModelUsingPromise set to load in exactly 5 seconds" >}}{{< /code >}}

Before we proceed, a quick math quiz: **if we load four models, and each model takes five seconds to load, how long will it take to load all four models?**

The obvious (but wrong) answer is twenty seconds. However, the real answer is **around five seconds**. Asynchronous operations don't happen one by one (sequentially), they happen at the same time (in parallel).

That's the theory at least. The real world being it's usual messy self, you may have to deal with busy networks and CPU cores, so the final answer is somewhere between five and twenty seconds. Unless something is wrong though, it should be closer to five than twenty.

Here, we're using `setTimeout` to simulate loading a model in exactly five seconds, so we should get a perfect result of five seconds (to within a couple of milliseconds).

Let's try it out. Here's our first attempt, which looks similar to our [first attempt to load multiple models with promises](#loading-multiple-files-with-promises-a-first-attempt) from earlier in this chapter:

{{< code lang="js" linenos="false" caption="Loading multiple models with async/await, the WRONG way" >}}
async function main() {
  console.time('Total loading time: ');

  const modelA = await loadModelUsingPromise('async_A.file');
  const modelB = await loadModelUsingPromise('async_B.file');
  const modelC = await loadModelUsingPromise('async_C.file');
  const modelD = await loadModelUsingPromise('async_D.file');

  console.timeEnd('Total loading time: ');
}
main();
{{< /code >}}

However, when you check the console you'll see:

{{< code lang="js" linenos="false" caption="Not the result we want" >}}
Total loading time: 20002.922119140625ms
{{< /code >}}

Twenty seconds. Clearly, we're doing something wrong.

> **Execution of the `main` function pauses at each `await` statement until the current asynchronous operation has completed.**

Using this approach, we start to load model $A$, wait for five seconds until it has loaded, _then_ move onto model $B$, wait for five seconds, and so on.

This highlights an important difference between Promises and async/await. Our first attempt to load multiple models with Promises from earlier doesn't suffer from this problem. There, the issue was difficulty in accessing all of the models at once, but otherwise, it was an OK approach. Here, we are flat out _wrong_. Never use multiple `await` statements like this.

In any case, once again, the solution is [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).

### Loading Multiple Files with Async Functions using `Promise.all`

The problem above is that we have four `await` statement. **Always use a single await statement per async function, _unless a subsequent operation relies on the result of an earlier one_** (see [the Fetch example above](#loading-a-file-using-fetch-async-await-version) where we fetched and decoded a JSON file for an example of this).

With `Promise.all`, we can bundle all of the loading operations into a single promise, [just as we did earlier](#loading-multiple-files-with-promise-all), and then use a single `await` to wait for all four promises to complete ([settle](#pending-fulfilled-or-rejected)):

{{< code from="11" to="31" file="worlds/appendix/asynchronous-javascript/src/7-multiple-async-functions.js" lang="js" linenos="true" caption="7-multiple-async-functions.js: combine multiple promises into a single promise with Promise.all" >}}{{< /code >}}

This time, if you check the console you'll see something like:

{{< code lang="js" linenos="false" caption="All four models loaded in five seconds. Much better!" >}}
Total loading time: 5000.897705078125ms
{{< /code >}}

[Everything we said earlier about `Promise.all`](#loading-multiple-files-with-promise-all) holds here, with the same caveat that if one model fails, they all fail. The only difference is that we have replaced `.then` with an `await` statement and moved `.catch` onto `main`.

## Async Functions and the three.js Loaders

**As of three.js r116 (May 2020), there is now a [`.loadAsync` method available on all three.js loaders](https://threejs.org/docs/#api/en/loaders/Loader.loadAsync) which allow us to use `async`/`await` directly.**

This section originally documented the process required to convert the three.js old-school callback-based loaders to modern promise-based loaders. It was nasty.

Thankfully, that's all behind us now and we live in the glorious, async future. Here, we'll use the [`GLTFLoader`](https://threejs.org/examples/#webgl_loader_gltf) to demonstrate loading a model with `.loadAsync`, however, this applies to any three.js loader.

{{< code lang="js" linenos="false" hl_lines="" caption="Loading a model with .loadAsync" >}}
const loader = new GLTFLoader();
const modelData = await loader('models/pig.glb');
console.log(modelData);
{{< /code >}}

That's all, three lines of code. Of course, you do need an `async` function to wrap it in, so let's use our `main` function once again.

{{< code lang="js" linenos="false" caption="Loading a model with .loadAsync" >}}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function main() {
  const loader = new GLTFLoader();
  const modelData = await loader('models/pig.glb');

  console.log(modelData);
}

main().catch((err) => {
  console.log(err);
});
{{< /code >}}

To see the `GLTFLoader` in action, check out {{< link path="book/first-steps/load-models/" title="" >}}.

This concludes our whirlwind tour of modern JavaScript. Armed with this knowledge, you can now safely tackle the rest of this book and start to create beautiful creations using WebGL, three.js, and JavaScript.
