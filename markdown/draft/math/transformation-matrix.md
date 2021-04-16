---
title: "Affine Transformations And Matrices"
description: "TODO"
menuImage: 'geometries/cylinder.png'
date: 2018-04-02
showToc: false
weight: 104
chapter: "M.4"
excludeFromTOC: true
available: false
draft: true
---

# Affine Transformations And Matrices

We'll pause for a moment here and introduce a couple of mathematical concepts that you will need, in a non-technical and imprecise manner. You don't need to worry about having any kind of deep understanding of these yet, but at some point in your adventure in 3D space you should consider studying this stuff. It's nearly all classed under the term [Linear Algebra](https://en.wikipedia.org/wiki/Linear_algebra), and if you do a search for "3D mathematics" or anything similar you'll find a lot of resources. Pick something basic to start with.

### Affine transformations
The collective technical term for translation, scale, rotation and other similar 3D operations is *transformations* (even more technically [affine transformations](https://en.wikipedia.org/wiki/Affine_transformation)).

Non-technically, an affine transformation is any movement or change in size or shape that preserves points, straight lines, planes and parallel lines. Intuitively, you can think of them as any *normal* movement in 3D space, including shrinking or stretching and shearing. All the transformation that you can make in three.js are affine transformations - non-affine transformations are not supported, and in the rare case that you do need one, you'll have to roll your own. But you'll probably never have to worry about that. Make a mental note and let's move on.

### Matrices
$$  \begin{pmatrix}
  1 & 4 & 4 & 2 \\
  5 & 1 & 2 & 3 \\
  2 & 8 & 7 & 6 \\
  3 & 8 & 0 & 2
 \end{pmatrix} $$

A matrix is an efficient way of storing numbers in a rectangular array. You may have seen them before, even if you haven't studied them. On the left is a 4x4 square matrix - it has four rows and four columns, and the same number of rows as columns so it is called *square*. Matrices can hold all kinds of information, but we are particularly interested in the fact that they can efficiently hold any combination of sequences of affine transformations - so if we want to translate an object 3 units along the x axis, then rotate it by some amount around the y axis, then scale it to twice it's current size, we can store all this information in a single 4x4 [Transformation Matrix](https://en.wikipedia.org/wiki/Transformation_matrix) - see in particular the section on [affine transformations](https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations) on that page if you want to go deeper.

The official docs page for [Matrix4](https://threejs.org/docs/#api/math/Matrix4) has some more information on this, as well as details on the common matrices used.