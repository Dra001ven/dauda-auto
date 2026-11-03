"""Full-page screenshots at a real viewport via Chrome DevTools Protocol.
usage: shot.py <url> <out.png> [width] [height] [scrollY-for-viewport-only]"""
import json, subprocess, sys, time, urllib.request, base64, websocket, os, tempfile
url, out = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
H = int(sys.argv[4]) if len(sys.argv) > 4 else 900
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
prof = tempfile.mkdtemp()
p = subprocess.Popen([C, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--force-prefers-reduced-motion", "--remote-debugging-port=9333", "--remote-allow-origins=*",
                      f"--user-data-dir={prof}", f"--window-size={W},{H}", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try:
            tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9333/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
    n = [0]
    def call(m, **params):
        n[0] += 1; ws.send(json.dumps({"id": n[0], "method": m, "params": params}))
        while True:
            r = json.loads(ws.recv())
            if r.get("id") == n[0]: return r.get("result", {})
    call("Emulation.setDeviceMetricsOverride", width=W, height=H, deviceScaleFactor=1, mobile=W < 700)
    call("Page.enable"); call("Page.navigate", url=url); time.sleep(3.5)
    # scroll through the page so reveal-on-scroll elements trigger, then return to top
    h = call("Runtime.evaluate", expression="document.documentElement.scrollHeight", returnByValue=True)["result"]["value"]
    for y in range(0, h, H // 2):
        call("Runtime.evaluate", expression=f"window.scrollTo(0,{y})"); time.sleep(.25)
    call("Runtime.evaluate", expression="window.scrollTo(0,0)"); time.sleep(2.2)
    h = call("Runtime.evaluate", expression="document.documentElement.scrollHeight", returnByValue=True)["result"]["value"]
    shot = call("Page.captureScreenshot", format="png", captureBeyondViewport=True, clip={"x": 0, "y": 0, "width": W, "height": h, "scale": 1})
    open(out, "wb").write(base64.b64decode(shot["data"])); print(out, W, h)
finally:
    p.terminate()
