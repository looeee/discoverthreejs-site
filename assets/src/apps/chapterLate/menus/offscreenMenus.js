// toggle open/closed for offscreen menus
function setupOffscreenMenus() {
  const wrapper = document.querySelector('.wrapper');
  const leftMenuToggle = document.querySelector('#left-menu-toggle');
  const rightMenuToggle = document.querySelector(
    '#right-menu-toggle',
  );
  const leftMenu = document.querySelector('.left-menu');
  const rightMenu = document.querySelector('.right-menu');

  if (!leftMenu) {
    leftMenuToggle.labels[0].classList.add('hide');
  }

  function enableLeftMenu(bool) {
    if (!leftMenu) return;

    if (bool === true) {
      leftMenuToggle.checked = true;
      enableRightMenu(false);
      leftMenu.classList.add('show');
      wrapper.classList.add('fade');
    } else {
      leftMenuToggle.checked = false;
      leftMenu.classList.remove('show');
      wrapper.classList.remove('fade');
    }
  }

  function enableRightMenu(bool) {
    if (bool === true) {
      rightMenuToggle.checked = true;
      enableLeftMenu(false);
      rightMenu.classList.add('show');
      wrapper.classList.add('fade');
    } else {
      rightMenuToggle.checked = false;
      rightMenu.classList.remove('show');
      wrapper.classList.remove('fade');
    }
  }

  leftMenuToggle.addEventListener('click', () => {
    enableLeftMenu(leftMenuToggle.checked);
  });

  rightMenuToggle.addEventListener('click', () => {
    enableRightMenu(rightMenuToggle.checked);
  });

  wrapper.addEventListener('click', () => {
    enableLeftMenu(false);
    enableRightMenu(false);
  });
}

export { setupOffscreenMenus };
