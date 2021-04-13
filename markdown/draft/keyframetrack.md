Using keyframes, we can say things like:

1. **At $0$ seconds _(time)_, be at position $(0,0,0)$ _(data)_.**
2. **At $2$ seconds _(time)_, be at position $(1,7,0)$ _(data)_.**
3. **At $4$ seconds _(time)_, be at position $(23,0,10)$ _(data)_.**
4. **At $8$ seconds _(time)_, be at position $(0,0,0)$ _(data)_.**

A sequence of keyframes consists of a list of times and values, so the above sequence can be stored as two arrays:

``` js
const times = [0, 2, 4, 8];

const positions = [
  new Vector3(0, 0, 0), // position at zero seconds
  new Vector3(1, 7, 0), // position at two seconds
  new Vector3(23, 0, 10), // position at four seconds
  new Vector3(0, 0, 0) // position at eight seconds
];
```

However, it's very inefficient to create lots of `Vector3` object like this.

Of course, it's fine for these four keyframes, but an animation may have thousands or even tens of thousand of keyframes, in which case, it will be much more efficient to skip the vectors and store the "bare" numbers:

``` js
const times = [0, 2, 4, 8];

const positions = [
  0, 0, 0, // x,y,z at zero seconds
  1, 7, 0, // x,y,z at two seconds
  23, 0, 10, // x,y,z at four seconds
  0, 0, 0 // x,y,z at eight seconds
];
```

Without the comments, this is not easy to read:

``` js
const times = [0, 2, 4, 8];
positions =  [0, 0, 0, 1, 7, 0, 23, 0, 10, 0, 0, 0];
```

However, it's so much more efficient that it's worth sacrificing readability, and you will see this pattern used a lot while working with three.js.