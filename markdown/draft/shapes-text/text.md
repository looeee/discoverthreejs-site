---
title: "Text in 3D: The FontLoader and TextBufferGeometry"
description: "TODO"
date: 2018-04-02
weight: 1202
chapter: "12.2"
---

# Text in 3D: The `FontLoader` and `TextBufferGeometry`


There are several approaches to add text to your scene. Here's a couple, roughly ranging from easiest to hardest:

1. Use a standard HTML element and place it over your scene
2. Use an HTML element, but render it with the CSSRenderer or CSS3DRenderer. This will allow you to attach the text to a model but still style it with CSS.
3. Load a Font with the FontLoader and create a TextGeometry.
4. Load a Font with the FontLoader and use it to create a ShapeGeometry
5. Draw text onto a CanvasTexture and use it as a texture for a model or sprite

Of course there are many more options too, the most popular of which seems to be Signed Distance Fields (SDF) as used here:
https://github.com/Jam3/three-bmfont-text
http://jam3.github.io/three-bmfont-text/test/

We'll investigate 3 & 4 here.

https://medium.com/@eventbrite/parris-khachi-it-s-2015-and-drawing-text-is-still-hard-webgl-threejs-fbcc15f5660b

