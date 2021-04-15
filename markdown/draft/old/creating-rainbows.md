---
title: "Creating rainbows: Colors in three.js"
description: "TODO"
menuImage: 'geometries/dodecahedron.png'
date: 2018-04-02
weight: 103
chapter: "B.3"
draft: true
---
{{% fullwidth %}}
# CREATING RAINBOWS: COLORS IN three.js
{{% /fullwidth %}}

We'll be working closely with the [Color](https://threejs.org/docs/#api/math/Color) docs page here. Open it up now and take a look.

The first thing you'll notice is that there are many ways to specify a color. For example, you can pass in 2 numbers representing the Red, Green and Blue components of the color, or you can pass in the string 'rebeccapurple' (or any other CSS color string), or you can pass in a HLS value. And so on.

 However, there is only one standard way of specifying a color in three.js, and that is via a `hexadecimal triple`. So, let's forget all the others for now and focus on that. (of course, there are exceptions to this)

Wait, a hexa-what?

### A Very Quick Introduction to Hexadecimal Numbers

Binary is base two - counting with just two digits (0 and 1). Ternary is base 3 - counting with 3 digits (0, 1 and 2).

Octal ( often incorrectly called octadecimal ) means base 8, which means that you count with the digits 0, 1, 2, 3, 4, 5, 6 and 7 (which makes up 8 digits).

Decimal, base 10, you are certainly familiar with. You count using the digits 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. Ten digits.

`Hexadecimal` means base 16. The problem is, now we have run out of digits to count with since so far we have been stealing them from the decimal system which only has 10 digits.

The solution is to steal some from the next most common collection of symbols - the alphabet.

So, to count to 15 in hexadecimal, you use the digits 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F.

Note that capital and lowercase letters are interchangeable here, so `a = A`, `b = B`, `c = C` and so on, and the hexadecimal number `asdefa` is exactly the same as `ASDEFA`.

The number 16 in decimal is written as `10`, then you start over with decimal 17 written as `11` and so on.

It all looks a bit confusing when written down like this, but it's one of those things that you need to use to understand - so grab a pen and paper now and do some basic arithmetic in hexadecimal. We'll wait.

These make all all be numeral systems commonly used in computer science, and with the exception of decimal, the are all bases that are powers of two. Which makes sense, since dealing with numbers that are powers of 2 is generally much more efficient. That's the reason these bases are used. If you ever come across a place where a base other than decimal is being used, it's probably because it's more efficient in some way.

### Why are Colors Stored in Hexadecimal Format?

Colors in screens are generally represented using patterns of red, green and blue lights. In fact, one pixel is 3 tiny lights. And each of these lights can be set to 256 different levels of brightness (with a range of 0 -> 255), which means that each pixel can have 256x256x256 = 16,777,216 different colors.

Yes, this is a simplification - there are many different display technologies out there and most don't use tiny lights. But the theory works out to be roughly the same and this is an easy way to explain it.

To write down a color in decimal we would need to be able to write down the number 16777216 - and actually, it gets more complicated than that because we want to keep the red, green and blue components separate. So a white pixel would be represented by the value 255,255,255, which we will call a 'triple' of numbers. That's 9 digits per pixel.

Remember that we are not counting past 255 here. Each value separated by a comma in 255,255,255
is distinct and goes only from 0 to 255, where 0 means black (the tiny light is switched off), and 255 which means maximum red, green or blue.

Here's where hexadecimal comes in. Because you see, 256 = 16 X 16. We can write the decimal range 0 to 255 with only 2 digits in hexadecimal, rather than 3 digits in decimal. The number 255 in decimal becomes the number FF in hexadecimal.

So that decimal triple of numbers 255,255,255 becomes the number FF,FF,FF in hexadecimal, allowing us to write it in only 6 digits rather than 9.

### Hexadecimal Triples

This triple of hexadecimal numbers FF,FF,FF is... you guessed it, a hexadecimal triple ( or _hexadecimal triplet_ ). Of course, since we are trying save space we also remove the commas and are left with just FFFFFF (white).

If you've spent any time working with CSS then you should recognise this immediately, since this is also how CSS stores colors. There, you put a '#' in front of it to signify that it's a hexadecimal number. So '#FFFFFF' (equivalently, '#ffffff') represents the color white in CSS.

Writing hexadecimal numbers is JavaScript is similar, but instead of '#', we use `0x` - so the FFFFFF is written as `0xFFFFFF`. Therefore the color white in three.js is written as `0xFFFFFF`.

Remember that in FF,FF,FF the first two digits represent the amount of red, the second 2 digits represent the amount of green and the final 2 digits represent the amount of blue, and each goes from 00 -> FF. Here are a couple of other colors:

* `0x000000` : black. Since this is just the number 0 in Hexadecimal, you could also write this as `0` or `0x0`. But I urge you not to since it results in harder to read code. The convention in three.js is always to write the full hexadecimal triple.
* `0xFF0000` : Pure red
* `0x00FF00` : Pure green
* `0x0000FF` : Pure blue
* `0x800080` : Purple


So how much of an advantage does this actually give us compared to other ways of writing colors? Well... perhaps not that much. But since we are working on the web, and the standard way of specifying colors is to use hex triples, it makes sense to continue this tradition. Also, there are some other advantages that I haven't touched on, for example, since FF is the maximum 2 digit number you can write in hex, it's not possible to accidentally specify a color such as 275,255,255...

### A White Box

[](codepen://looeee/aEBKYK)

Now that we have covered all of that, and not even touched a line of code, here is a nice white box for you to play with. Try putting in a few different colors for the material, and see if you can accurately say what they will be before the scene is reloaded.

``` js
...
  const boxMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
...
```

Try these:

* `0xFF00FF`: Maximum Red, 0 Green, Maximum Blue
* `0x00FFFF`: 0 Red, Maximum Green, Maximum Blue
* `0xFFFF00`: Maximum Red, Maximum Green, 0 Blue

### A Note on the Material.color Parameter

Notice that we have been talking about an object called `THREE.Color` throughout this chapter. You can create on like this:

``` js
...
  const redColorObject = new THREE.Color( 0xff0000 );
...
```

However, when we came to actually creating a red object, we did not do this. TThe material does it automatically for us.

We just pass in the `color: 0xffffff` parameter to the material and it handles the new `THREE.Color` stuff for us internally. We'll rarely need to create a `THREE.Color` ourselves.