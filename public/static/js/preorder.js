function setupNav(
  wrapperElem,
  triggers = document.querySelectorAll('.nav-panel-trigger'),
) {
  document.querySelector('main').addEventListener('click', () => {
    triggers.forEach(trigger => {
      trigger.checked = false;
    });
  });
}

function smoothInternalLinks() {
  const internalLinks = document.querySelectorAll("a[href^='#']");

  internalLinks.forEach(link => {
    const id = '#' + link.href.split('#')[1];

    if (!id.includes('lightbox')) {
      const target = document.querySelector(id);

      if (target) {
        link.addEventListener('click', e => {
          e.preventDefault();

          window.scrollTo({
            top: target.offsetTop - 100,
            left: 0,
            behavior: 'smooth',
          });
        });
      }
    }
  });
}

// if the user arrives on the page via an anchor link, scroll it into view
function moveAnchorIntoView() {
  if (window.location.hash.length > 0) {
    const target = document.querySelector(window.location.hash);

    window.scrollTo({
      top: target.offsetTop - 100,
      left: 0,
      behavior: 'auto',
    });
  }
}

function setup(spec = {}) {
  window.addEventListener('load', () => {
    const header = document.querySelector('#header');
    if (header) {
      header.classList.remove('fade-out');
      header.classList.add('fade-in');
    }

    moveAnchorIntoView();
    setupNav(spec.navCloseElem, spec.navCloseTriggers);

    // setupLightboxes();
    smoothInternalLinks();
  });
}

function setupSendowl() {
  console.log('sendowl');
}

function handleMessages(message) {
  document.querySelector('#form-messages').textContent = message;
  const loadingOverlay = document.querySelector('.loading-overlay');
  loadingOverlay.style.visibility = 'hidden';
  loadingOverlay.style.opacity = 0;
}

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

setup({
  navCloseElem: '#wrapper',
});

setupSendowl();
setupPaymentForm();
//# sourceMappingURL=preorder.js.map
