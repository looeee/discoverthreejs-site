Translation, rotation, and scale, along with **shear** and **reflection**, make up a special subset of these transformations, known  as **affine transformations**. These have some important properties which make them very useful for us.

{{% aside %}}

## Affine Transformationsá

**An _affine transformation_ is any transformation that preserves points, straight lines and planes. Any lines that were parallel before an affine transformation will remain parallel after it.**

{{< figure src="first-steps/affine_nonaffine_trans.svg" alt="Affine and non-affine transformations" lightbox="true" >}}

Importantly, affine transformations can be reversed. No matter what kind of stretching, squashing, rotating, and scaling we do, we can always get our original shape back again. All of the transformations that you can make in three.js (at least without writing your own functions) are affine transformations.

In addition, affine transformations can be easily combined and reversed, meaning that we can rotate, transform and scale an object in a single mathematical operation, and once we have done so we can undo that and get our original shape back.

{{% /aside %}}