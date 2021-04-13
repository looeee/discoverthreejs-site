import Droppable from 'droppable';

export default class Upload {
  constructor(app, fileParser) {
    const droppableMain = new Droppable({
      element: document.querySelector('#main-upload'),
    });

    droppableMain.onFilesDropped((files) => {
      fileParser.parse(files);
    });

    const droppableSecondary = new Droppable({
      element: document.querySelector('#secondary-upload'),
    });

    droppableSecondary.onFilesDropped((files) => {
      fileParser.parse(files);
    });
  }
}
