---
title: "Gamma Space and Linear Space"
description: "TODO"
date: 2018-04-02
weight: 704
chapter: "7.4"
draft: true
---
{{% fullwidth %}}
# GAMMA SPACE AND LINEAR SPACE
{{% /fullwidth %}}

## Gamma Space

http://www.kinematicsoup.com/news/2016/6/15/gamma-and-linear-space-what-they-are-how-they-differ
The need for gamma arises for two main reasons: The first is that screens have a non-linear response to intensity. The other is that the human eye can tell the difference between darker shades better than lighter shades. This means that when images are compressed to save space, we want to have greater accuracy for dark intensities at the expense of lighter intensities. Both of these problems are resolved using gamma correction, which is to say the intensity of every pixel in an image is put through a power function. Specifically, gamma is the name given to the power applied to the image.

Color corrected

### sRGB

https://github.com/mrdoob/three.js/issues/5838#issuecomment-68454839
* material.map
* material.envMap (LDR)
* material.emissiveMap

## Linear Space

Not color corrected.

Properties in Linear space:

* material.color
* material.emissive
* material.specular
* vertex colors
* ambientLight.color
* light.color for directionalLight, pointLight, spotLight, hemisphereLight, areaLight
* alpha channels of color maps
* material.lightMap
* material.specularMap (for now, only as long as it is a grayscale)
* material.glossinessMap (future)
* material.alphaMap
* material.bumpMap
* material.normalMap
* material.aoMap
* material.metalnessMap
* material.roughnessMap
* material.displacementMap
* material.envMap (HDR, but need to be decoded)


### renderer.gammaInput = true
Tell the renderer that maps, envMaps and emmissive maps are gamma encoded

You can also set the encoding for individual maps using texture.encoding = THREE.XYZEncoding

Setting texture.encoding = THREE.LinearEncoding on maps, envMaps and emmissive maps and then setting gammaInput = true will still override them

## NOTE: gammaInput will (hopefully) soon be removed in favour of texture.encoding

## renderer.gammaOutput = true

Should be default!

## Note gammaInput will (hopefully) soon be removed in favour of renderer.outputEncoding #11337

## Summary

toneMapping ( to LDR )
colorSpace ( Linear, sRGB, AdobeRGB, Gamma20, Gamma22, Grayscale, CustomLookup )
encoding ( RGBA, RGBE, RGBM, RGBD, LogLUV, CMYK )

# Workflow:

1. ignore renderer.gammaInput
2. set texture.encoding = THREE.sRGBEncoding on :
    material.map
    material.emissiveMap
    material.specularMap
    material.envMap
  (GLTFLoader already does this for the first three)
  (for LDR maps: png, jpg etc)
3. set tonemapping options
4. set renderer.gammaOutput = true

# Workflow for postprocessing:

1. ignore renderer.gammaInput
2. set texture.encoding = THREE.sRGBEncoding on :
    material.map
    material.emissiveMap
    material.specularMap
    material.envMap
  (GLTFLoader already does this for the first three)
  (for LDR maps: png, jpg etc)
3. set tonemapping options
4. set renderer.gammaOutput = false (default)
5. how to gamma encode rendertarget?

https://maddieman.wordpress.com/2009/06/23/gamma-correction-and-linear-colour-space-simplified/