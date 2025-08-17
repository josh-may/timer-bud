// Timer data configuration for all durations
export const getAllTimerDurations = () => {
  const durations = [];

  // Generate 5-120 minutes in 5 minute increments
  for (let i = 5; i <= 120; i += 5) {
    durations.push(i);
  }

  return durations;
};

export const formatDurationSlug = (minutes) => {
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

export const formatDurationText = (minutes) => {
  if (minutes < 60) {
    return `${minutes} Minute`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? "1 Hour" : `${hours} Hour`;
    } else {
      return hours === 1
        ? `1 Hour ${remainingMinutes} Minute`
        : `${hours} Hours ${remainingMinutes} Minute`;
    }
  }
};

// Get popular use cases based on duration
export const getUseCases = (minutes) => {
  const useCases = {
    1: [
      { icon: "🥚", title: "Microwave", desc: "Quick heating" },
      { icon: "💊", title: "Medicine Timer", desc: "Pill reminders" },
      { icon: "🫖", title: "Tea Bag", desc: "Quick steep" },
      { icon: "🧘", title: "Deep Breath", desc: "Mindful moment" },
      { icon: "🏃", title: "Sprint Rest", desc: "HIIT recovery" },
      { icon: "📱", title: "Screen Break", desc: "Eye rest" },
      { icon: "🎯", title: "Focus Check", desc: "Task review" },
      { icon: "⏰", title: "Quick Task", desc: "Time box" },
    ],
    2: [
      { icon: "🪥", title: "Teeth Brushing", desc: "Dentist recommended" },
      { icon: "🥚", title: "Soft Eggs", desc: "Perfect runny yolk" },
      { icon: "🧖", title: "Face Mask", desc: "Skincare routine" },
      { icon: "💪", title: "Plank Hold", desc: "Core challenge" },
      { icon: "🫖", title: "Green Tea", desc: "Optimal steep" },
      { icon: "🧘", title: "Meditation", desc: "Quick reset" },
      { icon: "📖", title: "Speed Read", desc: "Article scan" },
      { icon: "🎮", title: "Game Round", desc: "Match timer" },
    ],
    3: [
      { icon: "🥚", title: "Soft Boiled Eggs", desc: "Perfect timing" },
      { icon: "🦷", title: "Brushing Teeth", desc: "Dentist recommended" },
      { icon: "🧘", title: "Meditation", desc: "Quick mindfulness" },
      { icon: "💪", title: "Plank Exercise", desc: "Core workout" },
      { icon: "☕", title: "Tea Steeping", desc: "Green & white tea" },
      { icon: "🎯", title: "Focus Sprint", desc: "Quick tasks" },
      { icon: "🫁", title: "Breathing", desc: "Box breathing" },
      { icon: "🍜", title: "Instant Noodles", desc: "Ramen timer" },
    ],
    5: [
      { icon: "🥚", title: "Hard Boiled Eggs", desc: "Perfectly cooked" },
      { icon: "☕", title: "French Press", desc: "Coffee brewing" },
      { icon: "🧘", title: "Meditation", desc: "Mindfulness" },
      { icon: "💪", title: "Ab Workout", desc: "Core routine" },
      { icon: "🍝", title: "Pasta", desc: "Al dente" },
      { icon: "🎯", title: "Pomodoro Break", desc: "Rest period" },
      { icon: "📚", title: "Study Break", desc: "Mental rest" },
      { icon: "🧊", title: "Ice Bath", desc: "Cold therapy" },
    ],
    10: [
      { icon: "🍝", title: "Pasta Cooking", desc: "Al dente perfection" },
      { icon: "💪", title: "HIIT Workout", desc: "Intense session" },
      { icon: "🧘", title: "Meditation", desc: "Deep practice" },
      { icon: "📚", title: "Study Session", desc: "Focused learning" },
      { icon: "🍕", title: "Pizza Oven", desc: "Perfect crust" },
      { icon: "🎯", title: "Power Nap", desc: "Quick rest" },
      { icon: "🏃", title: "Running", desc: "Cardio burst" },
      { icon: "🎮", title: "Game Match", desc: "Timed round" },
    ],
    15: [
      { icon: "🍕", title: "Pizza Baking", desc: "Oven timer" },
      { icon: "💆", title: "Face Mask", desc: "Spa treatment" },
      { icon: "💪", title: "Workout", desc: "Exercise set" },
      { icon: "📚", title: "Study Session", desc: "Focus block" },
      { icon: "🧘", title: "Meditation", desc: "Mindfulness" },
      { icon: "☕", title: "Coffee Break", desc: "Office pause" },
      { icon: "🎮", title: "Gaming", desc: "Match timer" },
      { icon: "🧺", title: "Laundry", desc: "Quick wash" },
    ],
    20: [
      { icon: "🍗", title: "Chicken Baking", desc: "Oven timer" },
      { icon: "💪", title: "Full Workout", desc: "Exercise routine" },
      { icon: "📚", title: "Study Block", desc: "Deep focus" },
      { icon: "💆", title: "Power Nap", desc: "NASA nap" },
      { icon: "🧘", title: "Yoga Session", desc: "Quick flow" },
      { icon: "🎯", title: "Pomodoro", desc: "Work sprint" },
      { icon: "🚿", title: "Long Shower", desc: "Relaxation" },
      { icon: "🎮", title: "Game Session", desc: "Play time" },
    ],
    25: [
      { icon: "🎯", title: "Pomodoro", desc: "Classic technique" },
      { icon: "🍖", title: "Roasting", desc: "Meat cooking" },
      { icon: "💪", title: "Full Workout", desc: "Training session" },
      { icon: "📺", title: "TV Episode", desc: "Short show" },
      { icon: "🧘", title: "Yoga Flow", desc: "Full practice" },
      { icon: "📚", title: "Deep Study", desc: "Learning block" },
      { icon: "🎮", title: "Game Match", desc: "Competitive round" },
      { icon: "🧺", title: "Laundry Cycle", desc: "Wash timer" },
    ],
    30: [
      { icon: "🏃", title: "Running", desc: "Cardio session" },
      { icon: "🍖", title: "Roast Dinner", desc: "Cooking time" },
      { icon: "📺", title: "TV Show", desc: "Episode length" },
      { icon: "💪", title: "Gym Workout", desc: "Full routine" },
      { icon: "📚", title: "Study Session", desc: "Deep focus" },
      { icon: "🧘", title: "Yoga Class", desc: "Full practice" },
      { icon: "🎮", title: "Gaming", desc: "Play session" },
      { icon: "☕", title: "Lunch Break", desc: "Quick meal" },
    ],
    45: [
      { icon: "🏋️", title: "Gym Session", desc: "Full workout" },
      { icon: "📺", title: "TV Drama", desc: "Episode timer" },
      { icon: "🧘", title: "Yoga Class", desc: "Full session" },
      { icon: "📚", title: "Study Block", desc: "Academic focus" },
      { icon: "🍳", title: "Meal Prep", desc: "Cooking session" },
      { icon: "🚴", title: "Cycling", desc: "Exercise ride" },
      { icon: "🎯", title: "Deep Work", desc: "Focus time" },
      { icon: "🎓", title: "Online Class", desc: "Lecture timer" },
    ],
    60: [
      { icon: "🏋️", title: "Full Workout", desc: "Complete session" },
      { icon: "📚", title: "Study Hour", desc: "Learning block" },
      { icon: "🍳", title: "Meal Prep", desc: "Cooking time" },
      { icon: "🧘", title: "Yoga Class", desc: "Full practice" },
      { icon: "🚴", title: "Bike Ride", desc: "Cardio hour" },
      { icon: "🎓", title: "Lecture", desc: "Class time" },
      { icon: "💼", title: "Meeting", desc: "Business hour" },
      { icon: "🎮", title: "Gaming", desc: "Play session" },
    ],
    90: [
      { icon: "🎬", title: "Movie", desc: "Short film" },
      { icon: "⚽", title: "Soccer Match", desc: "Game time" },
      { icon: "🧘", title: "Yoga Workshop", desc: "Extended class" },
      { icon: "📚", title: "Study Session", desc: "Deep learning" },
      { icon: "🍳", title: "Cooking Class", desc: "Recipe time" },
      { icon: "💪", title: "Gym + Cardio", desc: "Full routine" },
      { icon: "🎯", title: "Deep Work", desc: "Project time" },
      { icon: "🚗", title: "Road Trip", desc: "Drive timer" },
    ],
    120: [
      { icon: "🎬", title: "Movie", desc: "Feature film" },
      { icon: "⚽", title: "Sports Match", desc: "Full game" },
      { icon: "📚", title: "Study Block", desc: "Exam prep" },
      { icon: "🍳", title: "Cooking Session", desc: "Full meal prep" },
      { icon: "💪", title: "Marathon Training", desc: "Long run" },
      { icon: "🎯", title: "Deep Work", desc: "Project sprint" },
      { icon: "✈️", title: "Flight Timer", desc: "Short flight" },
      { icon: "🎓", title: "Workshop", desc: "Training session" },
    ],
  };

  // Default use cases for durations not specifically defined
  const defaultUseCases = [
    { icon: "⏰", title: "General Timer", desc: "Multi-purpose" },
    { icon: "🎯", title: "Task Timer", desc: "Time management" },
    { icon: "📚", title: "Study Timer", desc: "Focus session" },
    { icon: "💪", title: "Exercise", desc: "Workout timer" },
    { icon: "🧘", title: "Meditation", desc: "Mindfulness" },
    { icon: "🍳", title: "Cooking", desc: "Kitchen timer" },
    { icon: "☕", title: "Break Time", desc: "Rest period" },
    { icon: "🎮", title: "Activity", desc: "Timed activity" },
  ];

  // Find the closest defined duration
  const definedDurations = Object.keys(useCases)
    .map(Number)
    .sort((a, b) => a - b);
  let closestDuration = definedDurations[0];

  for (const duration of definedDurations) {
    if (Math.abs(minutes - duration) < Math.abs(minutes - closestDuration)) {
      closestDuration = duration;
    }
  }

  return useCases[closestDuration] || defaultUseCases;
};

