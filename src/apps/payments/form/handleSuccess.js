function handleSuccess(result) {
  const loadingOverlay = document.querySelector('.loading-overlay');
  const userStatus = document.querySelector('#user-status');
  const upgradeButton = document.querySelector(
    '#upgrade-account-button',
  );
  const codeInfo = document.querySelector('#code-info');
  const upgradeInstructions = document.querySelector(
    '#upgrade-instructions',
  );

  loadingOverlay.style.visibility = 'hidden';
  loadingOverlay.style.opacity = 0;

  if (result.action === 'account_upgraded') {
    userStatus.textContent = result.new_status;

    upgradeInstructions.textContent =
      'Your account has been upgraded';

    upgradeButton.textContent = 'Account Successfully Upgraded';
  } else if (result.action === 'code_generated') {
    codeInfo.style.display = 'initial';
    upgradeButton.disabled = false;
    upgradeButton.textContent = 'Actually, Upgrade My Account Now';
  }
}

export { handleSuccess };
