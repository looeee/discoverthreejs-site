{{% aside success %}}

### What Do We Mean by Real-Time Graphics?

The world of 3D computer graphics is roughly divided into two sides.
On one side, we have **pre-rendered** graphics. This means things like special effects, fully animated 3D films like Toy Story, or cut scenes in games. It doesn't matter how long a frame takes to render here. For some cutting-edge special effects, a single frame may take hours or even days to create! A Hollywood special effects studio may have hundreds of computers (a **render farm**), each working on a single frame, or even just part of a frame. These frames will then all be combined into the final animation.

We're concerned with **real-time** graphics here. Instead of hundreds of powerful computers, we may be trying to display our scene on a single smartphone. Not only that, but we want the viewer to be able to interact with the scene - perhaps control a character in a game, view a product from multiple angles, or update an animation as they scroll down the page - and we want to do this, ideally, at a smooth 60 frames per second.

So, instead of having the luxury of spending hours on each frame, we need to listen for feedback from the user, update any animations, perhaps calculate physics and play sound effects, and _then_ draw our scene onto the screen - and we want to do this all _60 times every second on an old phone_. Obviously, we are much more constrained here. But throughout this book, we'll discover a huge range of techniques for achieving this without sacrificing too much visual quality.
{{% /aside %}}
