function buildDirectories(files, fileTypes, closedFolders) {
  const paths = Object.keys(files).sort();

  const data = {
    id: 'root',
    name: 'Files',
    folder: '',
    type: 'folder',
    expanded: true,
    children: [],
    files: [],
    folders: [],
  };

  let currentID = 0;

  paths.forEach((path) => {
    path.split('/').reduce((dir, sub) => {
      let child = dir.children.find((el) => el.name === sub);

      if (child) {
        return child;
      }

      const expanded = !closedFolders.includes(sub);

      child = {
        id: `item_${currentID++}`,
        name: sub,
        expanded,
        children: [],
        files: [],
        folders: [],
      };

      const type = fileTypes.filter((ext) => sub.includes(ext))[0];

      if (type) {
        child.type = type.replace('.', '');
        let folder = path.split('/');
        folder.pop();
        child.folder = `${folder.join('/')}`;
        dir.files.push(child);
      } else {
        child.type = 'folder';
        child.folder = `${path.split(sub)[0]}${sub}`;
        dir.folders.push(child);
      }
      child.file = files[path];
      child.src = path;
      dir.children.push(child);

      return child;
    }, data);
  });

  return data;
}

export { buildDirectories };
