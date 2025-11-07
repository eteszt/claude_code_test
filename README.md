# YouTube Videó Információ Megjelenítő

Egyszerű Node.js alkalmazás, amely YouTube videók adatait jeleníti meg.

## Telepítés

```bash
npm install
```

## Használat

```bash
npm start "<YouTube URL>"
```

**Fontos:** Az URL-t tedd idézőjelek közé, különösen ha `&` vagy más speciális karaktereket tartalmaz!

### Példa

```bash
npm start "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
npm start "https://www.youtube.com/watch?v=VtHvkBWToJs&t=339s"
```

### Demo mód

Ha nincs internet kapcsolat vagy szeretnéd megnézni hogyan néz ki az alkalmazás kimenete:

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
- 📝 Leírás (rövidítve)
- 🏷️ Címkék/kulcsszavak
- 🔗 URL
- 🖼️ Bélyegkép URL

## Példa kimenet

```
🔍 Videó információk lekérése...

📺 Videó Adatok:

Cím: Me at the zoo
Feltöltő: jawed
Csatorna: jawed
Videó ID: jNQXAC9IVRw
Hossz: 0:19
Megtekintések: 279 000 000
Feltöltés dátuma: 2005-04-24
Kategória: People & Blogs
Értékelések: 13 000 000

Leírás:
The first video on YouTube. Maybe it's time to go back to the zoo?

Címkék:
zoo, elephant, me, first video, youtube history

URL: https://www.youtube.com/watch?v=jNQXAC9IVRw
Bélyegkép: https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg

✅ Sikeres lekérés!
```

## Technológia

- Node.js
- @distube/ytdl-core - YouTube videó információk lekérése (aktívan karbantartott fork)
- chalk - Színes konzol kimenet
