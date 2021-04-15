/* PrismJS 1.20.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+c+css-extras+glsl+js-extras+js-templates&plugins=line-highlight+line-numbers+wpd+inline-color+normalize-whitespace+toolbar+copy-to-clipboard+match-braces */
/// <reference lib="WebWorker"/>

import ClipboardJS from 'clipboard';

var _self =
  typeof window !== 'undefined'
    ? window // if in browser
    : typeof WorkerGlobalScope !== 'undefined' &&
      self instanceof WorkerGlobalScope
    ? self // if in worker
    : {}; // if in node js

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
export default Prism = (function (_self) {
  // Private helper vars
  var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  var uniqueId = 0;

  var _ = {
    /**
     * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
     * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
     * additional languages or plugins yourself.
     *
     * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
     *
     * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
     * empty Prism object into the global scope before loading the Prism script like this:
     *
     * ```js
     * window.Prism = window.Prism || {};
     * Prism.manual = true;
     * // add a new <script> to load Prism's script
     * ```
     *
     * @default false
     * @type {boolean}
     * @memberof Prism
     * @public
     */
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler:
      _self.Prism && _self.Prism.disableWorkerMessageHandler,

    /**
     * A namespace for utility methods.
     *
     * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
     * change or disappear at any time.
     *
     * @namespace
     * @memberof Prism
     */
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(
            tokens.type,
            encode(tokens.content),
            tokens.alias,
          );
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/\u00a0/g, ' ');
        }
      },

      /**
       * Returns the name of the type of the given value.
       *
       * @param {any} o
       * @returns {string}
       * @example
       * type(null)      === 'Null'
       * type(undefined) === 'Undefined'
       * type(123)       === 'Number'
       * type('foo')     === 'String'
       * type(true)      === 'Boolean'
       * type([1, 2])    === 'Array'
       * type({})        === 'Object'
       * type(String)    === 'Function'
       * type(/abc+/)    === 'RegExp'
       */
      type: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      },

      /**
       * Returns a unique number for the given object. Later calls will still return the same number.
       *
       * @param {Object} obj
       * @returns {number}
       */
      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },

      /**
       * Creates a deep clone of the given object.
       *
       * The main intended use of this function is to clone language definitions.
       *
       * @param {T} o
       * @param {Record<number, any>} [visited]
       * @returns {T}
       * @template T
       */
      clone: function deepClone(o, visited) {
        visited = visited || {};

        var clone, id;
        switch (_.util.type(o)) {
          case 'Object':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = /** @type {Record<string, any>} */ ({});
            visited[id] = clone;

            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited);
              }
            }

            return /** @type {any} */ (clone);

          case 'Array':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = [];
            visited[id] = clone;

            /** @type {Array} */ (/** @type {any} */ (o)).forEach(
              function (v, i) {
                clone[i] = deepClone(v, visited);
              },
            );

            return /** @type {any} */ (clone);

          default:
            return o;
        }
      },

      /**
       * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
       *
       * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
       *
       * @param {Element} element
       * @returns {string}
       */
      getLanguage: function (element) {
        while (element && !lang.test(element.className)) {
          element = element.parentElement;
        }
        if (element) {
          return (element.className.match(lang) || [
            ,
            'none',
          ])[1].toLowerCase();
        }
        return 'none';
      },

      /**
       * Returns the script element that is currently executing.
       *
       * This does __not__ work for line script element.
       *
       * @returns {HTMLScriptElement | null}
       */
      currentScript: function () {
        if (typeof document === 'undefined') {
          return null;
        }
        if (
          'currentScript' in document &&
          1 < 2 /* hack to trip TS' flow analysis */
        ) {
          return /** @type {any} */ (document.currentScript);
        }

        // IE11 workaround
        // we'll get the src of the current script by parsing IE11's error stack trace
        // this will not work for inline scripts

        try {
          throw new Error();
        } catch (err) {
          // Get file src url from stack. Specifically works with the format of stack traces in IE.
          // A stack will look like this:
          //
          // Error
          //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
          //    at Global code (http://localhost/components/prism-core.js:606:1)

          var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) ||
            [])[1];
          if (src) {
            var scripts = document.getElementsByTagName('script');
            for (var i in scripts) {
              if (scripts[i].src == src) {
                return scripts[i];
              }
            }
          }
          return null;
        }
      },

      /**
       * Returns whether a given class is active for `element`.
       *
       * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
       * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
       * given class is just the given class with a `no-` prefix.
       *
       * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
       * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
       * ancestors have the given class or the negated version of it, then the default activation will be returned.
       *
       * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
       * version of it, the class is considered active.
       *
       * @param {Element} element
       * @param {string} className
       * @param {boolean} [defaultActivation=false]
       * @returns {boolean}
       */
      isActive: function (element, className, defaultActivation) {
        var no = 'no-' + className;

        while (element) {
          var classList = element.classList;
          if (classList.contains(className)) {
            return true;
          }
          if (classList.contains(no)) {
            return false;
          }
          element = element.parentElement;
        }
        return !!defaultActivation;
      },
    },

    /**
     * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
     *
     * @namespace
     * @memberof Prism
     * @public
     */
    languages: {
      /**
       * Creates a deep copy of the language with the given id and appends the given tokens.
       *
       * If a token in `redef` also appears in the copied language, then the existing token in the copied language
       * will be overwritten at its original position.
       *
       * ## Best practices
       *
       * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
       * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
       * understand the language definition because, normally, the order of tokens matters in Prism grammars.
       *
       * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
       * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
       *
       * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
       * @param {Grammar} redef The new tokens to append.
       * @returns {Grammar} The new language created.
       * @public
       * @example
       * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
       *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
       *     // at its original position
       *     'comment': { ... },
       *     // CSS doesn't have a 'color' token, so this token will be appended
       *     'color': /\b(?:red|green|blue)\b/
       * });
       */
      extend: function (id, redef) {
        var lang = _.util.clone(_.languages[id]);

        for (var key in redef) {
          lang[key] = redef[key];
        }

        return lang;
      },

      /**
       * Inserts tokens _before_ another token in a language definition or any other grammar.
       *
       * ## Usage
       *
       * This helper method makes it easy to modify existing languages. For example, the CSS language definition
       * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
       * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
       * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
       * this:
       *
       * ```js
       * Prism.languages.markup.style = {
       *     // token
       * };
       * ```
       *
       * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
       * before existing tokens. For the CSS example above, you would use it like this:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'cdata', {
       *     'style': {
       *         // token
       *     }
       * });
       * ```
       *
       * ## Special cases
       *
       * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
       * will be ignored.
       *
       * This behavior can be used to insert tokens after `before`:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'comment', {
       *     'comment': Prism.languages.markup.comment,
       *     // tokens after 'comment'
       * });
       * ```
       *
       * ## Limitations
       *
       * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
       * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
       * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
       * deleting properties which is necessary to insert at arbitrary positions.
       *
       * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
       * Instead, it will create a new object and replace all references to the target object with the new one. This
       * can be done without temporarily deleting properties, so the iteration order is well-defined.
       *
       * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
       * you hold the target object in a variable, then the value of the variable will not change.
       *
       * ```js
       * var oldMarkup = Prism.languages.markup;
       * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
       *
       * assert(oldMarkup !== Prism.languages.markup);
       * assert(newMarkup === Prism.languages.markup);
       * ```
       *
       * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
       * object to be modified.
       * @param {string} before The key to insert before.
       * @param {Grammar} insert An object containing the key-value pairs to be inserted.
       * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
       * object to be modified.
       *
       * Defaults to `Prism.languages`.
       * @returns {Grammar} The new grammar object.
       * @public
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || /** @type {any} */ (_.languages);
        var grammar = root[inside];
        /** @type {Grammar} */
        var ret = {};

        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            // Do not insert token which also occur in insert. See #1525
            if (!insert.hasOwnProperty(token)) {
              ret[token] = grammar[token];
            }
          }
        }

        var old = root[inside];
        root[inside] = ret;

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === old && key != inside) {
            this[key] = ret;
          }
        });

        return ret;
      },

      // Traverse a language definition with Depth First Search
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {};

        var objId = _.util.objId;

        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);

            var property = o[i],
              propertyType = _.util.type(property);

            if (
              propertyType === 'Object' &&
              !visited[objId(property)]
            ) {
              visited[objId(property)] = true;
              DFS(property, callback, null, visited);
            } else if (
              propertyType === 'Array' &&
              !visited[objId(property)]
            ) {
              visited[objId(property)] = true;
              DFS(property, callback, i, visited);
            }
          }
        }
      },
    },

    plugins: {},

    /**
     * This is the most high-level function in Prism’s API.
     * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
     * each one of them.
     *
     * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
     *
     * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
     * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
     * @memberof Prism
     * @public
     */
    highlightAll: function (async, callback) {
      _.highlightAllUnder(document, async, callback);
    },

    /**
     * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
     * {@link Prism.highlightElement} on each one of them.
     *
     * The following hooks will be run:
     * 1. `before-highlightall`
     * 2. All hooks of {@link Prism.highlightElement} for each element.
     *
     * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
     * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
     * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
     * @memberof Prism
     * @public
     */
    highlightAllUnder: function (container, async, callback) {
      var env = {
        callback: callback,
        container: container,
        selector:
          'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
      };

      _.hooks.run('before-highlightall', env);

      env.elements = Array.prototype.slice.apply(
        env.container.querySelectorAll(env.selector),
      );

      _.hooks.run('before-all-elements-highlight', env);

      for (var i = 0, element; (element = env.elements[i++]); ) {
        _.highlightElement(element, async === true, env.callback);
      }
    },

    /**
     * Highlights the code inside a single element.
     *
     * The following hooks will be run:
     * 1. `before-sanity-check`
     * 2. `before-highlight`
     * 3. All hooks of {@link Prism.highlight}. These hooks will only be run by the current worker if `async` is `true`.
     * 4. `before-insert`
     * 5. `after-highlight`
     * 6. `complete`
     *
     * @param {Element} element The element containing the code.
     * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
     * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
     * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
     * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
     *
     * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
     * asynchronous highlighting to work. You can build your own bundle on the
     * [Download page](https://prismjs.com/download.html).
     * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
     * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
     * @memberof Prism
     * @public
     */
    highlightElement: function (element, async, callback) {
      // Find language
      var language = _.util.getLanguage(element);
      var grammar = _.languages[language];

      // Set language on the element, if not present
      element.className =
        element.className.replace(lang, '').replace(/\s+/g, ' ') +
        ' language-' +
        language;

      // Set language on the parent, for styling
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre') {
        parent.className =
          parent.className.replace(lang, '').replace(/\s+/g, ' ') +
          ' language-' +
          language;
      }

      var code = element.textContent;

      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code,
      };

      function insertHighlightedCode(highlightedCode) {
        env.highlightedCode = highlightedCode;

        _.hooks.run('before-insert', env);

        env.element.innerHTML = env.highlightedCode;

        _.hooks.run('after-highlight', env);
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
      }

      _.hooks.run('before-sanity-check', env);

      if (!env.code) {
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
        return;
      }

      _.hooks.run('before-highlight', env);

      if (!env.grammar) {
        insertHighlightedCode(_.util.encode(env.code));
        return;
      }

      if (async && _self.Worker) {
        var worker = new Worker(_.filename);

        worker.onmessage = function (evt) {
          insertHighlightedCode(evt.data);
        };

        worker.postMessage(
          JSON.stringify({
            language: env.language,
            code: env.code,
            immediateClose: true,
          }),
        );
      } else {
        insertHighlightedCode(
          _.highlight(env.code, env.grammar, env.language),
        );
      }
    },

    /**
     * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
     * and the language definitions to use, and returns a string with the HTML produced.
     *
     * The following hooks will be run:
     * 1. `before-tokenize`
     * 2. `after-tokenize`
     * 3. `wrap`: On each {@link Token}.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @param {string} language The name of the language definition passed to `grammar`.
     * @returns {string} The highlighted HTML.
     * @memberof Prism
     * @public
     * @example
     * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
     */
    highlight: function (text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language,
      };
      _.hooks.run('before-tokenize', env);
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },

    /**
     * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
     * and the language definitions to use, and returns an array with the tokenized code.
     *
     * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
     *
     * This method could be useful in other contexts as well, as a very crude parser.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @returns {TokenStream} An array of strings and tokens, a token stream.
     * @memberof Prism
     * @public
     * @example
     * let code = `var foo = 0;`;
     * let tokens = Prism.tokenize(code, Prism.languages.javascript);
     * tokens.forEach(token => {
     *     if (token instanceof Prism.Token && token.type === 'number') {
     *         console.log(`Found numeric literal: ${token.content}`);
     *     }
     * });
     */
    tokenize: function (text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }

        delete grammar.rest;
      }

      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);

      matchGrammar(text, tokenList, grammar, tokenList.head, 0);

      return toArray(tokenList);
    },

    /**
     * @namespace
     * @memberof Prism
     * @public
     */
    hooks: {
      all: {},

      /**
       * Adds the given callback to the list of callbacks for the given hook.
       *
       * The callback will be invoked when the hook it is registered for is run.
       * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
       *
       * One callback function can be registered to multiple hooks and the same hook multiple times.
       *
       * @param {string} name The name of the hook.
       * @param {HookCallback} callback The callback function which is given environment variables.
       * @public
       */
      add: function (name, callback) {
        var hooks = _.hooks.all;

        hooks[name] = hooks[name] || [];

        hooks[name].push(callback);
      },

      /**
       * Runs a hook invoking all registered callbacks with the given environment variables.
       *
       * Callbacks will be invoked synchronously and in the order in which they were registered.
       *
       * @param {string} name The name of the hook.
       * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
       * @public
       */
      run: function (name, env) {
        var callbacks = _.hooks.all[name];

        if (!callbacks || !callbacks.length) {
          return;
        }

        for (var i = 0, callback; (callback = callbacks[i++]); ) {
          callback(env);
        }
      },
    },

    Token: Token,
  };
  _self.Prism = _;

  // Typescript note:
  // The following can be used to import the Token type in JSDoc:
  //
  //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

  /**
   * Creates a new token.
   *
   * @param {string} type See {@link Token#type type}
   * @param {string | TokenStream} content See {@link Token#content content}
   * @param {string|string[]} [alias] The alias(es) of the token.
   * @param {string} [matchedStr=""] A copy of the full string this token was created from.
   * @class
   * @global
   * @public
   */
  function Token(type, content, alias, matchedStr) {
    /**
     * The type of the token.
     *
     * This is usually the key of a pattern in a {@link Grammar}.
     *
     * @type {string}
     * @see GrammarToken
     * @public
     */
    this.type = type;
    /**
     * The strings or tokens contained by this token.
     *
     * This will be a token stream if the pattern matched also defined an `inside` grammar.
     *
     * @type {string | TokenStream}
     * @public
     */
    this.content = content;
    /**
     * The alias(es) of the token.
     *
     * @type {string|string[]}
     * @see GrammarToken
     * @public
     */
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
  }

  /**
   * A token stream is an array of strings and {@link Token Token} objects.
   *
   * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
   * them.
   *
   * 1. No adjacent strings.
   * 2. No empty strings.
   *
   *    The only exception here is the token stream that only contains the empty string and nothing else.
   *
   * @typedef {Array<string | Token>} TokenStream
   * @global
   * @public
   */

  /**
   * Converts the given token or token stream to an HTML representation.
   *
   * The following hooks will be run:
   * 1. `wrap`: On each {@link Token}.
   *
   * @param {string | Token | TokenStream} o The token or token stream to be converted.
   * @param {string} language The name of current language.
   * @returns {string} The HTML representation of the token or token stream.
   * @memberof Token
   * @static
   */
  Token.stringify = function stringify(o, language) {
    if (typeof o == 'string') {
      return o;
    }
    if (Array.isArray(o)) {
      var s = '';
      o.forEach(function (e) {
        s += stringify(e, language);
      });
      return s;
    }

    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language,
    };

    var aliases = o.alias;
    if (aliases) {
      if (Array.isArray(aliases)) {
        Array.prototype.push.apply(env.classes, aliases);
      } else {
        env.classes.push(aliases);
      }
    }

    _.hooks.run('wrap', env);

    var attributes = '';
    for (var name in env.attributes) {
      attributes +=
        ' ' +
        name +
        '="' +
        (env.attributes[name] || '').replace(/"/g, '&quot;') +
        '"';
    }

    return (
      '<' +
      env.tag +
      ' class="' +
      env.classes.join(' ') +
      '"' +
      attributes +
      '>' +
      env.content +
      '</' +
      env.tag +
      '>'
    );
  };

  /**
   * @param {string} text
   * @param {LinkedList<string | Token>} tokenList
   * @param {any} grammar
   * @param {LinkedListNode<string | Token>} startNode
   * @param {number} startPos
   * @param {RematchOptions} [rematch]
   * @returns {void}
   * @private
   *
   * @typedef RematchOptions
   * @property {string} cause
   * @property {number} reach
   */
  function matchGrammar(
    text,
    tokenList,
    grammar,
    startNode,
    startPos,
    rematch,
  ) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];

      for (var j = 0; j < patterns.length; ++j) {
        if (rematch && rematch.cause == token + ',' + j) {
          return;
        }

        var patternObj = patterns[j],
          inside = patternObj.inside,
          lookbehind = !!patternObj.lookbehind,
          greedy = !!patternObj.greedy,
          lookbehindLength = 0,
          alias = patternObj.alias;

        if (greedy && !patternObj.pattern.global) {
          // Without the global flag, lastIndex won't work
          var flags = patternObj.pattern
            .toString()
            .match(/[imsuy]*$/)[0];
          patternObj.pattern = RegExp(
            patternObj.pattern.source,
            flags + 'g',
          );
        }

        /** @type {RegExp} */
        var pattern = patternObj.pattern || patternObj;

        for (
          // iterate the token list and keep track of the current token/string position
          var currentNode = startNode.next, pos = startPos;
          currentNode !== tokenList.tail;
          pos += currentNode.value.length,
            currentNode = currentNode.next
        ) {
          if (rematch && pos >= rematch.reach) {
            break;
          }

          var str = currentNode.value;

          if (tokenList.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            return;
          }

          if (str instanceof Token) {
            continue;
          }

          var removeCount = 1; // this is the to parameter of removeBetween

          if (greedy && currentNode != tokenList.tail.prev) {
            pattern.lastIndex = pos;
            var match = pattern.exec(text);
            if (!match) {
              break;
            }

            var from =
              match.index +
              (lookbehind && match[1] ? match[1].length : 0);
            var to = match.index + match[0].length;
            var p = pos;

            // find the node that contains the match
            p += currentNode.value.length;
            while (from >= p) {
              currentNode = currentNode.next;
              p += currentNode.value.length;
            }
            // adjust pos (and p)
            p -= currentNode.value.length;
            pos = p;

            // the current node is a Token, then the match starts inside another Token, which is invalid
            if (currentNode.value instanceof Token) {
              continue;
            }

            // find the last node which is affected by this match
            for (
              var k = currentNode;
              k !== tokenList.tail &&
              (p < to || typeof k.value === 'string');
              k = k.next
            ) {
              removeCount++;
              p += k.value.length;
            }
            removeCount--;

            // replace with the new match
            str = text.slice(pos, p);
            match.index -= pos;
          } else {
            pattern.lastIndex = 0;

            var match = pattern.exec(str);
          }

          if (!match) {
            continue;
          }

          if (lookbehind) {
            lookbehindLength = match[1] ? match[1].length : 0;
          }

          var from = match.index + lookbehindLength,
            matchStr = match[0].slice(lookbehindLength),
            to = from + matchStr.length,
            before = str.slice(0, from),
            after = str.slice(to);

          var reach = pos + str.length;
          if (rematch && reach > rematch.reach) {
            rematch.reach = reach;
          }

          var removeFrom = currentNode.prev;

          if (before) {
            removeFrom = addAfter(tokenList, removeFrom, before);
            pos += before.length;
          }

          removeRange(tokenList, removeFrom, removeCount);

          var wrapped = new Token(
            token,
            inside ? _.tokenize(matchStr, inside) : matchStr,
            alias,
            matchStr,
          );
          currentNode = addAfter(tokenList, removeFrom, wrapped);

          if (after) {
            addAfter(tokenList, currentNode, after);
          }

          if (removeCount > 1) {
            // at least one Token object was removed, so we have to do some rematching
            // this can only happen if the current pattern is greedy
            matchGrammar(
              text,
              tokenList,
              grammar,
              currentNode.prev,
              pos,
              {
                cause: token + ',' + j,
                reach: reach,
              },
            );
          }
        }
      }
    }
  }

  /**
   * @typedef LinkedListNode
   * @property {T} value
   * @property {LinkedListNode<T> | null} prev The previous node.
   * @property {LinkedListNode<T> | null} next The next node.
   * @template T
   * @private
   */

  /**
   * @template T
   * @private
   */
  function LinkedList() {
    /** @type {LinkedListNode<T>} */
    var head = { value: null, prev: null, next: null };
    /** @type {LinkedListNode<T>} */
    var tail = { value: null, prev: head, next: null };
    head.next = tail;

    /** @type {LinkedListNode<T>} */
    this.head = head;
    /** @type {LinkedListNode<T>} */
    this.tail = tail;
    this.length = 0;
  }

  /**
   * Adds a new node with the given value to the list.
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {T} value
   * @returns {LinkedListNode<T>} The added node.
   * @template T
   */
  function addAfter(list, node, value) {
    // assumes that node != list.tail && values.length >= 0
    var next = node.next;

    var newNode = { value: value, prev: node, next: next };
    node.next = newNode;
    next.prev = newNode;
    list.length++;

    return newNode;
  }
  /**
   * Removes `count` nodes after the given node. The given node will not be removed.
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {number} count
   * @template T
   */
  function removeRange(list, node, count) {
    var next = node.next;
    for (var i = 0; i < count && next !== list.tail; i++) {
      next = next.next;
    }
    node.next = next;
    next.prev = node;
    list.length -= i;
  }
  /**
   * @param {LinkedList<T>} list
   * @returns {T[]}
   * @template T
   */
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _;
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener(
        'message',
        function (evt) {
          var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose;

          _self.postMessage(
            _.highlight(code, _.languages[lang], lang),
          );
          if (immediateClose) {
            _self.close();
          }
        },
        false,
      );
    }

    return _;
  }

  // Get current script and highlight
  var script = _.util.currentScript();

  if (script) {
    _.filename = script.src;

    if (script.hasAttribute('data-manual')) {
      _.manual = true;
    }
  }

  function highlightAutomaticallyCallback() {
    if (!_.manual) {
      _.highlightAll();
    }
  }

  if (!_.manual) {
    // If the document state is "loading", then we'll use DOMContentLoaded.
    // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    // might take longer one animation frame to execute which can create a race condition where only some plugins have
    // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    // See https://github.com/PrismJS/prism/issues/2102
    var readyState = document.readyState;
    if (
      readyState === 'loading' ||
      (readyState === 'interactive' && script && script.defer)
    ) {
      document.addEventListener(
        'DOMContentLoaded',
        highlightAutomaticallyCallback,
      );
    } else {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(highlightAutomaticallyCallback);
      } else {
        window.setTimeout(highlightAutomaticallyCallback, 16);
      }
    }
  }

  return _;
})(_self);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
  global.Prism = Prism;
}

