import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { collections } from '../src/content.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, 'collections'), { recursive: true });
const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230c2d47'/%3E%3Ccircle cx='32' cy='32' r='14' fill='none' stroke='%23c5dce9' stroke-width='6'/%3E%3C/svg%3E";

function header(current = '', home = false, prefix = '') {
  const selected = (name) => current === name ? " aria-current='page'" : '';
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header ${home ? 'home-header' : ''}"><a class="brand" href="${prefix}index.html" aria-label="Iuliana-Maria Burz home"><span>Iuliana-Maria</span><span>Burz</span></a><button class="menu-button" type="button" data-menu-button aria-expanded="false">Menu</button><nav class="site-nav" data-navigation aria-label="Primary navigation"><div class="nav-left"><a href="${prefix}portfolio.html"${selected('portfolio')}>Portfolio</a><a href="${prefix}portfolio.html#series">Projects</a></div><div class="nav-right"><a href="${prefix}about.html"${selected('about')}>About</a><a href="${prefix}prints.html"${selected('prints')}>Prints</a><a href="${prefix}contact.html"${selected('contact')}>Contact</a></div></nav></header>`;
}

function footer(prefix = '') {
  return `<footer class="site-footer"><a class="brand" href="${prefix}index.html"><span>Iuliana-Maria</span><span>Burz</span></a><p>Photography · Personal work and visual stories.</p><p>© 2026 · Instagram</p></footer>`;
}

