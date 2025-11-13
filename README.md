# Deep Timer - Brown Noise Timer

A collection of 120+ online timers with brown noise for focus, productivity, and relaxation.

## Features

- **120 Timer Pages**: 1 minute to 2 hours (1-120 minutes)
- **Brown Noise**: Optional background noise for focus
- **Dark/Light Mode**: Toggle between themes
- **Mobile Responsive**: Works on all devices
- **SEO Optimized**: Automatic sitemap generation
- **Tangent Timers**: Manage side quests and research rabbit holes

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (includes sitemap generation)
npm run build

# Generate sitemap only
npm run sitemap
```

## Sitemap Generation

The sitemap is automatically generated during the build process and includes:

- Homepage (priority 1.0, weekly updates)
- All 120 timer pages (priority 0.8, monthly updates)
- Proper XML formatting for search engines
- Automatic lastmod timestamps

### Files:

- `scripts/generate-sitemap.js` - Sitemap generation script
- `lib/timerData.cjs` - CommonJS version for build scripts
- `public/sitemap.xml` - Generated sitemap (auto-updated on build)
- `public/robots.txt` - Robots.txt with sitemap reference

## Timer Pages

Each timer page includes:

- Unique SEO-optimized title and meta description
- Timer-specific use cases and content
- Links to related timer pages
- Structured data for search engines
- Brown noise toggle functionality

## URLs Generated

- `/1-minute` through `/59-minute`
- `/1-hour`
- `/1-hour-1-minute` through `/1-hour-59-minute`
- `/2-hour`

Total: 121 URLs (homepage + 120 timer pages)

## Why Brown Noise?

Brown noise, characterized by its deeper frequency profile compared to white or pink noise, offers several benefits:

- Enhanced focus and concentration
- Improved sleep quality
- Stress reduction
- Ambient sound masking
- Less fatigue during extended listening

The sound's power spectral density decreases by 6 dB per octave, creating a deeper, richer quality that many find more soothing than other noise colors.

## Usage

1. Visit [deep-timer.com](https://www.deep-timer.com)
2. Click the time display to set your desired duration
3. Press Start to begin playback
4. Brown noise will automatically stop when the timer ends

## Tangent Timer Feature

The tangent timer helps you manage side quests and research rabbit holes during your work sessions:

### How to Use

1. Click "Add Tangent Timer" below the main timer controls
2. Choose a preset duration (5, 10, or 15 minutes) or enter a custom time (1-30 minutes)
3. Multiple tangent timers can run simultaneously alongside your main timer
4. Active tangent timers appear as floating cards in the bottom-right corner

### Features

- **Quick Presets**: 5m, 10m, 15m for common side quests
- **Custom Duration**: Set any duration from 1-30 minutes
- **Persistent**: Timers continue running across page refreshes
- **Independent**: Tangent timers run separately from the main timer
- **Visual Alerts**: Completed timers pulse red until dismissed
- **Minimize Option**: Collapse the timer display to save screen space

### Use Cases

- Time-boxing research tasks
- Managing quick email checks
- Limiting social media breaks
- Controlling documentation lookups
- Preventing endless debugging sessions

## Technical Details

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Web Audio API

## Browser Compatibility

Works on all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge

Note: Some mobile devices may pause audio when locked. For uninterrupted playback, keep your device unlocked or adjust system settings.

## Made by

Made by [Josh May](https://www.jmmay.com/)
