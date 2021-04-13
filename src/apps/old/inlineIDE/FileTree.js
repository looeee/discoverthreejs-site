import EsTree from './vendor/es6tree.js';

export default class FileTree {
  constructor(ideElement, files, fileTypes) {
    this.buildHTML(ideElement);

    const config = {
      icons: {
        main: 'icon far fa-folder-open',
        folder: 'icon far fa-folder-open',
        html: 'icon fab fa-html5',
        css: 'icon fab fa-css3',
        js: 'icon fab fa-js-square',
      },
    };

    const data = this.buildDirectories(files, fileTypes);

    this.tree = new EsTree('filetree', config, [data]);
  }

  buildHTML(ideElement) {
    const container = document.createElement('div');
    container.classList.add('panel', 'filetree-panel');
    container.id = 'filetree';

    ideElement.appendChild(container);
  }

  buildDirectories(files, fileTypes) {
    const paths = Object.keys(files);

    const data = {
      id: 'master-node',
      name: 'Files',
      type: 'folder',
      expanded: true,
      children: [],
    };

    let currentID = 0;

    paths.forEach(path => {
      path.split('/').reduce((dir, sub) => {
        let children = dir.children.find(el => el.name === sub);

        if (children) {
          return children;
        }

        children = {
          id: 'item_' + currentID++,
          name: sub,
          children: [],
        };

        const type = fileTypes.filter(ext => sub.includes(ext))[0];
        if (type) {
          children.src = path;
          children.type = type.replace('.', '');
          children.file = files[path];
        } else children.type = 'folder';

        dir.children.push(children);
        return children;
      }, data);
    });

    return data;
  }

  setEventCallback(eventType, callback) {
    this.tree.on(eventType, callback);
  }
}
