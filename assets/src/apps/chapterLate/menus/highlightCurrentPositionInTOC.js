// https://tj.ie/building-a-table-of-contents-with-the-intersection-observer-api/

const highlightCurrentPositionInToc = {
  container: null,
  links: null,
  headings: null,
  intersectionOptions: {
    root: document.querySelector('.scroller'),
    rootMargin: '0px',
    threshold: 0.5,
  },
  previousSection: null,
  observer: null,

  init(menu) {
    this.container = menu;
    this.handleObserver = this.handleObserver.bind(this);

    this.setUpObserver();
    this.findLinksAndHeadings();
    this.observeSections();

    this.links.forEach((link) => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  },

  handleLinkClick(evt) {
    evt.preventDefault();
    const id = evt.target.getAttribute('href').replace('#', '');

    const section = this.headings.find((heading) => {
      return heading.getAttribute('id') === id;
    });

    section.setAttribute('tabindex', -1);
    section.focus();

    window.scroll({
      behavior: 'smooth',
      top: section.offsetTop - 15,
      block: 'start',
    });

    if (this.container.classList.contains('is-active')) {
      this.container.classList.remove('is-active');
    }
  },

  handleObserver(entries, observer) {
    entries.forEach((entry) => {
      const href = `#${entry.target.getAttribute('id')}`;
      const link = this.links.find(
        (l) => l.getAttribute('href') === href,
      );

      if (entry.isIntersecting && entry.intersectionRatio >= 1) {
        link.classList.add('is-visible');
        this.previousSection = entry.target.getAttribute('id');
      } else {
        link.classList.remove('is-visible');
      }

      this.highlightFirstActive();
    });
  },

  highlightFirstActive() {
    const firstVisibleLink = this.container.querySelector(
      '.is-visible',
    );

    this.links.forEach((link) => {
      link.classList.remove('is-active');
    });

    if (firstVisibleLink) {
      firstVisibleLink.classList.add('is-active');
    }

    if (!firstVisibleLink && this.previousSection) {
      this.container
        .querySelector(`a[href="#${this.previousSection}"]`)
        .classList.add('is-active');
    }
  },

  observeSections() {
    this.headings.forEach((heading) => {
      this.observer.observe(heading);
    });
  },

  setUpObserver() {
    this.observer = new IntersectionObserver(
      this.handleObserver,
      this.intersectionOptions,
    );
  },

  findLinksAndHeadings() {
    this.links = [...this.container.querySelectorAll('a')];
    this.headings = this.links.map((link) => {
      let id = link.getAttribute('href');
      return document.querySelector(id);
    });
  },
};

export { highlightCurrentPositionInToc };