// some additional documentation/types

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef GrammarToken
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested grammar of this token.
 *
 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
 *
 * This can be used to make nested and even recursive language definitions.
 *
 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
 * each another.
 * @global
 * @public
 */

/**
 * @typedef Grammar
 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
 * @global
 * @public
 */

/**
 * A function which will invoked after an element was successfully highlighted.
 *
 * @callback HighlightCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 * @global
 * @public
 */

/**
 * @callback HookCallback
 * @param {Object<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @global
 * @public
 */
Prism.languages.markup = {
  comment: /<!--[\s\S]*?-->/,
  prolog: /<\?[\s\S]+?\?>/,
  doctype: {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      'internal-subset': {
        pattern: /(\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null, // see below
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true,
      },
      punctuation: /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^\s>\/:]+:/,
        },
      },
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: 'attr-equals',
            },
            /"|'/,
          ],
        },
      },
      punctuation: /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          namespace: /^[^\s>\/:]+:/,
        },
      },
    },
  },
  entity: [
    {
      pattern: /&[\da-z]{1,8};/i,
      alias: 'named-entity',
    },
    /&#x?[\da-f]{1,8};/i,
  ],
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside =
  Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});

Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside['language-' + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang],
    };
    includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    var inside = {
      'included-cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside,
      },
    };
    inside['language-' + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang],
    };

    var def = {};
    def[tagName] = {
      pattern: RegExp(
        /(<__[\s\S]*?>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
          /__/g,
          function () {
            return tagName;
          },
        ),
        'i',
      ),
      lookbehind: true,
      greedy: true,
      inside: inside,
    };

    Prism.languages.insertBefore('markup', 'cdata', def);
  },
});

Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

