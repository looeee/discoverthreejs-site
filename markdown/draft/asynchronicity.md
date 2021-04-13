
## Asynchronous File Loading

This has been our first encounter with {{< link path="/book/appendix/asynchronous-javascript/" anchor="" title="**asynchronous file loading**" >}}, and thanks to the `TextureLoader`, it has been a very gentle introduction.

Loading a file asynchronously means that our app does not pause while the file is loading. Even if we are on a slow connection and the file takes half a minute to load, the rest of our app will continue to run smoothly while the file loads in the background. The only issue is that the material will display as black until loading has completed.

By contrast, the rest of our app is synchronous. This means that each step has to wait for the previous step to finish
before proceeding. If we loaded the texture synchronously, everything else on the page would freeze until loading
completed.

Asynchronous file loading is an area where JavaScript excels, as you might expect from a language designed to work with a slow and unreliable network (the internet, that is). We will encounter asynchronous file loading again in a couple of chapters, when we load our first 3D models.

{{% note %}}
TODO-LINK: add link to loading models
{{% /note %}}

{{% /aside %}}