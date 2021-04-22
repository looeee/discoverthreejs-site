import Split from './vendor/custom/split.js';

// panels are in pairs [#panelA, #panelB]
// one panel (either) is the main panel, one the minor
// toggle can be defined, which will toggle the minor panel

class Panels {
  constructor(ide, preview) {
    // used to refresh and focus the editor on panel change
    this.ide = ide;
  }

  init(config) {
    this.panelElements = document.querySelectorAll('.panel');

    this.config = config || {};

    this.panels = this.createPanels(config);

    this.restoreState();
  }

  saveState() {
    const state = {};

    Object.keys(this.panels).forEach((name) => {
      const panel = this.panels[name];
      if (panel.split) {
        state[name] = {
          sizes: panel.split.getSizes(),
        };
        if (panel.toggle) {
          state[name].toggleChecked = panel.toggle.elem.checked;
        }
      }
    });

    localStorage.setItem('split-state', JSON.stringify(state));
  }

  restoreState() {
    const state = JSON.parse(localStorage.getItem('split-state'));

    if (!state) return;

    Object.keys(this.panels).forEach((name) => {
      const panel = this.panels[name];
      if (state[name]) {
        if (state[name].sizes)
          panel.split.setSizes(state[name].sizes);
        if (state[name].toggleChecked !== undefined) {
          panel.enable(state[name].toggleChecked);
          panel.toggle.elem.checked = state[name].toggleChecked;
        }
      }
    });
  }

  createPanels(config) {
    const panels = {};

    for (const name of Object.keys(config.splits)) {
      const details = config.splits[name];

      const panel = {
        name,
        config: details,
        breakpoint: details.breakpoint || 0,
        isOpen: null,
        mainPanelIndex: details.mainPanel || 0,
      };

      panel.minorPanelIndex = (panel.mainPanelIndex + 1) % 2;

      panel.toggle = this.createToggle(panel);

      panel.elements = details.selectors.map((selector) =>
        document.querySelector(selector),
      );

      panel.split = this.createSplit(panel);

      panel.enable = (bool) => {
        if (bool === false) {
          panel.isOpen = false;
          panel.elements[panel.minorPanelIndex].classList.add(
            'disabled',
          );
          panel.elements[panel.mainPanelIndex].classList.add(
            'maximise',
          );
          panel.split.pairs[0].gutter.classList.add('disabled');
        } else {
          panel.isOpen = true;
          panel.elements[panel.minorPanelIndex].classList.remove(
            'disabled',
          );
          panel.elements[panel.mainPanelIndex].classList.remove(
            'maximise',
          );
          panel.split.pairs[0].gutter.classList.remove('disabled');

          // TODO: decouple editor/panels.
          // TODO: this is being called twice on load
          // The issue us that Codemirror autorefresh doesn't work
          // so it must be done manually
          // Also, the iframe will not update until it's visible
          // possible solution: add onVisible event to panel
          if (panel.name === 'main') {
            setTimeout(() => {
              this.ide.editor.refresh();
              this.ide.editor.focus();
              this.ide.updatePreview();
            }, 1);
          }
        }
      };

      panels[name] = panel;

      if (panel.toggle) this.setupOnToggle(panel);

      // TODO: on load this gets called and local storage gets called
      // resulting in main panel being enabled twice
      this.collapseBelowBreakpoint(panel);
    }

    return panels;
  }

  createSplit(panel) {
    return new Split(panel.config.selectors, {
      direction: panel.config.direction || 'horizontal',
      dragInterval:
        panel.config.dragInterval || this.config.dragInterval || 1,
      elementStyle:
        panel.config.elementStyle ||
        this.config.elementStyle ||
        undefined,
      gutterSize:
        panel.config.gutterSize || this.config.gutterSize || 1,
      gutterStyle:
        panel.config.gutterStyle ||
        this.config.gutterStyle ||
        undefined,
      minSize: panel.config.minSize,
      sizes: panel.config.size,
      snapOffset: panel.config.snapOffset || 0,
      onDragStart: () => {
        this.enablePanelAnimation(false);
      },
      onDragEnd: (sizes) => {
        if (!panel.toggle) return;

        const minorPanelSize = sizes[panel.minorPanelIndex];

        if (minorPanelSize > 1) {
          panel.toggle.elem.checked = true;
          panel.enable(true);
        } else {
          panel.toggle.elem.checked = false;
          panel.enable(false);
        }

        this.saveState();

        this.enablePanelAnimation(true);
      },
    });
  }

  collapseBelowBreakpoint(panel) {
    if (panel.breakpoint > 0) {
      const direction = panel.split.pairs[0].direction;

      let parentSize;
      if (direction === 'horizontal')
        parentSize = panel.split.parent.clientWidth;
      else parentSize = panel.split.parent.clientHeight;

      if (parentSize > panel.breakpoint) {
        panel.enable(true);
      } else {
        panel.enable(false);
      }
    }
  }

  createToggle(panel) {
    if (!panel.config.toggle) return null;

    const toggleElem = document.querySelector(panel.config.toggle);

    const toggle = {
      elem: toggleElem,
      onIcon: toggleElem.labels[0].querySelector('.on-icon'),
      offIcon: toggleElem.labels[0].querySelector('.off-icon'),
    };

    return toggle;
  }

  setupOnToggle(panel) {
    const onToggle = () => {
      if (panel.toggle.elem.checked) {
        panel.enable(true);
        if (panel.config.toggleSize)
          panel.split.setSizes(panel.config.toggleSize);
        else panel.split.setSizes(panel.config.size);
      } else {
        panel.enable(false);
        panel.split.collapse(panel.minorPanelIndex);
      }

      this.saveState();
    };

    panel.toggle.elem.addEventListener('click', onToggle);

    panel.toggle.dispose = () => {
      panel.toggle.elem.removeEventListener('click', onToggle);
    };
  }

  enablePanelAnimation(bool) {
    this.panelElements.forEach((panel) => {
      if (bool) panel.classList.add('animate');
      else panel.classList.remove('animate');
    });
  }

  dispose() {
    if (!this.panels) return;

    Object.values(this.panels).forEach((panel) => {
      panel.split.destroy();
      if (panel.toggle) panel.toggle.dispose();
    });

    this.panels = null;
  }
}

export { Panels };
