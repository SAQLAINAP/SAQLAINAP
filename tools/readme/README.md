# readme-kit

Generates the SVG panels for the profile README, all in the same design system as `assets/header.svg`.

```bash
npm ci
npm run build                                  # static panels -> ../../assets
GH_PULSE=$(gh auth token) npm run pulse        # stats panel -> ../../assets/pulse.svg
```

- Content lives in `data.mjs`, and the design primitives (cards, chips, headings, sparkles) in `lib.mjs`.
- Text is converted to outlines with opentype.js, so the panels look the same on every OS. The fonts are Archivo Black and JetBrains Mono (OFL; licences in `fonts/`).
- `.github/workflows/pulse.yml` refreshes the stats panel daily.
