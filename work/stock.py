"""Stock pipeline for the Dauda Motos inventory (downloads/images -> public/stock).

  .venv-img/bin/python work/stock.py prep      crop / rotate each source view  -> work/stock/src/<view>.png
  .venv-img/bin/python work/stock.py upscale   Real-ESRGAN x4 (~/.cache/esrgan/x4.onnx), fit to 1800px -> public/stock/<view>.jpg
  .venv-img/bin/python work/stock.py masks     paint / trim masks for the customiser  -> public/stock/<view>-mask.png

A mask is white where the customiser may recolour (body paint on exterior views, leather on
interior views). Rules live in VIEWS below: each view says which colour family is "paint".
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "downloads" / "images"
WORK = ROOT / "work" / "stock"
OUT = ROOT / "public" / "stock"

# view id: (source file, rotate (PIL, ccw degrees), crop box in source px or None, mask rule)
# mask rule: (kind, params)
#   hue   : body is a saturated colour; params = (hue_lo, hue_hi) in 0-360, min saturation
#   white : bright, low-saturation body;      params = min value
#   seed  : flood from seed points (fractions of w,h) with a Lab tolerance (dark/grey bodies)
VIEWS = {
    "911-rear34":   ("images (1).jpeg", 0, (0, 0, 235, 142), ("hue", (315, 28, 0.2))),
    "911-cabin":    ("images (1).jpeg", 0, (0, 142, 235, 280), ("hue", (320, 360, 0.30))),
    "911-rear":     ("images (3).jpeg", 0, (36, 322, 415, 528), ("hue", (315, 28, 0.18))),
    "911-wheel":    ("images (3).jpeg", 0, (36, 528, 415, 737), ("hue", (330, 32, 0.16))),
    "911-front":    ("images (4).jpeg", 0, (0, 170, 335, 450), None),  # black car in a B&W photo: glass = paint, view only
    "bentley-cabin": ("images (2).jpeg", 0, None, ("hue", (320, 360, 0.30))),
    "amg-gt":       ("images (5).jpeg", 90, None, ("car", 0.12)),
    "challenger":   ("images (6).jpeg", 90, None, None),  # black car on a dark scene: no clean paint mask, view only
    "r8":           ("images (9).jpeg", 0, None, ("seed", ([(0.5, 0.3), (0.3, 0.45), (0.85, 0.35)], 10))),
    "812":          ("images (10).jpeg", -90, None, ("hue", (340, 20, 0.45))),
    "f40":          ("images (11).jpeg", 0, None, ("white", 0.55)),
    "sf90":         ("images (13).jpeg", 0, None, ("white", 0.62)),
    "m3":           ("images (14).jpeg", 0, None, ("white", 0.62)),
    "jesko":        ("images (15).jpeg", 0, None, ("white", 0.62)),
    "tucson":       ("240_F_786288091_hgPWilp7OUquyjjFysRRLM1Dldm2UhzU.jpg", 0, None, ("hue", (340, 15, 0.40))),
    # design studies (renders): recolourable too
    "study-lumen":  ("240_F_671736740_HgL4qxhxx7AYtUrbCG91VyEdGHKIX9nI.jpg", 0, None, ("white", 0.6)),
    "study-rosso":  ("240_F_1714168222_wMXuEF5C3kOI9OuPALDU4lGJqnnYfFHK.jpg", 0, None, ("hue", (330, 20, 0.35))),
    "study-notte":  ("240_F_1836101810_dgtVYuj3HTrWbHqdGlUQbka3c0SRu1Vu.jpg", 0, None, ("hue", (200, 250, 0.20))),
    "study-sabbia": ("images (7).jpeg", 0, None, ("seed", ([(0.55, 0.55), (0.62, 0.62), (0.4, 0.6)], 10))),
    "study-luce":   ("images (8).jpeg", 0, None, None),
    "study-corsa":  ("images (12).jpeg", 0, None, ("white", 0.6)),
    # scenery (no customiser)
    "hypercars":    ("images (16).jpeg", 0, None, None),
    "lot-aerial":   ("E10FZVNE.avif", 0, None, None),
}


# areas never to recolour, as polygons in fractions of width/height (mostly windscreens)
EXCLUDE = {
    # wheels, tyres and lamps are excluded so only bodywork changes colour
    "911-rear34": [("ellipse", 0.36, 0.70, 0.068, 0.19), ("ellipse", 0.08, 0.335, 0.052, 0.18)],
    "911-rear": [("ellipse", 0.585, 0.655, 0.085, 0.21), ("ellipse", 0.94, 0.38, 0.065, 0.17)],
    "f40": [("ellipse", 0.222, 0.482, 0.022, 0.072), ("ellipse", 0.373, 0.546, 0.031, 0.1)],
    "sf90": [("ellipse", 0.35, 0.645, 0.068, 0.1), ("ellipse", 0.065, 0.565, 0.048, 0.085)],
    "jesko": [("ellipse", 0.159, 0.562, 0.04, 0.125), ("ellipse", 0.50, 0.652, 0.06, 0.135)],
    "amg-gt": [[(0.40, 0.25), (0.73, 0.25), (0.70, 0.44), (0.36, 0.45)],                       # windscreen
               [(0.70, 0.30), (0.80, 0.33), (0.79, 0.42), (0.69, 0.42)],                       # side window
               [(0.185, 0.56), (0.30, 0.545), (0.44, 0.555), (0.445, 0.695), (0.19, 0.69)],   # grille
               [(0.47, 0.555), (0.53, 0.50), (0.585, 0.475), (0.592, 0.52), (0.56, 0.59), (0.48, 0.605)],  # headlight R
               [(0.162, 0.52), (0.195, 0.50), (0.19, 0.60), (0.16, 0.60)],                    # headlight L
               ("ellipse", 0.645, 0.70, 0.048, 0.125), ("ellipse", 0.835, 0.60, 0.03, 0.10)],  # wheels
    "challenger": [
        [(0.39, 0.24), (0.80, 0.22), (0.80, 0.41), (0.38, 0.41)],          # windscreen
        [(0.15, 0.41), (0.46, 0.41), (0.46, 0.55), (0.15, 0.55)],          # grille + lamps
        [(0.14, 0.58), (0.52, 0.58), (0.52, 0.72), (0.14, 0.72)],          # lower intake / splitter
        [(0.53, 0.47), (0.66, 0.47), (0.66, 0.80), (0.53, 0.80)],          # front wheel
        [(0.86, 0.40), (0.95, 0.40), (0.95, 0.72), (0.86, 0.72)],          # rear wheel
    ],
    "r8": [[(0.36, 0.56), (1.0, 0.56), (1.0, 0.9), (0.36, 0.9)]],     # honeycomb grille
    "tucson": [[(0.37, 0.0), (1.0, 0.0), (1.0, 1.0), (0.37, 1.0)]],   # the rest of the dealer row
    "812": [("circle", 0.214, 0.705, 0.074), ("circle", 0.793, 0.705, 0.074)],  # wheels (cx, cy, r as fraction of width)
}


def prep():
    (WORK / "src").mkdir(parents=True, exist_ok=True)
    for vid, (f, rot, box, _) in VIEWS.items():
        im = Image.open(SRC / f).convert("RGB")
        if box: im = im.crop(box)
        if rot: im = im.rotate(rot, expand=True)
        im.save(WORK / "src" / f"{vid}.png")
        print(vid, im.size)


def esrgan(im, sess, tile=192, pad=12):
    a = np.asarray(im, dtype=np.float32) / 255.0
    h, w, _ = a.shape
    out = np.zeros((h * 4, w * 4, 3), np.float32)
    name = sess.get_inputs()[0].name
    for y in range(0, h, tile):
        for x in range(0, w, tile):
            y0, x0 = max(0, y - pad), max(0, x - pad)
            y1, x1 = min(h, y + tile + pad), min(w, x + tile + pad)
            t = a[y0:y1, x0:x1].transpose(2, 0, 1)[None]
            r = sess.run(None, {name: t})[0][0].transpose(1, 2, 0)
            ty, tx = (y - y0) * 4, (x - x0) * 4
            th, tw = min(tile, h - y) * 4, min(tile, w - x) * 4
            out[y * 4:y * 4 + th, x * 4:x * 4 + tw] = r[ty:ty + th, tx:tx + tw]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


def upscale(only=None):
    import onnxruntime as ort
    sess = ort.InferenceSession(str(Path.home() / ".cache" / "esrgan" / "x4.onnx"), providers=["CPUExecutionProvider"])
    OUT.mkdir(parents=True, exist_ok=True)
    for vid in VIEWS:
        if only and vid not in only: continue
        dest = OUT / f"{vid}.jpg"
        if dest.exists() and not only: continue
        im = Image.open(WORK / "src" / f"{vid}.png").convert("RGB")
        big = esrgan(im, sess)
        big.thumbnail((1800, 1800), Image.LANCZOS)
        big.save(dest, quality=88, optimize=True, progressive=True)
        print(vid, im.size, "->", big.size, flush=True)


def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0)
    return h, s, mx


def masks(only=None):
    import cv2
    from rembg import new_session, remove
    rs = new_session("isnet-general-use")
    for vid, (_, _, _, rule) in VIEWS.items():
        if rule is None or (only and vid not in only): continue
        im = Image.open(OUT / f"{vid}.jpg").convert("RGB")
        a = np.asarray(im, dtype=np.float32) / 255.0
        H, W = a.shape[:2]
        car = np.asarray(remove(im, session=rs, only_mask=True), dtype=np.float32) / 255.0 > 0.5
        h, s, v = hsv(a)
        kind, p = rule
        if kind == "hue":
            lo, hi, smin = p
            def win(lo, hi): return (h >= lo) & (h <= hi) if lo < hi else (h >= lo) | (h <= hi)
            m = win(lo, hi) & (s >= smin) & (v > 0.06)
            weak = win((lo - 18) % 360, (hi + 18) % 360) & (s >= smin * 0.45) & (v > 0.04)
            if vid.endswith(("cabin", "wheel")): car = np.ones_like(car)  # interiors fill the frame
        elif kind == "car":  # whole car body brighter than p; glass/grille/wheels go in EXCLUDE
            m = v >= p
            weak = m
        elif kind == "white":
            vmin, wsat = p if isinstance(p, tuple) else (p, 0.3)
            m = (v >= vmin) & (s <= 0.22)
            weak = (v >= vmin - 0.18) & (s <= wsat)
        else:  # seed flood in Lab
            seeds, tol = p
            lab = cv2.cvtColor((a * 255).astype(np.uint8), cv2.COLOR_RGB2LAB)
            m = np.zeros((H, W), bool)
            for fx, fy in seeds:
                ff = np.zeros((H + 2, W + 2), np.uint8)
                cv2.floodFill(lab.copy(), ff, (int(fx * W), int(fy * H)), 0, (tol,) * 3, (tol,) * 3,
                              cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE * 0 | 4 | (255 << 8))
                m |= ff[1:-1, 1:-1] > 0
            weak = m
        # hysteresis: weak pixels count when they touch a strong region (fills shading gaps
        # on curved panels without flooding the background)
        m &= car; weak &= car
        if kind == "car":  # LED rings / hot specular stay white (not for white cars: their paint IS that bright)
            hot = (v > 0.97) & (s < 0.08)
            m &= ~hot; weak &= ~hot
        for poly in EXCLUDE.get(vid, []):  # glass etc. that matches the paint colour
            cut = np.zeros((H, W), np.uint8)
            if poly[0] == "circle":
                cv2.circle(cut, (int(poly[1] * W), int(poly[2] * H)), int(poly[3] * W), 1, -1)
            elif poly[0] == "ellipse":  # cx, cy, rx, ry as fractions of W / H
                cv2.ellipse(cut, (int(poly[1] * W), int(poly[2] * H)), (int(poly[3] * W), int(poly[4] * H)), 0, 0, 360, 1, -1)
            else:
                cv2.fillPoly(cut, [np.array([(x * W, y * H) for x, y in poly], np.int32)], 1)
            m &= cut == 0; weak &= cut == 0
        n, lbl = cv2.connectedComponents(weak.astype(np.uint8))
        hit = np.unique(lbl[m]); hit = hit[hit > 0]
        m = m | np.isin(lbl, hit)
        k = np.ones((5, 5), np.uint8)
        m = cv2.morphologyEx(m.astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8), iterations=2)
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        # keep the big pieces only (drops stray specks in the background)
        n, lbl, st, _ = cv2.connectedComponentsWithStats(m)
        keep = np.zeros_like(m)
        area = H * W
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] > area * 0.002: keep[lbl == i] = 255
        out = Image.fromarray(keep).filter(ImageFilter.GaussianBlur(1.2))
        out.save(OUT / f"{vid}-mask.png", optimize=True)
        print(vid, f"{(keep > 0).mean() * 100:.1f}% painted")


# exterior views that get a background-free cut-out (tucson: several cars touch, skipped)
# (r8 is a tight crop: the car runs off the frame, so its cut-out looks chopped; kept as photo)
CUT = ["911-rear34", "911-rear", "911-front", "amg-gt", "challenger", "812", "f40", "sf90", "m3", "jesko",
       "study-lumen", "study-rosso", "study-notte", "study-sabbia", "study-corsa"]


# areas to force transparent in a cut-out (fractions of the full view)
CUT_CLEAR = {
    "f40": [[(0, 0.74), (1, 0.74), (1, 1), (0, 1)], [(0.30, 0.672), (0.45, 0.672), (0.45, 0.76), (0.30, 0.76)]],  # wet-floor reflection
    "study-corsa": [[(0.36, 0.0), (0.56, 0.0), (0.56, 0.36), (0.36, 0.36)]],  # wall logo
}


def cutout(only=None):
    """rembg cut-out -> public/stock/<view>-cut.webp, cropped to the car; its paint mask is
    cropped by the same box -> <view>-cut-mask.png so the live recolour still lines up."""
    import cv2
    from rembg import new_session, remove
    rs = new_session("isnet-general-use")
    for vid in CUT:
        if only and vid not in only: continue
        src = OUT / f"{vid}.jpg"
        if not src.exists(): print("skip (not upscaled yet)", vid); continue
        im = Image.open(src).convert("RGB")
        a = np.array(remove(im, session=rs, only_mask=True))
        for poly in CUT_CLEAR.get(vid, []):
            H0, W0 = a.shape
            cv2.fillPoly(a, [np.array([(x * W0, y * H0) for x, y in poly], np.int32)], 0)
        # keep the main body only: biggest component plus anything big touching it
        n, lbl, st, _ = cv2.connectedComponentsWithStats((a > 128).astype(np.uint8))
        if n > 1:
            big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
            keep = np.isin(lbl, [i for i in range(1, n) if i == big or st[i, cv2.CC_STAT_AREA] > st[big, cv2.CC_STAT_AREA] * 0.25])
            a = np.where(cv2.dilate(keep.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0, a, 0)
        # trim the 1-2px background halo, then soften the edge
        a = cv2.erode(a, np.ones((3, 3), np.uint8))
        a = cv2.GaussianBlur(a, (3, 3), 0)
        ys, xs = np.where(a > 10)
        H, W = a.shape
        pad = int(max(H, W) * 0.02)
        box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(W, xs.max() + pad + 1), min(H, ys.max() + pad + 1))
        rgba = im.copy(); rgba.putalpha(Image.fromarray(a))
        rgba.crop(box).save(OUT / f"{vid}-cut.webp", quality=90, method=6)
        mk = OUT / f"{vid}-mask.png"
        if mk.exists(): Image.open(mk).crop(box).save(OUT / f"{vid}-cut-mask.png", optimize=True)
        print(vid, "box", box, f"{(a > 128).mean() * 100:.0f}% car")


def cut_sheet():
    from PIL import ImageDraw
    tiles = [(v, Image.open(OUT / f"{v}-cut.webp")) for v in CUT if (OUT / f"{v}-cut.webp").exists()]
    c, W, Hh = 4, 424, 280
    s = Image.new("RGB", (W * c, Hh * ((len(tiles) + c - 1) // c)), (66, 10, 21)); d = ImageDraw.Draw(s)
    for i, (v, t) in enumerate(tiles):
        t = t.copy(); t.thumbnail((W - 8, Hh - 8)); x, y = (i % c) * W, (i // c) * Hh
        s.paste(t, (x + 4 + (W - 8 - t.width) // 2, y + 4 + (Hh - 8 - t.height) // 2), t); d.text((x + 6, y + 6), v, fill=(255, 230, 0))
    s.save(WORK / "cut-sheet.jpg", quality=85); print(WORK / "cut-sheet.jpg")


def preview(only=None):
    """Contact sheet: each view recoloured to green next to the original, to check masks."""
    from PIL import ImageDraw
    tiles = []
    for vid, (*_, rule) in VIEWS.items():
        if rule is None or (only and vid not in only): continue
        im = Image.open(OUT / f"{vid}.jpg").convert("RGB"); im.thumbnail((420, 300))
        mk = Image.open(OUT / f"{vid}-mask.png").convert("L").resize(im.size)
        green = Image.new("RGB", im.size, (0, 255, 90))
        tiles.append((vid, Image.composite(Image.blend(im, green, 0.55), im, mk)))
    c = 4; W, Hh = 424, 304
    s = Image.new("RGB", (W * c, Hh * ((len(tiles) + c - 1) // c)), (20, 20, 20)); d = ImageDraw.Draw(s)
    for i, (vid, t) in enumerate(tiles):
        x, y = (i % c) * W, (i // c) * Hh; s.paste(t, (x + 2, y + 2)); d.text((x + 6, y + 6), vid, fill=(255, 230, 0))
    s.save(WORK / "mask-sheet.jpg", quality=85); print(WORK / "mask-sheet.jpg")


if __name__ == "__main__":
    cmd, rest = (sys.argv[1] if len(sys.argv) > 1 else ""), sys.argv[2:] or None
    {"cutout": lambda: cutout(rest), "cutsheet": cut_sheet, "prep": prep, "upscale": lambda: upscale(rest), "masks": lambda: masks(rest), "preview": lambda: preview(rest)}.get(cmd, lambda: print(__doc__))()
