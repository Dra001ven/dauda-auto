"""Run JS steps on a page, then screenshot the viewport.
usage: act-shot.py <url> <out.png> "<js step>" ["<js step>" ...]   (each step waits 1.2s)"""
import json, subprocess, sys, time, urllib.request, base64, websocket, tempfile
url, out, steps = sys.argv[1], sys.argv[2], sys.argv[3:]
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
p = subprocess.Popen([C, "--headless=new", "--hide-scrollbars", "--force-prefers-reduced-motion", "--remote-debugging-port=9335", "--remote-allow-origins=*",
                      f"--user-data-dir={tempfile.mkdtemp()}", "--window-size=1440,900", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9335/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
    n = [0]
    def call(m, **pa):
        n[0] += 1; ws.send(json.dumps({"id": n[0], "method": m, "params": pa}))
        while True:
            r = json.loads(ws.recv())
            if r.get("id") == n[0]: return r.get("result", {})
    call("Emulation.setDeviceMetricsOverride", width=1440, height=900, deviceScaleFactor=1, mobile=False)
    call("Page.enable"); call("Page.navigate", url=url); time.sleep(3)
    for s in steps:
        r = call("Runtime.evaluate", expression=s, returnByValue=True)
        print("step:", r.get("result", {}).get("value"), r.get("exceptionDetails", {}).get("text", "")); time.sleep(1.2)
    d = call("Page.captureScreenshot", format="png")
    open(out, "wb").write(base64.b64decode(d["data"])); print(out)
finally:
    p.kill()
