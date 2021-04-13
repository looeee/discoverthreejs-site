import { setup } from '../../base.js';

import { setupStripe } from './stripe/stripe.js';
import { setupPaymentForm } from './form/paymentForm.js';

setup({
  navCloseElem: '#wrapper',
});

setupStripe();
setupPaymentForm();
