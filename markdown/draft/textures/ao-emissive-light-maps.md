---
title: "Emissive, Light, and Ambient Occlusion Maps"
description: "TODO"
date: 2018-04-02
weight: 907
chapter: "9.7"
---

# Emissive, Light, and Ambient Occlusion Maps

An Ambient Occlusion (AO) map creates soft shadowing, as if the model was lit without a direct light source, like on a cloudy day. Similar map types: Cavity Map, Crevice Map, Curvature map, Dirt Map.

AO is usually baked from geometry because it is created using a non-realtime ray-casting lighting solution. It can either be stored in a texture, or it can be stored in the vertex colors of the model. Screen Space Ambient Occlusion is a realtime AO method that does not require baking at all, but it requires a more recent graphics card and has some shading errors.

Typically the AO map is blended into the metalness / specular / diffuse map, instead of being stored as a unique texture, because this saves memory. However, this generally creates incorrect lighting because an AO map should only mask ambient lighting, not specular lighting. If the AO is stored as a 2nd texture, it can be baked with a 2nd set of UVs that do not overlap or mirror.

