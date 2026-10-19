// Lightweight Web Audio API synthesizer for ambient travel soundscapes
// Zero dependencies, fully safe in Node / Vitest / jsdom environments

export type SoundType = 'wind' | 'stream' | 'birds' | 'campfire' | 'highway';

class TravelAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private isCurrentlyPlaying = false;
  private currentType: SoundType | null = null;

  private isAudioSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      (typeof window.AudioContext !== 'undefined' ||
        typeof (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext !== 'undefined')
    );
  }

  private initContext() {
    if (this.ctx) return;
    if (!this.isAudioSupported()) return;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Gentle soothing volume
      this.masterGain.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  public play(type: SoundType) {
    if (!this.isAudioSupported()) {
      this.isCurrentlyPlaying = true;
      this.currentType = type;
      return;
    }

    this.stop();
    this.initContext();

    if (!this.ctx || !this.masterGain) {
      this.isCurrentlyPlaying = true;
      this.currentType = type;
      return;
    }

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.currentType = type;
      this.isCurrentlyPlaying = true;

      // Create white/pink noise buffer for organic nature sound
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filtering
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter based on soundscape type
      const filter = this.ctx.createBiquadFilter();

      if (type === 'wind') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, this.ctx.currentTime);
        filter.Q.setValueAtTime(2, this.ctx.currentTime);
        // Low oscillating wind swell
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.activeOscillators.push(lfo);
      } else if (type === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(580, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      } else if (type === 'birds') {
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        // Melodic chime harmonic
        const chime = this.ctx.createOscillator();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(660, this.ctx.currentTime);
        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        chime.connect(chimeGain);
        chimeGain.connect(this.masterGain);
        chime.start();
        this.activeOscillators.push(chime);
      } else if (type === 'campfire') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(420, this.ctx.currentTime);
        filter.Q.setValueAtTime(0.9, this.ctx.currentTime);
      } else {
        // Highway hum
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, this.ctx.currentTime);
        const hum = this.ctx.createOscillator();
        hum.type = 'sawtooth';
        hum.frequency.setValueAtTime(110, this.ctx.currentTime);
        const humGain = this.ctx.createGain();
        humGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        hum.connect(humGain);
        humGain.connect(this.masterGain);
        hum.start();
        this.activeOscillators.push(hum);
      }

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start();
      this.noiseNode = whiteNoise;
    } catch {
      // Audio playback silently guarded
    }
  }

  public stop() {
    this.isCurrentlyPlaying = false;
    this.currentType = null;

    try {
      if (this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop?.();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      this.activeOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.activeOscillators = [];
    } catch {
      // ignore
    }
  }

  public isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  public getCurrentType(): SoundType | null {
    return this.currentType;
  }
}

export const travelAudio = new TravelAudioSynthesizer();
