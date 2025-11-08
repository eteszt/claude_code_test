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

    // Keresés YouTube-on (10 találat)
    const results = await YouTube.search(query, {
      limit: 10,
      type: 'video',
      safeSearch: false
    });

    // Eredmények formázása
    const videos = results.map(video => ({
      videoId: video.id,
      title: video.title,
      author: video.channel?.name || 'N/A',
      channelId: video.channel?.id || '',
      duration: video.durationFormatted || 'N/A',
      viewCount: video.views || 0,
      uploadedAt: video.uploadedAt || 'N/A',
      thumbnail: video.thumbnail?.url || '',
      url: video.url
    }));

    console.log(`${videos.length} találat (YouTube relevancia szerint)`);

    res.json({ results: videos });

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

    // Ellenőrizzük, hogy érvényes YouTube URL-e
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Érvénytelen YouTube URL' });
    }

    // Videó információk lekérése
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Válasz összeállítása
    const response = {
      title: videoDetails.title,
      author: videoDetails.author.name,
      channelName: videoDetails.ownerChannelName,
      videoId: videoDetails.videoId,
      duration: formatDuration(videoDetails.lengthSeconds),
      viewCount: Number(videoDetails.viewCount),
      uploadDate: videoDetails.uploadDate || 'N/A',
      category: videoDetails.category || 'N/A',
      likes: videoDetails.likes ? Number(videoDetails.likes) : null,
      description: videoDetails.description,
      keywords: videoDetails.keywords || [],
      url: videoDetails.video_url,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      thumbnails: videoDetails.thumbnails
    };

    res.json(response);

  } catch (error) {
    console.error('Hiba videó információk lekérésekor:', error.message);
    console.error('Stack:', error.stack);

    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'A videó nem elérhető vagy privát' });
    }

    if (error.message.includes('Could not extract')) {
      return res.status(503).json({
        error: 'YouTube API hiba - Próbáld újra később',
        details: 'A YouTube API átmenetileg nem elérhető vagy változott'
      });
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
