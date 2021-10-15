---
title: "JavaScript Modules"
description: "Discover three.js is written in the latest version of JavaScript, ES6. Here, we introduce an important new ES6 feature: JavaScript modules. These allow us to split our code into multiple small pieces."
date: 2019-01-01
weight: 9904
chapter: "A.4"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/appendix/javascript-modules/src/main.js",
    "worlds/appendix/javascript-modules/src/export.js",
    "worlds/appendix/javascript-modules/index.html",
  ]
IDEClosedFolders: []
IDEStripDirectory: "worlds/appendix/javascript-modules/"
IDEActiveDocument: "src/export.js"
IDESwitchImportsAllow: false
---

# JavaScript Modules

{{% note %}}
document dynamic import and import from node_modules
{{% /note %}}

{{< figure src="app-logos/javascript.png" alt="JavaScript logo" lightbox="false" class="tiny left noborder" >}}

Since the release of JavaScript version ES6 in 2015 and the switch to a yearly release schedule, the JavaScript language has been reborn as a powerful, full-featured language that is both fun and easy to use. The need for backward compatibility means that there are still a few clunky areas, but overall the language is in a good place now. We have been referring to these new features {{< link path="book/appendix/javascript-reference/#old-school-and-modern-javascript" title="modern JavaScript" >}}, and we'll continue to do that here.

