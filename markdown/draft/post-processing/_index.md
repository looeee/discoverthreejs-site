---
title: "Post-Processing, Shaders, and Effects"
description: "TODO"
date: 2018-04-02
sectionHead: true
weight: 1500
chapter: "15"
---

# Post-Processing, Shaders, and Effects

{{< figure src="post-processing/banner.jpg" alt="Banner" class="banner" >}}

Sometimes you'll want to make changes to your scene after it's been rendered - for example, you might want to adjust the brightness, contrast or saturation. Or perhaps you want to add a [glowing outline](https://threejs.org/examples/#webgl_postprocessing_outline), apply an [anti-aliasing pass](https://threejs.org/examples#webgl_postprocessing_fxaa), a [mask](https://threejs.org/examples/webgl_postprocessing_masking.html), or even a [crazy glitch effect](https://threejs.org/examples/webgl_postprocessing_glitch.htm). Well, three.js has got you covered for all of these and many more with a wealth of post-processing, shaders, and effects.

We'll take a look at all the post-processing shaders and passes that come are available in the three.js repo, and then take a look at how they work under the hood.

They all start by drawing the scene to an off-screen texture, then editing that texture (for example, the brightness post-processing effect will simple brighten or darken the image), before returning the edited texture to you to finally be drawn on the screen. This texture is called a [`WebGLRenderTarget`](https://threejs.org/docs/#api/renderers/WebGLRenderTarget) and we'll see how to use one here.

If you are thinking "Wow! it must take a lot of processing power and memory to draw the scene to an image off-screen, then edit that image and finally draw it to the screen, all at 60 frames per second!", then you would be right. You'll want to use these techniques sparingly and perhaps do without them completely for low powered devices. On the other hand, on medium to high powered devices and used sparingly, post-processing can dramatically increase the visual quality of your scenes.

## Chapter 13.1 [Adding Post-Processing To A Scene](/book/post-processing/basic-post-processing/)

But first, we'll need to know how to add post-processing to our scenes. We'll start by setting up a basic "do nothing" example to demonstrate the best practice of adding post-processing to a scene. Once we've covered how to do that, we'll take some time to bring you up to speed on all the terminology and the three.js stuff - like, what the EffectComposer is, what a Pass is, and how it's different to a Shader.

Once we've done that, we'll add a funky kaleidoscope post-processing pass to one of our scenes.

<figure>
  <video id="vid" width="800" height="800" autoplay loop>
    <source src="/static/images/post-processing/kaleidoscope.mp4" type="video/mp4">
  </video>
</figure>

<script>
window.addEventListener( 'click', function() {
  document.getElementById('vid').play();
} );
window.addEventListener( 'touch', function() {
  document.getElementById('vid').play();
} );
window.addEventListener( 'scroll', function() {
  document.getElementById('vid').play();
} );
</script>



## Chapter 13.2 [Anti-Aliasing A Post-Processed Scene](/book/post-processing/anti-aliasing-post-processing/)

One issue you will encounter when using post-processing is that, at least while we're still using WebGL version one, the built-in anti-aliasing AA will no longer work for some terribly tedious and technical reasons.

If you recall, back in [Ch 1.1: Lights! Color! Action!](/book/first-steps/lights-color-action/#antialiasing) we showed that enabling the built-in AA was as simple as setting `antialias: true` in the `WebGLRenderer` constructor@

{{< code lang="js" linenos="false" hl_lines="" >}}
const renderer = new THREE.WebGLRenderer( { antialias: true } );
{{< /code >}}
This enables whatever form of AA is built-in to your GPU, which is almost certainly [Multisample anti-aliasing](https://en.wikipedia.org/wiki/Multisample_anti-aliasing), or MSAA. Since it's built-in and performed by special hardware, it's blazing fast, even on most mobile devices.

Unfortunately, due to the aforementioned technical limitions of WebGL, when we're using post-processing this won't be effective, so we'll need to ensure that it's disabled for a modest performance gain:

{{< code lang="js" linenos="false" hl_lines="" >}}
const renderer = new THREE.WebGLRenderer( { antialias: true } );
{{< /code >}}

Or, using our `App` class:

{{< code lang="js" linenos="false" hl_lines="" >}}
const app = new App( {

  container: '#scene-container',

  renderer: {

    // disable built-in AA since it doesn't work with post-processing
    antialias: false,

  },

} );
{{< /code >}}

However, we usually _do_ want to perform anti-aliasing on our scenes. So what are we to do? The answer is to perform AA as a post-processing pass (the built-in AA is also doing AA as a post-processing pass, it's just a pass that's built into the hardware so it's super fast).

There are several different methods for applying AA that have been developed over the year, but, even though three.js does have [SSAA](https://en.wikipedia.org/wiki/Supersampling), [TAA](https://en.wikipedia.org/wiki/Temporal_anti-aliasing), [FXAA](https://en.wikipedia.org/wiki/Fast_approximate_anti-aliasing), and [SMAA](https://www.kotaku.com.au/2012/01/fxaa-is-old-news-smaa-is-what-you-want/) available as post-processing passes, only FXAA and SMAA are fast enough to be useful, and of those, SMAA is generally higher quality, so we'll use that for our post-processed scenes.


