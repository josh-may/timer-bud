import { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  // Initialize audio on client side only
  useEffect(() => {
    setAudio(new Audio("/brown-noise.mp3")); // You'll need to add this audio file to your public folder
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Audio control
  const toggleSound = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.loop = true;
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Brown Noise Timer</h1>

      {/* Timer Component */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-6">
        <div className="text-6xl font-mono mb-4">{formatTime(time)}</div>
        <div className="space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => setTime(25 * 60)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Brown Noise Control Component */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={toggleSound}
          className={`px-6 py-2 rounded ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {isPlaying ? "Stop Brown Noise" : "Play Brown Noise"}
        </button>
      </div>
    </div>
  );
}
