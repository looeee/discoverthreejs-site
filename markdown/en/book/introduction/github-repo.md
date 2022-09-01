---
title: "three.js on GitHub - Where the Magic Happens"
description: "three.js is build by a passionate group of open-source developers on the three.js GitHub repo. Everything officially related to the three.js project is kept here, and there's LOADS of free stuff too."
date: 2018-04-02
weight: 5
chapter: "0.4"
available: true
---

# three.js on GitHub - Where the Magic Happens {#github}

{{< figure src="app-logos/github.png" alt="GitHub logo" lightbox="false" class="small noborder" >}}

The entire three.js project is free open source software ([FOSS](https://en.wikipedia.org/wiki/Free_and_open-source_software)), and all development takes place in one huge repository [over on Github](https://github.com/mrdoob/three.js). It's maintained by the original creator, [@mrdoob](https://twitter.com/mrdoob) (AKA Ricardo Cabello), along with an army of open-source aficionados. It's a huge and active repo, up there with superstars like [React](https://github.com/facebook/react), [jQuery](https://github.com/jquery/jquery), and [Node.js](https://github.com/nodejs/node).

_Everything_ officially related to the three.js project is in the repo: the source code, [hundreds of examples](https://threejs.org/examples/) demonstrating how to use every part of the library, [the docs](https://threejs.org/docs/), an [interactive scene editor](https://threejs.org/editor/), and a huge number of plugins and free assets such as 3D models, textures, sounds, and 3D fonts. [Open up the repo](https://github.com/mrdoob/three.js) now, and we'll take a look. There's a lot to take in, but for now, only a couple of folders are relevant to us.

## {{< icon "solid/folder-open" >}} The _**build/**_ Folder {#build-folder}

The [_**build/**_ folder](https://github.com/mrdoob/three.js/tree/dev/build) is the most important folder on the repo since it contains the main three.js file (the _core_ of the library):

- _**build/three.module.js**_

**This is the only file you need to run a basic three.js app.**

_**.module**_ in the filename tells us that this is a [JavaScript module]({{< relref "/book/appendix/javascript-modules" >}} "JavaScript module"). In this folder, there are also two legacy versions of the three.js core that you can use if you want to support outdated browsers that can't use modules:

- _**build/three.js**_
- _**build/three.min.js**_

In this book, we'll always use _**three.module.js**_ since the legacy files are slated to be removed in an upcoming release.

## {{< icon "solid/folder-open" >}} The _**examples/**_ Folder {#examples-folder}

Of nearly equal importance, the [_**examples/**_](https://github.com/mrdoob/three.js/tree/dev/examples) folder contains lots of goodies, including:

- [Source code](https://github.com/mrdoob/three.js/tree/master/examples/) for all the [official examples](https://threejs.org/examples/), which you should study as one of your primary learning resources.
- Plugins in the [_**examples/jsm**_](https://github.com/mrdoob/three.js/tree/master/examples/jsm/) folder, such as camera controls and model loaders, which we use throughout the book. You should study the code here too, although it tends to be more advanced so you may want to wait until you've covered more ground first.
- Legacy plugins in the [_**examples/js**_](https://github.com/mrdoob/three.js/tree/master/examples/js/) folder. These are the same set of plugins you'll find in the _**examples/jsm**_, however, they will work with outdated browsers. Just like the legacy versions of the core, the legacy plugins will be removed soon and we'll ignore them in this book.
- [3D fonts](https://github.com/mrdoob/three.js/tree/master/examples/fonts/)
- [3D models](https://github.com/mrdoob/three.js/tree/master/examples/models/) in many different formats.
- [Sounds](https://github.com/mrdoob/three.js/tree/master/examples/sounds/).
- [Textures](https://github.com/mrdoob/three.js/tree/master/examples/textures/).
- ... and lots more.

Everything that you need to learn three.js is there - except for this book! What's more, nearly everything in this folder is covered by the [MIT license](https://github.com/mrdoob/three.js/blob/dev/LICENSE), which means you're free to use anything in your projects, in any way that you like.

## {{< icon "solid/folder-open" >}} The _**src/**_ Folder {#src-folder}

You'll find the three.js source code in the [_**src/**_](https://github.com/mrdoob/three.js/tree/dev/src/) folder. As you become more proficient with three.js you'll want to know how the actual three.js code is implemented. Every [docs](https://threejs.org/docs/) page has a direct link to the relevant file in the _**src/**_ folder at the bottom of the page, so you can quickly navigate to the relevant file while reading the documentation.

The three.js source code is simple, clean, and concise, making it highly accessible and far easier to understand than you would expect of a 3D graphics library.

## {{< icon "solid/folder-open" >}} Other Folders and Files {#other-folders}

There are many other folders and files besides the ones we mentioned here, including the source code for the [official docs](https://threejs.org/docs/) and the [three.js scene editor](https://threejs.org/editor/). Most of these are related to developing three.js, and we won't cover them further here, but feel free to explore.

## The Wiki

Also maintained as part of the repo is [the three.js wiki](https://github.com/mrdoob/three.js/wiki). The main purpose of the wiki is to provide a guide for people who want to contribute to the development of three.js. However, there is one other important page: [the migration guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide), which provides a quick list of any changes between three.js releases. Whenever you need to upgrade an old three.js app to a new version, this is the place to go.
