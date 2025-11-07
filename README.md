# YouTube Videó Információ Megjelenítő

Teljes körű Node.js alkalmazás YouTube videók adatainak megjelenítéséhez - **Web alkalmazás** és **CLI** (parancssoros) verzióval.

## 🚀 Online Használat (Webről elérhető)

**Az alkalmazást az interneten is használhatod deployment után!**

Részletes útmutató különböző platformokhoz: [DEPLOYMENT.md](DEPLOYMENT.md)

**Gyors start (Vercel - ajánlott):**
1. Regisztráció: https://vercel.com
2. GitHub repo importálás
3. Deploy gomb → Kész! 🎉

---

## Telepítés (Lokális használathoz)

```bash
npm install
```

## Használat

### 🌐 Web Alkalmazás (Ajánlott)

Modern böngészős felület YouTube videók információinak megtekintéséhez.

**Indítás:**
```bash
npm start
```

Majd nyisd meg a böngészőben: **http://localhost:3000**

**Funkciók:**
- Egyszerű, modern felület
- Valós idejű videó információ lekérés
- Bélyegkép megjelenítés
- Statisztikák (megtekintések, értékelések, stb.)
- Reszponzív design (mobil és asztal)

---

### 💻 CLI Verzió (Parancssoros)

Terminálból használható verzió színes kimenettel.

```bash
npm run cli "<YouTube URL>"
```

**Fontos:** Az URL-t tedd idézőjelek közé, különösen ha `&` vagy más speciális karaktereket tartalmaz!

**Példa:**
```bash
npm run cli "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
npm run cli "https://www.youtube.com/watch?v=VtHvkBWToJs&t=339s"
```

---

### 🎮 Demo Mód

Ha nincs internet kapcsolat vagy szeretnéd megnézni hogyan néz ki a CLI kimenet:

```bash
npm run demo
```

## Megjelenített információk

Az alkalmazás a következő videó adatokat jeleníti meg:

- 📺 Cím
- 👤 Feltöltő neve
- 📺 Csatorna neve
- 🆔 Videó ID
- ⏱️ Videó hossza
- 👁️ Megtekintések száma
- 📅 Feltöltés dátuma
- 📂 Kategória
- 👍 Értékelések száma
- 📝 Leírás
- 🏷️ Címkék/kulcsszavak
- 🔗 URL
- 🖼️ Bélyegkép

## Képernyőképek

### Web Alkalmazás
A web alkalmazás modern, színes felülettel rendelkezik:
- **Keresőmező** a YouTube URL beillesztéséhez
- **Videó bélyegkép** és cím megjelenítése
- **Statisztikai kártyák** vizuális megjelenítéssel
- **Teljes leírás** és címkék
- **Közvetlen link** a YouTube-ra

### CLI Verzió
A CLI verzió színes terminál kimenettel rendelkezik.

## API Endpoints

Ha saját klienst szeretnél készíteni:

### POST /api/video-info
Videó információk lekérése YouTube URL alapján.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "title": "Videó címe",
  "author": "Csatorna neve",
  "viewCount": 123456,
  "likes": 5000,
  "duration": "10:30",
  "description": "...",
  ...
}
```

## Technológia

### Backend
- Node.js
- Express.js - Web szerver
- @distube/ytdl-core - YouTube videó információk lekérése (aktívan karbantartott fork)

### Frontend
- Vanilla JavaScript (ES6+)
- Modern CSS3 (Grid, Flexbox, gradients)
- Responsive design
- Fetch API

### CLI
- chalk - Színes konzol kimenet

## Projekt Struktúra

```
claude_code_test/
├── server.js           # Express szerver (web alkalmazás)
├── index.js            # CLI alkalmazás
├── demo.js             # Demo mód
├── package.json        # Projekt konfiguráció
├── public/             # Statikus web fájlok
│   ├── index.html      # Főoldal
│   ├── style.css       # Stílusok
│   └── app.js          # Client-side JavaScript
└── README.md           # Dokumentáció
```

## Parancsok Összefoglalója

| Parancs | Leírás |
|---------|--------|
| `npm start` | Web alkalmazás indítása (http://localhost:3000) |
| `npm run cli "<url>"` | CLI verzió futtatása YouTube URL-lel |
| `npm run demo` | Demo mód (példa kimenet) |
| `npm run dev` | Fejlesztői mód (ugyanaz mint `npm start`) |

## Hibaelhárítás

**"Could not extract functions" hiba:**
- Az alkalmazás a legfrissebb @distube/ytdl-core könyvtárat használja
- Ha továbbra is hibát kapsz, ellenőrizd az internet kapcsolatot
- Lehet, hogy a YouTube átmenetileg blokkol automatizált kéréseket

**Port már használatban:**
- Az alkalmazás alapértelmezetten a 3000-es porton fut
- Állítsd be a `PORT` környezeti változót más port használatához:
  ```bash
  PORT=8080 npm start
  ```

**URL nem működik CLI-ben:**
- Használj idézőjeleket az URL körül
- Helyes: `npm run cli "https://..."`
- Helytelen: `npm run cli https://...`

## Licenc

MIT
