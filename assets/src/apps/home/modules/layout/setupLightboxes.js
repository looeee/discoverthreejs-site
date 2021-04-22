export function setupLightboxes() {
  const lightboxes = document.querySelectorAll('.lightbox_link');
  const body = document.querySelector('body');

  let lbNum = 0;

  lightboxes.forEach(lightbox => {
    const id = 'lightbox_' + lbNum;

    lightbox.href = '#' + id;

    const link = document.createElement('a');
    link.href = '#_';
    link.classList.add('lightbox');
    link.id = id;

    const img = lightbox.querySelector('img');

    const lbImg = document.createElement('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt + ' (fullscreen)';
    link.appendChild(lbImg);

    body.appendChild(link);

    lbNum++;
  });
}
