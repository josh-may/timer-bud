import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

export default function Home() {
  const [timeInSeconds, setTimeInSeconds] = useState(90 * 60); // 1h30m in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    brownNoiseRef.current = new Audio(process.env.NEXT_PUBLIC_BROWN_NOISE_URL);
    brownNoiseRef.current.loop = true;
    alarmRef.current = new Audio(process.env.NEXT_PUBLIC_ALARM_SOUND_URL);
  }, []);

  useEffect(() => {
    // Check if user has a theme preference
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
    brownNoiseRef.current.pause();
    alarmRef.current.play();
  }, []);

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
      brownNoiseRef.current.pause();
    } else {
      brownNoiseRef.current.play();
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
    e.preventDefault();
    const formData = new FormData(e.target);
    const timeString = formData.get("time") || "00:00";
    const [hours, minutes] = timeString
      .split(":")
      .map((num) => parseInt(num) || 0);
    setTimeInSeconds(hours * 3600 + minutes * 60);
    setIsEditing(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  return (
    <>
      <Head>
        <title>Brown Noise Timer</title>
        <meta
          name="description"
          content="Free online brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown. Perfect for studying, work, and meditation."
        />

        {/* Open Graph / Social Media */}
        <meta
          property="og:title"
          content="Brown Noise Timer - Focus, Sleep & Relaxation Tool"
        />
        <meta
          property="og:description"
          content="Free online brown noise timer for focus, sleep, and relaxation. Customizable duration, deeper than white noise, with automatic shutdown."
        />
        <meta property="og:url" content="https://brownnoisetimer.com" />
        <meta property="og:type" content="website" />

        {/* Additional SEO tags */}
        <link rel="canonical" href="https://brownnoisetimer.com" />
        <meta
          name="keywords"
          content="brown noise timer, brown noise, focus timer, sleep timer, relaxation timer, study timer, white noise alternative"
        />

        {/* Favicon - assuming you have one */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen flex flex-col ${
          isDarkMode ? "bg-zinc-950" : "bg-gray-100"
        }`}
      >
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-4 -mt-20 sm:-mt-20">
          <div
            className={`backdrop-blur rounded-2xl p-8 sm:p-10 w-full max-w-2xl shadow-xl mx-auto mb-4
            ${isDarkMode ? "bg-zinc-900/95" : "bg-white/95"}`}
          >
            <div className="flex items-center justify-center">
              <h1
                className={`text-3xl sm:text-4xl font-bold tracking-wider
                ${isDarkMode ? "text-zinc-100" : "text-gray-900"}`}
              >
                BROWN NOISE TIMER
              </h1>
            </div>
          </div>

          <div
            className={`backdrop-blur rounded-2xl p-6 sm:p-12 w-full max-w-2xl shadow-xl mx-auto
            ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}
          >
            <div
              className={`text-5xl sm:text-7xl font-mono tracking-wider text-center mb-6 sm:mb-8
              ${isDarkMode ? "text-zinc-100" : "text-gray-900"}`}
            >
              {isEditing ? (
                <form
                  onSubmit={handleTimeSubmit}
                  className="flex flex-col items-center gap-4"
                >
                  <input
                    type="text"
                    name="time"
                    placeholder="HH:MM"
                    pattern="[0-9]{1,2}:[0-9]{2}"
                    className={`w-36 sm:w-48 p-2 text-2xl sm:text-3xl rounded-lg text-center focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? "bg-zinc-800/50 text-zinc-100 focus:ring-zinc-700"
                          : "bg-gray-200 text-gray-900 focus:ring-gray-300"
                      }`}
                    defaultValue="01:30"
                  />
                  <button
                    type="submit"
                    className={`mt-2 sm:mt-4 px-4 sm:px-6 py-2 rounded-lg text-lg sm:text-xl transition-all
                      ${
                        isDarkMode
                          ? "bg-zinc-800/50 text-zinc-100 hover:bg-zinc-700/50"
                          : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                      }`}
                  >
                    Set Timer
                  </button>
                </form>
              ) : (
                <div
                  onClick={handleTimeClick}
                  className={`cursor-pointer transition-colors
                    ${
                      isDarkMode ? "hover:text-zinc-300" : "hover:text-gray-600"
                    }`}
                >
                  {formatTime(timeInSeconds)}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={toggleTimer}
                className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-lg sm:text-xl transition-all
                  ${
                    isDarkMode
                      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700/50"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
              >
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
          </div>
        </main>

        <div className="max-w-2xl mx-auto px-4 mt-12 sm:mt-[20vh] mb-8 sm:mb-16">
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
            <button
              onClick={toggleTheme}
              className={`ml-4 px-4 py-2 rounded-lg transition-all
                  ${
                    isDarkMode
                      ? " hover:bg-zinc-700 text-zinc-100"
                      : " hover:bg-gray-300 text-gray-900"
                  }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
