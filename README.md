# Welcome to Discover three.js!

This is the public repo for the book [Discover three.js](https://discoverthreejs.com/).

Pull requests are welcome, especially for:

* Keeping the book up to date with new three.js releases.
* Errata in the text or code examples.
* Any other bugs, browsers, or CSS issues.

For larger contributions, please get in touch with on lewy@discoverthreejs.com before making changes.

## Developer Guide

To build and view the book.

Prerequisites: Node.js

1. Clone or download the repo
2. Run `npm install`
3. Run `npm start`
4. Go to `http://localhost:8080/` (with livereload) or `http://localhost:3000/` (without livereload)

### Important folders

* `markdown/content` - all the words in the book are contained here
* `src/apps` - JS source code
* `styles/apps/chapters` - SCSS styles for the book are here.
* `public/static/examples` - the code for the IDE examples are here. Each example is a `World` - for examples: `static/examples/worlds/first-steps/first-scene` contains the example for the chapter **First Scene**. See `public/static/examples/README.md` for more details.

All JS, SCSS, and markdown is watched for changes and rebuilt using the `npm start` command.

## Updating Three.js Version

The three.js folder in node_modules is copied to the `/public/static/examples/vendor/three` folder.

`./node_modules/three` (original) -> `/public/static/examples/vendor/three` (copied)

This is required since the IDE needs to load Three.js at runtime. To prevent three.js versions getting out of sync across the project, it's best to have one source of the file in node_modules/ and reference this everywhere. However, the IDE can only access files in public/static/.

Whenever you update the three.js version, remember to copy the file across to the examples folder!