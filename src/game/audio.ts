// Procedural Web Audio API Music & Sound Design Engine
// Zero external MP3/WAV dependencies required.

export type MusicTrackId =
  | 'title'
  | 'station'
  | 'garden'
  | 'town'
  | 'arcade'
  | 'winter'
  | 'observatory'
  | 'secret_garden';

export type SfxId =
  | 'uiSelect'
  | 'uiConfirm'
  | 'jump'
  | 'land'
  | 'coin'
  | 'fragment'
  | 'star'
  | 'door'
  | 'rootShrink'
  | 'puzzleSolve'
  | 'secret'
  | 'chapterTransition'
  | 'transform'
  | 'finalReveal'
  | 'talkBlip';

interface TrackStep {
  melody?: number;     // MIDI note
  harmony?: number[];  // MIDI chord notes
  bass?: number;       // MIDI bass note
  arp?: number;        // MIDI arpeggio note
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Carefully composed musical patterns for each chapter
const TRACK_PATTERNS: Record<MusicTrackId, { tempo: number; wave: OscillatorType; steps: TrackStep[] }> = {
  // Title & Observatory Motif: Nostalgic Fmaj7 -> Em7 -> Dm7 -> Cmaj7
  title: {
    tempo: 280,
    wave: 'triangle',
    steps: [
      { melody: 72, harmony: [60, 64, 67, 71], bass: 48, arp: 76 },
      { arp: 79 },
      { melody: 71, arp: 76 },
      { melody: 69, arp: 72 },
      { melody: 67, harmony: [57, 60, 64, 69], bass: 45, arp: 72 },
      { arp: 76 },
      { melody: 69, arp: 72 },
      { melody: 72, arp: 69 },
      { melody: 65, harmony: [53, 57, 60, 64], bass: 41, arp: 69 },
      { arp: 72 },
      { melody: 67, arp: 69 },
      { melody: 69, arp: 65 },
      { melody: 67, harmony: [55, 59, 62, 67], bass: 43, arp: 71 },
      { arp: 74 },
      { melody: 64, arp: 71 },
      { arp: 67 },
    ],
  },
  // Train Station: Gentle, mysterious, slightly melancholic bell tones (Am -> Fmaj7 -> Dm7 -> E7sus4)
  station: {
    tempo: 310,
    wave: 'sine',
    steps: [
      { melody: 69, harmony: [57, 60, 64], bass: 45, arp: 76 },
      { arp: 72 },
      { melody: 71, arp: 69 },
      { melody: 72 },
      { melody: 69, harmony: [53, 57, 60, 64], bass: 41, arp: 76 },
      { arp: 72 },
      { melody: 67, arp: 69 },
      { melody: 64 },
      { melody: 65, harmony: [50, 53, 57, 60], bass: 38, arp: 72 },
      { arp: 69 },
      { melody: 64, arp: 65 },
      { melody: 62 },
      { melody: 64, harmony: [52, 57, 59, 64], bass: 40, arp: 71 },
      { arp: 68 },
      { arp: 64 },
      {},
    ],
  },
  // Overgrown Garden: Whimsical, adventurous, playful arpeggios (G -> Bm -> C -> D)
  garden: {
    tempo: 200,
    wave: 'triangle',
    steps: [
      { melody: 71, harmony: [55, 59, 62], bass: 43, arp: 67 },
      { arp: 71 },
      { melody: 74, arp: 74 },
      { melody: 79, arp: 71 },
      { melody: 78, harmony: [59, 62, 66], bass: 47, arp: 66 },
      { arp: 71 },
      { melody: 74, arp: 74 },
      { melody: 71, arp: 66 },
      { melody: 72, harmony: [60, 64, 67], bass: 48, arp: 67 },
      { arp: 72 },
      { melody: 76, arp: 76 },
      { melody: 74, arp: 72 },
      { melody: 74, harmony: [62, 66, 69], bass: 50, arp: 69 },
      { arp: 74 },
      { melody: 78, arp: 78 },
      { melody: 76, arp: 74 },
    ],
  },
  // Town of Odd Jobs: Warm, cozy, slightly comical & friendly bounce (C -> A7 -> Dm -> G7)
  town: {
    tempo: 215,
    wave: 'triangle',
    steps: [
      { melody: 72, harmony: [60, 64, 67], bass: 48, arp: 67 },
      { melody: 76, bass: 55 },
      { melody: 79, bass: 52, arp: 72 },
      { melody: 76, bass: 55 },
      { melody: 73, harmony: [57, 61, 64, 67], bass: 45, arp: 69 },
      { melody: 76, bass: 52 },
      { melody: 69, bass: 49, arp: 73 },
      { bass: 52 },
      { melody: 74, harmony: [62, 65, 69], bass: 50, arp: 69 },
      { melody: 77, bass: 57 },
      { melody: 76, bass: 53, arp: 74 },
      { melody: 74, bass: 57 },
      { melody: 71, harmony: [55, 59, 62, 65], bass: 43, arp: 67 },
      { melody: 72, bass: 50 },
      { melody: 74, bass: 47, arp: 71 },
      { bass: 50 },
    ],
  },
  // Clockwork Arcade: Retro chiptune pulse, mechanical rhythm & puzzle motif
  arcade: {
    tempo: 170,
    wave: 'square',
    steps: [
      { melody: 76, harmony: [64, 67, 71], bass: 40, arp: 76 },
      { arp: 79, bass: 52 },
      { melody: 79, arp: 83, bass: 40 },
      { melody: 78, arp: 79, bass: 52 },
      { melody: 76, harmony: [60, 64, 67], bass: 36, arp: 72 },
      { arp: 76, bass: 48 },
      { melody: 74, arp: 79, bass: 36 },
      { melody: 72, arp: 76, bass: 48 },
      { melody: 69, harmony: [57, 60, 64], bass: 33, arp: 69 },
      { arp: 72, bass: 45 },
      { melody: 72, arp: 76, bass: 33 },
      { melody: 74, arp: 72, bass: 45 },
      { melody: 71, harmony: [59, 63, 66], bass: 35, arp: 71 },
      { arp: 75, bass: 47 },
      { melody: 74, arp: 78, bass: 35 },
      { melody: 76, arp: 75, bass: 47 },
    ],
  },
  // Quiet Side of Winter: Slow, sparse, crystalline & reflective
  winter: {
    tempo: 360,
    wave: 'sine',
    steps: [
      { melody: 79, harmony: [60, 63, 67, 70], bass: 48, arp: 84 },
      {},
      { melody: 77, arp: 79 },
      { arp: 75 },
      { melody: 75, harmony: [56, 60, 63, 67], bass: 44, arp: 80 },
      {},
      { melody: 74, arp: 75 },
      { arp: 72 },
      { melody: 72, harmony: [53, 56, 60, 63], bass: 41, arp: 77 },
      {},
      { melody: 70, arp: 72 },
      {},
      { melody: 74, harmony: [55, 58, 62, 65], bass: 43, arp: 79 },
      {},
      { arp: 74 },
      {},
    ],
  },
  // Observatory: Fuller, emotional arrangement of the main theme
  observatory: {
    tempo: 250,
    wave: 'triangle',
    steps: [
      { melody: 72, harmony: [60, 64, 67, 71], bass: 48, arp: 79 },
      { arp: 84 },
      { melody: 76, arp: 79 },
      { melody: 79, arp: 76 },
      { melody: 81, harmony: [53, 57, 60, 64], bass: 41, arp: 77 },
      { arp: 81 },
      { melody: 79, arp: 77 },
      { melody: 76, arp: 72 },
      { melody: 74, harmony: [50, 53, 57, 60], bass: 38, arp: 74 },
      { arp: 77 },
      { melody: 76, arp: 81 },
      { melody: 77, arp: 74 },
      { melody: 79, harmony: [55, 59, 62, 67], bass: 43, arp: 74 },
      { arp: 79 },
      { melody: 76, arp: 83 },
      { melody: 74, arp: 79 },
    ],
  },
  // Secret Garden: Peaceful, intimate lullaby variation
  secret_garden: {
    tempo: 320,
    wave: 'sine',
    steps: [
      { melody: 76, harmony: [60, 64, 67, 71], bass: 48, arp: 84 },
      { arp: 79 },
      { melody: 79, arp: 76 },
      { arp: 72 },
      { melody: 77, harmony: [53, 57, 60, 65], bass: 41, arp: 81 },
      { arp: 77 },
      { melody: 76, arp: 72 },
      { arp: 69 },
      { melody: 74, harmony: [55, 59, 62, 67], bass: 43, arp: 79 },
      { arp: 74 },
      { melody: 72, arp: 71 },
      { arp: 67 },
      { melody: 72, harmony: [60, 64, 67, 72], bass: 48, arp: 76 },
      { arp: 79 },
      { arp: 84 },
      {},
    ],
  },
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrack: MusicTrackId | null = null;
  private stepIndex = 0;
  private timerId: number | null = null;
  private isPaused = false;

  private masterVolume = 0.8;
  private musicVolume = 0.7;
  private sfxVolume = 0.85;
  private musicMuted = false;

  public init(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public updateSettings(settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    musicMuted: boolean;
  }): void {
    this.masterVolume = settings.masterVolume;
    this.musicVolume = settings.musicVolume;
    this.sfxVolume = settings.sfxVolume;
    this.musicMuted = settings.musicMuted;
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public playMusic(track: MusicTrackId): void {
    if (this.currentTrack === track && this.timerId !== null) return;
    this.currentTrack = track;
    this.stepIndex = 0;
    this.stopLoop();
    this.scheduleNextStep();
  }

  public stopMusic(): void {
    this.currentTrack = null;
    this.stopLoop();
  }

  private stopLoop(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleNextStep(): void {
    if (!this.currentTrack) return;
    const pattern = TRACK_PATTERNS[this.currentTrack];
    this.timerId = window.setTimeout(() => {
      if (!this.isPaused && !this.musicMuted && this.masterVolume > 0 && this.musicVolume > 0) {
        this.playPatternStep(pattern.steps[this.stepIndex % pattern.steps.length], pattern.wave, pattern.tempo);
      }
      this.stepIndex = (this.stepIndex + 1) % pattern.steps.length;
      this.scheduleNextStep();
    }, pattern.tempo);
  }

  private playPatternStep(step: TrackStep, wave: OscillatorType, tempoMs: number): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const vol = this.masterVolume * this.musicVolume;
    const dur = (tempoMs / 1000) * 1.15;

    // 1. Melody voice
    if (step.melody) {
      this.triggerNote(midiToFreq(step.melody), wave, now, dur * 1.1, vol * 0.14);
    }

    // 2. Harmony pad chord
    if (step.harmony) {
      for (const note of step.harmony) {
        this.triggerNote(midiToFreq(note), 'sine', now, dur * 3.4, vol * 0.045);
      }
    }

    // 3. Bass voice
    if (step.bass) {
      this.triggerNote(midiToFreq(step.bass), 'triangle', now, dur * 1.8, vol * 0.11);
    }

    // 4. Delicate chime / arpeggio voice
    if (step.arp) {
      this.triggerNote(midiToFreq(step.arp), 'sine', now, dur * 0.85, vol * 0.065);
    }
  }

  private triggerNote(
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    peakGain: number
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    const safeGain = Math.max(0.0001, Math.min(0.4, peakGain));
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(safeGain, startTime + Math.min(0.03, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public playSfx(id: SfxId): void {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const vol = this.masterVolume * this.sfxVolume;
    if (vol <= 0.01) return;

    const now = this.ctx.currentTime;

    switch (id) {
      case 'uiSelect':
        this.triggerNote(587.33, 'triangle', now, 0.07, vol * 0.15);
        break;
      case 'uiConfirm':
        this.triggerNote(523.25, 'triangle', now, 0.08, vol * 0.18);
        this.triggerNote(659.25, 'triangle', now + 0.06, 0.12, vol * 0.18);
        break;
      case 'talkBlip': {
        const pitch = 360 + Math.random() * 140;
        this.triggerNote(pitch, 'sine', now, 0.045, vol * 0.09);
        break;
      }
      case 'jump': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
        g.gain.setValueAtTime(vol * 0.18, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }
      case 'land':
        this.triggerNote(130, 'sine', now, 0.07, vol * 0.14);
        break;
      case 'coin':
        this.triggerNote(987.77, 'sine', now, 0.08, vol * 0.16);
        this.triggerNote(1318.51, 'sine', now + 0.07, 0.18, vol * 0.18);
        break;
      case 'door':
        this.triggerNote(330, 'triangle', now, 0.09, vol * 0.16);
        this.triggerNote(440, 'triangle', now + 0.08, 0.12, vol * 0.16);
        break;
      case 'rootShrink':
        [392, 440, 493.88, 587.33, 659.25].forEach((f, idx) => {
          this.triggerNote(f, 'triangle', now + idx * 0.07, 0.2, vol * 0.18);
        });
        break;
      case 'fragment':
        [523.25, 659.25, 783.99, 987.77, 1046.5].forEach((f, idx) => {
          this.triggerNote(f, 'sine', now + idx * 0.09, 0.45, vol * 0.22);
        });
        break;
      case 'star':
        [587.33, 739.99, 880, 1174.66, 1479.98].forEach((f, idx) => {
          this.triggerNote(f, 'triangle', now + idx * 0.08, 0.4, vol * 0.2);
        });
        break;
      case 'puzzleSolve':
        [440, 554.37, 659.25, 880].forEach((f, idx) => {
          this.triggerNote(f, 'triangle', now + idx * 0.09, 0.3, vol * 0.2);
        });
        break;
      case 'secret':
        [659.25, 783.99, 987.77, 1318.51].forEach((f, idx) => {
          this.triggerNote(f, 'sine', now + idx * 0.1, 0.35, vol * 0.2);
        });
        break;
      case 'transform':
        [330, 440, 554.37, 659.25, 880, 1108.73].forEach((f, idx) => {
          this.triggerNote(f, 'sine', now + idx * 0.06, 0.35, vol * 0.2);
        });
        break;
      case 'chapterTransition':
        this.triggerNote(261.63, 'sine', now, 0.5, vol * 0.18);
        this.triggerNote(392.0, 'sine', now + 0.12, 0.6, vol * 0.18);
        this.triggerNote(523.25, 'sine', now + 0.25, 0.8, vol * 0.2);
        break;
      case 'finalReveal':
        [261.63, 329.63, 392.0, 493.88, 523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
          this.triggerNote(f, 'triangle', now + idx * 0.1, 0.65, vol * 0.22);
        });
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
