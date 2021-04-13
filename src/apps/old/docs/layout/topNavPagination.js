export default function setupTopNavPagination() {
  const container = document.querySelector('.top-nav-pagination');
  const bottomPaginator = document.querySelector('.pagination');
  if (!container || !bottomPaginator) return;

  const prevLinkBottom = document.querySelector('.pagination-prev');
  const nextLinkBottom = document.querySelector('.pagination-next');

  const prevLinkTop = document.querySelector(
    '.top-nav-pagination-prev',
  );
  const nextLinkTop = document.querySelector(
    '.top-nav-pagination-next',
  );

  if (prevLinkBottom) {
    prevLinkTop.classList.remove('disabled');
    prevLinkTop.href = prevLinkBottom.href;
    prevLinkTop.title = prevLinkBottom.title;
  }

  if (nextLinkBottom) {
    nextLinkTop.classList.remove('disabled');
    nextLinkTop.href = nextLinkBottom.href;
    nextLinkTop.title = nextLinkBottom.title;
  }
}
