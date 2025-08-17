import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAllTimerDurations, formatDurationSlug } from "../lib/timerData";

export default function Home() {
  const [timeInSeconds, setTimeInSeconds] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [useNoise, setUseNoise] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
  };

  return (
    <>
      <Head>
        <title>
          {isRunning ? `${formatTime(timeInSeconds)}` : "Deep Timer"}
        </title>
        <meta
          name="description"
          content="Free online deep timer and brown noise timer for focus. Customizable duration, deeper than white noise, with automatic shutdown. Perfect for studying, work, and meditation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:title" content="Deep Timer - Time the Time Blocks" />
        <meta
          property="og:description"
          content="Free online deep timer and brown noise timer for focus. Customizable duration, deeper than white noise, with automatic shutdown."
        />
        <meta property="og:url" content="https://www.deep-timer.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.deep-timer.com/og.png" />

        <link rel="canonical" href="https://www.deep-timer.com/" />
        <meta
          name="keywords"
          content="deep timer and brown noise timer, brown noise, focus timer, sleep timer, relaxation timer, study timer, white noise alternative"
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>

      <div className={`${isDarkMode ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <main className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-4 pt-16 sm:pt-4">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header Container */}
            <div
              className={`p-4 mb-2.5 ${
                isDarkMode
                  ? "bg-zinc-900/80 border border-zinc-800"
                  : "bg-white border border-slate-200 shadow-md shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Deep Timer
                </div>

                {/* Hamburger Menu */}
                <div className="relative menu-container">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    aria-label="Menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                        isDarkMode
                          ? "bg-zinc-900 border border-zinc-800"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            toggleTheme();
                            setIsMenuOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                            isDarkMode
                              ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {isDarkMode ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
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
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                              />
                            </svg>
                          )}
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                        <a
                          href="https://www.jmmay.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                            isDarkMode
                              ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          About Creator
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Main Timer Container */}
            <div
              className={`p-4 sm:p-6 overflow-hidden ${
                isDarkMode
                  ? "bg-zinc-900/80 border border-zinc-800"
                  : "bg-white border border-slate-200 shadow-md shadow-slate-200/50"
              }`}
            >
              <div className="space-y-4 sm:space-y-7">
                {/* Timer Display Container - KEEP BORDER */}
                <div
                  className={`rounded-xl p-4 sm:p-8 md:p-10 ${
                    isDarkMode
                      ? "bg-zinc-900/50 border border-zinc-700"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="text-center">
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
                        className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold text-center bg-transparent w-full focus:outline-none ${
                          isDarkMode ? "text-white" : "text-slate-800"
                        }`}
                        style={{ minWidth: "0" }}
                      />
                    ) : (
                      <div
                        onClick={handleTimeClick}
                        className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tight break-all ${
                          !isRunning &&
                          "cursor-pointer hover:opacity-80 transition-opacity"
                        } ${isDarkMode ? "text-white" : "text-slate-800"}`}
                        style={{
                          wordBreak: "keep-all",
                          overflowWrap: "normal",
                        }}
                      >
                        {formatTime(timeInSeconds)}
                      </div>
                    )}
                    {!isRunning && !isEditing && (
                      <p
                        className={`text-xs mt-2 ${
                          isDarkMode ? "text-zinc-600" : "text-slate-500"
                        }`}
                      >
                        Click to edit
                      </p>
                    )}
                  </div>
                </div>

                {/* Noise Toggle Container - REMOVE BORDER */}
                <div
                  className={`rounded-xl  ${
                    isDarkMode ? "bg-zinc-900/50" : "bg-slate-50"
                  }`}
                >
                  <div className="flex justify-center">
                    <div
                      className={`inline-flex rounded-lg p-1 w-full ${
                        isDarkMode ? "bg-zinc-800" : "bg-slate-200"
                      }`}
                    >
                      <button
                        onClick={() => setUseNoise(true)}
                        disabled={isRunning}
                        className={`flex-1 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          useNoise
                            ? isDarkMode
                              ? "bg-zinc-700 text-white shadow-sm"
                              : "bg-white text-slate-800 shadow-sm"
                            : isDarkMode
                            ? "text-zinc-400"
                            : "text-slate-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Brown Noise
                      </button>
                      <button
                        onClick={() => setUseNoise(false)}
                        disabled={isRunning}
                        className={`flex-1 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          !useNoise
                            ? isDarkMode
                              ? "bg-zinc-700 text-white shadow-sm"
                              : "bg-white text-slate-800 shadow-sm"
                            : isDarkMode
                            ? "text-zinc-400"
                            : "text-slate-600"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Silent
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Buttons Container - REMOVE BORDER */}
                <div
                  className={`rounded-xl  ${
                    isDarkMode ? "bg-zinc-900/50" : "bg-slate-50"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handlePresetClick(minutes)}
                        disabled={isRunning}
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all ${
                          timeInSeconds === minutes * 60
                            ? isDarkMode
                              ? "bg-zinc-600 text-white"
                              : "bg-slate-400 text-white"
                            : isDarkMode
                            ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white disabled:bg-zinc-800/50"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-800 disabled:bg-slate-200/50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {minutes}M
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start/Pause Button Container - REMOVE BORDER */}
                <div
                  className={`rounded-xl  ${
                    isDarkMode ? "bg-zinc-900/50" : "bg-slate-50"
                  }`}
                >
                  <button
                    onClick={toggleTimer}
                    className={`w-full py-3 sm:py-4 font-semibold text-base sm:text-lg rounded-lg transition-colors ${
                      isRunning
                        ? isDarkMode
                          ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                        : isDarkMode
                        ? "bg-zinc-700 hover:bg-zinc-600 text-white shadow-lg"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    }`}
                  >
                    {isRunning ? "Pause" : "Start Timer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Additional Times Section - Moved up and given more prominence */}
        <section
          className={`py-16 ${isDarkMode ? "bg-zinc-950" : "bg-zinc-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className={`text-3xl font-bold mb-10 text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Other Timers
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {getAllTimerDurations().map((minutes) => {
                const slug = formatDurationSlug(minutes);

                return (
                  <Link
                    key={minutes}
                    href={`/${slug}`}
                    className={`px-3 py-2.5 rounded-lg text-center text-sm font-medium transition-all hover:scale-[1.05] shadow-sm ${
                      isDarkMode
                        ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
                    }`}
                  >
                    {`${minutes}m`}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className={`py-16 ${isDarkMode ? "bg-zinc-950" : "bg-zinc-100"}`}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2
              className={`text-2xl font-bold mb-8 text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Frequently Asked Questions
            </h2>

            <div
              className={`divide-y ${
                isDarkMode ? "divide-zinc-800" : "divide-gray-200"
              }`}
            >
              <div
                className={`pb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  What is Deep Timer?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Deep Timer is a focus timer designed for deep work sessions.
                  It combines customizable countdown timers with optional brown
                  noise to help you maintain concentration and track your
                  focused work time.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  How do I use Deep Timer for deep work?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Click on the time display to set your desired work duration
                  (we recommend 60-90 minutes for deep work), choose whether you
                  want brown noise or silence, then press Start. The timer will
                  count down and alert you when your session is complete.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Why include brown noise in a deep work timer?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Brown noise helps mask distracting environmental sounds and
                  creates a consistent audio backdrop that many find conducive
                  to deep focus. Its deeper frequencies are less fatiguing than
                  white noise during extended work sessions.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  What&apos;s the ideal duration for deep work sessions?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Most productivity experts recommend 60-90 minute blocks for
                  deep work, followed by a 10-15 minute break. Our preset
                  buttons offer 30, 60, and 90-minute options, but you can
                  customize any duration by clicking the timer display.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Can I use Deep Timer for Pomodoro technique?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Absolutely! Set the timer to 25 minutes for work sessions and
                  5 minutes for breaks. You can easily switch between different
                  durations by clicking the timer display or using the preset
                  buttons.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Why does the page title show the remaining time?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  The countdown appears in your browser tab so you can track
                  your remaining time even when working in other applications.
                  This helps you stay aware of your deep work session without
                  constantly switching back to the timer.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Will Deep Timer work if I switch tabs?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Yes! The timer continues running in the background when you
                  switch tabs or applications. The countdown will appear in the
                  browser tab title, and the alarm will sound when your session
                  ends.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Can I save my preferred timer settings?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Your theme preference (dark/light mode) is saved
                  automatically. For quick access to specific durations, use our
                  timer options above or bookmark your favorite timer duration
                  page.
                </p>
              </div>

              <div
                className={`py-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  Is Deep Timer free to use?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Yes, Deep Timer is completely free to use with no ads,
                  sign-ups, or premium features. It&apos;s a simple, effective
                  tool designed to help you focus on deep work without
                  distractions.
                </p>
              </div>

              <div
                className={`pt-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <h3 className="text-base font-medium mb-2">
                  What makes this different from other timers?
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  Deep Timer is specifically designed for deep work with
                  features like optional brown noise, a clean distraction-free
                  interface, no ads or sign-ups, and popular duration presets.
                  It&apos;s optimized for productivity rather than general time
                  tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`border-t ${
            isDarkMode
              ? "bg-zinc-950 border-zinc-800"
              : "bg-zinc-100 border-gray-200"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-center">
              <div
                className={`text-sm ${
                  isDarkMode ? "text-zinc-500" : "text-gray-500"
                }`}
              >
                Built with ❤️ by{" "}
                <a
                  href="https://www.jmmay.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline ${
                    isDarkMode ? "hover:text-zinc-300" : "hover:text-gray-700"
                  } transition-colors`}
                >
                  Josh May
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
