{{% aside success %}}

### Hang on! What's a Constructor?

A **constructor** is something that is used to create a new object. You will call it with the `new` keyword, and by convention, the name will always start with a capital letter.

The `Scene` (capital letter) is a **constructor** for a **class**, and when you call it with `new` you'll get an **instance** of that class. We'll store a reference to this instance in a variable which we'll call `scene` (small letter) so that we can use it again later.

### ...and What's a Parameter?

A parameter is some kind of information that we can give to the constructor to tell it something about the object that we want to create.

Each constructor takes different parameters. For example, the constructor for a box-shaped geometry might take information about the length, width, and height of the box, while a constructor for a sphere shaped geometry would take information about the radius of the sphere, and the constructor for the scene that we just created takes no parameters at all.

{{% /aside %}}
