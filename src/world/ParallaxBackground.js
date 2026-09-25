/**
 * Multi-Layered Parallax Background Renderer
 * Supports all 5 worlds with unique visual backdrops, sky gradients,
 * moving celestial bodies, skyline silhouettes, and scrolling ground surfaces.
 */

import { WORLDS } from '../config/worlds.js';

export class ParallaxBackground {
    constructor() {
        this.worldId = 'neo_city';
        this.world = WORLDS.neo_city;

        this.layer1Offset = 0; // Distant silhouettes (0.08x)
        this.layer2Offset = 0; // Midground structures (0.28x)
        this.layer3Offset = 0; // Near decorations (0.6x)
        this.groundOffset = 0; // Ground surface (1.0x)

        this.animTime = 0;
        this.stars = this.generateStars(60);
    }

    setWorld(worldId) {
        this.worldId = worldId;
        this.world = WORLDS[worldId] || WORLDS.neo_city;
    }

    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * 1280,
                y: Math.random() * 380,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.7 + 0.3
            });
        }
        return stars;
    }

    update(dt, scrollSpeed) {
        this.animTime += dt;
        this.layer1Offset = (this.layer1Offset + scrollSpeed * 0.08 * dt) % 1280;
        this.layer2Offset = (this.layer2Offset + scrollSpeed * 0.28 * dt) % 1280;
        this.layer3Offset = (this.layer3Offset + scrollSpeed * 0.60 * dt) % 1280;
        this.groundOffset = (this.groundOffset + scrollSpeed * 1.00 * dt) % 80;
    }

    render(ctx, width, height, groundY) {
        ctx.save();

        // 1. Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        const colors = this.world.skyColors || ['#0f172a', '#1e1b4b'];
        colors.forEach((col, idx) => {
            skyGrad.addColorStop(idx / (colors.length - 1), col);
        });
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Celestial Body (Moon, Cyber Sun, etc.)
        this.renderCelestial(ctx, width);

        // 3. Stars / Atmospheric Shimmer
        this.renderStars(ctx);

        // 4. Parallax Layer 1: Distant Skyline / Mountains
        this.renderDistantLayer(ctx, width, groundY);

        // 5. Parallax Layer 2: Midground Architecture / Forest
        this.renderMidgroundLayer(ctx, width, groundY);

        // 6. Ground Base & Tech Grid
        this.renderGround(ctx, width, height, groundY);

        ctx.restore();
    }

    renderCelestial(ctx, width) {
        ctx.save();
        if (this.worldId === 'sunset_desert') {
            // Twin golden setting suns
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.arc(width - 240, 140, 48, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(width - 320, 180, 32, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.worldId === 'cyber_2099') {
            // Giant holographic orbital ring
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(width / 2, -100, 340, 0, Math.PI);
            ctx.stroke();
        } else {
            // Cyber moon
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(width - 180, 110, 42, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    renderStars(ctx) {
        ctx.save();
        for (const s of this.stars) {
            const flicker = Math.sin(this.animTime * 2 + s.x) * 0.2 + s.alpha;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, flicker)})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }
        ctx.restore();
    }

    renderDistantLayer(ctx, width, groundY) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';

        const step = 160;
        for (let x = -this.layer1Offset; x < width + step; x += step) {
            const h = 180 + Math.sin(x * 0.01) * 60;
            ctx.fillRect(x, groundY - h, step + 2, h);
        }
        ctx.restore();
    }

    renderMidgroundLayer(ctx, width, groundY) {
        ctx.save();
        ctx.fillStyle = 'rgba(30, 27, 75, 0.75)';

        const step = 110;
        for (let x = -this.layer2Offset; x < width + step; x += step) {
            const buildingH = 110 + Math.abs(Math.sin(x * 0.02)) * 90;
            ctx.fillRect(x, groundY - buildingH, step - 12, buildingH);

            // Glowing windows
            if (this.worldId === 'neo_city' || this.worldId === 'cyber_2099') {
                ctx.fillStyle = (x % 3 === 0) ? '#06b6d4' : '#facc15';
                for (let wy = groundY - buildingH + 15; wy < groundY - 20; wy += 22) {
                    ctx.fillRect(x + 12, wy, 8, 10);
                    ctx.fillRect(x + 28, wy, 8, 10);
                }
                ctx.fillStyle = 'rgba(30, 27, 75, 0.75)';
            }
        }
        ctx.restore();
    }

    renderGround(ctx, width, height, groundY) {
        ctx.save();

        // Solid Ground Fill
        ctx.fillStyle = this.world.groundColor || '#1e1b4b';
        ctx.fillRect(0, groundY, width, height - groundY);

        // Ground Top Accent Line (Glowing neon strip)
        ctx.strokeStyle = this.world.groundAccent || '#06b6d4';
        ctx.shadowColor = this.world.groundAccent || '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Scrolling Tech Grid Lines
        ctx.strokeStyle = this.world.groundGrid || '#312e81';
        ctx.lineWidth = 2;
        for (let x = -this.groundOffset; x < width + 80; x += 80) {
            ctx.beginPath();
            ctx.moveTo(x, groundY);
            ctx.lineTo(x - 30, height);
            ctx.stroke();
        }

        // Horizontal depth lines
        for (let y = groundY + 25; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        ctx.restore();
    }
}
