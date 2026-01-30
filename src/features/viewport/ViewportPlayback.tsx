type Props = {
  isPlaying: boolean;
  speed: number;
  playhead: number;
  onTogglePlay: () => void;
  onSpeedChange: (value: number) => void;
};

const ViewportPlayback = ({ isPlaying, speed, playhead, onTogglePlay, onSpeedChange }: Props) => (
  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
    <div className="flex items-center gap-2">
      <button className="rounded-lg border border-slate-700 px-3 py-1" onClick={onTogglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      {[0.5, 1, 2].map((value) => (
        <button
          key={value}
          className={`rounded-lg border border-slate-700 px-3 py-1 ${
            speed === value ? "bg-cyan-600 text-white" : "text-slate-300"
          }`}
          onClick={() => onSpeedChange(value)}
        >
          {value}x
        </button>
      ))}
    </div>
    <div>
      <span className="text-slate-400">Time</span> {Math.round(playhead)} ms
    </div>
  </div>
);

export default ViewportPlayback;