(function (Prism) {
  var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

  Prism.languages.css = {
    comment: /\/\*[\s\S]*?\*\//,
    atrule: {
      pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
      inside: {
        rule: /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
          lookbehind: true,
          alias: 'selector',
        },
        keyword: {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true,
        },
        // See rest below
      },
    },
    url: {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp(
        '\\burl\\((?:' +
          string.source +
          '|' +
          /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
          ')\\)',
        'i',
      ),
      greedy: true,
      inside: {
        function: /^url/i,
        punctuation: /^\(|\)$/,
        string: {
          pattern: RegExp('^' + string.source + '$'),
          alias: 'url',
        },
      },
    },
    selector: RegExp(
      '[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)',
    ),
    string: {
      pattern: string,
      greedy: true,
    },
    property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    important: /!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:,]/,
  };

  Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

  var markup = Prism.languages.markup;
  if (markup) {
    markup.tag.addInlined('style', 'css');

    Prism.languages.insertBefore(
      'inside',
      'attr-value',
      {
        'style-attr': {
          pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: markup.tag.inside,
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css,
            },
          },
          alias: 'language-css',
        },
      },
      markup.tag,
    );
  }
})(Prism);

Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true,
    },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true,
  },
  'class-name': {
    pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /[.\\]/,
    },
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/,
};

Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [
    Prism.languages.clike['class-name'],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: true,
    },
  ],
  keyword: [
    {
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true,
    },
  ],
  number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
});

Prism.languages.javascript[
  'class-name'
][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

Prism.languages.insertBefore('javascript', 'keyword', {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    lookbehind: true,
    greedy: true,
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    alias: 'function',
  },
  parameter: [
    {
      pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript,
    },
    {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: Prism.languages.javascript,
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript,
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript,
    },
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
});

Prism.languages.insertBefore('javascript', 'string', {
  'template-string': {
    pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    greedy: true,
    inside: {
      'template-punctuation': {
        pattern: /^`|`$/,
        alias: 'string',
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
        lookbehind: true,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\${|}$/,
            alias: 'punctuation',
          },
          rest: Prism.languages.javascript,
        },
      },
      string: /[\s\S]+/,
    },
  },
});

if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined('script', 'javascript');
}

Prism.languages.js = Prism.languages.javascript;

