import { useGetReflectionsQuery } from "../api/reflectionApi";
import { GlassCard } from "./ui/GlassCard";
import {
  ClipboardList,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  AudioLines,
} from "lucide-react";
import { useRef, useState } from "react";

export const ReflectionList = () => {
  const { data, isLoading } = useGetReflectionsQuery();

  // Custom Audio Player
  const AudioPlayer = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
      if (!audioRef.current) return;
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    };

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      setProgress(audioRef.current.currentTime);
    };
    const handleLoadedMetadata = () => {
      if (!audioRef.current) return;
      setDuration(audioRef.current.duration);
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = Number(e.target.value);
      setProgress(Number(e.target.value));
    };
    const formatTime = (t: number) => {
      const m = Math.floor(t / 60)
        .toString()
        .padStart(2, "0");
      const s = Math.floor(t % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    };
    return (
      <div className="w-full flex items-center gap-3 bg-background-500/80 rounded-xl px-3 py-2 shadow-inner border border-white/10">
        <button
          type="button"
          onClick={togglePlay}
          className="focus:outline-none"
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-500"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-500"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="flex-1 accent-primary-500 h-1 bg-white/20 rounded-lg"
        />
        <span className="text-xs text-text-secondary font-mono w-14 text-right">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          className="hidden"
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <GlassCard
        borderColor="primary"
        className="text-center py-12 flex flex-col items-center gap-2 max-w-xl mx-auto mt-10"
      >
        <ClipboardList className="w-8 h-8 text-primary-500 animate-pulse drop-shadow-glow" />
        <span className="text-primary-500 font-semibold">
          Loading reflections...
        </span>
      </GlassCard>
    );
  }
  if (!data || data.length === 0) {
    return (
      <GlassCard
        borderColor="accent"
        className="text-center py-12 flex flex-col items-center gap-2 max-w-xl mx-auto mt-10"
      >
        <ClipboardList className="w-8 h-8 text-accent-500 drop-shadow-glow" />
        <span className="text-gray-500">No reflections yet.</span>
      </GlassCard>
    );
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-7 h-7 text-primary-500 drop-shadow-glow" />
        <h2 className="text-xl font-bold text-primary-500 tracking-tight drop-shadow-glow">
          Previous Reflections
        </h2>
      </div>
      <div className="space-y-6">
        {data.map((reflection) => (
          <GlassCard
            key={reflection._id}
            borderColor="secondary"
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-semibold text-secondary-500">
                <FileText className="w-4 h-4" />
                {reflection.questTitle}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <CalendarClock className="w-4 h-4" />
                {new Date(reflection.createdAt).toLocaleString()}
              </div>
            </div>
            {reflection.text && (
              <div className="flex items-center gap-2 text-gray-800 dark:text-white">
                <FileText className="w-4 h-4 text-primary-400" />
                <span>{reflection.text}</span>
              </div>
            )}
            {reflection.imageUrl && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-accent-400 mt-auto" />
                <img
                  src={reflection.imageUrl}
                  alt="Reflection"
                  className="max-h-40 rounded shadow"
                />
              </div>
            )}
            {reflection.audioUrl && (
              <div className="flex items-center gap-2">
                <AudioLines className="w-4 h-4 text-secondary-400 " />
                <AudioPlayer src={reflection.audioUrl} />
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <ClipboardList className="w-4 h-4 text-primary-300" />
              Type: {reflection.questType}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
