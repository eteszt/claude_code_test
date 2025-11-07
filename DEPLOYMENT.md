# Deployment Útmutató

Ez az útmutató segít az alkalmazást az interneten elérhetővé tenni különböző platformokon.

## 🚀 Deployment Opciók

### 1. Railway (AJÁNLOTT - Megbízható)

**Előnyök:**
- ✅ Ingyenes tier (500 óra/hó)
- ✅ Hagyományos szerver (nem serverless) → **YouTube nem blokkolja bot-védelemmel**
- ✅ Egyszerű használat
- ✅ Git integráció
- ✅ Automatikus HTTPS

**Lépések:**

1. **Regisztráció:** https://railway.app/ (GitHub fiókkal)
2. **Új projekt:**
   - Kattints: "New Project"
   - Válaszd: "Deploy from GitHub repo"
   - Válaszd ki: `eteszt/claude_code_test`
3. **Beállítások:**
   - Branch: `claude/youtube-app-build-011CUuDnRVD5ToPMbJNNuPFX`
   - Start Command: `npm start` (automatikusan felismeri)
4. **Deploy és kész!**
   - Várj 2-3 percet
   - A dashboard-on megjelenik a publikus URL

**URL:** Megjelenik a Railway dashboardon (pl. `your-app.up.railway.app`)

**Automatikus frissítés:**
Minden git push után automatikusan újra-deployol.

---

### 2. Vercel (NEM AJÁNLOTT - YouTube bot-védelem miatt)

**⚠️ Figyelem:** A Vercel serverless function-ökkel nem működik megbízhatóan!

**Probléma:**
A YouTube bot-védelmével blokkol serverless kéréseket:
```
Error: Sign in to confirm you're not a bot
```

**Előnyök (ha működne):**
- ✅ Ingyenes
- ✅ Automatikus HTTPS
- ✅ Git integráció
- ✅ Nagyon gyors deployment

**Hátrányok:**
- ❌ YouTube bot-védelem blokkol
- ❌ Serverless timeout limit (30 mp max)
- ❌ Nem megbízható ytdl-core használathoz

**Lépések:**

1. **Regisztráció:** https://vercel.com/signup
2. **Projekt importálás:**
   - Kattints: "Add New..." → "Project"
   - Válaszd ki a GitHub repository-t: `eteszt/claude_code_test`
   - Válaszd ki a megfelelő branchot: `claude/youtube-app-build-011CUuDnRVD5ToPMbJNNuPFX`
3. **Deploy:**
   - Kattints "Deploy"
   - Várj 1-2 percet
4. **Kész!** Az alkalmazás elérhető lesz a Vercel által generált URL-en (pl. `your-app.vercel.app`)

**Automatikus frissítés:**
Minden git push után automatikusan újra-deployol.

---

### 3. Render

**Előnyök:**
- ✅ Ingyenes tier
- ✅ Jó dokumentáció
- ✅ HTTPS alapból

**Lépések:**

1. **Regisztráció:** https://render.com/
2. **Új Web Service:**
   - Dashboard → "New +" → "Web Service"
   - Connect GitHub repository: `eteszt/claude_code_test`
3. **Beállítások:**
   - Name: `youtube-video-info`
   - Branch: `claude/youtube-app-build-011CUuDnRVD5ToPMbJNNuPFX`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Create Web Service**

Első deployment 5-10 percet vesz igénybe.

---

### 4. Heroku

**Előnyök:**
- ✅ Népszerű platform
- ⚠️ Már nincs ingyenes tier (fizetős)

**Lépések:**

1. **Regisztráció:** https://heroku.com/
2. **Heroku CLI telepítése:**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku

   # Windows
   # Töltsd le: https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Deploy:**
   ```bash
   cd claude_code_test
   heroku login
   heroku create youtube-video-info
   git push heroku claude/youtube-app-build-011CUuDnRVD5ToPMbJNNuPFX:main
   heroku open
   ```

---

### 5. Ngrok (Gyors teszt - Ideiglenes)

**Csak tesztelésre!** Nem production használatra.

**Lépések:**

1. **Telepítés:** https://ngrok.com/download
2. **Használat:**
   ```bash
   # Terminál 1: indítsd az alkalmazást
   npm start

   # Terminál 2: ngrok tunnel
   ngrok http 3000
   ```
3. **URL:** Az ngrok megad egy publikus URL-t (pl. `https://abc123.ngrok.io`)

**Figyelem:** Az URL minden indításkor változik, és csak amíg fut az ngrok.

---

## 📋 Deployment Checklist

Bármelyik platformot is választod:

- [ ] A `package.json` tartalmazza a helyes `start` scriptet
- [ ] A `PORT` környezeti változó kezelve van a `server.js`-ben ✅
- [ ] A `.gitignore` tartalmazza a `node_modules/` mappát ✅
- [ ] A repository publikus vagy a platform hozzáfér
- [ ] A branch neve helyes: `claude/youtube-app-build-011CUuDnRVD5ToPMbJNNuPFX`

---

## 🎯 Melyiket válaszd?

| Platform | Ingyenes | Egyszerűség | YouTube bot-védelem | Ajánlás |
|----------|----------|-------------|---------------------|---------|
| **Railway** | ✅ (500h/hó) | ⭐⭐⭐⭐ | ✅ **Működik!** | **🏆 LEGJOBB** |
| **Render** | ✅ | ⭐⭐⭐ | ✅ Működik | Jó alternatíva |
| **Vercel** | ✅ | ⭐⭐⭐⭐⭐ | ❌ Blokkol | ⚠️ NEM ajánlott |
| **Ngrok** | ✅ | ⭐⭐⭐⭐⭐ | ✅ Működik | Csak tesztelésre! |
| **Heroku** | ❌ | ⭐⭐⭐ | ✅ Működik | Csak ha már fizetsz |

**⭐ Ajánlás: Railway!** Megbízható, ingyenes, és a YouTube nem blokkolja.

---

## ❓ Gyakori kérdések

**Q: Mennyibe kerül?**
A: Railway és Render mind kínál ingyenes tier-t, ami bőven elég ehhez az alkalmazáshoz. Railway: 500 óra/hó (kb. 20 nap folyamatos futás).

**Q: HTTPS-t kapok?**
A: Igen, mindegyik platform automatikusan ad HTTPS-t.

**Q: Egyedi domain-t használhatok?**
A: Igen, mindegyik platform támogatja (lehet fizetős opcióban).

**Q: Mit tegyek ha változtatok a kódon?**
A: Csak push-old a változtatásokat GitHub-ra, és automatikusan újra-deployol.

**Q: Mennyi ideig tart a deployment?**
A: Railway: ~2-3 perc, Render: ~5-10 perc, Vercel: ~1-2 perc (de nem működik YouTube-hoz)

---

## 🆘 Hibaelhárítás

**"Module not found" hiba:**
- Biztos hogy az `npm install` lefutott?
- A `package.json` dependencies rendben van?

**"Port already in use":**
- A platformok automatikusan kezelik a portot
- Lokálisan: használj másik portot: `PORT=8080 npm start`

**"Build failed":**
- Ellenőrizd a build logokat
- Próbáld lokálisan: `npm install && npm start`

---

## 📞 Támogatás

Ha bármi probléma van a deployment során:
1. Ellenőrizd a platform logjait
2. Próbáld lokálisan futtatni: `npm start`
3. Nézd meg a platform dokumentációját
