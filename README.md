# Iuliana-Maria Burz — photography portfolio

A responsive, dependency-free presentation portfolio prepared for OpenAI Sites. It includes:

- focused Home, Portfolio, About and Contact pages
- one curated gallery with a keyboard-accessible overlay carousel
- individual photograph names and metadata
- a blue, grey and black visual system
- mobile navigation and reduced-motion support

## Production build

```bash
npm run build
```

No package installation is needed. The production output is written to `dist/` for Sites hosting.

## Customize

1. Replace the assets in `public/photos/` using its README.
2. Edit photograph titles in `src/content.mjs`.
3. Replace `hello@yourdomain.com`, Instagram, and the biography copy in `scripts/build-static.mjs`.
4. Connect the inquiry form to your preferred backend or form service.
5. Add a commerce provider when you are ready to sell prints.
