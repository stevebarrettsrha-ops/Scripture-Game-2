#!/usr/bin/env python3
"""THE VOYAGE, played from this computer.

Serves the game's folder on this computer's own address (127.0.0.1, never the network),
opens it in the default browser, and keeps serving until this window is closed (or, started
from a desktop shortcut, until it has been idle a while). Nothing is fetched from the
internet: three.js, the world, the Besorah and every recorded voice are in the folder.

    python3 local/serve.py [voyage|story|unfolds] [--port 8642] [--idle-minutes 0] [--no-browser]

The port is kept the same every time on purpose: a browser keeps a game's saves per address,
so the same address means the same saves. If another instance is already serving, it is
reused and only the browser is opened.
"""
import argparse, http.server, json, os, re, socketserver, sys, threading, time, urllib.request, webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIGNATURE = 'scripture-game-local'
# THE SAVES FOLDER (local/saves.js): progress is kept in files in saves/ beside the game, one for each
# thing the game keeps, the edited pieces of the world in saves/world/. Only names of this shape are
# ever read or written, so nothing outside the folder can be reached through it.
SAVES = os.path.join(ROOT, 'saves')
SAVE_NAME = re.compile(r'^(world/)?[A-Za-z0-9._~-]{1,160}\.json$')
SAVE_MAX = 64 * 1024 * 1024
PAGES = {'voyage': 'index.html', 'story': 'story/index.html', 'unfolds': 'scripture-unfolds/index.html'}
TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
         '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webm': 'audio/webm',
         '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.png': 'image/png',
         '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
         '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8'}

last_seen = time.time()


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = dict(http.server.SimpleHTTPRequestHandler.extensions_map, **TYPES)

    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def do_GET(self):
        global last_seen
        last_seen = time.time()
        if self.path.split('?')[0] == '/__saves':
            out = {}
            for sub in ('', 'world/'):
                d = os.path.join(SAVES, sub)
                if not os.path.isdir(d):
                    continue
                for f in os.listdir(d):
                    if SAVE_NAME.match(sub + f) and os.path.isfile(os.path.join(d, f)):
                        try:
                            with open(os.path.join(d, f), encoding='utf-8') as fh:
                                out[sub + f] = fh.read()
                        except OSError:
                            pass
            return self.send_text(200, json.dumps({'files': out}), 'application/json')
        if self.path.split('?')[0] == '/__scripture_game':
            body = SIGNATURE.encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def send_text(self, code, text, ctype='text/plain; charset=utf-8'):
        body = text.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def save_path(self):
        p = self.path.split('?')[0]
        if not p.startswith('/__saves/'):
            return None
        name = p[len('/__saves/'):]
        return os.path.join(SAVES, *name.split('/')) if SAVE_NAME.match(name) else None

    def do_PUT(self):
        global last_seen
        last_seen = time.time()
        f = self.save_path()
        n = int(self.headers.get('Content-Length') or 0)
        if not f or n > SAVE_MAX:
            return self.send_text(403, 'Forbidden')
        data = self.rfile.read(n)
        os.makedirs(os.path.dirname(f), exist_ok=True)
        tmp = f + '.tmp'
        try:
            with open(tmp, 'wb') as fh:          # written whole, then put in place: never half a save
                fh.write(data)
            os.replace(tmp, f)
        except OSError:
            if os.path.exists(tmp):
                os.remove(tmp)
            return self.send_text(500, 'not saved')
        self.send_text(200, 'saved')

    def do_DELETE(self):
        global last_seen
        last_seen = time.time()
        f = self.save_path()
        if not f:
            return self.send_text(403, 'Forbidden')
        try:
            os.remove(f)
        except FileNotFoundError:
            pass
        self.send_text(200, 'removed')

    def list_directory(self, path):
        self.send_error(404, 'Not found')            # the folder is the game, not a file browser
        return None

    def end_headers(self):
        # always the files as they are on disk now: after an update the browser takes the new ones
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = False


def ours(port):
    try:
        with urllib.request.urlopen('http://127.0.0.1:%d/__scripture_game' % port, timeout=1.5) as r:
            return r.read().decode(errors='ignore') == SIGNATURE
    except Exception:
        return False


def main():
    ap = argparse.ArgumentParser(description='Play THE VOYAGE from this computer.')
    ap.add_argument('page', nargs='?', default='voyage', choices=sorted(PAGES))
    ap.add_argument('--port', type=int, default=8642)
    ap.add_argument('--idle-minutes', type=float, default=0, help='stop after this long with no requests (0: never)')
    ap.add_argument('--no-browser', action='store_true')
    a = ap.parse_args()

    srv = None
    for port in range(a.port, a.port + 20):
        if ours(port):                                   # already serving: only open the page
            url = 'http://127.0.0.1:%d/%s' % (port, PAGES[a.page])
            print('THE VOYAGE is already running at', url)
            if not a.no_browser:
                webbrowser.open(url)
            return 0
        try:
            srv = Server(('127.0.0.1', port), Handler)
            break
        except OSError:
            continue
    if srv is None:
        print('No free port between %d and %d.' % (a.port, a.port + 19), file=sys.stderr)
        return 1
    port = srv.server_address[1]
    url = 'http://127.0.0.1:%d/%s' % (port, PAGES[a.page])
    if port != a.port:
        print('Note: port %d was busy, so %d is used. Saves made on one port are not seen on the other.' % (a.port, port))
    print()
    print('  THE VOYAGE is running on this computer at')
    print('  ' + url)
    print()
    print('  Leave this window open while you play. Close it (or press Ctrl+C) to stop.')
    print()
    if not a.no_browser:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()
    if a.idle_minutes > 0:
        def watch():
            while True:
                time.sleep(30)
                if time.time() - last_seen > a.idle_minutes * 60:
                    srv.shutdown()
                    return
        threading.Thread(target=watch, daemon=True).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
