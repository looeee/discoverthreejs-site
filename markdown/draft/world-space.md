#### The World Space Coordinate System

We'll take this opportunity to introduce our first (and most important) [coordinate system](https://en.wikipedia.org/wiki/Coordinate_system), which is called _world space_.

A 3D coordinate system is defined by $X$, $Y$ and $Z$ axes, and _world space_ is defined relative to our `scene` - the center of our `scene` is the point where the three axes that make up _world space_ meet, also called the _origin_.

{{< figure src="first-steps/coordinate_system.svg" alt="The World Space Coordinate System" caption="World Space" lightbox="true" >}}

When we write a position like $(0,0,0)$, we specify the position on the $X$, $Y$ and $Z$ axes, written as $(\{x},\{y},\{z})$:

- $(0,0,0)$: zero distance along each axis, the very center of the coordinate system
- $(1,2,3)$: $1$ unit along the $X$ axis, $2$ units along $Y$, $3$ units along $Z$
- $(-1,0,0)$: $1$ along the $X$ axis _in the negative direction_, centered on the other two axes

Take note of the direction of the axes relative to the camera and your screen.

{{< figure src="first-steps/coordinate_system_simple.svg" alt="The three.js coordinate system, simple" class="small left" lightbox="true" >}}

- `+X` points to the right of the screen
- `-X` points to the left of the screen
- `+Y` points to the top of the screen
- `-Y` points to the bottom of the screen
- `+Z` points _out_ of the screen (towards you)
- `-Z` points _into_ the screen (away from you)

We moved our camera to the point $(0,0,10)$, which means we've left the camera in the middle of the `x-axis` and `y-axis`, but moved it 10 units _towards_ us along the `z-axis`.

{{% /aside %}}