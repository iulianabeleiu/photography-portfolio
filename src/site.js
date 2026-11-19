const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-navigation]');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  });
}

const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const thumbnails = [...document.querySelectorAll('[data-thumbnail]')];
  const title = document.querySelector('[data-photo-title]');
  const detail = document.querySelector('[data-photo-detail]');
  const counter = document.querySelector('[data-photo-counter]');
  let active = 0;
  function show(index, updateHash = true) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    thumbnails.forEach((thumbnail, i) => {
      const selected = i === active;
      thumbnail.classList.toggle('is-active', selected);
      thumbnail.setAttribute('aria-current', String(selected));
    });
    const current = slides[active];
    title.textContent = current.dataset.title;
    detail.textContent = current.dataset.detail;
    counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (updateHash) history.replaceState(null, '', `#${current.dataset.slug}`);
  }
  document.querySelector('[data-previous]').addEventListener('click', () => show(active - 1));
  document.querySelector('[data-next]').addEventListener('click', () => show(active + 1));
  thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => show(index)));
  document.querySelectorAll('.photo-index a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const slug = link.getAttribute('href').slice(1);
      const index = slides.findIndex((slide) => slide.dataset.slug === slug);
      if (index >= 0) {
        show(index);
        carousel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(active - 1);
    if (event.key === 'ArrowRight') show(active + 1);
  });
  const requested = location.hash.slice(1);
  const requestedIndex = slides.findIndex((slide) => slide.dataset.slug === requested);
  show(requestedIndex >= 0 ? requestedIndex : 0, false);
}
