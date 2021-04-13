import { setup } from '../../base.js';

import { setupEnterCodeForm } from './enterCodeForm';
import { setupApplyCodeForm } from './applyCodeForm';

setup({
  navCloseElem: '#wrapper',
});

setupEnterCodeForm();
setupApplyCodeForm();
