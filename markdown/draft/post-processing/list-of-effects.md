---
title: "A Big List of all the Post Effects (currently) Available in three.js"
description: "TODO"
date: 2018-04-02
weight: 1503
chapter: "15.3"
---

# A Big List of all the Post Effects (currently) Available in three.js


## The EffectComposer
EffectComposer

Post-processing comes in three flavours in three.js

## Render Passes

* RenderPass
* SSAARenderPass
  * https://threejs.org/examples/#webgl_postprocessing_ssaa
  * https://threejs.org/examples/#webgl_postprocessing_ssaa_unbiased
* TAARenderPass
  * https://threejs.org/examples/#webgl_postprocessing_taa

## Effect Passes

### Special Passes

* BasicShader (requires ShaderPass) - simple example shader that does nothing. You can use this as a starting point for writing your own shaders
* MaskPass and ClearMaskPass: These allow you to use a mesh or meshes as a "Mask" - that is, you can only see objects that are in front of the geometry (or behind if we set `.inverse = true`)
  * http://jsfiddle.net/q73ok880/
  * https://threejs.org/examples/#webgl_postprocessing_masking

* SavePass - copies the current state of the EffectComposer's render target into another render target. You can use this to create a branch in the effect composer - using this pass you could split your current scene + any applied effects, into two textures, rtA and rtB. Then you could apply different effects to each of them and finally combine them back together using a BlendPass.
* ShaderPass - this can be used with (almost) any of the files from the _**examples/jsm/shaders**_  directory that don't have a corresponding Pass.js file, to create a Pass. So you need to use this with the FXAAShader.js like so: `const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader )`, while the SMAAShader.js files has a corresponding SMAAPass.js file, so we use it like this: `const smaaPass = new THREE.SMAAPass( width, height );`
* CopyShader - this needed by basically single other pass. It creates full screen quad (rectangle that takes up the whole screen) and draws the current render target onto it, ready to be output on the screen.

### Ambient Occlusion (AO) Passes

* SAOPass, SAOShader and DepthLimitedBlurShader, UnpackDepthRGBAShader
* SSAOPass and SSAOShader

### Anti-Aliasing (AA) Passes

* FXAAShader
* SMAAPass and SMAAShader
  * https://threejs.org/examples/#webgl_postprocessing_smaa

### Background Passes

These passes change the scene's background

* ClearPass: set a clearColor and clearAlpha and make the scene's background that color.
* TexturePass: apply a texture to the scene's background
* CubeTexturePass
  * https://threejs.org/examples/?q=post#webgl_postprocessing_backgrounds

### Bloom and Bokeh Passes

* BloomPass and ConvolutionShader
  * create example
* UnrealBloomPass and LuminosityHighPassShader
  * https://threejs.org/examples/webgl_postprocessing_unreal_bloom
* BokehPass and BokehShader OR BokehShader2 (include either file)
  * create example

### Tone mapping

* AdaptiveToneMappingPass, ToneMapShader, LuminosityShader
  * https://threejs.org/examples/#webgl_shaders_tonemapping

### Fullscreen effects

* AfterimagePass and AfterimageShader
* DotScreenPass
* FilmPass and film shader - film grain effect
* GlitchPass and DigitalGlitch
  * https://threejs.org/examples/#webgl_postprocessing_glitch
* HalftonePass and HalftoneShader
  * https://threejs.org/examples/#webgl_postprocessing_rgb_halftone
* KaleidoShader ( requires ShaderPass )
* OutlinePass
  * https://threejs.org/examples/#webgl_postprocessing_outline
* PixelShader full screen pixelated effect
  * https://threejs.org/examples/#webgl_postprocessing_pixel
* MirrorShader
  * Create example


### Image Adjustment

Shaders here apply a simple iamge adjustment, similar to what you can do in apps like Photoshop or Gimp (or even
Instagram or Google Photos for a few the simpler ones)


* ColorCorrectionShader
* ColorifyShader - blend the result with a color
  * Create example
* GammaCorrectionShader - convert color space Linear to Gamma
* BleachBypassShader
  * https://en.wikipedia.org/wiki/Bloom_(shader_effect)
* SobelOperatorShader: Sobel edge detection
  * https://en.wikipedia.org/wiki/Sobel_operator
  * https://threejs.org/examples/#webgl_postprocessing_sobel
* VignetteShader
  * https://en.wikipedia.org/wiki/Vignetting
* RGBShiftShader - sperates Red, Green and Blue value to give an effect similar to Chromatic Aberation
  * create example
  * Ported from http://kriss.cx/tom/2009/05/rgb-shift/

* HorizontalBlurShader and VerticalBlurShader - horizontal or vertical Gausian Blur

* HorizontalTiltShiftShader and VerticalTiltShiftShader
  * https://en.wikipedia.org/wiki/Tilt%E2%80%93shift_photography


#### Based on glfx.js

* BrightnessContrastShader
* DotScreenShader - old dot matrix printer effect
* HueSaturationShader
* SepiaShader - old faded photo effect
* TriangleBlurShader
  *  Based on http://evanw.github.io/glfx.js/demo/

### Texure Adjustment

* BlendShader
  * Create example

### Misc

* FresnelShader - creates a Fresnel material
  * https://threejs.org/examples/#webgl_materials_shaders_fresnel
* OceanShaders - used with Ocean.js to create a water material with waves
  * http://threejs.org/examples/#webgl_shaders_ocean
  * https://threejs.org/examples/#webgl_shaders_ocean2

* WaterRefractionShader - used with Refractor.js to create a refracting object
  * https://threejs.org/examples/#webgl_refraction

* VolumeShader (for use with ShaderMaterial) - shader for volume rendering
  * https://threejs.org/examples/#webgl_loader_nrrd

* NormalMapShader - compute normals from a height map
  * https://threejs.org/examples/#webgl_terrain_dynamic

## Shaders


* DOFMipMapShader - Deth of Field ( DOF ) effect using Mipmaps
  * test and create example

* FocusShader
  * TODO test and create examle

* FreiChenShader

* LuminosityShader - looks like this is used to calculate average luminance
  * https://en.wikipedia.org/wiki/Relative_luminance



* ParallaxShader - Parallax occlusion mapping
  * https://en.wikipedia.org/wiki/Parallax_occlusion_mapping
  * https://threejs.org/examples/#webgl_materials_parallaxmap


* TechnicolorShader

* UnpackDepthRGBAShader - get depth value from RGBA texture

### Special Shaders