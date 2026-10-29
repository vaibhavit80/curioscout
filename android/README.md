# 📱 CurioScout Android Mobile Application

This directory contains the complete, native Android Studio project for **CurioScout: Play & Learn Academy**.

---

## 🏗️ Architecture & Features

- **Package Name**: `com.curioscout.app`
- **100% Offline & Kid-Safe**: All 15 games, Scout AI engine, Web Audio synthesis, and assets are bundled inside `app/src/main/assets/`. Zero external internet permissions required!
- **Immersive Fullscreen Mode**: Hides system navigation and status bars for a clean, distraction-free tablet/phone arcade experience.
- **Hardware Acceleration**: Enabled in `AndroidManifest.xml` for ultra-smooth 60fps canvas drawing and animations.
- **Audio Focus & Keep Screen On**: Configured in `MainActivity.java` so children can play without the screen turning off.

---

## 🚀 How to Build & Run with Android Studio

### 1. Open in Android Studio
1. Launch **Android Studio**.
2. Click **File** -> **Open...** (or **Open an Existing Project**).
3. Select this `android` folder:
   ```
   c:\Users\hp\Downloads\minigame\android
   ```
4. Allow Gradle to sync dependencies.

### 2. Run on an Android Device or Emulator
1. Connect your Android phone or tablet via USB (enable USB Debugging) or launch an Android Virtual Device (AVD).
2. Click the green **Run** button (▶) or press `Shift + F10`.

### 3. Generate Release APK / Google Play AAB
- To build a standalone APK:
  - Menu -> **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
  - The generated `.apk` file will be located at:
    `app/build/outputs/apk/debug/app-debug.apk`
- To build for Google Play Store:
  - Menu -> **Build** -> **Generate Signed Bundle / APK...** -> select **Android App Bundle (.aab)**.

---

## ⚡ Alternative Instant Android Install (PWA)

CurioScout is also fully PWA-enabled with `manifest.json` and `sw.js`:
1. Start the server on your computer:
   ```bash
   node server.js
   ```
2. Open `http://<your-computer-ip>:3000` in Google Chrome on any Android device.
3. Tap **Install app** or **Add to Home screen**.
4. The CurioScout app icon will appear directly on your Android home screen with offline caching!
