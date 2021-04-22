'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const originPath = path.resolve(__dirname, '../node_modules/three');
const targetPath = path.resolve(__dirname, '../static/examples/three');

// Check if a directory exists
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

// Check if the versions are the same
function isVersionEqual(path1, path2) {
  const v1 = require(path.join(path1, './package.json')).version;
  const v2 = require(path.join(path2, './package.json')).version;
  return v1 === v2;
}

const isExist = fsExistsSync(targetPath);

if (isExist) {
  if (!isVersionEqual(originPath, targetPath)) {
    fse.removeSync(targetPath);
    fse.copySync(originPath, targetPath);
  }
} else {
  fse.copySync(originPath, targetPath);
}
