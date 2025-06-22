const TangentTimerControls = ({
  onCreateTimer,
  isDarkMode,
  disabled = false,
}) => {
  const presetDurations = [5, 10, 15];

  const handlePresetClick = (minutes) => {
    onCreateTimer(minutes);
  };

  return (
    <div className="flex items-center gap-1">
      {presetDurations.map((minutes) => (
        <button
          key={minutes}
          onClick={() => handlePresetClick(minutes)}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
            isDarkMode
              ? "hover:bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-50"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          }`}
        >
          {minutes}m
        </button>
      ))}
    </div>
  );
};

export default TangentTimerControls;
