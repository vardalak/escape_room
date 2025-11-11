# Escape Room

A game built with React Native and Expo.

## Project Structure

```
escape_room/
├── App.js                    # Main application entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
│
├── src/
│   ├── components/
│   │   └── screens/         # Screen components
│   ├── context/             # React Context providers
│   ├── styles/              # Theme and common styles
│   ├── utils/               # Utility functions
│   └── hooks/               # Custom React hooks
│
└── assets/                  # Asset files (icons, images, etc)
```

## Quick Start

**Prerequisites:**
- Node.js installed
- Expo Go app on your device

**Development:**
```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with tunnel mode (for Windows to phone)
npx expo start --tunnel

# With cache clear
npx expo start --tunnel --clear
```

**Scan QR code with Expo Go app on your device to run the game.**

## Experience Validation

Before deploying or testing new experiences, always run the validator to ensure the experience is completable and free of errors:

```bash
# Validate an experience
npm run validate <experience_id>

# Examples:
npm run validate training_basement
npm run validate sheriffs_last_ride
```

The validator checks:
- **Structure** - All required fields and references are valid
- **Reachability** - All items, keys, and completion criteria can be reached
- **Room Connectivity** - All rooms (including finalRoomId) are accessible via doors with `leadsTo` properties
- **Circular Dependencies** - No keys are locked behind doors/containers that require the same key
- **Puzzle Clues** - Keypad locks have sufficient clues to solve them

**Always validate experiences before committing changes!**

## Tech Stack

- **Framework:** React Native 0.81.5 with Expo SDK 54.0.0
- **State Management:** React Context API with hooks
- **Platform:** iOS (initially), Android (future)

## License

Private project

---

**Created:** 2025-11-10
