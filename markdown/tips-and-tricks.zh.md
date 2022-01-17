---
title: "The Big List of three.js Tips and Tricks!"
date: 2018-01-01
description: "Lots of tips, tricks, and suggestions for best practices while building a high performance three.js application."
weight: 9999
chapter: "B.2"
available: true
excludeFromTOC: false
hideWordCount: true
type: "book"
nextURL: "/book/"
nextTitle: "Table of Contents"
prevURL: "/book/appendix/threejs-versions/"
prevTitle: "Dealing with Different three.js Versions"
---

# Threejs 技巧和窍门大清单！

大家好！ 在写这本书时候，我一直在收集大量的技巧、窍门、注意事项和陷阱。 此页内容涵盖了我目前找到的所有内容。

并不是所有这里说的技巧都经过了验证，尤其是性能方面的技巧。 盲目地遵循这一列表会存在太多不确定性，因此请务必彻底测试你的应用程序，看看哪些对你有用。 这些是建议，而不是规则（对于绝大部分而言）。 也就是说，此页内容对任何体量的应用程序都提供了许多有用的技巧。

如果你有任何想要添加的，又或是你发现了任何错误，[告诉我](/contact/) ，我会更新此页内容。

这里的大部分信息都不是只针对 three.js，甚至也不只针对 WebGL，而是适用于任何实时图形应用程序或框架。

编程愉快！

## 入门小白友情提示，或者说是帮助！

## 为什么我什么都看不到？{#basic}

你已经跟着学习了几个基本教程内容，一切都是那么美好。 现在你正创建一个自己的应用，并且你已经*完全*按照教程中的说明设置了所有内容。 但是你就是什么都看不到！ 什么鬼？？

下面的一些思路可以助你找出问题。

### 1.检查[浏览器控制台](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console)的错误信息{#error-message-check}

但你已经这样做了，对吧？

### 2. 将背景颜色设置为黑色以外的颜色{#background-color-check}

看着一块黑色画布（canvas），干瞪眼？ 如果你只能看得到黑色，是很难判断是否发生了些什么。 试着将背景颜色设置为红色：

{{< code lang="js" linenos="false" >}}

```js
import { Color } from "./vendor/three/build/three.module.js";

scene.background = new Color("red");
```

{{< /code >}}

如果你得到一块红色画布，那么至少你的 `renderer.render` 调用是起作用的，你可以继续查找看还有其他什么问题。

### 3. 确保场景中有添加了光照（light）并且它照亮了你的物体{#light-check}

如同现实世界中一样，three.js 中的大多数材质都需要有了光照才可见。

### 4. 用`MeshBasicMaterial`覆盖场景中的所有材质{#material-check}

[`MeshBasicMaterial`](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)是一种不需要光照参数就可见的材质。 如果你正好在显示物体上遇到问题，可以使用`MeshBasicMaterial`临时覆盖场景中所有的材质。 如果这么做，物体神奇地出现了，那么你的问题是缺少光照。

{{< code lang="js" linenos="false" >}}

```js
import { MeshBasicMaterial } from "./vendor/three/build/three.module.js";

scene.overrideMaterial = new MeshBasicMaterial({ color: "green" });
```

{{< /code >}}

### 5. 你的物体是否在相机的视锥体（viewing frustum）内？{#frustum-check}

