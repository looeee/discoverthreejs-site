---
title: "本书中使用的 HTML 和 CSS"
description: "在这里，我们更深入地了解用于创建简单网页以展示我们的 three.js 场景的 HTML 和 CSS。 即使您是 Web 开发的新手，您也应该能够快速上手。"
date: 2019-01-01
weight: 9901
chapter: "A.1"
available: true
prevURL: "/zh/book/appendix/"
prevTitle: "Appendices"
showIDE: true
IDEFiles:
  ["styles/main.css", "worlds/appendix/html-and-css-reference/index.html"]
IDEClosedFolders: []
IDEStripDirectory: "worlds/appendix/html-and-css-reference/"
IDEActiveDocument: "index.html"
IDESwitchImportsAllow: false
---

# HTML and CSS Used in This Book

In recent years, the number of ways in which you can build a website has exploded. It seems like there are a million different libraries and frameworks, with names like React, Vue, Angular, Svelte, and related tools like Webpack, Parcel, Rollup, Browserify, Babel, SCSS. New ones are being created almost daily. These are amazing tools, and each solves the problem of building complex web applications in their own unique way. Nonetheless, the sheer amount and variety of tools and frameworks can seem overwhelming, and this is especially apparent when it comes to writing a book about web development. Webpack and Babel allow us to create beautifully structured projects and use cutting edge JavaScript syntax even before it's available in any browser. React, Svelte, and other frameworks are perfect for building large and complex applications. However, any tool, especially one complicated enough to build a website, comes at the price of added complexity. When learning something new, such as three.js, it's important to keep your mental overhead low and leave room for new information to filter into place.

In this book, we'll strip the concept of a web page down to the bare minimum that will allow us to run a three.js application, and work from there. When we do this, we are left with three components: a single HTML file, a single CSS file, and some JavaScript. In this chapter, we'll explore the _**index.html**_ and _**styles/main.css**_ files. Over the following couple of chapters, we'll take a looks at how to build a modern JavaScript application and the browser API that allows us to connect it to to a webpage.

These chapters are intended to serve as a quick and basic introduction to web development. You can either read them straight through or use them as a reference as you work through the main book. There, whenever we encounter something new, a link will be provided to the relevant section of these appendices.

Later in your career as a three.js developer, you will encounter many of these tools and frameworks, and find that they provide a very different style of creating websites than our two simple files - both more complicated and more powerful. At this point, you'll find it matters very little which framework, if any, was used to create a page. As long as you have taken care with the structure of your application, **you can take the _very same_ three.js application and with almost no effort make it work in a React app, or an Angular app, or a Svelte app, or with a minimalistic web page such as the one we have created here**.

Of course, you might prefer to re-create the application to better suit the philosophy of your favorite framework, and there is nothing wrong with doing that. However, it's important to be aware that doing so is a choice, not a requirement.

This suits us well since our goal in this book is not to teach you about HTML and CSS or to talk about web development tooling. Our focus is on three.js and computer graphics, and, aside from this chapter, we'll leave the talk of HTML, CSS, and frameworks to the millions of other books and articles on these topics.

Our simple HTML page can be created using nothing more than a text editor and styled with just a few lines of CSS. Let's take a look at what goes into _**index.html**_ and _**styles/main.css**_ now.

## Hypertext Markup Language (HTML)

{{< figure src="app-logos/html5.png" alt="html5 logo" lightbox="false" class="tiny left noborder" >}}

