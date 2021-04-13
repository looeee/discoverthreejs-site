---
title: 'Writing High Performance JavaScript'
description: ''
date: 2018-04-02
weight: 9907
chapter: 'A.7'
available: false
draft: true
showIDE: true
IDEFiles: [
  'worlds/appendix/high-performance-javascript/src/main.js',
  'styles/main.css',
  'worlds/appendix/high-performance-javascript/index.html',
]
IDEClosedFolders: ['styles']
IDEStripDirectory: 'worlds/appendix/high-performance-javascript/'
IDEActiveDocument: 'src/main.js'
IDESwitchImportsAllow: false
---

# Writing High Performance JavaScript

### Array Performance Considerations

In the examples here, we have created arrays that contain mixed data types:

{{< code lang="js" linenos="false" hl_lines="" >}}
const arr = [ 2, 'bumblebee', 'butterfly' ];
{{< /code >}}

In most cases, that's fine. Certainly, for an array that contains a total of three (or three hundred) items, you don't need to worry about this. But when working with three.js, we often deal with arrays contains hundreds of thousands or millions of items, in which case performance matters, a lot.

In these cases, it's worth noting that JavaScript engines do some behind the scenes optimization of arrays based two things:

1. The type of data in the array.
2. Whether the array has gaps in it.

We won't go into too much detail here, as this may vary between JavaScript engines and may change as engines are updated in the future.

An array with gaps in it could be created like this:

{{< code lang="js" linenos="false" hl_lines="" >}}
const arr = [];

array[0] = 'bumblebee';

array[5] = 'butterfly';
{{< /code >}}

If you log this array to the console, you'll see something like this:

{{< code lang="js" linenos="false" hl_lines="" >}}
['bumblebee', empty × 4, 'butterfly']
{{< /code >}}

This is a so-called **sparse array**. Try to avoid creating these if the array will be used in a lot of intense calculations.

Next, JavaScript engine will treat arrays differently depending on the type of data they contains. Roughly, we can group this into:

1. small integers: [1,2,3, 13, 50]
2. general numbers: [-22323, 0.00023, 1, 5]
3. mixed data: [ 2, 'bumblebee', 'butterfly' ];

Once again, performance optimizations will be done based on the category of the array - and small integers can be optimized more than floats which can be optimized more than mixed data.

However, unless your array is huge and used in intense mathematical calculations that run every frame,  you don't need to care about this kind of optimization