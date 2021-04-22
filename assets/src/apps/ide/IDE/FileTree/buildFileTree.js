import { EzTree } from './vendor/custom/es6tree.js';

import { buildDirectories } from './utils/buildDirectories.js';

const config = {
  icons: {
    folderOpen: {
      icon: 'folderOpen',
      classes: 'open-icon',
    },
    folderClosed: {
      icon: 'folderClosed',
      classes: 'closed-icon',
    },
    html: {
      icon: 'html',
    },
    css: {
      icon: 'css',
    },
    js: {
      icon: 'js',
    },
    jpg: {
      icon: 'image',
    },
    png: {
      icon: 'image',
    },
    glb: {
      icon: 'cube',
    },
  },
};

function buildFileTree(files, fileTypes, closedFolders) {
  const directories = buildDirectories(
    files,
    fileTypes,
    closedFolders,
  );

  return new EzTree('filetree', config, [directories]);
}

export { buildFileTree };
