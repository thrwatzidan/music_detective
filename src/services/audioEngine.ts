// Web Audio API Synthesizer for Musical Detective Game

class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentSourceNodes: { stop: () => void }[] = [];
  public isMuted: boolean = false;
  private isVoiceMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public stopAllTracks() {
    this.currentSourceNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // already stopped
      }
    });
    this.currentSourceNodes = [];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // 1. Play Solo Organ / Piano Melody (أداء آلي منفرد)
  public playSoloOrgan(): () => void {
    if (this.isMuted) return () => {};
    this.stopAllTracks();
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const now = ctx.currentTime;
    const melody = [
      { note: 261.63, dur: 0.5 }, // C4
      { note: 293.66, dur: 0.5 }, // D4
      { note: 329.63, dur: 0.6 }, // E4
      { note: 392.00, dur: 0.6 }, // G4
      { note: 329.63, dur: 0.5 }, // E4
      { note: 261.63, dur: 0.9 }, // C4
    ];

    let t = now + 0.05;
    melody.forEach(({ note, dur }) => {
      // Organ sound created with fundamental + 2nd harmonic + 3rd harmonic
      [1, 2, 3].forEach((harmonic, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(note * harmonic, t);

        const amp = (0.2 / (idx + 1)) * 0.7;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(amp, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + dur);

        this.currentSourceNodes.push({ stop: () => osc.stop() });
      });
      t += dur * 0.95;
    });

    return () => this.stopAllTracks();
  }

  // 2. Play Group Instrumental Ensemble (أداء آلي جماعي - أورج، نحاسيات، إيقاع)
  public playGroupEnsemble(): () => void {
    if (this.isMuted) return () => {};
    this.stopAllTracks();
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const now = ctx.currentTime;
    const tempo = 0.35;

    // Drums: Kick + Snare + Hi-hat loop
    for (let bar = 0; bar < 8; bar++) {
      const beatTime = now + bar * tempo;

      // Kick on beat 0, 2, 4, 6
      if (bar % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, beatTime);
        osc.frequency.exponentialRampToValueAtTime(45, beatTime + 0.15);
        gain.gain.setValueAtTime(0.35, beatTime);
        gain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(beatTime);
        osc.stop(beatTime + 0.2);
        this.currentSourceNodes.push({ stop: () => osc.stop() });
      } else {
        // Snare on beat 1, 3, 5, 7
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, beatTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, beatTime);
        gain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.12);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(beatTime);
        noise.stop(beatTime + 0.13);
        this.currentSourceNodes.push({ stop: () => noise.stop() });
      }
    }

    // Brass / Keyboard multi-chords
    const chordSeq = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 349.23, 440.00], // D minor
      [329.63, 392.00, 493.88], // E minor
      [261.63, 329.63, 392.00, 523.25], // C octave
    ];

    chordSeq.forEach((chord, i) => {
      const chordTime = now + i * 0.7;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, chordTime);

        // Warm brass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, chordTime);
        filter.frequency.linearRampToValueAtTime(1800, chordTime + 0.1);
        filter.frequency.exponentialRampToValueAtTime(800, chordTime + 0.6);

        gain.gain.setValueAtTime(0, chordTime);
        gain.gain.linearRampToValueAtTime(0.08, chordTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 0.68);
        this.currentSourceNodes.push({ stop: () => osc.stop() });
      });
    });

    return () => this.stopAllTracks();
  }

  // 3. Play Solo Vocal (أداء غنائي منفرد - صوت إنساني نغمي منفرد)
  public playSoloVoice(): () => void {
    if (this.isMuted) return () => {};
    this.stopAllTracks();
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const now = ctx.currentTime;
    const vocalNotes = [
      { note: 349.23, dur: 0.6 }, // F4
      { note: 392.00, dur: 0.5 }, // G4
      { note: 440.00, dur: 0.7 }, // A4
      { note: 392.00, dur: 0.5 }, // G4
      { note: 349.23, dur: 0.9 }, // F4
    ];

    let t = now + 0.05;
    vocalNotes.forEach(({ note, dur }) => {
      // Simulated vocal tract with formant filters (Ah / Ooh sound)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, t);

      // Add gentle human vibrato
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(5.5, t); // 5.5 Hz vibrato
      vibratoGain.gain.setValueAtTime(2.5, t);
      vibrato.connect(osc.frequency);
      vibrato.start(t + 0.15);
      vibrato.stop(t + dur);

      // Formant filters for vowel "Ah" (F1 ~ 800Hz, F2 ~ 1200Hz)
      const formant1 = ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(800, t);
      formant1.Q.setValueAtTime(5, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur - 0.02);

      osc.connect(formant1);
      formant1.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur);

      this.currentSourceNodes.push({ stop: () => { osc.stop(); vibrato.stop(); } });
      t += dur * 0.92;
    });

    return () => this.stopAllTracks();
  }

  // 4. Play Choral Harmony Choir (أداء غنائي جماعي - الكورال)
  public playChoirGroup(): () => void {
    if (this.isMuted) return () => {};
    this.stopAllTracks();
    const ctx = this.initContext();
    if (!ctx) return () => {};

    const now = ctx.currentTime;
    // Choral harmony chords sung together
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C major choir
      [220.00, 261.63, 329.63, 440.00], // A minor choir
      [349.23, 440.00, 523.25, 698.46], // F major choir
      [261.63, 329.63, 392.00, 523.25], // C major resolution
    ];

    chords.forEach((chord, i) => {
      const chordTime = now + i * 0.85;
      chord.forEach((freq, voiceIdx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        // Add soft choir vibrato with slight detuning
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(4.8 + voiceIdx * 0.3, chordTime);
        vibratoGain.gain.setValueAtTime(1.8, chordTime);
        vibrato.connect(osc.frequency);
        vibrato.start(chordTime);
        vibrato.stop(chordTime + 0.8);

        // Vocal formant
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700 + voiceIdx * 150, chordTime);
        filter.Q.setValueAtTime(3.5, chordTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, chordTime);
        gain.gain.linearRampToValueAtTime(0.09, chordTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.82);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chordTime);
        osc.stop(chordTime + 0.84);
        this.currentSourceNodes.push({ stop: () => { osc.stop(); vibrato.stop(); } });
      });
    });

    return () => this.stopAllTracks();
  }

  // Play based on audioTrackType
  public playTrack(type: string): () => void {
    if (type === 'solo_organ' || type === 'solo_oud') {
      return this.playSoloOrgan();
    } else if (type === 'group_ensemble' || type === 'brass_orchestra') {
      return this.playGroupEnsemble();
    } else if (type === 'solo_voice' || type === 'school_solo_singer') {
      return this.playSoloVoice();
    } else if (type === 'choir_harmony' || type === 'children_choir') {
      return this.playChoirGroup();
    }
    return this.playSoloOrgan();
  }

  // Sound Effects: Correct Chime (نغمة إجابة صحيحة مفرحة)
  public playCorrectChime(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  // Sound Effects: Encouragement Tone (نغمة لطيفة لإعادة المحاولة)
  public playHintTone(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440.00, 493.88]; // A4 -> B4 gentle ping
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.38);
    });
  }

  // Sound Effects: Click / Tap Sound
  public playClickSound(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Sound Effects: Train Whistle / Advance
  public playTrainWhistle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [587.33, 739.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    });
  }

  // Sound Effects: Victory Fanfare
  public playVictoryFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const fanfare = [
      { f: 523.25, t: 0, d: 0.18 },
      { f: 523.25, t: 0.2, d: 0.18 },
      { f: 523.25, t: 0.4, d: 0.18 },
      { f: 659.25, t: 0.6, d: 0.35 },
      { f: 587.33, t: 0.95, d: 0.2 },
      { f: 659.25, t: 1.15, d: 0.2 },
      { f: 783.99, t: 1.35, d: 0.7 },
    ];
    const now = ctx.currentTime;
    fanfare.forEach(item => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(item.f, now + item.t);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + item.t);

      gain.gain.setValueAtTime(0, now + item.t);
      gain.gain.linearRampToValueAtTime(0.14, now + item.t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.t);
      osc.stop(now + item.t + item.d + 0.05);
    });
  }

  // Web Speech API for Arabic voice narration
  public speakArabic(text: string, onEnd?: () => void): void {
    if (this.isMuted || this.isVoiceMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.pitch = 1.1; // youthful tone

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const audioEngine = new AudioEngine();
