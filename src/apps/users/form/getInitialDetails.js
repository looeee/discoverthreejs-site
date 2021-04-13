export const getInitialDetails = (form) => {
  return {
    username: form.querySelector('#id_username').value,
    email: form.querySelector('#id_email').value,
    first_name: form.querySelector('#id_first_name').value,
    last_name: form.querySelector('#id_last_name').value,
    website: form.querySelector('#id_website').value,
  };
};
