# Markdown Live Preview (RTL)

A fork of [tanabe/markdown-live-preview](https://github.com/tanabe/markdown-live-preview) (MIT) with right-to-left support for Persian, Arabic and Hebrew.

## What changed

- **Direction button** in the header, cycling `Auto → RTL → LTR` (the choice is remembered):
  - **Auto** (default): every paragraph, heading, list, quote and table picks its own direction from its first letter, so Persian and English can live in the same document.
  - **RTL**: the whole preview is right-to-left.
  - **LTR**: the original behaviour.
- Lists, quotes and tables are mirrored properly (bullets, indentation and the quote bar move to the right).
- Code blocks and inline code always stay left-to-right.
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font (SIL OFL) for Persian/Arabic characters only; Latin text keeps the normal font.
- Removed the upstream author's Google Analytics tag.
- Builds with relative URLs, so it works on GitHub Pages under `/<repo>/`.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # output in dist/
```

## Deploy

Every push to `main` is built and published by `.github/workflows/deploy.yml`.
Once, in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Notes

The editor is Monaco, which has no native RTL support. In **Auto** each editor line gets its own base direction (`unicode-bidi: plaintext`); in **RTL** the editor text direction is flipped. See the bottom of `public/css/style.css` if you want to tune it.

## License

MIT, same as upstream (see `LICENSE`). The Vazirmatn font is under the SIL Open Font License (`public/fonts/OFL-Vazirmatn.txt`).
