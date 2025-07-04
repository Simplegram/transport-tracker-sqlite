# Transport Tracker App

A mobile app for tracking public transport journeys, built from personal experience as a former commuter between Gading Serpong, Tangerang and Kemang, South Jakarta.

## 🚀 What's New in This Version

- Compared to the [previous Transport Tracker repo](https://github.com/Simplegram/transport-tracker-app/tree/main), this version utilizes SQLite instead of Supabase to store all your transport data locally on your device. You can export and import your data in JSON format at any time.
- Add or remove data without internet connection. Features like map display and GPS tracking requires internet connection.
- Add multiple vehicle types for stops (ex: metro on top, bus stop on the bottom).

**Disclaimer: Currently tested on Android only. iOS compatibility not verified.**

## 📱 Tech Stack

### Core Framework & Navigation

- **React Native** (0.79.4) - Cross-platform mobile development
- **Expo** (\~53.0.13) - Development platform and toolchain
-  **@react-navigation/native** - Navigation framework

### Local Data & Storage

-  **@op-engineering/op-sqlite** - High-performance local SQLite database
- **react-native-mmkv** - Fast, secure key-value storage for app preferences
- **expo-file-system** - File operations and local storage management

### Maps & Location

-  **@maplibre/maplibre-react-native** - Privacy-focused mapping (Google Maps alternative)
- **expo-location** - Location services for journey tracking

### UI & Experience

- **react-native-calendars** - Calendar functionality for journey history
- **react-native-reanimated** - Smooth animations and gestures
- **expo-crypto** - Cryptographic functions for data security

## 🛠️ Get Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI (install with `npm install -g eas-cli`)
- Android Studio (for Android development)
- An Android device or emulator

### Installation

1. **Clone the repository**

    ```bash
    git clone [your-repo-url]
    cd transport-tracker-app
    ```
2. **Install dependencies**

    ```bash
    npm install
    ```
3. **Start the development server**

    ```bash
    npx expo start
    ```
4. **Run on your device**

    - Scan the QR code with Expo Go app (Android)
    - Or press `a` to run on Android emulator

### Development Notes

- This project uses [file-based routing](https://docs.expo.dev/router/introduction)
- The app works offline - no backend setup required!
- Build your own debug apk to avoid Expo-related error

## 📦 Build Preview APK

### Option 1: With EAS (Recommended)

**First-time setup:**

1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Configure your project: `eas build:configure`

**Building:**

1. **Pull environment variables** (if using EAS)

    ```bash
    npx eas env:pull --environment preview
    ```
2. **Update app with latest changes**

    ```bash
    npx eas update --environment preview
    ```
3. **Build APK**

    ```bash
    npx eas build --profile preview --platform android
    ```

### Option 2: With Android Studio

**For local development builds:**

1. **Generate native code**

    ```bash
    npx expo prebuild --clean
    ```

    > ⚠️ **Important:**  Close any running `npx expo start` instances before running this command to avoid Gradle import errors.
    >
2. **Open in Android Studio**

    - Open the generated `android` folder in Android Studio
    - Let Gradle sync complete
    - Build and run the project

## 🔧 Configuration

### Database Setup

- The app automatically creates and manages its SQLite database on first launch. No manual setup required!

### Maps Configuration

- Specify `EXPO_PUBLIC_MAP_STYLE` and `EXPO_PUBLIC_MAP_STYLE_DARK` on env file to load default map and map with dark mode. MapLibre currently has limited functionalities with React Native's New Architecture.
