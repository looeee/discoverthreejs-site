---
title: "Physically Based Rendering with MeshStandardMaterial and MeshPhysicalMaterial"
description: "TODO"
date: 2018-04-02
weight: 803
chapter: "8.3"
---


# Physically Based Rendering with `MeshStandardMaterial` and `MeshPhysicalMaterial`

# [Standard](https://threejs.org/docs/#api/materials/MeshStandardMaterial) AND [Physical](https://threejs.org/docs/#api/materials/MeshPhysicalMaterial) MATERIALS



Non-Metals

Non-metal has monochrome/gray specular color. Never use colored specular for anything except certain metals unless certain of what you are doing
[Specular] The sRGB color range for most non-metal materials is usually between 40 and 60. It should never be higher than 80/80/80.
A good clean diffuse map is required.


Metals

The specular color for metal should always be above sRGB 180.
Metal can have colored specular highlights (for gold and copper for example).
Metal has a black or very dark diffuse color.