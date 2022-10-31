---
title: "JavaScript 参考"
description: "要创建 three.js 应用程序，您需要了解一些JavaScript。 本章是我们在本书中使用的所有语言部分的参考。"
date: 2019-01-01
weight: 9902
chapter: "A.2"
available: true
showIDE: true
IDEFiles:
  [
    "worlds/appendix/javascript-reference/src/main.js",
    "worlds/appendix/javascript-reference/index.html",
  ]
IDEClosedFolders: []
IDEStripDirectory: "worlds/appendix/javascript-reference/"
IDEActiveDocument: "src/main.js"
IDESwitchImportsAllow: false
---

# JavaScript Reference

{{< figure src="app-logos/javascript.png" alt="JavaScript logo" lightbox="false" class="tiny right noborder" >}}

In the previous chapter, we created a very basic web page consisting of one HTML file and one CSS file. Now, we'll turn our attention to JavaScript which is the main language we'll use throughout this book.

Over the next four chapters, we'll cover _everything_ you need to know about JavaScript to follow the code in this book.

These chapters are for you:

- If you have never used JavaScript before.
- If you are familiar with older versions of JavaScript and you're wondering what these fancy new modules and arrow functions are all about.
- If you're making the switch from another language like Python or Java.
- If you're already familiar with JavaScript but you want a refresher on the parts we'll be using throughout the book.

These chapters are intended to be a lighting quick introduction to bring you up to speed so you can proceed with this book, no matter your background. If you do want to go deeper on any topic, the excellent and in-depth tutorials on the [Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/docs/Web) are a good place to start.

In this chapter, we'll start by exhaustively (and perhaps exhaustingly) exploring the syntax you need to know to follow the main text. You may find it more useful to use it as a reference rather than attempting to read through from start to finish. You will be referred here from the main text whenever we encounter a new JavaScript feature.

This chapter is not a complete JavaScript reference. The JavaScript used in this book is only a fraction of the entire JavaScript API, we make no attempt to explain [**prototypical inheritance**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain), and we'll only briefly touch on [**scope and closures**](#scope-and-closures) which are arguably the trickiest parts of JavaScript to understand.

## Old-School and Modern JavaScript

Throughout this section, we'll frequently refer to _old-school_ and _modern_ JavaScript. Here, _modern_ means any features added to JavaScript in version ES6 (released in 2015) or later. _Old-school_ refers to any syntax that existed prior to that, from versions ES1 through ES5. The reason for this distinction is that when using a feature of modern JavaScript, you have to take care to ensure it has been implemented by browsers, although fortunately this is becoming less and less of an issue as browser vendors catch up with the spec.

Modern JavaScript is also referred to as _ESNext_. All the syntax from old-school JavaScript still works, so we can consider ESNext to be a superset of old-school JavaScript.

## JavaScript Modules and the Entry Point

All the JavaScript we write will go inside files with `.js` extensions. Rather than put everything into one file, we'll split our code into many small modules, a topic to which we devote [an entire chapter]({{< relref "/book/appendix/javascript-modules" >}} "an entire chapter") since modules are part of modern JavaScript and may be unfamiliar to many people.

Once we've split up our application in this manner, we'll have one main JavaScript file that references and coordinates the other JavaScript modules. This main file is called the **entry point** of our application, and we will name it _**main.js**_ (it's also common to call this _**index.js**_ or _**app.js**_).

## Referencing JavaScript Modules from HTML

Next, we need to connect _**main.js**_ to our minimal HTML page so that it will run when the page loads. We touched on this [in the previous chapter]({{< relref "/book/appendix/html-and-css-reference#the-src-attribute" >}} "in the previous chapter").

Here, we have placed the _**main.js**_ file in a folder called _**src/**_ right next to the _**index.html**_ file.

To load this file, we'll add a `<script>` element with a `src` attribute to [the head section]({{< relref "/book/appendix/html-and-css-reference#the-head-element" >}} "the head section") of _**index.html**_. The `src` attribute will reference _**main.js**_.

Open up the inline code editor on this page to see this in action.

{{< code lang="html" linenos="false" caption="Referencing main.js from index.html" >}}

<script type="module" src="./src/main.js"></script>

{{< /code >}}

This file also has a `type="module"` attribute to let the browser know that we're splitting our code up into modules.

### Inline Scripts

You can also write JavaScript directly in HTML like this:

{{< code lang="html" linenos="false" caption="An inline script element that contains old-school JavaScript" >}}

<script>
  console.log('Welcome to JavaScript!');
</script>

{{< /code >}}

Inline scripts can also have the `type="module"` attribute:

{{< code lang="html" linenos="false" caption="An inline script element that contains modern JavaScript" >}}

<script type="module">
  console.log('Welcome to JavaScript Modules!');
</script>

{{< /code >}}

We'll never write inline code in this book. It's cleaner to keep your JavaScript in a separate file.

However, to the browser, there's no difference between code written inline or in a separate file. Any code from this chapter will work the same way in either case.

## The Developer Console

Yet another place you can run JavaScript code is the [browser console]({{< relref "book/appendix/dom-api-reference#the-browser-developer-console" >}} "browser console"). Press F12 to open it now, if you're reading this from a device with a keyboard.

The console provides a handy scratchpad for testing out ideas while you work on a website. If you like, you can open the console now and test out the code in this chapter while you read.

## Comments

Single line comments in JavaScript start with a double forward slash: `//`

{{< code lang="js" linenos="false" >}}
// This is a comment - anything written here will be ignored
// This is the second line of the comment
{{< /code >}}

We can also write multi-line comments, starting with `/*` and ending with `*/`.

{{< code lang="js" linenos="false" >}}
/\*

This is a multi-line comment.

Everything inside here gets ignored

\*/
{{< /code >}}

## Keywords

In general, you can name things whatever you like when writing JavaScript. You can even use emojis or hieroglyphs. However, some keywords are reserved. These are used to access functionality of the language, for example `var`, `let`, `const`, `function`, `Object`, `String`, `Number`, `class`, `this`, and so on. We'll encounter many of them throughout this chapter.

## Operators

Most special characters that can be typed using a standard keyboard are reserved as operators, for example `+`, `-`, `*`, `/`, `%`, `!`, `(`, `)`, and so on. We'll cover many of these in more detail below, and [this page has a complete list](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators).

## Capitalization Matters

The capitalization of a word matters in JavaScript. This applied both to reserved keywords and names you create. For example, `String` is a reserved keyword, but `string` is not. If you create an object called `Cat`, it will be different from an object called `cat`.

## Variables: `let`, `const`, `var`

Variables are named areas of the computer's memory. We can save some data (a _value_) to a variable and then use the name to access it later. In JavaScript, variables don't have a specific data type, so we can save any type of data such as strings, numbers, arrays, objects, and functions, to any variable.

Variable names cannot start with numbers. `23cats` is not a valid variable name, but `cats23` is.

Variables names can start with some special characters (as long as they are not used for operators). The two non-reserved special characters that can be typed with a standard keyboard are `$` and `_`, so variables names like `$cats`, `_cats` are common.

### Naming Conventions

While the JavaScript spec doesn't include any special rules for naming things beyond the ones described above, in practice certain conventions are often used. For example, when a function name starts with a capital letter (`Cats`), it is usually a class or a constructor (more on that below), while a completely capitalized word is often used for mathematical constants (`EPSILON`, `PI`, `SQRT2`, and so on). Variables names that start with `_` are usually intended to be private (not accessible from outside the current scope, module, or file).

#### Camel Case

Variable names are usually written in [**CamelCase**](https://en.wikipedia.org/wiki/Camel_case): `aHerdOfCats`, `aKindleOfKittens`.

{{< code lang="js" linenos="false" caption="Variable names are almost always written in CamelCase" >}}
const myName = 'Lewy';

let modelHasLoaded = false;
{{< /code >}}

### `var`

Old-school JavaScript had one way of defining a variable, using the keyword [`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var):

{{< code lang="js" linenos="false" caption="Old-school JavaScript variables used the var keyword" >}}
var a = 'hello'; // a string

var b = 5; // a number

var e = [1, 2, 3, 4, 'f', 'g', 'h', 'i']; // an array containing numbers and strings
{{< /code >}}

`var` has some technical issues which we won't get into here, so the ES6 release of JavaScript introduced two new ways of defining variables: `let` and `const`.

You can still use `var` for backward compatibility, but you don't need to anymore, and we'll never use `var` in this book.

### `const`

