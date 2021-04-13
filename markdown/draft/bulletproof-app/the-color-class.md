---
title: "Working With Color"
description: "Picking up where we left off in the last chapter, we'll add some lights, color, and animation to our scene - we'll discover the animation loop, and add some movement to our cube by making it rotate."
date: 2018-04-02
weight: 204
chapter: "2.4"
showIDE: true
IDEFiles: [
  'worlds/first-steps/the-color-class/src/main.js',
  'worlds/first-steps/the-color-class/src/World/World.js',
  'styles/main.css',
  'vendor/three/build/three.module.js',
  'worlds/first-steps/the-color-class/index.html',
]
IDEClosedFolders: ['styles']
IDEStripDirectory: 'worlds/first-steps/the-color-class/'
IDEActiveDocument: 'src/World/World.js'
---

# Working With Color

We'll add some movement and lights to our app soon, but first, let's add a splash of color.

Colors in three.js are represented using the `Color` class. We've already used this to set the `scene.background` color:

{{% note %}}
 code file="worlds/first-steps/the-color-class/src/World/World.js" from="64" to="69"  lang="js" linenos="true" hl_lines="5"
{{% /note %}}



As we mentioned when we set that up, we can use any of [the 140 CSS named colors](https://www.w3schools.com/cssref/css_colors.asp) here. This might seem like a lot, but it's a long way from the $16,777,216$ colors that a standard computer monitor can display. How do we go about specifying the rest?

There are several ways, as you'll see if you read the [`Color`](https://threejs.org/docs/#api/math/Color) docs page. We'll introduce one new method here: **Hexadecimal Triplets**, commonly known as **Hex Colors**.

{{% aside success %}}

#### Hex Colors

You may already be familiar with [CSS hex colors](https://en.wikipedia.org/wiki/Web_colors#Hex_triplet) - they look like `#FFFFFF` (white) or `#000000` (black) or `#FF0000` (red), or `#87CEEB` (skyblue). These work exactly the same way in three.js, except that hex values are written differently in JavaScript than in CSS.

In JavaScript, a hexadecimal number starts with `0x` instead of `#`. Here are a couple of CSS named colors, along with their hex values in CSS and JavaScript:

| CSS Color Name | CSS Hex Equivalent | JavaScript Hex Equivalent |
| -------------- | ------------------ | ------------------------- |
| black          | `#000000`          | `0x000000`                |
| white          | `#FFFFFF`          | `0xFFFFFF`                |
| red            | `#FF0000`          | `0xFF0000`                |
| green          | `#00FF00`          | `0x00FF00`                |
| blue           | `#0000FF`          | `0x0000FF`                |
| skyblue        | `#87CEEB`          | `0x87CEEB`                |
| purple         | `#800080`          | `0x800080`                |

Note that we can use capital or small letters as we like, in both CSS and JavaScript. There is no difference between `#FFFFFF` and `#ffffff`, or `0xFFFFFF` and `0xffffff`.

{{% /aside %}}
