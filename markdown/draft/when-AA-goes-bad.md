### When _Not_ to Enable AA

In general, you will always enable AA since most scenes look better with this setting turned on. However, there are a couple of scenarios where you don't want to enable AA:

1. When using post-processing, in which case you cannot use this built-in AA solution and must use an AA post-processing pass or a multi-sample render target (we'll explain how this works later).
2. When you need to squeeze every drop of performance out of a scene and don't care too much about how it looks.
3. If your scene doesn't look better with AA (rare).
3. If your scene looks worse with AA (very rare).
4. When running on very high-resolution screens, where the pixels are so tiny that AA may be redundant.
5. When doing GPGPU (general-purpose GPU) programming. In other words, when you are using three.js for something other than creating pretty graphics. In that case, the rendered pixels contain data that is not intended to be drawn to the screen, and AA will mess up this data.