Prism.languages.c = Prism.languages.extend('clike', {
  comment: {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true,
  },
  'class-name': {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+/,
    lookbehind: true,
  },
  keyword: /\b(?:__attribute__|_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
  function: /[a-z_]\w*(?=\s*\()/i,
  operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
  number: /(?:\b0x(?:[\da-f]+\.?[\da-f]*|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i,
});

Prism.languages.insertBefore('c', 'string', {
  macro: {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: true,
    greedy: true,
    alias: 'property',
    inside: {
      string: [
        {
          // highlight the path of the include statement as a string
          pattern: /^(#\s*include\s*)<[^>]+>/,
          lookbehind: true,
        },
        Prism.languages.c['string'],
      ],
      comment: Prism.languages.c['comment'],
      // highlight macro directives as keywords
      directive: {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: true,
        alias: 'keyword',
      },
      'directive-hash': /^#/,
      punctuation: /##|\\(?=[\r\n])/,
      expression: {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c,
      },
    },
  },
  // highlight predefined macros as constants
  constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/,
});

delete Prism.languages.c['boolean'];

(function (Prism) {
  var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
  var selectorInside;

  Prism.languages.css.selector = {
    pattern: Prism.languages.css.selector,
    inside: (selectorInside = {
      'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
      'pseudo-class': /:[-\w]+/,
      class: /\.[-\w]+/,
      id: /#[-\w]+/,
      attribute: {
        pattern: RegExp(
          '\\[(?:[^[\\]"\']|' + string.source + ')*\\]',
        ),
        greedy: true,
        inside: {
          punctuation: /^\[|\]$/,
          'case-sensitivity': {
            pattern: /(\s)[si]$/i,
            lookbehind: true,
            alias: 'keyword',
          },
          namespace: {
            pattern: /^(\s*)[-*\w\xA0-\uFFFF]*\|(?!=)/,
            lookbehind: true,
            inside: {
              punctuation: /\|$/,
            },
          },
          'attr-name': {
            pattern: /^(\s*)[-\w\xA0-\uFFFF]+/,
            lookbehind: true,
          },
          'attr-value': [
            string,
            {
              pattern: /(=\s*)[-\w\xA0-\uFFFF]+(?=\s*$)/,
              lookbehind: true,
            },
          ],
          operator: /[|~*^$]?=/,
        },
      },
      'n-th': [
        {
          pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
          lookbehind: true,
          inside: {
            number: /[\dn]+/,
            operator: /[+-]/,
          },
        },
        {
          pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
          lookbehind: true,
        },
      ],
      combinator: />|\+|~|\|\|/,

      // the `tag` token has been existed and removed.
      // because we can't find a perfect tokenize to match it.
      // if you want to add it, please read https://github.com/PrismJS/prism/pull/2373 first.

      punctuation: /[(),]/,
    }),
  };

  Prism.languages.css['atrule'].inside[
    'selector-function-argument'
  ].inside = selectorInside;

  Prism.languages.insertBefore('css', 'property', {
    variable: {
      pattern: /(^|[^-\w\xA0-\uFFFF])--[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*/i,
      lookbehind: true,
    },
  });

  var unit = {
    pattern: /(\b\d+)(?:%|[a-z]+\b)/,
    lookbehind: true,
  };
  // 123 -123 .123 -.123 12.3 -12.3
  var number = {
    pattern: /(^|[^\w.-])-?\d*\.?\d+/,
    lookbehind: true,
  };

  Prism.languages.insertBefore('css', 'function', {
    operator: {
      pattern: /(\s)[+\-*\/](?=\s)/,
      lookbehind: true,
    },
    // CAREFUL!
    // Previewers and Inline color use hexcode and color.
    hexcode: {
      pattern: /\B#(?:[\da-f]{1,2}){3,4}\b/i,
      alias: 'color',
    },
    color: [
      /\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i,
      {
        pattern: /\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
        inside: {
          unit: unit,
          number: number,
          function: /[\w-]+(?=\()/,
          punctuation: /[(),]/,
        },
      },
    ],
    // it's important that there is no boundary assertion after the hex digits
    entity: /\\[\da-f]{1,8}/i,
    unit: unit,
    number: number,
  });
})(Prism);

Prism.languages.glsl = Prism.languages.extend('c', {
  keyword: /\b(?:attribute|const|uniform|varying|buffer|shared|coherent|volatile|restrict|readonly|writeonly|atomic_uint|layout|centroid|flat|smooth|noperspective|patch|sample|break|continue|do|for|while|switch|case|default|if|else|subroutine|in|out|inout|float|double|int|void|bool|true|false|invariant|precise|discard|return|d?mat[234](?:x[234])?|[ibdu]?vec[234]|uint|lowp|mediump|highp|precision|[iu]?sampler[123]D|[iu]?samplerCube|sampler[12]DShadow|samplerCubeShadow|[iu]?sampler[12]DArray|sampler[12]DArrayShadow|[iu]?sampler2DRect|sampler2DRectShadow|[iu]?samplerBuffer|[iu]?sampler2DMS(?:Array)?|[iu]?samplerCubeArray|samplerCubeArrayShadow|[iu]?image[123]D|[iu]?image2DRect|[iu]?imageCube|[iu]?imageBuffer|[iu]?image[12]DArray|[iu]?imageCubeArray|[iu]?image2DMS(?:Array)?|struct|common|partition|active|asm|class|union|enum|typedef|template|this|resource|goto|inline|noinline|public|static|extern|external|interface|long|short|half|fixed|unsigned|superp|input|output|hvec[234]|fvec[234]|sampler3DRect|filter|sizeof|cast|namespace|using)\b/,
});

(function (Prism) {
  Prism.languages.insertBefore('javascript', 'function-variable', {
    'method-variable': {
      pattern: RegExp(
        '(\\.\\s*)' +
          Prism.languages.javascript['function-variable'].pattern
            .source,
      ),
      lookbehind: true,
      alias: [
        'function-variable',
        'method',
        'function',
        'property-access',
      ],
    },
  });

  Prism.languages.insertBefore('javascript', 'function', {
    method: {
      pattern: RegExp(
        '(\\.\\s*)' + Prism.languages.javascript['function'].source,
      ),
      lookbehind: true,
      alias: ['function', 'property-access'],
    },
  });

  Prism.languages.insertBefore('javascript', 'constant', {
    'known-class-name': [
      {
        // standard built-ins
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        pattern: /\b(?:(?:(?:Uint|Int)(?:8|16|32)|Uint8Clamped|Float(?:32|64))?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|(?:Weak)?(?:Set|Map)|WebAssembly)\b/,
        alias: 'class-name',
      },
      {
        // errors
        pattern: /\b(?:[A-Z]\w*)Error\b/,
        alias: 'class-name',
      },
    ],
  });

  Prism.languages.javascript['keyword'].unshift(
    {
      pattern: /\b(?:as|default|export|from|import)\b/,
      alias: 'module',
    },
    {
      pattern: /\bnull\b/,
      alias: ['null', 'nil'],
    },
    {
      pattern: /\bundefined\b/,
      alias: 'nil',
    },
  );

  Prism.languages.insertBefore('javascript', 'operator', {
    spread: {
      pattern: /\.{3}/,
      alias: 'operator',
    },
    arrow: {
      pattern: /=>/,
      alias: 'operator',
    },
  });

  Prism.languages.insertBefore('javascript', 'punctuation', {
    'property-access': {
      pattern: /(\.\s*)#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*/,
      lookbehind: true,
    },
    'maybe-class-name': {
      pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
      lookbehind: true,
    },
    dom: {
      // this contains only a few commonly used DOM variables
      pattern: /\b(?:document|location|navigator|performance|(?:local|session)Storage|window)\b/,
      alias: 'variable',
    },
    console: {
      pattern: /\bconsole(?=\s*\.)/,
      alias: 'class-name',
    },
  });

  // add 'maybe-class-name' to tokens which might be a class name
  var maybeClassNameTokens = [
    'function',
    'function-variable',
    'method',
    'method-variable',
    'property-access',
  ];

  for (var i = 0; i < maybeClassNameTokens.length; i++) {
    var token = maybeClassNameTokens[i];
    var value = Prism.languages.javascript[token];

    // convert regex to object
    if (Prism.util.type(value) === 'RegExp') {
      value = Prism.languages.javascript[token] = {
        pattern: value,
      };
    }

    // keep in mind that we don't support arrays

    var inside = value.inside || {};
    value.inside = inside;

    inside['maybe-class-name'] = /^[A-Z][\s\S]*/;
  }
})(Prism);

(function (Prism) {
  var templateString = Prism.languages.javascript['template-string'];

  // see the pattern in prism-javascript.js
  var templateLiteralPattern = templateString.pattern.source;
  var interpolationObject = templateString.inside['interpolation'];
  var interpolationPunctuationObject =
    interpolationObject.inside['interpolation-punctuation'];
  var interpolationPattern = interpolationObject.pattern.source;

  /**
   * Creates a new pattern to match a template string with a special tag.
   *
   * This will return `undefined` if there is no grammar with the given language id.
   *
   * @param {string} language The language id of the embedded language. E.g. `markdown`.
   * @param {string} tag The regex pattern to match the tag.
   * @returns {object | undefined}
   * @example
   * createTemplate('css', /\bcss/.source);
   */
  function createTemplate(language, tag) {
    if (!Prism.languages[language]) {
      return undefined;
    }

    return {
      pattern: RegExp(
        '((?:' + tag + ')\\s*)' + templateLiteralPattern,
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        'template-punctuation': {
          pattern: /^`|`$/,
          alias: 'string',
        },
        'embedded-code': {
          pattern: /[\s\S]+/,
          alias: language,
        },
      },
    };
  }

  Prism.languages.javascript['template-string'] = [
    // styled-jsx:
    //   css`a { color: #25F; }`
    // styled-components:
    //   styled.h1`color: red;`
    createTemplate(
      'css',
      /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
        .source,
    ),

    // html`<p></p>`
    // div.innerHTML = `<p></p>`
    createTemplate(
      'html',
      /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source,
    ),

    // svg`<path fill="#fff" d="M55.37 ..."/>`
    createTemplate('svg', /\bsvg/.source),

    // md`# h1`, markdown`## h2`
    createTemplate('markdown', /\b(?:md|markdown)/.source),

    // gql`...`, graphql`...`, graphql.experimental`...`
    createTemplate(
      'graphql',
      /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source,
    ),

    // vanilla template string
    templateString,
  ].filter(Boolean);

  /**
   * Returns a specific placeholder literal for the given language.
   *
   * @param {number} counter
   * @param {string} language
   * @returns {string}
   */
  function getPlaceholder(counter, language) {
    return '___' + language.toUpperCase() + '_' + counter + '___';
  }

  /**
   * Returns the tokens of `Prism.tokenize` but also runs the `before-tokenize` and `after-tokenize` hooks.
   *
   * @param {string} code
   * @param {any} grammar
   * @param {string} language
   * @returns {(string|Token)[]}
   */
  function tokenizeWithHooks(code, grammar, language) {
    var env = {
      code: code,
      grammar: grammar,
      language: language,
    };
    Prism.hooks.run('before-tokenize', env);
    env.tokens = Prism.tokenize(env.code, env.grammar);
    Prism.hooks.run('after-tokenize', env);
    return env.tokens;
  }

  /**
   * Returns the token of the given JavaScript interpolation expression.
   *
   * @param {string} expression The code of the expression. E.g. `"${42}"`
   * @returns {Token}
   */
  function tokenizeInterpolationExpression(expression) {
    var tempGrammar = {};
    tempGrammar[
      'interpolation-punctuation'
    ] = interpolationPunctuationObject;

    /** @type {Array} */
    var tokens = Prism.tokenize(expression, tempGrammar);
    if (tokens.length === 3) {
      /**
       * The token array will look like this
       * [
       *     ["interpolation-punctuation", "${"]
       *     "..." // JavaScript expression of the interpolation
       *     ["interpolation-punctuation", "}"]
       * ]
       */

      var args = [1, 1];
      args.push.apply(
        args,
        tokenizeWithHooks(
          tokens[1],
          Prism.languages.javascript,
          'javascript',
        ),
      );

      tokens.splice.apply(tokens, args);
    }

    return new Prism.Token(
      'interpolation',
      tokens,
      interpolationObject.alias,
      expression,
    );
  }

  /**
   * Tokenizes the given code with support for JavaScript interpolation expressions mixed in.
   *
   * This function has 3 phases:
   *
   * 1. Replace all JavaScript interpolation expression with a placeholder.
   *    The placeholder will have the syntax of a identify of the target language.
   * 2. Tokenize the code with placeholders.
   * 3. Tokenize the interpolation expressions and re-insert them into the tokenize code.
   *    The insertion only works if a placeholder hasn't been "ripped apart" meaning that the placeholder has been
   *    tokenized as two tokens by the grammar of the embedded language.
   *
   * @param {string} code
   * @param {object} grammar
   * @param {string} language
   * @returns {Token}
   */
  function tokenizeEmbedded(code, grammar, language) {
    // 1. First filter out all interpolations

    // because they might be escaped, we need a lookbehind, so we use Prism
    /** @type {(Token|string)[]} */
    var _tokens = Prism.tokenize(code, {
      interpolation: {
        pattern: RegExp(interpolationPattern),
        lookbehind: true,
      },
    });

    // replace all interpolations with a placeholder which is not in the code already
    var placeholderCounter = 0;
    /** @type {Object<string, string>} */
    var placeholderMap = {};
    var embeddedCode = _tokens
      .map(function (token) {
        if (typeof token === 'string') {
          return token;
        } else {
          var interpolationExpression = token.content;

          var placeholder;
          while (
            code.indexOf(
              (placeholder = getPlaceholder(
                placeholderCounter++,
                language,
              )),
            ) !== -1
          ) {}
          placeholderMap[placeholder] = interpolationExpression;
          return placeholder;
        }
      })
      .join('');

    // 2. Tokenize the embedded code

    var embeddedTokens = tokenizeWithHooks(
      embeddedCode,
      grammar,
      language,
    );

    // 3. Re-insert the interpolation

    var placeholders = Object.keys(placeholderMap);
    placeholderCounter = 0;

    /**
     *
     * @param {(Token|string)[]} tokens
     * @returns {void}
     */
    function walkTokens(tokens) {
      for (var i = 0; i < tokens.length; i++) {
        if (placeholderCounter >= placeholders.length) {
          return;
        }

        var token = tokens[i];

        if (
          typeof token === 'string' ||
          typeof token.content === 'string'
        ) {
          var placeholder = placeholders[placeholderCounter];
          var s =
            typeof token === 'string'
              ? token
              : /** @type {string} */ (token.content);

          var index = s.indexOf(placeholder);
          if (index !== -1) {
            ++placeholderCounter;

            var before = s.substring(0, index);
            var middle = tokenizeInterpolationExpression(
              placeholderMap[placeholder],
            );
            var after = s.substring(index + placeholder.length);

            var replacement = [];
            if (before) {
              replacement.push(before);
            }
            replacement.push(middle);
            if (after) {
              var afterTokens = [after];
              walkTokens(afterTokens);
              replacement.push.apply(replacement, afterTokens);
            }

            if (typeof token === 'string') {
              tokens.splice.apply(tokens, [i, 1].concat(replacement));
              i += replacement.length - 1;
            } else {
              token.content = replacement;
            }
          }
        } else {
          var content = token.content;
          if (Array.isArray(content)) {
            walkTokens(content);
          } else {
            walkTokens([content]);
          }
        }
      }
    }
    walkTokens(embeddedTokens);

    return new Prism.Token(
      language,
      embeddedTokens,
      'language-' + language,
      code,
    );
  }

  /**
   * The languages for which JS templating will handle tagged template literals.
   *
   * JS templating isn't active for only JavaScript but also related languages like TypeScript, JSX, and TSX.
   */
  var supportedLanguages = {
    javascript: true,
    js: true,
    typescript: true,
    ts: true,
    jsx: true,
    tsx: true,
  };
  Prism.hooks.add('after-tokenize', function (env) {
    if (!(env.language in supportedLanguages)) {
      return;
    }

    /**
     * Finds and tokenizes all template strings with an embedded languages.
     *
     * @param {(Token | string)[]} tokens
     * @returns {void}
     */
    function findTemplateStrings(tokens) {
      for (var i = 0, l = tokens.length; i < l; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          continue;
        }

        var content = token.content;
        if (!Array.isArray(content)) {
          if (typeof content !== 'string') {
            findTemplateStrings([content]);
          }
          continue;
        }

        if (token.type === 'template-string') {
          /**
           * A JavaScript template-string token will look like this:
           *
           * ["template-string", [
           *     ["template-punctuation", "`"],
           *     (
           *         An array of "string" and "interpolation" tokens. This is the simple string case.
           *         or
           *         ["embedded-code", "..."] This is the token containing the embedded code.
           *                                  It also has an alias which is the language of the embedded code.
           *     ),
           *     ["template-punctuation", "`"]
           * ]]
           */

          var embedded = content[1];
          if (
            content.length === 3 &&
            typeof embedded !== 'string' &&
            embedded.type === 'embedded-code'
          ) {
            // get string content
            var code = stringContent(embedded);

            var alias = embedded.alias;
            var language = Array.isArray(alias) ? alias[0] : alias;

            var grammar = Prism.languages[language];
            if (!grammar) {
              // the embedded language isn't registered.
              continue;
            }

            content[1] = tokenizeEmbedded(code, grammar, language);
          }
        } else {
          findTemplateStrings(content);
        }
      }
    }

    findTemplateStrings(env.tokens);
  });

  /**
   * Returns the string content of a token or token stream.
   *
   * @param {string | Token | (string | Token)[]} value
   * @returns {string}
   */
  function stringContent(value) {
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.map(stringContent).join('');
    } else {
      return stringContent(value.content);
    }
  }
})(Prism);

(function () {
  if (
    typeof self === 'undefined' ||
    !self.Prism ||
    !self.document ||
    !document.querySelector
  ) {
    return;
  }

  /**
   * @param {string} selector
   * @param {ParentNode} [container]
   * @returns {HTMLElement[]}
   */
  function $$(selector, container) {
    return Array.prototype.slice.call(
      (container || document).querySelectorAll(selector),
    );
  }

  /**
   * Returns whether the given element has the given class.
   *
   * @param {Element} element
   * @param {string} className
   * @returns {boolean}
   */
  function hasClass(element, className) {
    className = ' ' + className + ' ';
    return (
      (' ' + element.className + ' ')
        .replace(/[\n\t]/g, ' ')
        .indexOf(className) > -1
    );
  }

  /**
   * Calls the given function.
   *
   * @param {() => any} func
   * @returns {void}
   */
  function callFunction(func) {
    func();
  }

  // Some browsers round the line-height, others don't.
  // We need to test for it to position the elements properly.
  var isLineHeightRounded = (function () {
    var res;
    return function () {
      if (typeof res === 'undefined') {
        var d = document.createElement('div');
        d.style.fontSize = '13px';
        d.style.lineHeight = '1.5';
        d.style.padding = '0';
        d.style.border = '0';
        d.innerHTML = '&nbsp;<br />&nbsp;';
        document.body.appendChild(d);
        // Browsers that round the line-height should have offsetHeight === 38
        // The others should have 39.
        res = d.offsetHeight === 38;
        document.body.removeChild(d);
      }
      return res;
    };
  })();

  /**
   * Highlights the lines of the given pre.
   *
   * This function is split into a DOM measuring and mutate phase to improve performance.
   * The returned function mutates the DOM when called.
   *
   * @param {HTMLElement} pre
   * @param {string} [lines]
   * @param {string} [classes='']
   * @returns {() => void}
   */
  function highlightLines(pre, lines, classes) {
    lines =
      typeof lines === 'string'
        ? lines
        : pre.getAttribute('data-line');

    var ranges = lines.replace(/\s+/g, '').split(',').filter(Boolean);
    var offset = +pre.getAttribute('data-line-offset') || 0;

    var parseMethod = isLineHeightRounded() ? parseInt : parseFloat;
    var lineHeight = parseMethod(getComputedStyle(pre).lineHeight);
    var hasLineNumbers = hasClass(pre, 'line-numbers');
    var parentElement = hasLineNumbers
      ? pre
      : pre.querySelector('code') || pre;
    var mutateActions = /** @type {(() => void)[]} */ ([]);

    ranges.forEach(function (currentRange) {
      var range = currentRange.split('-');

      var start = +range[0];
      var end = +range[1] || start;

      /** @type {HTMLElement} */
      var line =
        pre.querySelector(
          '.line-highlight[data-range="' + currentRange + '"]',
        ) || document.createElement('div');

      mutateActions.push(function () {
        line.setAttribute('aria-hidden', 'true');
        line.setAttribute('data-range', currentRange);
        line.className = (classes || '') + ' line-highlight';
      });

      // if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers
      if (hasLineNumbers && Prism.plugins.lineNumbers) {
        var startNode = Prism.plugins.lineNumbers.getLine(pre, start);
        var endNode = Prism.plugins.lineNumbers.getLine(pre, end);

        if (startNode) {
          var top = startNode.offsetTop + 'px';
          mutateActions.push(function () {
            line.style.top = top;
          });
        }

        if (endNode) {
          var height =
            endNode.offsetTop -
            startNode.offsetTop +
            endNode.offsetHeight +
            'px';
          mutateActions.push(function () {
            line.style.height = height;
          });
        }
      } else {
        mutateActions.push(function () {
          line.setAttribute('data-start', start);

          if (end > start) {
            line.setAttribute('data-end', end);
          }

          line.style.top = (start - offset - 1) * lineHeight + 'px';

          line.textContent = new Array(end - start + 2).join(' \n');
        });
      }

      mutateActions.push(function () {
        // allow this to play nicely with the line-numbers plugin
        // need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
        parentElement.appendChild(line);
      });
    });

    var id = pre.id;
    if (hasLineNumbers && id) {
      // This implements linkable line numbers. Linkable line numbers use Line Highlight to create a link to a
      // specific line. For this to work, the pre element has to:
      //  1) have line numbers,
      //  2) have the `linkable-line-numbers` class or an ascendant that has that class, and
      //  3) have an id.

      var linkableLineNumbersClass = 'linkable-line-numbers';
      var linkableLineNumbers = false;
      var node = pre;
      while (node) {
        if (hasClass(node, linkableLineNumbersClass)) {
          linkableLineNumbers = true;
          break;
        }
        node = node.parentElement;
      }

      if (linkableLineNumbers) {
        if (!hasClass(pre, linkableLineNumbersClass)) {
          // add class to pre
          mutateActions.push(function () {
            pre.className = (
              pre.className +
              ' ' +
              linkableLineNumbersClass
            ).trim();
          });
        }

        var start = parseInt(pre.getAttribute('data-start') || '1');

        // iterate all line number spans
        $$('.line-numbers-rows > span', pre).forEach(function (
          lineSpan,
          i,
        ) {
          var lineNumber = i + start;
          lineSpan.onclick = function () {
            var hash = id + '.' + lineNumber;

            // this will prevent scrolling since the span is obviously in view
            scrollIntoView = false;
            location.hash = hash;
            setTimeout(function () {
              scrollIntoView = true;
            }, 1);
          };
        });
      }
    }

    return function () {
      mutateActions.forEach(callFunction);
    };
  }

  var scrollIntoView = true;
  function applyHash() {
    var hash = location.hash.slice(1);

    // Remove pre-existing temporary lines
    $$('.temporary.line-highlight').forEach(function (line) {
      line.parentNode.removeChild(line);
    });

    var range = (hash.match(/\.([\d,-]+)$/) || [, ''])[1];

    if (!range || document.getElementById(hash)) {
      return;
    }

    var id = hash.slice(0, hash.lastIndexOf('.')),
      pre = document.getElementById(id);

    if (!pre) {
      return;
    }

    if (!pre.hasAttribute('data-line')) {
      pre.setAttribute('data-line', '');
    }

    var mutateDom = highlightLines(pre, range, 'temporary ');
    mutateDom();

    if (scrollIntoView) {
      document
        .querySelector('.temporary.line-highlight')
        .scrollIntoView();
    }
  }

  var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

  Prism.hooks.add('before-sanity-check', function (env) {
    var pre = env.element.parentNode;
    var lines = pre && pre.getAttribute('data-line');

    if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
      return;
    }

    /*
     * Cleanup for other plugins (e.g. autoloader).
     *
     * Sometimes <code> blocks are highlighted multiple times. It is necessary
     * to cleanup any left-over tags, because the whitespace inside of the <div>
     * tags change the content of the <code> tag.
     */
    var num = 0;
    $$('.line-highlight', pre).forEach(function (line) {
      num += line.textContent.length;
      line.parentNode.removeChild(line);
    });
    // Remove extra whitespace
    if (num && /^( \n)+$/.test(env.code.slice(-num))) {
      env.code = env.code.slice(0, -num);
    }
  });

  Prism.hooks.add('complete', function completeHook(env) {
    var pre = env.element.parentNode;
    var lines = pre && pre.getAttribute('data-line');

    if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
      return;
    }

    clearTimeout(fakeTimer);

    var hasLineNumbers = Prism.plugins.lineNumbers;
    var isLineNumbersLoaded = env.plugins && env.plugins.lineNumbers;

    if (
      hasClass(pre, 'line-numbers') &&
      hasLineNumbers &&
      !isLineNumbersLoaded
    ) {
      Prism.hooks.add('line-numbers', completeHook);
    } else {
      var mutateDom = highlightLines(pre, lines);
      mutateDom();
      fakeTimer = setTimeout(applyHash, 1);
    }
  });

  window.addEventListener('hashchange', applyHash);
  window.addEventListener('resize', function () {
    var actions = $$('pre[data-line]').map(function (pre) {
      return highlightLines(pre);
    });
    actions.forEach(callFunction);
  });
})();

(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  /**
   * Plugin name which is used as a class name for <pre> which is activating the plugin
   * @type {String}
   */
  var PLUGIN_NAME = 'line-numbers';

  /**
   * Regular expression used for determining line breaks
   * @type {RegExp}
   */
  var NEW_LINE_EXP = /\n(?!$)/g;

  /**
   * Global exports
   */
  var config = (Prism.plugins.lineNumbers = {
    /**
     * Get node for provided line number
     * @param {Element} element pre element
     * @param {Number} number line number
     * @return {Element|undefined}
     */
    getLine: function (element, number) {
      if (
        element.tagName !== 'PRE' ||
        !element.classList.contains(PLUGIN_NAME)
      ) {
        return;
      }

      var lineNumberRows = element.querySelector(
        '.line-numbers-rows',
      );
      var lineNumberStart =
        parseInt(element.getAttribute('data-start'), 10) || 1;
      var lineNumberEnd =
        lineNumberStart + (lineNumberRows.children.length - 1);

      if (number < lineNumberStart) {
        number = lineNumberStart;
      }
      if (number > lineNumberEnd) {
        number = lineNumberEnd;
      }

      var lineIndex = number - lineNumberStart;

      return lineNumberRows.children[lineIndex];
    },

    /**
     * Resizes the line numbers of the given element.
     *
     * This function will not add line numbers. It will only resize existing ones.
     * @param {HTMLElement} element A `<pre>` element with line numbers.
     * @returns {void}
     */
    resize: function (element) {
      resizeElements([element]);
    },

    /**
     * Whether the plugin can assume that the units font sizes and margins are not depended on the size of
     * the current viewport.
     *
     * Setting this to `true` will allow the plugin to do certain optimizations for better performance.
     *
     * Set this to `false` if you use any of the following CSS units: `vh`, `vw`, `vmin`, `vmax`.
     *
     * @type {boolean}
     */
    assumeViewportIndependence: true,
  });

  /**
   * Resizes the given elements.
   *
   * @param {HTMLElement[]} elements
   */
  function resizeElements(elements) {
    elements = elements.filter(function (e) {
      var codeStyles = getStyles(e);
      var whiteSpace = codeStyles['white-space'];
      return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
    });

    if (elements.length == 0) {
      return;
    }

    var infos = elements
      .map(function (element) {
        var codeElement = element.querySelector('code');
        var lineNumbersWrapper = element.querySelector(
          '.line-numbers-rows',
        );
        if (!codeElement || !lineNumbersWrapper) {
          return undefined;
        }

        /** @type {HTMLElement} */
        var lineNumberSizer = element.querySelector(
          '.line-numbers-sizer',
        );
        var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

        if (!lineNumberSizer) {
          lineNumberSizer = document.createElement('span');
          lineNumberSizer.className = 'line-numbers-sizer';

          codeElement.appendChild(lineNumberSizer);
        }

        lineNumberSizer.innerHTML = '0';
        lineNumberSizer.style.display = 'block';

        var oneLinerHeight = lineNumberSizer.getBoundingClientRect()
          .height;
        lineNumberSizer.innerHTML = '';

        return {
          element: element,
          lines: codeLines,
          lineHeights: [],
          oneLinerHeight: oneLinerHeight,
          sizer: lineNumberSizer,
        };
      })
      .filter(Boolean);

    infos.forEach(function (info) {
      var lineNumberSizer = info.sizer;
      var lines = info.lines;
      var lineHeights = info.lineHeights;
      var oneLinerHeight = info.oneLinerHeight;

      lineHeights[lines.length - 1] = undefined;
      lines.forEach(function (line, index) {
        if (line && line.length > 1) {
          var e = lineNumberSizer.appendChild(
            document.createElement('span'),
          );
          e.style.display = 'block';
          e.textContent = line;
        } else {
          lineHeights[index] = oneLinerHeight;
        }
      });
    });

    infos.forEach(function (info) {
      var lineNumberSizer = info.sizer;
      var lineHeights = info.lineHeights;

      var childIndex = 0;
      for (var i = 0; i < lineHeights.length; i++) {
        if (lineHeights[i] === undefined) {
          lineHeights[i] = lineNumberSizer.children[
            childIndex++
          ].getBoundingClientRect().height;
        }
      }
    });

    infos.forEach(function (info) {
      var lineNumberSizer = info.sizer;
      var wrapper = info.element.querySelector('.line-numbers-rows');

      lineNumberSizer.style.display = 'none';
      lineNumberSizer.innerHTML = '';

      info.lineHeights.forEach(function (height, lineNumber) {
        wrapper.children[lineNumber].style.height = height + 'px';
      });
    });
  }

  /**
   * Returns style declarations for the element
   * @param {Element} element
   */
  var getStyles = function (element) {
    if (!element) {
      return null;
    }

    return window.getComputedStyle
      ? getComputedStyle(element)
      : element.currentStyle || null;
  };

  var lastWidth = undefined;
  window.addEventListener('resize', function () {
    if (
      config.assumeViewportIndependence &&
      lastWidth === window.innerWidth
    ) {
      return;
    }
    lastWidth = window.innerWidth;

    resizeElements(
      Array.prototype.slice.call(
        document.querySelectorAll('pre.' + PLUGIN_NAME),
      ),
    );
  });

  Prism.hooks.add('complete', function (env) {
    if (!env.code) {
      return;
    }

    var code = /** @type {Element} */ (env.element);
    var pre = /** @type {HTMLElement} */ (code.parentNode);

    // works only for <code> wrapped inside <pre> (not inline)
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    // Abort if line numbers already exists
    if (code.querySelector('.line-numbers-rows')) {
      return;
    }

    // only add line numbers if <code> or one of its ancestors has the `line-numbers` class
    if (!Prism.util.isActive(code, PLUGIN_NAME)) {
      return;
    }

    // Remove the class 'line-numbers' from the <code>
    code.classList.remove(PLUGIN_NAME);
    // Add the class 'line-numbers' to the <pre>
    pre.classList.add(PLUGIN_NAME);

    var match = env.code.match(NEW_LINE_EXP);
    var linesNum = match ? match.length + 1 : 1;
    var lineNumbersWrapper;

    var lines = new Array(linesNum + 1).join('<span></span>');

    lineNumbersWrapper = document.createElement('span');
    lineNumbersWrapper.setAttribute('aria-hidden', 'true');
    lineNumbersWrapper.className = 'line-numbers-rows';
    lineNumbersWrapper.innerHTML = lines;

    if (pre.hasAttribute('data-start')) {
      pre.style.counterReset =
        'linenumber ' +
        (parseInt(pre.getAttribute('data-start'), 10) - 1);
    }

    env.element.appendChild(lineNumbersWrapper);

    resizeElements([pre]);

    Prism.hooks.run('line-numbers', env);
  });

  Prism.hooks.add('line-numbers', function (env) {
    env.plugins = env.plugins || {};
    env.plugins.lineNumbers = true;
  });
})();

(function () {
  if (
    (typeof self !== 'undefined' && !self.Prism) ||
    (typeof global !== 'undefined' && !global.Prism)
  ) {
    return;
  }

  if (Prism.languages.css) {
    // check whether the selector is an advanced pattern before extending it
    if (Prism.languages.css.selector.pattern) {
      Prism.languages.css.selector.inside['pseudo-class'] = /:[\w-]+/;
      Prism.languages.css.selector.inside[
        'pseudo-element'
      ] = /::[\w-]+/;
    } else {
      Prism.languages.css.selector = {
        pattern: Prism.languages.css.selector,
        inside: {
          'pseudo-class': /:[\w-]+/,
          'pseudo-element': /::[\w-]+/,
        },
      };
    }
  }

  if (Prism.languages.markup) {
    Prism.languages.markup.tag.inside.tag.inside['tag-id'] = /[\w-]+/;

    var Tags = {
      HTML: {
        a: 1,
        abbr: 1,
        acronym: 1,
        b: 1,
        basefont: 1,
        bdo: 1,
        big: 1,
        blink: 1,
        cite: 1,
        code: 1,
        dfn: 1,
        em: 1,
        kbd: 1,
        i: 1,
        rp: 1,
        rt: 1,
        ruby: 1,
        s: 1,
        samp: 1,
        small: 1,
        spacer: 1,
        strike: 1,
        strong: 1,
        sub: 1,
        sup: 1,
        time: 1,
        tt: 1,
        u: 1,
        var: 1,
        wbr: 1,
        noframes: 1,
        summary: 1,
        command: 1,
        dt: 1,
        dd: 1,
        figure: 1,
        figcaption: 1,
        center: 1,
        section: 1,
        nav: 1,
        article: 1,
        aside: 1,
        hgroup: 1,
        header: 1,
        footer: 1,
        address: 1,
        noscript: 1,
        isIndex: 1,
        main: 1,
        mark: 1,
        marquee: 1,
        meter: 1,
        menu: 1,
      },
      SVG: {
        animateColor: 1,
        animateMotion: 1,
        animateTransform: 1,
        glyph: 1,
        feBlend: 1,
        feColorMatrix: 1,
        feComponentTransfer: 1,
        feFuncR: 1,
        feFuncG: 1,
        feFuncB: 1,
        feFuncA: 1,
        feComposite: 1,
        feConvolveMatrix: 1,
        feDiffuseLighting: 1,
        feDisplacementMap: 1,
        feFlood: 1,
        feGaussianBlur: 1,
        feImage: 1,
        feMerge: 1,
        feMergeNode: 1,
        feMorphology: 1,
        feOffset: 1,
        feSpecularLighting: 1,
        feTile: 1,
        feTurbulence: 1,
        feDistantLight: 1,
        fePointLight: 1,
        feSpotLight: 1,
        linearGradient: 1,
        radialGradient: 1,
        altGlyph: 1,
        textPath: 1,
        tref: 1,
        altglyph: 1,
        textpath: 1,
        altglyphdef: 1,
        altglyphitem: 1,
        clipPath: 1,
        'color-profile': 1,
        cursor: 1,
        'font-face': 1,
        'font-face-format': 1,
        'font-face-name': 1,
        'font-face-src': 1,
        'font-face-uri': 1,
        foreignObject: 1,
        glyphRef: 1,
        hkern: 1,
        vkern: 1,
      },
      MathML: {},
    };
  }

  var language;

  Prism.hooks.add('wrap', function (env) {
    if (
      (env.type == 'tag-id' ||
        (env.type == 'property' && env.content.indexOf('-') != 0) ||
        (env.type == 'rule' && env.content.indexOf('@-') != 0) ||
        (env.type == 'pseudo-class' &&
          env.content.indexOf(':-') != 0) ||
        (env.type == 'pseudo-element' &&
          env.content.indexOf('::-') != 0) ||
        (env.type == 'attr-name' &&
          env.content.indexOf('data-') != 0)) &&
      env.content.indexOf('<') === -1
    ) {
      if (
        env.language == 'css' ||
        env.language == 'scss' ||
        env.language == 'markup'
      ) {
        var href = 'https://webplatform.github.io/docs/';
        var content = env.content;

        if (env.language == 'css' || env.language == 'scss') {
          href += 'css/';

          if (env.type == 'property') {
            href += 'properties/';
          } else if (env.type == 'rule') {
            href += 'atrules/';
            content = content.substring(1);
          } else if (env.type == 'pseudo-class') {
            href += 'selectors/pseudo-classes/';
            content = content.substring(1);
          } else if (env.type == 'pseudo-element') {
            href += 'selectors/pseudo-elements/';
            content = content.substring(2);
          }
        } else if (env.language == 'markup') {
          if (env.type == 'tag-id') {
            // Check language
            language = getLanguage(env.content) || language;

            if (language) {
              href += language + '/elements/';
            } else {
              return; // Abort
            }
          } else if (env.type == 'attr-name') {
            if (language) {
              href += language + '/attributes/';
            } else {
              return; // Abort
            }
          }
        }

        href += content;
        env.tag = 'a';
        env.attributes.href = href;
        env.attributes.target = '_blank';
      }
    }
  });

  function getLanguage(tag) {
    var tagL = tag.toLowerCase();

    if (Tags.HTML[tagL]) {
      return 'html';
    } else if (Tags.SVG[tag]) {
      return 'svg';
    } else if (Tags.MathML[tag]) {
      return 'mathml';
    }

    // Not in dictionary, perform check
    if (Tags.HTML[tagL] !== 0 && typeof document !== 'undefined') {
      var htmlInterface = (document
        .createElement(tag)
        .toString()
        .match(/\[object HTML(.+)Element\]/) || [])[1];

      if (htmlInterface && htmlInterface != 'Unknown') {
        Tags.HTML[tagL] = 1;
        return 'html';
      }
    }

    Tags.HTML[tagL] = 0;

    if (Tags.SVG[tag] !== 0 && typeof document !== 'undefined') {
      var svgInterface = (document
        .createElementNS('http://www.w3.org/2000/svg', tag)
        .toString()
        .match(/\[object SVG(.+)Element\]/) || [])[1];

      if (svgInterface && svgInterface != 'Unknown') {
        Tags.SVG[tag] = 1;
        return 'svg';
      }
    }

    Tags.SVG[tag] = 0;

    // Lame way to detect MathML, but browsers don’t expose interface names there :(
    if (Tags.MathML[tag] !== 0) {
      if (tag.indexOf('m') === 0) {
        Tags.MathML[tag] = 1;
        return 'mathml';
      }
    }

    Tags.MathML[tag] = 0;

    return null;
  }
})();
(function () {
  if (
    typeof self === 'undefined' ||
    typeof Prism === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return;
  }

  // Copied from the markup language definition
  var HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/g;

  // a regex to validate hexadecimal colors
  var HEX_COLOR = /^#?((?:[\da-f]){3,4}|(?:[\da-f]{2}){3,4})$/i;

  /**
   * Parses the given hexadecimal representation and returns the parsed RGBA color.
   *
   * If the format of the given string is invalid, `undefined` will be returned.
   * Valid formats are: `RGB`, `RGBA`, `RRGGBB`, and `RRGGBBAA`.
   *
   * Hexadecimal colors are parsed because they are not fully supported by older browsers, so converting them to
   * `rgba` functions improves browser compatibility.
   *
   * @param {string} hex
   * @returns {string | undefined}
   */
  function parseHexColor(hex) {
    var match = HEX_COLOR.exec(hex);
    if (!match) {
      return undefined;
    }
    hex = match[1]; // removes the leading "#"

    // the width and number of channels
    var channelWidth = hex.length >= 6 ? 2 : 1;
    var channelCount = hex.length / channelWidth;

    // the scale used to normalize 4bit and 8bit values
    var scale = channelWidth == 1 ? 1 / 15 : 1 / 255;

    // normalized RGBA channels
    var channels = [];
    for (var i = 0; i < channelCount; i++) {
      var int = parseInt(
        hex.substr(i * channelWidth, channelWidth),
        16,
      );
      channels.push(int * scale);
    }
    if (channelCount == 3) {
      channels.push(1); // add alpha of 100%
    }

    // output
    var rgb = channels
      .slice(0, 3)
      .map(function (x) {
        return String(Math.round(x * 255));
      })
      .join(',');
    var alpha = String(Number(channels[3].toFixed(3))); // easy way to round 3 decimal places

    return 'rgba(' + rgb + ',' + alpha + ')';
  }

  /**
   * Validates the given Color using the current browser's internal implementation.
   *
   * @param {string} color
   * @returns {string | undefined}
   */
  function validateColor(color) {
    var s = new Option().style;
    s.color = color;
    return s.color ? color : undefined;
  }

  /**
   * An array of function which parse a given string representation of a color.
   *
   * These parser serve as validators and as a layer of compatibility to support color formats which the browser
   * might not support natively.
   *
   * @type {((value: string) => (string|undefined))[]}
   */
  var parsers = [parseHexColor, validateColor];

  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'color' || env.classes.indexOf('color') >= 0) {
      var content = env.content;

      // remove all HTML tags inside
      var rawText = content.split(HTML_TAG).join('');

      var color;
      for (var i = 0, l = parsers.length; i < l && !color; i++) {
        color = parsers[i](rawText);
      }

      if (!color) {
        return;
      }

      var previewElement =
        '<span class="inline-color-wrapper"><span class="inline-color" style="background-color:' +
        color +
        ';"></span></span>';
      env.content = previewElement + content;
    }
  });
})();

