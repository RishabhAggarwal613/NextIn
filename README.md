# NextIn — Dignified, Inclusive Queueing (Server + Expo App)

A full-stack MERN + Expo project to design a clear, respectful waiting experience for public spaces.  
Clients can create and run queues; customers can join by ID, see live status, and receive transparent ETAs.  
Real-time updates via **Socket.IO**.

---

## 🧱 Tech Stack

**Backend:** Node.js 18+, Express 5, MongoDB (Mongoose 8), JWT, Socket.IO 4  
**Mobile:** Expo SDK 53 (React 19, RN 0.79), React Navigation, React Native Paper (MD3), NativeWind (Tailwind), Moti (animations), socket.io-client, Axios, Zustand

---

## 📁 Monorepo Layout

```
NextIn/
├─ server/            # Express + Mongo + Socket.IO
│  ├─ .env
│  └─ src/
│     ├─ models/      # User, Queue
│     ├─ services/    # auth, queue, notify stubs
│     ├─ controllers/ # auth, queue
│     ├─ routes/      # /api/v1/auth, /api/v1/queues
│     ├─ constants/   # SOCKET_NAMESPACE="/q", events
│     └─ index.js     # app bootstrap + socket namespace
└─ mobile/            # Expo app (managed workflow)
   ├─ app.json
   ├─ App.js          # re-exports src/App.js
   └─ src/
      ├─ App.js
      ├─ config/env.js      # API_BASE, SOCKET_URL, SOCKET_NAMESPACE
      ├─ navigation/        # RootNavigator, route names
      ├─ api/               # axios client + endpoints
      ├─ sockets/           # socket instance + hook
      ├─ store/             # zustand: auth, queue
      ├─ components/        # UI kit (buttons, cards, gradient)
      └─ screens/           # RoleSelect, Client, Customer
```

---

## 🚀 Quick Start (Development)

### 1) Backend

**Prereqs:** Node 18+ (or 20), MongoDB running locally.  

`server/.env`

```env
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/nextin
JWT_SECRET=dev_secret
CORS_ORIGIN=*
```

**Install & run**

```bash
cd server
npm i
npm run dev
# → http://localhost:4000
# Socket namespace: /q  (e.g. ws://localhost:4000/q)
```

---

### 2) Mobile (Expo)

**Create app if you haven’t**

```bash
cd mobile
npx create-expo-app@latest . --template blank
```

**Install deps**

```bash
# Core
npm i @react-navigation/native @react-navigation/native-stack axios socket.io-client zustand

# UI
npm i react-native-paper nativewind tailwindcss moti @expo/vector-icons

# Expo native modules (SDK 53 aligned)
npx expo install react-native-gesture-handler react-native-safe-area-context react-native-screens react-native-reanimated expo-linear-gradient expo-clipboard expo-haptics
```

**Config**  
`babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel", "react-native-reanimated/plugin"], // keep last
  };
};
```

`tailwind.config.js` should scan `src/**/*.{js,jsx,ts,tsx}` and define brand colors.  

`mobile/src/config/env.js`
```js
export const API_BASE = "http://<YOUR_LAN_IP>:4000"; // e.g., http://192.168.1.50:4000
export const SOCKET_URL = API_BASE;
export const SOCKET_NAMESPACE = "/q";
```

**Start**
```bash
npx expo start -c
```

- Press **w** for web or scan QR in Expo Go.  
- For real devices, ensure phone + PC are on same Wi-Fi.  

---

## 🔐 Auth Model

- Register/Login → returns `{ token, user }`.
- Mobile stores token (Zustand) & sets it on Axios: `Authorization: Bearer <token>`.
- Protected routes require token (create queue, next/pause/resume).

---

## 🧮 Queue Logic (Server)

- Each queue has `queueId` (6-char: A–Z, 2–9).  
- Counters: `nextTicket`, `servedTicket`.  
- **Join** → returns `{ ticket, position, total }`.  
- **serveNext**:
  - increments `servedTicket`
  - recomputes moving average `avgServiceMs`
  - emits `queue:update` and `queue:served`.

**ETA:** `position * avgServiceMs ± spread → { low, high, confidence }`.

---

## 🌐 REST API (v1)

**Base:** `http://<API_BASE>`

### Auth
- `POST /api/v1/auth/register`  
  `{ name, email, password } → { token, user }`
- `POST /api/v1/auth/login`  
  `{ email, password } → { token, user }`

### Queues
- `POST /api/v1/queues` (auth) → `{ queueId }`  
- `GET /api/v1/queues/:queueId`  
- `POST /api/v1/queues/:queueId/join` → `{ ticket, position, total }`  
- `GET /api/v1/queues/:queueId/status?ticket=NN`  
- `POST /api/v1/queues/:queueId/next` (auth, owner)  
- `POST /api/v1/queues/:queueId/pause` (auth, owner)  
- `POST /api/v1/queues/:queueId/resume` (auth, owner)  

**cURL samples**
```bash
# Create queue
curl -X POST http://<API>/api/v1/queues   -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json"   -d '{"name":"OPD Desk A"}'

# Join queue
curl -X POST http://<API>/api/v1/queues/ABC123/join   -H "Content-Type: application/json" -d '{"name":"Anita","phone":"99999"}'
```

---

## 🔌 Realtime (Socket.IO)

- **Namespace:** `/q`  
- **Join room**
  ```js
  socket.emit("room:join", { queueId: "ABC123" });
  ```
- **Server emits**
  - `queue:update` → `{ queueId, total, nextTicket, servedTicket, isOpen }`
  - `queue:served` → `{ queueId, servedTicket }`

---

## 📱 Mobile Flows

- **Role Select** → Client | Customer  
- **Client** → Create Queue → Control → Next/Pause  
- **Customer** → Join Queue → Status (live updates)  

UI: Paper + NativeWind + Moti + gradients/glass effects.

---

## 🧩 Accessibility & Inclusivity

- High contrast colors, large tap targets.  
- Consistent ETA + “confidence” reduces anxiety.  
- Simple labels, minimal jargon.  
- SMS/Push stubs ready (Twilio/FCM later).  

---

## 🧰 Troubleshooting

- **Expo Metro error** → clear cache: `npx expo start -c`  
- **Phone cannot reach API** → use LAN IP, same Wi-Fi, or tunnel: `npx expo start --tunnel`  
- **CORS error** → set `CORS_ORIGIN=*` (dev).  
- **401 on auth** → ensure JWT is set on Axios.  

---

## 🔒 Production Checklist

- Use HTTPS API.  
- Strong `JWT_SECRET`, short lifetimes.  
- Rate limiting & abuse protection.  
- Push notifications (FCM/Expo), SMS (Twilio).  
- Owner claims/ACLs on queues.  
- Add logs/metrics/analytics.  

---

## 📜 License

MIT (or your choice). Add LICENSE file before public release.

---

## 🙌 Credits

Built with ❤️ to make waiting **fair, transparent, and dignified**.
