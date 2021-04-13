### The `event.preventDefault` Method

Here's how that works.

This will set up a listener for left mouse clicks on the whole window and log a message to the console whenever you click on the page. However, all normal mouse functions will still work, which means that **all buttons, menus and links on the page will still work**:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Paste this code into the browser console" >}}
document.addEventListener( 'click', () => {
  console.log('You clicked the mouse!');
});
{{< /code >}}

However, **this will break all buttons, menus and links on the page**:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="Paste this code into the browser console (after refreshing the page)" >}}
document.addEventListener( 'click', (event) => {
  console.log('You clicked the mouse!');

  // prevent the default behavior of mouse clicks
  event.preventDefault();
});
{{< /code >}}

Now, when we click the mouse on the page, the message will be logged to the console but nothing else will happen.