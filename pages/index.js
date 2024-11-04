import { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState({ hours: 1, minutes: 30 });
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    time.hours * 3600 + time.minutes * 60
  );

  useEffect(() => {
    let interval;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    document.title = `${formatTime(remainingSeconds)}`;
  }, [remainingSeconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleTimeSubmit = (e) => {
    if (e) e.preventDefault();
    setIsEditing(false);
    setRemainingSeconds(time.hours * 3600 + time.minutes * 60);
  };

  const handleBackgroundClick = (e) => {
    if (isEditing && !e.target.closest("form")) {
      handleTimeSubmit();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-950"
      onClick={handleBackgroundClick}
    >
      <div className="bg-gray-800/90 p-12 rounded-lg shadow-2xl backdrop-blur-sm">
        {isEditing ? (
          <form
            onSubmit={handleTimeSubmit}
            className="text-gray-100 text-4xl mb-8"
          >
            <input
              type="number"
              value={time.hours}
              onChange={(e) =>
                setTime((prev) => ({
                  ...prev,
                  hours: parseInt(e.target.value) || 0,
                }))
              }
              className="w-24 bg-transparent border-b-2 border-gray-400 text-center focus:outline-none focus:border-blue-300 transition-colors"
              min="0"
            />
            <span className="mx-2">:</span>
            <input
              type="number"
              value={time.minutes}
              onChange={(e) =>
                setTime((prev) => ({
                  ...prev,
                  minutes: parseInt(e.target.value) || 0,
                }))
              }
              className="w-24 bg-transparent border-b-2 border-gray-400 text-center focus:outline-none focus:border-blue-300 transition-colors"
              min="0"
              max="59"
            />
          </form>
        ) : (
          <div
            onClick={handleTimeClick}
            className="text-gray-100 text-8xl mb-8 font-light cursor-pointer hover:text-blue-300 transition-colors drop-shadow-lg"
          >
            {formatTime(remainingSeconds)}
          </div>
        )}

        <div className="flex gap-4 justify-center w-full">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-600 text-gray-100 px-12 py-3 rounded-md text-lg font-bold hover:bg-blue-500 transition-colors shadow-lg flex-1 max-w-[200px]"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
