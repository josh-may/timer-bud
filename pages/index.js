import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  getAllTimerDurations,
  formatDurationSlug,
  formatDurationText,
} from "../lib/timerData";
import TangentTimerControls from "../components/TangentTimerControls";
import TangentTimerDisplay from "../components/TangentTimerDisplay";
import { useTangentTimers } from "../hooks/useTangentTimers";

export default function Home() {
  const [timeInSeconds, setTimeInSeconds] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [useNoise, setUseNoise] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    tangentTimers,
    createTangentTimer,
    pauseTangentTimer,
    stopTangentTimer,
    dismissCompletedTimer,
    formatTime: formatTangentTime,
  } = useTangentTimers();

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
    if (useNoise) {
      brownNoiseRef.current.play();
    }
    setIsRunning(true);
    3;
  };

  const handleCreateTangentTimer = (minutes) => {
    if (tangentTimers.length === 0) {
      createTangentTimer(minutes);
    }
  };

  return (
    <>
      <Head>
        <title>
          {tangentTimers.length > 0 && tangentTimers[0]?.remainingSeconds > 0
            ? `${formatTangentTime(tangentTimers[0].remainingSeconds)}`
            : isRunning
            ? `${formatTime(timeInSeconds)}`
            : "Deep Timer"}
        </title>
        <meta
          name="description"
          content="Free online deep timer and brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown. Perfect for studying, work, and meditation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          property="og:title"
          content="Deep Timer - Focus, Sleep & Relaxation Tool"
        />
        <meta
          property="og:description"
          content="Free online deep timer and brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown."
        />
        <meta property="og:url" content="https://www.deep-timer.com/" />
        <meta property="og:type" content="website" />

        <link rel="canonical" href="https://www.deep-timer.com/" />
        <meta
          name="keywords"
          content="deep timer and brown noise timer, brown noise, focus timer, sleep timer, relaxation timer, study timer, white noise alternative"
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>

      <div className={`${isDarkMode ? "bg-zinc-950" : "bg-white"}`}>
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
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
                          href="https://joshmmay.com"
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
              className={`p-6 ${
                isDarkMode
                  ? "bg-zinc-900/80 border border-zinc-800"
                  : "bg-white border border-slate-200 shadow-md shadow-slate-200/50"
              }`}
            >
              <div className="space-y-6">
                {/* Timer Display Container - KEEP BORDER */}
                <div
                  className={`rounded-xl p-8 sm:p-10 ${
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
                        className={`text-6xl sm:text-7xl md:text-8xl font-mono font-bold text-center bg-transparent w-full focus:outline-none ${
                          isDarkMode ? "text-white" : "text-slate-800"
                        }`}
                      />
                    ) : (
                      <div
                        onClick={handleTimeClick}
                        className={`text-6xl sm:text-7xl md:text-8xl font-mono font-bold tracking-tight ${
                          !isRunning &&
                          "cursor-pointer hover:opacity-80 transition-opacity"
                        } ${isDarkMode ? "text-white" : "text-slate-800"}`}
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
                  className={`rounded-xl ${
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
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
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
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
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
                  className={`rounded-xl ${
                    isDarkMode ? "bg-zinc-900/50" : "bg-slate-50"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map((minutes) => (
                      <button
                        key={minutes}
                        onClick={() => handlePresetClick(minutes)}
                        disabled={isRunning}
                        className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                          isDarkMode
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
                  className={`rounded-xl ${
                    isDarkMode ? "bg-zinc-900/50" : "bg-slate-50"
                  }`}
                >
                  <button
                    onClick={toggleTimer}
                    className={`w-full py-4 font-semibold text-lg rounded-lg transition-colors ${
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

            {/* Side Quest Creation Controls - Only shows when main timer is running */}
            {isRunning && (
              <div className="mt-2.5">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm ${
                    isDarkMode
                      ? "bg-zinc-900/50 border border-zinc-800"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-zinc-500" : "text-gray-500"
                    }`}
                  >
                    Side Quest:
                  </span>
                  <TangentTimerControls
                    onCreateTimer={handleCreateTangentTimer}
                    isDarkMode={isDarkMode}
                    disabled={tangentTimers.length > 0}
                  />
                </div>
              </div>
            )}

            {/* Featured Side Quest Timer */}
            {tangentTimers.length > 0 &&
              (() => {
                const featuredTimer = tangentTimers[0];
                if (!featuredTimer) {
                  return null;
                }
                return (
                  <div className="mt-2.5">
                    <div
                      className={`p-4 ${
                        isDarkMode
                          ? "bg-zinc-900/50 border border-zinc-800"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              featuredTimer.remainingSeconds === 0
                                ? "bg-red-500 animate-pulse"
                                : featuredTimer.isPaused
                                ? "bg-yellow-500"
                                : "bg-green-500 animate-pulse"
                            }`}
                          />
                          <h3
                            className={`text-xs font-medium ${
                              isDarkMode ? "text-zinc-500" : "text-gray-500"
                            }`}
                          >
                            {featuredTimer.label}
                          </h3>
                        </div>
                        <button
                          onClick={() => stopTangentTimer(featuredTimer.id)}
                          className={`p-0.5 rounded transition-colors ${
                            isDarkMode
                              ? "hover:bg-zinc-800 text-zinc-600"
                              : "hover:bg-gray-200 text-gray-400"
                          }`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="text-center">
                        <div
                          className={`text-2xl sm:text-3xl font-mono font-bold ${
                            featuredTimer.remainingSeconds === 0
                              ? "text-red-500"
                              : featuredTimer.remainingSeconds <= 60
                              ? isDarkMode
                                ? "text-orange-400"
                                : "text-orange-600"
                              : isDarkMode
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {formatTangentTime(featuredTimer.remainingSeconds)}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 mb-4">
                          <div
                            className={`h-1 rounded-full overflow-hidden ${
                              isDarkMode ? "bg-zinc-800" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className={`h-full transition-all duration-1000 ease-linear ${
                                featuredTimer.remainingSeconds === 0
                                  ? "bg-red-500"
                                  : featuredTimer.remainingSeconds <= 60
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${
                                  ((featuredTimer.durationMinutes * 60 -
                                    featuredTimer.remainingSeconds) /
                                    (featuredTimer.durationMinutes * 60)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => pauseTangentTimer(featuredTimer.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              isDarkMode
                                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            }`}
                          >
                            {featuredTimer.isPaused ? "Resume" : "Pause"}
                          </button>
                          {featuredTimer.remainingSeconds === 0 ? (
                            <button
                              onClick={() => {
                                dismissCompletedTimer(featuredTimer.id);
                              }}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                              Dismiss
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                stopTangentTimer(featuredTimer.id);
                              }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                isDarkMode
                                  ? "text-zinc-500 hover:text-red-400"
                                  : "text-gray-500 hover:text-red-600"
                              }`}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </main>

        {/* Popular Timer Pages Section */}
        <section className="max-w-2xl mx-auto px-4 py-16">
          <h2
            className={`text-2xl font-bold text-center mb-8 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Popular Timers
          </h2>

          <div className="space-y-8">
            {/* Quick Access Timers */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {getAllTimerDurations()
                .slice(0, 24)
                .map((minutes) => {
                  const slug = formatDurationSlug(minutes);
                  const text = formatDurationText(minutes);

                  return (
                    <Link
                      key={minutes}
                      href={`/${slug}`}
                      className={`px-3 py-2.5 rounded-lg text-center text-sm font-medium transition-all hover:scale-[1.02] ${
                        isDarkMode
                          ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {minutes < 60 ? `${minutes}m` : text}
                    </Link>
                  );
                })}
            </div>

            {/* Hour Timers */}
            <div>
              <h3
                className={`text-sm font-semibold mb-3 ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Extended Timers
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {getAllTimerDurations()
                  .filter((minutes) => minutes >= 60)
                  .slice(0, 12)
                  .map((minutes) => {
                    const slug = formatDurationSlug(minutes);
                    const text = formatDurationText(minutes);

                    return (
                      <Link
                        key={minutes}
                        href={`/${slug}`}
                        className={`px-3 py-2.5 rounded-lg text-center text-sm font-medium transition-all hover:scale-[1.02] ${
                          isDarkMode
                            ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        }`}
                      >
                        {text}
                      </Link>
                    );
                  })}
              </div>
            </div>

            <div className="text-center pt-4">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-zinc-600" : "text-gray-500"
                }`}
              >
                Choose from {getAllTimerDurations().length} different timer
                durations
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <h2
            className={`text-2xl font-bold mb-8 text-center
            ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                What is brown noise?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Brown noise is a type of sound signal that has a power spectral
                density inversely proportional to f². It&apos;s deeper than
                white noise and can help with focus and relaxation.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                How do I use this timer?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Click on the time display to set your desired duration, then
                press Start. The brown noise will play until the timer reaches
                zero.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Why does the sound sometimes stop?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Some browsers have strict autoplay policies that may interrupt
                audio playback. If the sound stops, try clicking the Start
                button again. For the best experience, make sure your browser
                allows audio autoplay for this site.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Is brown noise safe to listen to for long periods?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Brown noise is generally safe to listen to for extended periods
                at a reasonable volume. However, like any audio, it&apos;s
                recommended to follow the 60/60 rule: listen at no more than 60%
                volume for no longer than 60 minutes at a time.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Why brown noise instead of white or pink noise?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Brown noise has a deeper, richer quality compared to white or
                pink noise. Its lower frequency profile is often described as
                more soothing and less harsh, making it particularly effective
                for focus and relaxation. Many people find it reminiscent of
                natural sounds like ocean waves or steady rainfall.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Can I use this timer for sleep?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Yes, you can use this timer for sleep. Set your desired duration
                and the brown noise will automatically stop when the timer ends.
                However, keep in mind that your device needs to stay awake for
                the audio to continue playing.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Will the sound keep playing if I lock my device?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                This depends on your device and browser settings. On most mobile
                devices, locking the screen will pause the audio. For
                uninterrupted playback, keep your device unlocked or adjust your
                device settings to allow background audio playback.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Does this work offline?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Once you&apos;ve loaded the page, the timer functionality will
                work offline. However, you&apos;ll need an internet connection
                to initially load the brown noise audio file.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                Will the alarm sound wake me up?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                The alarm is designed to be noticeable but not jarring. However,
                its effectiveness as a wake-up alarm depends on your sleep depth
                and volume settings. For important wake-up alarms, we recommend
                using a dedicated alarm clock or phone alarm.
              </p>
            </div>

            <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              <h3 className="text-base font-medium mb-2">
                What&apos;s the difference between brown noise and other
                background sounds?
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-zinc-400" : "text-gray-600"
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

          <div className="flex items-center justify-center mt-12">
            <div
              className={`text-xs ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Built by{" "}
              <a
                href="https://joshmmay.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  isDarkMode ? "hover:text-zinc-300" : "hover:text-gray-600"
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
