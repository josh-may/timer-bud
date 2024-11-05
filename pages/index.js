import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [time, setTime] = useState({ hours: 1, minutes: 30, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    time.hours * 3600 + time.minutes * 60 + time.seconds
  );

  const audio = useRef(
    typeof Audio !== "undefined"
      ? new Audio(
          "https://brown-noise-timer.s3.us-east-2.amazonaws.com/audio-files/my-audio2.mp3"
        )
      : null
  );
  const alarmSound = useRef(
    typeof Audio !== "undefined"
      ? new Audio(
          "https://brown-noise-timer.s3.us-east-2.amazonaws.com/audio-files/my-audio.mp3"
        )
      : null
  );

  useEffect(() => {
    if (audio.current) {
      audio.current.loop = true;
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);

      if (audio.current && audio.current.paused) {
        audio.current
          .play()
          .catch((error) => console.log("Audio playback error:", error));
      }
    } else if (isRunning && remainingSeconds === 0) {
      alarmSound.current
        ?.play()
        .catch((error) => console.log("Alarm playback error:", error));
      audio.current?.pause();
      if (audio.current) {
        audio.current.currentTime = 0;
      }
      setIsRunning(false);
    } else {
      audio.current?.pause();
      if (audio.current) {
        audio.current.currentTime = 0;
      }
    }

    return () => {
      clearInterval(interval);
      if (!isRunning) {
        audio.current?.pause();
        if (audio.current) {
          audio.current.currentTime = 0;
        }
      }
    };
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    document.title = `${formatTime(remainingSeconds)}`;
  }, [remainingSeconds]);

  useEffect(() => {
    if (audio.current) {
      audio.current.loop = true;

      const handleAudioEnd = () => {
        if (isRunning && remainingSeconds > 0) {
          audio.current.currentTime = 0;
          audio.current
            .play()
            .catch((error) => console.log("Audio restart error:", error));
        }
      };

      audio.current.addEventListener("ended", handleAudioEnd);

      return () => {
        audio.current?.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, [isRunning, remainingSeconds]);

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
    setRemainingSeconds(time.hours * 3600 + time.minutes * 60 + time.seconds);
  };

  const handleBackgroundClick = (e) => {
    if (isEditing && !e.target.closest("form")) {
      handleTimeSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-52 bg-black">
      <h1 className="text-white/80 text-5xl font-bold mb-10 tracking-widest uppercase">
        Brown Noise Timer
      </h1>

      <div
        className="bg-zinc-900/50 p-16 rounded-md backdrop-blur-lg ring-1 ring-white/10"
        onClick={handleBackgroundClick}
      >
        {isEditing ? (
          <form
            onSubmit={handleTimeSubmit}
            className="text-white/90 text-5xl mb-10 space-x-3"
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
              className="w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
              min="0"
            />
            <span>:</span>
            <input
              type="number"
              value={time.minutes}
              onChange={(e) =>
                setTime((prev) => ({
                  ...prev,
                  minutes: parseInt(e.target.value) || 0,
                }))
              }
              className="w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
              min="0"
              max="59"
            />
            <span>:</span>
            <input
              type="number"
              value={time.seconds}
              onChange={(e) =>
                setTime((prev) => ({
                  ...prev,
                  seconds: parseInt(e.target.value) || 0,
                }))
              }
              className="w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
              min="0"
              max="59"
            />
          </form>
        ) : (
          <div
            onClick={handleTimeClick}
            className="text-white/90 text-8xl mb-10 font-light cursor-pointer hover:text-white transition-colors tracking-wider tabular-nums"
          >
            {formatTime(remainingSeconds)}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-white/5 hover:bg-white/10 text-white/90 px-12 py-4 rounded-md text-lg font-medium transition-all ring-1 ring-white/20 hover:ring-white/30 min-w-[160px]"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
