import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

export default function Home() {
  const [timeInSeconds, setTimeInSeconds] = useState(90 * 60); // 1h30m in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const brownNoiseRef = useRef(null);
  const alarmRef = useRef(null);

  useEffect(() => {
    brownNoiseRef.current = new Audio(process.env.NEXT_PUBLIC_BROWN_NOISE_URL);
    brownNoiseRef.current.loop = true;
    alarmRef.current = new Audio(process.env.NEXT_PUBLIC_ALARM_SOUND_URL);
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

      <div className="min-h-screen flex flex-col bg-zinc-950">
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-zinc-100 text-2xl sm:text-4xl font-bold tracking-wide mb-6 sm:mb-10 text-center">
            BROWN NOISE TIMER
          </h1>
          <div className="bg-zinc-900/50 backdrop-blur rounded-2xl p-6 sm:p-12 w-full max-w-xl shadow-xl mx-auto">
            <div className="text-zinc-100 text-5xl sm:text-7xl font-mono tracking-wider text-center mb-6 sm:mb-8">
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
                    className="w-36 sm:w-48 bg-zinc-800/50 p-2 text-2xl sm:text-3xl rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-zinc-700"
                    defaultValue="01:30"
                  />
                  <button
                    type="submit"
                    className="mt-2 sm:mt-4 bg-zinc-800/50 px-4 sm:px-6 py-2 rounded-lg text-lg sm:text-xl hover:bg-zinc-700/50 transition-all"
                  >
                    Set Timer
                  </button>
                </form>
              ) : (
                <div
                  onClick={handleTimeClick}
                  className="hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {formatTime(timeInSeconds)}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={toggleTimer}
                className="bg-zinc-800/50 text-zinc-100 px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-lg sm:text-xl hover:bg-zinc-700/50 transition-all"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
          </div>
        </main>

        <div className="max-w-2xl mx-auto px-4 mt-12 sm:mt-[20vh] mb-8 sm:mb-16">
          <h2 className="text-white/80 text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 tracking-wide text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 sm:space-y-8">
            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                What is brown noise?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Brown noise is a type of sound signal that has a power spectral
                density inversely proportional to f². It&apos;s deeper than
                white noise and can help with focus and relaxation.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                How do I use this timer?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Click on the time display to set your desired duration, then
                press Start. The brown noise will play until the timer reaches
                zero.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Why does the sound sometimes stop?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Some browsers have strict autoplay policies that may interrupt
                audio playback. If the sound stops, try clicking the Start
                button again. For the best experience, make sure your browser
                allows audio autoplay for this site.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Is brown noise safe to listen to for long periods?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Brown noise is generally safe to listen to for extended periods
                at a reasonable volume. However, like any audio, it&apos;s
                recommended to follow the 60/60 rule: listen at no more than 60%
                volume for no longer than 60 minutes at a time.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Why brown noise instead of white or pink noise?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Brown noise has a deeper, richer quality compared to white or
                pink noise. Its lower frequency profile is often described as
                more soothing and less harsh, making it particularly effective
                for focus and relaxation. Many people find it reminiscent of
                natural sounds like ocean waves or steady rainfall.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Can I use this timer for sleep?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Yes, you can use this timer for sleep. Set your desired duration
                and the brown noise will automatically stop when the timer ends.
                However, keep in mind that your device needs to stay awake for
                the audio to continue playing.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Will the sound keep playing if I lock my device?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                This depends on your device and browser settings. On most mobile
                devices, locking the screen will pause the audio. For
                uninterrupted playback, keep your device unlocked or adjust your
                device settings to allow background audio playback.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Does this work offline?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                Once you&apos;ve loaded the page, the timer functionality will
                work offline. However, you&apos;ll need an internet connection
                to initially load the brown noise audio file.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                Will the alarm sound wake me up?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                The alarm is designed to be noticeable but not jarring. However,
                its effectiveness as a wake-up alarm depends on your sleep depth
                and volume settings. For important wake-up alarms, we recommend
                using a dedicated alarm clock or phone alarm.
              </p>
            </div>

            <div className="text-white/80">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                What&apos;s the difference between brown noise and other
                background sounds?
              </h3>
              <p className="text-sm sm:text-base text-white/60">
                While white noise contains all frequencies with equal power, and
                pink noise reduces high frequencies, brown noise reduces high
                frequencies even more dramatically. This creates a deeper,
                bassier sound that many find less fatiguing over long periods.
                Unlike nature sounds or music, it&apos;s consistent and
                non-distracting.
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
    </>
  );
}
