import { handleMessages } from './handleMessages';
export const setLoadingState = (state) => {
  const overlay = document.querySelector('.loading-overlay');
  const button = document.querySelector('button[type="submit"]');
  if (state === 'start') {
    handleMessages('');
    button.disabled = true;
    overlay.style.visibility = 'initial';
    overlay.style.opacity = 1;
  } else if (state === 'end') {
    button.disabled = false;
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = 0;
  }
};
