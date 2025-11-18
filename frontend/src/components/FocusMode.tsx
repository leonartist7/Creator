import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Target, Zap } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import '../styles/glassmorphism.css';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
  currentWordCount: number;
}

export const FocusMode = ({ isActive, onClose, currentWordCount }: FocusModeProps) => {
  const { wordGoal, ambientSound, setAmbientSound } = useSettingsStore();
  const [sprintDuration, setSprintDuration] = useState(25); // minutes
  const [timeRemaining, setTimeRemaining] = useState(sprintDuration * 60); // seconds
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [wordsAtStart, setWordsAtStart] = useState(currentWordCount);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isSprintActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      setIsSprintActive(false);
      // Play completion sound
      new Audio('/sounds/complete.mp3').play().catch(() => {});
    }
  }, [isSprintActive, timeRemaining]);

  useEffect(() => {
    // Ambient sound player
    if (ambientSound !== 'none' && isActive) {
      const newAudio = new Audio(`/sounds/${ambientSound}.mp3`);
      newAudio.loop = true;
      newAudio.volume = 0.3;
      newAudio.play().catch(() => {});
      setAudio(newAudio);

      return () => {
        newAudio.pause();
        newAudio.currentTime = 0;
      };
    }
  }, [ambientSound, isActive]);

  const startSprint = () => {
    setWordsAtStart(currentWordCount);
    setTimeRemaining(sprintDuration * 60);
    setIsSprintActive(true);
  };

  const pauseSprint = () => {
    setIsSprintActive(false);
  };

  const resetSprint = () => {
    setIsSprintActive(false);
    setTimeRemaining(sprintDuration * 60);
    setWordsAtStart(currentWordCount);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordsWritten = currentWordCount - wordsAtStart;
  const goalProgress = (currentWordCount / wordGoal) * 100;
  const timeProgress = ((sprintDuration * 60 - timeRemaining) / (sprintDuration * 60)) * 100;

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-50 flex items-center justify-center">
      {/* Stats Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        {/* Left: Word Count */}
        <div className="glass-strong px-6 py-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-white/60 mb-1">Words</p>
              <p className="text-3xl font-bold text-white">{currentWordCount.toLocaleString()}</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-sm text-white/60 mb-1">Goal</p>
              <p className="text-xl font-semibold text-white">{wordGoal.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Center: Sprint Timer */}
        <div className="glass-strong px-8 py-6 rounded-2xl text-center">
          <p className="text-sm text-white/60 mb-2">Sprint Timer</p>
          <p className="text-5xl font-bold text-white mb-4 font-mono">
            {formatTime(timeRemaining)}
          </p>
          <div className="flex items-center gap-2 justify-center">
            {!isSprintActive ? (
              <button
                onClick={startSprint}
                className="btn-gradient px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Play size={18} />
                Start
              </button>
            ) : (
              <button
                onClick={pauseSprint}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-all"
              >
                <Pause size={18} />
                Pause
              </button>
            )}
            <button
              onClick={resetSprint}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Sprint Duration Selector */}
          <div className="mt-4 flex gap-2">
            {[15, 25, 45].map((duration) => (
              <button
                key={duration}
                onClick={() => {
                  setSprintDuration(duration);
                  setTimeRemaining(duration * 60);
                }}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  sprintDuration === duration
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {duration}m
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>

        {/* Right: Sprint Progress */}
        <div className="glass-strong px-6 py-4 rounded-2xl">
          <p className="text-sm text-white/60 mb-2">This Sprint</p>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-yellow-400" size={20} />
            <p className="text-2xl font-bold text-white">
              +{wordsWritten} words
            </p>
          </div>
          <p className="text-sm text-white/60">
            {wordsWritten > 0
              ? `${Math.round(wordsWritten / Math.max((sprintDuration * 60 - timeRemaining) / 60, 1))} words/min`
              : 'Start writing...'}
          </p>
        </div>
      </div>

      {/* Bottom: Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
        {/* Ambient Sound Selector */}
        <div className="glass-strong px-4 py-3 rounded-xl flex items-center gap-3">
          <p className="text-sm text-white/60">Ambient Sound:</p>
          <div className="flex gap-2">
            {(['none', 'lofi', 'rain', 'cafe', 'nature'] as const).map((sound) => (
              <button
                key={sound}
                onClick={() => setAmbientSound(sound)}
                className={`px-3 py-1 rounded-lg text-sm transition-all capitalize ${
                  ambientSound === sound
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="glass-strong px-4 py-3 rounded-xl flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
          Exit Focus Mode
        </button>
      </div>

      {/* Motivational Message (appears when sprint completes) */}
      {timeRemaining === 0 && wordsWritten > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="glass-strong p-8 rounded-2xl text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Sprint Complete! 🎉
            </h3>
            <p className="text-white/80 mb-6">
              You wrote <span className="font-bold text-green-400">{wordsWritten} words</span> in {sprintDuration} minutes!
            </p>
            <button
              onClick={() => {
                setTimeRemaining(sprintDuration * 60);
                setWordsAtStart(currentWordCount);
              }}
              className="btn-gradient px-6 py-3 rounded-lg"
            >
              Start Another Sprint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