**Perhaps _the_ most important new feature added to JavaScript recently is the ability to split our code up into many small modules.** Using old-school JavaScript, we either had to write everything in one huge file, sometimes thousands of lines long, use a non-standard solution such as [browserify](http://browserify.org/) or [require.js](https://requirejs.org/), or include lots of separate `<script>` elements in our HTML files.

The new "official JavaScript modules" are called [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), and using them, we can break our app down into discrete components, and put each of these components into a separate file. Doing so leads to a huge improvement in code style and re-usability.

As with our {{< link path="/book/appendix/javascript-reference/" title="previous chapter on JavaScript" >}}, we're won't attempt a complete description of ES6 modules here. We'll only cover the bits you need to know to get through this book.

**When writing modular JavaScript, each file is a module**. So, we may refer to a module by its file name, for example, _**main.js**_, or simply as the _main_ module.

## Modules in Other Environments

Modules are an official feature of JavaScript so they will be supported everywhere... eventually. All modern browsers now support ES6 modules, however, Node.js has been slow to catch up. Fortunately, as of Node v14, ES6 modules are fully supported. However, when using older node versions, or very old browsers, you may need to do additional work to get modules working.

## Modular Software Design

Modular software design opens up a new world of possibilities for structuring an application. Each module we create should have a single, well-defined responsibility. Additionally, each module should be self-contained, so far as possible, and rely on little or no knowledge of other modules.

These are tried and tested design patterns, known as [_the single responsibility principle_](https://en.wikipedia.org/wiki/Single_responsibility_principle), [_loose coupling_](https://en.wikipedia.org/wiki/Loose_coupling), and [_high cohesion_](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>). A well-designed module has a single responsibility and is both loosely coupled and highly cohesive.

In other words, each module should do one thing only, and do that well, without relying on outside help. High cohesion means that the functions inside a module logically belong together. When writing code in this way, each module deals with a tiny fraction of the overall complexity, and even though our applications may grow and become complex over time, at any moment we should be dealing with just a few simple modules.

## ES6 Module Syntax: `import` and `export`

ES6 modules introduced two new keywords to JavaScript: [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export). These allow us to write code in one file, `export` it, and then `import` it for use in a different file.

We'll illustrate this here by exporting a variable called `x` from a file named _**export.js**_.

{{< code lang="js" linenos="false" caption="export.js" >}}
const x = 'hello!';

export { x };
{{< /code >}}

Later, we can import this variable into _**main.js**_, and then log the value to the console or use it in a calculation.

{{< code lang="js" linenos="false" caption="_**main.js**_" >}}
import { x } from './export.js';

console.log(x); // -> hello!
{{< /code >}}

If you open up the inline IDE, you'll see that we have set up these two files for you. You can use the IDE to test out the rest of the examples on this page.

### Import and export Statements can be Placed Anywhere in Module Scope

We don't have to wait until the end of the file to perform an export. Instead, we can do it immediately when we declare the variable:

{{< code lang="js" linenos="false" caption="export.js: you can export from anywhere in module scope" >}}
export const x = 'hello!';
{{< /code >}}

We can place `import` and `export` statements anywhere {{< link path="book/appendix/javascript-reference/#scope-and-closures" title="in module scope" >}}.

{{< code lang="js" linenos="false" caption="Import and export statements can be placed anywhere in module scope" >}}
export const x = 'hello!';

import { someVariable } from './export2.js';

console.log('Hey there!');

export class Cat {
...
}

import { anotherVariable } from './export2.js';

export const y = 'goodbye';
{{< /code >}}

However, we can't import or export while in function or block scope.

{{< code lang="js" linenos="false" caption="Export statements must be in module scope, never function or block scope" >}}
const x = 'hello!';

function thisWontWork() {
export { x };
//=> Uncaught SyntaxError: Unexpected token 'export'
}
{{< /code >}}

{{< code lang="js" linenos="false" caption="Likewise, import statements" >}}
function thisWontWork() {
import { x } from './export.js';
//=> Uncaught SyntaxError: Unexpected token '{'
}
{{< /code >}}

In this book, for clarity, we'll always place `import` statements at the top of a module and `export` statements at the bottom.

{{< code lang="js" linenos="false" caption="We will always place import statements at the top and export statements at the bottom." >}}
import { someVariable } from './export2.js';

const x = 'hello!';

class Cat {
...
}

export { x, Cat }
{{< /code >}}

### Relative Import URLs

So far, we've been using relative URLs to import and export between the _**main.js**_ and _**export.js**_ files, which both reside in the _**src/**_ folder. We also use a relative URL in the `<script>` tag in _**index.html**_. You can tell when an import is relative because it will start with `./` or `../`.

We've placed _**export.js**_ in the same directory as _**main.js**_, so we're using `./`. If we had placed it in a subfolder called `exported`, for example, the import statement would look like this:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing from the exported folder" >}}

```js
import { x } from "./exported/export.js";

console.log(x); // -> hello!
```

{{< /code >}}

### Importing from Other Websites

You can also import from other websites like a CDN by specifying the full web address of the module.

We use this style in {{< link path="book/introduction/get-threejs/#approach-2-link-to-the-files-from-a-cdn" title="" >}} where we show you how to import three.js from a CDN (content delivery network).

{{< code lang="js" linenos="false" caption="Importing modules from another website" >}}

```js
import { Camera } from "https://cdn.skypack.dev/three@0.132.2";
```

{{< /code >}}

For the rest of this chapter, to keep things simple, we'll stick with relative paths. For more info on how URLs work on the web, refer to [a quick primer on URLs and paths](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#A_quick_primer_on_URLs_and_paths) on MDN.

### Importing from Node Modules (NPM or YARN)

If you're using a package manager like NPM or Yarn, you can install packages into the _**node_modules**_ folder:

{{< code lang="bash" linenos="false" linenostart="0" hl_lines="" caption="Installing the three package with NPM (run this on a command line after installing Node)" >}}

```js
npm install three
```

{{< /code >}}

Once you do this, you'll find _**three.module.js**_ in the _**node_modules/three/build**_ folder. If you like, you can import it directly from there:

{{< code lang="js" linenos="false" caption="Importing directly from node_modules (possible, but not common)" >}}
import { Camera } from './node_modules/three/build/three.module.js'
{{< /code >}}

However, it's more common to use a bundling tool such as Rollup.js, Parcel, or Webpack in conjunction with a package manager. These bundlers follow a convention of allowing you use the package name as a shortcut when importing (in this case, the package name is `three`). If you are using a bundler, these are equivalent:

{{< code lang="js" linenos="false" caption="When using a bundler, these are equivalent" >}}

```js
import { Camera } from "./node_modules/three/build/three.module.js";

import { Camera } from "three";
```

{{< /code >}}

For now, remember that if you see an import that's not a relative import or a website import, but instead start with a package name like `three`, it means the code is designed to be used with a bundler and you will not be able to run it directly.

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="These import statements can be run directly in the browser" >}}

```js
import { Camera } from "./node_modules/three/build/three.module.js";

import { Camera } from "https://cdn.skypack.dev/three@0.132.2";

import { x } from "./exported/export.js";

import { x } from "../../../scripts/test.js";
```

{{< /code >}}

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="These import statements require a bundler" >}}

```js
import { Camera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { throttle, debounce } from "lodash-es";
```

{{< /code >}}

There's a lot more to using a bundler than this, which we won't get into here. However, to keep our code clean, in most of the code examples in this book, including in the editor, we will use `import { ... } from 'three'`.

### Named Exports

