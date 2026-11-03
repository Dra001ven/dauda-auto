# Image workflows (cars / DOSLA site)

Goal: real, legally usable car photos with transparent backgrounds, saved locally in `public/cars/`.
Never hotlink; always download. Keep keys in `.env` (git-ignored), never in chat or code.

## 0. One-time setup (done)
- Python 3.12 via `uv` (macOS 12 here; Python 3.14 has no onnxruntime wheel):
  `curl -LsSf https://astral.sh/uv/install.sh | sh`
  `uv venv --python 3.12 .venv-img`
  `uv pip install --python .venv-img/bin/python --only-binary=:all: "rembg[cli]" onnxruntime pillow "numba<0.61" "llvmlite<0.44"`
  (the `numba`/`llvmlite` pins avoid a source build that fails on this Mac)
- rembg downloads its model once (~180 MB) to `~/.u2net/`.

## 1. Wikimedia Commons  (BEST: keyless, full-resolution real photos)
- Needs: nothing. Send a descriptive `User-Agent`. Pause 2-3 s between calls (it rate-limits bursts).
- Search: `commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=<term> filetype:bitmap&gsrnamespace=6&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2400`
- Download the `thumburl` (up to 3840 px wide).
- License: mostly CC BY-SA / CC BY -> credit the author in the footer (author + license + "via Wikimedia Commons"). Check `extmetadata.LicenseShortName`; skip NC licences.
- Photos have backgrounds -> go to step 4.

## 2. Pixabay API  (free key, instant; weak for cars)
- Needs: free key from pixabay.com/api/docs (logged in). Store as `PIXABAY_KEY` in `.env`.
- Free tier max 1280 px (`largeImageURL`); full size needs "full API access" approval.
- `colors=transparent` returns ready cut-outs, but mostly renders / models / classics.
- Rules: download, don't hotlink; cache 24 h; show "images via Pixabay".

## 3. Others
| Source | Key? | Status / notes |
|---|---|---|
| Unsplash API | free demo key (50 req/h) | best photo quality; site blocks scraping, API only |
| Pexels API | free key | new keys paused as of 2026-11-03 |
| Pinterest | API needs app approval, no useful search | images are copyrighted; use only as inspiration |
| Dribbble | API only exposes your own shots | copyrighted; inspiration only |
| remove.bg | free key | free output is low-res; rembg is better here |

## 4. Background removal (rembg, local, free)
```
.venv-img/bin/python - <<'PY'
from rembg import remove, new_session
from PIL import Image
s = new_session("isnet-general-use")
im = Image.open("work/raw/NAME.jpg").convert("RGB")
out = remove(im, session=s); out = out.crop(out.getbbox())
out.thumbnail((1800, 1800)); out.save("public/cars/NAME.png", optimize=True)
PY
```
Pick source photos with: one car, clean edges, no people/poles/other cars nearby (rembg keeps
neighbouring objects: ghost SUV and a pole survived on two of the SF90 shots).

## 5. Wire into the site
- Put files in `public/cars/`, reference as `/cars/NAME.png`.
- Add credit line to the footer in `src/dosla/Dosla.jsx`.

## 6. Recolour + cleanup (used for the IL CORSA side view)
- Source was a blue F8 on a show stand. After rembg: keep the largest alpha component
  (`scipy.ndimage.label`), then blank rectangles that still contain a person / second car.
- Hue shift only saturated blue pixels (HSV hue 130-190 of 255) by +100 -> red. Metallic
  highlights stay slightly silver-blue; acceptable.
- Cover dealer plates/text with a dark patch inside the alpha mask (`im.paste(patch, box, alpha.crop(box))`).

## 7. Gallery crops
Gallery tiles are plain crops (no cutout) of the raw 3840 px photos, resized to 900x1000 JPEG.

## 8. Screenshot-compare loop (how the 90% match was reached)
- `work/compare.sh <tag>` renders the home page at 1472 px (2x the 736 px comp) with reduced motion
  forced and writes `work/cmp-<tag>.jpg`: reference left, build right.
- `work/shot.py <url> <out.png> [w] [h]` = full-page capture at a real viewport through Chrome DevTools
  (scrolls first so scroll-reveals fire). Needs `--remote-allow-origins=*` on Chrome.
- Home CSS is written in reference pixels: `1u = 100vw / 736`, so measurements from the comp go
  straight into `calc(var(--u) * N)`.

## 9. Picking photos
Not limited to one brand. Search Commons for a model, pull 600 px previews into `work/prev/`, build a
contact sheet, then fetch the winners at 3840 px with `work/fetch.py 3840 <dir>` (names on stdin as
`key=File title.jpg`). Prefer: one car, clean edges, nothing touching it, front 3/4 or pure side view.
Cover plates with a dark patch; mirror with `ImageOps.mirror` when the pose faces the wrong way.

## Current assets (public/img/)
| File | Source on Wikimedia Commons | Author, licence |
|---|---|---|
| car-hero.png | Lamborghini Revuelto DSC 6985 (cropped).jpg (cutout, plate covered, padded to 2.5:1) | Alexander Migl, CC BY-SA 4.0 |
| work/hero-opt/* | rejected hero options (STO, 750S red, GT3 RS red) kept for reference | |
| car-side.png, paint-*.png | Ferrari F8 Tributo, GIMS 2019 (cutout, recoloured) | CC BY-SA 4.0 |
| hero-bg.jpg | Milan Porta Nuova business district by night 02.jpg (+ synthetic reflection) | pjhooker, CC BY-SA 3.0 |
| duomo-line.png | Duomo di Milano, facciata, 17 giugno 2025.jpg (edge-traced) | Francesca Milanini, CC BY-SA 4.0 |
| crest.png | Lion rampant crowned.png (tinted, in drawn shield) | ImperialHerald, CC0 |
| interior.jpg, p6 | Ferrari Roma-08.jpg | CC BY-SA 4.0 |
| g1, x-artura | McLaren Artura 3.jpg | Calreyn88, CC BY-SA 4.0 |
| g2, x-sto, x-sto-wheel | Lamborghini Huracan STO 1X7A0297.jpg | Alexander Migl, CC BY-SA 4.0 |
| x-revuelto | Lamborghini Revuelto DSC 6985 (cropped).jpg | Alexander Migl, CC BY-SA 4.0 |
| x-750s, x-750s-nose, x-750s-stand | 2024 McLaren 750S 2 / 5.jpg | Calreyn88, CC BY-SA 4.0 |
| x-gt3rs | Porsche 992 GT3 RS DSC 9055.jpg | Alexander Migl, CC BY-SA 4.0 |
| x-sto-blu | Lamborghini Huracan STO 22.jpg | Calreyn88, CC BY-SA 4.0 |
| x-mc20 | Maserati MC20 Auto Zuerich 2021 IMG 0419.jpg | Alexander Migl, CC BY-SA 4.0 |
| g3, g5, p1, p3-p5, p7, g4 | SF90 / Roma / Ginza F8 / F8 GIMS photos (see sections above) | CC BY-SA 3.0 / 4.0 |
| wireframe.png | edge trace of car-side.png | derived |
