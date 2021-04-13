import { packageAlreadySelected } from './packageAlreadySelected';

function setupSelectPackageForm() {
  const form = document.querySelector('#select_package_form');
  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  ).value;
  if (!form || !csrfToken) return;

  const selectedMessage = document.querySelector(
    '.selected_package_message',
  );
  const links = document.querySelector('#links');

  if (packageAlreadySelected(selectedMessage))
    links.style.visibility = 'unset';

  const selectBasicButton = form.querySelector(
    '#select_basic_package',
  );
  const selectFullButton = form.querySelector('#select_full_package');

  selectBasicButton.addEventListener('click', (e) => {
    e.preventDefault();
    submitForm('basic');
  });

  selectFullButton.addEventListener('click', async (e) => {
    e.preventDefault();
    await submitForm('full');
  });

  const submitForm = async (selectedPackage) => {
    const formData = new FormData();
    formData.append('selected_package', selectedPackage);
    formData.append('csrfmiddlewaretoken', csrfToken);

    const response = await fetch('/ajax/select_package/', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });

    const selected_package = (await response.json()).selected_package;

    selectedMessage.textContent =
      selected_package.charAt(0).toUpperCase() +
      selected_package.slice(1) +
      ' Package';
    links.style.visibility = 'unset';
  };
}

export { setupSelectPackageForm };
