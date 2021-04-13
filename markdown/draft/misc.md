## How three.js Connects to a Web Page

But first, let's see how three.js connects to a web page (note that we're using the terms "web page", "page",
and "HTML document" interchangeably in this chapter). HTML documents are built out of elements, which can contain things
like text, images, video and so on. We'll describe how these work below.

Using three.js, we can render our scenes using several different methods, but in this book we will focus on the most powerful method available to us, called **WebGL**. WebGL is an API that allows us to send instructions and data to a device's graphics card using JavaScript, and, if our program was written correctly, the graphics card will run those instructions and return beautiful images.

So, we want to render our three.js scenes using WebGL, and have the results show up in our HTML document. Fortunately, that's easy to do using a special HTML element called `<canvas>`.

**WebGL is an API that allows us to send instructions and data to a device's graphics card. Any images or animations created in this way are returned to the browser and drawn into an HTML `<canvas>` element.**

In this book, we'll set up a very basic HTML page to contain our canvas element. We'll style this HTML with just enough CSS to make it look good, and to make the canvas take up the full page. _Everything_ else will be done in JavaScript, even creation of the `<canvas>` element itself!.

Let's take a quick look at the HTML and CSS you need to know now. Even if you have never created a website before, you should be able to get up to speed with this quickly.
