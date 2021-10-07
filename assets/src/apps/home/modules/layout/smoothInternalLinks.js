export function smoothInternalLinks() {
  const wrapper = document.querySelector(".wrapper");
  const internalLinks = document.querySelectorAll("a[href^='#']");

  internalLinks.forEach((link) => {
    const id = "#" + link.href.split("#")[1];

    const target = document.querySelector(id);
    const rect = target.getBoundingClientRect();

    if (target) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const rect = target.getBoundingClientRect();

        wrapper.scrollTo({
          top: rect.top + wrapper.scrollTop,
          left: 0,
          behavior: "smooth",
        });
      });
    }
  });
}
