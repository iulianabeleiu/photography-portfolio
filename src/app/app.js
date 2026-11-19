const photographs = [
  { title: 'Where the road softens', place: 'Transylvania', year: '2026', category: 'Places', src: 'photos/photo-01.svg', alt: 'Placeholder for a wide landscape photograph', ratio: 'landscape' },
  { title: 'A city holding its breath', place: 'Bucharest', year: '2026', category: 'Street', src: 'photos/photo-02.svg', alt: 'Placeholder for an architectural street photograph', ratio: 'portrait' },
  { title: 'Soft weather', place: 'Studio journal', year: '2025', category: 'People', src: 'photos/photo-03.svg', alt: 'Placeholder for an intimate portrait photograph', ratio: 'portrait' },
  { title: 'Edge of the continent', place: 'Atlantic coast', year: '2025', category: 'Places', src: 'photos/photo-04.svg', alt: 'Placeholder for an aerial coastline photograph', ratio: 'landscape' },
  { title: 'Last tram home', place: 'Bucharest', year: '2025', category: 'Street', src: 'photos/photo-05.svg', alt: 'Placeholder for a night street photograph', ratio: 'landscape' },
  { title: 'Sunday light', place: 'Personal work', year: '2024', category: 'People', src: 'photos/photo-06.svg', alt: 'Placeholder for a quiet environmental portrait', ratio: 'portrait' }
];

let activeCategory = 'All';
let activeIndex = null;

const gallery = document.querySelector('.gallery');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxTitle = lightbox.querySelector('[data-lightbox-title]');
const lightboxMeta = lightbox.querySelector('[data-lightbox-meta]');

function filteredPhotos() {
  return activeCategory === 'All' ? photographs : photographs.filter((photo) => photo.category === activeCategory);
}

function renderGallery() {
  gallery.innerHTML = filteredPhotos().map((photo, index) => `
    <article class="photo-card ${photo.ratio === 'portrait' ? 'portrait' : ''}">
      <button type="button" data-photo-index="${index}" aria-label="Open ${photo.title}">
        <span class="image-wrap"><img src="${photo.src}" alt="${photo.alt}" loading="lazy"></span>
        <span class="photo-meta"><span>${photo.title}</span><span>${photo.place} · ${photo.year}</span></span>
      </button>
    </article>`).join('');

  gallery.querySelectorAll('[data-photo-index]').forEach((button) => {
    button.addEventListener('click', () => openPhoto(Number(button.dataset.photoIndex)));
  });
}

function openPhoto(index) {
  activeIndex = index;
  const photo = filteredPhotos()[index];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxMeta.textContent = `${photo.place} · ${photo.year}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}

function closePhoto() {
  activeIndex = null;
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function stepPhoto(direction) {
  if (activeIndex === null) return;
  const total = filteredPhotos().length;
  openPhoto((activeIndex + direction + total) % total);
}

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderGallery();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closePhoto);
lightbox.querySelector('.prev').addEventListener('click', () => stepPhoto(-1));
lightbox.querySelector('.next').addEventListener('click', () => stepPhoto(1));

document.addEventListener('keydown', (event) => {
  if (activeIndex === null) return;
  if (event.key === 'Escape') closePhoto();
  if (event.key === 'ArrowLeft') stepPhoto(-1);
  if (event.key === 'ArrowRight') stepPhoto(1);
});

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
function closeMenu() {
  header.classList.remove('menu-open');
  menuButton.textContent = 'Menu';
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.textContent = open ? 'Close' : 'Menu';
  menuButton.setAttribute('aria-expanded', String(open));
});
header.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  const message = document.querySelector('.success-message');
  message.hidden = false;
  window.setTimeout(() => { message.hidden = true; }, 5000);
});

renderGallery();
