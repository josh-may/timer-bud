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
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

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
        <title>{isRunning ? `${formatTime(timeInSeconds)}` : "Timer FM"}</title>
        <meta
          name="description"
          content="Free online brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown. Perfect for studying, work, and meditation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          property="og:title"
          content="Timer FM - Focus, Sleep & Relaxation Tool"
        />
        <meta
          property="og:description"
          content="Free online brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown."
        />
        <meta property="og:url" content="https://timerfm.com" />
        <meta property="og:type" content="website" />

        <link rel="canonical" href="https://timerfm.com" />
        <meta
          name="keywords"
          content="brown noise timer, brown noise, focus timer, sleep timer, relaxation timer, study timer, white noise alternative"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-zinc-950" : "bg-gray-100"
        }`}
      >
        <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen">
          <div
            className={`w-full max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm border-4
            ${
              isDarkMode
                ? "bg-zinc-900/95 border-zinc-700"
                : "bg-zinc-100/95 border-gray-300"
            }`}
          >
            <header
              className={`p-6 sm:p-8 border-b-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 relative ${
                isDarkMode ? "border-zinc-700" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <h1
                  className={`text-xl sm:text-2xl font-bold tracking-wider ${
                    isDarkMode ? "text-zinc-50" : "text-gray-900"
                  }`}
                >
                  TIMER FM
                </h1>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors duration-200 hover:scale-105 ${
                    isDarkMode
                      ? "text-zinc-300 hover:text-zinc-50 hover:bg-zinc-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <nav className="hidden sm:hidden lg:flex items-center gap-6">
                <button
                  onClick={() => setShowAboutModal(true)}
                  className={`text-base sm:text-lg font-medium ${
                    isDarkMode
                      ? "text-zinc-300 hover:text-zinc-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className={`text-base sm:text-lg font-medium ${
                    isDarkMode
                      ? "text-zinc-300 hover:text-zinc-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Contact
                </button>
              </nav>
            </header>

            <div className="p-8 sm:p-12 space-y-8 sm:space-y-10">
              <div className="space-y-6 sm:space-y-8 max-w-xl mx-auto">
                {/* CLOCK DISPLAY */}
                <div
                  className={`rounded-xl border-4 shadow-inner ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <div className="h-[100px] sm:h-[160px] flex items-center justify-center px-6 sm:px-8">
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
                        className={`text-4xl sm:text-[5.5rem] font-mono text-center bg-transparent w-full focus:outline-none tracking-wider
                          ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                      />
                    ) : (
                      <div
                        onClick={handleTimeClick}
                        className={`text-4xl sm:text-[5.5rem] font-mono text-center cursor-pointer transition-colors tracking-wider
                          ${
                            isDarkMode
                              ? "text-emerald-400 hover:text-emerald-300"
                              : "text-emerald-600 hover:text-emerald-500"
                          }`}
                      >
                        {formatTime(timeInSeconds)}
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTROLS */}
                <div
                  className={`rounded-xl border-4 ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800/50"
                      : "border-gray-300 bg-gray-200/50"
                  }`}
                >
                  <div className="flex w-full">
                    <button
                      onClick={() => setUseNoise(true)}
                      disabled={isRunning}
                      className={`flex-1 px-5 py-4 text-sm font-bold tracking-wider rounded-l-lg transition-colors ${
                        useNoise
                          ? isDarkMode
                            ? "bg-zinc-700 text-emerald-400"
                            : "bg-gray-300 text-emerald-600"
                          : isDarkMode
                          ? "text-zinc-400 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-zinc-400"
                          : "text-gray-500 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                      }`}
                    >
                      BROWN NOISE
                    </button>
                    <button
                      onClick={() => setUseNoise(false)}
                      disabled={isRunning}
                      className={`flex-1 px-5 py-4 text-sm font-bold tracking-wider rounded-r-lg transition-colors ${
                        !useNoise
                          ? isDarkMode
                            ? "bg-zinc-700 text-emerald-400"
                            : "bg-gray-300 text-emerald-600"
                          : isDarkMode
                          ? "text-zinc-400 hover:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-zinc-400"
                          : "text-gray-500 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                      }`}
                    >
                      NO NOISE
                    </button>
                  </div>
                </div>

                {/* PRESETS */}
                <div
                  className={`rounded-xl border-4 ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800/50"
                      : "border-gray-300 bg-gray-200/50"
                  }`}
                >
                  <div className="grid grid-cols-3 w-full">
                    {[30, 60, 90].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handlePresetClick(minutes)}
                        disabled={isRunning}
                        className={`py-4 text-sm sm:text-base font-bold tracking-wider transition-colors ${
                          isDarkMode
                            ? "text-zinc-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-zinc-400"
                            : "text-gray-500 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                        }`}
                      >
                        {minutes}M
                      </button>
                    ))}
                  </div>
                </div>

                {/* START/PAUSE */}
                <div
                  className={`rounded-xl border-4 ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800/50"
                      : "border-gray-300 bg-gray-200/50"
                  }`}
                >
                  <button
                    onClick={toggleTimer}
                    className={`w-full py-5 font-bold text-base sm:text-lg rounded-lg transition-colors tracking-wider ${
                      isDarkMode
                        ? "bg-zinc-700 text-emerald-400 hover:bg-zinc-600"
                        : "bg-gray-300 text-emerald-600 hover:bg-gray-400"
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

          <div
            className={`text-center mt-12 ${
              isDarkMode ? "text-white/40" : "text-gray-500"
            }`}
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

      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-md w-full rounded-2xl p-6 ${
              isDarkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-medium mb-4 ${
                isDarkMode ? "text-zinc-50" : "text-gray-900"
              }`}
            >
              About Timer FM
            </h2>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-zinc-300" : "text-gray-600"
              }`}
            >
              I built this because I was using Google&apos;s timer and
              Spotify&apos;s brown noise separately and watched something that
              combined the two...
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className={`w-full py-2 rounded-lg ${
                isDarkMode
                  ? "bg-zinc-800 text-zinc-50 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-md w-full rounded-2xl p-6 ${
              isDarkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-medium mb-4 ${
                isDarkMode ? "text-zinc-50" : "text-gray-900"
              }`}
            >
              Contact
            </h2>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-zinc-300" : "text-gray-600"
              }`}
            >
              <a
                href="mailto:hey@joshmmay.com"
                className="underline hover:opacity-80"
              >
                hey@joshmmay.com
              </a>
            </p>
            <button
              onClick={() => setShowContactModal(false)}
              className={`w-full py-2 rounded-lg ${
                isDarkMode
                  ? "bg-zinc-800 text-zinc-50 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
