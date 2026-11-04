import json, subprocess, time, urllib.request, base64, websocket, tempfile
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
p = subprocess.Popen([C, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars", "--remote-debugging-port=9335", "--remote-allow-origins=*",
                      f"--user-data-dir={tempfile.mkdtemp()}", "--window-size=1440,900", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9335/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60); n=[0]
    def call(m, **pa):
        n[0]+=1; ws.send(json.dumps({"id":n[0],"method":m,"params":pa}))
        while True:
            r=json.loads(ws.recv())
            if r.get("id")==n[0]: return r.get("result",{})
    call("Emulation.setDeviceMetricsOverride", width=1440, height=900, deviceScaleFactor=1, mobile=False)
    call("Page.enable"); call("Page.navigate", url="http://localhost:5173/?v=h#/"); time.sleep(5)
    for name, x in [("left", 10), ("right", 1430)]:
        call("Input.dispatchMouseEvent", type="mouseMoved", x=x, y=450); time.sleep(2.5)
        shot = call("Page.captureScreenshot", format="png", clip={"x": 560, "y": 180, "width": 720, "height": 420, "scale": 1})
        open(f"work/depth-{name}.png","wb").write(base64.b64decode(shot["data"]))
finally: p.terminate()
