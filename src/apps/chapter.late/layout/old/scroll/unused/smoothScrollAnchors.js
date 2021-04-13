// if the user arrives on the page via an anchor link, scroll it into view
function smoothScrollAnchors(scroller) {
  if (window.location.hash.length > 0) {
    const target = document.querySelector(window.location.hash);

    // console.log(target);
    // window.scrollTo({
    //   top: target.offsetTop - 100,
    //   left: 0,
    //   behavior: 'auto',
    // });

    scroller.scrollTo(false, target.offsetTop - 100, 0);
  }
}

export { smoothScrollAnchors };
