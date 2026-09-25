/**
 * Procedural Web Audio API Sound & Music Engine
 * Generates all sound effects and multi-track dynamic world soundtracks in real time.
 * 100% self-contained, zero external asset dependencies, zero 404s, zero latency.
 */

export class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.musicGain = null;

        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;
        this.muted = false;

        this.musicPlaying = false;
        this.currentWorldId = 'neo_city';
        this.tempo = 128;
        this.step = 0;
        this.schedulerTimer = null;
        this.nextNoteTime = 0;

        // Auto unlock audio context on first interaction
        this.initOnInteraction = this.initOnInteraction.bind(this);
        window.addEventListener('pointerdown', this.initOnInteraction, { once: true });
        window.addEventListener('keydown', this.initOnInteraction, { once: true });
    }

    initContext() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();

        this.sfxGain.connect(this.masterGain);
        this.musicGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.applyVolumes();
    }

    initOnInteraction() {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    applyVolumes() {
        if (!this.masterGain) return;
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, now);
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
        this.musicGain.gain.setValueAtTime(this.musicVolume, now);
    }

    setMuted(muted) {
        this.muted = muted;
        this.applyVolumes();
    }

    setSfxVolume(vol) {
        this.sfxVolume = Math.max(0, Math.min(1, vol));
        this.applyVolumes();
    }

    setMusicVolume(vol) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
        this.applyVolumes();
    }

    // ==========================================
    // PROCEDURAL SOUND EFFECTS
    // ==========================================

    playJump() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(460, now + 0.16);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playDoubleJump() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.2);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(640, now);
        osc2.frequency.exponentialRampToValueAtTime(1480, now + 0.2);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.22);
        osc2.stop(now + 0.22);
    }

    playSlide() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.22;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.2);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    playCoin() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playGem() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00];

        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.04);

            gain.gain.setValueAtTime(0.3, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.28);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 0.3);
        });
    }

    playPowerUp() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.25, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.2);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.22);
        });
    }

    playShieldHit() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    playCollision() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;

        // Sub thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.36);

        // Crunch noise
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.4, now);
        nGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        noise.connect(nGain);
        nGain.connect(this.sfxGain);
        noise.start(now);
    }

    playCombo(multiplier) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const base = 440 * Math.pow(1.12, Math.min(10, multiplier));
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(base * 1.25, now + 0.18);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    playLevelUp() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.35, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.4);
        });
    }

    playButtonClick() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.07);
    }

    // ==========================================
    // PROCEDURAL MUSIC SEQUENCER
    // ==========================================

    startMusic(worldId = 'neo_city') {
        this.initContext();
        this.currentWorldId = worldId;
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        this.step = 0;
        this.nextNoteTime = this.ctx.currentTime + 0.05;
        this.scheduler();
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.schedulerTimer) {
            clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }
    }

    switchWorldMusic(worldId) {
        this.currentWorldId = worldId;
    }

    scheduler() {
        if (!this.musicPlaying || !this.ctx) return;

        // Schedule notes ahead within 100ms lookahead window
        while (this.nextNoteTime < this.ctx.currentTime + 0.12) {
            this.scheduleStep(this.step, this.nextNoteTime);
            const secondsPerStep = (60 / this.tempo) / 4; // 16th notes
            this.nextNoteTime += secondsPerStep;
            this.step = (this.step + 1) % 32;
        }

        this.schedulerTimer = setTimeout(() => this.scheduler(), 45);
    }

    scheduleStep(stepIndex, time) {
        if (this.muted || this.musicVolume <= 0) return;

        // Bassline every 4 steps (quarter note offbeats)
        if (stepIndex % 4 === 0) {
            this.triggerBass(stepIndex, time);
        }

        // Arpeggiated melody on 16th notes
        if (stepIndex % 2 === 0) {
            this.triggerLead(stepIndex, time);
        }

        // Percussion: Hi-hat noise on 8th notes, subtle snare clap on 4 and 12
        this.triggerPercussion(stepIndex, time);
    }

    triggerBass(step, time) {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        // World-specific root pitch
        let rootFreq = 55; // A1 for Neo City
        if (this.currentWorldId === 'emerald_forest') rootFreq = 65.41; // C2
        else if (this.currentWorldId === 'sunset_desert') rootFreq = 61.74; // B1
        else if (this.currentWorldId === 'frost_peak') rootFreq = 73.42; // D2
        else if (this.currentWorldId === 'cyber_2099') rootFreq = 55.0; // A1

        // 4-bar progression shift
        const bar = Math.floor(step / 8);
        const pitchOffsets = [1, 1, 1.25, 0.95];
        const freq = rootFreq * (pitchOffsets[bar] || 1);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, time);
        filter.frequency.exponentialRampToValueAtTime(70, time + 0.22);

        gain.gain.setValueAtTime(0.28, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.24);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.25);
    }

    triggerLead(step, time) {
        // Melodic patterns according to world
        let notes = [220, 261.63, 329.63, 392, 440, 523.25]; // A minor
        if (this.currentWorldId === 'emerald_forest') {
            notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C pentatonic
        } else if (this.currentWorldId === 'sunset_desert') {
            notes = [246.94, 261.63, 329.63, 369.99, 392.00]; // Phrygian
        } else if (this.currentWorldId === 'frost_peak') {
            notes = [293.66, 329.63, 349.23, 440.00, 493.88]; // Dorian
        } else if (this.currentWorldId === 'cyber_2099') {
            notes = [220, 277.18, 329.63, 415.30, 440]; // Cyber minor
        }

        const noteIndex = (step * 3 + Math.floor(step / 4)) % notes.length;
        const freq = notes[noteIndex];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = (this.currentWorldId === 'cyber_2099') ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.18);
    }

    triggerPercussion(step, time) {
        // Subtle hi-hat on every offbeat
        if (step % 2 === 1) {
            const bufferSize = this.ctx.sampleRate * 0.04;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
            }
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(7000, time);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.08, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.038);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            src.start(time);
        }

        // Snare on step 4, 12, 20, 28
        if (step % 8 === 4) {
            const bufferSize = this.ctx.sampleRate * 0.09;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400, time);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.14, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.085);

            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            src.start(time);
        }
    }
}

export const audio = new AudioManager();
