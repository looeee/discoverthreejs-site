TODO: this readme might be slightly out of date and needs to be double checked.

# How to create a new example

# Before and after comparison mode

if comparisonMode is enabled, specify any files you want to compare like this:

"src/main.start.js"
"src/main.final.js"

.start/.final will be stripped from the name, so in the IDE you will see src/main.js, however this file will have two states. Only enabled for .js files.

When comparison mode is enabled, all files have two states, however if .start and .final are not provided, both texts have the same text at load but can be edited/reset separately

# Options in Hugo front matter

"IDE": {
  "show": "true",
  "container": "#ide-wrapper",
  "serverDirectory": "static/examples",
  "stripDirectory": "worlds/first-steps/first-scene/",
  "closedFolders": ["styles", "vendor"],
  "files": [
    "styles/main.css",
    "vendor/three/build/three.module.js",
    "worlds/first-steps/first-scene/index.html"
    "worlds/first-steps/first-scene/src/main.start.js"
    "worlds/first-steps/first-scene/src/main.final.js"
  ],
  "comparisonMode": true,
  "entry": "index.html",
  "activeDocument": "src/main.js",
  "switchImportsAllow": "true"
},
