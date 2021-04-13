import { handleSuccess } from './handleSuccess.js';
import { handleMessages } from './handleMessages.js';

function setupApplyCodeForm() {
  const form = document.querySelector('#apply_code_form');
  if (!form) return;

  const csrfToken = form.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  ).value;
  const submitButton = form.querySelector('#submit');

  const loadingOverlay = document.querySelector('.loading-overlay');

  const submitForm = async () => {
    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', csrfToken);

    const response = await fetch('/ajax/apply_code/', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });

    const result = await response.json();

    if (result.error) handleMessages(result.error);
    else if (result.success === true)
      handleSuccess(result.user_status);
  };

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    loadingOverlay.style.visibility = 'initial';
    loadingOverlay.style.opacity = 1;

    await submitForm();
  });
}

export { setupApplyCodeForm };
