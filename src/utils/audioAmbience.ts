/**
 * Audio Ambience Generator using Web Audio API
 * Generates atmospheric winter wind and quiet night drone without external assets
 */

class AmbienceController {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private currentMode: 'wind' | 'night' | 'off' = 'off';
  private volume = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getMode(): 'wind' | 'night' | 'off' {
    return this.currentMode;
  }

  public startWind() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = 'wind';
    this.isPlaying = true;

    // Create pink noise buffer for realistic winter wind
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter to simulate cold muffled wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO for slow wind gusts
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Secondary subtle high whistle for cold draft
    const whistle = this.ctx.createBiquadFilter();
    whistle.type = 'bandpass';
    whistle.frequency.setValueAtTime(540, this.ctx.currentTime);
    whistle.Q.setValueAtTime(8.0, this.ctx.currentTime);

    const whistleLfo = this.ctx.createOscillator();
    whistleLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const whistleLfoGain = this.ctx.createGain();
    whistleLfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    whistleLfo.connect(whistleLfoGain);
    whistleLfoGain.connect(whistle.frequency);

    const whistleGain = this.ctx.createGain();
    whistleGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);

    whiteNoise.connect(whistle);
    whistle.connect(whistleGain);
    whistleGain.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);

    whiteNoise.start();
    lfo.start();
    whistleLfo.start();

    this.noiseNode = whiteNoise;
  }

  public startNight() {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentMode = 'night';
    this.isPlaying = true;

    // Low gentle drone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    this.noiseNode = osc1;
  }

  public stop() {
    if (this.ctx && this.noiseNode) {
      try {
        if ('stop' in this.noiseNode && typeof (this.noiseNode as AudioScheduledSourceNode).stop === 'function') {
          (this.noiseNode as AudioScheduledSourceNode).stop();
        }
      } catch {
        // ignore already stopped
      }
    }
    this.noiseNode = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentMode = 'off';
  }

  public toggle(mode: 'wind' | 'night') {
    if (this.currentMode === mode) {
      this.stop();
    } else if (mode === 'wind') {
      this.startWind();
    } else {
      this.startNight();
    }
  }

  public playPageTurnSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // safe fallback
    }
  }
}

export const ambienceManager = new AmbienceController();
