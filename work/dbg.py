import json, subprocess, sys, time, urllib.request, websocket, tempfile
url, expr = sys.argv[1], sys.argv[2]
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
p = subprocess.Popen([C, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--remote-debugging-port=9334", "--remote-allow-origins=*", f"--user-data-dir={tempfile.mkdtemp()}", "--window-size=1440,900", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    for _ in range(50):
        try: tabs = json.load(urllib.request.urlopen("http://127.0.0.1:9334/json")); break
        except Exception: time.sleep(.2)
    ws = websocket.create_connection([t for t in tabs if t["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
    n=[0]
    def call(m, **pa):
        n[0]+=1; ws.send(json.dumps({"id":n[0],"method":m,"params":pa}))
        while True:
            r=json.loads(ws.recv())
            if r.get("id")==n[0]: return r.get("result",{})
    call("Runtime.enable"); call("Page.enable"); call("Page.navigate", url=url); time.sleep(4)
    print(json.dumps(call("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True).get("result",{}).get("value"), indent=1))
finally: p.terminate()
