{{% note %}}
## Looking to the Future: Extending the World Interface

In the future, we will want to add additional functionality such as user controls to the World app. Whenever we expand the scope of the way that the outside world can interact with the app, we will do so by first considering whether we can use the existing interface, and if not, then by cautiously expanding it.

As a simple example, let's explore how to add a HTML button that starts the app. We'll delay rendering the scene until the user clicks this button.

In HTML, the button might look like this:

{{< code lang="html" linenos="true" linenostart="18" hl_lines="6" caption="index.html" >}}
<body>

  <h1>Discoverthreejs.com - The <code>World</code> Class</h1>

  <button id="start">Render the scene</button>

  ...
{{< /code >}}

To use this button, first we need a reference to it in JavaScript, for example using `document.querySelector`, and then we'll add an event listener for mouse clicks. Refer to {{< link path="/book/appendix/dom-api-reference/" anchor="#accessing-html-elements" title="Accessing HTML Elements" >}} and {{< link path="/book/appendix/dom-api-reference/" anchor="#listening-for-events" title="Listening for Events" >}} in the appendices for more info on each of these.

Since the button is a DOM element, and `.querySelector` and `.addEventListener` are DOM API methods, we can't use them inside World. Instead, we'll add the relevant code to _**main.js**_:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Waiting until the user clicks a button to start the app" >}}
...

const world = new World(container);

const button = document.querySelector('#start-animation');

button.addEventListener('click', (e) => {
  world.start()
});

...
{{< /code >}}

We didn't need to expand our World interface since the `.start` method was all we needed.

This approach is fine for a single, simple HTML button. However, we should note that we're breaking the Single Responsibility Principle. _**main.js**_ is the entry point for our app, not the place where we should be setting up user controls.

If we create an extensive user control system, or any other kind of system that interacts with the HTML page, we should carefully consider how to implement it. For example, we will have to consider whether we want to keep World completely isolated from the DOM, or whether it's OK to access the DOM in a sub-module.

{{% /note %}}
