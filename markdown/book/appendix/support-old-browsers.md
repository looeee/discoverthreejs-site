---
title: 'Supporting Outdated Browsers in a Modern JavaScript App'
description: 'We want to support old browsers while writing modern, high-performance code. To that, we need to process the code using a transpiler, which will rewrite modern syntax in old style that out of date browsers can understand.'
date: 2018-04-02
weight: 9906
chapter: 'A.6'
available: true
draft: true
---

# Supporting Outdated Browsers in a Modern JavaScript App

But what if you _do_ decide that you need to support people using older browsers? Thankfully, there's a way to get the best of both worlds - we can write our code using JavaScript modules, and then _bundle_ it into a single file (usually called _**bundle.js**_) which will resemble the old _**three.js**_ and _**three.min.js**_ files, and which we can then include in a `<script>` tag in older browsers:

{{< code lang="html" linenos="false" hl_lines="" >}}
// this bundle will include our entire app and the three.js core

<script src="src/bundle.js"></script>
{{< /code >}}

There are several _module bundlers_ available, such as [Parcel](https://parceljs.org/), [rollup.js](https://rollupjs.org/), or [webpack](https://webpack.js.org/), each with their own strengths and weaknesses. three.js and itself is bundled using rollup.js, while Parcel is the most simple to use and webpack is the most popular.

Using these bundlers is beyond the scope of this book. This is a somewhat complex topic, which is not three.js specific and there's a lot of information out there if you do need to deal with this. Too much - it's easy to get information overload with all the conflicting and rapidly changing viewpoints on what the best practice is when researching this topic.

In any case, we'll sidestep all this and stick with using modern, modular JavaScript here. Rest assured though, that any code demonstrated in this book can be automatically converted to work with older browsers, at least as far back as Internet Explorer 9. This will allow your app to support >99.9% of internet users.

_Note: Code from this book will not work directly in browsers older than Internet Explorer 11 without being bundled using one of the above tools._
