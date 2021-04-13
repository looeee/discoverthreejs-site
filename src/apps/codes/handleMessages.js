function handleMessages(message) {
  document.querySelector('#form-messages').textContent = message;
  const loadingOverlay = document.querySelector('.loading-overlay');
  loadingOverlay.style.visibility = 'hidden';
  loadingOverlay.style.opacity = 0;
}

export { handleMessages };
