function enableUnavailableLinks() {
  for (const elem of document.querySelectorAll('.unavailable')) {
    elem.classList.remove('unavailable');
  }
}

export { enableUnavailableLinks };
