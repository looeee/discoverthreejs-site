import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import lunr from 'lunr';

const searchDelay = 300;
let timerID;

const input = document.querySelector('#input-search');
const resultsList = document.createElement('ul');
const resultsNav = document.querySelector('.search-results');
const content = document.querySelector('.content');

const wait = callback => {
  clearTimeout(timerID);
  timerID = setTimeout(callback, searchDelay);
};

let currentResults = [];

const getResultData = (uri, jsonData) => {
  const resultData = {
    uri,
  };

  jsonData.forEach(page => {
    if (page.uri === uri) {
      resultData.title = page.title;
      resultData.chapter = page.chapter;
    }
  });

  return resultData;
};

function substringIndexes(str, substr) {
  const results = [];
  let index = -1;

  while (index < str.length) {
    index = str.indexOf(substr, index + 1);
    if (index === -1) break;
    results.push(index);
  }

  return results;
}

const createInnerLI = (id, text) => {
  const link = document.createElement('a');
  link.classList.add('internal-link');
  link.href = '#' + id;
  link.innerHTML = text;

  const target = document.querySelector('#' + id);

  link.addEventListener('click', e => {
    e.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'end', // prevent scrolling on x axis
    });
  });

  const li = document.createElement('li');
  li.appendChild(link);

  return li;
};

const getSurroundingText = (text, startIndex, endIndex, query) => {
  let surroundingText = `<span class="search-highlight">${query}</span>`;

  let i = 0;
  while (surroundingText.length < 100) {
    if (text[startIndex - i - 1] !== undefined)
      surroundingText = text[startIndex - i - 1] + surroundingText;
    if (text[endIndex + i] !== undefined)
      surroundingText += text[endIndex + i];

    if (
      text[startIndex - i - 1] === undefined &&
      text[endIndex + i] === undefined
    )
      break;

    i++;
  }

  if (surroundingText.length < 100) return surroundingText;
  return `...${surroundingText}...`;
};

const highlightSearchTerm = (query, currentPageItem) => {
  const innerLinks = [];

  removeHighlights();

  if (query.length < 3) return;

  const nodeFilter = {
    acceptNode(node) {
      if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  };

  const walker = document.createTreeWalker(
    content,
    NodeFilter.SHOW_TEXT,
    nodeFilter,
    false,
  );

  let idIndex = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.textContent.indexOf(query) !== -1) {
      const nodeText = node.textContent;

      const indices = substringIndexes(nodeText, query);

      // indices.forEach( ( index ) => {

      const index = indices[0]; // TODO: multiple occurences in one node

      const range = document.createRange();

      range.setStart(node, index);
      range.setEnd(node, index + query.length);

      const span = document.createElement('span');

      const id = `highlight-${idIndex}`;
      span.id = id;
      span.classList.add('search-highlight');

      range.surroundContents(span);

      walker.nextNode();

      innerLinks.push(
        createInnerLI(
          id,
          getSurroundingText(
            nodeText,
            index,
            index + query.length,
            query,
          ),
        ),
      );

      idIndex++;
    }
  }

  if (innerLinks.length > 0 && currentPageItem !== null) {
    const ul = document.createElement('ul');
    ul.classList.add('search-inner-links');
    currentPageItem.appendChild(ul);

    innerLinks.forEach(link => {
      ul.appendChild(link);
    });
  }
};

const removeHighlights = () => {
  const highlights = content.querySelectorAll('.search-highlight');

  highlights.forEach(highlight => {
    const parent = highlight.parentNode;

    parent.replaceChild(
      document.createTextNode(highlight.textContent),
      highlight,
    );
    parent.normalize(); // condense text nodes
  });
};

const createResultListItems = (results, jsonData, query) => {
  let currentPageItem = null;

  function compare(a, b) {
    if (a.chapter < b.chapter) {
      return -1;
    }
    if (a.chapter > b.chapter) {
      return 1;
    }
    return 0;
  }

  const resultsData = [];

  results.forEach(result => {
    resultsData.push(getResultData(result.ref, jsonData));
  });

  resultsData.sort(compare);

  resultsData.forEach(resultData => {
    const li = document.createElement('li');
    currentResults.push(li);

    const a = document.createElement('a');
    li.appendChild(a);

    a.href = resultData.uri + '?search=' + query;
    a.innerHTML = resultData.chapter + ': ' + resultData.title;

    if (resultData.uri === window.location.pathname) {
      currentPageItem = li;
      li.classList.add('search-active');
    }
  });

  return currentPageItem;
};

const addResultsToList = list => {
  currentResults.forEach(result => {
    list.appendChild(result);
  });
};

const removeResultsFromList = list => {
  currentResults.forEach(result => {
    list.removeChild(result);
  });

  currentResults = [];
};

let index;
const search = (query, jsonData) => {
  let results;
  if (query === '') {
    results = [];
    removeHighlights();
  } else results = index.search(query);

  if (results.length > 0) {
    resultsNav.appendChild(resultsList);
    removeResultsFromList(resultsList);
    const currentPageItem = createResultListItems(
      results,
      jsonData,
      query,
    );
    addResultsToList(resultsList);

    highlightSearchTerm(query, currentPageItem);
  } else if (resultsNav.firstChild === resultsList)
    resultsNav.removeChild(resultsList);
};

document.addEventListener('keydown', e => {
  e = e || window.event;
  if (e.keyCode === 27) {
    input.value = '';
    search('');
  }
});

const getPreviousSearch = () => {
  const params = window.location.search.slice(1).split('=');
  const searchParamIndex = params.indexOf('search') + 1;

  if (searchParamIndex === undefined) return -1;
  return unescape(params[searchParamIndex]);
};

export default function initLunr() {
  // abort if we are not on a content page
  if (!document.querySelector('.content')) return;

  fetch('/static/lunr/index.json', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(jsonData => {
      index = lunr(function() {
        this.ref('uri');

        this.field('content');
        this.field('title');

        this.metadataWhitelist = ['position'];
        // this.pipeline.after( lunr.trimmer, token => token.replace( /'s$/, '' ) );

        jsonData.forEach(page => {
          this.add(page);
        }, this);
      });

      const previousSearch = getPreviousSearch();

      if (previousSearch !== -1) {
        input.value = previousSearch;
        search(previousSearch, jsonData);
      }

      input.addEventListener('input', e => {
        e.preventDefault();
        const query = input.value;

        wait(search(query, jsonData));
      });
    })
    .catch(err => {
      console.error('Error loading search index: ', err);
    });
}
