/**
 * NextGen Academy - Professional Audio & Voice Announcement Engine
 * Ultra-Reliable Bengali/English Voice Synthesis & Web Audio API Engine
 * Bulletproof against browser autoplay restrictions, voice loading asynchrony, and OS quirks.
 */

let audioCtx = null;
let currentUtterance = null;
let keepAliveTimer = null;
let cachedVoices = [];
let hasUnlockedAudio = false;

// 1. Preload and Cache Voices with Asynchronous Listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const refreshVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices() || [];
      if (v && v.length > 0) {
        cachedVoices = v;
      }
    } catch (e) {}
  };

  refreshVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  // Pre-warm on first user interaction anywhere on the window
  const handleFirstInteraction = () => {
    if (!hasUnlockedAudio) {
      unlockAudio();
      hasUnlockedAudio = true;
    }
  };
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
  });
}

/**
 * Ensures Web Audio API AudioContext is created and running
 */
export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    console.warn('AudioContext initialization error:', e);
  }
  return audioCtx;
}

/**
 * Explicit User-Interaction Audio & Speech Unlocker
 * Guarantees bypass of browser autoplay policies when invoked during click handlers
 */
export function unlockAudio() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  } catch (e) {
    console.warn('Audio unlock notice:', e);
  }
}

/**
 * High-Fidelity Harmonic Chime Generator using pure Web Audio API synthesis
 */
export function playChime(chimeType = 'pleasant_bell') {
  if (isVoiceMuted() || typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (chimeType === 'pleasant_bell') {
      // Dual-tone harmonic bell: D5 (587.33Hz) -> A5 (880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.1);
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.8);
    } else if (chimeType === 'digital_ping') {
      // Crisp Digital Ping: G5 (783.99Hz) -> C6 (1046.50Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(783.99, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (chimeType === 'gentle_harp') {
      // Warm Triad Arpeggio
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    }
  } catch (err) {
    console.warn('Chime audio playback error:', err);
  }
}

/**
 * Intelligent Professional Female Voice Selection with Bengali First Strategy
 */
export function getProfessionalFemaleVoice(targetLang = 'bn-BD') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  let voices = cachedVoices;
  if (!voices || voices.length === 0) {
    try {
      voices = window.speechSynthesis.getVoices() || [];
      if (voices && voices.length > 0) cachedVoices = voices;
    } catch (e) {}
  }
  if (!voices || voices.length === 0) return null;

  const langCode = (targetLang || 'bn-BD').toLowerCase();
  const baseLang = langCode.split('-')[0]; // 'bn'

  const femaleKeywords = [
    'female', 'zira', 'heera', 'swara', 'samantha', 'karen', 'victoria',
    'moira', 'veena', 'aditi', 'kalpana', 'geeta', 'tessa', 'sangeeta',
    'google bangla', 'google বাংলা', 'bangla female', 'bengali female', 'natural'
  ];

  // 1. Direct Target Language + Female Match
  const directMatch = voices.find(v => {
    const vLang = (v.lang || '').toLowerCase();
    const vName = (v.name || '').toLowerCase();
    const isLang = vLang.includes(langCode) || vLang.includes(baseLang);
    const isFemale = femaleKeywords.some(kw => vName.includes(kw));
    return isLang && isFemale;
  });
  if (directMatch) return directMatch;

  // 2. Any Bengali Voice (Google বাংলা, Microsoft Swara, etc.)
  const bengaliVoice = voices.find(v => {
    const vLang = (v.lang || '').toLowerCase();
    const vName = (v.name || '').toLowerCase();
    return vLang.includes('bn') || vLang.includes('bangla') || vLang.includes('bengali') || vName.includes('bangla') || vName.includes('bengali');
  });
  if (bengaliVoice) return bengaliVoice;

  // 3. High-Quality South Asian / Indian English / Multi-lingual Female Voice
  const fluentFemaleVoice = voices.find(v => {
    const vName = (v.name || '').toLowerCase();
    const vLang = (v.lang || '').toLowerCase();
    const isFemale = femaleKeywords.some(kw => vName.includes(kw));
    return isFemale && (vLang.includes('en-in') || vLang.includes('hi') || vLang.includes('en'));
  });
  if (fluentFemaleVoice) return fluentFemaleVoice;

  // 4. Any Female Voice
  const anyFemale = voices.find(v => {
    const vName = (v.name || '').toLowerCase();
    return femaleKeywords.some(kw => vName.includes(kw));
  });
  if (anyFemale) return anyFemale;

  // 5. System Default Voice Fallback
  return voices.find(v => v.default) || voices[0] || null;
}

