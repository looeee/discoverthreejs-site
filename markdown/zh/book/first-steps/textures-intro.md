---
title: "纹理映射简介"
description: "纹理用于存储场景中对象的表面细节，例如颜色、凹凸、小阴影等。 在这里，我们使用TextureLoader加载纹理并将其应用于我们的立方体网格。"
date: 2018-04-02
weight: 108
chapter: "1.8"
available: true
showIDE: true
IDEFiles:
  [
    "assets/textures/uv-test-col.png",
    "assets/textures/uv-test-bw.png",
    "worlds/first-steps/textures-intro/src/World/components/camera.js",
    "worlds/first-steps/textures-intro/src/World/components/cube.start.js",
    "worlds/first-steps/textures-intro/src/World/components/cube.final.js",
    "worlds/first-steps/textures-intro/src/World/components/lights.js",
    "worlds/first-steps/textures-intro/src/World/components/scene.js",
    "worlds/first-steps/textures-intro/src/World/systems/renderer.js",
    "worlds/first-steps/textures-intro/src/World/systems/Resizer.js",
    "worlds/first-steps/textures-intro/src/World/systems/Loop.js",
    "worlds/first-steps/textures-intro/src/World/World.js",
    "worlds/first-steps/textures-intro/src/main.js",
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/textures-intro/index.html",
  ]
IDEComparisonMode: true
IDEClosedFolders: ["systems", "styles", "vendor"]
IDEStripDirectory: "worlds/first-steps/textures-intro/"
IDEActiveDocument: "src/World/components/cube.js"
---

# 纹理映射简介

当我们创建一个网格时，比如我们不起眼的立方体，[我们传入两个组件]({{< relref "/book/first-steps/first-scene#our-first-visible-object-mesh" >}} "我们传入两个组件")：一个几何体和一个材质。

{{< code lang="js" linenos="false" hl_lines="" caption="网格需要两个子组件：几何体和材料" >}}

```js
const mesh = new Mesh(geometry, material);
```

{{< /code >}}

{{< inlineScene entry="first-steps/static-cube-no-texture.js" class="small left" >}}

几何体定义了网格的形状，材料定义了网格的各种表面属性，特别是它对光的反应方式。当我们渲染场景时，几何体和材质以及影响网格的任何光线和阴影都控制着网格的外观。目前，我们的场景包含一个网格，其形状由`BoxBufferGeometry`定义，表面由颜色参数设置为紫色的`MeshStandardMaterial`定义。这是由单个`DirectionalLight`照亮的，当我们渲染场景时，结果是这个简单的紫色框。

{{< figure src="/first-steps/concrete-cube.jpg" alt="" lightbox="true" class="noborder small right" alt="Courtesy of @christianfregnan from unsplash" caption="由混凝土制成的立方体。" >}}

将此与现实世界中的混凝土盒子进行比较 - 或木盒子、金属盒子或由几乎任何物质制成的盒子（除了光滑的塑料），我们可以立即看到我们的3D盒子根本不真实。现实世界中的物体通常有划痕、破损和脏污。但是，应用于我们盒子的材料看起来不是这样的。相反，它由在网格的整个表面上平滑应用的单一颜色组成。除非我们希望我们所有的创作看起来像全新的塑料，否则这是行不通的。

除了[颜色]({{< relref "/book/first-steps/physically-based-rendering#change-the-materials-color" >}} "颜色")之外，材质还有很多参数，我们可以通过这些参数来调整物体表面的各种属性，比如粗糙度、金属度、不透明度等。然而，就像[颜色参数]({{< relref "/book/first-steps/physically-based-rendering#change-the-materials-color" >}} "颜色参数")一样，这些参数被均匀地应用在网格的整个表面上。例如，如果我们增加材质的`.roughness`属性，物体的整个表面会变得更粗糙。如果我们设置`.color`为红色，则整个对象将变为红色。

{{< iframe src="https://threejs.org/examples/webgl_materials_normalmap.html" height="500" title="人脸的材质" class="small left" >}}

