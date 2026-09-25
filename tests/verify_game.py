"""
Automated Verification Script for Cyber Runner: Overdrive
Validates file presence, ES6 module import paths, configuration integrity,
and local static HTTP server availability.
"""

import os
import re
import sys
import http.server
import socketserver
import threading
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_FILES = [
    "index.html",
    "render.yaml",
    "README.md",
    "css/main.css",
    "css/ui.css",
    "css/hud.css",
    "src/main.js",
    "src/config/constants.js",
    "src/config/worlds.js",
    "src/config/characters.js",
    "src/config/customizations.js",
    "src/config/missions.js",
    "src/config/achievements.js",
    "src/config/shopItems.js",
    "src/config/events.js",
    "src/core/EventEmitter.js",
    "src/core/SaveManager.js",
    "src/core/AudioManager.js",
    "src/core/InputManager.js",
    "src/core/GameEngine.js",
    "src/entities/Player.js",
    "src/entities/Obstacle.js",
    "src/entities/Collectible.js",
    "src/entities/PowerUp.js",
    "src/entities/ParticleSystem.js",
    "src/world/ParallaxBackground.js",
    "src/world/WorldManager.js",
    "src/ui/HUD.js",
    "src/ui/UIManager.js",
    "src/ui/screens/SplashScreen.js",
    "src/ui/screens/AuthScreen.js",
    "src/ui/screens/OnboardingScreen.js",
    "src/ui/screens/MainMenuScreen.js",
    "src/ui/screens/WorldSelectScreen.js",
    "src/ui/screens/CharacterScreen.js",
    "src/ui/screens/ShopScreen.js",
    "src/ui/screens/DailyRewardsScreen.js",
    "src/ui/screens/MissionsScreen.js",
    "src/ui/screens/AchievementsScreen.js",
    "src/ui/screens/LeaderboardScreen.js",
    "src/ui/screens/EventsScreen.js",
    "src/ui/screens/InventoryScreen.js",
    "src/ui/screens/SettingsScreen.js",
    "src/ui/screens/StatsScreen.js",
    "src/ui/screens/GameOverScreen.js",
    "src/ui/screens/PauseScreen.js"
]

def test_file_presence():
    print("--> Checking required file presence...")
    missing = []
    for rel_path in REQUIRED_FILES:
        full_path = os.path.join(ROOT_DIR, rel_path)
        if not os.path.isfile(full_path):
            missing.append(rel_path)
    if missing:
        print(f"[FAIL] Missing files: {missing}")
        return False
    print(f"[PASS] All {len(REQUIRED_FILES)} required files are present.")
    return True

def test_import_paths():
    print("--> Checking ES6 module import paths...")
    import_regex = re.compile(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"];?')
    broken_imports = []

    for root, _, files in os.walk(os.path.join(ROOT_DIR, "src")):
        for f in files:
            if f.endswith(".js"):
                file_path = os.path.join(root, f)
                with open(file_path, "r", encoding="utf-8") as js_file:
                    content = js_file.read()
                    matches = import_regex.findall(content)
                    for target in matches:
                        # Resolve target relative to file_path
                        target_full = os.path.normpath(os.path.join(root, target))
                        if not os.path.isfile(target_full):
                            broken_imports.append((os.path.relpath(file_path, ROOT_DIR), target))

    if broken_imports:
        print(f"[FAIL] Broken import paths: {broken_imports}")
        return False
    print("[PASS] All ES6 relative imports resolved accurately.")
    return True

def test_http_server():
    print("--> Testing static HTTP server response...")
    port = 8765
    os.chdir(ROOT_DIR)
    handler = http.server.SimpleHTTPRequestHandler

    server = socketserver.TCPServer(("", port), handler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    try:
        url = f"http://localhost:{port}/index.html"
        req = urllib.request.urlopen(url, timeout=3)
        status = req.getcode()
        html = req.read().decode('utf-8')
        if status == 200 and "CYBER RUNNER" in html.upper():
            print("[PASS] HTTP server responded 200 OK and index.html served correctly.")
            return True
        else:
            print(f"[FAIL] HTTP server returned status {status}")
            return False
    except Exception as e:
        print(f"[FAIL] HTTP server request failed: {e}")
        return False
    finally:
        server.shutdown()
        server.server_close()

def main():
    print("========================================")
    print("CYBER RUNNER: OVERDRIVE VERIFICATION")
    print("========================================")

    p1 = test_file_presence()
    p2 = test_import_paths()
    p3 = test_http_server()

    if p1 and p2 and p3:
        print("\n>>> ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<")
        sys.exit(0)
    else:
        print("\n>>> VERIFICATION FAILED! <<<")
        sys.exit(1)

if __name__ == "__main__":
    main()
