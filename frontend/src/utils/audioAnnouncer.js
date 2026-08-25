/**
 * NextGen Academy - Professional Audio & Voice Announcement Engine
 * Incorporates Web Audio API chime synthesis and natural Bengali/English Professional Female Voice TTS
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * High-Fidelity Acoustic Chime Generator using pure Web Audio API synthesis
 * No external mp3 downloads required.
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
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.12);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.85);
    } else if (chimeType === 'digital_ping') {
      // Modern Crisp Ping: G5 (783.99Hz) -> C6 (1046.50Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(783.99, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (chimeType === 'gentle_harp') {
      // Warm Triad Arpeggio: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.16, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.7);
      });
    }
  } catch (err) {
    console.warn('Chime audio playback prevented:', err);
  }
}

/**
 * Intelligent Professional Female Voice Detection & Selection
 */
export function getProfessionalFemaleVoice(targetLang = 'bn-BD') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const langCode = (targetLang || 'bn-BD').toLowerCase();
  const baseLang = langCode.split('-')[0]; // 'bn'

  // Known high-quality female voice names across Windows, macOS, Android, ChromeOS, iOS
  const femaleVoiceKeywords = [
    'female', 'zira', 'heera', 'swara', 'samantha', 'karen', 'victoria',
    'moira', 'veena', 'aditi', 'kalpana', 'geeta', 'tessa', 'sangeeta',
    'google bangla', 'google বাংলা', 'bangla female', 'bengali female', 'natural'
  ];

  // 1. First priority: Target language + explicit female match
  const directMatch = voices.find(v => {
    const vLang = (v.lang || '').toLowerCase();
    const vName = (v.name || '').toLowerCase();
    const isLangMatch = vLang.includes(langCode) || vLang.includes(baseLang);
    const isFemale = femaleVoiceKeywords.some(kw => vName.includes(kw));
    return isLangMatch && isFemale;
  });
  if (directMatch) return directMatch;

  // 2. Second priority: Any Bengali voice
  const bengaliVoice = voices.find(v => {
    const vLang = (v.lang || '').toLowerCase();
    return vLang.includes('bn') || vLang.includes('bangla') || vLang.includes('bengali');
  });
  if (bengaliVoice) return bengaliVoice;

  // 3. Third priority: High quality female voice in English / Indian accent (fluent multi-lingual)
  const fluentFemaleVoice = voices.find(v => {
    const vName = (v.name || '').toLowerCase();
    const isFemale = femaleVoiceKeywords.some(kw => vName.includes(kw));
    return isFemale && (v.lang.includes('en') || v.lang.includes('hi'));
  });
  if (fluentFemaleVoice) return fluentFemaleVoice;

  // 4. Fallback: First default voice
  return voices[0] || null;
}

/**
 * Speaks text using the configured Professional Female Voice
 */
export function speakText(text, options = {}) {
  if (isVoiceMuted() || typeof window === 'undefined' || !window.speechSynthesis) {
    if (options.onEnd) options.onEnd();
    return;
  }

  // Cancel any ongoing utterance
  stopSpeech();

  const {
    lang = 'bn-BD',
    pitch = 1.08,    // 1.08 = Warm, clear professional female frequency
    rate = 0.94,     // 0.94 = Articulate, natural speed
    volume = 1.0,
    playChimeBefore = true,
    chimeType = 'pleasant_bell',
    onStart,
    onEnd,
    onError
  } = options;

  if (playChimeBefore && chimeType && chimeType !== 'none') {
    playChime(chimeType);
  }

  // Slight 200ms delay to allow the chime tone to resonate
  const delayMs = playChimeBefore && chimeType && chimeType !== 'none' ? 220 : 0;

  setTimeout(() => {
    try {
      const cleanText = (text || '').replace(/<[^>]*>?/gm, '').trim();
      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;

      const femaleVoice = getProfessionalFemaleVoice(lang);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis execution failed:', err);
      if (onError) onError(err);
      if (onEnd) onEnd();
    }
  }, delayMs);
}

/**
 * Stops active speech immediately
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
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
 * Session throttling so auto-speaking banners don't repeat infinitely
 */
export function hasSpokenInSession(announcementId) {
  if (typeof window === 'undefined' || !announcementId) return false;
  return sessionStorage.getItem(`nextgen_announced_${announcementId}`) === 'true';
}

export function markSpokenInSession(announcementId) {
  if (typeof window === 'undefined' || !announcementId) return;
  sessionStorage.setItem(`nextgen_announced_${announcementId}`, 'true');
}
