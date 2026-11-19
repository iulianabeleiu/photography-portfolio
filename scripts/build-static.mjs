import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { portfolioPhotos } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230c2d47'/%3E%3Ccircle cx='32' cy='32' r='14' fill='none' stroke='%23c5dce9' stroke-width='6'/%3E%3C/svg%3E";
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function header(current = '', home = false) {
  const selected = (name) => current === name ? " aria-current='page'" : '';
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header ${home ? 'home-header' : ''}"><a class="brand" href="index.html" aria-label="Iuliana-Maria Burz home"><span>Iuliana-Maria</span><span>Burz</span></a><button class="menu-button" type="button" data-menu-button aria-expanded="false">Menu</button><nav class="site-nav" data-navigation aria-label="Primary navigation"><div class="nav-left"><a href="portfolio.html"${selected('portfolio')}>Portfolio</a></div><div class="nav-right"><a href="about.html"${selected('about')}>About</a><a href="contact.html"${selected('contact')}>Contact</a></div></nav></header>`;
}

function footer() {
  return `<footer class="site-footer"><a class="brand" href="index.html"><span>Iuliana-Maria</span><span>Burz</span></a><p>Photography · Personal work and observations.</p><p>© 2026 · Instagram</p></footer>`;
}

function document({ title, description, body, current = '', home = false }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#071a2a"><link rel="icon" href="${favicon}"><link rel="stylesheet" href="site.css"></head><body>${header(current, home)}${body}${footer()}<script src="site.js" defer></script></body></html>`;
}

function gallery(photos, limit = photos.length) {
  return photos.slice(0, limit).map((photo, index) => `<article><button class="photo-index__button" type="button" data-open-photo="${index}" aria-label="Open ${photo.title} in carousel"><img src="${photo.src}" alt="${photo.alt}"><span class="photo-index__title">${photo.title}</span><span class="photo-index__detail">${photo.detail}</span></button></article>`).join('');
}

function lightbox(photos) {
  const slides = photos.map((photo, index) => `<figure class="lightbox__slide ${index === 0 ? 'is-active' : ''}" data-slide data-title="${photo.title}" data-detail="${photo.detail}" data-slug="${slugify(photo.title)}"><img src="${photo.src}" alt="${photo.alt}"></figure>`).join('');
  const thumbs = photos.map((photo, index) => `<button class="lightbox__thumb ${index === 0 ? 'is-active' : ''}" type="button" data-thumbnail aria-label="Show ${photo.title}" aria-current="${index === 0}"><img src="${photo.src}" alt=""></button>`).join('');
  return `<div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true" aria-label="Photograph carousel"><button class="lightbox__close" type="button" data-close>Close</button><div class="lightbox__stage"><button class="lightbox__nav lightbox__nav--previous" type="button" data-previous>Previous</button><div class="lightbox__viewport">${slides}</div><button class="lightbox__nav lightbox__nav--next" type="button" data-next>Next</button></div><div class="lightbox__meta"><div class="photo-caption"><strong data-photo-title></strong><span data-photo-detail></span></div><span class="lightbox__counter" data-photo-counter></span></div><div class="lightbox__thumbs">${thumbs}</div></div>`;
}

const homeGallery = portfolioPhotos.slice(0, 3).map((photo) => `<a class="home-photo" href="portfolio.html"><img src="${photo.src}" alt="${photo.alt}"><span>${photo.title}</span></a>`).join('');

