class HTMLBuilder {
  static buildEditor() {
    const container = document.querySelector('#editor');

    const textArea = document.createElement('textarea');
    textArea.name = 'editor-textarea';
    textArea.classList.add('editor-textarea');

    container.appendChild(textArea);

    return textArea;
  }

  static buildPreviewFrame() {
    const container = document.querySelector('#preview');

    const frame = document.createElement('iframe');
    frame.title = 'Preview Window';
    frame.name = 'preview-frame';
    frame.classList.add('preview-frame');

    container.appendChild(frame);

    return frame;
  }
}

export { HTMLBuilder };
