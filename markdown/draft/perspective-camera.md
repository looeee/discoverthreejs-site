#### Field of View (FOV)

{{< figure src="first-steps/fov.png" alt="The Field of View angle" title="The Field of View angle" class="medium right" lightbox="true" >}}

First up is the `fov`, or **Field of View**, parameter, which defines the angle of the viewing frustum, that is, how much of the world can be seen through the camera. It's specified in **degrees** (this is an exception; most angles in three.js are expressed in **radians**). Another way to think of this is that the `fov` parameter defines how much bigger the far clipping plane will be than the near clipping plane. The **valid range** for the FOV is from 1 to 179 degrees.

Increasing and decreasing the FOV has a similar effect to zooming the camera in and out.

{{% aside %}}

##### Choosing the Right Field of View

As a human with eyes on the front of your head, you have a smaller FOV than an antelope with eyes on the side of its head. A human's FOV is about 120 degrees, so for a realistic FOV in your app, you will need to consider how much of this field of view the screen will be likely to take up.

Console games, designed to be shown on screens far away from the viewer, usually have a FOV between 40 - 60 degrees, while a PC game might use a higher FOV of around 90 since the screen is likely to be right in front of the player.

You don't have to be especially accurate here - there's usually no way to know in advance what kind of screen your app will be viewed on, so this is only a rough figure.
{{% /aside %}}

#### Aspect Ratio

{{< figure src="first-steps/aspect_ratio.svg" alt="Aspect ratio examples" class="large right" lightbox="true" >}}

The `aspect` ratio is the width divided by the height of the viewing rectangle (the `<canvas>`, that is). In this case our `<canvas>` element will take up the full browser windows, so the aspect ratio of the `<canvas>` is the same as the aspect ratio of the browser window.

An aspect ratio of $1$ will be a square, while `window.innerWidth / window.innerHeight` will be a rectangle with the same proportions as your current browser window (minus the portion at the top with the URL and browser controls).

We've created a `container` element to hold our scene, so we will use the width and height from that to calculate the aspect ratio.

{{< code file="worlds/first-steps/first-scene/src/main.js" from="22" to="22" lang="js" linenos="true" hl_lines="" >}}

{{% aside %}}
However, we set the aspect ratio, it needs to match the ratio of the HTML `<canvas>` element. If we set this incorrectly then our scene will look stretched and blurred.
{{% /aside %}}

#### Clipping Planes

{{< figure src="first-steps/clipping_planes.svg" alt="Clipping Planes" lightbox="true" >}}

The clipping places are the cutoff points for the part of the scene that we can see. We cannot see anything beyond the **far clipping plane**, or closer than the **near clipping plane**.

##### The Near Clipping Plane

The `near` parameter defines the near clipping plane. Objects closer to the camera than `near` will not be visible. For a `PerspectiveCamera`, the near plane must be greater than $0$, and less than the `far` plane. This defines the smaller end of the frustum pyramid shape in the diagram above.

##### The Far Clipping Plane

The `far` parameter defines the far clipping plane. Objects further away from the camera than this will not be visible. For a `PerspectiveCamera`, this can be anything bigger than the `near` plane. In practice, to make your scene efficient, `far` should be as small as possible. This defines the larger "base" of the frustum.

{{% aside success %}}
The goal is to make the area contained in the frustum as small as possible, as this can increase performance.

To achieve that, we will make `near` as big as possible, and `far` as small as possible while keeping `far` bigger than `near`.
{{% /aside %}}