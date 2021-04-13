By contrast with polymorphic functions, **monomorphic functions** only accept a single data type. There's no way to write monomorphic functions in JavaScript. This gives us a lot of flexibility, but also means that we have to take responsibility for making sure that sensible arguments are passed into our functions.

Another consideration here is performance - behind the scenes the JavaScript engines do a lot of work to optimize your code. When the engine sees a function like `add(x,y)` and then sees you call it using `add(1,2)`, it will assume that you intend to use this function to add _small numbers_, and it will make appropriate optimizations based on that assumption.

If you later call the function with different data types - `add('cart','horse')`, then you will cause **de-optimization** to occur. In other words, if a given function is on the **hot path** of your application, that is, you are calling it often, then you should take care to only use one kind of data with the function.

On the other hand, if you're only calling the function occasionally (like, a few tens of thousands of times or less) then throw whatever data you like in there.