/*
Runs automatically to keep the three.js version in static/examples/version in sync with node_modules/three
*/

"use strict";

const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const originPath = path.resolve(__dirname, "../node_modules/three");
const targetPath = path.resolve(__dirname, "../static/examples/vendor/three");

// Check if a directory exists
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function getVersion(p) {
  return require(path.join(p, "./package.json")).version;
}

const vNodeFolder = getVersion(originPath);
const vExamplesFolder = getVersion(targetPath);

console.info(`Copying three.js V${vNodeFolder} to examples folder...`);

const isExist = fsExistsSync(targetPath);

if (isExist) {
  if (!(vNodeFolder === vExamplesFolder)) {
    fse.removeSync(targetPath);
    fse.copySync(originPath, targetPath);
  }
} else {
  fse.copySync(originPath, targetPath);
}
