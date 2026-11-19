# Between Light — photography portfolio

A responsive, dependency-free portfolio prepared for OpenAI Sites. The source is split into template, style and behavior modules so it remains straightforward to move into Angular components later. It includes:

- filterable work gallery
- keyboard-accessible lightbox
- photographer story
- future-facing print and licensing section
- inquiry form UI
- mobile navigation and reduced-motion support

## Production build

```bash
npm run build
```

No package installation is needed. The production output is written to `dist/` for Sites hosting.

## Customize

1. Replace the assets in `public/photos/` using its README.
2. Edit gallery titles and metadata in `src/app/app.component.ts`.
3. Replace `hello@yourdomain.com`, Instagram, and the biography copy.
4. Connect the inquiry form to your preferred backend or form service.
5. Add a commerce provider when you are ready to sell prints.
