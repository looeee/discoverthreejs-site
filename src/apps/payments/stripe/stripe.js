let stripe;
let selectedPackage;
let billingData;

async function submitForm(data) {
  if (!selectedPackage) {
    handleMessages('Please select a package');
    return;
  }

  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  );
  if (!csrfToken) {
    handleMessages('Security Error! Please try from another browser');
    return;
  }

  const formData = new FormData();

  formData.append(...data);
  formData.append('selected_package', selectedPackage);

  formData.append('payee_name', billingData.name);
  formData.append('payee_email', billingData.email);
  formData.append('payee_zip', billingData.address_zip);

  formData.append('csrfmiddlewaretoken', csrfToken.value);

  const response = await fetch('/ajax/confirm_payment/', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });

  return await response.json();
}

const handleMessages = (message) => {
  const displayMessage = document.getElementById('card-messages');

  if (message && message.message) {
    displayMessage.textContent = message.message;
  } else if (typeof message === 'string') {
    displayMessage.textContent = message;
  } else {
    displayMessage.textContent = '';
  }
};

const handleSuccess = (response) => {
  if (response.success) {
    handleMessages('Payment successful!');
    window.location.href = response.redirect;
  }
};

function disableForm() {
  document.querySelector('button[type=submit]').disabled = true;
  document.querySelector('.loading-overlay').style.visibility =
    'initial';
  document.querySelector('.loading-overlay').style.opacity = 1;
}

function enableForm() {
  document.querySelector('button[type=submit]').disabled = false;
  document.querySelector('.loading-overlay').style.visibility =
    'hidden';
  document.querySelector('.loading-overlay').style.opacity = 0;
}

const handleServerResponse = async (response) => {
  if (response.error) {
    handleMessages(response.error);
    enableForm();
  } else if (response.requires_action) {
    // Use Stripe.js to handle the required card action
    const { error, paymentIntent } = await stripe.handleCardAction(
      response.payment_intent_client_secret,
    );

    if (error) {
      handleMessages(error);
      enableForm();
    } else {
      // send server 3D secure data
      const response = await submitForm([
        'payment_intent_id',
        paymentIntent.id,
      ]);
      handleServerResponse(response);
    }
  } else handleSuccess(response);
};

function selectPackage() {
  const basicSelect = document.getElementById('basic-package-select');
  const fullSelect = document.getElementById('full-package-select');
  const upgradeSelect = document.getElementById(
    'upgrade-package-select',
  );

  const basicPriceMessage = document.querySelector(
    '#basic-price-message',
  );
  const fullPriceMessage = document.querySelector(
    '#full-price-message',
  );
  const upgradePriceMessage = document.querySelector(
    '#upgrade-price-message',
  );
  const upgradeWarningMessage = document.querySelector(
    '#upgrade-warning-message',
  );

  if (basicSelect.checked) selectedPackage = 'basic';
  else if (fullSelect.checked) selectedPackage = 'full';

  basicSelect.addEventListener('change', (e) => {
    if (basicSelect.checked) {
      selectedPackage = 'basic';
      basicPriceMessage.style.display = 'initial';
      fullPriceMessage.style.display = 'none';
      upgradePriceMessage.style.display = 'none';
      upgradeWarningMessage.style.visibility = 'hidden';
    }
  });

  fullSelect.addEventListener('change', (e) => {
    if (fullSelect.checked) {
      selectedPackage = 'full';
      basicPriceMessage.style.display = 'none';
      fullPriceMessage.style.display = 'initial';
      upgradePriceMessage.style.display = 'none';
      upgradeWarningMessage.style.visibility = 'hidden';
    }
  });

  upgradeSelect.addEventListener('change', (e) => {
    if (upgradeSelect.checked) {
      selectedPackage = 'upgrade';
      basicPriceMessage.style.display = 'none';
      fullPriceMessage.style.display = 'none';
      upgradePriceMessage.style.display = 'initial';
      upgradeWarningMessage.style.visibility = 'initial';
    }
  });
}

function buildForm() {
  // Create an instance of Elements.
  const elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  const style = {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      fontWeight: 300,
      fontSize: '16px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  };

  const cardNumber = elements.create('cardNumber', { style });
  cardNumber.mount('#card-number-element');

  const cardExpiry = elements.create('cardExpiry', { style });
  cardExpiry.mount('#card-expiry-element');

  const cardCvc = elements.create('cardCvc', { style });
  cardCvc.mount('#card-cvc-element');

  const cardElements = { cardNumber, cardExpiry, cardCvc };

  for (const element of Object.values(cardElements)) {
    element.addEventListener('change', ({ error }) => {
      handleMessages(error);
    });
  }

  return cardElements;
}

function getData(form) {
  // format required by stripe
  return {
    // currency: 'usd',
    billing_details: {
      name: form.querySelector('#cardholder-name').value,
      email: form.querySelector('#cardholder-email').value,
      address: {
        postal_code: form.querySelector('#cardholder-zip').value,
      },
    },
  };
}

async function setupStripe() {
  const form = document.querySelector('#payment-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type=submit]');

  stripe = Stripe(
    document.querySelector('input[name="stripepublickey"]').value,
  );

  const cardElements = buildForm();
  selectPackage();

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    disableForm();

    billingData = getData(form);

    const { paymentMethod, error } = await stripe.createPaymentMethod(
      'card',
      cardElements.cardNumber,
      billingData,
    );

    if (error) {
      handleMessages(error);
      enableForm();
    } else {
      const response = await submitForm([
        'payment_method_id',
        paymentMethod.id,
      ]);
      handleServerResponse(response);
    }
  });
}

export { setupStripe };
