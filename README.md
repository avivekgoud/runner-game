# CYBER RUNNER: OVERDRIVE

A complete, production-quality 2D endless runner arcade game built from scratch using HTML5 Canvas, modern modular ES6 JavaScript, Web Audio API procedural synthesis, and responsive CSS3 glassmorphism styling.

Playable directly in any modern desktop, tablet, or mobile browser with zero installation, zero external npm build dependencies, and zero 404/broken asset errors.

![Version](https://img.shields.io/badge/version-1.0.0%20Pro-cyan)
![Platform](https://img.shields.io/badge/platform-Desktop%20%7C%20Tablet%20%7C%20Mobile-blue)
![License](https://img.shields.io/badge/license-MIT-green)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/avivekgoud/runner-game)

---

## Game Features

### 1. Core Endless Runner Gameplay
- **Sub-Pixel Movement & Physics**: Realistic gravity, terminal falling velocity, coyote time (jump forgiveness after leaving ledges), and jump buffering for arcade precision.
- **Double Jump & Slide Mechanics**: Unlockable double jump and low sliding postures that dynamically contract the player's collision hitbox to slip under low hazards.
- **Fair Procedural World Generation**: Algorithmic chunk generator balancing obstacle frequencies, reaction windows, and coin arcs to eliminate unfair or impossible hazard clusters.
- **Combo Multiplier Engine**: Builds up consecutive score multipliers (`RUNNER`, `GREAT!`, `SUPER!`, `HYPER!`, `ULTRA!`, `UNSTOPPABLE!`) by chaining coin collections and near-miss obstacle dodges.

### 2. Multi-Hazard Obstacle System
- **Ground Spikes & Hazard Pits**: Require precision jumps.
- **High Laser Barriers & Overhead Plasma Rails**: Require low slides under danger lines.
- **Supply Crates & Tall Barriers**: Require jumping or double jumping.
- **Patrol Drones**: Flying enemies oscillating vertically with scanning laser eyes.

### 3. Collectibles & Power-Ups
- **Coins & Gems**: 3D-spinning golden credits and rare cyan diamonds.
- **Coin Magnet**: Gravimetrically pulls all on-screen coins to the player.
- **Energy Shield**: Absorbs fatal collisions with hexagonal shatter particles and brief invulnerability.
- **2X Coins & Score Multiplier**: Doubles run earnings and supercharges score growth.
- **Hyper Dash (Speed Boost)**: High-speed invincible sprint with horizontal speed lines.
- **Time Warp (Slow Motion)**: Matrix-style slowdown of hazards for easy dodging.
- **Emergency Revive**: Instantly recover from a crash using a Revive Token or Gems.

### 4. 5 Unique Environments & Parallax Backdrops
1. **Neo City**: Cyberpunk metropolis with skyscrapers, glowing neon billboards, and synthwave beats.
2. **Emerald Forest**: Ancient bioluminescent woods with mossy logs and ethereal pentatonic melodies.
3. **Sunset Dunes**: Vast golden desert under twin setting suns with rolling sand dunes.
4. **Frost Peak**: Frozen glacial caverns with icicle stalagmites and chime techno rhythms.
5. **Cyberpunk 2099**: Orbital mag-lev skyway with laser fences and high-octane cyber basslines.

### 5. Playable Runners & Customization
- **6 Playable Characters**:
  - **Blaze**: The Cyber Nomad (balanced speed and jump).
  - **Sparky**: Neon Velocity (+25% score multiplier, accelerated sprint).
  - **Aegis**: Iron Sentinel (starts with an Energy Shield; shields last 60% longer).
  - **Midas**: Alloy Tycoon (+50% magnet radius, +20% bonus coins).
  - **Luna**: Gravity Dancer (innate Double Jump unlocked).
  - **Chronos**: Temporal Warden (+50% power-up durations, slow-motion boost, double jump).
- **Customization System**: Equip distinct Skins (Stealth Carbon, Neon Synth, Infernal Core), Hats (Cyber Cap, Fedora, Mecha Horns, Solar Crown), and Particle Trails (Dust, Cyber Ribbon, Solar Embers, Volt Spark, Cosmic Stardust).

### 6. Progression, Missions & Economy
- **XP Progression**: 60 levels with escalating level-up rewards (Coins, Gems, Titles).
- **Daily & Weekly Missions**: Dynamically generated challenges tracking meters run, coins gathered, obstacles dodged, and combos reached.
- **7-Day Login Streak Calendar**: Escalating daily rewards culminating in exclusive legendary cosmetics.
- **Shop & Economy**: Non-paywalled in-game economy for power-up duration upgrades (Levels 1 to 5), consumables, and currency exchange.
- **Badges & Achievements**: 20+ unlockable achievement tiers with claimable rewards.
- **Competitive Leaderboard**: Global, Syndicate Friends, and Weekly Surge leaderboards with live player rank updates.
- **Limited-Time Seasonal Event**: "Neon Overdrive" with bonus multipliers and event objectives.

### 7. Self-Contained Procedural Web Audio Engine
- Built 100% on the **Web Audio API**: Real-time sound synthesis for jumps, double jumps, slides, coin chimes, gem chimes, power-up pickups, shield fractures, and collisions.
- Dynamic multi-track procedural music sequencer composing basslines, arpeggios, leads, and percussion matched to each world's tempo and musical scale.
- Completely immune to network 404s or broken media asset paths.

### 8. Full Authentication & Save System
- Local authentication flow supporting **Sign Up**, **Sign In**, **Password Recovery**, and seamless **Continue as Guest** mode.
- LocalStorage persistence with schema versioning, anti-corruption defaults, JSON export/import backups, and progress reset protection.

---

## Controls Guide

| Action | Desktop Keyboard | Mobile / Touch |
| :--- | :--- | :--- |
| **Jump / Double Jump** | `Space` / `↑ Up Arrow` / `W` | Swipe Up / Tap / `JUMP` Button |
| **Slide under Lasers** | `↓ Down Arrow` / `S` | Swipe Down / `SLIDE` Button |
| **Pause Run** | `Esc` / `P` | `II` On-screen Pause Button |
| **Mute Audio Toggle** | `M` | Settings Screen Toggle |

---

## Architecture & Project Structure

```
runner game/
├── index.html                    # Responsive shell and canvas host
├── README.md                     # Documentation and controls guide
├── css/
│   ├── main.css                  # Theme colors, glassmorphism, animations
│   ├── ui.css                    # Menus, cards, dialogs, responsive layout
│   └── hud.css                   # Real-time HUD, combo bar, mobile buttons
└── src/
    ├── main.js                   # Application bootstrap
    ├── config/
    │   ├── constants.js          # Physics, speeds, balancing constants
    │   ├── worlds.js             # 5 environment definitions & palettes
    │   ├── characters.js         # Playable runners & stat multipliers
    │   ├── customizations.js     # Skins, hats, and particle trails
    │   ├── missions.js           # Daily and weekly quest pools
    │   ├── achievements.js       # 20+ achievements with criteria & badges
    │   ├── shopItems.js          # Power-up tech upgrades & packs
    │   └── events.js             # Seasonal event framework
    ├── core/
    │   ├── EventEmitter.js       # Decoupled pub/sub bus
    │   ├── SaveManager.js        # LocalStorage, accounts & migrations
    │   ├── AudioManager.js       # Web Audio API procedural sound & music
    │   ├── InputManager.js       # Keyboard, touch gestures & buffering
    │   └── GameEngine.js         # Main update & render loop
    ├── entities/
    │   ├── Player.js             # Player state machine & vector rendering
    │   ├── Obstacle.js           # Polymorphic hazards (spikes, lasers, drones)
    │   ├── Collectible.js        # Animated coins, gems & formations
    │   ├── PowerUp.js            # In-world power-up pickups
    │   └── ParticleSystem.js     # Pooled particles & floating texts
    ├── world/
    │   ├── ParallaxBackground.js # Multi-layered scrolling backdrop
    │   └── WorldManager.js       # Procedural chunks & difficulty scaling
    └── ui/
        ├── UIManager.js          # Master UI router & modal controller
        ├── HUD.js                # In-game heads-up display
        └── screens/              # 17 complete interactive screens
```

---

## Running the Game Locally

Because this game is built with standard modern ES6 modules, it simply requires an HTTP server to serve the module files.

### Option A: Using Python (Installed on most systems)
```bash
# Navigate to the project directory
cd "runner game"

# Start a local HTTP server
python -m http.server 8080
```
Open your browser at [http://localhost:8080](http://localhost:8080).

## Deploying Online

### Deploy on Render (Recommended)
You can deploy this game on [Render](https://render.com) for free in seconds:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/avivekgoud/runner-game)

#### Manual Steps on Render Dashboard:
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.
2. Click **New +** and select **Static Site** (or **Blueprint** to use `render.yaml`).
3. Select your repository: `https://github.com/avivekgoud/runner-game`.
4. Configure settings:
   - **Name**: `runner-game` (or your chosen name)
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.`
5. Click **Create Static Site**.
Render will deploy the site immediately on a free global CDN with SSL HTTPS (e.g. `https://runner-game.onrender.com`).

### Deploy on GitHub Pages
1. Go to your GitHub repository **Settings > Pages**.
2. Under "Build and deployment", select Source: **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`.
4. Click **Save**. Your game will be live in ~1 minute!

---

## Author

**A Vivek Goud**  
*Computer Science Student*  
- **GitHub:** [@avivekgoud](https://github.com/avivekgoud)  
- **Email:** [a.vivek1a@gmail.com](mailto:a.vivek1a@gmail.com)  

---

## License
Developed for commercial-grade gaming performance under the MIT License.
