// CommonJS version for build scripts
const getAllTimerDurations = () => {
  const durations = [];

  // Generate 1-120 minutes
  for (let i = 1; i <= 120; i++) {
    durations.push(i);
  }

  return durations;
};

const formatDurationSlug = (minutes) => {
  if (minutes < 60) {
    return `${minutes}-minute`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? "1-hour" : `${hours}-hour`;
    } else {
      return hours === 1
        ? `1-hour-${remainingMinutes}-minute`
        : `${hours}-hour-${remainingMinutes}-minute`;
    }
  }
};

module.exports = {
  getAllTimerDurations,
  formatDurationSlug,
};