如果您的物体不在视锥体（ [viewing frustum](/book/first-steps/first-scene/#viewing-frustum) ）内，它将被剪裁。 试着调大你的远剪裁平面参数值：

{{< code lang="js" linenos="false" >}}

```js
camera.far = 100000;
camera.updateProjectionMatrix();
```

{{< /code >}}

记住，这只是为了测试用！ 相机的视锥体以米为单位，为了获得最佳性能，你应该将其设置得尽可能小。 一旦场景设置好并正常运行后，应尽可能减小视锥体的大小。

### 6. 你的相机在物体里面吗？{#camera-check}

默认情况下，所有物体都在(0,0,0)点创建，也就是 **origin**。 确保你已将相机向后移动，以便你可以看到场景！

{{< code lang="js" linenos="false" >}}

```js
camera.position.z = 10;
```

{{< /code >}}

### 7. 仔细考虑场景内的缩放比例 （scale）{#scale-check}

试着可视化你的场景，并记住 three.js 中的一个单位对应是一米。 所有物体都是以合理的规则组合在一起的吗？ 或者你可能看不到任何物体，是因为你刚刚加载的物体只有 0.00001 米宽。 等等，屏幕中间的那个小黑点是什么？

## 通用技巧

1. JavaScript 中的对象的创建开销很大，所以不要在循环中创建对象。取而代之地，应创建一个单一的对象，例如 [Vector3](https://threejs.org/docs/#api/en/math/Vector3) 并使用[`vector.set()`](https://threejs.org/docs/#api/en/math/Vector3.set) 或类似的方法来重用循环内的对象。

2. 渲染循环也是如此。为了确保您的应用以每秒 60 帧的丝滑般渲染，尽可能减少渲染循环中的消耗。不要每帧都创建新的对象。

3. 总是使用 [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry) ，而不是 [`Geometry`](https://threejs.org/docs/#api/en/core/Geometry)，它更快（性能更好）。

4. 预先封装好的对象也是如此，始终使用缓冲几何版本（[`BoxBufferGeometry`](https://threejs.org/docs/#api/en/geometries/BoxBufferGeometry)而不是 [`BoxGeometry`](https://threejs.org/docs/#api/en/geometries/BoxGeometry)）。

5. 始终尝试重用对象，例如物体、材质、纹理等（尽管更新某些内容可能比创建新内容慢，请参阅下面说的纹理技巧）。

## 使用国际单位制（SI Units）

three.js 处处都使用的国际单位制。如果你也使用该单位制，你会发现事情变得更顺利。如果你出于某种原因确实使用了不同类型的单位，例如英寸（_颤抖_），请确保你有充分的理由去这样做。

### 国际单位制

SI 单位

- 距离以**米**为单位（three.js 的 1 单位 = 1 米）。
- 时间以秒为单位
- 光照以国际光照强度单位测量， [坎德拉](http://www.si-units-explained.info/luminosity/)(cd)、流明 (lm) 和勒克斯 (lx)（至少你需开启`renderer.physicallyCorrectLights`）。

如果你要创建史诗级规模场景（空间模拟或类似的东西），请使用缩放因子或切换到使用 [对数深度缓冲区-logarithmic depth buffer](http://threejs.org/examples/#webgl_camera_logarithmicdepthbuffer)。

## 准确的颜色

为了达到（进似乎）准确的颜色，这么设置渲染器：

{{< code lang="js" linenos="false" >}}

```js
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
```

{{< /code >}}

For colors do this:

对于颜色类，这么设置：

{{< code lang="js" linenos="false" >}}

```js
const color = new Color(0x800080);
color.convertSRGBToLinear();
```

{{< /code >}}

又或者，更常见的情况是，在材质中设置颜色：

{{< code lang="js" linenos="false" >}}

```js
const material = new MeshBasicMaterial({ color: 0x800080 });
material.color.convertSRGBToLinear();
```

{{< /code >}}

最后，为了得到（进似乎）正确的纹理颜色，**你只需要针对颜色，环境、自发光贴图设置纹理编码方式**：

{{< code lang="js" linenos="false" >}}

```js
import { sRGBEncoding } from "./vendor/three/build/three.module.js";

const colorMap = new TextureLoader().load("colorMap.jpg");
colorMap.encoding = sRGBEncoding;
```

{{< /code >}}

所有其他纹理类型应保持为颜色的线性空间（linear space）中。这是默认设置，因此你无需更改除颜色、环境和自发光贴图以外的任何纹理的编码。

需要注意的是，我在这里说是**几乎是正确的**，因为目前 Three.js 颜色管理还不太正确。希望它会很快得到修复，但与此同时，任何颜色的不准确都非常小，除非你是进行科学或医学方面的渲染，否则任何人都不太可能注意到这些。

## JavaScript

### 不要你以为你知道什么会更快

Web 浏览器使用的 JavaScript 引擎经常变动，并在后台对你的代码进行了大量优化。不要相信你对什么会更快的直觉，总是测试看看。不要听几年前的文章告诉你要避免某些方法，例如`array.map`或`array.forEach`。自己测试这些，或者查找过去几个月的文章，并辅以适当的测试。

### 使用样式指南和代码检测工具（linter）

就个人而言，我使用的组合 [Eslint](https://eslint.org/)， [Prettier](https://prettier.io/)，以及 [Airbnb 样式指南](https://github.com/airbnb/javascript)。[本教程](https://www.robinwieruch.de/how-to-use-prettier-vscode)（ [第 2 部分](https://www.robinwieruch.de/prettier-eslint)）花了我大约 30 分钟 在 VSCode 中进行设置，现在我再也不用浪费时间进行格式化、整理或去怀疑某一条特定的语法是否是妥当了。

许多使用 Three.js 的人更喜欢 [**Mr.doob's Code Style™ **](https://github.com/mrdoob/three.js/wiki/Mr.doob's-Code-Style™)而不是 Airbnb，所以如果你更喜欢使用它，只需将 [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)插件替换为 [eslint-config-mdcs](https://www.npmjs.com/package/eslint-config-mdcs)。

## 模型、网格和其他可见的事物

1. 避免使用常见的基于文本的 3D 数据格式（例如 Wavefront OBJ 或 COLLADA）进行数据交付。取而代之，请使用针对 Web 端 优化的格式，例如 glTF。

2. 使用 Draco 对 glTF 进行网格压缩。有时候这可以将 glTF 文件减小到其原始大小的 10% 以下！

3. 或者，该部分有一个新工具叫 [gltfpack](https://github.com/zeux/meshoptimizer#gltfpack) ，在某些情况下，它可能会有比 Draco 更好的效果。

4. 如果您需要操作大量物体可见和不可见（或从场景中添加/删除它们），请考虑使用[图层-Layers](https://threejs.org/docs/#api/en/core/Layers) 以获得最佳性能。

5. 处于完全相同位置的物体会导致闪烁（Z-fighting）。试着移动 0.001 之类的微小量，使物体看起来处于同一位置，同时 GPU 也满足渲染条件。

6. 保持场景以原点为中心，以减少大坐标处的浮点误差。

7. 永远不要移动你的场景`Scene`。 在(0,0,0)位置创建，这是其中所有物体的默认参考系。

## 相机

1. 使您的视锥体尽可能的小，以获得更好的性能。在开发过程中使用大的视锥体是可以的，但是一旦你微调应用以进行部署时，请让你的视锥体尽可能小，FPS 提升一小步，性能提升一大步。

2. 不要把物体放在远剪裁平面上（特别是如果你的远剪裁平面真的很大），因为这会引起闪烁。

## 渲染器

1. 不要启用[`preserveDrawingBuffer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)，除非你确实需要

2. 除非需要，否则禁用透明缓冲区（alpha buffer ）。

3. 除非需要，否则不要启用模板缓冲区（stencil buffer）。

4. 除非需要，否则禁用深度缓冲区（depth buffer）（但您可能确实需要它）。

5. 创建渲染器时使用`powerPreference: "high-performance"`。这可能会促使用户的系统在多 GPU 系统中选择高性能 GPU。

6. 仅当相机位置的发生变化或动画发生时才考虑渲染。

7. 如果你的场景是静态的并使用`OrbitControls`相机，你可以监听控件的`change` 事件。这样你就可以只在相机移动时渲染场景：

{{< code lang="js" linenos="false" >}}

```js
OrbitControls.addEventListener("change", () => renderer.render(scene, camera));
```

{{< /code >}}

遵循了最后两条，你也不会获得更高的帧率，但是你的风扇会更少开启，移动设备电池消耗更少。

注意：我在网络上看到一些地方建议你禁用抗锯齿并改用后处理抗锯齿（AA） 通道。在我的测试中，并非如此。在现代硬件上，内置的多重采样抗锯齿(MSAA)似乎也消耗很小，即使是在低功耗移动设备上也是如此。然而后处理的快速近似抗锯齿（FXAA） 或 增强型子像素形态学抗锯齿（SMAA） 通道，在我测试过的每个场景中都会导致相当大的帧率下降，而且质量也比 MSAA 更低 。

## 光照

1. 直射光（`SpotLight`、`PointLight`、`RectAreaLight`和`DirectionalLight`）很影响性能。在您的场景中尽可能少使用直射光。

2. 避免在场景中添加和删除光，因为这需要`WebGLRenderer`重新编译所有着色器程序（它确实缓存了程序，因此后续执行此操作的时间会比第一次更快）。取而代之的使用`light.visible = false`或`light.intensiy = 0`。

3. 打开`renderer.physicallyCorrectLights`，使用 国际单位制的正确光照。

## 阴影

1. 如果您的场景是静态的，则仅在事物发生变化时更新阴影贴图，而不是每一帧。

2. 使用 [`CameraHelper`](https://threejs.org/docs/#api/en/helpers/CameraHelper)可视化阴影相机的视锥体。
3. 使阴影视锥体尽可能小。
4. 使阴影纹理的分辨率尽可能低。
5. 请记住，点光源阴影比其他阴影类型更消耗性能，因为它们必须渲染六次（每个方向一次），而`DirectionalLight`和`SpotLight`阴影则需渲染一次。
6. 当我们谈论`PointLight`阴影时，请注意，当用于可视化点光源阴影时，`CameraHelper`只可视化了**六个阴影方向中的一个**。它仍然很有用，但你需要在其他五个方向上发挥你的想象力。

## 材质

1. `MeshLambertMaterial`不适用于闪亮拉丝的材质，但对于像布料这样的哑光材质，它会产生非常相似`MeshPhongMaterial`的结果，但性能更高。

2. 如果你使用的是顶点变形目标（morph targets），请确保您在材质中设置了[`morphTargets = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphTargets)，否则它们将不起作用！

3. 这同样适用于 [变形法线 morph normals](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphNormals)。

4. 如果你正在使用 [SkinnedMesh](https://threejs.org/docs/#api/en/objects/SkinnedMesh)来制作骨骼动画，确保 [`material.skinning = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.skinning).

5. 与变形目标、变形法线或蒙皮一起使用的材质无法共享。你需要为每个蒙皮或变形的网格创建单独的材质（ [`material.clone()`](https://threejs.org/docs/#api/en/materials/Material.clone)在这里非常适用）。

## 自定义材质

1. 仅在你的 uniform 变量发生变化时更新它，而不是每一帧。

## 几何

1. 避免使用[`LineLoop`](https://threejs.org/docs/#api/en/objects/LineLoop)，因为它必须由直线拟合而成。

## 纹理

1. 你所有的纹理都需要是 2 的幂次方 (POT) 大小

   1 、2 、4 、8 、16 ,…,512 ,2048 ,….

2. 不要更改纹理的尺寸。而是创建新的， [性能更高](https://webglinsights.github.io/tips.html)

3. 尽可能使用最小尺寸的纹理（您可以使用 256x256 的平铺纹理吗？您可能会感到惊讶！）。

4. 非 2 的幂次方 (NPOT) 纹理需要 linear 或 nearest filtering 滤镜参数设置，以及 clamp-to-border 或 clamp-to-edge 包裹方式（[详见 textures 常量](https://threejs.org/docs/index.html?q=textu#api/en/constants/Textures)）。不支持 Mipmap 过滤和重复包裹。但说真的，就不要使用 NPOT 纹理。

5. 具有相同尺寸的纹理在内存中的大小相同，因此 JPG 的文件可能比 PNG 小，但它会在您的 GPU 上占用相同数量的内存。

## 抗锯齿

1. 抗锯齿的最坏情况是几何体由许多相互平行排列的细直片组成。想想金属百叶窗或格子栅栏。如果可能的话，**不要在场景中包含这样的几何体。**如果别无选择，请考虑用纹理替换晶格，因为这可能会产生更好的结果。

## 后处理

1. 内置抗锯齿功能不适用于后期处理（至少在 WebGL 1 中）。您需要手动使用[FXAA](https://threejs.org/examples/#webgl_postprocessing_fxaa)或 [SMAA](https://threejs.org/examples/#webgl_postprocessing_smaa)（可能更快、更好）。

2. 当你没有使用内置抗锯齿（ AA），请务必禁用它！

3. three.js 有大量的后处理着色器，这太棒了！但请记住，每个通道都需要渲染整个场景。完成测试后，请考虑是否可以将你的通道合并为一个自定义通道。这样会需要多做一些工作，但可以显着提高性能。

## 物体的释放

从你的场景中删除一些东西？

首先，**考虑不这样做**，特别是如果你稍后还需要添加回来。你可以暂时隐藏对象，设置`object.visible = false`（也适用于光照）或`material.opacity = 0`。你可以设置`light.intensity = 0`禁用光照而不会导致着色器重新编译。

如果您确实需要从场景中*永久*移除物品，请先阅读这篇文章： [如何释放物体-How to dispose of objects](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)。

## 更新场景中的对象？

阅读这篇文章： [如何更新-How to update things](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)。

## 性能

1. 为静态或很少移动的物体设置`object.matrixAutoUpdate = false` ，并手动调用`object.updateMatrix()` 在其位置/旋转/四元数/缩放更新时。
2. **透明物体很消耗性能。**在场景中尽可能少使用透明物体。
3. 尽可能使用[`alphatest`](https://threejs.org/docs/#api/en/materials/Material.alphaTest) ， 而不是标准透明度，它会更快。
4. 在测试应用程序的性能时，你需要做的第一件事就是检查它是受 CPU 限制还是受 GPU 限制。使用基础材质（basic material ）替换所有材质`scene.overrideMaterial`（请参阅入门技巧和页面的开头）。如果性能提高，那么你的应用程序受 GPU 限制。如果性能没有提高，则你的应用程序受 CPU 限制。
5. 在性能好的机器上进行性能测试时，你可能最多获得 60FPS 的帧率。运行 chrome 以`open -a "Google Chrome" --args --disable-gpu-vsync`获得无限制的帧率。
6. 现代移动设备的像素比高达 5 - 考虑将这些设备上的最大像素比限制为 2 或 3。以场景的一些非常轻微的模糊为代价，你将获得可观的性能提升。
7. 烘焙光照和阴影贴图以减少场景中的光照数量。
8. 密切关注场景中的绘制方法的（drawcalls）调用次数。一个好的经验法则是更少的绘制调用 = 更好的性能。
9. 远处的物体不需要同靠近相机的物体具有相同的模型精度。有许多可以降低远处物体的精度的技巧来提高性能。考虑使用 [LOD](https://threejs.org/docs/#api/en/objects/LOD)（细节层次）物体。你也可以只为远处的物体每 2 或 3 帧更新位置/动画，或者用 billboard 替换它们 - 即物体的图片。

## 高阶技巧

1. 不要用`TriangleFanDrawMode`，很耗性能。

2. 当您有成百或上千个相似的几何图形时，请使用几何实例化。

3. 在 GPU 而非 CPU 上进行动画处理，尤其是在为顶点或粒子设置动画时（请参阅 [THREE.Bas](https://github.com/zadvorsky/three.bas)以了解执行此操作的一种方法）。

## 也阅读下这些文章！

Unity 和 Unreal 引擎的文档也有包含大量性能建议的文章，其中大部分也适用于 three.js 。也请阅读以下内容：

- [Optimizing graphics performance (Unity)](https://docs.unity3d.com/Manual/OptimizingGraphicsPerformance.html)
- [Performance Guidelines for Artists and Designers (Unreal)](https://docs.unrealengine.com/en-us/Engine/Performance/Guidelines)

WebGL Insights 整本书中收集了许多技巧。它更具技术性，但也值得一读，尤其是在你编写自己的着色器时。

- [WebGL Insights Tips](http://webglinsights.github.io/tips.html)

## 参考文献

- [@jackrugile and @mrdoob on Twitter](https://mobile.twitter.com/jackrugile/status/966440290885156864)
- [A-Painter performance optimizations](https://blog.mozvr.com/a-painter-performance-optimizations)
