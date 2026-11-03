import json, subprocess, sys, time, re
UA = "cars-demo/1.0 (local dev)"
def info(title, width):
    out = subprocess.run(["curl", "-s", "-A", UA, "-G", "https://commons.wikimedia.org/w/api.php",
        "--data-urlencode", "action=query", "--data-urlencode", "format=json",
        "--data-urlencode", f"titles=File:{title}", "--data-urlencode", "prop=imageinfo",
        "--data-urlencode", "iiprop=url|size|extmetadata", "--data-urlencode", f"iiurlwidth={width}"], capture_output=True, text=True).stdout
    i = list(json.loads(out)["query"]["pages"].values())[0]["imageinfo"][0]
    m = i["extmetadata"]
    return i.get("thumburl") or i["url"], re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", ""))[:50], m.get("LicenseShortName", {}).get("value", "")
def get(name, title, width, outdir):
    for attempt in range(3):
        try:
            url, artist, lic = info(title, width); break
        except Exception:
            time.sleep(5)
    else:
        print("FAIL", name); return
    time.sleep(1.5)
    subprocess.run(["curl", "-sL", "-A", UA, "-o", f"{outdir}/{name}.jpg", url])
    print(name, "|", artist, "|", lic, flush=True); time.sleep(1.5)
if __name__ == "__main__":
    width, outdir = int(sys.argv[1]), sys.argv[2]
    for line in sys.stdin:
        if "=" in line:
            n, t = line.strip().split("=", 1); get(n, t, width, outdir)
