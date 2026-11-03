#!/bin/bash
# usage: work/compare.sh <tag>  -> work/cmp-<tag>.jpg (reference | build)
cd /Users/mac2/github-projects/cars
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$C" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --window-size=1472,2620 --virtual-time-budget=8000 --screenshot=work/shot.png http://localhost:5173/ >/dev/null 2>&1
.venv-img/bin/python - "$1" <<'PY'
import sys
from PIL import Image
ref = Image.open("/private/tmp/claude-502/-Users-mac2-github-projects-cars/da9dd41e-83f2-4129-b302-7ff7c4046422/images/2.jpg").convert("RGB")
me = Image.open("work/shot.png").convert("RGB")
W = 736
ref = ref.resize((W, round(ref.height * W / ref.width)))
me = me.resize((W, round(me.height * W / me.width)))
H = max(ref.height, me.height)
out = Image.new("RGB", (W * 2 + 12, H), (255, 0, 255))
out.paste(ref, (0, 0)); out.paste(me, (W + 12, 0))
out.save(f"work/cmp-{sys.argv[1]}.jpg", quality=82)
# also top/bottom halves for detail
for i,(a,b) in enumerate([(0,H//2),(H//2,H)]):
    out.crop((0,a,out.width,b)).save(f"work/cmp-{sys.argv[1]}-{i}.jpg", quality=85)
print(ref.size, me.size)
PY
