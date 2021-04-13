---
title: "Physically Correct Lighting Revisited"
description: "TODO"
date: 2018-04-02
weight: 701
chapter: "7.1"
---


# Physically Correct Lighting Revisited



https://en.wikipedia.org/wiki/Color_temperature
https://en.wikipedia.org/wiki/File:Color_temperature_black_body_800-12200K.svg


# Notes

Theory for three.js setup comes from
https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf

Process:

1. renderer.physicallyCorrectLights = true
2. Use a real world scene size

Creating a Spot or Point light (and rectarea light?)
1. Distance = 0 (infinite)
2. decay = 2
3. intensity any value (overwritten by lght.power)
4. set light.power in lumens (e.g. from manufacturers packaging)
5. Select light color (hue) from yellow-blue gradient (again, can be found on packaging)
6. Note that this process (selecting hue and intensity from packaging) works for most light types, but not fluorescent lamps since the hue will not fall on this yellow-blue gradient

Setting up ambient light
1. Create a hemilight with sky color and ground color (how to select these?)
2. set realistic intemsity/irradiance based on https://en.wikipedia.org/wiki/Lux#Illuminance
3. intensity is measured in Lux (check this)

Directional light

1. ?

### benefits of physically correct lights

1. Lights use SI photometric units (Lumen, Lux, Candela)
1. Easy to set up realistic looking scenes
2. lighting rigs can be reused in multiple scenes
3. Works well with physical materials

{% aside %}
https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf page 23:

> Light units are related to light measurements, which are split into two categories:
> • Radiometric: Deals with “pure” physical quantities and used in the context of optical radiation
>measurement and spectral rendering15

>• Photometric: Concerned only with radiation falling within the visible spectrum.
>Quantities derived in radiometry and photometry are closely related: photometry is essentially radiometry weighted by the sensitivity of the human eye.

{% /aside %}

# Terminology:

luminance: the intensity of light emitted from a surface per unit area in a given direction.
That is, luminous intensity (candela) / m^2

f-stop: it's a logarithmic Exposure value (EV), each f-stop doubles brightness of the previous
Perceptually close to linear.

# Units/ terms in Radiometry -> equivalent units/terms in Photometry

Radiant Energy: Qe measure in Joules -> Luminous energy Qv measured in lumens times seconds (lm.s)

Power: Radiant flux/ Radiant power Φe measured in Watts = J/s -> Luminous flux/power Φv measured in Lumens (lm)

Power per solid angle: Radiant intensity Ie measured in watts per steradian (W/sr) -> Luminous intensity Iv meansured in lm/sr or Candela (cd)

Power per area: Radiant exitance Me or Irradiance Ee measured in W/m^2 -> Luminous exitance Mv or Illuminance Ev measured in lm/m^2 or Lux

Power per area per solid angle: Radiance Le measured in W/(m^2 . sr) -> Luminance Lv measured in lm/(m^2 . sr) or Nit (nt)

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
* [`DirectionalLight`](https://threejs.org/docs/#api/lights/DirectionalLight  - this light simulates light from a distant, bright source such as the sun.
* [`HemisphereLight`](https://threejs.org/docs/#api/lights/HemisphereLight  - this creates a two toned light that fades from a "sky" color to a "ground" color.
* [`PointLight`](https://threejs.org/docs/#api/lights/PointLight  - use this light when you want to simulate a small nearby light source such as a lightbulb or candle.
* [`RectAreaLight`](https://threejs.org/docs/#api/lights/RectAreaLight  - the most recent addition, you can use this light to simulate light from a window or fluorescent strip.
* [`SpotLight`](https://threejs.org/docs/#api/lights/SpotLight  - as the name suggests, this light can be used to simulate a (round) spotlight.

### Adding Omnidirectional Illumination with a Pointlight

Next we'll add a `PointLight`. This light also shines in every direction, but this time from a specific point in space. You can think if this one as being like a bare light bulb, that illuminates everything around it. In some applications, this is called an 'Omni' (for omnidirectional) light.


Try moving the light around a little to see the effect of the shiny areas of the box (the technical term for these `ihighlights`s [](https://en.wikipedia.org/wiki/Specular_highlight specular  ).

{{% aside warning %}}

#### Updating the DirectionalLight's Target

If you want to move the `DirectionalLight.target` from `( 0,0,0 )`, you'll have to add it to the scene:

{{< code lang="js" linenos="false" hl_lines="" >}}
light.target.position.set( 5, 5, 5 );
scene.add( light.target ); // won't work without this!!
{{< /code >}}

{{% /aside %}}