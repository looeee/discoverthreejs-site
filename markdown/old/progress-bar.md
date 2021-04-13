---
title: "Faking A Progress Bar In three.js"
date: 2018-02-02
description: "Setting up a progress bar for a WebGL project is a non-trivial progress. Here we'll explore a quick and dirty method of faking one that in many cases will be just as good as the real thing"
menuImage: 'geometries/sphere.png'
tags: ['loading', 'loading overlay', 'progress bar', 'loading manager', 'FBXLoader']
weight: 108
chapter: "B.8"
draft: true
---
codepen "JMrOey"

{{% fullwidth %}}
# FAKING A PROGRESS BAR IN three.js
{{% /fullwidth %}}

Setting up a loading overlay to let users know when your page will be ready should be easy, right?

Well, actually the answer to that, more often than not, is no. It turns out that making an accurate loading bar is quite a complex task and often far more work than its worth.

We've all seen loading bars like this - first they say you'll have to wait one hour, then 50 minutes, then 5 minutes... and then end up taking 8 minutes.

{{< figure src="blog/loading-overlay/windows-loading.png" class="figure-small" caption="Fig 1: no wait, 5 minutes... no, 1 minute!" alt="loading..." >}}

Even when these estimates are made while transferring files to a hard drive, they can be way off. Factor in things like uncertain network speeds, texture loading and so on and it's no wonder we will run into problems.

OK, so let's forget an accurate time estimate - what about a simple loading bar based on the percentage loaded so far?

In certain situation, this will be fine. For example, take a look at the three.js [FBXLoader example](https://threejs.org/examples/#webgl_loader_fbx). If we open up the console we'll
see a nice list of percentages showing how much of the model has loaded:

{{< figure src="blog/loading-overlay/fbxloader.png" caption="Fig 1: Loading percentages" alt="fbxloader-console" lightbox=true class="figure-medium" >}}

The code is even quite simple:

{{< highlight js >}}
...
var onProgress = function( xhr ) {
  if ( xhr.lengthComputable ) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
  }
};

var loader = new THREE.FBXLoader( manager );
  loader.load( 'models/fbx/xsi_man_skinning.fbx', function( object ) {

    scene.add( object );

}, onProgress, onError );
...
{{< /highlight >}}

`xhr` in the `onProgress` method refers to an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) object, which is an object used to retrieve data from a server. The progress is monitored by three.js using a [progress](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onprogress) event.

All are doing here is adding an `eventListener` to a file download request:

{{< highlight js >}}
var request = new XMLHttpRequest();

request.addEventListener('progress', onProgress);
{{< /highlight >}}

where `onProgress` is the function from the FBXLoader example.

So far so groovy, right? We just need to hook those percentages up to a nice progress bar and all will be good in the world.

As long as you are just loading a single model, this is correct. Kind of - actually when I've tested this with different models, I've found that it's unusual to get such a fine-grained progress report. You are much more like to get something like:

{{< highlight js >}}
14% downloaded
66% downloaded
100% downloaded
{{< /highlight >}}

Which makes for a "jumpy" progress bar... and when it comes to downloading multiple files, in most cases this process breaks down completely.

### Monitoring Progress While Loading Multiple Files

Let's examine the FBXLoader example a little deeper.

First, if you open up the console again you'll notice a couple of other lines beside the percentages:

{{< highlight js >}}
models/fbx/nurbs.fbx 1 2
models/fbx/xsi_man_skinning.fbx 2 4
models/fbx/Char_UV_Texture.gif 3 4
models/fbx/Char_UV_Texture.gif 4 4
{{< /highlight >}}

These are coming from a _second_ `onProgress` function. This one is connected up to the loading manager:

{{< highlight js >}}
var manager = new THREE.LoadingManager();
manager.onProgress = function( item, loaded, total ) {
  console.log( item, loaded, total );
};
{{< /highlight >}}

This tells us details about _all_ the files loaded in the scene (as long as we pass it into the loaders correctly: `var loader = new THREE.FBXLoader( manager );`).

This second `onProgress` method takes three arguments:

* `item`: the URL of the current item being loaded
* `loaded`: how many items have been loaded so far
* `total`: how many total items there are to load

In this cases, there are 4 items - two models and two textures. The first model is the blue curves - these load pretty much instantly and just flash a `100% downloaded` message straight away, while for the textures we don't get any percentage information at all.

If you reload the page and watch carefully, you'll see that the final `100% downloaded` from the main model is shown a short time before the textures are loaded, and until then the model displays black.

So, we actually have 4 items being loaded but only get percentage info about two of them.

Even if we decide that we don't care about textures, it's not so easy to use this percentage info from multiple sources to calculate a smooth loading bar. 1% of a tiny model is not the same as 1% of a much larger model, so we'll still end up with a jumpy loading bar.

You'll need to know the exact sizes of all the models to account for this, and do some tedious calculations. Then if you update a model, you'll need to remember to update the record of it's size for the loading bar as well... so tedious!

You may not even know anything about the models at all. This is the case for my [loader](/loader/) page - people may be loading any amount of models and I have no way of knowing anything about them in advance.

### Fake it Until You... Actually, Just Keep Faking it

