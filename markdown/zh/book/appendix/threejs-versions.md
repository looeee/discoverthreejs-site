---
title: "处理不同的 three.js 版本"
description: "three.js 的开发速度很快，而且它使用了一个稍微不寻常的版本控制系统。 以下是处理不同版本的一些技巧，并确保您不会因使用过时的版本或不匹配的插件而陷入困境。"
date: 2018-04-02
weight: 9906
chapter: "B.1"
available: true
nextURL: "/zh/tips-and-tricks/"
nextTitle: "Tips and Tricks"
---

# Dealing with Different three.js Versions

## Semver? No Way!

The development pace of three.js is _fast_, and it uses a slightly unusual versioning system. Most software gets released incrementally as **V0.5**, **V0.6**, **V1.0**, **V1.1.1**, etc. This is called **semantic versioning**, or [**semver**](https://semver.org/) for short.

three.js breaks that trend and uses a **revision system** instead. There's a new revision out once a month or so, with incremental names like **r45**, **r67**, **r98**, etc. You can see a list of [releases here](https://github.com/mrdoob/three.js/releases).

Shortly, we'll show you how to install three.js with the NPM package manager [NPM package manager]({{< relref "/book/introduction/get-threejs#package-manager" >}} "NPM package manager") we describe how to install three.js from NPM, a package repository for all things JavaScript. NPM required packages to use semver, so if you check out [the three.js NPM package](https://www.npmjs.com/package/three) you'll see **r88** has been converted to **V0.88.0**, **r108** has been converted to **V0.108.0** and so on.

## API Changes

The three.js API ([Application Programming Interface](https://en.wikipedia.org/wiki/Application_programming_interface)), which means the commands we type into our code to make three.js do things, may change in any revision. As a result, if you're following a tutorial or book written a couple of years ago when **r65** was the bee's knees, you may find the code described is out of date.

In practice, it's not that bad. The majority of the syntax has not changed in years. Also, the old syntax is kept as an alias for the new syntax, if possible. Whenever you use an outdated command, three.js will log a deprecation warning to the console telling you to stop using the old syntax, but everything will still work as normal.

For example, some time ago `AxisHelper` was renamed to `AxesHelper`. The old name still works, but when you use it you'll see this warning logged to the console:

{{< figure src="introduction/deprecation_warning.png" alt="A deprecation warning" class="" >}}

Here, `AxesHelper` is the new syntax and the old `AxisHelper` syntax has been kept as an alias.

As a result, if you're following an old tutorial with out of date info, most things will still work. Just make sure to keep an eye on the console warnings!

Note that, for technical reasons, it's not always possible to keep the old syntax as an alias. Whenever you find an old tutorial, book, or StackOverflow post, take careful note of the last time it was updated. The older it is, the more likely you'll run into problems when using the code.

## Always Use Examples and Plugins that Match Your three.js Version

While the syntax is relatively stable, behind the scenes the code may have changed a lot between releases. Make sure that any plugins you use from the [examples folder]({{< relref "/book/introduction/github-repo#the-examples-folder" >}} "examples folder") match the version of three.js you are using, otherwise, you might run into some nasty and hard to pin down bugs.

If in doubt, download the entire [latest release of three.js as a zip file](https://github.com/mrdoob/three.js/archive/master.zip), or get the three.js package from NPM.

## Third-Party Extensions

There are some [amazing plugins for three.js](https://github.com/vanruesc/postprocessing) available around the web, and you'll find even more [hosted on NPM](https://www.npmjs.com/package/three-pathfinding). However, just like old tutorials and books, the older they are, the more likely you are to run into trouble when using them.

If possible, always check [the GitHub repository for an extension](https://github.com/donmccurdy/three-pathfinding#readme) to see when it was last updated or whether the author is actively responding to bug reports. If it hasn't been updated in several years, and any issues raised remain unanswered, it's probably abandonware. You might have to do a lot of work to get it working, and if it's a simple plugin it might be better to re-create it from scratch.

## Upgrading from an Older Version

Updating an app that was written using an older version of three.js is usually a painless process. Whenever you need to update the old code, read the [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide) to see what changes you will need to make.

However, before you feel the need to chase the latest and greatest, remember that three.js is a very stable library. The latest versions may not add anything you need. It's often best practice to lock the version you are using with any given project, and only update when you absolutely need a new feature. If you need convincing of this, note that the [Autodesk Forge Viewer](https://forge.autodesk.com/showcase) is still using three.js r77, a version from 2016.
