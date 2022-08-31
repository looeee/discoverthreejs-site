---
title: "How to Create an Animation Loop With JavaScript"
description: "This chapter is a brief overview of the various ways it's possible to create an animation loop using JavaScript"
date: 2018-04-02
weight: 9907
chapter: "A.7"
available: false
draft: true
showIDE: false
IDEFiles:
  [
    "worlds/appendix/javascript-animation-loop/src/main.js",
    "styles/main.css",
    "worlds/appendix/javascript-animation-loop/index.html",
  ]
IDEStripDirectory: "worlds/appendix/javascript-animation-loop/"
IDEActiveDocument: "src/main.js"
IDESwitchImportsAllow: false
---

# How to Create an Animation Loop With JavaScript

_Note: you can paste any of the loop variations from this section directly into the browser console to see them in action._

We'll spend a few moments exploring the various ways to set up an animation loop in JavaScript.

We'll build our loop using a [recursive function]({{< relref "/book/appendix/javascript-reference#recursion" >}} "recursive function"), which is a function that calls itself repeatedly. Here is the most basic version of a recursive animation loop:

{{< code lang="js" linenos="false" hl_lines="" caption="Basic recursive loop function" >}}
function looper() {
console.log('Rendering a frame...');

// looper calls itself
looper();
}

// start the loop
looper();
{{< /code >}}

This loop will draw frames as fast as your computer can manage, which is likely to be far faster than your monitor can handle. That's a lot of wasted processing power and will slow down everything else on the computer.

Most monitors run at **sixty hertz**, which means that the image on the screen is updated sixty times per second. We call this the _refresh rate_ of the monitor. This number is fixed. In other words, a 60Hz monitor will update the image sixty times a second no matter how many (or how few) frames we send. If we send more than sixty frames in a single second to a 60Hz monitor, we are wasting computing resources.

We call the rate at which our app is generating frames the **FPS** (**frames per second**). This number is variable and may change from second to second depending on the complexity of your scene and how busy your computer is, but for an animation to look smooth, we want this number be as close to sixty FPS as possible.

This means we need some way to schedule the rendering of frames. To render at sixty FPS, we need to produce a frame once every $\frac{1000}{60} = 16.666$ milliseconds.

In other words, our animation loop should look like this:

- **render the scene**
- **wait for 16.666 milliseconds**
- **rotate the cube a tiny amount**
- **render the scene**
- **wait for 16.666 milliseconds**
- **rotate the cube a tiny amount**
- **render the scene**
- **wait for 16.666 milliseconds**
- **rotate the cube a tiny amount**

... and so on.

## Schedule the Loop Using `.setTimeout` or `.setInterval`

As a first attempt, let's try using [`.setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) to schedule the frames.

We can recursively call `.setTimeout` with a delay of 16.666 milliseconds:

{{< code lang="js" linenos="false" hl_lines="" caption="A recursive loop that uses setTimeout to pause between loops" >}}
function loopAt60FPS() {
console.log('Rendering a frame...');

// wait 16.666 milliseconds
setTimeout(() => {
// loopAt60FPS calls itself
loopAt60FPS();
}, 16.666);
}

// start the loop
loopAt60FPS();
{{< /code >}}

Or, we could use [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval), which allows us to do the same thing with a shorter syntax:

{{< code lang="js" linenos="false" hl_lines="" caption="A recursive loop that uses setInterval to pause between loops" >}}
// render every 16.666 milliseconds
setInterval(() => {
console.log('Rendering a frame...');
}, 16.666);
{{< /code >}}

## Problems With JavaScript Timing Functions

Using either `.setTimeout` or `.setInterval` to set up an animation loop will give us the same result... and the same problems.

First, **JavaScript timing functions such as `.setTimeout` and `.setInterval` are notoriously inaccurate.** We will never get a loop that consistently runs at sixty frames per second using these methods.

Second, **not all screens run at sixty frames per second. Newer monitors or mobile devices may have a refresh rate of 90, 120, 144, or even 240 hertz.** Our application should run at the display rate of the screen it is displayed on, rather than being stuck at 60 FPS.

Third, **we should produce frames in sync with the monitor's refresh interval**. If we manually schedule frames, we will end up out of sync with the monitor which can lead to tearing and wasted frames.

Fourth, **we need our loop to run smoothly even on a slow device that cannot reach the target frame rate**. We need to handle this situation by reducing the frame rate without stuttering or jumping.

Often, the user will not notice that an app is running at thirty frames per second rather than sixty, as long as the frame rate is consistent. However, they will certainly notice uneven frame rates, jumps, and stutters (often called **jank**).

## Better Scheduling with `.requestAnimationFrame`

Until a few years ago, we simply had to grit our teeth and accept all these problems. Fortunately, that's no longer the case.

Modern browsers have a method designed especially for running animations smoothly, called [`.requestAnimationFrame`]({{< relref "/book/appendix/dom-api-reference#drawing-animation-frames" >}} "`.requestAnimationFrame`").

If we use this method to set up our animation loop, we can rely on the browser to intelligently schedule frames in sync with the monitor's refresh rate.

An animation loop using `.requestAnimationFrame` looks similar to [the `setTimeout`
loop](#schedule-with-settimeout-and-setinterval) above:

{{< code lang="js" linenos="false" hl_lines="" caption="A recursive loop that uses requestAnimationFrame to intelligently schedule the loops" >}}
function onLoop() {
// render a frame
console.log('Rendering a frame...');

// schedule looper to be called
// the next time the browser repaints
requestAnimationFrame(() => {
onLoop()
});
}

// start the loop
onLoop();
{{< /code >}}

However, we do not have to enter the value of 16.666 using this method. Instead, the browser will schedule the frames for us based on the refresh rate of the monitor.

Some older browsers limit `requestAnimationFrame` to sixty frames per second, but we'll still gain the other benefits of using this method.