I did some research and came across one amazing but [hugely complex solution](https://www.npmjs.com/package/loadscreen). While it looks amazing and I would totally consider using this if I had a team of 20 people working on a fancy game, it's complete overkill for a small project. It also suffers from the same problem of requiring you to keep track of the size of all models.

At this point, since I am a firm believer in keeping everything as simple as possible, I decided to build a fake loading bar. It will just keep climbing in a realistic fashion (that is, the speed will go up and down a bit, but it will not be too 'jumpy') until it reaches 100%, then reset and start again. When it restarts you could switch to a deeper color to suggest progress.

Let's jump straight in and see how we can set this up.

#### Set Up the HTML and CSS

The HTML:

{{< highlight html >}}
<div id="loading-overlay">
  <div id="loading-bar"
      <span id="progress"></span>
  </div>
</div>
{{< /highlight >}}

...and the CSS:

{{< highlight css >}}
#loading-overlay {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-overlay-hidden {
  display: none !important;
}

#loading-bar {
  width: 25em;
  height: 1em;
  border-radius: 0.25em;
  background-color: black;

  border: 1px solid grey;

  display: inline-flex;
}

progress {
  background-color: #75b800;
  height: inherit;
  border-radius: inherit;

  width: 5%;
}
{{< /highlight >}}

#### Make the Bar Animate While Loading

OK, onto the trick... and that is: ignore the `onProgress` method completely!

Instead, we'll focus on the other two methods of the `loadingManager`:

* `onStart` called at the start of loading
* `onLoad`, called once all models and textures have been loaded.

We'll simply start animating the bar when `onStart` is called, and stop the animation when `onLoad` is called.

Start by creating the loading manager and create references to the progress component of the bar and the loading overlay.

We can then control the width of the bar using `progressBar.style.width`, and we'll hide the whole overlay using `loadingOverlay.classList.add( 'loading-overlay-hidden' )` once loading is complete.

{{< highlight js >}}
var manager = new THREE.LoadingManager();
const progressBar = document.querySelector( '#progress' );
const loadingOverlay = document.querySelector( '#loading-overlay' );
{{< /highlight >}}

Next, we'll set up a percentage counter and frame id - we will be using `requestAnimationFrame` to control the bar animation here, and we will use the frame id to stop the animation once loading is complete.
{{< highlight js >}}
let percentComplete = 0;
let frameID = null;
{{< /highlight >}}

We'll create an animation loop to control the bar's animation. This is similar to the standard animation loop used in most three.js scenes. See the [animation with requestAnimationFrame](/tutorials/2-lights-color-action/#animating-with-requestanimationframe) for more details.

{{< highlight js >}}
const updateAmount = 5; // in percent of bar width, should divide 100 evenly

const animateBar = () => {
  percentComplete += updateAmount;

  // if the bar fills up, just reset it.
  // you could also change the color here
  if ( percentComplete >= 100 ) {
    percentComplete = 5;
  }

  progressBar.style.width = percentComplete + '%';
  frameID = requestAnimationFrame( updateBar )

}
{{< /highlight >}}

Next, we'll set up this animation loop in the `loadingManager.onStart` method. A little care is needed here since this method may be called more than once and we don't want multiple instances of the animation loop running.

{{< highlight js >}}
loadingManager.onStart = () => {

  // onStart may be called multiple times
  // don't run the animation more than once
  if ( frameID !== null ) return;

  animateBar();
};
{{< /highlight >}}

Finally, we'll set up the `loadingManager.onLoad` method to cancel the bar animation, reset everything and hide the loading overlay. Remember that this method gets called once _all_ items, including textures, are loaded. If you want to hide the overlay once models have loaded but _before_ textures have loaded you'll have to use a different technique (such as [promises](/blog/promisifying-threejs-loaders/.))

{{< highlight js >}}
loadingManager.onLoad = function ( ) {

  loadingOverlay.classList.add( 'loading-overlay-hidden' );

  // reset the bar in case we need to use it again
  percentComplete = 0;
  progressBar.style.width = 0;
  clearInterval( timerID );

  // do any other on load things

};
{{< /highlight >}}

And that's it! You now have a totally believable fake loading bar. You may need to adjust the speed and rate at which it fills.

If it fills up before the model loads it will just reset.
People are actually quite used to this behavior, so it shouldn't be too jarring if that happens. Check out the Codepen example at the bottom of this page to see it in action.

#### Final Note: Loading Is Render Blocking

You may notice something odd here - `requestAnimationFrame` should be running at up to 60fps, which means that it should get called once every 16 milliseconds or so. We are updating the bar 5% each time, which means that that bar should be full in 20 * 16 = 320ms, or 1/3 of a second.

Why isn't that happening? Well, due to the single-threaded nature of JavaScript, calling something like `loader.load` takes up the whole thread and prevents the page being updated. There seems to be some mechanism that allows the `progress` events described earlier to get through, and _some_ calls to `requestAnimationFrame`, which is called before each time the screen is updated.

The end result is that during load you are getting a choppy frame rate that jumps everywhere from 5fps to 1fps, to 20fps etc. We have exploited this to create a fairly believable fake loading bar. It's not perfect, and you may find times when it is not suitable. I have used it in several projects now and so far nobody has noticed that it is fake!

Which has led to me examining more loading bars that I've seen, and my conclusion is that most of those are fake too.

### The Final Result

Here's the final result as a Codepen again.

I had to reduce the `updateAmount` from 5 to 0.5 - perhaps Codepen is doing something fancy behind the scenes to get the page to update more smoothly during loading.

If you use this in any projects please share them in the comments below!

codepen "JMrOey"