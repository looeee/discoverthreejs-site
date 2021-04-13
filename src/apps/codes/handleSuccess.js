function handleSuccess(newStatus) {
  const preApplyMessage = document.querySelector(
    '#pre-apply-message',
  );
  const postApplyMessage = document.querySelector(
    '#post-apply-message',
  );
  const loadingOverlay = document.querySelector('.loading-overlay');
  const userStatus = document.querySelector('#user-status');
  const submitButton = document.querySelector('#submit');

  preApplyMessage.style.display = 'none';
  postApplyMessage.style.display = 'initial';

  userStatus.textContent = newStatus;

  loadingOverlay.style.visibility = 'hidden';
  loadingOverlay.style.opacity = 0;

  submitButton.textContent = 'Upgrade Successful';
}

export { handleSuccess };