[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) is used to assign data to a variable that **cannot be changed** within the current scope ([we'll explain scope below](#scope-and-closures)).

{{< code lang="js" linenos="false" caption="The const keyword the first of two ways of defining variables in modern JavaScript" >}}
const x = 5; // x must always equal 5 within the current scope
{{< /code >}}

Attempting to change it later will cause an error:

{{< code lang="js" linenos="false" caption="Variables defined using const cannot be changed" >}}
x = 6; // Error! Can't update constant variable!
{{< /code >}}

### `let`

When using [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) to define a variable you are saying that the value may be changed sometime in the future:

{{< code lang="js" linenos="false" caption="The const keyword the second way of defining variables in modern JavaScript" >}}
let y = 5;
{{< /code >}}

Unlike with `const`, you can change the value later:

{{< code lang="js" linenos="false" caption="Variables defined using let can be changed" >}}
y = 6; // no error, y now holds the number 6
{{< /code >}}

`const` will always be our first choice for assigning variables. We'll only use `let` if we are certain that a variable needs to change later.

Aside from any optimizations that the JavaScript engine might perform, it's useful to look at code and know at a glance if a variable will have the same value everywhere, or might change later in the code.

### Dynamic Typing

JavaScript is a _loosely_ or _dynamically_ typed language. In short, this means that we can assign any data type to a variable:

{{< code lang="js" linenos="false" >}}
let x = 5; // x holds a number

// sometime later
x = 'lemon'; // x now holds a string.
{{< /code >}}

This makes the language flexible, but it can also lead to confusion as it puts the responsibility on you, the programmer, to remember what kind of data a variable holds.

One of the benefits of `const` is that you know a variable will always hold the initial data type that you assigned to it.

## Primitive Data Types

Until recently there were only five [primitive data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) in JavaScript: `Boolean`, `Number`, `String`, `Null`, and `Undefined`.

Two new types, [Symbol](https://developer.mozilla.org/en-US/docs/Glossary/Symbol) and [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt), were added recently. We won't need to use those in this book though. Let's examine the other five now.

### Boolean

[Booleans](https://developer.mozilla.org/en-US/docs/Glossary/Boolean) are the keywords `true` and `false`. We can use them as _flags_ to let us know whether something is switched on or not, has been completed, needs to be updated, and so on:

{{< code lang="js" linenos="false" >}}
let shouldWeUpdateTheThing = false;

let lightIsOn = true;

let modelHasLoaded = true;

let animationIsPlaying = false;
{{< /code >}}

Notice that the variables we have saved these Booleans into are all declared using `let`. Since they are flags, we'll usually want to change the value at some point. For example, when we start to play the animation we'll set `animationIsPlaying` to `true`, when we switch off the light we'll set `lightIsOn` to `false`, and so on.

Booleans also returned by the [**comparison operators**](#comparison-operators) which we'll introduce in a few moments.

### Number

JavaScript does not differentiate between an **integer** such as -23, 0, or 100 and a **floating-point number** such as 0.05, 23.0002, or 4.5. All numbers are stored as floating points. There's no such thing as an integer value in JavaScript. In other words, 5 and 5.0 are the same value. This is not the case in every programming language.

All numbers are represented using the [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number) data type. The Number data type can hold any number between $-2^{53} - 1$ and $2^{53} - 1$ ($-9007199254740991$ and $9007199254740991$).

#### Special Numbers

There are a couple of special constants within the Number data type that you might encounter: [`Infinity`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity), [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) (Not a Number), and [`Number.EPSILON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON) which represents the smallest possible value that can be represented in JavaScript.

#### Working with Floating-Point Data

All numbers in JavaScript are floating-point numbers, and as with any programming language, care must be taken to avoid _floating-point errors_.

**Some decimal numbers cannot be represented accurately in binary, and this results in a common class of errors called _floating-point errors_**.

For example, $12.9 \times 2.3 = 29.67$, right?

Not according to floating-point arithmetic!

{{< code lang="js" linenos="false" caption="If you check the console, you won't see the result you expect!" >}}
const result = 12.9 \* 2.3;

console.log(result); // -> 29.669999999999998
{{< /code >}}

We expect $29.67$, but we get $29.669999999999998$. This is an error of approximately $0.000000000000001$, or $1 \times 10^{-15}$.

Of course, is an _exceedingly_ tiny number. In practice, in most cases, you won't notice this error.

However, there are some situations where this is a problem:

1. Comparing the results of two mathematical operations together.
2. Using the result as input for another calculation.

In the second case, if you perform many thousands of calculations, which is common when performing animations, for example, the error will increase with every new calculation. Within a couple of seconds, you may notice your animations have gone out of sync.

This is a somewhat complex topic and we won't get into it more deeply here. If you want to look explore this further, here's [a simple article](https://floating-point-gui.de/basic/), and [a slightly less simple article with some techniques for resolving the problem](http://adripofjavascript.com/blog/drips/avoiding-problems-with-decimal-math-in-javascript.html).

### String

The [String](https://developer.mozilla.org/en-US/docs/Glossary/String) data type represents arrays of letters, numbers, and other characters as well as methods for manipulating them.

Strings which can be defined using single quotes:

{{< code lang="js" linenos="false" caption="Strings can be defined with single quotes" >}}
const a = 'Hi there!';
{{< /code >}}

Or using double quotes:

{{< code lang="js" linenos="false" caption="... or double quotes" >}}
const b = "I'm a bumblebee!";
{{< /code >}}

#### Escape Characters

When using double quotes we can write the word `"I'm"` which contains a single quote character.
To write this using single quotes, we have to use a backslash [**escape character**](https://en.wikipedia.org/wiki/Escape_character#JavaScript):

{{< code lang="js" linenos="false" caption="Escaping characters" >}}
const b = 'I\'m a bumblebee';
{{< /code >}}

#### Template Strings

A new way of creating strings became available in ESNext JavaScript, known as [**template literals**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) or **template strings**. These are defined using _backticks_ rather than quotes, and allow us to do a few extra things. For example, template strings can span multiple lines:

{{< code lang="js" linenos="false" caption="A template string spanning multiple lines" >}}
const x = ` A multi-line string like this would've been much harder to write in JavaScript up until a couple of years ago ^_^`;
{{< /code >}}

We can also use template strings to include variables and calculation in our strings, by placing them inside `${}`.

{{< code lang="js" linenos="false" >}}
const val = 5;

const string = `The value is ${val}`;
{{< /code >}}

This makes combining and adding strings together much simpler. To display the result of adding two numbers in old-school JavaScript we'd have to do all of this:

{{< code lang="js" linenos="false" >}}
const a = 2;
const b = 3;

const answer = 'The sum of ' + a + ' plus ' + b + ' is: ' + (a + b) + '.';
{{< /code >}}

Phew!

Doing this with template strings is much simpler:

{{< code lang="js" linenos="false" >}}
const answer = `The sum of ${a} plus ${b} is ${a + b}.`;
{{< /code >}}

### Null and Undefined

The next two primitive data types, [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) and [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined), are similar in JavaScript. Both mean "nothing here".

The main difference is that `undefined` get assigned automatically whenever some value is not found, whereas `null` only happens when the programmer types in `null` somewhere in the code.

If you ask JavaScript "_what is_ `x`_?_" but you've never given any value to `x`, then it will tell you "`x` _is `undefined`_".

By contrast, you might set `let x = null` somewhere in your code to let yourself know that `x` has not been given a value yet.

Note that the name of the data types are **Null** and **Undefined**, starting with capital letters, but when we use them in our code, they start with small letters: `null` and `undefined`.

## Objects

[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Objects) is the only **non-primitive data type** in JavaScript. Non-primitive means that objects are made up of collections of other data types.

Objects in JavaScript are defined using curly braces: `{}`, and hold collections of data in `[key, value]` pairs.

{{< code lang="js" linenos="" caption="The Object data type" >}}
const object = {};
{{< /code >}}

**Everything that is not one of the above primitive data types is an object, including functions, arrays, and classes.** This makes Object the most important data type in JavaScript, and you should take the time to understand it well. For more details check out the [Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects) guide on MDN.

When we create a function, array, class, or any other entity that derives from object, we immediately have access to all the properties, methods, and other functionality of objects.

The `object` we created above is not very interesting, since it doesn't contain any data. Here, we are creating an object called `newObject` with two keys `x` and `y` which hold values `5` and `'hello'` respectively.

{{< code lang="js" linenos="false" >}}
const newObject = {
x: 5,
y: 'hello',
};
{{< /code >}}

**Keys** are also referred to as **property names**, and **values** are also referred to as **properties**. That means that `x` and `y` are property names, and `5` and `'hello'` are properties.

### Keys/Property Names

Property names are always strings, whereas properties can be any data type (numbers, strings, arrays, other objects, functions, `null`, `undefined`, etc. ).

However, we don't need to put quotes around the property names, as we usually do when defining string - they are implicit. But you _can_ add quotes if you like:

{{< code lang="js" linenos="false" caption="An object containing some data" >}}
const myObject = {
'x': 5,
'y': 'hello',
};
{{< /code >}}

Also, if you want to add certain characters like spaces or `-` to your property names, you will need to use quotes:

{{< code lang="js" linenos="false" >}}
const myObject = {
x: 5,
hello-kitty: 'meow',
};

// Uncaught SyntaxError: Unexpected token '-'
{{< /code >}}

If we wrap `hello-kitty` in quotes, we can use it as a property name:

{{< code lang="js" linenos="false" >}}
const myObject = {
x: 5,
'hello-kitty': 'meow',
};
{{< /code >}}

We can store functions and arrays in objects:

{{< code lang="js" linenos="false" >}}
const myObject = {
x: 5,
y: 'hello',
variousNoises: ['meow', 'woof', 'grrr', 'arg'],
printMeow: function() {
console.log('meow-meow')
}
};
{{< /code >}}

When a function is stored in an object like this we'll refer to it as a **method**.

More on arrays and functions below.

### Accessing data in Objects: [Dot Notation and Bracket Notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) {#dot-notation}

The first and most common way of accessing data in objects is to use **dot notation**:

{{< code lang="js" linenos="false" caption="Accessing values using Dot Notation" >}}
const n = myObject.x; // variable n now holds the value 5
{{< /code >}}

You will often see methods being called using dot notation. For example, to call the `printMeow` method:

{{< code lang="js" linenos="false" >}}
myObject.printMeow();
// meow-meow
{{< /code >}}

Alternatively, we can use **bracket notation**, in which case we will pass in the key as a string.

{{< code lang="js" linenos="false" caption="Accessing values using Bracket Notation" >}}
const p = myObject['y']; // now variable p holds the value 'hello'
{{< /code >}}

Bracket notation is used when you need to use a variable to access the data:

{{< code lang="js" linenos="false" >}}
const cats = {
fineFeline: 'bengal',
};

const x = 'fine';
const y = 'Feline';

const z = x + y; // z = 'fineFeline'

const result = cats[z]; // result now holds the string 'bengal'
{{< /code >}}

You also need to use bracket notation to access property names with weird characters like our `hello-kitty` example above.

Attempting to access that property name using dot notation will cause an error:

{{< code lang="js" linenos="false" >}}
myObject.hello-kitty;
// Uncaught ReferenceError: kitty is not defined
{{< /code >}}

Bracket notation to the rescue!

{{< code lang="js" linenos="false" >}}
myObject['hello-kitty'];
// "meow"
{{< /code >}}

### Adding and Changing Object Data

We can add more data to an object after we have created it, and we can also change existing data. Once again, we can use either dot or bracket notation to do this.

Here, we add a key/value pair to an object using dot notation:

{{< code lang="js" linenos="false" >}}
const cats = {
fineFeline: 'bengal',
};

// add a new key/value pair
cats.fluffBall = 'persian';

// assign a new value to an existing key
cats.fineFeline = 'maineCoon';
{{< /code >}}

Note that, even though we defined the `cats` variable using `const`, we can still change data _inside_ the object. However, we cannot assign a completely new value to `cats`:

{{< code lang="js" linenos="" >}}
cats = 6; // Error! Can't update constant variable!
{{< /code >}}

### The `delete` Operator

You can also delete a key from an object using the [delete operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete):

{{< code lang="js" linenos="false" >}}
delete cats.fluffBall;
{{< /code >}}

## Arrays

[Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) in JavaScript are defined using square brackets: `[]` and hold a list of values. These values can be things like numbers, strings, other arrays, other objects, functions, and so on. Anything that can be stored in an object can also be stored in an array (since arrays are derived from objects):

{{< code lang="js" linenos="false" >}}
const myArray = ['hello', 'goodbye', 45, 23];
{{< /code >}}

We access data from an array using an index, starting at zero. In the above array, index zero holds the string `'hello'` and index three holds the number `23`.

We use bracket notation to access elements of an array at a given index:

{{< code lang="js" linenos="false" >}}
const x = myArray[0]; // x now holds the string 'hello'
const y = myArray[2]; // y now holds the number 45
{{< /code >}}

However, we cannot use dot notation with arrays:

{{< code lang="js" linenos="false" >}}
x = myArray.0; // Error!
{{< /code >}}

### Arrays are Objects

As we mentioned above, everything that is not a primitive data type in JavaScript is an object. That means that arrays must be objects. Array indices must be object property names and array values must be object properties.

This also means that the indices must be strings. Let's test that:

{{< code lang="js" linenos="false" >}}
const x = myArray['0']; // x now holds the string 'hello'
{{< /code >}}

Sure enough, array indices are strings. When we access an array using a number, for example `myArray[0]`, the quotes are added automatically for us.

Arrays have several methods to help with accessing or modifying the data they contain. Check out the [Arrays page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for a complete list.

We'll use `Array.push` quite a bit to add new items to the end of the array:

{{< code lang="js" linenos="false" >}}
const arr = []; // create an empty array

arr.push(2); // arr = [ 2 ]

arr.push('bumblebee', 'butterfly'); // arr = [ 2, 'bumblebee', 'butterfly' ]
{{< /code >}}

We can also find the length of the array using `Array.length`:

{{< code lang="js" linenos="false" >}}
const myArray = ['hello', 'goodbye', 45, 23];

const length = myArray.length; // length = 4;
{{< /code >}}

We can access the last element in the array using `length - 1` as the index:

{{< code lang="js" linenos="false" >}}
const lastElem = myArray[myArray.length - 1]; // lastElem = 23
{{< /code >}}

The `-1` is needed since arrays are indexed from zero, not one.

## Functions

Functions are defined using the `function` keyword and look like this:

{{< code lang="js" linenos="false" >}}
function () {
// do some stuff here
}
{{< /code >}}

This is an _anonymous function_, meaning that it has no name, and therefore no way for us to refer to it later.

### Naming Functions

Often it will be useful for us to give our functions a name so that we can pass them around in our code and use them later. We can name functions in two ways. First, we can assign the function to a variable:

{{< code lang="js" linenos="false" caption="We can save functions in variable" >}}
const functionSavedInVariable = function() {
// do some stuff
};
{{< /code >}}

Second, we can directly name the function:

{{< code lang="js" linenos="false" caption="We can give functions names" >}}
function namedFunction() {
// do some stuff
}
{{< /code >}}

### Calling Functions

We can _call_ or _invoke_ a function using either its name or the name of the variable that we assigned it to, followed by `()`. There's no difference in either case.

{{< code lang="js" linenos="false" caption="Calling functions" >}}
functionSavedInVariable();
namedFunction();
{{< /code >}}

### Empty Functions

Functions can be empty:

{{< code lang="js" linenos="false" caption="An empty function" >}}
function emptyFunction() {}
{{< /code >}}

This function does nothing, but it's often useful to write functions like this and fill them in later. By doing this, we can build up our code structure before we have fully worked out how a function will work.

When we create an empty function that we intend to replace later, we'll refer to it as a **placeholder function**.

### Function Parameters (and Arguments)

Function can take _parameters_:

{{< code lang="js" linenos="false" caption="To pass data into a function we define it with parameters" >}}
function add(a, b) {
const sum = a + b;
}
{{< /code >}}

Later, we can call this function with two _arguments_. Here the arguments are the numbers 1 and 2:

{{< code lang="js" linenos="false" caption="When we invoke the function we supply arguments: specific values for the parameters" >}}
add(1, 2);
{{< /code >}}

`a` and `b` are **parameters**, and `1` and `2` are **arguments**, but this distinction is not usually important and many people use the two terms interchangeably.

### The `return` Keyword

The `add()` function above is not very useful. It does add two things together, but it doesn't give us any way to see the results! Usually, we want a function to give us back some data, and for that, we need to use the `return` keyword.

{{< code lang="js" linenos="false" caption="To get data from a function we use the return keyword" >}}
function add(a, b) {
return a + b;
}

const x = add(1, 2); // x = 3
{{< /code >}}

A function will immediately exit when it encounters the `return` keyword and nothing else in the function will be processed:

{{< code lang="js" linenos="false" caption="The function will exit when it encounters a return statement" >}}
function useless(a, b) {
return;

const sum = a + b; // your program will never reach this line.
}
{{< /code >}}

In this function, we are not returning any data, which means the result of the function will be `undefined`:

{{< code lang="js" linenos="false" caption="A return statement without data will be undefined" >}}
const x = useless(1, 2); // x = undefined
{{< /code >}}

There's nothing wrong with doing this. Often, you want a function to exit without returning data.

### Pure and Impure Functions

Another way of getting data out of a function is to change the value of a variable defined outside the function, as in this somewhat contrived example:

{{< code lang="js" linenos="false" caption="An impure function changes the value of a variable defined outside the function" >}}
let x = 5;

function changeXImpure() {
x = 10;
}

changeXImpure(); // now x = 10
{{< /code >}}

When we change data from outside the function, we call the function _impure_. In most cases, you should avoid doing this as it makes your code harder to read.

Usually, it's easy to convert an impure function into a pure function.

{{< code lang="js" linenos="false" caption="A pure function returns any data but does not modify external variables" >}}
let x = 5;

function changeXPure() {
return 10;
}

x = changeXPure(); // now x = 10
{{< /code >}}

**Functional programming** is a programming style that requires you to only use pure functions. In this book, we'll take a pragmatic approach. We'll aim to write pure functions but if it seems like we're jumping through hoops to do so, we'll allow a couple of impure functions to slip in.

### Passing Data into Functions

Functions in JavaScript are **polymorphic**, meaning that they don't care what kind of data type you pass in.

Take a look at the `add` function again.

{{< code lang="js" linenos="false" caption="The add function" >}}
function add(a, b) {
return a + b;
}
{{< /code >}}

We can call this function with any data type.

For example, we can pass in numbers as we did above:

{{< code lang="js" linenos="false" caption="Calling the add function with two numbers" >}}
const x = add(1, 2);
// x = 3
{{< /code >}}

Or, we can pass in two strings:

{{< code lang="js" linenos="false" caption="Calling the add function with two strings" >}}
const x = add('caterpillar', 'butterfly');
// x = 'caterpillarbutterfly'
{{< /code >}}

Or a string and a number:

{{< code lang="js" linenos="false" caption="Calling the add function with a number and a string" >}}
const x = add(2, 'asparagus');
// x = "2asparagus"
{{< /code >}}

We can even add an object and a string:

{{< code lang="js" linenos="false" caption="Calling the add function with two strings" >}}
const x = {
a: 'kitty',
};

const y = 'goodbye';

const z = add(x, y);
// z = "[object Object]goodbye"
{{< /code >}}

JavaScript doesn't care. But look what happened we added the number `"2"` and the string `"asparagus"`. We got the string `"2asparagus"` since the number `2` was automatically converted to a string.

Even weirder, when we added the object and string together we got the string `"[object Object]goodbye"`! Huh?

What we have encountered here is **type coercion**. In short, when we tell JavaScript to add two values together, the values get converted to a data type suitable for addition. For mathematical operations like addition, the end result will be either a number or a string. We'll look at [type coercion](#type-coercion) more deeply when we're exploring comparison operators below.

The important thing to take away here is that JavaScript will let you add _anything_ to _anything_, but that doesn't mean you will always get a sensible result! Unless you know what you are doing, only add numbers to numbers or strings to strings.

What about that `"[object Object]goodbye"`? In this case, once again the object has been converted to a string. When an object gets converted to a string, it becomes the string `"[object Object]"`. Mystery solved, for now.

### Functions Are Objects

Just like arrays, functions are also objects. This means that [everything we wrote about objects](#objects) is true for functions as well. For example, we can create a new property (`[key, value]`) pair on a function:

{{< code lang="js" linenos="false" caption="Functions are objects so we can add new properties to them" >}}
function add(a, b) {
return a + b;
}

add.details = 'Adds the two arguments together';
{{< /code >}}

### Arrow Functions {#arrow-functions}

[Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) are a new kind of function available in modern JavaScript. These are similar to normal functions but have a shorter syntax.

Here's an anonymous arrow function:

{{< code lang="js" linenos="false" caption="An anonymous arrow function" >}}
() => {};
{{< /code >}}

Compare that to an anonymous normal function:

{{< code lang="js" linenos="false" caption="An anonymous 'normal' function" >}}
function() {};
{{< /code >}}

Let's create a subtract function to complement our add function above, written in arrow style:

{{< code lang="js" linenos="false" caption="A simple arrow function that subtracts the two arguments" >}}
const subtract = (a, b) => {
return a - b;
};
{{< /code >}}

Leaving out the curly braces makes the `return` keyword implicit:

{{< code lang="js" linenos="false" caption="If you omit the {} the return keyword is implicit" >}}
const subtract = (a, b) => a - b;
{{< /code >}}

This makes arrow functions extremely terse. When writing JavaScript you will create a lot of simple functions and writing them as arrow functions makes the code much shorter and easier to read.

Let's compare that to our `add` function again to show the difference:

{{< code lang="js" linenos="false" caption="Arrow and normal functions are invoked in the same way" >}}
function add(a, b) {
return a + b;
}

const subtract = (a, b) => a - b;

const x = add(1,2); // x = 3
const y = subtract(2,1); // y = 1
{{< /code >}}

#### The Difference Between Arrow Functions and "Normal" Functions

When writing simple functions like `add` and `subtract`, there's no difference between arrow functions and "normal" functions. In most cases, you can pick whichever style looks best. Sometimes, writing out `function...` will break up the flow of your code, while at other times you may want to make it very clear that a block of code is a separate function. **We will always write anonymous functions as arrow functions.**

However, in other situations, there are important technical differences between these two function styles. Understanding these requires an understanding of [scope and the `this` keyword](#scope-and-closures) so we'll come back to this below.

## Arithmetic Operators

All the standard mathematical operators (AKA [arithmetic operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators)) are available in JavaScript. You can think of these operators as shorthand for functions, so the `+` operator is equivalent to our `add` function:

{{< code lang="js" linenos="false" caption="Arithmetic operators can be considered as shorthand for functions" >}}
const add = (a, b) => a + b;

// These two statements are equivalent
const x = add(1, 2);
const y = 1 + 2;
{{< /code >}}

Operators come in three forms: **unary operators**, which take one argument, or **operand**, **binary operators**, which take two operands, and **ternary operators**, which take three operands. Actually, there's only one ternary operator, all the rest are unary or binary. Note that the word _binary_ here has nothing two do with the _binary number system_.

### Binary Arithmetic Operators

#### Basic Arithmetic

{{< code lang="js" linenos="false" caption="The basic arithmetic operators" >}}
const sum = 1 + 2; // binary addition

const sub = 5 - 3; // binary subtraction

const div = 10 / 2; // binary division

const mult = 5 \* 20; // binary multiplication
{{< /code >}}

These are all **binary operators**, which means that they work with two operands. In the **binary operation** $1+2$:

- $+$ is the **operator**
- 1 and 2 are the **operands**

#### The Modulo Operator

The [_modulo_ or _remainder_ operator](https://en.wikipedia.org/wiki/Modulo_operation) is another binary operator that gives the remainder when the left operand is divided by the right. It always takes the sign of the left operand:

{{< code lang="js" linenos="false" caption="The modulo operator" >}}
101 % 10; // 1
-101 % 10; // -1
15 % 4; // 3
15 % 3; // 0
{{< /code >}}

#### The Exponentiation Operator

The final binary operator is the _exponentiation_, or _to the power of_, operator:

{{< code lang="js" linenos="false" caption="The exponentiation operator" >}}
const a = 2;

const b = a \*_ 2; // b = 2 _ 2;

const c = a \*_ 3; // c = 2 _ 2 \* 2;

const d = a \*_ 4; // d = 2 _ 2 _ 2 _ 2
{{< /code >}}

### Unary Operators

By contrast with binary operators, **unary operators** work with a single operand.

First, there's **unary negation**, which means _take a variable and make it negative_.

{{< code lang="js" linenos="false" caption="The unary negation operator" >}}
const a = 5;

const b = -a; // b = -5
{{< /code >}}

Of course, that means we must also have **unary addition**:

{{< code lang="js" linenos="false" caption="The unary addition operator is not useful as a mathematical operator" >}}
const a = 5;

const b = +a; // still 5
{{< /code >}}

**Unary plus** is a different beast, however. It's useless as a mathematical operator, but it turns that it's the fastest way to turn something, such as a string, into a number:

{{< code lang="js" linenos="false" caption="However, it can be used to turn a string into a number" >}}
const a = '3'; // a string holding the character 3

const x = +a; // x now holds the number 3
{{< /code >}}

It doesn't work in all situations, and in many cases will return [`NaN` (not a number)](#special-numbers).

{{< code lang="js" linenos="false" caption="When the string doesn't have an obvious number equivalent the result will be NaN" >}}
const x = 'Eritrea';

const y = +x; // y = NaN
{{< /code >}}

Unary negation and unary addition use the same character as binary negation and addition. The only difference is whether you supply them with one or two operands.

#### Increment and Decrement Operators

Next in the list of unary operators are _increment (`++`)_ and _decrement (`--`)_:

{{< code lang="js" linenos="false" caption="The increment and decrement operators" >}}
let x = 1;

x++; // return x and then add one to x

++x; // add one to x and then return it

x--; // return x and then subtract one from x

--x; // subtract one from x and then return it
{{< /code >}}

The two statements **return `x` and then add one to `x`** and **add one to `x` and then return it** are potentially confusing, so let's see if we can make that clearer with an example.

First, let's try `x++`:

{{< code lang="js" linenos="false" >}}
let x = 1;

const y = x++;

// y = 1, x = 2
{{< /code >}}

Next, here's `++x`:

{{< code lang="js" linenos="false" >}}
let x = 1;

const y = ++x;

// y = 2, x = 2
{{< /code >}}

## Assignment Operators

The basic [assignment operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators) is represented by a single equals sign:

{{< code lang="js" linenos="false" caption="The assignment operator" >}}
const x = 5;
const y = 'hello';
{{< /code >}}

We've already been using this quite a bit throughout this chapter.

The rest of the assignment operators are shorthand for each of the binary arithmetic operators:

{{< code lang="js" linenos="false" caption="Shorthand assignment operators" >}}
let a = 1;

a += 5; // a = a + 5 (addition)

a -= 5; // a = a - 5 (subtraction)

a /= 5; // a = a / 5 (division)

a _= 5; // a = a _ 5 (multiplication)

a **= 5; // a = a ** 5 (exponentiation)

a %= 5; // a = a % 5 (modulo)
{{< /code >}}

## Logical Operators: AND, OR, NOT

There are three [logical operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators) in JavaScript: AND, OR and NOT, which are defined using `&&`, `||` and `!`, respectively. AND (`&&`) and OR (`||`) are binary operators while NOT (`!`) is a unary operator.

We will often use these to compare Boolean values (`true` and `false`):

{{< code lang="js" linenos="false" caption="Comparing Boolean values using AND, OR, and NOT" >}}
const x = true;
const y = true;
const z = false;

x && y; // true AND true -> true
x && z; // true AND false -> false
z && z; // false AND false -> false

x || y; // true OR true -> true
x || z; // true OR false -> true

!x; // NOT true -> false
!z; // NOT false -> true
{{< /code >}}

However, more care needs to be taken when comparing other values. We'll discuss this in more detail in the section [Truthy and Falsy](#truthy-falsy) below.

## Comparison Operators

[Comparison operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) compare two values and return a Boolean value (`true` or `false`).

All comparison operators are binary operators, meaning they take two operands.

Special care must be taken, not only in JavaScript but in any programming language, when comparing two floating-point numbers together. See the section [Working with Floating-Point Data](#working-with-floating-point-data) earlier in this chapter.

### Equality Comparison Operator

The first comparison operator we will examine is the equality operator. This comes in two flavors in JavaScript:

1. the strict equality operator, denoted by **three equals signs** (`===`)
2. the loose equality operator, denoted by **two equals signs** (`==`)

To save some time here, we won't get into a discussion of the difference between these two. If we _were_ to discuss it, we'd realize that in nearly every situation, we should use strict equality (`===`). We'll never use the loose equality operator (`==`) in this book.

[You can read more about these two operators here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

Using the strict equality operator, we compare two values (operands) and we get back either `true` or `false`:

{{< code lang="js" linenos="false" caption="The strict equality operator" >}}
'bumblebee' === 'butterfly'; // false

5 === 5; // true

true === true; // true
false === true; // false
false === false; // true
{{< /code >}}

### Inequality Comparison Operator

Strict inequality is denoted by `!==` (NOT equal):

{{< code lang="js" linenos="false" caption="The strict inequality operator" >}}
5 !== 4; // true

5 !== 5; // false

'apples' !== 'dragon fruit'; // true

true !== true; // false
false !== true; // true
false !== false; // false
{{< /code >}}

There is also the non-strict version: `!=`, but again, you should avoid using that unless you have a specific reason for doing so.

### Relational Comparison Operators (Greater/Lesser Comparison)

There are four relational comparison operators:

1. greater than (`>`)
2. greater than or equal (`>=`)
3. less than (`<`)
4. less than or equal (`<=`)

There's no need for strict and loose versions of these operators.

These all read from left to right, so when we write `x < y` we are asking "is x less than y?":

{{< code lang="js" linenos="false" caption="The relational comparison operators" >}}
3 < 5; // true

6 > 23; // false

6 < 6; // false

6 <= 6; // true

34 <= 2; // false

34 >= 2; // true;
{{< /code >}}

### Comparing Different Data Types

What happens when we compare two different data types? `6 <= 5` has an obvious answer (that's `false`, by the way), but what about `'apples' <= 5`?

Even comparing two values of the same data type doesn't always have an obvious answer:

{{< code lang="js" linenos="false" caption="To find out the answer, try entering this in the browser console" >}}
'apples' <= 'APPLES'; // umm...?
{{< /code >}}

JavaScript allows us to compare _anything_ with _anything_, and always has an answer ready. Figuring out what the answer will be is sometimes tricky though.

{{< code lang="js" linenos="false" caption="Comparing different data types can give unexpected answers " >}}
const a = 'apples'; // a string
const b = 23; // a number
const c = { name: 'olive' }; // an object

a >= b; // hmm?
b === c; // not sure about this one
c !== a; // no idea... :'(
{{< /code >}}

**When writing JavaScript, it's _your_ responsibility to make sure that your comparisons make sense**. Comparing `'apples'` with `0xffa500` is probably a sign there's a mistake in your code somewhere.

However, we should still take the time to understand the algorithms that JavaScript uses to calculate a result when comparing different data types.

Note: for actual comparison of data _types_, you should use [`typeof` or `instanceof`](#typeof-and-instanceof), which are covered in detail below.

## Type Coercion

The first thing JavaScript does when comparing different data types is to **convert both values to the _same_ [primitive data type](#primitive-data-types)**. This process is called [**type coercion**](https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion).

Note that this coercion only happens for the sake of the comparison. The actual data you have stored in a variable is not changed in any way.

#### Comparing Strings with Numbers

We'll examine the case of comparing strings with numbers in detail here. Something similar happens whenever you compare any two values of different data types.

If we compare a number with a string, then both values will be converted to a number.

{{< code lang="js" linenos="false" caption="Comparing a string and a number results in the string being temporarily converted to a number" >}}
'2' <= 3; // true
{{< /code >}}

This is also where the difference between strict and loose equality becomes apparent:

{{< code lang="js" linenos="false" caption="The difference between strict and loose equality becomes apparent when comparing different data types" >}}
'2' == 2; // true

'2' === 2; // false
{{< /code >}}

**Usually, you wouldn't consider the string `'2'` to be equal to the number `2`. That's why we use strict equality (`===`).**

It's obvious how you can convert/coerce the string `'2'` to the number `2`. But what about a string like `'asparagus'`?

Every string that is not a number or the empty string will be converted to [`NaN` (Not a Number)](#special-numbers), and any number we compare with `NaN` will return `false`:

{{< code lang="js" linenos="false" caption="Most strings are converted to NaN for comparisons with numbers" >}}
2 === 'asparagus; // false
2.3434 > 'australopithecus ; //false
2.1 < 'aspic; //false
2323 > 'astaxanthin; //false
-2 < 'auspicious; //false

// ...and so on
{{< /code >}}

{{< code lang="js" linenos="false" caption="Comparing numbers with NaN always returns false" >}}
2 === NaN; // false
2.3434 > NaN; //false
2.1 < NaN; //false
2323 > NaN; //false
-2 < NaN; //false

// ...and so on
{{< /code >}}

The empty string (`''`) is a special case and will be converted to `0`:

{{< code lang="js" linenos="false" caption="The empty string is converted to zero for comparisons" >}}
'' < 2; // true

"" > 1; // false

`` == 0 // true

`` === 0 // false
{{< /code >}}

## Other Operators

We've covered quite a few operators here, but these are by no means an exhaustive list of all the operators available in JavaScript. Check out [Expressions and Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators) page on MDN for a complete list.

You may also want to check out the page on [Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence) which goes into some details about what happens when you are applying multiple operators in one statement.

## `typeof` and `instanceof`

Often, you will need to check what type of data a variable contains, such as strings, numbers, Booleans, functions, objects, and classes. For this purpose, JavaScript provides two similar operators: [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) and [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof).

`typeof` is the simpler of these, and you can use it to check primitive data types:

- `Undefined` (but not `Null`)
- Boolean
- Numbers
- BigInt
- Strings
- Symbols
- Functions

{{< code lang="js" linenos="false" hl_lines="" caption="Some examples of using typeof" >}}

```js
const aString = "hello";
const aNumber = 2;
const aBoolean = true;
const aFunction = function () {};
const anArrowFunction = () => {};

typeof aString; // 'string'
typeof aNumber; // 'number'
typeof aBoolean; // 'boolean'
typeof aFunction; // 'function'
typeof anArrowFunction; // 'function'
```

{{< /code >}}

Using `typeof`, you can easily check whether two variables contain the same primitive data type:

{{< code lang="js" linenos="false" hl_lines="" caption="Comparing primitives with typeof" >}}

```js
const hello = "hello";
const goodbye = "goodbye";

const eleven = 11;
const twelve = 12;

// two variables with numbers have the same type
typeof eleven === typeof twelve; // true

// two variables with strings have the same type
typeof hello === typeof goodbye; // true

// here, one variable has a number and the other a string
// so they don't have the same type
typeof eleven === typeof goodbye; // false
```

{{< /code >}}

So far so good. However, if you use `typeof` with anything that's not in that short list of primitive data types, the result will be simply `'object'`.

{{< code lang="js" linenos="false" hl_lines="" caption="For non-primitive data types, typeof always returns 'object'" >}}

```js
class ClassyMcClassFace {}

const aClassInstance = new ClassyMcClassFace();
const anArray = [1, 2, 3];
const anObject = { a: 5 };

typeof aClassInstance; // 'object'
typeof anArray; // 'object'
typeof anObject; // 'object'
```

{{< /code >}}

As we have mentioned several times throughout this chapter, everything that is not a primitive data type in JavaScript is an object, so this answer is correct. However, it's not very useful and it means we can't use `typeof` for comparing custom objects and classes.

For these we'll turn to `instanceof`.

{{< code lang="js" linenos="false" hl_lines="" caption="instanceof can be used to check the type of objects, arrays, and classes" >}}

```js
const aClassInstance = new ClassyMcClassFace();
const anArray = [1, 2, 3];
const anObject = { a: 5 };

aClassInstance instanceof ClassyMcClassFace; // true
anArray instanceof Array; // true
anObject instanceof Object; // true
```

{{< /code >}}

Comparisons using `instanceof` are a little more verbose than `typeof`:

{{< code lang="js" linenos="false" hl_lines="" caption="Comparing data types using instanceof" >}}

```js
const a = new ClassyMcClassFace();
const b = new ClassyMcClassFace();

a instanceof ClassMcClassFace && b instanceof ClassMcClassFace; // true
[1, 2, 3] instanceof Array && [3, 4, 5] instanceof Array; // true
({ a: 5 } instanceof Array && [3, 4, 5] instanceof Array); // false
```

{{< /code >}}

There's quite a bit more to `instanceof` since it works by checking the object's prototype. We're avoiding the discussion of prototypes in this chapter, so we'll cut this section short here. As usual, [the relevant MDN page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) has a lot more details.

## Control Flow

The term [Control Flow](https://developer.mozilla.org/en-US/docs/Glossary/Control_flow) refers to various methods of controlling what your program does in a given situation.

### Block Statements

The basic element of control flow is the humble [**block**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block). These are defined using curly braces `{}`, and are used to group a set of statements.

{{< code lang="js" linenos="false" caption="The humble block statement" >}}
{
const a = 5;
const b = 6;
const c = a + b;
}
{{< /code >}}

It's unusual to see a block statement on its own like this. Usually, they are combined with other statements such as if...else or [loops](#loops).

### if...else Statements

The [if...else statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) is a **conditional statement** that can be used to create branches in your code.

We use comparison operators to create the branches in an if...else statement.

{{< code lang="js" linenos="false" caption="An if..else statement controlling a loading bar" >}}
if (percentLoaded <= 70) {
const barColor = 'blue';
updateLoadingBar(percentLoaded, barColor);
} else if (percentLoaded < 100) {
const barColor = 'red';
updateLoadingBar(percentLoaded, barColor);
} else {
hideLoadingBar();
startAnimation();
}
{{< /code >}}

This example controls a loading bar. As the value of `percentLoaded` increases, the loading bar is drawn a different color. Finally, once `percentLoaded` reaches 100, the bar is hidden and the animation is started.

Each branch in this if...else statement is wrapped in block statement.

{{< code lang="js" linenos="false" caption="Each branch in the if..else statement is wrapped in a block" >}}
{
const barColor = 'blue';
updateLoadingBar(percentLoaded, barColor);
}
{{< /code >}}

In this example, we check whether a Boolean value is true or false:

{{< code lang="js" linenos="false" caption="An if...else statement used to display an error message when the model fails to load" >}}
let modelLoadedOK = false;

// some code to load the model here
// and set modelLoadedOK = true on success

if (modelLoadedOK === true) {
drawScene();
} else {
displayErrorMessage();
}
{{< /code >}}

Since there is only one line of code in each branch of this example, you could leave out the block statements:

{{< code lang="js" linenos="false" caption="Block statements are optional" >}}
if (modelLoadedOK === true)
drawScene();
else
displayErrorMessage();
{{< /code >}}

However, it is considered best practice to always include the block statements since that makes your code more readable.

There are more sophisticated methods of error handling available in JavaScript, but often, a simple if...else statement is all you need.

Other ways of controlling the flow of your program are [the ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) and [switch statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch).

The [control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) guide on MDN goes into more detail on this topic.

## [Truthy](https://developer.mozilla.org/en-US/docs/Glossary/truthy) and [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/falsy) {#truthy-falsy}

Take another look at the line where we checked whether the model has loaded above:

{{< code lang="js" linenos="false" hl_lines="1" >}}
if (modelLoadedOK === true) {
drawScene();
}
{{< /code >}}

We can shorten this by omitting the `=== true`:

{{< code lang="js" linenos="false" hl_lines="1" >}}
if (modelLoadedOK) {
drawScene();
}
{{< /code >}}

By doing this, we have placed `modelLoadedOK` into a so-called **Boolean context**.

**_Putting a variable in a Boolean context_ means we are interpreting that variable as either `true` or `false`**.

Since `modelLoadedOK` is already a Boolean, that's not a big deal. However, we can put any data into a Boolean context. For example, instead of creating a Boolean to track whether the model has loaded, we can simply use the model itself:

{{< code lang="js" linenos="false" caption="Putting a loaded model into a Boolean context" >}}
const model = loadModel();

if (model) {
drawScene();
} else {
displayErrorMessage();
}
{{< /code >}}

This is another example of [type coercion](type-coercion), by the way.

If the model exists, then we will interpret the variable `model` as `true`. If the model _does not_ exist, then we will interpret the variable as `false`.

**Every value in JavaScript can be interpreted as either `true` or `false`.**

When a value is interpreted as true, we say that it is **truthy**.

When a value is interpreted as false, we say that it is **falsy**.

Nearly everything is interpreted as truthy in a Boolean context. Here's a complete list of falsy values in JavaScript:

- The Boolean `false`
- The number `0` or `0-`
- The empty string "", '', or ``
- `null`
- `undefined`
- Not a Number: `NaN`
- `BigInt` zero: `0n`

And that's it - everything else is truthy.

## Loops and Iteration {#loops}

One of the things that computers are good at is doing [lots of similar things, really, really fast](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration), such as adding a million numbers together.

JavaScript has several methods to perform iteration, but in general, we'll stick with just two: **for loops**, and **for...of loops**.

### [For Loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) {#for-loop}

We can perform an operation multiple times using a **for loop**, which looks like this:

{{< code lang="js" linenos="false" caption="A for loop" >}}
for (let i = 0; i < 5; i++) {
console.log(i);
}
{{< /code >}}

If you open up the browser console and paste in that code, you'll see the output 0, 1, 2, 3, 4.

The rest of the loop is made up of an initialization statement, a condition, a final expression, a block, and a statement:

{{< code lang="js" linenos="false" caption="The technical definition of a for loop" >}}
for ([initialization]; [condition]; [final-expression]) {
[statement]
}
{{< /code >}}

Everything in square brackets is optional. The `{}` is also optional, but, as with the`if...else statement, we'll always include it. Matching up the values in the square brackets to our example above, we have:

- [initialization]: `let i = 0`
- [condition]: `i < 5`
- [final-expression]: `1++`
- [statement]: `console.log(i);`

Here's another simple example that adds the number 1 to `total` repeatedly until the loop ends after five thousand iterations.

{{< code lang="js" linenos="false" caption="Using a for loop to add up some numbers" >}}
let total = 0;

for (let i = 0; i < 5000; i++) {
total = total + 1;
}

console.log(total);
// => 5000
{{< /code >}}

### for...of loops {#for-of-loop}

Next up is the [**for...of loop**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), which was recently added to JavaScript (it's an ESNext feature).

for..of loops can be used to loop over the values of any [**iterable object**](https://javascript.info/iterable).

{{< code lang="js" linenos="false" >}}
for (const value of iterable) {
console.log(value);
}
{{< /code >}}

When you hear _**iterable object**_, think _**something similar to an array**_.

Of course, that means arrays themselves are iterable objects. We can loop over all the values in an array using a for..of loop:

{{< code lang="js" linenos="false" caption="Using a` for...o`f loop to log all the values of an array to the console" >}}
const arr = [1, 2, 3, 4];

for (const value of arr) {
console.log(value)
}
{{< /code >}}

If you paste that code into the console, you'll see the output 1, 2, 3, 4. The useful thing here is that we don't need to care how big the array is. The for...of loop will hit every value, whether there are four or a million elements in the array.

In this example, we add up all the values in an array to get the total.

{{< code lang="js" linenos="false" caption="Using a` for...o`f loop to add the values in an array" >}}
const arr = [1, 2, 3, 4];

let sum = 0;
for (const value of arr) {
sum += value;
}
// now sum = 10
{{< /code >}}

### Iterable Objects

Many other built-in objects besides arrays are iterable. For example, [strings](#string), [`TypedArray`](#typed-arrays), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) are all iterable. You can also create custom iterable objects, although that is beyond the scope of this chapter

### Iterating Over `Object` {#object-values}

A notable exception from the list of iterable objects is [`Object`](#objects):

{{< code lang="js" linenos="false" caption="An Object containing some numbers" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};
{{< /code >}}

It's common to have an object containing values that you want to iterate over. `Object` has several helpful methods for this purpose.

#### `Object.values()`

First up is [Object.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values) which simply returns the values of an object as an array.

{{< code lang="js" linenos="false" caption="Object.values returns an array containing the object's values" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};

const weightValues = Object.values(catWeights);

// weightValues = [1, 3, 30];
{{< /code >}}

Now we can iterate over the `weightValues` array using for..of as usual:

{{< code lang="js" linenos="false" >}}
let sum = 0;
for (const value of weightValues) {
sum += value;
}
// now sum = 34
{{< /code >}}

We will usually write this more concisely by placing the call to `Object.values` inline, within the body of the for...of loop:

{{< code lang="js" linenos="false" caption="A for...of loop with an inline call to Object.values" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};

let sum = 0;
for (const value of Object.values(catWeights)) {
sum += value;
}
// now sum = 34
{{< /code >}}

#### `Object.keys`

[`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) is similar to `.values`, except that it returns the keys as an array.

{{< code lang="js" linenos="false" caption="Object.keys returns an array containing the object's keys" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};

const catNames = Object.keys(catWeights);

// catNames = [`ginger`, `gemima`, `geronimo`];
{{< /code >}}

#### `Object.entries`

Finally, [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) returns an array of `[key, value]` pairs.

{{< code lang="js" linenos="false" caption="Object.entries  returns an array containing the object [key, value] pairs" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};

const catEntries = Object.entries(catWeights);

// catEntries = [["ginger", 1], ["gemima", 3], ["geronimo", 30]]
{{< /code >}}

Note that `catEntries` is a **nested array**, that is, an array that contains other arrays within it.

### `Array.forEach` {#foreach}

Coming back to arrays, another way of looping over the values in an array is to use the built-in method, [`Array.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).

{{< code lang="js" linenos="false" caption="Using Array.forEach to iterate an array" >}}
const arr = [1, 2, 3, 4];

let sum = 0;
arr.forEach((value) => {
sum += value;
});
// now sum = 10
{{< /code >}}

This takes a function as the argument, and we can perform operations on the array elements, one by one, inside that function. In case it's not clear, here is the function:

{{< code lang="js" linenos="false" caption="The arrow function we are passing into Array.forEach above" >}}
(value) => {
sum += value;
});
{{< /code >}}

We can use `Object.values` with `Array.forEach` to loop over an object's values, just as we did with for...of:

{{< code lang="js" linenos="false" >}}
const catWeights = {
ginger: 1,
gemima: 3,
geronimo: 30,
};

let sum = 0;
Object.values(catWeights).forEach((weight) => {
sum += weight;
})
// now sum = 34
{{< /code >}}

There are several related array methods that can be used for iterating over an array's values:

- [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`Array.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`Array.reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

Appropriate use of these functions can result in beautiful, concise code. In this book, we are more interested in clarity and simplicity, so we'll avoid using them. We'll even avoid using `Array.forEach` and stick exclusively with for loops and for...of loops.

## [Callback Functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) {#callback-functions}

The function we passed into the `arr.forEach` method above has a special name: it's called a **callback function**, meaning it gets passed into another function as an argument:

{{< code lang="js" linenos="false" caption="Array.forEach takes a callback function as the argument" >}}
const arr = [1, 2, 3, 4];

let sum = 0;
arr.forEach((value) => {
sum += value;
});
// now sum = 10
{{< /code >}}

Let's rewrite our `forEach` loop to get a better look at this callback function:

{{< code lang="js" linenos="false" caption="Extracting the callback function" >}}
const arr = [1, 2, 3, 4];

let sum = 0;

// The callback function
const total = (value) => {
sum += value;
};

arr.forEach(total);
{{< /code >}}

Now you can see that we're passing in the function called `total` as an argument to `Array.forEach()`. There's nothing special about the `total` function. It's a normal JavaScript arr function. It's only when used in this manner that we refer to it as a callback function.

We will use callback functions a lot while writing JavaScript code. We'll cover them in more detail in the chapter on [Asynchronous JavaScript]({{< relref "/book/appendix/asynchronous-javascript" >}} "Asynchronous JavaScript").

## Recursion {#recursion}

A [**recursive function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#Recursion) is simply a function that calls itself.

Here's a function that prints the string `'Hello'` to the browser's console one hundred times.

{{< code lang="js" linenos="false" caption="Using recursion to print 'hello' repeatedly" >}}
let count = 0;

const printHello = () => {
console.log('Hello', count);

count++;

// recursion simply means that a function calls itself
if (count < 100) printHello();
};
{{< /code >}}

Whenever you write recursive functions, it's important to include a final case to end the recursion. Here, that's `if (count < 100)`.

If we leave that out, we'll end up with a function that keeps on printing hello until the JavaScript engine eventually kills it with an error message.

{{< code lang="js" linenos="false" caption="A recursive function without a final case will cause an error" >}}
let count = 0;

const printHello = () => {
console.log('Hello', count);

count++;

// recursion simply means that a function calls itself
printHello();
};

printHello();
{{< /code >}}

We'll used recursion to [generate a stream of frames]({{< relref "book/first-steps/animation-loop" >}} "generate a stream of frames") when we add animation to our app.

## Classes and the `new` Keyword

**We can create _instances_ of a _class_ of objects using the `new` keyword.**

What does that mean?

Think of a particular cat called Geronimo. Geronimo is a big cat. You might even say he's a chonker. He's not much of a guy for friendship but he sure does like to sit on the windowsill and catch the evening sun.

Now, imagine another cat called Gemima. She's small, friendly, tabby. She loves to meow and when she's not chasing a toy she is probably purring on your lap.

Now think of the realm of all possible cats. Big cats, small cats, tabby, short-hair, Persian, some are friendly, some aloof, some purr, some meow a lot, while others like to be silent.

All of these cats belong to that abstract class of things we call _Cat_.

Geronimo and Gemima are _instances_ of the Cat class.

Similarly, we can create a Cat [**`Class`**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) in JavaScript.

{{< code lang="js" linenos="false" caption="A simple Cat class" >}}
class Cat {
constructor(name, age) {
this.name = name;
this.age = age;
}
}
{{< /code >}}

This simple example class stores only two pieces of data about the cats we create: their `name` and their `age`.

To create an instance of the `Cat` class, we'll use the `new` keyword:

{{< code lang="js" linenos="false" caption="Creating some instances of the Cat class" >}}
const geronimo = new Cat('Geronimo', 122);

console.log(geronimo);
// Cat {name:"Geronimo" age:122}

const gemima = new Cat('Gemima', 1.5);

console.log(gemima);
// Cat {name:"Gemima" age:1.5}
{{< /code >}}

If you leave out the `new` keyword when creating a `Cat` instance, you'll get an error message:

{{< code lang="js" linenos="false" caption="The new keyword is required when creating class instances" >}}
const moggle = Cat('Moggle', 3);

// => Uncaught TypeError:
// Class constructor Cat cannot be invoked without 'new
{{< /code >}}

### Class Names are Capitalized

By convention, class names always start with a capital letter, while class instance names (and most other JavaScript variables) start with a small letter. This is not a rule, however, we will treat it as such and always start class names with a capital letter.

### Classes are Objects

Remember, everything that's not a primitive data type in JavaScript is an [Object](#objects), and that includes classes.

### Prototypes and Constructor Functions

Classes are a relatively new addition to JavaScript. When using old-school JavaScript the equivalent to classes is constructor functions.

We won't get into this further here, but you will often encounter constructor functions when dealing with old JavaScript code. The [Object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) guide on MDN is a good starting point if you want to explore the history and technical details of this part of the language

Constructor functions and classes are equivalent (everything you can write one way, you can also write the other), so we'll use the new, cleaner Class syntax in this book.

Note that our class example above has a `constructor` method inside it, which we'll look at in a moment, but that's not the same thing as a constructor function.

### Instance Variables

`this.name` and `this.age` are called [**instance variables**](https://en.wikipedia.org/wiki/Instance_variable) and we can access them using [dot notation or bracket notation](#dot-notation). We will refer to them as `Cat.name` and `Cat.age`.

Once we have created an instance of the class, we can access them using the instance name (for example, `geronimo.name`).

{{< code lang="js" linenos="false" caption="Accessing class instance variables" >}}
const x = geronimo.age; // now x holds the number 122

const y = geronimo['name']; // now y holds the string 'Geronimo'
{{< /code >}}

Within the class, we can access them using `this.name` and `this.age`.

### Class Methods

When we create a function inside a class, we refer to it as a method. Let's add a `meow` method to the `Cat` class.

{{< code lang="js" linenos="false" caption="Create the Cat.meow method" >}}
class Cat {
constructor(name, age) {
this.name = name;
this.age = age;
}

meow() {
console.log('meow-meow');
}
}
{{< /code >}}

Once we have created a `Cat` instance, we can access the method on the instance using dot notation or bracket notation:

{{< code lang="js" linenos="false" caption="The cat's meow" >}}
const geronimo = new Cat('Geronimo', 122);

geronimo.meow();
// OR
geronimo['meow']();
{{< /code >}}

### The `constructor` Method

The `Cat` class we created above has a [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) inside it. This is a special method that runs automatically when we create a new class instance. Here, that means when we create a `new Cat`.

Just to make sure we're totally clear, we're not talking about the old-school **constructor functions** we mentioned above. The **constructor method** is something different.

{{< code lang="js" linenos="false" caption="When we create a class instance, the constructor is called automatically" >}}
const geronimo = new Cat('Geronimo', 122);
{{< /code >}}

We use the constructor method to do the basic setup for a class, for example, setting up instance variables. From here on, we'll refer to the constructor method as simply **constructor**.

The constructor is optional and we can create a class without a constructor if we like:

{{< code lang="js" linenos="false" caption="A class without a constructor" >}}
class Cat {
meow() {
console.log('meow-meow');
}
}
{{< /code >}}

If we leave out the constructor then JavaScript _implicitly_ adds one for us, so the above class is equivalent to:

{{< code lang="js" linenos="false" caption="If we omit the constructor, an empty one is implicitly created for us" >}}
class Cat {
// no need to type this line, JS does it for you
constructor() {}

meow() {
console.log('meow-meow');
}
}
{{< /code >}}

By _implicit_, we mean that you don't _see_ this code. All the magic happens somewhere out of sight, deep within the browser's JavaScript engine.

### Returning Values from the Constructor

The `return` value of the constructor is special because it's also _implicit_. What this means is that we don't need to type `return` at the bottom of the constructor. Instead,
JavaScript implicitly adds the line `return this` at the bottom of the function:

{{< code lang="js" linenos="false" caption="The default constructor return is implicit" >}}
class Cat {
constructor(name, age) {
this.name = name;
this.age = age;

    // JavaScript adds this line implicitly for us
    return this;

}
}
{{< /code >}}

`this` refers to the class instance created when we call `new Cat`. We'll take a deeper look at the `this` keyword in a few moments.

### Custom Return Values in Class Constructors

Sometimes, you may find it useful to return something other than the class instance from a class. In that case, you can add a custom `return` statement to the end of the constructor.

Here's a contrived example, where we return an object with name and age properties from the cat class:

{{< code lang="js" linenos="false" caption="A custom constructor return" >}}
class Cat {
constructor(name, age) {
return {
name,
age
};
}

// Now there's no way to run this method
meow() {
console.log('meow-meow');
}
}
{{< /code >}}

Now, `new Cat` will no longer return a class, but instead a simple object:

{{< code lang="js" linenos="false" caption="Our custom constructor returns gives us a simple Object rather than a class instance" >}}
const fred = new Cat('Frederico', 5);

console.log(fred);
// {name: "Frederico", age: 5}
{{< /code >}}

However, doing this means we can no longer access the `Cat.meow` method.

### Static Class Methods

Sometimes, you may want to use a class method without going to the trouble of creating a class instance. In that case, you can declare the method as [`static`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static).

{{< code lang="js" linenos="false" caption="A class that simply meows" >}}
class Meower {
static meow() {
console.log('meow-meow');
}
}
{{< /code >}}

Now, to call the static meow method, we access it using `Meower.meow`.

{{< code lang="js" linenos="false" caption="Static methods can be accessed directly on the class" >}}
Meower.meow();
// => 'meow-meow
{{< /code >}}

However, we can no longer access this method on a class instance.

{{< code lang="js" linenos="false" caption="Static methods cannot be accessed on a class instance" >}}
const moggy = new Meower();

moggy.meow();
// Uncaught TypeError: moggy.meow is not a function
{{< /code >}}

### Chaining Methods

Often, you'll need to create a class and then run several of its methods to set it up. For example, here's a frog class with some methods to set up its stats:

{{< code lang="js" linenos="false" caption="A simple frog class" >}}

```js
class Froggy {
  constructor() {
    this.type = "common";
    this.color = "green";
    this.jumpHeight = 5;
    this.ribbitDB = 40;
  }

  setType(type) {
    this.type = type;
  }

  setColor(color) {
    this.color = color;
  }

  setRibbitStrength(strength) {
    this.ribbitDB = strength;
  }

  setJumpHeight(height) {
    this.jumpHeight = height;
  }
}
```

{{< /code >}}

The stats are given default values in the constructor, and the methods allow us to customise them. Of course, for a simple class like this we could pass all the custom values into the constructor, but in real code that's not always possible or desirable. Now let's see what we have to do to customise all of the frog's stats:

{{< code lang="js" linenos="false" caption="Customising our frog" >}}

```js
const froggy = new Froggy();

froggy.setType("tomato");
froggy.setColor("red");
froggy.setRibbitStrength("10");
froggy.setJumpHeight("10");
```

{{< /code >}}

We can improve this slightly by using **method chaining**. To do this, we will return `this` at the end of each method. Remember that the `constructor` implicitly returns `this` already.

{{< code lang="js" linenos="false" hl_lines="11,16,21,26" caption="To use method chaining, each method must return 'this'" >}}

```js
class Froggy {
  constructor() {
    this.type = "common";
    this.color = "green";
    this.jumpHeight = 5;
    this.ribbitDB = 40;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setRibbitStrength(strength) {
    this.ribbitDB = strength;
    return this;
  }

  setJumpHeight(height) {
    this.jumpHeight = height;
    return this;
  }
}
```

{{< /code >}}

Now we can set up our froggy using method chaining

{{< code lang="js" linenos="false" caption="Customising our frog using method chaining" >}}

```js
const froggy = new Froggy()
  .setType("tomato")
  .setColor("red")
  .setRibbitStrength("10")
  .setJumpHeight("10");
```

{{< /code >}}

### Class Inheritance and the `extends` Keyword

A powerful feature of classes is that we can take an existing class and extend it to create a new, similar class with extra or changed functionality, using the [**`extends` keyword**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends).

When we do this, we call the original class the **base class**, **superclass**, or **parent class**, and we call the new class the **derived class**, **subclass**, or **child class**.

The classic examples used to demonstrate inheritance is to start with an `Animal` base class, and since this chapter is already full of cats, let's continue with that tradition.

Here's our `Animal` base class:

{{< code lang="js" linenos="false" caption="An Animal class" >}}
class Animal {
constructor(age) {
this.age = age;
}

growOlder() {
this.age++;
}

reproduce() {
// implementation of this function is left to your imagination
}
}
{{< /code >}}

We've decided that all animals will have a single instance variable called `age`, and two basic abilities: they can grow older, and they can reproduce.

Next, we'll use the `extends` keyword to create a child class called `Cat`:

{{< code lang="js" linenos="false" caption="Extending the Animal class to create a Cat class" >}}
class Cat extends Animal {
constructor(name, age) {
super(age);

    this.name = name;

}

meow() {
console.log('meow-meow');
}
}
{{< /code >}}

`Cat` can do anything that `Animal` can do, and they also have a `name` and can `meow`.

#### The `super` Keyword

Notice the `super` function. This is optional and means that both `Animal.constructor` _and_ `Cat.constructor` will run when we create a `new Cat(...)`:

{{< code lang="js" linenos="false" caption="super() calls the parent's constructor" >}}
const geronimo = new Cat('Geronimo', 122);

console.log(geronimo.name); // Geronimo

// The .age instance variable was created in the Animal class constructor
// This was called because we added super(age).
console.log(geronimo.age); // 122
{{< /code >}}

Another option here is to completely leave out the constructor in the child class, in which case the parent's constructor will automatically be used.

This gives us three options for the constructor in a child class:

{{< code lang="js" linenos="false" caption="Options for child class constructors" >}}
// Option 1: Animal.constructor will run
// then Cat.constructor will run
class Cat extends Animal {
constructor(name, age) {
super(age);

    this.name = name;

}
}

// Option 2: Only Cat.constructor will run
class Cat extends Animal {
constructor(name, age) {
this.name = name;
}
}

// Option 3: Only Animal.constructor will run
class Cat extends Animal {
// no constructor method here
}
{{< /code >}}

#### Inherited Methods

Even though we didn't define the `growOlder` and `reproduce` methods on the `Cat` class, they were inherited from the `Animal` base class. That means `Cat` has a total of three methods. `growOlder`, `reproduce`, and `meow`:

{{< code lang="js" linenos="false" caption="We can use any method from the base and any method on the child class from a Cat instance" >}}
const geronimo = new Cat('Geronimo', 122);

geronimo.meow();
geronimo.growOlder();
geronimo.reproduce();
{{< /code >}}

We can also _overwrite_ methods in the child class. Doing so is simple: we just create a new method with the same name in the child class.

#### Use Inheritance Sparingly

Inheritance seems like an amazing, powerful tool, and indeed, it is, when used well. On the other hand, it's easy to misuse and can lead to huge, ugly, and confusing towers of inherited classes.

We won't get into this further here since this is a chapter on JavaScript syntax, not software patterns or architecture. All we'll say for now is, if you are creating multiple levels of inheritance like this:

{{< code lang="js" linenos="false" caption="An inheritance chain" >}}
class LivingEntity{}

class Animal extends LivingEntity{}

class Mammal extends Animal{}

class Feline extends Mammal{}

class Cat extends Feline{}
{{< /code >}}

... there's probably a better way to write your code (composition, perhaps?).

Some take this to extremes and try to avoid using inheritance at all. In this book, we'll take a pragmatic approach and use it sparingly.

Another thing to consider is that three.js uses inheritance internally, and it will often be easier for us to follow the patterns of the library we are using rather than trying to work against it.

## Scope and Closures

[Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope) is an important concept in JavaScript, but often confusing for beginners (and experts!).

Simply put, the **scope of a variable** means "where can I access this data from?". If data is not in the current scope, then we cannot access it. Here, _data_ can refer to a variable, object, function, class, and so on.

{{< note >}}
TODO-DIAGRAM: create diagram of nested scopes
{{< /note >}}

There are four types of scope:

1. **Global scope**
2. **Module scope (the current file)**
3. **Block scope**
4. **Function scope (closures)**

Module scope and block scope are new in ES6. In old-school JavaScript, there was only global and function scope.

Scopes fit inside each other like Russian dolls. When we are in a certain scope, we can access anything from any of the scopes higher up. At the top level is global scope, which we refer to as the `Window` object in the browser (Node uses different terminology). The next level down is module scope. When writing modular JavaScript, each module (file) has it's own module scope. Finally, block and function scopes can be nested inside each other to any depth.

When we are in module scope, we can access anything from the module scope _and_ global scope. When we are inside a block or function within the module, we can access anything from function/block scope, _and_ module scope, _and_ global scope (we can _always_ access global scope).

However, when we are in global scope, we can't access module scope, and when we are in module scope, we can't access the scope of any functions contained within the module. We'll explain all of this again in the section on **lexical scope** in a few moments.

### Execution Context

Closely related to scope is the **execution context** or simply **context**. Context, in simple terms, refers to the value of the `this` keyword, while scope is related to variable resolution and access. We'll explore `this` in detail below.

Unlike scope, the execution context _can_ change at run time. For example, a function may be called at multiple points in your code and each time will have a different execution context and hence a different value of `this`, while the scope will be the same each time. We'll examine [execution context and `this`]({{< relref "book/appendix/javascript-reference#execution-context-and-the-this-keyword" >}} "execution context and `this`") in more detail below.

### Global Scope

At the top level is the global scope. Data in global scope is accessible from anywhere in your code, within every module, class, function, and object. Different JavaScript environments such as browsers and Node.js treat global scope slightly differently.

In the browser, global scope is a top-level object called `window`. You can add data to the global scope using `window.yourVariableName = ...`:

{{< code lang="js" linenos="false" caption="The browser's global scope" >}}
window.myInfo = {
name: 'Lewy',
};
{{< /code >}}

Now we can access `window.myInfo` from anywhere in any JavaScript file that is part of our application.

We'll explore global scope further in the [DOM API]({{< relref "book/appendix/dom-api-reference#global-object" >}} "DOM API Reference") chapter.

### Module Scope

When writing [modular JavaScript](#javascript-modules-and-the-entry-point), as we'll be doing throughout this book, every file is a module, and every module creates a scope. For example, here is a module called **_main.js_** containing some code. The entire file/module is a scope. Any code we add within this module is created in module scope.

{{< code lang="js" linenos="false" caption="The main.js module" >}}
const name = 'Lewy';

class Printer {
static printName() {
console.log(name);
}
}

Printer.printName(); // => 'Lewy'
{{< /code >}}

We'll explore module scope further in the [Modules Reference]({{< relref "book/appendix/javascript-modules" >}} "Modules Reference") chapter.

### Block Scope

Blocks ([defined using `{}`](#block-statements)) create a scope. Here, we define a variable name within a block, and later when we attempt to log it to the console from outside, it's not available.

{{< code lang="js" linenos="false" caption="Block scope" >}}
{
// within the block scope
const name = 'Lewy';
console.log(`Printing name inside block scope: ${name}`); // => 'Lewy'
}

// outside the block scope
console.log(`Printing name outside block scope: ${name}`); // => undefined
{{< /code >}}

As we mentioned earlier, it's not that common to see a bare block statement like this. More often you will encounter them as part of an if...else statement, for loop, and so on.

{{< code lang="js" linenos="false" caption="Blocks are usually paired with things like loops or if...else statements" >}}
for(let i = 0; i < 3; i++){
const name = 'Lewy';
console.log(`Printing name inside block scope: ${name}`); // => 'Lewy' 'Lewy' 'Lewy'
}

console.log(`Printing name outside block scope: ${name}`); // => undefined
{{< /code >}}

### Closures (Function Scope)

Function scope is so important that it gets a special name: [**closures**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures). Closures were even more important in old-school JavaScript before we had module scope and block scope. Both [arrow functions](#arrow-functions) and normal functions create a closure, although, as we'll see below, these two types of function create different **execution contexts**.

{{< code lang="js" linenos="false" caption="The local scope of a function is called a closure" >}}
function createName() {
const name = 'Harry';
console.log(`Printing name inside closure: ${name}`); // => 'Harry'
}

console.log(`Printing name outside closure: ${name}`); // => undefined
{{< /code >}}

#### `var`, `let`, `const`, and Scope

Now we can finally explain the difference between [`var` and the new `let` and `const`](book/appendix/javascript-reference/#variables-let-const-var). In short, `var` is function scoped while `let` and `const` are block-scoped. Care must be taken when using `var` with block scope. We will never use `var` in this book so we won't get into this here, but if you are interested, refer to the [MDN `let` reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) for more details.

### Lexical Scope

Scope in JavaScript, like most modern programming languages, is [**lexical**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Lexical_scoping). This means scopes are arranged in a hierarchy with the global scope at the top and the current local scope at the bottom.

If we want to know what scope a piece of data resides in, and hence where in our code we can access it from, we simply need to look at the active line in our text editor. The state of the program when running has no bearing on the scope of data, in contrast to languages with dynamic scope like Lisp.

At each step, while moving through the scope hierarchy, we call the current scope the **child scope** and the scope directly above the **parent scope**. We might also refer to these as **outer scope** and **inner scope** (outer scope refers to all levels of scope above the current scope).

In the following examples, the highlighted line refers to the current scope.

This variable is at the top level in the module, hence it's in module scope. The scope above us in the hierarchy is the global scope.

{{< code lang="js" linenos="false" hl_lines="1" caption="_**main.js**_ module. Parent scope: global, local scope: module" >}}
const x = 5;
{{< /code >}}

To access the global scope while working with JavaScript modules, we use the global `window` object. Here, we add the variable `y` to the global scope.

{{< code lang="js" linenos="false" hl_lines="1" caption="_**main.js**_ module. Parent scope: none, local scope: global" >}}
window.y = 'hello';
const x = 5;
{{< /code >}}

Next, we'll create a block inside the module.

{{< code lang="js" linenos="false" hl_lines="5" caption="_**main.js**_ module. Parent scope: module, local scope: block" >}}
window.y = 'hello';
const x = 5;

{
const z = {};
}
{{< /code >}}

Again, you'll more commonly encounter block scope when working with loops, if...else statement, and other such constructs.

{{< code lang="js" linenos="false" hl_lines="5" caption="_**main.js**_ module. Parent scope: module, local scope: block" >}}
window.y = 'hello';
const x = 5;

if(window.y === 'hello'){
console.log(window.y); // => 'hello
}
{{< /code >}}

Function scope works similarly to block scope.

{{< code lang="js" linenos="false" hl_lines="9" caption="_**main.js**_ module. Parent scope: module, local scope: function" >}}
window.y = 'hello';
const x = 5;

if(window.y === 'hello'){
console.log(window.y); // => 'hello
}

function printHey() {
console.log('hey');
}

printHey(); // => 'hello
{{< /code >}}

These are all simple examples, but in a real body of code you will end up with much deeper nesting of scope. Here are a couple of examples. See if you can figure out the parent and local scope in each case.

{{< code lang="js" linenos="false" hl_lines="5" caption="_**main.js**_ module. Parent scope: ?, local scope: ?" >}}
const x = 5;

function scopeTest() {
if(x === 5) {
console.log(x); // => ?
}
}

scopeTest();
{{< /code >}}

{{< code lang="js" linenos="false" hl_lines="2" caption="_**main.js**_ module. Parent scope: ?, local scope: ?" >}}
function scopeTest() {
const x = 5;
if(x === 5) {
console.log(x); // => ?
}
}

scopeTest();
{{< /code >}}

{{< code lang="js" linenos="false" hl_lines="5" caption="_**main.js**_ module. Parent scope: ?, local scope: ?" >}}
function printHey() {
console.log('hey');
}

printHey(); // => 'hello
{{< /code >}}

### Hierarchy of Data Access

As we mentioned above, the scopes are arranged in a hierarchy with global scope at the top and the current scope at the bottom. We can access data from a parent scope inside a child scope, but we cannot access data from a child scope in the parent scope.

Here, that means we can access the `name` variable, declared in the parent scope (module scope), from within the child scope (block scope).

{{< code lang="js" linenos="false" hl_lines="6" caption="Data from a parent scope is accessible in the child scope" >}}
// module scope (outer/parent scope)
const name = 'Peter';

{
// block scope (inner/child scope)
console.log(name); // => Peter
}
{{< /code >}}

However, if we reverse that, we cannot access the variable created in the child scope from the outer scope.

{{< code lang="js" linenos="false" hl_lines="7" caption="Data from a child scope cannot be accessed from the parent scope" >}}
{
// block scope (inner/child scope)
const name = 'Peter';
}

// module scope (outer/parent scope)
console.log(name); // => undefined
{{< /code >}}

So far so good. But what if we create the variable `name` in two different scopes?
In this case, **the inner/child scope has precedence over the outer scope**. However, once we are back in the parent scope, the variable will have it's original value again.

{{< code lang="js" linenos="false" hl_lines="6 10" caption="What happens when a variable with the same name is created in the inner and outer scope?" >}}
const name = 'Peter';

{
const name = 'Sarah';
// block scope (inner/child scope)
console.log(name); // => Sarah
}

// module scope (outer/parent scope)
console.log(name); // => Peter
{{< /code >}}

As you can imagine, this can quickly become confusing, so we avoid using the same name in inner and outer scope. If your text editor or IDE has a linter, it should complain when you do this.

There's a lot more to scope than we have covered here, as you will discover while working with JavaScript. However, this should be enough to get you started with the examples in this book.

## Execution Context and the `this` Keyword

The keyword `this` in JavaScript refers to the current execution context. Unlike scope, the value of `this` can change at runtime depending on how the code is executed.

As JavaScript is executing your code, it maintains a special hidden variable called `thisBinding`. We never see this variable, but we can access it using `this`. Depending on how the current piece of code is being executed, `thisBinding` can have many possible values, including `undefined`.

Deeply understanding how `this` works in JavaScript will take you some time, and is beyond the scope of this chapter. Instead, we'll take a look at the value of `this` in some of the common cases we'll encounter through this book.

### `this` in Global Scope

In global scope, when executing your code in a web browser, `this` refers to the `window` object. You can see by opening the browser console and typing `this === window`.

{{< code lang="js" linenos="false" caption="In the browser console (F12)" >}}
this === window; // => true
{{< /code >}}

### `this` in Module Scope

When we are at the top level in our _**main.js**_ module, the value of `this` is `undefined`.

{{< code lang="js" linenos="false" caption="_**main.js**_" >}}
console.log(this); // => undefined
{{< /code >}}

### `this` and Functions

The value of `this` within a function is the most difficult to understand since it depends on what piece of code called the function, and hence the execution context of the current function call. This can change from one call of the function to the next. To make your life simple, use `this` sparingly in functions that are not class methods.

Also, there are differences between normal and arrow functions so we'll cover the latter separately below. This section refers exclusively to "normal" functions.

When used in a function executed from a module, `this` is `undefined`.

{{< code lang="js" linenos="false" caption="_**main.js**_" >}}
function testThis() {
console.log(this)
}

testThis(); // undefined
{{< /code >}}

However, when we run the same function in global scope (for example, by pasting the following code into the browser console), `this` refers to the global `Window` object.

{{< code lang="js" linenos="false" caption="Global scope (for example, the browser console)" >}}
function testThis() {
console.log(this)
}

testThis(); // Window
{{< /code >}}

Next, when we create a function as a property of an object, `this` binds to the object itself. When we create a function this way we'll refer to it as a _method_. Here, in the `obj.testThis` method, `this` refers to the `obj` itself.

{{< code lang="js" linenos="false" caption="When created as an object property, the value of this in a function is the object itself" >}}
const obj = {
z: 5,
testThis: function () {
console.log(this);
}
};

obj.testThis(); // {z: 5, testThis: ƒ}
{{< /code >}}

### `this` and Classes

When used inside a class method, `this` refers to the class instance. We used `this` in our [`Cat` class](#instance-variables) earlier:

{{< code lang="js" linenos="false" >}}
class Cat {
constructor(name, age) {
this.name = name;
this.age = age;
}

printName() {
console.log(this.name);
}

testThis() {
console.log(this);
}
}

const tommy = new Cat('Tommy', 6);

tommy.printName(); // => 'Tommy'

tommy.testThis(); // => Cat {name: "Tommy", age: 6}
{{< /code >}}

First, we store the parameters `name` and `age` as **instance variables** in the `constructor` as `this.name`, `this.age`. Later, we can access these variables from other class methods such as `.printName`.

This is similar to the behavior of `this` in the `obj.testThis` method we created above and function created inside classes are also referred to as methods.

### `this` and Arrow Functions

Arrow functions treat `this` differently than normal functions. Specifically, they don't have a `this` at all. When you access `this` inside an arrow function, it will be as if the function didn't exist and you were using `this` from the parent scope. This can be a bit tricky to grasp so let's illustrate it with an example.

Here, we have created an `obj` object with a variable `obj.z` and two functions, one normal function, and one arrow function.

{{< code lang="js" linenos="false" caption="An object created to test the difference between arrow function and normal function" >}}
const obj = {
z: 5,

normalFunction: function () {
console.log(this);
},

arrowFunction: () => {
console.log(this);
},
};
{{< /code >}}

We will now test the value of `this` in each function, first in the browser console and then in _**main.js**_.

First, open up the browser console and paste in the above object. Second, type `console.log(this)`. Since you are in global scope, `this === Window`.

Next, run `obj.normalFunction`. As we saw above, within `.normalFunction`, `this` refers to the `obj` itself.

Finally, run `obj.arrowFunction`. Once again, you'll see that `this` refers to `Window`.

{{< code lang="js" linenos="false" caption="Testing scope in the browser console" >}}
console.log(this); // => Window

obj.normalFunction(); // => {z: 5, normalFunction: ƒ, arrowFunction: ƒ}
obj.arrowFunction(); // => Window
{{< /code >}}

What this all means is that running `console.log(this)` within the global scope and within `obj.arrowFunction` gives the same result, but within `obj.normalFunction` gives a different result.

Next, do it all again in _**main.js**_. Notice that in the outer scope and the arrow function, `this` is now undefined.

{{< code lang="js" linenos="false" caption="_**main.js**_" >}}
console.log(this); // => undefined

obj.normalFunction(); // => {z: 5, normalFunction: ƒ, arrowFunction: ƒ}
obj.arrowFunction(); // => undefined
{{< /code >}}

#### Other Arrow Function Differences

If you open up the [MDN Arrow functions page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), you'll see that arrow functions don't have bindings to `this`, `arguments`, `super`, or `new.target` keywords. However, for our purposes, the only important difference is the lack of binding to `this`.

#### Use Cases for Arrow Functions and Normal Functions

In general, the difference between arrow functions and normal functions doesn't matter _unless you use `this` in the function_. Usually, you should avoid using `this` in functions, with two common exceptions: class methods, and callback functions. For these cases, remember these rules:

- Always use normal functions for class methods
- Always use arrow functions for [callback functions](#callback-functions)

We will cut short our discussion of context and scope here to prevent this chapter from becoming an entire book. As with scope, you'll develop a better understanding of how `this` works as you continue to work with JavaScript. [The MDN `this` reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is only one of [many great guides on this subject](https://stackoverflow.com/questions/3127429/how-does-the-this-keyword-work).

## The Spread Operator {#spread-operator}

The [**Spread operator**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is a quality of life operator available in modern JavaScript. In other words, it doesn't allow us to do anything we couldn't do in old school JavaScript, it just makes our life easier.

Suppose that we have an array of objects:

{{< code lang="js" linenos="false" >}}
const objects = [cube, sphere, tetrahedron];
{{< /code >}}

Normally, to add them to our scene, we would have to do this:

{{< code lang="js" linenos="false" >}}
scene.add(objects[0], objects[1], objects[2]);
{{< /code >}}

The spread operator is three dots: `...` and allows us to do the above with a more concise syntax - in other words, it _spreads out_ the array:

{{< code lang="js" linenos="false" >}}
scene.add(...objects);
{{< /code >}}

### Combining Objects with Spread

We can do something similar to combine two objects. A common use case is to overwrite default parameters with our custom parameters:

{{< code lang="js" linenos="false" caption="When combining an object with spread, the right side takes precedence" >}}
const defaults = {
color: 'red',
size: 'large',
};

const custom = {
color: 'blue',
};

const final = { ...defaults, ...custom };

console.log(final);
// => {color: "blue", size: "large"}
{{< /code >}}

We can combine any number of objects using spread, and **the values to the right will take precedence**. This means the default `red` will get overwritten by the custom `blue`.

## Typed Arrays

[Arrays](#arrays) in JavaScript can be any length and can hold any kind of data, in contrast to some programming languages, where arrays have a set length and a set data type.

{{< code lang="js" linenos="false" caption="Arrays in JavaScript are very flexible" >}}
const array = [1, 'two', 0xff0000, 'blue', undefined, null];

array.push({x: 5});
array.push('');
{{< /code >}}

This makes our lives as developers easy. We don't have to consider how many things will end up in an array when we create it, or what kind of data we'll store there. The downside is that it's harder for the JavaScript engine to optimize. As the array grows in size, the engine must keep allocating memory which can result in memory fragmentation (pieces of the array scattered throughout your RAM), making it slow to access the array data.

In many JavaScript applications you'll deal with arrays that contain at most a few hundred or thousand entries, so that doesn't matter too much. However, as three.js developers, we often face challenges that are less common in JavaScript development. Perhaps the most common of these is the use of arrays that contain millions of pieces of data representing things like positions in 3D space.

In these cases, the JavaScript engine will do it's best to optimize the array based on the kind of data it contains. For example, if the array contains only small numbers and no gaps, it will optimize for this case. However, as soon as we add another type of data or leave a gap in the array, that optimization is thrown out (de-optimization occurs). The other issue, as we just mentioned, is memory fragmentation as huge arrays usually end up split into many small pieces scattered through your computer's memory.

This all sounds very complicated. Why don't we help out the JavaScript engine by telling it ahead of time:

1. Exactly what type of data the array will contain.
2. Exactly how many pieces of data the array will contain.

With these, the JavaScript engine can allocate an exact amount of non-fragmented (contiguous) memory for the array and perform many other optimizations.

**This is where [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) come in.**

Type arrays are similar to normal JavaScript arrays, but we must specify the type of data they contain, and we must specify their exact length ahead of time.

There are [quite a few kinds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays#Typed_array_views) of typed array. We'll look at two of the ones more commonly used in three.js.

### `Uint8Array`

[`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) holds **unsigned integer values of 8 bits**, which means each entry in the array can hold a value between 0 and 255 inclusive.

This is in contrast to the `Int8Array` which can hold **signed integer values of 8 bits**, which means values between $-128$ and $127$ inclusive.

### `Float32Array`

[`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) stores 32-bit floating-point numbers which means values from $1.2\times10^{-38}$ to $3.4\times10^{38}$ inclusive.

`Float32Array` is the typed array most commonly used in three.js since 32-bit floating-point numbers are used to represent positions in 3D space, so we'll take a look at how to create one here. Everything we cover there applies to all typed arrays.

We can create a new `Float32Array` from an existing array as long as that array contains valid data. In this case, the length of the typed array is taken from the length of the array.

{{< code lang="js" linenos="false" caption="Typed arrays can be created from an existing array" >}}
const arr = [1, 2, 3, 4, 5, 6];

const typedArr = new Float32Array(arr);

console.log(typedArr); // => Float32Array(6) [1, 2, 3, 4, 5, 6]
{{< /code >}}

If you initialize a typed array using invalid data, you'll get entries with [`NaN` (Not a Number)](#special-numbers).

{{< code lang="js" linenos="false" caption="Invalid data will be represented as NaN" >}}
const arr = [1, {}, undefined, 4, 5, 'whatwhatwhat'];

const typedArr = new Float32Array(arr);

console.log(typedArr); // => Float32Array(6) [1, NaN, NaN, 4, 5, NaN]
{{< /code >}}

Rather than pass in an existing array, we can specify the length directly, in which case all the values in the typed array will be set to zero:

{{< code lang="js" linenos="false" caption="Typed arrays can be initialized with a length which will fill them with zeros" >}}
const typedArr = new Float32Array(6);

console.log(typedArr); // => Float32Array(6) [0, 0, 0, 0, 0, 0]
{{< /code >}}

Later, we can add and access data using the array's indices, just as we do with normal arrays.

{{< code lang="js" linenos="false" caption="You can access data in a typed array using the index" >}}
const typedArr = new Float32Array(6);

typedArr[0] = 1;
typedArr[3] = 4;

console.log(typedArr); // => Float32Array(6) [1, 0, 0, 4, 0, 0]
console.log(typedArr[2]); // => 0
console.log(typedArr[3]); // => 4
{{< /code >}}

### Differences Between Typed Arrays and Normal Arrays

If you attempt to push new data to the array rather than use the index, you'll get an error.

{{< code lang="js" linenos="false" caption="Typed arrays don't have a push method" >}}
const typedArr = new Float32Array(6);

typedArr.push(2);
// => Uncaught TypeError: t.push is not a function
{{< /code >}}

Typed arrays lack some of the **methods** (like `.push`) that arrays have. To see the difference, check out the [Typed arrays page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#Instance_methods) and compare it to [the Array page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Instance_methods).

The other important difference is that **you cannot increase or decrease the length of a typed array after creating it**. If you need to change the length, you have to throw away the old one and create a completely new typed array.

However, aside from these differences, typed arrays behave like normal JavaScript arrays. You can access elements by index and using `forEach` and other methods:

{{< code lang="js" linenos="false" caption="Typed arrays are similar to normal arrays" >}}
const typedArr = new Float32Array([1, 1, 1, 1, 1, 1]);

typedArr[2] = 5; // Float32Array(6) [1, 1, 5, 1, 1, 1];

const x = typedArr[3]; // x = 1

let sum = 0;

typedArr.forEach((value) => {
sum += value;
});

// sum = 10
{{< /code >}}

If you try to set or access an index greater than the length of a typed array, nothing will happen. This is in contrast to normal arrays where the length of the array will simply be increased.

{{< code lang="js" linenos="false" caption="Attempts to access out of bounds data are ignored" >}}
const typedArr = new Float32Array(5);

typedArr[23] = 3;

console.log(typedArr); // Float32Array(6) [1, 1, 5, 1, 1, 1]

const x = typedArr[155]; // x = undefined
{{< /code >}}

## The Math Object

JavaScript comes with lots of built-in mathematical helper methods and constants, all of which are stored in the global `Math` object.

We'll find many of them useful, for example, `Math.PI,` `Math.sin`, `Math.cos`, `Math.tan`, `Math.abs`, `Math.abs`, `Math.sqrt`, and `Math.random`. There's a complete reference on the [MDN Math Object page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math).

The `Math` object is built-in to JavaScript, and there are many other built-in objects, for example, `TypedArrays`, `Maps`, `Sets`, and so on. These are all available in any JavaScript environment such as the browser or Node.js.

However, a lot of the built-in functionality we'll encounter when using JavaScript comes from the web browser and is unavailable in other environments. We can access this functionality using something called the DOM API. For example, [the global `Window` object](#global-scope) that we've encountered several times throughout this chapter is part of the DOM API, provided by the browser.

The DOM API allows us to interact with an HTML based web page using JavaScript, and we'll explore the parts of it that we'll be using in the next chapter.
