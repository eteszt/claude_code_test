import express from 'express';
import ytdl from '@distube/ytdl-core';
import ytsPackage from 'youtube-sr';
import path from 'path';
import { fileURLToPath } from 'url';

const YouTube = ytsPackage.default || ytsPackage;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint a YouTube kereséshez
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Keresési kifejezés megadása kötelező' });
    }

    console.log(`Keresés: "${query}"`);

    // Keresés YouTube-on (30 találat, hogy legyen mit rendezni)
    const results = await YouTube.search(query, {
      limit: 30,
      type: 'video',
      safeSearch: false
    });

    // Eredmények formázása és feltöltési időpont parseolása
    const videos = results.map(video => {
      // uploadedAt értékének parseolása (pl. "2 days ago", "1 week ago", "3 months ago")
      const uploadedText = video.uploadedAt || '';
      let daysAgo = 999999; // alapértelmezett nagy érték ismeretlen dátumhoz

      if (uploadedText.includes('hour')) {
        const hours = parseInt(uploadedText) || 0;
        daysAgo = hours / 24;
      } else if (uploadedText.includes('day')) {
        daysAgo = parseInt(uploadedText) || 0;
      } else if (uploadedText.includes('week')) {
        const weeks = parseInt(uploadedText) || 0;
        daysAgo = weeks * 7;
      } else if (uploadedText.includes('month')) {
        const months = parseInt(uploadedText) || 0;
        daysAgo = months * 30;
      } else if (uploadedText.includes('year')) {
        const years = parseInt(uploadedText) || 0;
        daysAgo = years * 365;
      }

      return {
        videoId: video.id,
        title: video.title,
        author: video.channel?.name || 'N/A',
        channelId: video.channel?.id || '',
        duration: video.durationFormatted || 'N/A',
        viewCount: video.views || 0,
        uploadedAt: video.uploadedAt || 'N/A',
        thumbnail: video.thumbnail?.url || '',
        url: video.url,
        _daysAgo: daysAgo // belső mező rendezéshez
      };
    });

    // Rendezés feltöltési idő szerint (legfrissebb elöl)
    videos.sort((a, b) => a._daysAgo - b._daysAgo);

    // Első 10 videó kiválasztása
    const top10Videos = videos.slice(0, 10).map(v => {
      const { _daysAgo, ...video } = v; // _daysAgo mező eltávolítása
      return video;
    });

    console.log(`${top10Videos.length} találat feltöltési idő szerint rendezve (legfrissebb elöl)`);

    res.json({ results: top10Videos });

  } catch (error) {
    console.error('Hiba keresés közben:', error.message);
    console.error('Stack:', error.stack);

    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      error: 'Hiba történt a keresés során',
      details: isDev ? error.message : undefined
    });
  }
});

// API endpoint a videó információk lekéréséhez
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL megadása kötelező' });
    }

    console.log(`Videó lekérése: ${url}`);

    // Videó információk lekérése youtube-sr-rel
    const video = await YouTube.getVideo(url);

    if (!video) {
      return res.status(404).json({ error: 'A videó nem található' });
    }

    // Válasz összeállítása
    const response = {
      title: video.title || 'N/A',
      author: video.channel?.name || 'N/A',
      channelName: video.channel?.name || 'N/A',
      videoId: video.id || 'N/A',
      duration: video.durationFormatted || 'N/A',
      viewCount: video.views || 0,
      uploadDate: video.uploadedAt || 'N/A',
      category: 'N/A', // youtube-sr nem ad vissza kategóriát
      likes: video.likes || null,
      description: video.description || '',
      keywords: video.tags || [],
      url: video.url || url,
      thumbnail: video.thumbnail?.url || '',
      thumbnails: video.thumbnails || []
    };

    console.log(`Videó részletek sikeresen lekérve: ${video.title}`);
    res.json(response);

  } catch (error) {
    console.error('Hiba videó információk lekérésekor:', error.message);
    console.error('Stack:', error.stack);

    if (error.message.includes('Video unavailable') || error.message.includes('not found')) {
      return res.status(404).json({ error: 'A videó nem elérhető vagy privát' });
    }

    // Részletesebb hibaüzenet development módban
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({
      error: 'Hiba történt a videó információk lekérése során',
      details: isDev ? error.message : undefined
    });
  }
});

/**
 * Másodpercek formázása olvasható időformátumra
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Szerver indítása (csak ha nem Vercel környezetben fut)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n🚀 YouTube videó információ alkalmazás fut:`);
    console.log(`📡 http://localhost:${PORT}`);
    console.log(`\n➡️  Nyisd meg a böngészőben: http://localhost:${PORT}\n`);
  });
}

// Export az Express app-ot Vercel serverless function számára
export default app;