The presence of `{}` around `x` means that this is a **named export**. To import `x` we must refer to it by name, although once imported we can rename it if we need to.

You can have any number of named exports in a file. For example, here's a file that exports twenty-six names, one for every letter of the alphabet (although we've skipped f-y for brevity):

{{< code lang="js" linenos="false" caption="export.js: exporting a name for every letter of the alphabet" >}}
const a = 'Abella';
const b = 'Bertrand';
const c = 'Courtney';
const d = 'Dewi';
const e = 'Eilinora';
...
const z = 'Zarathustra';

export {
a,
b,
c,
d,
e,
...
z,
};
{{< /code >}}

We can import all of these named exports at the same time. Here, we import all twenty-six names (again, skipping the lines f-y):

{{< code lang="js" linenos="false" caption="_**main.js**_: import all twenty-six names" >}}
import {
a,
b,
c,
d,
e,
...
z,
} from './export.js';

console.log(a); // Abella
console.log(b); // Bertrand
console.log(c); // Courtney
console.log(d); // Dewi
...
{{< /code >}}

#### Renaming Named Exports with the `as` Keyword

We can rename named exports using the `as` keyword, either when they are exported:

{{< code lang="js" linenos="false" caption="export.js: renaming variables on export" >}}
const a = 'Abella';
const b = 'Bertrand';
const c = 'Courtney';
const d = 'Dewi';
const e = 'Eilinora';
...
const z = 'Zarathustra';

export {
a as abella,
b as bertrand,
c as courtney,
d as dewi,
e as eilinora,
...
z as zarathustra,
};
{{< /code >}}

Or, when they are imported:

{{< code lang="js" linenos="false" caption="_**main.js**_: renaming exports on import" >}}
import {
a as abella,
b as bertrand,
c as courtney,
d as dewi,
e as eilinora,
...
z as zarathustra,
}; from './export.js';

console.log(abella); //=> Abella
console.log(bertrand); //=> Bertrand
console.log(courtney); //=> Courtney
console.log(dewi); //=> Dewi
...
{{< /code >}}

#### Using Namespaces with Named Imports

Importing a lot of things from a single module like this can get a bit messy. In these cases, it can be useful to import everything at once from a given module and save it to a **namespace**. We can do this using `import * as <namespace>`:

With a single line, we can import all twenty-six names from the previous file. We can then access them with dot notation:

{{< code lang="js" linenos="false" caption="_**main.js**_: importing to a namespace" >}}
import \* as NAMES from './export.js';

console.log(NAMES.a); //=> Abella
console.log(NAMES.b); //=> Bertrand
console.log(NAMES.z); //=> Zarathustra
{{< /code >}}

Note that we can't rename the individual exports when doing this. It's a common convention to use all capitals for namespaces, but it's not required.

##### The `THREE` Namespace