// Generate SEO-friendly descriptions
export const getTimerData = (minutes) => {
  const durationText = formatDurationText(minutes);
  const durationSlug = formatDurationSlug(minutes);

  let description, keywords;

  if (minutes < 60) {
    description = `Free ${minutes} minute timer online. Simple countdown timer with alarm sound and brown noise option. Perfect for productivity, cooking, exercise, meditation, and time management.`;
    keywords = `${minutes} minute timer, ${minutes} min timer, online timer ${minutes} minutes, ${minutes} minute countdown, timer for ${minutes} minutes, set timer ${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      description = `Free ${hours} hour timer online. Simple countdown timer with alarm sound and brown noise option. Perfect for work sessions, studying, cooking, and long activities.`;
      keywords = `${hours} hour timer, ${hours}h timer, online timer ${hours} hours, ${hours} hour countdown, timer for ${hours} hours, set timer ${hours} hours`;
    } else {
      description = `Free ${hours} hour ${remainingMinutes} minute timer online. Simple countdown timer with alarm sound and brown noise option. Perfect for extended work sessions, projects, and activities.`;
      keywords = `${hours} hour ${remainingMinutes} minute timer, ${minutes} minute timer, online timer ${hours}h ${remainingMinutes}m, timer for ${hours} hours ${remainingMinutes} minutes`;
    }
  }

  return {
    minutes,
    durationText,
    durationSlug,
    title: `${durationText} Timer - Online Countdown Timer with Alarm | Deep Timer`,
    description,
    keywords,
    url: `https://www.deep-timer.com/${durationSlug}`,
    useCases: getUseCases(minutes),
  };
};
