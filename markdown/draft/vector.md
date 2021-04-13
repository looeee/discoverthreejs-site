{{% aside %}}

### Introducing the `Vector3` Object

Take a look back at how we positioned the nose and the cabin. First, we moved (**translated**) the nose along the $X$-axis using:

```js
{{< codesnippet file="worlds/first-steps/built-in-geometries/src/Train.js" from="112" to="112" >}}
```

views
Next, we moved the cabin along the $X$-axis, $Y$-axis, and $Z$-axis in one single step using:

```js
{{< codesnippet file="worlds/first-steps/built-in-geometries/src/World.js" from="115" to="115" >}}
```

views
Of course, we could have done this over three lines like this for an identical result:

```js
cabin.position.x = 1.5;
cabin.position.y = 0.4;
cabin.position.z = 0;
```

Whatever method we use to do this, we are performing the 3D vector operation:

$$ (0, 0, 0) \longrightarrow ( 1.5, 0.4, 0 )$$

{{% /aside %}}