You will often see the `THREE` namespace used when working with three.js. The [three.js core contains hundreds of exports](https://github.com/mrdoob/three.js/blob/master/src/Three.js). It's highly unlikely you'll need to use all of them in a single file, but for quick tests, you can import them all at once and store them in a namespace.

{{< code lang="js" linenos="false" caption="_**main.js**_: importing the entire three.js core to the THREE namespace" >}}
import \* as THREE from 'three';
{{< /code >}}

Until the switch to modules, to use three.js you would include the core _**build/three.js**_ file in your HTML using a `<script>` tag, and the `THREE` namespace would become globally available.

Now that we've switched to modules, we try to avoid using global namespaces. But the `THREE` namespace has been associated with three.js for years, and as the examples around the web are gradually converted to modules, it's faster to continue using the namespace.

In this book, we'll avoid using namespaces like `THREE`, preferring to import components as we need them. This will train us to keep modules focused. Rather than having a huge number of unused components available, we'll only have the ones we need in any given module.

### Default Exports

Unlike **named exports**, **default exports** allow us to export a value without naming the export. To create a default export, omit the `{}` braces and add the `default` keyword:

{{< code lang="js" linenos="false" caption="export.js: a default export" >}}
const x = 'hello!';

export default x;
{{< /code >}}

Default exports don't have names. Instead, we can name them whatever we like on import. Here, we import the variable `x` into the file _**main.js**_ and call it `hello`.

{{< code lang="js" linenos="false" caption="_**main.js**_: importing a default export" >}}
import hello from './export.js';
{{< /code >}}

The variable was originally called `x`, but that doesn't matter on import for a default export.

You can only have one default export per file, otherwise, there's no way for JavaScript to know what export we're referring to. You _can_ mix default and named exports in a single file, but we'll avoid doing so. In fact, throughout this book, we'll avoid using default exports completely.

## Referencing JavaScript Modules from HTML

As we mentioned above, when using JavaScript modules, every file is a module. However, modern JavaScript, including ES6 modules, is built on top of old-school JavaScript, and all the old syntax and ways of doing things still work. In old-school JavaScript, files were not modules.

This means, when we pass the _**main.js**_ module over to the browser, it can be interpreted in one of two ways:

1. It's an old-school "normal" JavaScript file.
2. It's a fancy new JavaScript module.

There's no way to tell from a glance at the file name which interpretation is correct so we need to tell the browser.

To reference an old-school JavaScript file from HTML we use {{< link path="book/appendix/html-and-css-reference/#the-src-attribute" title="the `<script>` element" >}}. For example, here we include an old-school, non-modular JavaScript file called _**app.js**_ in _**index.html**_:

{{< code lang="html" linenos="false" caption="_**index.html**_: using a script tag to include an old-school JavaScript file" >}}

<script src="./src/app.js"></script>

{{< /code >}}

To tell the browser that the file is a module, we need to add the `type="module"` attribute. Here, we include our fancy new _**main.js**_ module.

{{< code lang="html" linenos="false" caption="_**index.html**_: importing the main.js module" >}}

<script type="module" src="./src/main.js"></script>

{{< /code >}}

We can also write JavaScript directly in an HTML `<script>` element:

{{< code lang="html" linenos="false" caption="_**index.html**_: an inline script element" >}}

<script>
  const x = 'welcome to JavaScript!';
</script>

{{< /code >}}

However, that's strictly old-school JavaScript. No `import` or `export` allowed. But, if we add the `type="module"` attribute, we can then write `import` statements directly in HTML. For example, we can bypass _**main.js**_ and import the variable `x` directly from _**export.js**_ into _**index.html**_.

{{< code lang="html" linenos="false" caption="_**index.html**_: an inline module script element" >}}

```js
<script type="module">
  import {x} from './src/export.js'; console.log(x);
</script>
```

{{< /code >}}

## Dynamic Imports

We'll finish up this chapter with a brief look at [**dynamic imports**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports). So far in this chapter, we've used **static imports**, meaning they are evaluated at **load time**. By contrast, **dynamic imports** are evaluated at **run time**.

**Static imports use the `import` statement, while dynamic imports use the `import()` function.**

With dynamic imports you can optionally load a module during the execution of your code. This might be useful, for example, if you want to create an app that can load any of the [thirty or so 3D asset formats that three.js supports](https://github.com/mrdoob/three.js/tree/master/examples/jsm/loaders) (there are more than thirty loaders there, but some are for textures and other things). Altogether, these loaders comprise around one megabyte of JavaScript, which is a lot to force upon a poor user if they only need a fraction of it. Instead, you can wait until the user sends you a model file, examine the file and say, "_ayup, that there's an FBX file, better be fetchin' tha `FBXLoader`_":

{{< code lang="js" linenos="false" hl_lines="" caption="Dynamically importing the FBXLoader at run time" >}}

```js
import("./vendor/three/examples/jsm/loaders/FBXLoader.js").then((module) => {
  // use the loader module to load the model
});
```

{{< /code >}}

Again, take to note that we're using the **dynamic `import()` function**, _not_ a **static `import` statement** which would look like this:

{{< code lang="js" linenos="false" hl_lines="" caption="Statically importing the FBXLoader at load time" >}}

```js
import { FBXLoader } from "./vendor/three/examples/jsm/loaders/FBXLoader.js";
```

{{< /code >}}

As we'll see in the next chapter, `.then` means that `import()` returns a {{< link path="/book/appendix/asynchronous-javascript/#promises" title="Promise" >}}. Even better, we can use {{< link path="/book/appendix/asynchronous-javascript/#async-await" title="the `await` keyword" >}}, which we'll also cover in the next chapter:

{{< code lang="js" linenos="false" hl_lines="" caption="Dynamically importing the FBXLoader at run time using async/await" >}}

```js
const module = await import("/vendor/three/examples/jsm/loaders/FBXLoader.js");
// use the loader module to load the model
```

{{< /code >}}

That's it for JavaScript modules. Next up, we'll examine another important aspect of JavaScript: asynchronous programming, otherwise known as _how to prevent your app grinding to a halt while you wait for something to load._
