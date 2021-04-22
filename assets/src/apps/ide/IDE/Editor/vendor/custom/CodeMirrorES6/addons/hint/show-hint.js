// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

export function addShowhint(CodeMirror) {

  const HINT_ELEMENT_CLASS = 'CodeMirror-hint';
  const ACTIVE_HINT_ELEMENT_CLASS = 'CodeMirror-hint-active';

  // This is the old interface, kept around for now to stay
  // backwards-compatible.
  CodeMirror.showHint = function (cm, getHints, options) {
    if (!getHints) return cm.showHint(options);
    if (options && options.async) getHints.async = true;
    const newOpts = {
      hint: getHints,
    };
    if (options) {
      for (const prop in options) newOpts[prop] = options[prop];
    }
    return cm.showHint(newOpts);
  };

  CodeMirror.defineExtension('showHint', function (options) {
    options = parseOptions(this, this.getCursor('start'), options);
    const selections = this.listSelections();
    if (selections.length > 1) return;
    // By default, don't allow completion when something is selected.
    // A hint function can have a `supportsSelection` property to
    // indicate that it can handle selections.
    if (this.somethingSelected()) {
      if (!options.hint.supportsSelection) return;
      // Don't try with cross-line selections
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].head.line != selections[i].anchor.line) return;
      }
    }

    if (this.state.completionActive) this.state.completionActive.close();
    const completion = this.state.completionActive = new Completion(this, options);
    if (!completion.options.hint) return;

    CodeMirror.signal(this, 'startCompletion', this);
    completion.update(true);
  });

  CodeMirror.defineExtension('closeHint', function () {
    if (this.state.completionActive) this.state.completionActive.close();
  });

  function Completion(cm, options) {
    this.cm = cm;
    this.options = options;
    this.widget = null;
    this.debounce = 0;
    this.tick = 0;
    this.startPos = this.cm.getCursor('start');
    this.startLen = this.cm.getLine(this.startPos.line)
      .length - this.cm.getSelection()
        .length;

    const self = this;
    cm.on('cursorActivity', this.activityFunc = function () {
      self.cursorActivity();
    });
  }

  const requestAnimationFrame = window.requestAnimationFrame || function (fn) {
    return setTimeout(fn, 1000 / 60);
  };
  const cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

  Completion.prototype = {
    close() {
      if (!this.active()) return;
      this.cm.state.completionActive = null;
      this.tick = null;
      this.cm.off('cursorActivity', this.activityFunc);

      if (this.widget && this.data) CodeMirror.signal(this.data, 'close');
      if (this.widget) this.widget.close();
      CodeMirror.signal(this.cm, 'endCompletion', this.cm);
    },

    active() {
      return this.cm.state.completionActive == this;
    },

    pick(data, i) {
      const completion = data.list[i];
      if (completion.hint) completion.hint(this.cm, data, completion);
      else {
        this.cm.replaceRange(getText(completion), completion.from || data.from,
          completion.to || data.to, 'complete');
      }
      CodeMirror.signal(data, 'pick', completion);
      this.close();
    },

    cursorActivity() {
      if (this.debounce) {
        cancelAnimationFrame(this.debounce);
        this.debounce = 0;
      }

      const pos = this.cm.getCursor();
      const line = this.cm.getLine(pos.line);
      if (pos.line != this.startPos.line || line.length - pos.ch != this.startLen - this.startPos.ch
        || pos.ch < this.startPos.ch || this.cm.somethingSelected()
        || (!pos.ch || this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
        this.close();
      } else {
        const self = this;
        this.debounce = requestAnimationFrame(() => {
          self.update();
        });
        if (this.widget) this.widget.disable();
      }
    },

    update(first) {
      if (this.tick == null) return;
      const self = this;
      const myTick = ++this.tick;
      fetchHints(this.options.hint, this.cm, this.options, (data) => {
        if (self.tick == myTick) self.finishUpdate(data, first);
      });
    },

    finishUpdate(data, first) {
      if (this.data) CodeMirror.signal(this.data, 'update');

      const picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle);
      if (this.widget) this.widget.close();

      this.data = data;

      if (data && data.list.length) {
        if (picked && data.list.length == 1) {
          this.pick(data, 0);
        } else {
          this.widget = new Widget(this, data);
          CodeMirror.signal(data, 'shown');
        }
      }
    },
  };

  function parseOptions(cm, pos, options) {
    const editor = cm.options.hintOptions;
    const out = {};
    for (var prop in defaultOptions) out[prop] = defaultOptions[prop];
    if (editor) {
      for (var prop in editor) {
        if (editor[prop] !== undefined) out[prop] = editor[prop];
      }
    }
    if (options) {
      for (var prop in options) {
        if (options[prop] !== undefined) out[prop] = options[prop];
      }
    }
    if (out.hint.resolve) out.hint = out.hint.resolve(cm, pos);
    return out;
  }

  function getText(completion) {
    if (typeof completion === 'string') return completion;
    return completion.text;
  }

  function buildKeyMap(completion, handle) {
    const baseMap = {
      Up() {
        handle.moveFocus(-1);
      },
      Down() {
        handle.moveFocus(1);
      },
      PageUp() {
        handle.moveFocus(-handle.menuSize() + 1, true);
      },
      PageDown() {
        handle.moveFocus(handle.menuSize() - 1, true);
      },
      Home() {
        handle.setFocus(0);
      },
      End() {
        handle.setFocus(handle.length - 1);
      },
      Enter: handle.pick,
      Tab: handle.pick,
      Esc: handle.close,
    };

    const mac = /Mac/.test(navigator.platform);

    if (mac) {
      baseMap['Ctrl-P'] = function () {
        handle.moveFocus(-1);
      };
      baseMap['Ctrl-N'] = function () {
        handle.moveFocus(1);
      };
    }

    const custom = completion.options.customKeys;
    const ourMap = custom ? {} : baseMap;

    function addBinding(key, val) {
      let bound;
      if (typeof val !== 'string') {
        bound = function (cm) {
          return val(cm, handle);
        };
      }
      // This mechanism is deprecated
      else if (baseMap.hasOwnProperty(val)) {
        bound = baseMap[val];
      } else {
        bound = val;
      }
      ourMap[key] = bound;
    }
    if (custom) {
      for (var key in custom) {
        if (custom.hasOwnProperty(key)) {
          addBinding(key, custom[key]);
        }
      }
    }
    const extra = completion.options.extraKeys;
    if (extra) {
      for (var key in extra) {
        if (extra.hasOwnProperty(key)) {
          addBinding(key, extra[key]);
        }
      }
    }
    return ourMap;
  }

  function getHintElement(hintsElement, el) {
    while (el && el != hintsElement) {
      if (el.nodeName.toUpperCase() === 'LI' && el.parentNode == hintsElement) return el;
      el = el.parentNode;
    }
  }

  function Widget(completion, data) {
    this.completion = completion;
    this.data = data;
    this.picked = false;
    const widget = this;
    const cm = completion.cm;
    const ownerDocument = cm.getInputField()
      .ownerDocument;
    const parentWindow = ownerDocument.defaultView || ownerDocument.parentWindow;

    const hints = this.hints = ownerDocument.createElement('ul');
    const theme = completion.cm.options.theme;
    hints.className = 'CodeMirror-hints ' + theme;
    this.selectedHint = data.selectedHint || 0;

    const completions = data.list;
    for (let i = 0; i < completions.length; ++i) {
      const elt = hints.appendChild(ownerDocument.createElement('li'));
      const cur = completions[i];
      let className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? '' : ' ' + ACTIVE_HINT_ELEMENT_CLASS);
      if (cur.className != null) className = cur.className + ' ' + className;
      elt.className = className;
      if (cur.render) cur.render(elt, data, cur);
      else elt.appendChild(ownerDocument.createTextNode(cur.displayText || getText(cur)));
      elt.hintId = i;
    }

    const container = completion.options.container || ownerDocument.body;
    let pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null);
    let left = pos.left;
    let top = pos.bottom;
    let below = true;
    let offsetLeft = 0;
    let offsetTop = 0;
    if (container !== ownerDocument.body) {
      // We offset the cursor position because left and top are relative to the offsetParent's top left corner.
      const isContainerPositioned = ['absolute', 'relative', 'fixed'].indexOf(parentWindow.getComputedStyle(
        container,
      )
        .position) !== -1;
      const offsetParent = isContainerPositioned ? container : container.offsetParent;
      const offsetParentPosition = offsetParent.getBoundingClientRect();
      const bodyPosition = ownerDocument.body.getBoundingClientRect();
      offsetLeft = (offsetParentPosition.left - bodyPosition.left - offsetParent.scrollLeft);
      offsetTop = (offsetParentPosition.top - bodyPosition.top - offsetParent.scrollTop);
    }
    hints.style.left = (left - offsetLeft) + 'px';
    hints.style.top = (top - offsetTop) + 'px';

    // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
    const winW = parentWindow.innerWidth || Math.max(ownerDocument.body.offsetWidth, ownerDocument.documentElement
      .offsetWidth);
    const winH = parentWindow.innerHeight || Math.max(ownerDocument.body.offsetHeight, ownerDocument.documentElement
      .offsetHeight);
    container.appendChild(hints);
    let box = hints.getBoundingClientRect();
    const overlapY = box.bottom - winH;
    const scrolls = hints.scrollHeight > hints.clientHeight + 1;
    const startScroll = cm.getScrollInfo();

    if (overlapY > 0) {
      const height = box.bottom - box.top;
      const curTop = pos.top - (pos.bottom - box.top);
      if (curTop - height > 0) { // Fits above cursor
        hints.style.top = (top = pos.top - height - offsetTop) + 'px';
        below = false;
      } else if (height > winH) {
        hints.style.height = (winH - 5) + 'px';
        hints.style.top = (top = pos.bottom - box.top - offsetTop) + 'px';
        const cursor = cm.getCursor();
        if (data.from.ch != cursor.ch) {
          pos = cm.cursorCoords(cursor);
          hints.style.left = (left = pos.left - offsetLeft) + 'px';
          box = hints.getBoundingClientRect();
        }
      }
    }
    let overlapX = box.right - winW;
    if (overlapX > 0) {
      if (box.right - box.left > winW) {
        hints.style.width = (winW - 5) + 'px';
        overlapX -= (box.right - box.left) - winW;
      }
      hints.style.left = (left = pos.left - overlapX - offsetLeft) + 'px';
    }
    if (scrolls) {
      for (let node = hints.firstChild; node; node = node.nextSibling) {
        node.style.paddingRight = cm.display.nativeBarWidth + 'px';
      }
    }

    cm.addKeyMap(this.keyMap = buildKeyMap(completion, {
      moveFocus(n, avoidWrap) {
        widget.changeActive(widget.selectedHint + n, avoidWrap);
      },
      setFocus(n) {
        widget.changeActive(n);
      },
      menuSize() {
        return widget.screenAmount();
      },
      length: completions.length,
      close() {
        completion.close();
      },
      pick() {
        widget.pick();
      },
      data,
    }));

    if (completion.options.closeOnUnfocus) {
      let closingOnBlur;
      cm.on('blur', this.onBlur = function () {
        closingOnBlur = setTimeout(() => {
          completion.close();
        }, 100);
      });
      cm.on('focus', this.onFocus = function () {
        clearTimeout(closingOnBlur);
      });
    }

    cm.on('scroll', this.onScroll = function () {
      const curScroll = cm.getScrollInfo();
      const editor = cm.getWrapperElement()
        .getBoundingClientRect();
      const newTop = top + startScroll.top - curScroll.top;
      let point = newTop - (parentWindow.pageYOffset || (ownerDocument.documentElement || ownerDocument.body)
        .scrollTop);
      if (!below) point += hints.offsetHeight;
      if (point <= editor.top || point >= editor.bottom) return completion.close();
      hints.style.top = newTop + 'px';
      hints.style.left = (left + startScroll.left - curScroll.left) + 'px';
    });

    CodeMirror.on(hints, 'dblclick', (e) => {
      const t = getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        widget.pick();
      }
    });

    CodeMirror.on(hints, 'click', (e) => {
      const t = getHintElement(hints, e.target || e.srcElement);
      if (t && t.hintId != null) {
        widget.changeActive(t.hintId);
        if (completion.options.completeOnSingleClick) widget.pick();
      }
    });

    CodeMirror.on(hints, 'mousedown', () => {
      setTimeout(() => {
        cm.focus();
      }, 20);
    });

    CodeMirror.signal(data, 'select', completions[this.selectedHint], hints.childNodes[this.selectedHint]);
    return true;
  }

  Widget.prototype = {
    close() {
      if (this.completion.widget != this) return;
      this.completion.widget = null;
      this.hints.parentNode.removeChild(this.hints);
      this.completion.cm.removeKeyMap(this.keyMap);

      const cm = this.completion.cm;
      if (this.completion.options.closeOnUnfocus) {
        cm.off('blur', this.onBlur);
        cm.off('focus', this.onFocus);
      }
      cm.off('scroll', this.onScroll);
    },

    disable() {
      this.completion.cm.removeKeyMap(this.keyMap);
      const widget = this;
      this.keyMap = {
        Enter() {
          widget.picked = true;
        },
      };
      this.completion.cm.addKeyMap(this.keyMap);
    },

    pick() {
      this.completion.pick(this.data, this.selectedHint);
    },

    changeActive(i, avoidWrap) {
      if (i >= this.data.list.length) {
        i = avoidWrap ? this.data.list.length - 1 : 0;
      } else if (i < 0) {
        i = avoidWrap ? 0 : this.data.list.length - 1;
      }
      if (this.selectedHint == i) return;
      let node = this.hints.childNodes[this.selectedHint];
      if (node) node.className = node.className.replace(' ' + ACTIVE_HINT_ELEMENT_CLASS, '');
      node = this.hints.childNodes[this.selectedHint = i];
      node.className += ' ' + ACTIVE_HINT_ELEMENT_CLASS;
      if (node.offsetTop < this.hints.scrollTop) {
        this.hints.scrollTop = node.offsetTop - 3;
      } else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight) {
        this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
      }
      CodeMirror.signal(this.data, 'select', this.data.list[this.selectedHint], node);
    },

    screenAmount() {
      return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
    },
  };

  function applicableHelpers(cm, helpers) {
    if (!cm.somethingSelected()) return helpers;
    const result = [];
    for (let i = 0; i < helpers.length; i++) {
      if (helpers[i].supportsSelection) result.push(helpers[i]);
    }
    return result;
  }

  function fetchHints(hint, cm, options, callback) {
    if (hint.async) {
      hint(cm, callback, options);
    } else {
      const result = hint(cm, options);
      if (result && result.then) result.then(callback);
      else callback(result);
    }
  }

  function resolveAutoHints(cm, pos) {
    const helpers = cm.getHelpers(pos, 'hint');
    let words;
    if (helpers.length) {
      const resolved = function (cm, callback, options) {
        const app = applicableHelpers(cm, helpers);

        function run(i) {
          if (i == app.length) return callback(null);
          fetchHints(app[i], cm, options, (result) => {
            if (result && result.list.length > 0) callback(result);
            else run(i + 1);
          });
        }
        run(0);
      };
      resolved.async = true;
      resolved.supportsSelection = true;
      return resolved;
    }
    if (words = cm.getHelper(cm.getCursor(), 'hintWords')) {
      return function (cm) {
        return CodeMirror.hint.fromList(cm, {
          words,
        });
      };
    }
    if (CodeMirror.hint.anyword) {
      return function (cm, options) {
        return CodeMirror.hint.anyword(cm, options);
      };
    }
    return function () { };

  }

  CodeMirror.registerHelper('hint', 'auto', {
    resolve: resolveAutoHints,
  });

  CodeMirror.registerHelper('hint', 'fromList', (cm, options) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    let term;
    let from = CodeMirror.Pos(cur.line, token.start);
    const to = cur;
    if (token.start < cur.ch && /\w/.test(token.string.charAt(cur.ch - token.start - 1))) {
      term = token.string.substr(0, cur.ch - token.start);
    } else {
      term = '';
      from = cur;
    }
    const found = [];
    for (let i = 0; i < options.words.length; i++) {
      const word = options.words[i];
      if (word.slice(0, term.length) == term) {
        found.push(word);
      }
    }

    if (found.length) {
      return {
        list: found,
        from,
        to,
      };
    }
  });

  CodeMirror.commands.autocomplete = CodeMirror.showHint;

  var defaultOptions = {
    hint: CodeMirror.hint.auto,
    completeSingle: true,
    alignWithWord: true,
    closeCharacters: /[\s()\[\]{};:>,]/,
    closeOnUnfocus: true,
    completeOnSingleClick: true,
    container: null,
    customKeys: null,
    extraKeys: null,
  };

  CodeMirror.defineOption('hintOptions', null);
}
