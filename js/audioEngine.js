// ============================================================================
// FOURTH WING: CODEX OCULUS — Procedural Web Audio API Soundscape Engine
// Generates dark cinematic storm drones, thunderclaps, draconic heartbeats,
// and arcane X-Ray scanner telemetry hum with zero external audio files.
// ============================================================================

export class ArcaneAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.masterGain = null;
    this.scannerOsc = null;
    this.scannerGain = null;
    this.scannerFilter = null;
    this.heartbeatTimer = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.42;
      this.masterGain.connect(this.ctx.destination);

      this._startAtmosphericDrone();
      this._startScannerHum();
      this._startHeartbeatLoop();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API deferred until user gesture:', e);
    }
  }

  resume() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.resume();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0.0 : 0.42,
        this.ctx.currentTime,
        0.15
      );
    }
    return this.isMuted;
  }

  _startAtmosphericDrone() {
    const now = this.ctx.currentTime;
    // Deep Basgiath Storm Cello / Sub-Bass Drone (D1 & A1 fifth)
    const freqs = [36.71, 55.0, 73.42];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(f, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120 + idx * 45, now);

      // Slow breathing LFO on filter
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.08 + idx * 0.03;
      lfoGain.gain.value = 40;
      lfo.connect(filter.frequency);
      lfo.start();

      gain.gain.value = idx === 0 ? 0.22 : 0.06;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
    });

    // Continuous subtle wind noise across the Parapet
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 280;
    windFilter.Q.value = 2.4;

    const windLfo = this.ctx.createOscillator();
    const windLfoGain = this.ctx.createGain();
    windLfo.frequency.value = 0.14;
    windLfoGain.gain.value = 160;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    windLfo.start();

    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.045;

    whiteNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    whiteNoise.start();
  }

  _startScannerHum() {
    this.scannerOsc = this.ctx.createOscillator();
    this.scannerFilter = this.ctx.createBiquadFilter();
    this.scannerGain = this.ctx.createGain();

    this.scannerOsc.type = 'triangle';
    this.scannerOsc.frequency.value = 92;

    this.scannerFilter.type = 'bandpass';
    this.scannerFilter.frequency.value = 260;
    this.scannerFilter.Q.value = 4.0;

    this.scannerGain.gain.value = 0.0;

    this.scannerOsc.connect(this.scannerFilter);
    this.scannerFilter.connect(this.scannerGain);
    this.scannerGain.connect(this.masterGain);
    this.scannerOsc.start();
  }

  updateScannerHum(normalizedSpeed, depthLayer, isHoveringModel) {
    if (!this.isInitialized || this.isMuted || !this.scannerGain) return;
    const now = this.ctx.currentTime;
    const targetGain = isHoveringModel ? Math.min(0.11, 0.025 + normalizedSpeed * 0.08) : 0.005;
    const targetFreq = 85 + depthLayer * 65 + normalizedSpeed * 110;
    this.scannerGain.gain.setTargetAtTime(targetGain, now, 0.08);
    this.scannerOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.scannerFilter.frequency.setTargetAtTime(220 + depthLayer * 340, now, 0.08);
  }

  _startHeartbeatLoop() {
    const beat = () => {
      if (this.isInitialized && !this.isMuted && this.ctx.state === 'running') {
        this._triggerSubHeartbeat();
      }
      this.heartbeatTimer = setTimeout(beat, 2100);
    };
    this.heartbeatTimer = setTimeout(beat, 2100);
  }

  _triggerSubHeartbeat() {
    const now = this.ctx.currentTime;
    // Double thud: lub-dub
    [0, 0.24].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 58 : 48, now + offset);
      osc.frequency.exponentialRampToValueAtTime(24, now + offset + 0.18);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.14 : 0.09, now + offset + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.24);
    });
  }

  playThunderAndLightning() {
    this.resume();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // High-voltage crackle burst + rolling low thunder
    const bufferSize = this.ctx.sampleRate * 1.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.exp(-i / (this.ctx.sampleRate * 0.45));
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(95, now + 1.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  playPulseChime(pitchMultiplier = 1.0) {
    this.resume();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(264 * pitchMultiplier, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}
