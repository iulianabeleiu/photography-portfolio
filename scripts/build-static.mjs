import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

let template = readFileSync(resolve(root, 'src/app/app.component.html'), 'utf8');

template = template
  .replace(/<button \*ngFor="let category of categories"[\s\S]*?<\/button>/, `
        <button type="button" class="active" data-category="All" aria-pressed="true">All</button>
        <button type="button" data-category="Places" aria-pressed="false">Places</button>
        <button type="button" data-category="People" aria-pressed="false">People</button>
        <button type="button" data-category="Street" aria-pressed="false">Street</button>`)
  .replace(/<div class="gallery"[\s\S]*?<\/div>\n  <\/section>/, '<div class="gallery" aria-live="polite"></div>\n  </section>')
  .replace(/<div class="lightbox"[\s\S]*$/, `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photograph viewer" hidden>
  <button class="lightbox-close" type="button" aria-label="Close image">Close</button>
  <button class="lightbox-nav prev" type="button" aria-label="Previous image">Previous</button>
  <figure><img src="photos/photo-01.svg" alt=""><figcaption><span data-lightbox-title></span><span data-lightbox-meta></span></figcaption></figure>
  <button class="lightbox-nav next" type="button" aria-label="Next image">Next</button>
</div>`)
  .replace(/\s(?:\([^)]+\)|\[[^\]]+\]|\*[\w-]+)="[^"]*"/g, '')
  .replace(/\{\{ menuOpen \? 'Close' : 'Menu' \}\}/g, 'Menu');

const globalCss = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
const componentCss = readFileSync(resolve(root, 'src/app/app.component.css'), 'utf8');
const body = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Between Light — Photography</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="A personal photography journal exploring people, place and the quiet moments between."><meta name="theme-color" content="#111210"><link rel="stylesheet" href="styles.css"></head><body>${template}<script src="app.js" defer></script></body></html>`;

writeFileSync(resolve(dist, 'index.html'), body);
writeFileSync(resolve(dist, 'styles.css'), `${globalCss}\n${componentCss}\n[hidden]{display:none!important}`);
cpSync(resolve(root, 'src/app/app.js'), resolve(dist, 'app.js'));
cpSync(resolve(root, 'public/photos'), resolve(dist, 'photos'), { recursive: true });
cpSync(resolve(root, '.openai'), resolve(dist, '.openai'), { recursive: true });
console.log('Static site built in dist/');
