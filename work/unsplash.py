"""Pull professional photos from the Unsplash API for the Dauda Motos site.

Key: put UNSPLASH_ACCESS_KEY=... in the project .env (git-ignored). Never hard-code it.

usage:
  .venv-img/bin/python work/unsplash.py search "<query>" [count]   -> previews + contact sheet
  .venv-img/bin/python work/unsplash.py get <photo_id> <name>       -> 3840px original to work/unsplash/

API rules followed (unsplash.com/documentation):
  - hotlinking is required for display *or* you download: we download, so we must
    call the photo's download_location endpoint (counts the download) — done in get().
  - attribution: photographer name + link, saved to work/unsplash/credits.json.
"""
import json, os, subprocess, sys, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "work" / "unsplash"
OUT.mkdir(parents=True, exist_ok=True)
UTM = "utm_source=dauda_motos&utm_medium=referral"


def key():
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("UNSPLASH_ACCESS_KEY="):
            return line.split("=", 1)[1].strip()
    sys.exit("UNSPLASH_ACCESS_KEY missing from .env")


def api(path, **params):
    url = f"https://api.unsplash.com{path}?{urllib.parse.urlencode(params)}"
    out = subprocess.run(["curl", "-s", "-H", f"Authorization: Client-ID {key()}", "-H", "Accept-Version: v1", url],
                         capture_output=True, text=True).stdout
    return json.loads(out)


def search(q, n=24):
    res = api("/search/photos", query=q, per_page=min(int(n), 30), orientation="landscape", content_filter="high")
    if "errors" in res:
        sys.exit(res["errors"])
    prev = OUT / "prev"; prev.mkdir(exist_ok=True)
    rows = []
    for p in res["results"]:
        f = prev / f"{p['id']}.jpg"
        subprocess.run(["curl", "-sL", "-o", str(f), p["urls"]["small"]])
        rows.append((p["id"], p["width"], p["height"], p["user"]["name"], (p.get("alt_description") or "")[:60]))
        print(*rows[-1], sep=" | ")
    sheet(q, [r[0] for r in rows])


def sheet(q, ids):
    from PIL import Image, ImageDraw
    W, H, cols = 400, 270, 4
    s = Image.new("RGB", (W * cols, H * ((len(ids) + cols - 1) // cols)), (18, 18, 18)); d = ImageDraw.Draw(s)
    for i, pid in enumerate(ids):
        im = Image.open(OUT / "prev" / f"{pid}.jpg").convert("RGB"); im.thumbnail((W - 6, H - 22))
        x, y = (i % cols) * W, (i // cols) * H
        s.paste(im, (x + 3, y + 3)); d.text((x + 6, y + H - 17), pid, fill=(255, 220, 0))
    name = OUT / f"sheet-{q.replace(' ', '_')}.jpg"; s.save(name, quality=85); print("sheet:", name)


def get(pid, name):
    p = api(f"/photos/{pid}")
    api(urllib.parse.urlparse(p["links"]["download_location"]).path)  # required download ping
    raw = p["urls"]["raw"] + "&w=3840&q=85&fm=jpg"
    dest = OUT / f"{name}.jpg"
    subprocess.run(["curl", "-sL", "-o", str(dest), raw])
    cred_f = OUT / "credits.json"
    cred = json.loads(cred_f.read_text()) if cred_f.exists() else {}
    cred[name] = {"id": pid, "photographer": p["user"]["name"],
                  "profile": f"{p['user']['links']['html']}?{UTM}", "photo": f"{p['links']['html']}?{UTM}"}
    cred_f.write_text(json.dumps(cred, indent=1))
    print(dest, p["width"], "x", p["height"], "by", p["user"]["name"])


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "search": search(sys.argv[2], *(sys.argv[3:4]))
    elif cmd == "get": get(sys.argv[2], sys.argv[3])
    else: print(__doc__)