writeFileSync(resolve(dist, 'index.html'), document({
  title: 'Iuliana-Maria Burz — Photography', description: 'The photography portfolio of Iuliana-Maria Burz.', home: true,
  body: `<main id="main"><section class="home-hero"><img src="photos/hero.jpg" alt="Golden winter mountain landscape at sunset" data-parallax-image><div class="home-hero__copy" data-parallax-copy><h1>Look<br>closer.</h1><div><p>A personal photography practice shaped by places, people and passing light.</p><a class="text-link" href="portfolio.html">View portfolio</a></div></div><div class="home-hero__scroll" aria-hidden="true"><span>Scroll to discover</span><i></i></div></section><section class="section" data-reveal><div class="section-intro"><div><p class="eyebrow">Selected photographs</p><h2 class="section-title">A way of paying attention.</h2></div><p>Photography is where I slow down and notice what might otherwise pass unseen.</p></div><div class="home-gallery">${homeGallery}</div><p class="home-gallery__link"><a class="text-link" href="portfolio.html">See the full portfolio</a></p></section><section class="home-about" data-reveal><div class="home-about__heading"><p class="eyebrow">About</p><h2>Two ways<br>of seeing.</h2></div><div class="home-about__copy"><p>I’m Iuliana-Maria Burz. I work in technology and photograph from curiosity—moving between structure and instinct.</p><p>Photography is where I slow down, follow the light and keep the moments that might otherwise pass unnoticed.</p><a class="text-link" href="about.html">Read my story</a></div></section></main>`
}));

writeFileSync(resolve(dist, 'portfolio.html'), document({
  title: 'Portfolio — Iuliana-Maria Burz', description: 'Selected photographs by Iuliana-Maria Burz.', current: 'portfolio',
  body: `<main id="main"><section class="page-hero"><p class="eyebrow">Iuliana-Maria Burz</p><h1>Portfolio</h1><p>A curated selection of places, people and everyday observations. Select any photograph to open the full-screen carousel.</p></section><section class="section"><div class="photo-index photo-index--portfolio">${gallery(portfolioPhotos)}</div></section></main>${lightbox(portfolioPhotos)}`
}));

writeFileSync(resolve(dist, 'about.html'), document({
  title: 'About — Iuliana-Maria Burz', description: 'About photographer Iuliana-Maria Burz.', current: 'about',
  body: `<main id="main"><section class="about-layout"><div class="about-copy"><p class="eyebrow">About</p><h1>Between systems<br>and instinct.</h1><p>I’m Iuliana-Maria Burz. I work in technology, where my days are shaped by systems, structure and precise solutions. Photography gives me another way to pay attention—slower, more intuitive and led by curiosity.</p><p>This portfolio is a growing collection of personal work: places I return to, people I meet, and fragments of everyday life held in light.</p><p><a class="text-link" href="portfolio.html">View my portfolio</a></p></div><div class="about-image"><img src="photos/about.svg" alt="Replaceable portrait of Iuliana-Maria Burz"></div></section></main>`
}));

writeFileSync(resolve(dist, 'contact.html'), document({
  title: 'Contact — Iuliana-Maria Burz', description: 'Contact Iuliana-Maria Burz about photography and collaborations.', current: 'contact',
  body: `<main id="main"><section class="contact-layout"><div><p class="eyebrow">Contact</p><h1>Say<br>hello.</h1><p>For collaborations, portfolio questions or simply to start a conversation.</p><p><a href="mailto:hello@yourdomain.com">hello@yourdomain.com</a></p></div><form class="contact-form" onsubmit="event.preventDefault(); this.reset(); document.querySelector('[data-form-note]').textContent='The form design works. Connect your email service before launch.'"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" rows="5" required></textarea></label><button type="submit">Send inquiry</button><p class="form-note" data-form-note>Demo form—connect an email or form service before public launch.</p></form></section></main>`
}));

writeFileSync(resolve(dist, 'site.css'), readFileSync(resolve(root, 'src/site.css')));
writeFileSync(resolve(dist, 'site.js'), readFileSync(resolve(root, 'src/site.js')));
cpSync(resolve(root, 'public/photos'), resolve(dist, 'photos'), { recursive: true });
cpSync(resolve(root, '.openai'), resolve(dist, '.openai'), { recursive: true });
console.log('Built 4 presentation pages in dist/');
