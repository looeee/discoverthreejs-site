function setupEnterCodeForm() {
  const form = document.querySelector('#enter_code_form');

  if (!form) return;

  const csrfToken = form.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  ).value;
  const messagesElem = form.querySelector('#messages');
  const codeInput = form.querySelector('#id_code');
  const submitButton = form.querySelector('#submit');

  codeInput.pattern = 'basic_.{16}|full_.{16}';

  codeInput.addEventListener('input', () => {
    codeInput.setCustomValidity('');
  });

  codeInput.addEventListener('invalid', () => {
    if (codeInput.value.length === 0) {
      codeInput.setCustomValidity('Please enter a code');
    } else {
      codeInput.setCustomValidity('Incorrect code format');
    }
  });

  submitButton.addEventListener('click', (e) => {
    if (!codeInput.validity.valid && codeInput.value.length > 0) {
      messagesElem.style.visibility = 'initial';
    }
  });
}

export { setupEnterCodeForm };
