### Set the Renderers GammaFactor and OutputEncoding

> Set the correct gamma correction factor and color space on the renderer

{{< highlight js "hl_lines=1-6 11-99" >}}
{{< codesnippet file="worlds/first-steps/textures-intro/src/World.js" from="66" to="78" >}}
{{< /highlight >}}
views
We're nearly done. However, since we've set up the texture to use the correct color space, we should also do the same for our `WebGLRenderer`.

Note that for our current scene, we won't see any difference since we're using this simple black and white UV test texture. Black and white are not affected by color correction, so changing these settings has no effect here.

However, once we come to more advanced scenes this will make a difference and we will already be set up and following best practices.