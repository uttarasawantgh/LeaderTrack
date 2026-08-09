interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  current,
  total,
  size = 80,
  strokeWidth = 6,
}: ProgressRingProps) {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Trail ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#2a2a3e"
          strokeWidth={strokeWidth}
        />
        {/* Active ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-accent-gold"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
        {/* Percentage label */}
        <text
          x={center}
          y={center}
          className="fill-text-primary tabular-nums"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90, ${center}, ${center})`}
          style={{ fontSize: size * 0.18, fontWeight: 600 }}
        >
          {percentage}%
        </text>
      </svg>
      <span className="text-xs text-text-secondary tabular-nums">
        {current} / {total} pages
      </span>
    </div>
  );
}