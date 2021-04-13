## Physically Correct Lighting

> Setting physicallyCorrectLights to = true will allow us to use real-world lighting units in our lighting setup

{{< highlight js "hl_lines=1-9 12-99" >}}
{{< codesnippet file="worlds/first-steps/ambient-lighting/src/World.js" from="87" to="101" >}}
{{< /highlight >}}

Throughout this book, we will be concentrating on creating a physically based workflow. An important part of this is making sure that we use standardized [SI units](https://en.wikipedia.org/wiki/International_System_of_Units). We've already been using meters to measure distances in our scenes, and later we'll use seconds to time our animations.
views
Another consideration in our quest for physical correctness is the units that we measure our lighting in. So far, we've been putting in whatever value looks good as the intensity parameter on our lights, without thinking too much about what it means.

However, three.js allows us to switch on **physically correct lighting**. Once we do this, can use SI units of lighting such as **Lux**, **Candela**, and **Lumens** to set the lighting in our scenes.

This means that we can look at the packaging of a lightbulb and use the bulb's power (in lumens) and the brightness of our scene will match the bulb in the real world!

The first thing that you may notice is that the scene gets darker when we set `physicallyCorrectLights = true`, so we'll turn up the brightness a bit. Later we'll look at how we can adjust the exposure value on the renderer to compensate for this.

For now, set the intensity on the `HemisphereLight` light to $5$, then back in the `DirectionalLight` and set the intensity of that to $5$ as well.

Wait... better get our physical terminology correct - set the **irradiance** of both of the lights to $5$. Much better!
