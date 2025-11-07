import express from 'express';
import ytdl from '@distube/ytdl-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Statikus fájlok kiszolgálása
app.use(express.static('public'));
app.use(express.json());

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
    console.error('Hiba:', error);

    if (error.message.includes('Video unavailable')) {
      return res.status(404).json({ error: 'A videó nem elérhető vagy privát' });
    }

    res.status(500).json({ error: 'Hiba történt a videó információk lekérése során' });
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
