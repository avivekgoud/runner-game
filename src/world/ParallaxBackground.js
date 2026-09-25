/**
 * Multi-Layered Parallax Background Renderer
 * Clean, modern visual backdrops, smooth sky gradients,
 * soft celestial glow, sleek skyline silhouettes, and polished ground surfaces.
 */

import { WORLDS } from '../config/worlds.js';

export class ParallaxBackground {
    constructor() {
        this.worldId = 'neo_city';
        this.world = WORLDS.neo_city;

        this.layer1Offset = 0; // Distant silhouettes (0.08x)
        this.layer2Offset = 0; // Midground structures (0.25x)
        this.layer3Offset = 0; // Near decorations (0.55x)
        this.groundOffset = 0; // Ground surface (1.0x)

        this.animTime = 0;
        this.stars = this.generateStars(50);
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
                y: Math.random() * 340,
                size: Math.random() * 1.8 + 1,
                alpha: Math.random() * 0.6 + 0.3
            });
        }
        return stars;
    }

    update(dt, scrollSpeed) {
        this.animTime += dt;
        this.layer1Offset = (this.layer1Offset + scrollSpeed * 0.08 * dt) % 1280;
        this.layer2Offset = (this.layer2Offset + scrollSpeed * 0.25 * dt) % 1280;
        this.layer3Offset = (this.layer3Offset + scrollSpeed * 0.55 * dt) % 1280;
        this.groundOffset = (this.groundOffset + scrollSpeed * 1.00 * dt) % 100;
    }

    render(ctx, width, height, groundY) {
        ctx.save();

        // 1. Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        const colors = this.world.skyColors || ['#0f172a', '#1e293b'];
        colors.forEach((col, idx) => {
            skyGrad.addColorStop(idx / (colors.length - 1), col);
        });
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Celestial Body (Glowing Sun or Moon)
        this.renderCelestial(ctx, width);

        // 3. Ambient Stars
        this.renderStars(ctx);

        // 4. Parallax Layer 1: Distant Silhouettes
        this.renderDistantLayer(ctx, width, groundY);

        // 5. Parallax Layer 2: Midground Architecture / Landscape
        this.renderMidgroundLayer(ctx, width, groundY);

        // 6. Ground Base & Polished Surface
        this.renderGround(ctx, width, height, groundY);

        ctx.restore();
    }

    renderCelestial(ctx, width) {
        ctx.save();
        if (this.worldId === 'sunset_desert') {
            // Big warm glowing sunset
            const sunX = width - 260;
            const sunY = 160;
            const grad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 90);
            grad.addColorStop(0, 'rgba(251, 191, 36, 1)');
            grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)');
            grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
            ctx.fill();

            // Inner crisp sun disk
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Elegant glowing moon
            const moonX = width - 200;
            const moonY = 110;
            const grad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 70);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.3)');
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    renderStars(ctx) {
        ctx.save();
        for (const s of this.stars) {
            const flicker = Math.sin(this.animTime * 2.5 + s.x) * 0.2 + s.alpha;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, flicker)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    renderDistantLayer(ctx, width, groundY) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';

        const step = 140;
        for (let x = -this.layer1Offset; x < width + step; x += step) {
            const h = 160 + Math.sin(x * 0.015) * 50;
            ctx.beginPath();
            ctx.roundRect(x, groundY - h, step - 8, h + 10, [12, 12, 0, 0]);
            ctx.fill();
        }
        ctx.restore();
    }

    renderMidgroundLayer(ctx, width, groundY) {
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';

        const step = 90;
        for (let x = -this.layer2Offset; x < width + step; x += step) {
            const buildingH = 100 + Math.abs(Math.sin(x * 0.025)) * 80;
            ctx.beginPath();
            ctx.roundRect(x, groundY - buildingH, step - 10, buildingH + 10, [8, 8, 0, 0]);
            ctx.fill();

            // Soft window accents
            ctx.fillStyle = (x % 2 === 0) ? 'rgba(56, 189, 248, 0.4)' : 'rgba(250, 204, 21, 0.35)';
            for (let wy = groundY - buildingH + 18; wy < groundY - 15; wy += 22) {
                ctx.fillRect(x + 12, wy, 8, 8);
                ctx.fillRect(x + 26, wy, 8, 8);
            }
            ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        }
        ctx.restore();
    }

    renderGround(ctx, width, height, groundY) {
        ctx.save();

        // 1. Deep solid ground fill with subtle depth gradient
        const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
        groundGrad.addColorStop(0, this.world.groundColor || '#1e293b');
        groundGrad.addColorStop(1, '#090d16');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, groundY, width, height - groundY);

        // 2. Clean luminous surface accent line
        ctx.strokeStyle = this.world.groundAccent || '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();

        // 3. Subtle dashed roadway / lane markings
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let x = -this.groundOffset; x < width + 100; x += 100) {
            ctx.beginPath();
            ctx.roundRect(x, groundY + 28, 48, 4, 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