(function () {
  var assign =
    Object.assign ||
    function (obj1, obj2) {
      for (var name in obj2) {
        if (obj2.hasOwnProperty(name)) obj1[name] = obj2[name];
      }
      return obj1;
    };

  function NormalizeWhitespace(defaults) {
    this.defaults = assign({}, defaults);
  }

  function toCamelCase(value) {
    return value.replace(/-(\w)/g, function (match, firstChar) {
      return firstChar.toUpperCase();
    });
  }

  function tabLen(str) {
    var res = 0;
    for (var i = 0; i < str.length; ++i) {
      if (str.charCodeAt(i) == '\t'.charCodeAt(0)) res += 3;
    }
    return str.length + res;
  }

  NormalizeWhitespace.prototype = {
    setDefaults: function (defaults) {
      this.defaults = assign(this.defaults, defaults);
    },
    normalize: function (input, settings) {
      settings = assign(this.defaults, settings);

      for (var name in settings) {
        var methodName = toCamelCase(name);
        if (
          name !== 'normalize' &&
          methodName !== 'setDefaults' &&
          settings[name] &&
          this[methodName]
        ) {
          input = this[methodName].call(this, input, settings[name]);
        }
      }

      return input;
    },

    /*
     * Normalization methods
     */
    leftTrim: function (input) {
      return input.replace(/^\s+/, '');
    },
    rightTrim: function (input) {
      return input.replace(/\s+$/, '');
    },
    tabsToSpaces: function (input, spaces) {
      spaces = spaces | 0 || 4;
      return input.replace(/\t/g, new Array(++spaces).join(' '));
    },
    spacesToTabs: function (input, spaces) {
      spaces = spaces | 0 || 4;
      return input.replace(RegExp(' {' + spaces + '}', 'g'), '\t');
    },
    removeTrailing: function (input) {
      return input.replace(/\s*?$/gm, '');
    },
    // Support for deprecated plugin remove-initial-line-feed
    removeInitialLineFeed: function (input) {
      return input.replace(/^(?:\r?\n|\r)/, '');
    },
    removeIndent: function (input) {
      var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

      if (!indents || !indents[0].length) return input;

      indents.sort(function (a, b) {
        return a.length - b.length;
      });

      if (!indents[0].length) return input;

      return input.replace(RegExp('^' + indents[0], 'gm'), '');
    },
    indent: function (input, tabs) {
      return input.replace(
        /^[^\S\n\r]*(?=\S)/gm,
        new Array(++tabs).join('\t') + '$&',
      );
    },
    breakLines: function (input, characters) {
      characters = characters === true ? 80 : characters | 0 || 80;

      var lines = input.split('\n');
      for (var i = 0; i < lines.length; ++i) {
        if (tabLen(lines[i]) <= characters) continue;

        var line = lines[i].split(/(\s+)/g),
          len = 0;

        for (var j = 0; j < line.length; ++j) {
          var tl = tabLen(line[j]);
          len += tl;
          if (len > characters) {
            line[j] = '\n' + line[j];
            len = tl;
          }
        }
        lines[i] = line.join('');
      }
      return lines.join('\n');
    },
  };

  // Support node modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NormalizeWhitespace;
  }

  // Exit if prism is not loaded
  if (typeof Prism === 'undefined') {
    return;
  }

  Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    /*'break-lines': 80,
	'indent': 2,
	'remove-initial-line-feed': false,
	'tabs-to-spaces': 4,
	'spaces-to-tabs': 4*/
  });

  Prism.hooks.add('before-sanity-check', function (env) {
    var Normalizer = Prism.plugins.NormalizeWhitespace;

    // Check settings
    if (
      env.settings &&
      env.settings['whitespace-normalization'] === false
    ) {
      return;
    }

    // Check classes
    if (
      !Prism.util.isActive(
        env.element,
        'whitespace-normalization',
        true,
      )
    ) {
      return;
    }

    // Simple mode if there is no env.element
    if ((!env.element || !env.element.parentNode) && env.code) {
      env.code = Normalizer.normalize(env.code, env.settings);
      return;
    }

    // Normal mode
    var pre = env.element.parentNode;
    if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre') {
      return;
    }

    var children = pre.childNodes,
      before = '',
      after = '',
      codeFound = false;

    // Move surrounding whitespace from the <pre> tag into the <code> tag
    for (var i = 0; i < children.length; ++i) {
      var node = children[i];

      if (node == env.element) {
        codeFound = true;
      } else if (node.nodeName === '#text') {
        if (codeFound) {
          after += node.nodeValue;
        } else {
          before += node.nodeValue;
        }

        pre.removeChild(node);
        --i;
      }
    }

    if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
      env.code = before + env.code + after;
      env.code = Normalizer.normalize(env.code, env.settings);
    } else {
      // Preserve markup for keep-markup plugin
      var html = before + env.element.innerHTML + after;
      env.element.innerHTML = Normalizer.normalize(
        html,
        env.settings,
      );
      env.code = env.element.textContent;
    }
  });
})();