/**
 * Speaks text using the configured Professional Voice with Guaranteed Playback
 */
export function speakText(text, options = {}) {
  if (isVoiceMuted() || typeof window === 'undefined' || !window.speechSynthesis) {
    if (options.onEnd) options.onEnd();
    return;
  }

  // 1. Synchronously unlock and clear stuck queues
  unlockAudio();
  stopSpeech();

  const {
    lang = 'bn-BD',
    pitch = 1.08,    // 1.08 = Warm, clear professional female frequency
    rate = 0.94,     // 0.94 = Articulate, natural speed
    volume = 1.0,    // 1.0 = Full rich volume
    playChimeBefore = true,
    chimeType = 'pleasant_bell',
    onStart,
    onEnd,
    onError
  } = options;

  if (playChimeBefore && chimeType && chimeType !== 'none') {
    playChime(chimeType);
  }

  const cleanText = (text || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  // Slight 160ms delay allowing harmonic chime resonance, without losing gesture context
  const delayMs = playChimeBefore && chimeType && chimeType !== 'none' ? 160 : 0;

  const executeSpeech = () => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      currentUtterance = utterance; // Prevent garbage collection mid-speech

      utterance.pitch = Math.max(0.5, Math.min(2.0, Number(pitch) || 1.08));
      utterance.rate = Math.max(0.5, Math.min(2.0, Number(rate) || 0.94));
      utterance.volume = Math.max(0.1, Math.min(1.0, Number(volume) || 1.0));

      const selectedVoice = getProfessionalFemaleVoice(lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        // Synchronize language tag to the voice's native language to prevent Windows SAPI drops
        utterance.lang = selectedVoice.lang || lang;
      } else {
        utterance.lang = lang;
      }

      utterance.onstart = () => {
        // Chromium 15-second cutoff prevention keepalive
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        keepAliveTimer = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(keepAliveTimer);
          }
        }, 10000);

        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        currentUtterance = null;
        console.warn('Speech synthesis error event:', e);
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      currentUtterance = null;
      console.warn('Speech synthesis execution failed:', err);
      if (onError) onError(err);
      if (onEnd) onEnd();
    }
  };

  if (delayMs > 0) {
    setTimeout(executeSpeech, delayMs);
  } else {
    executeSpeech();
  }
}

/**
 * Stops active speech immediately
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      currentUtterance = null;
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}
  }
}

/**
 * Checks if browser supports Speech Synthesis
 */
export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Mute preference controls
 */
export function isVoiceMuted() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('nextgen_voice_muted') === 'true';
}

export function setVoiceMuted(muted) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nextgen_voice_muted', muted ? 'true' : 'false');
  if (muted) stopSpeech();
}

/**
 * Session throttling for auto-speaking banners
 */
export function hasSpokenInSession(announcementId) {
  if (typeof window === 'undefined' || !announcementId) return false;
  return sessionStorage.getItem('nextgen_announced_' + announcementId) === 'true';
}

export function markSpokenInSession(announcementId) {
  if (typeof window === 'undefined' || !announcementId) return;
  sessionStorage.setItem('nextgen_announced_' + announcementId, 'true');
}