---
title: "Working with the three.js Lights"
description: "TODO"
date: 2018-04-02
weight: 702
chapter: "7.2"
---


# Working with the three.js Lights





## Ambient

Intensity = irradiance (lux if physically correct lighting)

[AmbientLight](https://threejs.org/docs/#api/lights/AmbientLight)
Intensty = irradiance (lux if physically correct lighting)

[HemiLight](https://threejs.org/docs/#api/lights/HemiLight)



[PointLight](https://threejs.org/docs/#api/lights/PointLight)
[PointLightHelper](https://threejs.org/docs/#api/helpers/PointLightHelper)

[DirectionalLight](https://threejs.org/docs/#api/lights/DirectionalLight)
[DirectionalLightHelper](https://threejs.org/docs/#api/helpers/DirectionalLightHelper)

[SpotLight](https://threejs.org/docs/#api/lights/SpotLight)
[SpotLightLightHelper](https://threejs.org/docs/#api/helpers/SpotLightLightHelper)


# Lights
Currently, we can choose from the following six light types:

* [`AmbientLight`](https://threejs.org/docs/#api/lights/AmbientLight  - this light type is used to add "global illumination" to the scene. We'll explain what this means in [Chapter 1.5](/book/first-steps/camera-controls/#adding-global-illumination-with-an-ambientlight).
* [`DirectionalLight`](https://threejs.org/docs/#api/lights/DirectionalLight)  - this light simulates light from a distant, bright source such as the sun.
* [ `HemisphereLight`](https://threejs.org/docs/#api/lights/HemisphereLight) - this creates a two toned light that fades from a "sky" color to a "ground" color.
* [`PointLight`](https://threejs.org/docs/#api/lights/PointLight)  - use this light when you want to simulate a small nearby light source such as a lightbulb or candle.
* [`RectAreaLight`](https://threejs.org/docs/#api/lights/RectAreaLight)  - the most recent addition, you can use this light to simulate light from a window or fluorescent strip.
* [`SpotLight`](https://threejs.org/docs/#api/lights/SpotLight) - as the name suggests, this light can be used to simulate a (round) spotlight.

### Adding Omnidirectional Illumination with a Pointlight

Next we'll add a `PointLight`. This light also shines in every direction, but this time from a specific point in space. You can think if this one as being like a bare light bulb, that illuminates everything around it. In some applications, this is called an 'Omni' (for omnidirectional) light.


Try moving the light around a little to see the effect of the shiny areas of the box (the technical term for these is [specular highlights](https://en.wikipedia.org/wiki/Specular_highlight)).

{{% aside warning %}}

#### Updating the DirectionalLight's Target

If you want to move the `DirectionalLight.target` from `( 0,0,0 )`, you'll have to add it to the scene:



{{< code lang="js" linenos="false" hl_lines="" >}}
light.target.position.set( 5, 5, 5 );
scene.add( light.target ); // won't work without this!!
{{< /code >}}

{{% /aside %}}