相比之下，大多数现实世界对象的表面属性会从一个点变化到另一个点。考虑一个表示人脸的网格。同样的，它也是由几何体和材质组成，就像我们的立方体网格一样。大尺度特征，如眼睛、鼻子、耳朵、脖子和下巴，由几何体定义。然而，创建逼真的面部不仅仅是精心制作的几何图形。仔细观察皮肤，我们可以看到有很多小疙瘩、皱纹和毛孔，更不用说眉毛、嘴唇和轻微的胡须了。在创建一个复杂的模型（如面部）时，美术师必须决定模型的哪些部分使用几何体来表示，以及哪些部分在材质级别才能表示，请记住，使用材质来表示事物通常比几何图形更便宜。当模型必须在高性能至关重要的移动设备上运行时，这是一个特别重要的考虑因素。例如，虽然可以对眉毛中的每一根毛发进行几何建模，但这样做会使该模型不适合在除最强大的设备之外的所有设备上实时使用。相反，我们必须在材质级别表示像毛发这样的小特征，并为眼睛、鼻子和耳朵等大尺度特征保留几何形状。

另请注意，此面部是由单个几何体构成。我们通常希望避免不必要地拆分几何体，因为每个网格只能有一个几何体，这样每个单独的几何体对应于我们场景中的一个新网格。场景中的对象更少通常会带来更好的性能，而且开发人员和3D艺术家也更容易使用。换句话说，我们不想被迫为耳朵和眼睛创建不同的几何形状。无论如何，这是不切实际的。仔细观察嘴唇，我们可以看到嘴唇的红色和下巴的肤色之间没有明显的区别。这意味着我们需要一些修改材料属性的方法，以便它们可以在对象的表面上平滑地变化。我们需要能够这样说：

- 构成嘴唇的几何体是红色的
- 构成下巴的几何体体是由轻微胡须覆盖的肤色
- 构成眉毛的几何体是头发颜色的

… 等等。这不仅适用于颜色。例如，皮肤比头发和嘴唇更亮。因此，我们还需要能够指定其他属性如粗糙度如何在几何体中从一个点渐变到下一个点。

{{< clear >}}

{{< figure src="first-steps/lee-perry-smith-color.jpg" caption="使用UV映射将此颜色纹理映射到面部几何体" alt="lee-perry-smith-color.jpg" lightbox="true" class="small right" >}}

