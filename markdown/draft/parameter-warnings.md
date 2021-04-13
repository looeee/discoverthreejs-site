{{% aside warning %}}

### three.js Does Not Provide Warnings If You Enter Invalid Parameters!

For a number of reasons, but in particular, due to the need to keep the size of the three.js file as small as possible, you will generally not get any warnings if you enter invalid parameters, anywhere in three.js.

In the case of `texture.anisotropy`, even though the valid values are $1$, $2$, $4$, $8$, and $16$, you can set the anisotropy to anything that you want and three.js and WebGL will handle it.

It will round odd numbers up so that setting `texture.anisotropy = 3` will give the same result as `texture.anisotropy = 4`, and you can even do crazy things like `texture.anisotropy = 'hey there!'` and you will still not get any warnings! Everything will still work and the anisotropy will be set to $1$.

Most objects in three.js work like this, meaning that it is up to you to make sure that you are entering reasonable parameters. **However, in general, if you enter an invalid value for a parameter, your app will break in an inexplicable way** and you will have to work hard to track it down.

This is always a good chance to hone your debugging skills (remember, `console.log` is your friend here), and with a bit of practice you can usually track down the line causing the error within a few minutes.

{{% /aside %}}