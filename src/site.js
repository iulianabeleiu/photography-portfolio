const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-navigation]');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  });
}

const lightbox = document.querySelector('[data-lightbox]');
if (lightbox) {
  const slides = [...lightbox.querySelectorAll('[data-slide]')];
  const thumbnails = [...lightbox.querySelectorAll('[data-thumbnail]')];
  const openButtons = [...document.querySelectorAll('[data-open-photo]')];
  const title = lightbox.querySelector('[data-photo-title]');
  const detail = lightbox.querySelector('[data-photo-detail]');
  const counter = lightbox.querySelector('[data-photo-counter]');
  const closeButton = lightbox.querySelector('[data-close]');
  let active = 0;
  let returnFocus = null;

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

  function open(index, trigger) {
    returnFocus = trigger;
    show(index);
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    history.replaceState(null, '', location.pathname);
    returnFocus?.focus();
  }

  openButtons.forEach((button, index) => button.addEventListener('click', () => open(index, button)));
  lightbox.querySelector('[data-previous]').addEventListener('click', () => show(active - 1));
  lightbox.querySelector('[data-next]').addEventListener('click', () => show(active + 1));
  thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => show(index)));
  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(active - 1);
    if (event.key === 'ArrowRight') show(active + 1);
  });

  const requested = location.hash.slice(1);
  const requestedIndex = slides.findIndex((slide) => slide.dataset.slug === requested);
  if (requestedIndex >= 0) open(requestedIndex, openButtons[requestedIndex]);
}
