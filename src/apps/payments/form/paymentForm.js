import { handleMessages } from './handleMessages';
import { handleSuccess } from './handleSuccess';

function setupPaymentForm() {
  const form = document.querySelector('#upgrade-account-form');
  if (!form) return;

  const csrfToken = form.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  ).value;
  const upgradeButton = form.querySelector('#upgrade-account-button');
  const generateCodeButton = form.querySelector(
    '#generate-code-button',
  );
  const codeInfo = document.querySelector('#code-info');

  const loadingOverlay = document.querySelector('.loading-overlay');

  upgradeButton.addEventListener('click', async (e) => {
    e.preventDefault();

    upgradeButton.disabled = true;
    generateCodeButton.disabled = true;
    loadingOverlay.style.visibility = 'initial';
    loadingOverlay.style.opacity = 1;
    codeInfo.style.display = 'none';

    await submitForm('upgrade_account');
  });

  generateCodeButton.addEventListener('click', async (e) => {
    e.preventDefault();

    upgradeButton.disabled = true;
    generateCodeButton.disabled = true;
    loadingOverlay.style.visibility = 'initial';
    loadingOverlay.style.opacity = 1;

    await submitForm('generate_code');
  });

  const submitForm = async (action) => {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('csrfmiddlewaretoken', csrfToken);

    const response = await fetch('/ajax/upgrade_account/', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });

    const result = await response.json();

    if (result.error) handleMessages(result.error);
    else if (result.success === true) handleSuccess(result);
  };
}

export { setupPaymentForm };
