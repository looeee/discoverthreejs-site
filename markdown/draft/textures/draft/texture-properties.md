Many material properties have a corresponding texture that describes how that property changes over the surface of an object. For example, the `.color` property corresponds to the `.map` texture (short for **color map**). Here are some other properties of the `MeshStandardMaterial` and their corresponding textures:

Description | Property | Texture
---------|---------|----------
Surface color of the object | [.color](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.color) | [.map](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.map)
How rough/smooth the surface is | [.roughness](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.roughness) | [.roughnessMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.roughnessMap)
How metallic/plastic the surface is | [.metalness](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.metalness) | [.metalnessMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.metalnessMap)
How see-through the object is | [.opacity](https://threejs.org/docs/#api/en/materials/Material.opacity) | [.alphaMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.alphaMap)
Glow color of the object | [.emissive color](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.emissive) | [.emissiveMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.emissiveMap)

**Other map types describe a completely new property, such as bumps, displacement, and ambient occlusion**. These map types have one or more corresponding properties to modulate their strength. Examples of these are:

Description | Texture | Modulating Property
---------|---------|----------
Ambient occlusion: small shadows on the surface | [.aoMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMap) | [.aoMapIntensity](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.aoMapIntensity)
How bumpy the surface is | [.bumpMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.bumpMap) | [.bumpScale](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.bumpScale)
Another way of adding bumpiness, this one actually deforms the geometry | [.displacementMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementMap) | [.displacementScale](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementScale) and [.displacementBias](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.displacementBias)
Environment map, stores information about the surrounding environment | [.envMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.envMap) | [.envMapIntensity](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.envMapIntensity)
Lighting stored as a texture | [.lightMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMap) | [.lightMapIntensity](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.lightMapIntensity)
A newer version of the bump map | [.normalMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.normalMap) | [.normalScale](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.normalScale)