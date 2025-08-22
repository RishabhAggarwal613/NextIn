# NextIn Expo Starter (Complete Setup)

## 1) Create a fresh Expo app
```bash
npx create-expo-app@latest mobile --template blank
cd mobile
```

## 2) Install libraries
```bash
# Navigation + state + network + sockets
npm i @react-navigation/native @react-navigation/native-stack axios socket.io-client zustand

# UI
npm i react-native-paper nativewind tailwindcss moti @expo/vector-icons

# Expo native modules (version-aligned)
npx expo install react-native-gesture-handler react-native-safe-area-context react-native-screens react-native-reanimated expo-linear-gradient expo-clipboard expo-haptics
```

## 3) Copy these files into your project
- Put everything from this zip into your Expo project root, merging with existing files.
- It adds `tailwind.config.js`, `babel.config.js`, and a full `src/` folder.

## 4) Start the app
```bash
npx expo start -c
```

> If you test on a real phone, set `API_BASE` in `src/config/env.js` to your PC's LAN IP (`http://192.168.x.x:4000`).

