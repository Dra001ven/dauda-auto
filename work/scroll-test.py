import json, subprocess, time, urllib.request, base64, websocket, tempfile, sys
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
p = subprocess.Popen([C, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--remote-debugging-port=9336", "--remote-allow-origins=*",
                      f"--user-data-dir={tempfile.mkdtemp()}", "--window-size=1440,900", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9336/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60); n=[0]
    def call(m, **pa):
        n[0]+=1; ws.send(json.dumps({"id":n[0],"method":m,"params":pa}))
        while True:
            r=json.loads(ws.recv())
            if r.get("id")==n[0]: return r.get("result",{})
    call("Emulation.setDeviceMetricsOverride", width=1440, height=900, deviceScaleFactor=1, mobile=False)
    call("Page.enable"); call("Page.navigate", url="http://localhost:5173/?v=t#/"); time.sleep(5)
    for y in [int(v) for v in sys.argv[1:]]:
        call("Runtime.evaluate", expression=f"window.scrollTo(0,{y})"); time.sleep(2.2)
        shot = call("Page.captureScreenshot", format="jpeg", quality=80)
        open(f"work/scroll-{y}.jpg","wb").write(base64.b64decode(shot["data"]))
finally: p.terminate()
