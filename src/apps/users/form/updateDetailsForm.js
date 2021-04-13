import { getInitialDetails } from './getInitialDetails';
import { getUpdatedDetails } from './getUpdatedDetails';
import { handleMessages } from './handleMessages';
import { setLoadingState } from './setLoadingState';

// TODO: remove modules scope variables

let initialDetails;
let avatarImage;

const detailsChanged = (initial, updated) => {
  if (
    initial.username !== updated.username ||
    initial.email !== updated.email ||
    initial.first_name !== updated.first_name ||
    initial.last_name !== updated.last_name ||
    initial.website !== updated.website ||
    avatarImage
  ) {
    return true;
  }
  return false;
};

const handleSuccess = (form) => {
  handleMessages('Details updated');
  initialDetails = getInitialDetails(form);
};

const submitForm = async (details) => {
  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]',
  ).value;

  const formData = new FormData();
  formData.append('new_username', details.username);
  formData.append('new_email', details.email);
  formData.append('new_first_name', details.first_name);
  formData.append('new_last_name', details.last_name);
  formData.append('new_website', details.website);

  if (avatarImage) {
    formData.append('new_avatar', avatarImage);
  }

  formData.append('csrfmiddlewaretoken', csrfToken);

  const response = await fetch('/ajax/update_details/', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });

  return await response.json();
};

function setupUpdateDetailsForm() {
  const form = document.querySelector('#update_details_form');

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const fileInput = form.querySelector('#id_avatar');

  initialDetails = getInitialDetails(form);

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const updatedDetails = getUpdatedDetails(form);
    if (!detailsChanged(initialDetails, updatedDetails)) return;

    setLoadingState('start');

    const response = await submitForm(updatedDetails);

    if (response.success) handleSuccess(form);
    else if (response.error) handleErrors(response.error);

    setLoadingState('end');
  });

  fileInput.addEventListener('change', (data) => {
    const file = fileInput.files[0];

    if (file.size / 1024 / 1024 > 5) {
      handleMessages('Maximum image size: 5mb');
      fileInput.value = '';
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e) {
        document.querySelector('#current_avatar').src =
          e.target.result;
      };

      avatarImage = file;
    }
  });
}

export { setupUpdateDetailsForm };
