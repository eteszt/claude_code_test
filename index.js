import ytdl from 'ytdl-core';
import chalk from 'chalk';

/**
 * YouTube videó információk lekérése és megjelenítése
 * @param {string} url - YouTube videó URL
 */
async function getVideoInfo(url) {
  try {
    console.log(chalk.blue('\n🔍 Videó információk lekérése...\n'));

    // Ellenőrizzük, hogy érvényes YouTube URL-e
    if (!ytdl.validateURL(url)) {
      console.error(chalk.red('❌ Érvénytelen YouTube URL!'));
      return;
    }

    // Videó információk lekérése
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Információk megjelenítése
    console.log(chalk.green.bold('📺 Videó Adatok:\n'));
    console.log(chalk.yellow('Cím:'), chalk.white(videoDetails.title));
    console.log(chalk.yellow('Feltöltő:'), chalk.white(videoDetails.author.name));
    console.log(chalk.yellow('Csatorna:'), chalk.white(videoDetails.ownerChannelName));
    console.log(chalk.yellow('Videó ID:'), chalk.white(videoDetails.videoId));
    console.log(chalk.yellow('Hossz:'), chalk.white(formatDuration(videoDetails.lengthSeconds)));
    console.log(chalk.yellow('Megtekintések:'), chalk.white(Number(videoDetails.viewCount).toLocaleString('hu-HU')));
    console.log(chalk.yellow('Feltöltés dátuma:'), chalk.white(videoDetails.uploadDate || 'N/A'));
    console.log(chalk.yellow('Kategória:'), chalk.white(videoDetails.category || 'N/A'));
    console.log(chalk.yellow('Értékelések:'), chalk.white(videoDetails.likes ? Number(videoDetails.likes).toLocaleString('hu-HU') : 'N/A'));

    // Leírás (rövidítve, ha túl hosszú)
    const description = videoDetails.description;
    const shortDesc = description.length > 200
      ? description.substring(0, 200) + '...'
      : description;
    console.log(chalk.yellow('\nLeírás:'));
    console.log(chalk.white(shortDesc));

    // Kulcsszavak/címkék
    if (videoDetails.keywords && videoDetails.keywords.length > 0) {
      console.log(chalk.yellow('\nCímkék:'));
      console.log(chalk.white(videoDetails.keywords.slice(0, 10).join(', ')));
    }

    // URL
    console.log(chalk.yellow('\nURL:'), chalk.cyan(videoDetails.video_url));

    // Thumbnail
    console.log(chalk.yellow('Bélyegkép:'), chalk.cyan(videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url));

    console.log(chalk.green('\n✅ Sikeres lekérés!\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Hiba történt:'), error.message);
    if (error.message.includes('Video unavailable')) {
      console.error(chalk.red('A videó nem elérhető vagy privát.'));
    }
  }
}

/**
 * Másodpercek formázása olvasható időformátumra
 * @param {number} seconds - Másodpercek száma
 * @returns {string} - Formázott idő (óra:perc:másodperc)
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

// Fő program
const url = process.argv[2];

if (!url) {
  console.log(chalk.red('\n❌ Használat: npm start <YouTube URL>\n'));
  console.log(chalk.yellow('Példa:'));
  console.log(chalk.cyan('  npm start https://www.youtube.com/watch?v=dQw4w9WgXcQ\n'));
  process.exit(1);
}

getVideoInfo(url);
