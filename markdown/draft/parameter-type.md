{{% aside %}}

Note that all method  parameters have a type specified in the docs:

* `radiusTop : Float`
* `radialSegments : Integer`
* `openEnded : Boolean`

This refers to the type of variable that three.js expects you to pass in here. `Float` means any number, while `Integer` means whole numbers like $-1, 0, 1, 2, 3$ and `Boolean` means either `true` or `false`.

Pay careful attention to the type in the docs, since three.js doesn't usually check that you have entered the correct type. This can lead to errors which are hard to track down.
{{% /aside %}}