这就是[**纹理映射**](https://en.wikipedia.org/wiki/Texture_mapping)的用武之地。用最简单的术语来说，纹理映射意味着拿着图像并将其拉伸到3D对象的表面上。我们将以这种方式使用的图像称为**纹理**，我们可以使用纹理来表示颜色、粗糙度和不透明度等材料属性。例如，要更改几何区域的颜色，我们更改位于顶部的纹理区域的颜色，就像您在上图中看到的附加到面部模型的颜色纹理一样。

虽然获取2D纹理并将其拉伸到像立方体这样的规则形状上很容易，但对于像脸这样的不规则几何形状则要做到这一点要困难得多，而且多年来，已经开发了许多纹理映射技术。也许最简单的技术是[投影映射](https://en.wikipedia.org/wiki/Projective_texture_mapping)，它将纹理投影到一个对象（或场景）上，就好像它已经通过电影放映机照射了一样。想象一下，将您的手放在电影放映机前，并看到投影到您皮肤上的图像。

{{< figure src="first-steps/uv-test-bw.jpg" caption="具有明确写入纹理的UV坐标的测试纹理。" lightbox="true" class="small left" >}}

虽然投影映射和其他技术仍然广泛用于创建阴影（或模拟投影仪）等事情，但这不适用于将面部的颜色纹理附加到面部几何体。相反，我们使用一种称为[**UV映射**](https://en.wikipedia.org/wiki/UV_mapping)的技术，它允许我们在几何体上的点和脸上的点之间创建连接。使用UV映射，我们将纹理划分为带有点的2D网格，分别是在左下角的$(0, 0)$和在右上角的点$(1,1)$。那么，点$(0.5,0.5)$将位于图像的正中心。同样，几何体中的每个点在[网格的3D局部空间中]({{< relref "/book/first-steps/transformations#local-space" >}} "网格的3D局部空间中")都有一个位置。因此，UV映射是将纹理中的2D点分配给几何体中的3D点的过程。例如，假设人脸模型中的嘴唇在点$(0,0,0)$。我们可以看到纹理中的嘴唇靠近中心，在某个地方$(0.5,0.5)$。因此，我们将创建一个映射：

$$ ( 0.5, 0.5 ) \longrightarrow ( 0,0,0 ) $$

现在，当我们将纹理指定为材质中的颜色贴图时，纹理的中心将映射到嘴唇上。接下来，我们必须对几何体中的许多其他点执行相同的操作，将耳朵、眼睛、眉毛、鼻子和下巴分配给纹理的适当点位置。如果这听起来像一个令人生畏的过程，请不要担心，因为手动执行此操作很少见。对于此模型，UV映射是在外部程序中创建的，一般来说，这是创建UV映射的推荐方法。

表示UV映射的数据存储在几何体上。像`BoxBufferGeometry`这样的three.js几何体已经设置了UV映射，并且在大多数情况下，当您加载在外部程序中创建的面部模型时，它也有已准备好的UV映射供使用。在本章后面，我们将更详细地探索盒子几何体的UV映射，并将黑白测试纹理分配给我们的盒子网格。

{{< iframe src="https://threejs.org/examples/webgl_geometry_cube.html" height="300" title="使用木质纹理的立方体" class="small right" >}}

一旦我们有了一个带有UV映射的几何体，我们就可以获取任何纹理并将其应用于几何体，它会立即起作用。然而，可能很难找到适合面部模型的其他纹理，因为必须仔细协调UV映射以将纹理与面部上的正确点匹配，而做好这件事是熟练的3D艺术家的工作. 然而，对于像立方体这样的简单形状，我们几乎可以使用任何图像作为纹理，将盒子变成木盒子、混凝土盒子或板条箱等等。

## 可以存储在纹理中的数据类型

{{% note %}}
TODO-LOW: add example images of textures in use here: see this link
https://conceptartempire.com/texture-maps/
{{% /note %}}

在本章中，我们将专注于使用纹理来表示颜色。我们将使用 _**uv-test-bw.png**_ 纹理，您可以在编辑器的 _**/assets/textures/**_ 文件夹中找到它，并将其拉伸到我们的立方体上。当我们这样做时，默认情况下，three.js将在立方体的每个面上拉伸一个纹理副本，总共六个副本。

在计算机图形学的早期，纹理仅用于存储对象的颜色。然而，如今，纹理可用于存储各种数据，例如颜色、凹凸度、不透明度、表面上的小阴影（称为**环境光遮蔽**）、光照、金属度和粗糙度等等。例如，不同的材料接受不同种类和组合的纹理，因此`MeshBasicMaterial`不接受所有与`MeshStandardMaterial`相同的纹理。我们将在本书后面更详细地介绍可以存储在纹理中的数据类型。

{{% note %}}
TODO-LINK: add link to materials/textures section
{{% /note %}}

## 纹理类型

_**uv-test-bw.png**_ 是一个以PNG格式存储的普通2D图像文件，我们将使用`TextureLoader`加载它，这将返回[`Texture`](https://threejs.org/docs/#api/en/textures/Texture)类的一个实例。您可以以相同的方式使用浏览器支持的任何图像格式，例如PNG、JPG、GIF、BMP。这是我们将遇到的最常见和最简单的纹理类型：存储在简单2D图像文件中的数据。

还有一些专用图像格式的加载器，如HDR、EXR和TGA，它们具有相应的加载器，如[`TGALoader`](https://threejs.org/docs/#examples/en/loaders/TGALoader)。同样，一旦加载，我们将获得一个`Texture`实例，我们可以以与加载的PNG或JPG图像大致相同的方式使用它。

除此之外，three.js还支持许多其他类型的非简单2D图像的纹理，例如[**视频纹理**](https://threejs.org/examples/?q=video#webgl_materials_video)、 [**3D纹理**](https://threejs.org/examples/#webgl2_volume_instancing)、[**画布纹理**](https://threejs.org/examples/#webgl_materials_texture_canvas)、[**压缩纹理**](https://threejs.org/examples/?q=texture#webgl_loader_texture_basis)、[**立方体纹理**](https://threejs.org/examples/?q=cubemap#webgl_materials_cubemap_dynamic)、[**矩形纹理**](https://threejs.org/examples/?q=equirectangular#webgl_panorama_equirectangular)等等。同样，我们将在本书后面更详细地探讨这些内容。在本章的其余部分，我们将关注以PNG或JPG格式存储的2D纹理。

{{% note %}}
TODO-LINK: change above links to relevant sections in the book
{{% /note %}}

## `Texture`类

类Texture是[HTML图像元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)的包装器，具有一些与用作纹理而不是普通图像相关的额外设置。我们可以在`image.texture`下访问原始图像。它是我们在处理纹理时最常用的类，尽管有几个派生类，例如[`VideoTexture`](https://threejs.org/docs/#api/en/textures/VideoTexture)或[`CubeTexture`](https://threejs.org/docs/#api/en/textures/CubeTexture)用于处理其他类型的纹理。但是，通常我们不会直接创建一个`Texture`，因为`TextureLoader`会自动为我们创建一个，我们将在下面看到它。

可以通过纹理类设置的示例是`.wrapS`和`.wrapT`，它们控制纹理到达边缘时如何包裹（例如，它是重复、简单地停止，还是我们将纹理的边缘拉伸到网格的边缘？ ）。我们还可以指定各种过滤（使用`.minFilter`和`.magFilter`）来控制在远处或近距离观察时如何过滤纹理。换句话说，这些设置控制用于放大或缩小图像的算法。

还有几个属性，如`.offset`,`center`和`.rotation`，它们允许我们控制纹理的位置。另外两个重要的设置，一个是`.flipY`，它表示沿是$Y$轴翻转（为了与某些外部程序中创建的模型兼容），另一个是`.encoding`属性，我们稍后将会看到，这些都必须正确设置才能获得最佳结果。

花几分钟浏览文档页面并查看使用纹理时可用的选项。我们将在本书后面更详细地探讨其中的大部分内容。

{{% note %}}
TODO-LINK: add link to textures section
{{% /note %}}

## 创建纹理

准备图像以用作纹理的方法有很多，但最简单的方法是拍摄对象的照片。例如，如果您拍摄砖墙的照片并将其分配给材质的颜色槽，您将在场景中看到与3D墙相当相似的效果。我们还可以通过使用原始图像为其他材料属性（如凹凸或粗糙度）创建额外的纹理来改进这一点。在[freepbr.com](https://freepbr.com/materials/worn-out-old-brick-wall-pbr-material/)上查看这组纹理以获取示例（选择与three.js一起使用的虚拟引擎版本，并注意 _albedo_ 是 _color_ 的另一个术语）。我们将在本书后面探索使用这样的一组纹理来创建逼真的材质。

{{% note %}}
TODO-LINK: add link to page using a texture set like this
{{% /note %}}

虽然拍摄平坦墙壁的照片是一件简单的事情，但像人脸、树木或兔子这样的曲面则更具挑战性。对于这样的表面，艺术家必须将照片展平，并将展平图像中的每个点连接到 3D模型上的对应点，再次使用UV映射。这通常在外部建模程序中完成，而不是在three.js中。

对于砖墙和木地板等常见表面，您可以在网络上找到高质量的纹理集（如上图），其中许多是免费的。在本书中，我们将使用[来自three.js存储库](https://github.com/mrdoob/three.js/tree/dev/examples/textures)和freepbr.com或[Quixel megascans](https://quixel.com/)等网站的纹理。

## 纹理术语

在我们继续加载纹理并将其应用到我们的立方体之前，让我们回顾一下我们在处理纹理时将使用的所有技术术语。

### 图像和纹理有什么区别？ {#texture-vs-image}

您会在计算机图形学文献中看到类似**纹理**和**图像**的术语很多次。这些甚至经常以相同的格式存储，例如PNG或JPG。它们有什么不同？

- **图像是设计用于人类观看的2D图片。**
- **纹理是专门为3D图形中的各种目的而准备的数据。**.

构成图像的单个像素代表颜色。另一种看待这一点的方式是，图像是一个二维颜色数组。在计算机图形学的早期，纹理也是如此，但随着时间的推移，纹理的用途越来越多，现在说纹理是二维数据数组更为正确。这些数据可以代表任何东西。如今，甚至可以将几何体或动画存储在纹理中。

当纹理以PNG或JPG等图像格式存储时，我们可以在任何图像查看器中打开它。在本章中，我们将加载的纹理表示颜色数据，因此如果我们在查看器中打开它，它看起来就像一张图像。然而，用于其他用途的纹理，例如凹凸贴图、不透明度贴图、光照贴图等，在应用到材质并由渲染器解释之前，通常看起来并不特别。

{{% note %}}
TODO-DIAGRAM: add diagram of color map and normal map side by side
{{% /note %}}

### 纹理贴图

尽管在技术上不正确，但纹理通常也称为**贴图**，甚至是**纹理贴图**，尽管**贴图**最常用于将纹理分配给材质。当使用纹理来表示颜色时，我们会说**我们正在将纹理分配给材质上的颜色贴图槽**。下面，我们将向您展示如何将 _uv-test-bw.png_ 纹理分配给`MeshStandardMaterial`的颜色贴吐槽.

### 像素和纹素

数字图像是一个二维像素阵列，每个像素都是一个包含单一颜色的小点。我们的屏幕也是由一个2D小点阵列组成，每个小点都显示一种颜色，我们也称这些像素为像素。但是，构成屏幕的像素是实际的物理对象，LED或OLED或其他一些高科技设备，而构成图像的像素只是存储在文件中的数字。

**为避免混淆，我们将继续称构成屏幕像素的点为像素 _pixels_，但将构成纹理的点称为纹素 _texels_。**.

### UV映射

UV映射是一种获取二维纹理并将其映射到三维几何体的方法。想象一下纹理顶部的2D坐标系，其中$(0,0)$在左下角和$(1,1)$在右上角。因为我们已经使用了字母$X$、$Y$和$Z$作为我们的3D坐标系，我们将使用字母$U$和$V$来指代2D纹理坐标系. 这就是**UV映射**名称的由来。

这是UV映射中使用的公式：

$$ ( u, v ) \longrightarrow ( x, y, z ) $$

$( u, v )$表示纹理上的一个点，而$( x, y, z )$表示几何上的一个点，[在局部空间中定义]({{< relref "/book/first-steps/transformations#coordinate-systems-world-space-and-local-space" >}} "在局部空间中定义")。从技术上讲，几何体上的一个点称为顶点**vertex**。

{{< figure src="first-steps/geometry_uv_map.svg" caption="UV映射将纹理映射到`BoxBufferGeometry`" lightbox="true" >}}

上图中，纹理的左上角已经映射到立方体角上的一个顶点坐标$(-1,1,1)$：

$$ ( 0, 1 ) \longrightarrow ( -1 , 1, 1 ) $$

对立方体的其他五个面进行了类似的映射，从而在立方体的六个面上分别生成一个完整的纹理副本：

{{< inlineScene entry="first-steps/texture-map.js" >}}

请注意，点$(0.5,0.5)$没有映射，纹理的中心。只有纹理的角落被映射到立方体的八个角上，其余的点是从中“猜测”出来的。相比之下，像面部这样的复杂模型必须定义更多的UV坐标，才能将代表鼻子、耳朵、眼睛、嘴唇等的纹理部分映射到几何体的正确点。

一旦我们更深入地研究了几何体的工作原理，我们将在本书的后面部分回到UV映射。幸运的是，我们很少需要手动设置UV映射，因为包括`BoxBufferGeometry`在内的所有three.js几何体都内置了UV映射。我们只需要加载纹理并将其应用到我们的材质上，一切都会奏效。

{{% note %}}
TODO-LINK: Add link to geometry section
{{% /note %}}

在本章的其余部分，我们将向您展示如何做到这一点。

> **重要提示**: 从这里开始，如果你在本地开发，[你需要设置一个网络服务器](https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally)，否则，由于浏览器的安全限制，你将无法加载纹理。

对于所有使用内联代码编辑器的人来说，一切照旧。让我们继续。

## `Texture`类

类`Texture`是[HTML图像元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)的包装器，具有一些与用作纹理而不是普通图像相关的额外设置。

## 加载纹理

现在我们已经了解了所有理论，加载纹理并将其应用到我们的立方体很简单。我们在本章中添加的所有代码都将放在 _**cube.js**_ 模块中。我们将使用three.js的[`TextureLoader`](https://threejs.org/docs/#api/en/loaders/TextureLoader)类来加载纹理，因此添加`TextureLoader`到 _**cube.js**_ 顶部的导入列表中：

{{< code from="1" to="7" file="worlds/first-steps/textures-intro/src/World/components/cube.final.js" lang="js" linenos="true" hl_lines="6" caption="_**cube.js**_: 导入`TextureLoader`" >}}{{< /code >}}

### 将材质设置移动到单独的函数中

为了防止`createCube`函数变得太大，让我们将材质创建移到一个新函数中：

{{< code lang="js" linenos="true" linenostart="7" hl_lines="7-12 17" caption="_**cube.js**_: 将材质设置移动到一个新函数中" >}}
function createMaterial() {
// create a "standard" material
const material = new MeshStandardMaterial({ color: 'purple' });

return material;
}

function createCube() {
const geometry = new BoxBufferGeometry(2, 2, 2);

const material = createMaterial();

const cube = new Mesh(geometry, material);

...
}
{{< /code >}}

### 创建一个`TextureLoader`实例

接下来，在新函数`createMaterial`的顶部创建一个新`TextureLoader`实例：

{{< code lang="js" linenos="true" linenostart="7" hl_lines="8 9" caption="_**cube.js**_: Create a texture loader instance" >}}
function createMaterial() {
// create a texture loader.
const textureLoader = new TextureLoader();

// create a "standard" material using
const material = new MeshStandardMaterial({ color: 'purple' });

return material;
}
{{< /code >}}

### 使用`TextureLoader.load`加载纹理

[`TextureLoader.load`](https://threejs.org/docs/#api/en/loaders/TextureLoader.load)方法可以加载任何标准图像格式的纹理，例如PNG、JPEG、GIF、BMP等。在这里，我们将从 _**assets/textures**_ 文件夹中加载 **_uv-test-bw.png_** 文件：

{{< code lang="js" linenos="true" linenostart="7" hl_lines="11-14" caption="_**cube.js**_: 加载纹理" >}}
function createMaterial() {
// create a texture loader.
const textureLoader = new TextureLoader();

// load a texture
const texture = textureLoader.load(
'/assets/textures/uv-test-bw.png',
);

// create a "standard" material using
const material = new MeshStandardMaterial({ color: 'purple' });

return material;
}
{{< /code >}}

当我们调用`.load`时，会发生一些有趣的事情。即使加载纹理需要一些时间（可能是几百毫秒），`TextureLoader`也会 _立即_ 返回[`Texture`](https://threejs.org/docs/#api/en/textures/Texture)类的 _空_ 实例 Texture。上面，我们将其存储在一个名为`texture`的变量中。

我们可以立即使用这个空的`texture`，甚至在图像完成加载之前。但是，在图像数据完全加载之前，纹理将显示为黑色。换句话说，如果我们将此纹理分配给材质的颜色贴图槽，则材质将在您的场景中显示为黑色，直到纹理完成加载。

加载完成后，`TextureLoader`将自动插入正确的图像，材料将从黑色变为图像中的任何颜色。当互联网连接速度较慢时，此过程尤其明显。如果您使用内联编辑器更新场景，您可能会看到这种情况发生，尽管图像数据应该在几分之一秒内加载。您可能希望避免在场景中显示黑色网格，在这种情况下，您可以等到所有纹理都加载完毕后再渲染场景。我们将在本书后面部分探讨您在此处想要避免的问题。

## 将纹理分配给材质的颜色贴图插槽

之前，我们使用[`.color`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.color)属性设置材质的颜色。在这里，我们将`texture`分配给[`material.map`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.map)属性，该属性描述颜色在对象表面上的变化方式。`.map`应该命名为`.colorMap`，但是因为它经常使用，为了方便起见，它被缩短了。

**通常，我们要么设置一个`.color`，或者要么设置一个`.map`，但不能同时设置**。如果我们确实同时设置了，纹理中的颜色则将乘以`.color`属性。例如，如果我们保持紫色，这个黑白纹理将获得紫色色调。这里的一个常见用例是将颜色设置为灰色阴影以使纹理变暗。由于白色是默认颜色，设置`.color`为白色不会影响纹理。因此，无法使用`.color`来使纹理变亮，您只能将其变暗。

像颜色参数一样，我们可以将纹理传递给材质的构造函数：

{{< code lang="js" linenos="false" caption="在构造函数中将纹理分配给材质" >}}
const material = new MeshStandardMaterial({
map: texture,
});
{{< /code >}}

或者，我们可以在创建材质后设置`.map`：

{{< code lang="js" linenos="false" caption="创建材质后分配纹理" >}}
const material = new MeshStandardMaterial();

material.map = texture;
{{< /code >}}

我们将在这里使用第一种方法。再次更新`createMaterial`：

{{< code from="9" to="25" file="worlds/first-steps/textures-intro/src/World/components/cube.final.js" lang="js" linenos="true"
hl_lines="18-22" caption="_**cube.js**_: 将纹理分配给材质的颜色贴图槽" >}}{{< /code >}}

现在，您的场景将更新，您应该会看到纹理映射到立方体的六个面上。

{{< inlineScene entry="first-steps/texture-map-duplicate.js" >}}

有六个纹理副本，每个用于立方体的每个面。特别注意拐角处发生的事情。

在上述场景中，您可以使用鼠标或触摸来旋转立方体。实际上，移动的是相机，而不是立方体，因为我们在这个场景中添加了一个相机控制插件。这个插件允许您平移、旋转和缩放/推拉相机以从任何角度查看场景，这在我们设置场景并想要近距离观察一切时非常有用。在下一章中，我们将把这个插件添加到我们的应用程序中。

## 挑战

{{% aside success %}}

### 简答

1. 更改材质的颜色。尝试紫色、红色、绿色、蓝色或您喜欢的任何其他颜色。注意每种颜色如何与黑白纹理相结合。

2. **_/assets/textures_**文件夹中包含了第二个纹理文件，称为 **_uv-test-col.png_**。你能加载这个文件并将它应用到材质的`.map`槽中吗？

3. 尝试将立方体切换为其他形状。[在文档中搜索](https://threejs.org/docs/)“BufferGeometry”以查看所有可用的几何体。注意纹理是如何映射到不同形状上的。

4. [打开`MeshStandardMaterial`文档页面](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)。该材质共有11个纹理贴图插槽，每个插槽的名称中都包含 _map_。你能找到所有的吗？

{{% /aside %}}

{{% aside %}}

### 中等

1. 尝试将我们加载的纹理分配给材质上的其他贴图槽。它们可能并非都有效，但您会得到一些有趣的结果。

2. 对 **_uv-test-col.png_** 做同样的事情。然后，一次加载两个纹理并将它们同时分配到不同的插槽。

3. [打开`Texture`文档](https://threejs.org/docs/#api/en/textures/Texture)。通读可以在纹理上设置的各种属性。尝试调整`.offset`、`.repeat`、`.rotation`和`.center`属性。这些（除了`.rotation`）中的每一个都是一个`Vector2`，因此您可以使用`.set(x,y)`它们来调整它们。

_注意 A：如果您为`.alphaMap`分配纹理，您还必须设置`material.transparent = true`。_

_注意 B：编辑器中提供的两种纹理可以分配到任何地图槽，但环境贴图需要特殊类型的纹理。他们在给定的插槽中是否看起来不错是另一回事！_

{{% /aside %}}

{{% aside warning %}}

### 困难

1. 材质中的每个纹理槽都与一个或多个属性（如`.color`和`.map`）相关联。贴图要么是一个[调制属性](#types-of-texture)（同样，像`.color`和`.map`），或者它本身被一些其他属性调制（像`.bumpMapand`和`.bumpScale`）。当您测试不同插槽中的纹理时，请尝试调整这些调制属性。其中一些是颜色（如`.color`和`emissive`），另一些是矢量（如`.normalScale`），但大多数是简单数字（如`.bumpScale`和`.displacementScale`）。在每种情况下，文档都清楚地说明了这一点。

2. 我们在上面提到，`Texture`类是HTML图像的包装器。如果您将`texture`打印到控制台，您应该能够找到该图像。您可以在控制台中找到`uv-test-bw.png`的URL并在新浏览器选项卡中打开它吗？

{{% /aside %}}
