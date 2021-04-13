function addPageDimsInfo() {
  const infoElem = document.querySelector('.info');

  if (!infoElem) return;

  // console.log( infoElem )

  const width = document.createElement('p');
  width.textContent = `Window Width: ${window.innerWidth}px`;

  const height = document.createElement('p');
  height.textContent = `Window Height: ${window.innerHeight}px`;

  infoElem.append(width, height);

  window.addEventListener('resize', () => {
    width.textContent = `Window Width: ${window.innerWidth}px`;
    height.textContent = `Window Height: ${window.innerHeight}px`;
  });
}

export { addPageDimsInfo };
