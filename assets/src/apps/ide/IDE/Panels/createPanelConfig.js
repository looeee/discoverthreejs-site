// NOTE: must match CSS breakpoint for switching
// between flex column and row
const panelBreakpoint = 1024;

function createPanelConfig(direction, fullscreen) {
  let gutterSize = 5;
  if (window.innerWidth < 768) gutterSize = 10;

  const config = {
    elementStyle: (dimension, size, gutterSize) => {
      return {
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
      };
    },
    gutterStyle: (dimension, gutterSize) => {
      return {
        'flex-basis': `${gutterSize}px`,
      };
    },

    splits: {
      ide: {
        isTopPanel: fullscreen,
        direction: 'vertical',
        gutterSize,
        snapOffset: 50,
        selectors: ['#editor-panel', '#preview'],
        mainPanel: 0,
        size: [60, 40],
        minSize: [0, 0],
        toggle: '#toggle-preview',
      },
      editor: {
        direction: 'horizontal',
        gutterSize,
        snapOffset: 50,
        selectors: ['#filetree-panel', '#editor'],
        mainPanel: 1,
        size: [0, 100],
        minSize: [0, 0],
        toggleSize: [50, 50],
        toggle: '#toggle-filetree',
      },
      // TODO later: add console panel for preview
      // preview: {
      //   direction: 'vertical',
      //   gutterSize,
      //  snapOffset: 50,
      //   selectors: [
      //     '#preview',
      //     '#preview-console',
      //   ],
      //   mainPanel: 0,
      //   size: [ 100, 0 ],
      //   minSize: [ 0, 0 ],
      //   toggleSize: [ 70, 30 ],
      //   toggle: '#toggle-console',
      // },
    },
  };

  if (!fullscreen) {
    config.splits.main = {
      isTopPanel: true,
      direction,
      // panel will be closed below this width/height
      breakpoint: panelBreakpoint,
      gutterSize,
      snapOffset: 50,
      selectors: ['main', '#ide-wrapper'],
      mainPanel: 0,
      size: [60, 40],
      minSize: [0, 0],
      toggle: '#toggle-ide',
    };
  }
  return config;
}

export { createPanelConfig };