(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  var callbacks = [];
  var map = {};
  var noop = function () {};

  Prism.plugins.toolbar = {};

  /**
   * @typedef ButtonOptions
   * @property {string} text The text displayed.
   * @property {string} [url] The URL of the link which will be created.
   * @property {Function} [onClick] The event listener for the `click` event of the created button.
   * @property {string} [className] The class attribute to include with element.
   */

  /**
   * Register a button callback with the toolbar.
   *
   * @param {string} key
   * @param {ButtonOptions|Function} opts
   */
  var registerButton = (Prism.plugins.toolbar.registerButton = function (
    key,
    opts,
  ) {
    var callback;

    if (typeof opts === 'function') {
      callback = opts;
    } else {
      callback = function (env) {
        var element;

        if (typeof opts.onClick === 'function') {
          element = document.createElement('button');
          element.type = 'button';
          element.addEventListener('click', function () {
            opts.onClick.call(this, env);
          });
        } else if (typeof opts.url === 'string') {
          element = document.createElement('a');
          element.href = opts.url;
        } else {
          element = document.createElement('span');
        }

        if (opts.className) {
          element.classList.add(opts.className);
        }

        element.textContent = opts.text;

        return element;
      };
    }

    if (key in map) {
      console.warn(
        'There is a button with the key "' +
          key +
          '" registered already.',
      );
      return;
    }

    callbacks.push((map[key] = callback));
  });

  /**
   * Returns the callback order of the given element.
   *
   * @param {HTMLElement} element
   * @returns {string[] | undefined}
   */
  function getOrder(element) {
    while (element) {
      var order = element.getAttribute('data-toolbar-order');
      if (order != null) {
        order = order.trim();
        if (order.length) {
          return order.split(/\s*,\s*/g);
        } else {
          return [];
        }
      }
      element = element.parentElement;
    }
  }

  /**
   * Post-highlight Prism hook callback.
   *
   * @param env
   */
  var hook = (Prism.plugins.toolbar.hook = function (env) {
    // Check if inline or actual code block (credit to line-numbers plugin)
    var pre = env.element.parentNode;
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    // Autoloader rehighlights, so only do this once.
    if (pre.parentNode.classList.contains('code-toolbar')) {
      return;
    }

    // Create wrapper for <pre> to prevent scrolling toolbar with content
    var wrapper = document.createElement('div');
    wrapper.classList.add('code-toolbar');
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Setup the toolbar
    var toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');

    // order callbacks
    var elementCallbacks = callbacks;
    var order = getOrder(env.element);
    if (order) {
      elementCallbacks = order.map(function (key) {
        return map[key] || noop;
      });
    }

    elementCallbacks.forEach(function (callback) {
      var element = callback(env);

      if (!element) {
        return;
      }

      var item = document.createElement('div');
      item.classList.add('toolbar-item');

      item.appendChild(element);
      toolbar.appendChild(item);
    });

    // Add our toolbar to the currently created wrapper of <pre> tag
    wrapper.appendChild(toolbar);
  });

  registerButton('label', function (env) {
    var pre = env.element.parentNode;
    if (!pre || !/pre/i.test(pre.nodeName)) {
      return;
    }

    if (!pre.hasAttribute('data-label')) {
      return;
    }

    var element, template;
    var text = pre.getAttribute('data-label');
    try {
      // Any normal text will blow up this selector.
      template = document.querySelector('template#' + text);
    } catch (e) {}

    if (template) {
      element = template.content;
    } else {
      if (pre.hasAttribute('data-url')) {
        element = document.createElement('a');
        element.href = pre.getAttribute('data-url');
      } else {
        element = document.createElement('span');
      }

      element.textContent = text;
    }

    return element;
  });

  /**
   * Register the toolbar with Prism.
   */
  Prism.hooks.add('complete', hook);
})();

