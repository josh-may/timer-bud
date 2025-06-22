import { useState, useEffect, useCallback, useRef } from "react";

export const useTangentTimers = () => {
  const [tangentTimers, setTangentTimers] = useState([]);
  const intervalRefs = useRef({});
  const tangentAlarmRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to load tangent alert sound, fall back to main alarm if not available
    tangentAlarmRef.current = new Audio(
      process.env.NEXT_PUBLIC_TANGENT_ALERT_URL ||
        process.env.NEXT_PUBLIC_ALARM_SOUND_URL ||
        "/tangent-alert.mp3"
    );
    tangentAlarmRef.current.addEventListener("error", (e) => {
      console.log("Tangent alert sound not found, using default alarm");
      tangentAlarmRef.current = new Audio(
        process.env.NEXT_PUBLIC_ALARM_SOUND_URL
      );
    });
  }, []);

  // Load timers from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTimers = localStorage.getItem("tangentTimers");
      if (savedTimers) {
        try {
          const parsedTimers = JSON.parse(savedTimers);
          const now = Date.now();

          // Restore timers and calculate remaining time
          const restoredTimers = parsedTimers
            .map((timer) => {
              const elapsed = Math.floor((now - timer.lastUpdate) / 1000);
              const remainingSeconds = timer.isPaused
                ? timer.remainingSeconds
                : Math.max(0, timer.remainingSeconds - elapsed);

              return {
                ...timer,
                remainingSeconds,
                isRunning:
                  remainingSeconds > 0 && timer.isRunning && !timer.isPaused,
                lastUpdate: now,
              };
            })
            .filter(
              (timer) => timer.remainingSeconds > 0 || timer.isRunning === false
            );

          setTangentTimers(restoredTimers);
        } catch (e) {
          console.error("Error loading tangent timers:", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save timers to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      const timersToSave = tangentTimers.map((timer) => ({
        ...timer,
        lastUpdate: Date.now(),
      }));
      localStorage.setItem("tangentTimers", JSON.stringify(timersToSave));
    }
  }, [tangentTimers, isLoaded]);

  const createTangentTimer = useCallback((durationMinutes, label = "") => {
    const id = Date.now().toString();
    const newTimer = {
      id,
      label: label || `${durationMinutes}m timer`,
      durationMinutes,
      remainingSeconds: durationMinutes * 60,
      isRunning: true,
      isPaused: false,
      createdAt: Date.now(),
    };

    setTangentTimers((prev) => [...prev, newTimer]);
    return id;
  }, []);

  const pauseTangentTimer = useCallback((id) => {
    setTangentTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, isPaused: !timer.isPaused } : timer
      )
    );
  }, []);

  const stopTangentTimer = useCallback((id) => {
    setTangentTimers((prev) => prev.filter((timer) => timer.id !== id));
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    }
  }, []);

  const dismissCompletedTimer = useCallback(
    (id) => {
      // Stop the tangent alarm sound when dismissing
      if (tangentAlarmRef.current) {
        tangentAlarmRef.current.pause();
        tangentAlarmRef.current.currentTime = 0;
      }
      stopTangentTimer(id);
    },
    [stopTangentTimer]
  );

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTangentTimers((prev) =>
        prev.map((timer) => {
          if (
            timer.isRunning &&
            !timer.isPaused &&
            timer.remainingSeconds > 0
          ) {
            const newRemaining = timer.remainingSeconds - 1;

            if (newRemaining === 0) {
              if (tangentAlarmRef.current) {
                tangentAlarmRef.current
                  .play()
                  .catch((e) => console.log("Tangent alarm play failed:", e));
              }
              return { ...timer, remainingSeconds: 0, isRunning: false };
            }

            return { ...timer, remainingSeconds: newRemaining };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeTangentTimers = tangentTimers.filter(
    (timer) =>
      timer.remainingSeconds > 0 ||
      (timer.remainingSeconds === 0 && timer.isRunning === false)
  );
  const hasActiveTangentTimers = activeTangentTimers.length > 0;

  return {
    tangentTimers: activeTangentTimers,
    hasActiveTangentTimers,
    createTangentTimer,
    pauseTangentTimer,
    stopTangentTimer,
    dismissCompletedTimer,
    formatTime,
  };
};
