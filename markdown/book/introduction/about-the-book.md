---
title: "How to Use This Book"
description: "This book is a complete guide for creating professional-quality 3D apps using three.js. Each chapter comes with a live code editor so you can edit the code we describe and see the changes immediately."
date: 2018-04-02
weight: 2
chapter: "0.1"
available: true
showIDE: true
IDEFiles: [
  "assets/models/Horse.glb",
  "assets/models/Parrot.glb",
  "assets/textures/sprites/spark1.png",
  "styles/main.css",
  "vendor/three/build/three.module.js",
  "vendor/three/examples/jsm/controls/OrbitControls.js",
  "vendor/three/examples/jsm/loaders/GLTFLoader.js",
  "worlds/introduction/about-the-book/index.html",
  "worlds/introduction/about-the-book/src/main.final.js",
  "worlds/introduction/about-the-book/src/main.start.js",
  "worlds/introduction/about-the-book/src/World/components/camera.js",
  "worlds/introduction/about-the-book/src/World/components/lights.js",
  "worlds/introduction/about-the-book/src/World/components/scene.final.js",
  "worlds/introduction/about-the-book/src/World/components/scene.start.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/sparkleHorse.final.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/sparkleHorse.start.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/convertMeshToPoints.final.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/convertMeshToPoints.start.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSizesAttribute.final.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSizesAttribute.start.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSparkleMaterial.final.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/createSparkleMaterial.start.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/setupAnimation.final.js",
  "worlds/introduction/about-the-book/src/World/components/SparkleHorse/utilities/setupAnimation.start.js",
  "worlds/introduction/about-the-book/src/World/systems/controls.js",
  "worlds/introduction/about-the-book/src/World/systems/renderer.js",
  "worlds/introduction/about-the-book/src/World/systems/Resizer.js",
  "worlds/introduction/about-the-book/src/World/systems/Loop.js",
  "worlds/introduction/about-the-book/src/World/World.final.js",
  "worlds/introduction/about-the-book/src/World/World.start.js",
]
IDEComparisonMode: true
IDEStripDirectory: 'worlds/introduction/about-the-book/'
IDEClosedFolders: ['systems', 'components', 'styles', 'vendor', 'textures']
IDEActiveDocument: 'src/World/components/SparkleHorse/sparkleHorse.js'
IDEEntry: "index.html"
prevURL: "/book/introduction/"
prevTitle: "Welcome to Discover three.js!"
---

{{% note %}}
THIS CHAPTER IS COMPLETE!

TODO-LOW: go over sparkleHorse code: before comparison should be non-sparkle horse
{{% /note %}}

# How to Use This Book

