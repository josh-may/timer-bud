import { useState, useEffect } from "react";

const TangentTimerDisplay = ({
  timers,
  onPause,
  onStop,
  onDismiss,
  formatTime,
  isDarkMode,
  onFeatureTimer,
  featuredTimerId,
}) => {
  const [dismissedTimers, setDismissedTimers] = useState(new Set());

  // Filter out featured timer from the list
  const displayTimers = timers.filter((t) => t.id !== featuredTimerId);

  if (displayTimers.length === 0) return null;

  const activeTimers = displayTimers.filter((t) => t.remainingSeconds > 0);
  const completedTimers = displayTimers.filter(
    (t) => t.remainingSeconds === 0 && !dismissedTimers.has(t.id)
  );

  const handleDismiss = (id) => {
    setDismissedTimers((prev) => new Set([...prev, id]));
    onDismiss(id);
  };

  if (activeTimers.length === 0 && completedTimers.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {/* Header */}
      {(activeTimers.length > 0 || completedTimers.length > 0) && (
        <h3
          className={`text-sm font-medium ${
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          }`}
        >
          Other Timers
        </h3>
      )}

      {/* Completed Timers */}
      {completedTimers.map((timer) => (
        <div
          key={timer.id}
          className={`rounded-lg p-4 animate-pulse ${
            isDarkMode
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {timer.label} - Complete
              </span>
            </div>
            <button
              onClick={() => handleDismiss(timer.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                isDarkMode
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  : "bg-red-100 hover:bg-red-200 text-red-600"
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}

      {/* Active Timers */}
      {activeTimers.map((timer) => (
        <div
          key={timer.id}
          className={`rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.02] ${
            isDarkMode
              ? "bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
              : "bg-gray-50 border border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onFeatureTimer(timer.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  timer.isPaused
                    ? "bg-yellow-500"
                    : "bg-green-500 animate-pulse"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-zinc-300" : "text-gray-700"
                }`}
              >
                {timer.label}
              </span>
            </div>
            <span
              className={`font-mono text-lg font-semibold ${
                timer.remainingSeconds <= 60
                  ? isDarkMode
                    ? "text-orange-400"
                    : "text-orange-600"
                  : isDarkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {formatTime(timer.remainingSeconds)}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className={`h-1 rounded-full overflow-hidden mb-3 ${
              isDarkMode ? "bg-zinc-800" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timer.remainingSeconds <= 60 ? "bg-orange-500" : "bg-green-500"
              }`}
              style={{
                width: `${
                  ((timer.durationMinutes * 60 - timer.remainingSeconds) /
                    (timer.durationMinutes * 60)) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onPause(timer.id)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isDarkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              {timer.isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => onStop(timer.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isDarkMode
                  ? "hover:bg-zinc-800 text-zinc-500 hover:text-red-400"
                  : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => onFeatureTimer(timer.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isDarkMode
                  ? "hover:bg-zinc-800 text-zinc-500 hover:text-blue-400"
                  : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
              }`}
            >
              Feature
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TangentTimerDisplay;