function document({ title, description, body, current = '', home = false, prefix = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#071a2a"><link rel="icon" href="${favicon}"><link rel="stylesheet" href="${prefix}site.css"></head><body>${header(current, home, prefix)}${body}${footer(prefix)}<script src="${prefix}site.js" defer></script></body></html>`;
}

const seriesCards = collections.map((collection, index) => `<a class="series-card" href="collections/${collection.slug}.html"><img src="${collection.cover}" alt="${collection.category} series placeholder"><span class="series-card__number">${String(index + 1).padStart(2, '0')}</span><span class="series-card__overlay"><h2>${collection.title}</h2><p>${collection.category}</p></span></a>`).join('');

writeFileSync(resolve(dist, 'index.html'), document({
  title: 'Iuliana-Maria Burz — Photography', description: 'The photography portfolio and visual stories of Iuliana-Maria Burz.', home: true,
  body: `<main id="main"><section class="home-hero"><img src="photos/hero.svg" alt="Replaceable hero photograph placeholder"><div class="home-hero__copy"><h1>Look<br>closer.</h1><div><p>Personal photographs about places, people and the quiet moments that connect them.</p><a class="text-link" href="portfolio.html">Enter portfolio</a></div></div></section><section class="section"><div class="section-intro"><div><p class="eyebrow">Selected stories</p><h2 class="section-title">Three ways of seeing.</h2></div><p>Explore individual photographs or enter a series to experience the work as a visual story.</p></div><div class="series-grid">${seriesCards}</div></section></main>`
}));

writeFileSync(resolve(dist, 'portfolio.html'), document({
  title: 'Portfolio — Iuliana-Maria Burz', description: 'Selected photography series by Iuliana-Maria Burz.', current: 'portfolio',
  body: `<main id="main"><section class="page-hero"><p class="eyebrow">Iuliana-Maria Burz</p><h1>Portfolio</h1><p>A growing archive of personal work, organised as photographic series. Hover to discover each collection; open one to explore its story and named photographs.</p></section><section class="section" id="series"><div class="series-grid">${seriesCards}</div></section><section class="section portfolio-note"><p class="eyebrow">The approach</p><p>I photograph what happens between the obvious moments—when light, movement and attention briefly align.</p></section></main>`
}));

for (const collection of collections) {
  const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const slides = collection.photos.map((photo, index) => `<figure class="carousel__slide ${index === 0 ? 'is-active' : ''}" data-slide data-title="${photo.title}" data-detail="${photo.detail}" data-slug="${slugify(photo.title)}"><img src="../${photo.src}" alt="${photo.alt}"></figure>`).join('');
  const thumbs = collection.photos.map((photo, index) => `<button class="thumbnail ${index === 0 ? 'is-active' : ''}" type="button" data-thumbnail aria-label="Show ${photo.title}" aria-current="${index === 0}"><img src="../${photo.src}" alt=""></button>`).join('');
  const photoIndex = collection.photos.map((photo) => `<article><a href="#${slugify(photo.title)}"><img src="../${photo.src}" alt="${photo.alt}"><h3>${photo.title}</h3><p>${photo.detail}</p></a></article>`).join('');
  const body = `<main id="main"><section class="collection-header"><div><p class="eyebrow">${collection.category}</p><h1>${collection.title}</h1></div><div class="collection-header__copy"><p class="eyebrow">About the series</p><p>${collection.description}</p></div></section><section class="carousel-shell"><div class="carousel" data-carousel>${slides}</div><div class="carousel__controls"><button type="button" data-previous>Previous</button><div class="photo-caption"><strong data-photo-title></strong><span data-photo-detail></span></div><button type="button" data-next>Next</button></div><div class="carousel__counter" data-photo-counter></div><div class="thumbnail-strip">${thumbs}</div></section><section class="section"><div class="section-intro"><div><p class="eyebrow">Image index</p><h2 class="section-title">The photographs</h2></div><p>Each photograph carries its own title and place in the series. Select a frame to return to it in the carousel.</p></div><div class="photo-index">${photoIndex}</div></section></main>`;
  writeFileSync(resolve(dist, 'collections', `${collection.slug}.html`), document({ title: `${collection.title} — Iuliana-Maria Burz`, description: collection.description, body, current: 'portfolio', prefix: '../' }));
}

writeFileSync(resolve(dist, 'about.html'), document({
  title: 'About — Iuliana-Maria Burz', description: 'About photographer Iuliana-Maria Burz.', current: 'about',
  body: `<main id="main"><section class="about-layout"><div class="about-copy"><p class="eyebrow">About</p><h1>Between systems<br>and instinct.</h1><p>I’m Iuliana-Maria Burz. I work in technology, where my days are shaped by systems, structure and precise solutions. Photography gives me another way to pay attention—slower, more intuitive and led by curiosity.</p><p>This portfolio is a growing collection of personal work: places I return to, people I meet, and fragments of everyday life held in light.</p><p><a class="text-link" href="contact.html">Start a conversation</a></p></div><div class="about-image"><img src="photos/about.svg" alt="Replaceable portrait of Iuliana-Maria Burz"></div></section></main>`
}));

writeFileSync(resolve(dist, 'contact.html'), document({
  title: 'Contact — Iuliana-Maria Burz', description: 'Contact Iuliana-Maria Burz about photography, prints and collaborations.', current: 'contact',
  body: `<main id="main"><section class="contact-layout"><div><p class="eyebrow">Contact</p><h1>Let’s make<br>something.</h1><p>For collaborations, personal projects, print questions or simply to say hello.</p><p><a href="mailto:hello@yourdomain.com">hello@yourdomain.com</a></p></div><form class="contact-form" onsubmit="event.preventDefault(); this.reset(); document.querySelector('[data-form-note]').textContent='The form design works. Connect your email service before launch.'"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" rows="5" required></textarea></label><button type="submit">Send inquiry</button><p class="form-note" data-form-note>Demo form—connect an email or form service before public launch.</p></form></section></main>`
}));

writeFileSync(resolve(dist, 'prints.html'), document({
  title: 'Prints — Iuliana-Maria Burz', description: 'Fine-art photography prints by Iuliana-Maria Burz, coming soon.', current: 'prints',
  body: `<main id="main"><section class="prints-page"><div><p class="eyebrow">Fine-art prints</p><h1>Coming<br>into view.</h1><p>Selected photographs will be available as signed fine-art prints. Until the shop opens, contact me about a photograph, size or editorial licence.</p><a class="text-link" href="contact.html">Ask about a photograph</a></div></section></main>`
}));

writeFileSync(resolve(dist, 'site.css'), readFileSync(resolve(root, 'src/site.css')));
writeFileSync(resolve(dist, 'site.js'), readFileSync(resolve(root, 'src/site.js')));
cpSync(resolve(root, 'public/photos'), resolve(dist, 'photos'), { recursive: true });
cpSync(resolve(root, '.openai'), resolve(dist, '.openai'), { recursive: true });
console.log(`Built ${collections.length + 5} pages in dist/`);
