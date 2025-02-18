import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

export default function Home() {
  const [timeInSeconds, setTimeInSeconds] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [useNoise, setUseNoise] = useState(true);

  useEffect(() => {
    brownNoiseRef.current = new Audio(process.env.NEXT_PUBLIC_BROWN_NOISE_URL);
    brownNoiseRef.current.loop = true;
    alarmRef.current = new Audio(process.env.NEXT_PUBLIC_ALARM_SOUND_URL);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialDarkMode =
      savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle("dark", initialDarkMode);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (useNoise) {
      brownNoiseRef.current.pause();
    }
    alarmRef.current.play();
  }, [useNoise]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeInSeconds((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, handleTimerComplete]);

  const toggleTimer = () => {
    if (isRunning) {
      if (useNoise) {
        brownNoiseRef.current.pause();
      }
    } else {
      if (useNoise) {
        brownNoiseRef.current.play();
      }
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleTimeSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      e.preventDefault();
      const timeString = e.target.value || "00:00:00";
      const [hours, minutes, seconds] = timeString
        .split(":")
        .map((num) => parseInt(num) || 0);
      setTimeInSeconds(hours * 3600 + minutes * 60 + (seconds || 0));
      setIsEditing(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const handlePresetClick = (minutes) => {
    setTimeInSeconds(minutes * 60);
    if (useNoise) {
      brownNoiseRef.current.play();
    }
    setIsRunning(true);
  };

  return (
    <>
      <Head>
        <title>
          {isRunning ? `${formatTime(timeInSeconds)}` : "Timer Bud"}
        </title>
        <meta
          name="description"
          content="Free online deep timer and brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown. Perfect for studying, work, and meditation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          property="og:title"
          content="Timer Bud - Focus, Sleep & Relaxation Tool"
        />
        <meta
          property="og:description"
          content="Free online deep timer and brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown."
        />
        <meta property="og:url" content="https://timerbud.com" />
        <meta property="og:type" content="website" />

        <link rel="canonical" href="https://timerbud.com" />
        <meta
          name="keywords"
          content="deep timer and brown noise timer, brown noise, focus timer, sleep timer, relaxation timer, study timer, white noise alternative"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-zinc-950" : "bg-white"
        }`}
      >
        <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen md:-mt-5 -mt-20">
          <div
            className={`w-full max-w-3xl mx-auto rounded-xl shadow-lg border ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="p-10 sm:p-14 space-y-8 text-center">
              <div className="space-y-8 max-w-2xl mx-auto">
                {/* TIME DISPLAY */}
                <div
                  className={`rounded-xl border ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <div className="h-[120px] sm:h-[180px] flex items-center justify-center px-8">
                    {isEditing ? (
                      <input
                        type="text"
                        autoFocus
                        pattern="[0-9]{1,2}:[0-9]{2}:[0-9]{2}"
                        defaultValue={formatTime(timeInSeconds)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleTimeSubmit(e)
                        }
                        onBlur={handleTimeSubmit}
                        className={`text-5xl sm:text-[6.5rem] font-mono text-center bg-transparent w-full focus:outline-none
                          ${isDarkMode ? "text-white" : "text-gray-800"}`}
                      />
                    ) : (
                      <div
                        onClick={handleTimeClick}
                        className={`text-5xl sm:text-[6.5rem] font-mono text-center ${
                          !isRunning && "cursor-pointer"
                        } ${isDarkMode ? "text-white" : "text-gray-800"}`}
                      >
                        {formatTime(timeInSeconds)}
                      </div>
                    )}
                  </div>
                </div>

                {/* BROWN NOISE / NO NOISE */}
                <div
                  className={`rounded-xl border overflow-hidden ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <div className="flex w-full">
                    <button
                      onClick={() => setUseNoise(true)}
                      disabled={isRunning}
                      className={`flex-1 px-6 py-5 text-base font-medium ${
                        useNoise
                          ? isDarkMode
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-300 text-gray-800"
                          : isDarkMode
                          ? "text-zinc-400 disabled:opacity-50"
                          : "text-gray-600 disabled:opacity-50"
                      }`}
                    >
                      BROWN NOISE
                    </button>
                    <button
                      onClick={() => setUseNoise(false)}
                      disabled={isRunning}
                      className={`flex-1 px-6 py-5 text-base font-medium ${
                        !useNoise
                          ? isDarkMode
                            ? "bg-zinc-700 text-white"
                            : "bg-gray-300 text-gray-800"
                          : isDarkMode
                          ? "text-zinc-400 disabled:opacity-50"
                          : "text-gray-600 disabled:opacity-50"
                      }`}
                    >
                      NO NOISE
                    </button>
                  </div>
                </div>

                {/* TIME PRESETS */}
                <div
                  className={`rounded-xl border ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <div className="grid grid-cols-3 w-full">
                    {[30, 60, 90].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handlePresetClick(minutes)}
                        disabled={isRunning}
                        className={`py-5 text-base font-medium ${
                          isDarkMode
                            ? "text-zinc-400 disabled:opacity-50"
                            : "text-gray-600 disabled:opacity-50"
                        }`}
                      >
                        {minutes}M
                      </button>
                    ))}
                  </div>
                </div>

                {/* START/PAUSE */}
                <div
                  className={`rounded-xl border overflow-hidden ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <button
                    onClick={toggleTimer}
                    className={`w-full py-5 font-medium text-lg ${
                      isDarkMode
                        ? "bg-zinc-700 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {isRunning ? "PAUSE" : "START"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-24">
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 tracking-wide text-center
            ${isDarkMode ? "text-white/80" : "text-gray-900"}`}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                What is brown noise?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Brown noise is a type of sound signal that has a power spectral
                density inversely proportional to f². It&apos;s deeper than
                white noise and can help with focus and relaxation.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                How do I use this timer?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Click on the time display to set your desired duration, then
                press Start. The brown noise will play until the timer reaches
                zero.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Why does the sound sometimes stop?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Some browsers have strict autoplay policies that may interrupt
                audio playback. If the sound stops, try clicking the Start
                button again. For the best experience, make sure your browser
                allows audio autoplay for this site.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Is brown noise safe to listen to for long periods?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Brown noise is generally safe to listen to for extended periods
                at a reasonable volume. However, like any audio, it&apos;s
                recommended to follow the 60/60 rule: listen at no more than 60%
                volume for no longer than 60 minutes at a time.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Why brown noise instead of white or pink noise?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Brown noise has a deeper, richer quality compared to white or
                pink noise. Its lower frequency profile is often described as
                more soothing and less harsh, making it particularly effective
                for focus and relaxation. Many people find it reminiscent of
                natural sounds like ocean waves or steady rainfall.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Can I use this timer for sleep?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Yes, you can use this timer for sleep. Set your desired duration
                and the brown noise will automatically stop when the timer ends.
                However, keep in mind that your device needs to stay awake for
                the audio to continue playing.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Will the sound keep playing if I lock my device?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                This depends on your device and browser settings. On most mobile
                devices, locking the screen will pause the audio. For
                uninterrupted playback, keep your device unlocked or adjust your
                device settings to allow background audio playback.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Does this work offline?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                Once you&apos;ve loaded the page, the timer functionality will
                work offline. However, you&apos;ll need an internet connection
                to initially load the brown noise audio file.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Will the alarm sound wake me up?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                The alarm is designed to be noticeable but not jarring. However,
                its effectiveness as a wake-up alarm depends on your sleep depth
                and volume settings. For important wake-up alarms, we recommend
                using a dedicated alarm clock or phone alarm.
              </p>
            </div>

            <div
              className={`${isDarkMode ? "text-white/80" : "text-gray-900"}`}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                What&apos;s the difference between brown noise and other
                background sounds?
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  isDarkMode ? "text-white/60" : "text-gray-600"
                }`}
              >
                While white noise contains all frequencies with equal power, and
                pink noise reduces high frequencies, brown noise reduces high
                frequencies even more dramatically. This creates a deeper,
                bassier sound that many find less fatiguing over long periods.
                Unlike nature sounds or music, it&apos;s consistent and
                non-distracting.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-white/40 hover:text-white/60 hover:bg-zinc-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>
            <div
              className={`${isDarkMode ? "text-white/40" : "text-gray-500"}`}
            >
              Built by{" "}
              <a
                href="https://joshmmay.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  isDarkMode ? "hover:text-white/60" : "hover:text-gray-700"
                }`}
              >
                Josh May
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
