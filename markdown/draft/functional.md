### Side Effects, Pure Functions, and Functional Programming

Changing a variable that was defined _outside_ the function from _inside_ the function is called a [**side
effect**](https://en.wikipedia.org/wiki/Side_effect_(computer_science)). In our tiny, contrived example there's nothing
obviously wrong with doing that. However, in a more complex program functions with side effects make our code harder to
write and reason about.

A function without side effects is called a [**pure function**](https://en.wikipedia.org/wiki/Pure_function). We should aim to write pure functions wherever possible, as they lead to easier to understand code. A pure function is something that you can think of as a self-contained unit - you can take it from one program and drop it into another and it will work in exactly the same way.

By contrast, functions with side effects are built to work in a particular place, and we must know all about the surrounding code to use them.

**Functional programming** is a programming style which requires us to use **only pure functions**. In this book we'll take a pragmatic approach - in other words, we'll aim to write pure functions but if it seems like we're jumping through hoops and complicating our code to do so, we'll allow ourselves to slip in a couple of impure functions.

Here's a more practical example of a function with side effects: modifying an object's properties inside a function.

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
const catWeights = {
  ginger: 1,
  gemima: 3,
};

// a non-pure function that
// modifies an existing object
function addNewProperty() {
  catWeights.geronimo = 30;
}

addNewProperty();

/*
now the object has a new property, z:
{
  ginger: 1,
  gemima: 3,
  geronimo: 30,
};
*/
{{< /code >}}

Once again, in this simple example there's no obvious problem.

However, what if the `addNewProperty` function was written in a different file, or even a different library? We now have to look at the _definition_ of the function `addNewProperty` to understand this object. We can avoid this to some degree by writing pure functions.
