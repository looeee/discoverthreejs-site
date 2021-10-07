// if the user arrives on the page via an anchor link, scroll it into view
export function moveAnchorIntoView() {
  if (window.location.hash.length > 0) {
    const target = document.querySelector(window.location.hash);

    document.querySelector(".wrapper").scrollTo({
      top: target.offsetTop - 100,
      left: 0,
      behavior: "auto",
    });
  }
}
