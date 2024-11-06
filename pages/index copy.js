import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [time, setTime] = useState({ hours: 1, minutes: 30, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    time.hours * 3600 + time.minutes * 60 + time.seconds
  );

  const audioRef = useRef(null);
  const alarmRef = useRef(null);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio(process.env.NEXT_PUBLIC_BROWN_NOISE_URL);
      alarmRef.current = new Audio(process.env.NEXT_PUBLIC_ALARM_SOUND_URL);
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (alarmRef.current) {
        alarmRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    const audio = audioRef.current;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);

      if (audio && audio.paused) {
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {});
        }
      }
    } else if (isRunning && remainingSeconds === 0) {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      alarmRef.current?.play().catch(() => {});
      setIsRunning(false);
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    document.title = formatTime(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;

      const handleAudioEnd = () => {
        if (isRunning && remainingSeconds > 0) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      };

      audio.addEventListener("ended", handleAudioEnd);

      return () => {
        audio?.removeEventListener("ended", handleAudioEnd);
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
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 sm:pt-52 bg-black">
      <h1 className="text-white/80 text-3xl sm:text-5xl font-bold mb-6 sm:mb-10 tracking-widest uppercase px-4 text-center">
        Brown Noise Timer
      </h1>

      <div
        className="bg-zinc-900/50 p-6 sm:p-16 rounded-md backdrop-blur-lg ring-1 ring-white/10 mx-4"
        onClick={handleBackgroundClick}
      >
        {isEditing ? (
          <form
            onSubmit={handleTimeSubmit}
            className="text-white/90 text-3xl sm:text-5xl mb-6 sm:mb-10 space-x-2 sm:space-x-3"
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
              className="w-16 sm:w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
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
              className="w-16 sm:w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
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
              className="w-16 sm:w-24 bg-transparent border-b border-zinc-700 text-center focus:outline-none focus:border-white/30 transition-colors"
              min="0"
              max="59"
            />
          </form>
        ) : (
          <div
            onClick={handleTimeClick}
            className="text-white/90 text-6xl sm:text-8xl mb-6 sm:mb-10 font-light cursor-pointer hover:text-white transition-colors tracking-wider tabular-nums"
          >
            {formatTime(remainingSeconds)}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-white/5 hover:bg-white/10 text-white/90 px-8 sm:px-12 py-3 sm:py-4 rounded-md text-base sm:text-lg font-medium transition-all ring-1 ring-white/20 hover:ring-white/30 min-w-[140px] sm:min-w-[160px]"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-[50vh] mb-16">
        <h2 className="text-white/80 text-2xl sm:text-3xl font-bold mb-8 tracking-wide text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              What is brown noise?
            </h3>
            <p className="text-white/60">
              Brown noise is a type of sound signal that has a power spectral
              density inversely proportional to f². It&apos;s deeper than white
              noise and can help with focus and relaxation.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              How do I use this timer?
            </h3>
            <p className="text-white/60">
              Click on the time display to set your desired duration, then press
              Start. The brown noise will play until the timer reaches zero.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Why does the sound sometimes stop?
            </h3>
            <p className="text-white/60">
              Some browsers have strict autoplay policies that may interrupt
              audio playback. If the sound stops, try clicking the Start button
              again. For the best experience, make sure your browser allows
              audio autoplay for this site.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Is brown noise safe to listen to for long periods?
            </h3>
            <p className="text-white/60">
              Brown noise is generally safe to listen to for extended periods at
              a reasonable volume. However, like any audio, it&apos;s
              recommended to follow the 60/60 rule: listen at no more than 60%
              volume for no longer than 60 minutes at a time.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Why brown noise instead of white or pink noise?
            </h3>
            <p className="text-white/60">
              Brown noise has a deeper, richer quality compared to white or pink
              noise. Its lower frequency profile is often described as more
              soothing and less harsh, making it particularly effective for
              focus and relaxation. Many people find it reminiscent of natural
              sounds like ocean waves or steady rainfall.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Can I use this timer for sleep?
            </h3>
            <p className="text-white/60">
              Yes, you can use this timer for sleep. Set your desired duration
              and the brown noise will automatically stop when the timer ends.
              However, keep in mind that your device needs to stay awake for the
              audio to continue playing.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Will the sound keep playing if I lock my device?
            </h3>
            <p className="text-white/60">
              This depends on your device and browser settings. On most mobile
              devices, locking the screen will pause the audio. For
              uninterrupted playback, keep your device unlocked or adjust your
              device settings to allow background audio playback.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Does this work offline?
            </h3>
            <p className="text-white/60">
              Once you&apos;ve loaded the page, the timer functionality will
              work offline. However, you&apos;ll need an internet connection to
              initially load the brown noise audio file.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Will the alarm sound wake me up?
            </h3>
            <p className="text-white/60">
              The alarm is designed to be noticeable but not jarring. However,
              its effectiveness as a wake-up alarm depends on your sleep depth
              and volume settings. For important wake-up alarms, we recommend
              using a dedicated alarm clock or phone alarm.
            </p>
          </div>

          <div className="text-white/80">
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              What&apos;s the difference between brown noise and other
              background sounds?
            </h3>
            <p className="text-white/60">
              While white noise contains all frequencies with equal power, and
              pink noise reduces high frequencies, brown noise reduces high
              frequencies even more dramatically. This creates a deeper, bassier
              sound that many find less fatiguing over long periods. Unlike
              nature sounds or music, it&apos;s consistent and non-distracting.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 text-white/40">
          Built by{" "}
          <a
            href="https://joshmmay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors underline"
          >
            Josh May
          </a>
        </div>
      </div>
    </div>
  );
}
