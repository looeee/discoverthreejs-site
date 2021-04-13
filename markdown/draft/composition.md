 ### Adding Functionality to Classes Using Composition

Inheritance seems like an amazing, powerful tool - and indeed, it is, when used well. However, there is a phrase you will hear a lot when reading books on programming:

> Favor Composition Over Inheritance

Deriving a `Cat` base class from an `Animal` superclass is a nice, simple, intuitive example. But it's not a _real_ example, and decades of experience has taught us that in the real, messy world, inheritance can quickly get out of hand and should be used sparingly.

Another way of adding functionality to classes is to use composition. This works by making new functionality a property of the class.

For example, cats have legs, right? And a tail. And ears, eyes, nose, a tongue, teeth, claws, and fur. Just about everything required to strike fear into the heart of any animal less than twelve inches long.

Add all of that using inheritance would be a mess. Instead, let's see how it works using composition. We'll create a new `Legs` class. We can the add these legs to any kind of animal we like:

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
Class Legs{
  constructor() {}

  walk() {}
}
{{< /code >}}

How about a `Ears` class?

{{< code lang="js" linenos="false" linenostart="0" hl_lines="" caption="" >}}
Class Ears{
  constructor() {}

  twitch() {}
}
{{< /code >}}