[Hypertext Markup Language](https://en.wikipedia.org/wiki/HTML), or HTML, is the main language used to create web pages.

The building blocks of HTML are **elements**, **tags**, and **attributes**.

### Element

The terms [**element**](https://developer.mozilla.org/en-US/docs/Glossary/Element) and **node** are used interchangeably and refer to a complete section of an HTML document. Here are some common examples:

{{< code lang="html" linenos="false" caption="Some common HTML elements" >}}

<h1>A heading element</h1>

<p>A paragraph element.</p>

<a>An anchor element</a>

<button>A button element</button>
{{< /code >}}

The above elements create visual objects on the page, such as text, links, and buttons. These elements have default appearance set by the browser, which we can override using CSS styles (as we'll see below).

Some elements cannot be seen directly. For example, the `<html>`, `<head>`, and `<body>` elements create the basic structure of the page, while `<link>` and `<script>` elements are used for things like loading CSS and JavaScript files.

Another very common element is `<div>`, which is used to mark an area of the page. `<div>` is the basic container element of HTML, and the average website is likely to have hundreds of these.

{{< code lang="html" linenos="false" caption="div elements define a section of the page" >}}

<div></div>
{{< /code >}}

HTML documents are created by nesting elements inside each other.

{{< code lang="html" linenos="false" caption="Elements can be nested" >}}

<div>
  <h1>A heading element</h1>
</div>

<div>
  <p>A paragraph of test with a <a>link</a> inside it.</p>
</div>
{{< /code >}}

Here, we've divided our page into two parts. The top `<div>` contains the heading, and the bottom `<div>` contains the main text.

The `<p>` element has a further `<a>` (anchor) element nested inside it. Anchor elements are used as links which can lead to other pages (on this site or another site), or a different place on the same page. This `<a>` anchor doesn't link _to_ anywhere yet. We'll see how to set up links using attributes in a few moments.

### A Minimal HTML Document

With just the above elements, we can create a basic HTML document.

{{< code lang="html" linenos="false" caption="A minimal HTML document" >}}

<!DOCTYPE html>
<html>
  <head>
    <title>
      Rock and Roll Baby!
    </title>
  </head>

  <body>
    <h1>
      Rock, Shake, Rattle and Roll!
    </h1>
  </body>
</html>
{{< /code >}}

You can save this in a file called _**rock.html**_, then open it up in any web browser, and _Hey presto!_ you have a website!

In the above example, `<!DOCTYPE html>` marks the start of a new HTML file. Unlike most elements, the `!DOCTYPE` element does not have a closing tag.

Next, we have an `<html>` element. The opening tag is `<html>`, marking the start of an element, and the closing tag is `</html>`, placed at the very end of the file.

Inside the `<html>` element, we have two sub-elements, `<head>`, and `<body>`. Each of these has further sub-elements.

The only element we haven't seen so far is the `<title>`, which tells the browser what to display in the URL bar or tab at the top of the browser window.

These elements and sub-elements define a tree-structure:

{{< figure src="/appendix/html-tree.svg" caption="The HTML Tree Structure" lightbox="true" class="" >}}

### Tag

Elements are defined by [tags](https://developer.mozilla.org/en-US/docs/Glossary/tag), which are used to mark the start or end of an element.

For example, to start an HTML document, you create the opening `<html>` tag, and to end the document, you place a closing `</html>` tag. To start a paragraph, you create an opening `<p>` tag, and to end the paragraph you create a closing `</p>` tag. In every case, the closing tag will look the same as the opening tag with an extra `/` character.

Most elements require both an opening and a closing tag, although some do not, such as the `<!DOCTYPE html>` tag at the start of the file.

### Attribute

[Attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) are additional data that can be added to an element. They are placed within the opening tag.

#### The `id` and `class` Attributes

The two most common attributes are [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) and [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class). We can use these attributes to reference an element within a CSS or JavaScript file. In the CSS file, we can apply style rules, and within the JavaScript file, we have almost unlimited ability to control the element, allowing us to delete, replace, edit, or animate the element in any way we like.

Here is a button with an ID:

{{< code lang="html" linenos="false" caption="A button with an ID attribute" >}}
<button id="close-button">Click here to close!</button>
{{< /code >}}

Here, we can use the `close-button` ID within our CSS file to change the appearance of the button, and within JavaScript, we might add a function to control what happens when the button is clicked.

{{< code lang="html" linenos="false" caption="Two elements with the same class attribute" >}}

<h1 class="notice">A heading you want to stand out.</h1>

<p class="notice">Some text you want to stand out.</p>
{{< /code >}}

Classes are not unique. You can have any number of elements with a `.notice` class. If you use this class in your CSS file to set the text color to red, for example, text in both the `<h1>` and `<p>` elements will turn red (unless already controlled by a stronger CSS rule elsewhere in your application). Within JavaScript, you can use the class to reference either or both of these elements.

#### The `style` Attribute

As well as connecting CSS styling to an element using IDs and classes, you can use the `style` attribute to attach inline styles directly to an element. For example, here we have set the text color for a single paragraph element to `skyblue`:

{{< code lang="html" linenos="false" caption="An inline style declaration" >}}

<p style="color: skyblue;">This text will be red.</p>
{{< /code >}}

#### The `href` Attribute

The [`href` attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/href) links to a resource using an URL. Usually, this attribute is used with an `<a>` anchor element:

{{< code lang="html" linenos="false" caption="An anchor element linking to the three.js forum" >}}
<a href="https://discourse.threejs.org/">the three.js forum</a>
{{< /code >}}

When a user clicks on the above link, they will be redirected to [the three.js forum](https://discourse.threejs.org/).

Anchor elements can lead to external sites, other pages on the same site, or even a different section of the same page.

Another common use case for the `href` attribute is to connect a CSS files using the [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) element.

{{< code lang="html" linenos="false" caption="A link element referencing the main stylesheet" >}}

<link href="/styles/main.css" rel="stylesheet">
{{< /code >}}

We have also added the `rel=stylesheet` attribute here. `<link>` elements can be used for many purposes, so we need to inform the browser that this one is linking to a CSS style sheet.

#### The `src` Attribute

Similar to the `href` attribute, the `src` attribute points to a resource in another location. These resources can be [images](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [videos](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video), [sound](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) files, and more:

{{< code lang="html" linenos="false" caption="Image and audio elements" >}}
<img src="chuck.jpg">

<audio src="johny-be-good.mp3"></audio>
{{< /code >}}

More importantly for us in this book, we can also use the `src` attribute to link to JavaScript files using the [`<script>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script):

{{< code lang="html" linenos="false" caption="A script element referencing a JavaScript file" >}}

<script src="main.js"></script>

{{< /code >}}

#### The `module` Attribute

We'll be writing our JavaScript using ES6 modules in this book (more on those in the following chapter), so we need to add one more attribute to our script tag:

{{< code lang="html" linenos="false" caption="A script element referencing a JavaScript module" >}}

<script type="module" src="main.js"></script>

{{< /code >}}

Now the browser knows we are using JavaScript modules and it can interpret the `main.js` file correctly.

### The `<html>` and DOCTYPE Elements

Every webpage starts with these two elements. These simply inform any interested parties (such as a web browser) that this is an HTML document.

{{< code lang="html" linenos="false" caption="Defining an HTML document" >}}

<!DOCTYPE html>
<html>
  <!-- You page goes here -->
</html>
{{< /code >}}

Incidentally, here's how you write a comment in HTML: `<!-- You page goes here -->`. Anything between `<!--` and `-->` is for human eyes only and will be ignored by the browser.

### The `<head>` Element

Inside the `<html>` element, there are two sub-elements called `<head>` and `<body>`.

{{< code lang="html" linenos="false" caption="The head element contains metadata and the body contains the content" >}}

<!DOCTYPE html>
<html>
  <head>
    <!-- Metadata -->
  </head>
  <body>
    <!-- The main content -->
  </body>
</html>
{{< /code >}}

The `<head>` element is the place where we put metadata. This can include instructions for the browser on how to render the page, as well as information for search engines and social media sites, links to CSS and JavaScript files, and more.

Every example in this book will use the same `<head>` section:

{{< code lang="html" linenos="false" caption="The head section of our minimal web page" >}}

<head>
  <title>Discoverthreejs.com</title>

  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta charset="UTF-8" />

  <link
    rel="icon"
    href="https://discoverthreejs.com/favicon.ico"
    type="image/x-icon"
  />

  <link rel="stylesheet" href="./styles/main.css" type="text/css" />

  <script type="module" src="js/main.js"></script>
</head>
{{< /code >}}

First, there's the `<title>`. This contains some text that will appear in the tab on your browser. Next, the two `<meta>` elements ensure that our page looks the same no matter what browser or device we display it on:

- The [Viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) only applies to mobile devices, which render the page in a virtual viewport:
  - `width=device-width`: render the page at the same width as the device.
  - `initial-scale=1`: set the initial scale to 1.
- The `<meta charset>` tag tells the browser how to decode the HTML document itself.

Next, there are two `<link>` elements:

- `<link rel="icon" ...`: links to a [_favicon_](https://discoverthreejs.com/favicon.ico) that shows up in the browser's URL bar, next to the title.
- `<link rel="stylesheet" ...`: links to a style sheet called _main.css_ which we can use to control the color, font, width, height, position, and so on, of elements on the page. This file is located in a folder called _/styles_, relative to our HTML file.

Finally, there's a `<script>` tag linking to our main JavaScript file, _**main.js**_. This file is also known as the _entry point_ of our JavaScript application, and it may contain links to other JavaScript files inside it. We will always put script elements into the head section of our HTML, but in the real world, you may find scripts elements anywhere in an HTML document.

That's it for the `<head>` section.

### The `<body>` Element

The `<body>` element (mostly) contains things that we want to see in the browser.

Here, we have created a heading and a paragraph.

{{< code lang="html" linenos="false" caption="The body element containing a title and some text" >}}

<body>
  <h1>
    Rock, Shake, Rattle and Roll!
  </h1>
  <p>Charles Edward Anderson Berry was an American singer and songwriter, and one of the pioneers of rock and roll music.</p>
</body>
{{< /code >}}

The `<h1>` element is the main title which will show in large bold font at the top of the page. Text with then `<p>` element will be rendered at the standard size (either the browser default or styles we have created in CSS).

{{% note %}}
TODO-DIAGRAM: add extra diagram of rectangular elements
{{% /note %}}

### The `<canvas>` Element

A very important element for us is the `<canvas>` element. All WebGL scenes are drawn inside a canvas element like this one.

{{< code lang="html" linenos="false" caption="A canvas element" >}}
<canvas></canvas>
{{< /code >}}

Usually, we won't create the canvas ourselves. Instead, we'll let three.js create and set up the `<canvas>` for us, then use JavaScript to add it to the page.

In addition to WebGL, canvas elements can be used with the [2D Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to create simple 2D drawings.

## Cascading Style Sheets (CSS)

{{< figure src="app-logos/css3.png" alt="css3 logo" lightbox="false" class="tiny left noborder" >}}

As we mentioned above, when you create a visible HTML element such as a `<button>` or `<h1>` heading, the browser will apply a default style to it. The web would be a very boring place if all buttons and headings on every website looked exactly the same. Fortunately, we can override the defaults with styles with our own.

[Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets), or CSS, is the language we use to add create these custom styles.

Using CSS, we can change things like width/height/margins/rounded corners/colors/fonts and so on or HTML elements.

It's possible to write CSS styles directly in the HTML file, either inline in the `style` attribute or inside a `<style>` element. However, it's best practice to define your styles in a separate file and then use a `<link>` element to reference it from your HTML document, as we described above.

One thing to be aware of when writing CSS styles is that every HTML element already has default CSS rules applied, and these _may_ vary from browser to browser. **When we specify a rule in our CSS, we are overwriting the browser defaults**.

### Specificity

CSS styles have a specificity level, which is a weight applied to each style rule. Browser default styles have the lowest specificity, while custom styles that you create may have various levels of specificity depending on how you create them.

We won't get into this further here since it's a fairly complex topic, but it's important to remember that if you have created a style and it doesn't seem to be working, it may be because it's overridden by a style with higher specificity elsewhere. The browser dev tools (F12) are very useful in determining what styles are applied to an element.

There are three different ways to create CSS styles, ranked from [least to most specific](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity).

### Styling Elements

First, we can set styles for an element such as `<p>`, `<h1>` or `<div>`, in which case, all elements of the same type will be styled. Here, we will make all `<p>` elements red and all `<h1>` elements blue:

{{< code lang="css" linenos="false" caption="Style for paragraphs and the largest heading size" >}}
p {
color: red;
}

h1 {
color: blue;
}
{{< /code >}}

### Styling Classes

Next, we can define CSS classes that correspond to the HTML `class` attribute we described above. Suppose we have some paragraphs of text in our HTML file, some of which have a `notice` class applied:

{{< code lang="html" linenos="false" caption="Styling all paragraphs with the 'notice' class" >}}

<p class="notice">Some text that you want to stand out.</p>

<p>Some normal text.</p>

<p class="notice">More text that you want to stand out.</p>
{{< /code >}}

If we define the `notice` class in our CSS file, we can style the text in only those paragraphs with the class. Classes in CSS are denoted using a `.` followed by the class name.

Here, we'll make the text red once again:

{{< code lang="css" linenos="false" caption="Set text color of all elements with the 'notice' class" >}}
.notice {
color: red
}
{{< /code >}}

But this time, only the first and third paragraphs will become red, while the middle one will remain black. We can add the notice class to any element, not just `<p>`. Here, the first `<h2>` element will also have red text:

{{< code lang="html" linenos="false" caption="You can use a class with any type of element" >}}

<h2 class="notice">A very important heading</h2>

<h2>A heading of normal import</h2>
{{< /code >}}

### Styling IDs

The most specific way of styling things in a CSS file is using IDs, which again correspond to the `id` attribute in HTML. Styles defined using an ID are applied to a single element. Here is a button with a unique `id` attribute.

{{< code lang="html" linenos="false" caption="Give a single button a unique ID" >}}
<button id="close-button">Click here to close!</button>
{{< /code >}}

Within CSS files, IDs are written using a `#` character followed by the ID name.

This time, just to be different, let's give our close button a red border:

{{< code lang="css" linenos="false" caption="Define styles for the 'close-button' ID" >}}
#close-button {
border: 1px solid red;
}
{{< /code >}}

## Our Simple Web Page

Now, we are ready to fill in the details of our _**index.html**_ and _**styles/main.css**_ files to create our simple web page.

### _**index.html**_

{{< code lang="html" linenos="false" caption="Our index.html file" >}}

<!DOCTYPE html>
<html>
  <head>
    <title>Discoverthreejs.com - HTML and CSS Used in This Book</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8" />

    <link rel="icon" href="https://discoverthreejs.com/favicon.ico" type="image/x-icon">
    <link href="./styles/main.css" rel="stylesheet" type="text/css">

    <script type="module" src="./src/main.js"></script>

  </head>
  <body>
    <h1>Discoverthreejs.com - HTML and CSS Used in This Book</h1>

    <div id="scene-container">
      <!-- Our <canvas> will be inserted here -->
    </div>

  </body>
</html>
{{< /code >}}

Take a look at the `<div id="scene-container">`. We will use three.js to automatically create a `<canvas>` element, and then we'll use JavaScript to insert it with this `<div>`. Most of the examples in this book will take up the whole page, so we will use some CSS to make this element the correct size.

### _**main.css**_ {#main-css}

Within our CSS file, we want to make sure that the `<body>` element takes up the whole screen, that the `<div id="scene-container">` element fills the whole body, and that the `<h1>` heading gets drawn on top of the `<canvas>` and not underneath it. Aside from that, we'll to set the `color` of our heading text, and center it near the top of the screen... and that's about it. Here's what we need to put inside the _**main.css**_ style sheet to achieve all that:

{{< code file="styles/main.css" lang="css" linenos="false" >}}{{< /code >}}

### The Body Styles

In most browsers, the body element has a default `margin` of 8 pixels. This means there will be an empty gap of 8 pixels on all sides of the screen, and these will show up as white lines around the edges of our full-screen three.js scene. We don't want this, so we'll override the default and set the margin to zero:

{{< code lang="css" linenos="false" caption="Set the body margin to zero">}}
margin: 0;
{{< /code >}}

Next, we want to hide the scroll bars since our scene has no off-screen content:

{{< code lang="css" linenos="false" caption="Hide scroll bars" >}}
overflow: hidden;
{{< /code >}}

Finally, we'll set some styles for any text on the page. Here, we are aligning text to the center of the screen, setting a base size of twelve pixels for one character, using a sans-serif font, and setting the text color to a light grey:

{{< code lang="css" linenos="false" caption="Set text styles for all elements on the page" >}}
text-align: center;
font-size: 12px;
font-family: Sans-Serif;

color: #444;
{{< /code >}}

Look at the tree structure of our HTML page again:

{{< figure src="/appendix/html-inheritance.svg" alt="Inheritance of CSS classes" lightbox="true" class="" >}}

When we set the font properties on the `body` like this, all children of the body will _inherit_ these properties unless we or the browser have already defined styles for them. Here, this means that the `<h1>` element will also have center-aligned, grey, sans-serif font.

However, the browser has already set a margin value on `<h1>` elements that will override the margin of zero we set on the body. If we want to remove the `<h1>` margin, we would have to add another style to do so.

When it comes to font sizing, things are a little more complicated. The browser considers the font size we set on the `<body>` to be the _base size_, then calculates the font size of various elements as percentages of that. `h1` is the largest heading size, and the browser will set the font size to 200% of the base size, or 24px. `h2` elements will be 150% of the base size, or 18px, and `<p>` elements will be 100% of the base size, 12px.

### Style the Heading

Next up, in the heading selector, we're using [absolute positioning](https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/), which means _relative to the containing element_ (in this case, the `<body>` element). We've given the element a width of 100% of the containing element, which is the body, so the heading will take up the full-screen width.

Next, we've set the `z-index` which controls the order in which elements are drawn. If we didn't add this, the browser would draw the heading first and then draw the `<canvas>` on top of it, hiding the heading. All elements have a default `z-index` of zero, so by setting the heading to one, we ensure that it is drawn on top.

### Style the Scene Container Element

The `#` symbol is used to represent an ID, so `#scene-container` controls the appearance of `<div id="scene-container">`.

Once again, we are using `absolute` positioning for our scene container and setting its `width` and `height` both to `100%`, meaning that it will take up 100% of the parent element, in this case, the `body`. As we already made sure that the `body` will take up the whole screen, that means our `#scene-container` will also take up the whole screen.

Finally, we'll set the background color of the container the same color as the color of the background of our scene, or at least, as close as possible. This will reduce flashing and flickering on load as your three.js scene will usually be rendered a couple of frames later than the container.

With that out of the way, our page is ready to go! In the next chapter, we'll turn our attention to basic JavaScript syntax that we'll be using throughout the book.
