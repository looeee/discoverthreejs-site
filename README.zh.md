# 欢迎来到《探索 three.js》！

**语言: [English](README.md), 中文 (这个文件).**

这是[《探索 three.js》](https://discoverthreejs.com/)一书的公共仓库。

欢迎提PR，特别是对于：

- 通过更新 three.js 版本使本书保持最新。
- 文本或代码示例中的勘误表。
- 任何其他错误、浏览器或 CSS 问题。

如果您正在寻找灵感，请在 markdown 文件夹中搜索“TODO” ^\_^

对于比较大的贡献，请在进行更改之前联系 - 您可以在此 repo 上开一个讨论或问题。

## 开发者指南

这是构建和查看本书的过程。

先决条件：Node.js、[Hugo](https://github.com/gohugoio/hugo)

1. 克隆或下载 repo
2. 在[此处](https://github.com/gohugoio/hugo/releases)为您的系统下载 Hugo _扩展_ 二进制文件并将其放在项目根目录中。Hugo V0.92.0 ( _\*_ ) 已通过测试
3. 运行 `npm install`
4. 运行 `npm start`
5. 去`http://localhost:1313/`查看网站。您可能需要确保此端口在您的防火墙中打开。

_\*_ 在 linux 系统上，您可能需要使用 `chmod +x ./hugo` 设置`./hugo`文件为可执行文件.

## 技术细节

这本书是用 Hugo 构建的，这个 repo 遵循了一个相当典型的 Hugo 项目的文件夹结构，尽管 `content/` 文件夹已重命名为 `markdown/`。如果要进行更改，请参阅[Hugo 文档](https://gohugo.io/documentation/)。

### 重要文件夹

- `markdown` - 书中的所有文字都包含在这里。
- `assets/src` - JS源代码。
- `assets/scss` - 本书的 SCSS 样式在这里。
- `static` - 所有静态文件，如图形、字体、模型、纹理、图片和网站图标都在这里。
- `static/examples` -  IDE 示例的代码在这里。每个示例都是一个 `World` - 示例：`static/examples/worlds/first-steps/first-scene` 包含**第一个场景**一章的示例。有关更多详细信息，请参阅 `static/examples/README.md`。
- `/public` - Hugo 使用命令 `npm run production` 生成的文件将放在这里。默认情况下，在开发中，Hugo 将文件渲染到内存中，但是，如果您需要查看它们，生成文件会很有用。

## 注意

- [Hugo 管道](https://gohugo.io/hugo-pipes/)用于构建[SCSS](https://gohugo.io/hugo-pipes/scss-sass/)和[JS](https://gohugo.io/hugo-pipes/js/)资源。这意味着必须使用 Hugo 扩展版本。
- 运行 `npm start` 将需要几秒钟来捆绑所有文件，所以请耐心等待。但是，一旦服务器运行，更新应该只需要几毫秒。

## 许可

### 代码许可证

此 repo 中的所有代码（包括文本中的代码示例和 `/assets` 文件夹中的任何源代码）都包含在[MIT 许可证](https://opensource.org/licenses/MIT)中。您可以随意使用它，包括在商业应用程序中。这不包括任何包含的具有自己许可证的第三方库。

### 文字许可证

未经许可，不得在本 repo 和网站 discoverthreejs.com 之外转载本书中的文本。您可以自由派生 repo 以更改文本，但不允许将文本托管在其他站点（例如您自己的博客或教程站点）上。