This book is a complete introduction to using the web as a platform for creating professional-quality 3D applications using three.js. There are many great tutorials for three.js available, not to mention the huge [collection of examples](https://threejs.org/examples/) on the three.js website. However, these tutorials and examples introduce three.js piece by piece, using small code snippets. This can be useful but falls short when it comes to creating a real-world, customer-facing application.

In this book, we take a more holistic approach. Here, we demonstrate how to use three.js to create complete, robust, professional-quality applications that follow best practices and _simply work_ across all devices and modern browsers. While doing so, we'll split the code into small modules, each of which deals with a single aspect of the overall complexity. This means we can show you what a "real" three.js application looks like, while still writing code that is easy to follow.

{{% note %}}
It's not possible to build real-world applications like this without making opinionated design decisions. The code we'll write in this book is not intended to demonstrate the only or even the best way of doing things. Rather, we'll focus on creating applications that are easy to understand so that you can follow the topics we introduce without being bamboozled by complex code structures. When you graduate to building your own applications, you'll have to decide for yourself what style suits your needs best. :

We'll start small and before you know it we will have worked our way up to a complete application.
{{% /note %}}

In this Introduction, we cover everything you need to know _before_ you start. {{< link path="/book/first-steps/_index.md" title="The main chapters" >}} cover everything you need to get a basic 3D scene running in a web browser, including how to create objects, lights, cameras, camera controls, and how to organize and move objects around in your scenes. We'll finish by taking a look at how to load complex animated models created in an external program.

## Prior Knowledge

Creating 3D applications that run in a browser falls at the intersection of web development and computer graphics, and by the time you finish this book, you'll have a deep understanding of both fields. However, here at the very start of the book, we will assume almost zero prior knowledge, and whenever possible, we'll explain topics and jargon as we come to them. On the rare occasion that introducing a topic would break the flow of a chapter we'll refer you somewhere else or to another section of this book where you can study it further.

### JavaScript and Web Development

The main language we use throughout this book is JavaScript. You need to know the basics of this language to work with three.js, but you don't need to be an expert, and the same applies to HTML, CSS, and other aspects of web development. However, turning this book into a tutorial on web development or JavaScript would distract from our goal of learning three.js. As a result, most of the technical JavaScript details have been relegated to the {{< link path="book/appendix/" title="Appendices" >}}. Whenever we encounter a new JavaScript feature, we'll provide a link to the relevant section in the appendix, or a reliable external site like [MDN](https://developer.mozilla.org/en-US/).

### Math Knowledge

To move objects around in 3D space, we'll use some concepts from [linear algebra](https://en.wikipedia.org/wiki/Linear_algebra), such as vectors and matrices, while 3D space itself is described using a [Cartesian coordinate system](https://en.wikipedia.org/wiki/Cartesian_coordinate_system). However, you might be surprised how little mathematical knowledge you need to use three.js. The library does an amazing job of hiding all the complicated technical details. _Until you need them_, that is.

If at some point you want to study linear algebra or any other math topic more deeply, [Khan Academy](https://www.khanacademy.org/) is one of the best resources on the web for learning mathematics, and their [linear algebra course](https://www.khanacademy.org/math/linear-algebra) has everything you need to get through this book.

## Code Examples

This book features a custom-built live code editor that you can use to follow along with the code described in the text. This allows us to sidestep the complexities of setting up a web server and concentrate on learning three.js. If you're viewing this page on a large screen, the editor will open automatically alongside the text, otherwise, click the {{< icon "solid/columns" >}} button on the top left of the navigation bar. Any changes you make to the code will show up right away in the preview window.

### Before and After Code Comparison

See the big toggle switch at the top left of the editor? Go ahead and give it a try. Most chapters start with a partially completed example for you to work from, and also let you insta-complete&trade; the code with a single flick of this toggle. You can switch back and forth between the complete and initial states, and make changes to both separately.

## Working on your own Machine

Working on your own computer is referred to as _working locally_ in web dev land. If you prefer to do this rather than using the editor, you can download the files as a zip file using the {{< icon "solid/download" >}} button. This zip file will contain the files currently displayed. In other words, if the comparison toggle is to the right, you'll get the completed code, and if it's to the left, you'll get the starting code, in both cases along with any changes you've made.

If you are working locally, once we come to loading textures and 3D models in {{< link path="/book/first-steps/transformations/" title="" >}} and {{< link path="/book/first-steps/load-models/" title="" >}} you'll need to set up a local development server. The reason for this is that web browsers have security restrictions to prevent malicious websites from loading files directly from your computer's file system. Check out the [How to Run Things Locally](https://threejs.org/docs/#manual/introduction/How-to-run-things-locally) in the three.js docs for more information on this topic.

## Official Documentation and Source Code

You should use this book alongside the [official three.js documentation](https://threejs.org/docs/) and the [official examples](https://threejs.org/examples/), and you will be referred to each of these frequently. Once you're more familiar with the library, you'll also find the [three.js source code](https://github.com/mrdoob/three.js/tree/dev/src) and the [source code for the plugins](https://github.com/mrdoob/three.js/tree/dev/examples/jsm) useful in furthering your understanding.


