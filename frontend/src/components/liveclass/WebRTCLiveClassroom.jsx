import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import LiveClassChatPanel from './LiveClassChatPanel';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Radio,
  Sparkles,
  Settings,
  Users,
  MessageSquare,
  Hand,
  Maximize,
  Minimize,
  AlertCircle,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  Lock,
  Camera,
  Layers,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export default function WebRTCLiveClassroom({ liveClass, isOpen, onClose, role = 'STUDENT' }) {
  const { lang } = useLanguage();
  const { user } = useAuth();

  // Step 1: 'PREVIEW' (Lobby / Check Audio & Video), Step 2: 'IN_CLASS' (Active Classroom)
  const [sessionStage, setSessionStage] = useState('PREVIEW');

  // Media Track States
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [permissionErrorType, setPermissionErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(0); // 0 - 100%

  // In-Class UI States
  const [showChat, setShowChat] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [classTimer, setClassTimer] = useState(0);
  const [participantCount, setParticipantCount] = useState(14);
  const [activeSpeaker, setActiveSpeaker] = useState('TEACHER'); // 'TEACHER' | 'ME' | 'SCREEN'

  // Device lists
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');

  // Refs
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mainVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const classroomContainerRef = useRef(null);

  // Initialize Media on Open
  useEffect(() => {
    if (isOpen) {
      setSessionStage('PREVIEW');
      setHasPermissionError(false);
      setErrorMessage('');
      initMediaPreview();
    } else {
      stopAllMedia();
    }

    return () => {
      stopAllMedia();
    };
  }, [isOpen]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  // Timer when in class
  useEffect(() => {
    if (sessionStage === 'IN_CLASS') {
      timerIntervalRef.current = setInterval(() => {
        setClassTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setClassTimer(0);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sessionStage]);

  // Enumerate input devices
  const getConnectedDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter((d) => d.kind === 'videoinput');
      const audioDevs = devices.filter((d) => d.kind === 'audioinput');
      setVideoDevices(videoDevs);
      setAudioDevices(audioDevs);
      if (videoDevs.length > 0 && !selectedVideoDevice) setSelectedVideoDevice(videoDevs[0].deviceId);
      if (audioDevs.length > 0 && !selectedAudioDevice) setSelectedAudioDevice(audioDevs[0].deviceId);
    } catch (e) {
      console.warn('Could not enumerate devices:', e);
    }
  };

  // Initialize WebRTC UserMedia Preview
  const initMediaPreview = async () => {
    setHasPermissionError(false);
    setErrorMessage('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('আপনার ব্রাউজার WebRTC ক্যামেরা/মাইক্রোফোন সাপোর্ট করে না।');
      }

      // Stop old tracks first
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // Attach stream to preview video
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      // Setup Web Audio API for Mic Meter
      setupAudioMeter(stream);

      // Fetch devices
      getConnectedDevices();
    } catch (err) {
      console.error('WebRTC getUserMedia error:', err);
      setHasPermissionError(true);
      setPermissionErrorType(err.name || 'PermissionDenied');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'ক্যামেরা ও মাইক্রোফোন ব্যবহারের অনুমতি প্রত্যাখ্যাত হয়েছে। ব্রাউজার সেটিংসে গিয়ে পারমিশন চালু করুন।'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('আপনার ডিভাইসে কোনো সংযুক্ত ক্যামেরা বা মাইক্রোফোন পাওয়া যায়নি।');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('ক্যামেরা বা মাইক্রোফোনটি অন্য কোনো অ্যাপ্লিকেশনে ব্যবহৃত হচ্ছে।');
      } else {
        setErrorMessage(err.message || 'মিডিয়া ডিভাইস চালুকরণে সমস্যা দেখা দিয়েছে।');
      }
    }
  };

  // Setup Real-Time Microphone Level Visualizer
  const setupAudioMeter = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));

        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.warn('AudioContext visualization not available:', err);
    }
  };

  // Toggle Video Track (Camera On / Off)
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextState = !cameraEnabled;
        videoTracks.forEach((t) => {
          t.enabled = nextState;
        });
        setCameraEnabled(nextState);
      }
    }
  };

  // Toggle Audio Track (Mic Mute / Unmute)
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !micEnabled;
        audioTracks.forEach((t) => {
          t.enabled = nextState;
        });
        setMicEnabled(nextState);
      }
    }
  };

  // Toggle Screen Sharing (getDisplayMedia)
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop Screen Share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);

      // Return main video to local or teacher stream
      if (mainVideoRef.current && localStreamRef.current) {
        mainVideoRef.current.srcObject = localStreamRef.current;
      }
    } else {
      try {
        if (!navigator.mediaDevices.getDisplayMedia) {
          alert('আপনার ব্রাউজার স্ক্রিন শেয়ার সমর্থন করে না।');
          return;
        }

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });

        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        if (mainVideoRef.current) {
          mainVideoRef.current.srcObject = screenStream;
        }

        // When user stops sharing via browser bar
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (mainVideoRef.current && localStreamRef.current) {
            mainVideoRef.current.srcObject = localStreamRef.current;
          }
        };
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!classroomContainerRef.current) return;
    if (!document.fullscreenElement) {
      classroomContainerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  // Stop all media and reset
  const stopAllMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsScreenSharing(false);
    setAudioLevel(0);
  };

  // Enter Class Action
  const handleJoinClass = () => {
    setSessionStage('IN_CLASS');

    // Attach stream to classroom videos after render
    setTimeout(() => {
      if (mainVideoRef.current && localStreamRef.current) {
        mainVideoRef.current.srcObject = localStreamRef.current;
      }
      if (pipVideoRef.current && localStreamRef.current) {
        pipVideoRef.current.srcObject = localStreamRef.current;
      }
    }, 100);
  };

  // Leave Class Action
  const handleLeaveClass = () => {
    stopAllMedia();
    setSessionStage('PREVIEW');
    onClose();
  };

  if (!isOpen) return null;

  // Format Timer: MM:SS
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={classroomContainerRef}
        className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden text-white relative"
      >
        {/* ========================================================================= */}
        {/* STAGE 1: PRE-JOIN MEDIA PREVIEW SCREEN (লবি / ডিভাইস অডিও-ভিডিও টেস্ট) */}
        {/* ========================================================================= */}
        {sessionStage === 'PREVIEW' ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-white">
                    {liveClass?.title || 'অনলাইন লাইভ ক্লাস'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {liveClass?.subject?.nameBn || 'সাধারণ বিষয়'} • শিক্ষক:{' '}
                    {liveClass?.teacher?.user?.name || 'একাডেমি শিক্ষক'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Preview Content */}
            <div className="flex-1 p-6 sm:p-10 flex items-center justify-center">
              <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Column: Live Camera Video Tile with Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl flex items-center justify-center group">
                    {/* Live Video Tag */}
                    <video
                      ref={previewVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover transform -scale-x-100 ${
                        cameraEnabled && !hasPermissionError ? 'block' : 'hidden'
                      }`}
                    />

                    {/* Fallback avatar when camera is disabled or blocked */}
                    {(!cameraEnabled || hasPermissionError) && (
                      <div className="text-center space-y-3 p-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg ring-4 ring-white/10">
                          {user?.name ? user.name.slice(0, 1) : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-200">{user?.name || 'শিক্ষার্থী'}</p>
                          <p className="text-xs text-slate-400">ক্যামেরা বর্তমানে বন্ধ রয়েছে</p>
                        </div>
                      </div>
                    )}

                    {/* Real-Time Microphone Volume Wave Overlay */}
                    {micEnabled && !hasPermissionError && (
                      <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        <Mic className={`w-3.5 h-3.5 ${audioLevel > 15 ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <div className="flex items-center space-x-0.5 h-3">
                          <span
                            className={`w-1 rounded-full transition-all duration-75 ${
                              audioLevel > 10 ? 'bg-emerald-500 h-3' : 'bg-slate-600 h-1'
                            }`}
                          />
                          <span
                            className={`w-1 rounded-full transition-all duration-75 ${
                              audioLevel > 25 ? 'bg-emerald-500 h-3.5' : 'bg-slate-600 h-1'
                            }`}
                          />
                          <span
                            className={`w-1 rounded-full transition-all duration-75 ${
                              audioLevel > 45 ? 'bg-emerald-400 h-4' : 'bg-slate-600 h-1'
                            }`}
                          />
                          <span
                            className={`w-1 rounded-full transition-all duration-75 ${
                              audioLevel > 65 ? 'bg-amber-400 h-4' : 'bg-slate-600 h-1'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Pre-Join Toggle Action Bar over Video */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                      <button
                        onClick={toggleMic}
                        className={`p-3 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                          micEnabled
                            ? 'bg-slate-900/90 text-white hover:bg-slate-800 border border-white/10'
                            : 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-500/50'
                        }`}
                        title={micEnabled ? 'মাইক্রোফোন মিউট করুন' : 'মাইক্রোফোন চালু করুন'}
                      >
                        {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={toggleCamera}
                        className={`p-3 rounded-2xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                          cameraEnabled
                            ? 'bg-slate-900/90 text-white hover:bg-slate-800 border border-white/10'
                            : 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-500/50'
                        }`}
                        title={cameraEnabled ? 'ক্যামেরা বন্ধ করুন' : 'ক্যামেরা চালু করুন'}
                      >
                        {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Mic Level Slider / Gauge */}
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 font-semibold">মাইক্রোফোন টেস্ট:</span>
                    </div>
                    <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-75"
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {audioLevel > 5 ? 'কথা বলছেন ✓' : 'নিশ্চুপ'}
                    </span>
                  </div>
                </div>

                {/* Right Column: Class Details & Permission Guide or Join Button */}
                <div className="md:col-span-5 space-y-5">
                  {/* Permission Denied Warning Card */}
                  {hasPermissionError ? (
                    <div className="p-5 rounded-3xl bg-rose-950/40 border-2 border-rose-600/50 space-y-4 animate-in fade-in">
                      <div className="flex items-center space-x-2 text-rose-400">
                        <Lock className="w-5 h-5 flex-shrink-0" />
                        <h4 className="font-extrabold text-sm text-white">ক্যামেরা/মাইক অনুমতি প্রয়োজন</h4>
                      </div>
                      <p className="text-xs text-rose-200 leading-relaxed">{errorMessage}</p>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 text-[11px] text-slate-300 space-y-2">
                        <span className="font-bold text-rose-300 block">কীভাবে অনুমতি চালু করবেন:</span>
                        <p>১. ব্রাউজার অ্যাড্রেস বারের বাম পাশে থাকা 🔒 (Lock) আইকনে ক্লিক করুন।</p>
                        <p>২. Camera এবং Microphone অপশন "Allow" বা "অনুমোদন" নির্বাচন করুন।</p>
                        <p>৩. নিচের বাটনে ক্লিক করে পুনরায় চেষ্টা করুন।</p>
                      </div>

                      <button
                        onClick={initMediaPreview}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>পুনরায় চেষ্টা করুন (Retry Permission)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                          লাইভ সেশন প্রস্তুতি
                        </span>
                        <h3 className="text-lg font-black text-white">{liveClass?.title || 'লাইভ ক্লাস'}</h3>
                        <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                          <p>• শ্রেণি: <strong className="text-white">{liveClass?.class?.nameBn || 'সকল'}</strong></p>
                          <p>• বিষয়: <strong className="text-white">{liveClass?.subject?.nameBn || 'সাধারণ বিষয়'}</strong></p>
                          <p>• সময়কাল: <strong className="text-white">{liveClass?.durationMinutes || '৪৫'} মিনিট</strong></p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={handleJoinClass}
                          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                        >
                          <Video className="w-5 h-5" />
                          <span>এখনই ক্লাসে প্রবেশ করুন (Join Class)</span>
                        </button>

                        <p className="text-[10px] text-slate-400 text-center">
                          * ক্লাসে প্রবেশ করার পর যেকোনো সময় ক্যামেরা ও মাইক পরিবর্তন করা যাবে।
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STAGE 2: IN-CLASS ACTIVE WEBRTC LIVE CLASSROOM & FLOATING CONTROL BAR */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Classroom Header Bar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-black shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>লাইভ সম্প্রচার • {formatTimer(classTimer)}</span>
                </div>

                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-white truncate">{liveClass?.title || 'অনলাইন লাইভ ক্লাস'}</h3>
                  <span className="text-[11px] text-slate-400">
                    {liveClass?.subject?.nameBn} • শিক্ষক: {liveClass?.teacher?.user?.name || 'শিক্ষক'}
                  </span>
                </div>
              </div>

              {/* Top Right Utilities */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{participantCount} জন উপস্থিত</span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title="ফুলস্ক্রিন"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Stage & Chat Panel Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950 relative">
              {/* Left/Center Column: Main Video Stage */}
              <div
                className={`${
                  showChat ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'
                } flex flex-col justify-between relative overflow-hidden bg-black`}
              >
                {/* Main Video Stream Tile */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Screen Share or Teacher Stage */}
                  <video
                    ref={mainVideoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-contain ${
                      cameraEnabled || isScreenSharing ? 'block' : 'hidden'
                    }`}
                  />

                  {/* Fallback when Camera is Off & Not Screen Sharing */}
                  {!cameraEnabled && !isScreenSharing && (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-slate-800 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-2xl ring-4 ring-white/10">
                        {user?.name ? user.name.slice(0, 1) : 'U'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-white">{user?.name || 'শিক্ষার্থী'}</h4>
                        <p className="text-xs text-slate-400">ক্যামেরা বর্তমানে বন্ধ রয়েছে</p>
                      </div>
                    </div>
                  )}

                  {/* Active Screen Share Badge */}
                  {isScreenSharing && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-indigo-600/90 text-white text-xs font-bold flex items-center space-x-2 backdrop-blur-md shadow-lg border border-indigo-400/40">
                      <MonitorUp className="w-4 h-4" />
                      <span>আপনার স্ক্রিন শেয়ারিং চলমান</span>
                    </div>
                  )}

                  {/* Participant Name Badge */}
                  <div className="absolute bottom-20 left-4 px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center space-x-2">
                    <span>{user?.name || 'শিক্ষার্থী'}</span>
                    {!micEnabled && <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                  </div>

                  {/* Hand Raised Notification Toast */}
                  {handRaised && (
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-2xl animate-bounce">
                      <Hand className="w-4 h-4" />
                      <span>আপনি হাত তুলেছেন (প্রশ্ন করার জন্য অপেক্ষা করুন)</span>
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* RESPONSIVE FLOATING CONTROL BAR (আধুনিক লাইভ কন্ট্রোলস) */}
                {/* ========================================================================= */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 sm:space-x-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl">
                  {/* Mic Toggle */}
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center ${
                      micEnabled
                        ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10'
                        : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
                    }`}
                    title={micEnabled ? 'মাইক্রোফোন মিউট করুন' : 'মাইক্রোফোন চালু করুন'}
                  >
                    {micEnabled ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  {/* Camera Toggle */}
                  <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center ${
                      cameraEnabled
                        ? 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10'
                        : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
                    }`}
                    title={cameraEnabled ? 'ক্যামেরা বন্ধ করুন' : 'ক্যামেরা চালু করুন'}
                  >
                    {cameraEnabled ? <Video className="w-5 h-5 text-emerald-400" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  {/* Screen Share Toggle */}
                  <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center ${
                      isScreenSharing
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10'
                    }`}
                    title={isScreenSharing ? 'স্ক্রিন শেয়ার বন্ধ করুন' : 'স্ক্রিন শেয়ার করুন'}
                  >
                    <MonitorUp className="w-5 h-5" />
                  </button>

                  {/* Raise Hand Button */}
                  <button
                    onClick={() => setHandRaised(!handRaised)}
                    className={`p-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center ${
                      handRaised
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-white/10'
                    }`}
                    title={handRaised ? 'হাত নামান' : 'প্রশ্ন করার জন্য হাত তুলুন'}
                  >
                    <Hand className="w-5 h-5" />
                  </button>

                  {/* Chat Toggle Button */}
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`p-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center ${
                      showChat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-white/10'
                    }`}
                    title="লাইভ চ্যাট ও প্রশ্নোত্তর"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>

                  <div className="w-px h-6 bg-slate-700/60" />

                  {/* Leave / End Class Button */}
                  <button
                    onClick={handleLeaveClass}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/40 transition-all transform active:scale-95"
                    title="ক্লাস ত্যাগ করুন"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span className="hidden sm:inline">ক্লাস ছাড়ুন</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Real-Time Live Chat Panel */}
              {showChat && (
                <div className="lg:col-span-4 xl:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col h-full overflow-hidden">
                  <LiveClassChatPanel
                    liveClassId={liveClass?.id || 1}
                    liveClassTitle={liveClass?.title || 'লাইভ ক্লাস'}
                    role={role}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
