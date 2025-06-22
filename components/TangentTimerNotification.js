import { useEffect, useState } from 'react';

const TangentTimerNotification = ({ message, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down`}>
      <div className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
        isDarkMode
          ? 'bg-zinc-800/90 text-white border border-zinc-700'
          : 'bg-white/90 text-gray-900 border border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default TangentTimerNotification;