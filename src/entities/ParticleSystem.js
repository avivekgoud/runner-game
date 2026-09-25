/**
 * High-Performance Pooled Particle & Floating Text Engine
 * Handles running dust, jump rings, slide sparks, coin bursts, shield auras,
 * speed lines, celebratory confetti, and animated floating combat/score texts.
 */

export class ParticleSystem {
    constructor(maxParticles = 500) {
        this.maxParticles = maxParticles;
        this.particles = [];
        this.floatingTexts = [];
        this.quality = 'high'; // 'high', 'medium', 'low'
    }

    setQuality(quality) {
        this.quality = quality;
        if (quality === 'low') this.maxParticles = 150;
        else if (quality === 'medium') this.maxParticles = 300;
        else this.maxParticles = 600;
    }

    // --- Particle Spawners ---

    spawnDust(x, y, count = 2) {
        if (this.quality === 'low') count = 1;
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x + (Math.random() * 10 - 5),
                y: y,
                vx: -(Math.random() * 80 + 40),
                vy: -(Math.random() * 40 + 10),
                radius: Math.random() * 4 + 2,
                color: 'rgba(203, 213, 225, 0.6)',
                life: 0.35,
                maxLife: 0.35,
                type: 'circle'
            });
        }
    }

    spawnJumpParticles(x, y) {
        const count = this.quality === 'low' ? 6 : 14;
        for (let i = 0; i < count; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.8;
            const speed = Math.random() * 140 + 60;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 5 + 3,
                color: 'rgba(56, 189, 248, 0.7)',
                life: 0.45,
                maxLife: 0.45,
                type: 'circle'
            });
        }
    }

    spawnDoubleJumpHalo(x, y) {
        const count = this.quality === 'low' ? 8 : 18;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = Math.random() * 160 + 80;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: 'rgba(192, 132, 252, 0.85)',
                life: 0.5,
                maxLife: 0.5,
                type: 'spark'
            });
        }
    }

    spawnSlideSparks(x, y) {
        const count = this.quality === 'low' ? 1 : 3;
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x + (Math.random() * 10 - 5),
                y: y,
                vx: -(Math.random() * 180 + 120),
                vy: -(Math.random() * 80 + 20),
                radius: Math.random() * 3 + 1.5,
                color: Math.random() > 0.4 ? '#facc15' : '#f97316',
                life: 0.3,
                maxLife: 0.3,
                type: 'spark'
            });
        }
    }

    spawnCoinSparkle(x, y) {
        const count = this.quality === 'low' ? 5 : 12;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 150 + 60;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: '#facc15',
                life: 0.45,
                maxLife: 0.45,
                type: 'star'
            });
        }
    }

    spawnGemSparkle(x, y) {
        const count = this.quality === 'low' ? 8 : 18;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 180 + 80;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 5 + 2.5,
                color: Math.random() > 0.5 ? '#38bdf8' : '#e879f9',
                life: 0.55,
                maxLife: 0.55,
                type: 'shard'
            });
        }
    }

    spawnShieldBreak(x, y) {
        const count = 22;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
            const speed = Math.random() * 220 + 100;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 6 + 3,
                color: 'rgba(52, 211, 153, 0.9)',
                life: 0.6,
                maxLife: 0.6,
                type: 'shard'
            });
        }
    }

    spawnCollisionExplosion(x, y) {
        const count = 28;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 260 + 80;
            this.addParticle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 60,
                radius: Math.random() * 6 + 3,
                color: Math.random() > 0.4 ? '#f43f5e' : '#fb923c',
                life: 0.7,
                maxLife: 0.7,
                type: 'spark'
            });
        }
    }

    spawnConfetti(canvasWidth, canvasHeight) {
        const count = 65;
        const colors = ['#f43f5e', '#38bdf8', '#4ade80', '#facc15', '#c084fc', '#fb923c'];
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: Math.random() * canvasWidth,
                y: -20,
                vx: (Math.random() - 0.5) * 120,
                vy: Math.random() * 180 + 120,
                radius: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 2.5,
                maxLife: 2.5,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 6,
                type: 'confetti'
            });
        }
    }

    spawnTrailParticle(x, y, trailDef) {
        if (!trailDef || trailDef.id === 'default') return;

        let color = trailDef.color || '#38bdf8';
        let type = trailDef.particleType || 'dust';
        this.addParticle({
            x: x + (Math.random() * 6 - 3),
            y: y + (Math.random() * 6 - 3),
            vx: -(Math.random() * 140 + 60),
            vy: (Math.random() - 0.5) * 30,
            radius: Math.random() * 4 + 2,
            color: color,
            life: 0.35,
            maxLife: 0.35,
            type: type
        });
    }

    // --- Floating Combat / Score Texts ---

    addFloatingText(text, x, y, color = '#facc15', size = 20, duration = 0.8) {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            vy: -75,
            color: color,
            size: size,
            life: duration,
            maxLife: duration
        });
    }

    addParticle(p) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Remove oldest
        }
        this.particles.push(p);
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.type === 'confetti') {
                p.rotation = (p.rotation || 0) + (p.vRot || 2) * dt;
                p.vy += 80 * dt; // gravity
            } else if (p.type === 'circle' || p.type === 'spark') {
                p.vy += 120 * dt; // subtle gravity
            }
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.life -= dt;
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
                continue;
            }
            ft.y += ft.vy * dt;
        }
    }

    render(ctx) {
        ctx.save();

        // Render particles
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;

            if (p.type === 'confetti') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation || 0);
                ctx.fillRect(-p.radius, -p.radius * 0.6, p.radius * 2, p.radius * 1.2);
                ctx.restore();
            } else if (p.type === 'spark') {
                ctx.fillRect(p.x - p.radius * 0.5, p.y - p.radius * 0.5, p.radius, p.radius);
            } else if (p.type === 'star') {
                this.drawStar(ctx, p.x, p.y, 4, p.radius, p.radius * 0.4);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Render floating texts with drop shadow
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const ft of this.floatingTexts) {
            const progress = ft.life / ft.maxLife;
            ctx.globalAlpha = Math.min(1, progress * 1.5);
            ctx.font = `bold ${ft.size}px 'Rajdhani', sans-serif, system-ui`;

            // Shadow
            ctx.fillStyle = '#000000';
            ctx.fillText(ft.text, ft.x + 2, ft.y + 2);

            // Glow color
            ctx.fillStyle = ft.color;
            ctx.fillText(ft.text, ft.x, ft.y);
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    clear() {
        this.particles.length = 0;
        this.floatingTexts.length = 0;
    }
}
