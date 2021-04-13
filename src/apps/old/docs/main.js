import setup from '../../base.js';

import backToTopButton from './layout/backToTopButton.js';

import generateTOC from './layout/generateTOC.js';
import setupSyncTOC from './layout/setupSyncTOC.js';

// import initLunr from './search/initLunr.js';

import setupTopNavPagination from './layout/topNavPagination.js';

setupTopNavPagination();

//TODO fix search
// initLunr();

setup();

generateTOC();
setupSyncTOC();

backToTopButton();
