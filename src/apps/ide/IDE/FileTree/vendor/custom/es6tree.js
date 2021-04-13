// https://github.com/atlemagnussen/es6-tree#readme

import { createIcon } from '../../utils/createIcon.js';

// note: "node" refers to custom data object, "elem" refers to HTML element
class EzTree {
  constructor(parentId, config, data) {
    this.selectedId = null;
    this.parentId = parentId;
    this.parentEl = document.getElementById(parentId);
    if (!this.parentEl) {
      throw new Error(`Can't find element with id ${parentId}`);
    }
    this.parentEl.classList.add('es6-tree');
    this.config = config || {};
    this.data = data;
    this.handleInternalSelect();
    this.append(this.parentEl, this.data);
  }

  append(elem, data) {
    data.forEach((node) => {
      const details = document.createElement('details');
      if (node.expanded) {
        details.open = true;
      }
      elem.appendChild(details);
      const summary = document.createElement('summary');
      const span = document.createElement('span');
      if (node.id) {
        summary.dataset.id = node.id;
        span.dataset.id = node.id;
      }
      if (node.href) {
        const a = document.createElement('a');
        a.innerText = node.name;
        a.dataset.id = node.id;
        a.setAttribute('href', node.href);
        span.appendChild(a);
      } else {
        span.innerText = node.name;
      }
      span.classList.add('node-text');
      summary.appendChild(span);
      this.handleType(node, span);
      details.appendChild(summary);

      if (
        node.children &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        this.append(details, node.folders);
        this.append(details, node.files);
        details.classList.add('folder');
      } else {
        details.classList.add('file');
      }
    });
  }

  handleType(node, elem) {
    if (node.type === 'folder') elem.classList.add('folder');
    else elem.classList.add('file');

    if (node.type && this.config.classes) {
      if (this.config.classes[node.type]) {
        const classes = this.config.classes[node.type].split(' ');
        elem.classList.add(...classes);
      }
    }

    if (node.type && this.config.icons) {
      if (node.type === 'folder') {
        const openIcon = createIcon('folderOpen', 'open-icon');
        elem.parentNode.insertBefore(openIcon, elem);

        const closedIcon = createIcon('folderClosed', 'closed-icon');
        elem.parentNode.insertBefore(closedIcon, elem);
      } else if (this.config.icons[node.type]) {
        const icon = createIcon(this.config.icons[node.type].icon);
        elem.parentNode.insertBefore(icon, elem);
      }
    }
  }

  onSelect(callback, dontPreventDefault = false) {
    this.onSelectCallback = (cev) => {
      if (
        ['SPAN', 'A', 'SUMMARY'].includes(cev.target.nodeName) &&
        cev.target.dataset.id
      ) {
        const id = cev.target.dataset.id;
        const node = this.findNode(id);
        this.handleOpen(node);
        if (!dontPreventDefault) {
          cev.preventDefault();
        } else {
          cev.stopPropagation();
        }
        if (node && node.id) {
          callback(node);
        } else {
          callback({ id });
        }
      }
      if (cev.target.nodeName === 'DETAILS') {
        cev.preventDefault();
      }
    };

    this.parentEl.addEventListener('click', this.onSelectCallback);
  }

  dispose() {
    this.parentEl.removeEventListener('click', this.onSelectCallback);
    this.parentEl.removeEventListener(
      'click',
      this.onInternalSelectCallback,
    );

    this.parentEl.textContent = '';
  }

  select(id) {
    this.handleSelect(id);
    this.openContainingFolder(id);
  }

  getElemByDataID(id) {
    return [...document.querySelectorAll('[data-id]')].filter(
      (elem) => {
        return elem.dataset.id === id && elem.nodeName === 'SUMMARY';
      },
    )[0];
  }

  getContainingFolder(id) {
    let node = this.getElemByDataID(id);
    while (node.parentNode.nodeName === 'DETAILS') {
      node = node.parentNode;
    }

    return node;
  }

  openContainingFolder(id) {
    this.getContainingFolder(id).setAttribute('open', '');
  }

  handleOpen(node) {
    if (node.id && node.children && Array.isArray(node.children)) {
      this.toggleOpen(node.id);
    }
  }

  toggleOpen(id) {
    const details = this.getElemByDataID(id).parentElement;
    if (details) details.open = !details.open;
  }

  handleInternalSelect() {
    this.onInternalSelectCallback = (cev) => {
      if (
        ['SPAN', 'A', 'SUMMARY'].includes(cev.target.nodeName) &&
        cev.target.id
      ) {
        const id = cev.target.id;
        const node = this.findNode(id);
        if (node && node.id) {
          this.handleSelect(node.id);
        } else {
          this.handleSelect({
            id,
          });
        }
      }
    };
    this.parentEl.addEventListener(
      'click',
      this.onInternalSelectCallback,
    );
  }

  handleSelect(id) {
    if (!id) {
      return;
    }

    const node = this.findNode(id);
    if (node.children) {
      this.toggleOpen(id);
    }

    if (this.selectedId) {
      if (this.selectedId === id) {
        return;
      }
      const currentSelectedEl = this.parentEl.querySelector(
        `span#${this.selectedId}`,
      );
      if (currentSelectedEl) {
        this.unsetSelected(currentSelectedEl);
      }
    }
    this.selectedId = id;
    const selectedEl = this.parentEl.querySelector(`span#${id}`);
    this.setSelected(selectedEl);
  }

  setSelected(elem) {
    if (elem) {
      elem.parentElement.setAttribute('selected', 'true');
    }
  }

  unsetSelected(elem) {
    elem.parentElement.removeAttribute('selected');
  }

  findNode(id) {
    const itemPath = this.findPath(id, {
      children: this.data,
    });

    if (!itemPath) {
      return false;
    }
    if (!Array.isArray(itemPath) || itemPath.length === 0) {
      return false;
    }

    const last = itemPath.pop();
    return last;
  }

  selectNodeByPath(path) {
    // Note: this is a slight hack since the node.src and node.folder attributes
    // are a bit messed up. Should not be necessary to check the type
    let type = path.split('.').pop();
    if (type === undefined) {
      type = 'folder';
    }
    let result = null;

    function traverse(parent) {
      if (parent.src === path && parent.type === type) {
        result = parent.id;
        return;
      }

      if (
        parent.children &&
        Array.isArray(parent.children) &&
        parent.children.length > 0
      ) {
        for (let index = 0; index < parent.children.length; index++) {
          const child = parent.children[index];
          traverse(child);
        }
      }
    }

    traverse(this.data[0]);

    if (result) this.select(result);
  }

  findPath(id, root) {
    root = root || {
      children: this.data,
    };
    const found = [];

    if (
      root.children &&
      Array.isArray(root.children) &&
      root.children.length > 0
    ) {
      const children = root.children;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.id === id) {
          found.push(child);
          return found;
        }
      }
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const grandChild = this.findPath(id, child);

        if (
          grandChild &&
          Array.isArray(grandChild) &&
          grandChild.length > 0
        ) {
          found.push(child);
          found.push(...grandChild);
          return found;
        }
      }
    }
    return null;
  }
}

export { EzTree };
