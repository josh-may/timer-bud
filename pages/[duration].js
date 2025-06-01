import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  getAllTimerDurations,
  formatDurationSlug,
  getTimerData,
  formatDurationText,
} from "../lib/timerData";

export default function DynamicTimer({ timerData }) {
  const [timeInSeconds, setTimeInSeconds] = useState(timerData.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [useNoise, setUseNoise] = useState(true);
  const [rounds, setRounds] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

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
    setRounds(rounds + 1);
  }, [useNoise, rounds]);

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

  const resetTimer = () => {
    setIsRunning(false);
    setTimeInSeconds(timerData.minutes * 60);
    if (useNoise) {
      brownNoiseRef.current.pause();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  // Schema.org structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${timerData.durationText} Timer`,
    description: timerData.description,
    url: timerData.url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Head>
        <title>{timerData.title}</title>
        <meta name="description" content={timerData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          property="og:title"
          content={`${timerData.durationText} Timer - Free Online Timer with Alarm`}
        />
        <meta property="og:description" content={timerData.description} />
        <meta property="og:url" content={timerData.url} />
        <meta property="og:type" content="website" />

        <link rel="canonical" href={timerData.url} />
        <meta name="keywords" content={timerData.keywords} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-zinc-950" : "bg-white"
        }`}
      >
        <main className="flex-1 flex flex-col items-center justify-center p-4 pt-32 min-h-screen">
          {/* Navigation back to main timer */}
          <div className="absolute top-4 left-4">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-white/60 hover:text-white hover:bg-zinc-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
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
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <span>More Timers</span>
            </Link>
          </div>

          <div
            className={`w-full max-w-2xl mx-auto rounded-xl shadow-lg border ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-700"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="p-10 sm:p-14 space-y-8 text-center">
              <div>
                <h1
                  className={`text-3xl sm:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {timerData.durationText} Timer
                </h1>
                <p
                  className={`mt-2 text-sm ${
                    isDarkMode ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Simple, free online {timerData.durationText.toLowerCase()}{" "}
                  timer with alarm
                </p>
              </div>

              <div className="space-y-8 max-w-xl mx-auto">
                {/* TIME DISPLAY */}
                <div
                  className={`rounded-xl border ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <div className="h-[120px] sm:h-[160px] flex items-center justify-center px-8">
                    <div
                      className={`text-6xl sm:text-[5rem] font-mono text-center ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {formatTime(timeInSeconds)}
                    </div>
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
                      className={`flex-1 px-6 py-4 text-base font-medium ${
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
                      className={`flex-1 px-6 py-4 text-base font-medium ${
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

                {/* CONTROLS */}
                <div className="space-y-4">
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
                      {isRunning
                        ? "PAUSE"
                        : `START ${timerData.durationText.toUpperCase()} TIMER`}
                    </button>
                  </div>

                  {/* RESET */}
                  {(timeInSeconds < timerData.minutes * 60 || isRunning) && (
                    <div
                      className={`rounded-xl border overflow-hidden ${
                        isDarkMode
                          ? "border-zinc-700 bg-zinc-800"
                          : "border-gray-300 bg-gray-200"
                      }`}
                    >
                      <button
                        onClick={resetTimer}
                        className={`w-full py-4 font-medium text-base ${
                          isDarkMode
                            ? "text-zinc-400 hover:bg-zinc-700"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        RESET TO {timerData.durationText.toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>

                {/* Rounds counter */}
                {rounds > 0 && (
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    Completed rounds: {rounds}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Popular Uses Section */}
          <div className="mt-12 max-w-3xl mx-auto px-4">
            <h2
              className={`text-xl font-semibold text-center mb-6 ${
                isDarkMode ? "text-white/80" : "text-gray-800"
              }`}
            >
              Popular Uses for a {timerData.durationText} Timer
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {timerData.useCases.map((use, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-center ${
                    isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                  }`}
                >
                  <div className="text-2xl mb-2">{use.icon}</div>
                  <h3
                    className={`font-medium text-sm ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {use.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      isDarkMode ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    {use.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Instructions */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className={`inline-flex items-center space-x-2 text-sm ${
                  isDarkMode
                    ? "text-white/60 hover:text-white/80"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span>
                  How to use this {timerData.durationText.toLowerCase()} timer
                </span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showInstructions ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showInstructions && (
                <div
                  className={`mt-4 text-left max-w-md mx-auto p-4 rounded-lg ${
                    isDarkMode ? "bg-zinc-800" : "bg-gray-100"
                  }`}
                >
                  <ol
                    className={`text-sm space-y-2 ${
                      isDarkMode ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    <li>1. Choose between brown noise or no noise</li>
                    <li>
                      2. Click &quot;START{" "}
                      {timerData.durationText.toUpperCase()} TIMER&quot; to
                      begin countdown
                    </li>
                    <li>
                      3. Timer will count down from{" "}
                      {formatTime(timerData.minutes * 60)} to 0:00
                    </li>
                    <li>4. An alarm will sound when timer reaches zero</li>
                    <li>
                      5. Click &quot;RESET TO{" "}
                      {timerData.durationText.toUpperCase()}&quot; to use again
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Other Timer Links Section */}
            <div className="mt-16">
              <h3
                className={`text-xl font-semibold text-center mb-8 ${
                  isDarkMode ? "text-white/80" : "text-gray-800"
                }`}
              >
                Set the timer for the specified time
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Popular Minute Timers */}
                <div>
                  <h4
                    className={`text-sm font-medium mb-4 text-center ${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    }`}
                  >
                    Popular Timers
                  </h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90].map(
                      (minutes) => (
                        <Link
                          key={minutes}
                          href={`/${formatDurationSlug(minutes)}`}
                          className={`block text-sm hover:underline ${
                            minutes === timerData.minutes
                              ? isDarkMode
                                ? "text-blue-400 font-medium"
                                : "text-blue-600 font-medium"
                              : isDarkMode
                              ? "text-blue-300"
                              : "text-blue-500"
                          }`}
                        >
                          {formatDurationText(minutes)} Timer
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Nearby Timers */}
                <div>
                  <h4
                    className={`text-sm font-medium mb-4 text-center ${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    }`}
                  >
                    Similar Timers
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const current = timerData.minutes;
                      const nearby = [];

                      // Generate nearby timers (±5 minutes range)
                      for (
                        let i = Math.max(1, current - 5);
                        i <= Math.min(120, current + 5);
                        i++
                      ) {
                        if (i !== current) {
                          nearby.push(i);
                        }
                      }

                      return nearby.slice(0, 10).map((minutes) => (
                        <Link
                          key={minutes}
                          href={`/${formatDurationSlug(minutes)}`}
                          className={`block text-sm hover:underline ${
                            isDarkMode ? "text-blue-300" : "text-blue-500"
                          }`}
                        >
                          {formatDurationText(minutes)} Timer
                        </Link>
                      ));
                    })()}
                  </div>
                </div>

                {/* Hour Timers */}
                <div>
                  <h4
                    className={`text-sm font-medium mb-4 text-center ${
                      isDarkMode ? "text-white/70" : "text-gray-700"
                    }`}
                  >
                    Hour Timers
                  </h4>
                  <div className="space-y-2">
                    {getAllTimerDurations()
                      .filter((m) => m >= 60 && m % 30 === 0)
                      .slice(0, 10)
                      .map((minutes) => (
                        <Link
                          key={minutes}
                          href={`/${formatDurationSlug(minutes)}`}
                          className={`block text-sm hover:underline ${
                            minutes === timerData.minutes
                              ? isDarkMode
                                ? "text-blue-400 font-medium"
                                : "text-blue-600 font-medium"
                              : isDarkMode
                              ? "text-blue-300"
                              : "text-blue-500"
                          }`}
                        >
                          {formatDurationText(minutes)} Timer
                        </Link>
                      ))}
                  </div>
                </div>
              </div>

              {/* View All Timers Link */}
              <div className="text-center mt-8">
                <Link
                  href="/"
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "bg-zinc-800 text-white/80 hover:bg-zinc-700 hover:text-white border border-zinc-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-300"
                  }`}
                >
                  <span>View All {getAllTimerDurations().length} Timers</span>
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
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* SEO Content Section */}
        <section className="max-w-3xl mx-auto px-4 py-12">
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white/80" : "text-gray-900"
            }`}
          >
            About This {timerData.durationText} Timer
          </h2>

          <div
            className={`space-y-4 text-sm ${
              isDarkMode ? "text-white/60" : "text-gray-600"
            }`}
          >
            <p>
              This free online {timerData.durationText.toLowerCase()} timer is
              perfect for all your timing needs. Whether you&apos;re using it
              for work sessions, cooking, exercise routines, or any other timed
              activity, our {timerData.durationText.toLowerCase()} countdown
              timer has you covered.
            </p>

            <p>
              The {timerData.durationText.toLowerCase()} timer features an
              optional brown noise background that helps with focus and
              concentration. Brown noise is deeper than white noise and many
              find it more soothing for concentration tasks. You can easily
              toggle between brown noise and silent mode.
            </p>

            <p>
              When your {timerData.durationText.toLowerCase()} timer completes,
              you&apos;ll hear a gentle alarm sound to notify you. The timer
              works entirely in your browser - no downloads or installations
              required. Just visit this page whenever you need a reliable{" "}
              {timerData.durationText.toLowerCase()} timer.
            </p>

            <h3
              className={`text-lg font-semibold mt-6 mb-3 ${
                isDarkMode ? "text-white/80" : "text-gray-800"
              }`}
            >
              Why Use a {timerData.durationText} Timer?
            </h3>

            <p>
              {timerData.minutes < 10
                ? `${timerData.durationText} timers are perfect for quick tasks and short breaks. They help you stay focused without feeling overwhelmed by longer time commitments.`
                : timerData.minutes <= 30
                ? `A ${timerData.durationText.toLowerCase()} duration is ideal for focused work sessions, exercise routines, and daily tasks. It's long enough to make meaningful progress but short enough to maintain concentration.`
                : timerData.minutes <= 60
                ? `${timerData.durationText} sessions are excellent for deep work, complete workouts, and substantial tasks. This duration allows for immersive focus while preventing burnout.`
                : `${timerData.durationText} timers are perfect for extended work sessions, long activities, and projects that require sustained attention. Remember to take breaks when working for extended periods.`}
            </p>
          </div>
        </section>

        {/* Theme Toggle */}
        <div className="flex items-center justify-center p-8">
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
        </div>
      </div>
    </>
  );
}

// Generate all static paths at build time
export async function getStaticPaths() {
  const durations = getAllTimerDurations();

  const paths = durations.map((minutes) => ({
    params: { duration: formatDurationSlug(minutes) },
  }));

  return {
    paths,
    fallback: false, // Show 404 for non-existent timer pages
  };
}

// Generate static props for each timer page
export async function getStaticProps({ params }) {
  const { duration } = params;

  // Find the minutes value from the slug
  const durations = getAllTimerDurations();
  const minutes = durations.find((m) => formatDurationSlug(m) === duration);

  if (!minutes) {
    return {
      notFound: true,
    };
  }

  const timerData = getTimerData(minutes);

  return {
    props: {
      timerData,
    },
  };
}
