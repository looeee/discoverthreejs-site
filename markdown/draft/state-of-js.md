---
title: 'JavaScript Used in this Book'
description: "We'll be keeping the JavaScript we use throughout the book as simple as possible, but no simpler. Here, we'll briefly go over what you need to know to be able to follow through to then end of Section One easily"
date: 2019-01-01
weight: 10
chapter: '0.9'
available: true
draft: true
---

# JavaScript USED IN THIS BOOK

{{< figure src="app-logos/javascript.png" alt="JavaScript logo" lightbox="false" class="tiny left noborder" >}}

The ".js" in three.js stands for JavaScript, and as you might expect, you will need to know some JavaScript to be able to use this library.

These days there are a couple of versions of the language in play, with various levels of browsers support, so we'll spend a bit of time here going over exactly which features of the language we'll be using.

Let's start by taking a quick look at the state of JavaScript today and the position that puts us in, as three.js developers.

## The State of JavaScript Today

{{< figure src="app-logos/ecmascript.png" alt="ECMAScript logo" lightbox="false" class="tiny left noborder" >}}

The JavaScript language has gone through something of a rebirth in recent years, during which time it went from being an ugly duckling to something that you might, with a little grace, call a disgruntled swan. Not quite beautiful yet, and still with its annoyances and problems, but much, much better than it used to be.

The committee that oversees the development of the language is called [Ecma International](https://en.wikipedia.org/wiki/Ecma_International) and the technical standard that JavaScript follows is called [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript).

JavaScript has gone through various iterations, from the first version, called ES1, back in 1996, through to version ES5 in 2009. It stagnated there for a couple of years, with a single minor update to ES5.1 in 2011.

Finally, a much-needed Version 6 was released in 2015, dubbed [ECMAScript 2015](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015), commonly called ES6 or ES2015. There was a lot of new syntax introduced here, but this release also marked a change in the way versions will be released going forward. From now on there will be one version per year, called ES2016, ES2017 etc. Collectively, these are sometimes referred to as **ESNext**, or **ES6+**.

At the same time, browsers have largely switched to an _evergreen_ updating system. This means that your browser automatically supports nearly all of the new syntax, with more being added all the time.

**From here on, we'll generally refer to all JavaScript as simply JavaScript, but when we do need to note the difference we'll use the terms _ES5_ and _ES6+_.**

## JavaScript Used in this Book

Following the same reasoning we used [when choosing JavaScript Modules](/book/appendix/three-variants#modules-or-script-tags) (modules and the `import` keyword are part of ES6+ JavaScript), we'll use the most modern version of the JavaScript syntax we can, while making sure that the code can be automatically converted to work in older browsers, and remains compact and performant once it's been converted.

When it comes to modules, the conversion process is called bundling and we do this using [a bundler such as rollup.js, Parcel, or webpack](/book/appendix/three-variants#older-browsers), as we described previously.

For the rest of the ES6+ syntax, we need to use a _transpiler_, and the most popular of these is [Babel](https://babeljs.io/).

Parcel already includes Babel and automatically transpiles your code for you. Rollup and webpack need to be configured to use it, and there are plenty of free tutorials around the web if you need to do this.

If you are new to JavaScript development, you might want to take a few minutes to skim these chapters in the appendices:

- [JavaScript Used in This Book](/book/appendix/javascript-used-in-this-book/)
- [Functions Built-In to Your Browser: the Document Object Model](/book/appendix/browser-api/)