(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  if (!Prism.plugins.toolbar) {
    console.warn(
      'Copy to Clipboard plugin loaded before Toolbar plugin.',
    );

    return;
  }

  var callbacks = [];

  Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (
    env,
  ) {
    var linkCopy = document.createElement('button');
    linkCopy.textContent = 'Copy';

    var element = env.element;

    if (!ClipboardJS) {
      callbacks.push(registerClipboard);
    } else {
      registerClipboard();
    }

    return linkCopy;

    function registerClipboard() {
      var clip = new ClipboardJS(linkCopy, {
        text: function () {
          return element.textContent;
        },
      });

      clip.on('success', function () {
        linkCopy.textContent = 'Copied!';

        resetText();
      });
      clip.on('error', function () {
        linkCopy.textContent = 'Press Ctrl+C to copy';

        resetText();
      });
    }

    function resetText() {
      setTimeout(function () {
        linkCopy.textContent = 'Copy';
      }, 5000);
    }
  });
})();

(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
  }

  var MATCH_ALL_CLASS = /(?:^|\s)match-braces(?:\s|$)/;

  var BRACE_HOVER_CLASS = /(?:^|\s)brace-hover(?:\s|$)/;
  var BRACE_SELECTED_CLASS = /(?:^|\s)brace-selected(?:\s|$)/;

  var NO_BRACE_HOVER_CLASS = /(?:^|\s)no-brace-hover(?:\s|$)/;
  var NO_BRACE_SELECT_CLASS = /(?:^|\s)no-brace-select(?:\s|$)/;

  var PARTNER = {
    '(': ')',
    '[': ']',
    '{': '}',
  };

  var NAMES = {
    '(': 'brace-round',
    '[': 'brace-square',
    '{': 'brace-curly',
  };

  var LEVEL_WARP = 12;

  var pairIdCounter = 0;

  var BRACE_ID_PATTERN = /^(pair-\d+-)(open|close)$/;

  /**
   * Returns the brace partner given one brace of a brace pair.
   *
   * @param {HTMLElement} brace
   * @returns {HTMLElement}
   */
  function getPartnerBrace(brace) {
    var match = BRACE_ID_PATTERN.exec(brace.id);
    return document.querySelector(
      '#' + match[1] + (match[2] == 'open' ? 'close' : 'open'),
    );
  }

  /**
   * @this {HTMLElement}
   */
  function hoverBrace() {
    for (
      var parent = this.parentElement;
      parent;
      parent = parent.parentElement
    ) {
      if (NO_BRACE_HOVER_CLASS.test(parent.className)) {
        return;
      }
    }

    [this, getPartnerBrace(this)].forEach(function (ele) {
      ele.className = (
        ele.className.replace(BRACE_HOVER_CLASS, ' ') + ' brace-hover'
      ).replace(/\s+/g, ' ');
    });
  }
  /**
   * @this {HTMLElement}
   */
  function leaveBrace() {
    [this, getPartnerBrace(this)].forEach(function (ele) {
      ele.className = ele.className.replace(BRACE_HOVER_CLASS, ' ');
    });
  }
  /**
   * @this {HTMLElement}
   */
  function clickBrace() {
    for (
      var parent = this.parentElement;
      parent;
      parent = parent.parentElement
    ) {
      if (NO_BRACE_SELECT_CLASS.test(parent.className)) {
        return;
      }
    }

    [this, getPartnerBrace(this)].forEach(function (ele) {
      ele.className = (
        ele.className.replace(BRACE_SELECTED_CLASS, ' ') +
        ' brace-selected'
      ).replace(/\s+/g, ' ');
    });
  }

  Prism.hooks.add('complete', function (env) {
    /** @type {HTMLElement} */
    var code = env.element;
    var pre = code.parentElement;

    if (!pre || pre.tagName != 'PRE') {
      return;
    }

    // find the braces to match
    /** @type {string[]} */
    var toMatch = [];
    for (var ele = code; ele; ele = ele.parentElement) {
      if (MATCH_ALL_CLASS.test(ele.className)) {
        toMatch.push('(', '[', '{');
        break;
      }
    }

    if (toMatch.length == 0) {
      // nothing to match
      return;
    }

    if (!pre.__listenerAdded) {
      // code blocks might be highlighted more than once
      pre.addEventListener(
        'mousedown',
        function removeBraceSelected() {
          // the code element might have been replaced
          var code = pre.querySelector('code');
          Array.prototype.slice
            .call(code.querySelectorAll('.brace-selected'))
            .forEach(function (element) {
              element.className = element.className.replace(
                BRACE_SELECTED_CLASS,
                ' ',
              );
            });
        },
      );
      Object.defineProperty(pre, '__listenerAdded', { value: true });
    }

    /** @type {HTMLSpanElement[]} */
    var punctuation = Array.prototype.slice.call(
      code.querySelectorAll('span.token.punctuation'),
    );

    /** @type {{ index: number, open: boolean, element: HTMLElement }[]} */
    var allBraces = [];

    toMatch.forEach(function (open) {
      var close = PARTNER[open];
      var name = NAMES[open];

      /** @type {[number, number][]} */
      var pairs = [];
      /** @type {number[]} */
      var openStack = [];

      for (var i = 0; i < punctuation.length; i++) {
        var element = punctuation[i];
        if (element.childElementCount == 0) {
          var text = element.textContent;
          if (text === open) {
            allBraces.push({
              index: i,
              open: true,
              element: element,
            });
            element.className += ' ' + name;
            element.className += ' brace-open';
            openStack.push(i);
          } else if (text === close) {
            allBraces.push({
              index: i,
              open: false,
              element: element,
            });
            element.className += ' ' + name;
            element.className += ' brace-close';
            if (openStack.length) {
              pairs.push([i, openStack.pop()]);
            }
          }
        }
      }

      pairs.forEach(function (pair) {
        var pairId = 'pair-' + pairIdCounter++ + '-';

        var openEle = punctuation[pair[0]];
        var closeEle = punctuation[pair[1]];

        openEle.id = pairId + 'open';
        closeEle.id = pairId + 'close';

        [openEle, closeEle].forEach(function (ele) {
          ele.addEventListener('mouseenter', hoverBrace);
          ele.addEventListener('mouseleave', leaveBrace);
          ele.addEventListener('click', clickBrace);
        });
      });
    });

    var level = 0;
    allBraces.sort(function (a, b) {
      return a.index - b.index;
    });
    allBraces.forEach(function (brace) {
      if (brace.open) {
        brace.element.className +=
          ' brace-level-' + ((level % LEVEL_WARP) + 1);
        level++;
      } else {
        level = Math.max(0, level - 1);
        brace.element.className +=
          ' brace-level-' + ((level % LEVEL_WARP) + 1);
      }
    });
  });
})();
