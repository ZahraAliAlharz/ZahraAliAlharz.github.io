# ZahraAliAlharz.github.io

Personal site, plain HTML/CSS, no build step. Deploys automatically via
GitHub Pages once this repo is named `<username>.github.io` and pushed
to `main` — no extra configuration needed.

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
```

## Structure

- `index.html` — all content
- `style.css` — all styling (dark theme by default, light theme via
  `prefers-color-scheme`)
- `.nojekyll` — tells GitHub Pages to serve the files as-is
