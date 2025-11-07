import chalk from 'chalk';

/**
 * Demo mód - példa videó adatok megjelenítése
 * Ezt használd ha nincs internet kapcsolat, hogy lásd hogyan működik az alkalmazás
 */
function showDemo() {
  console.log(chalk.blue('\n🔍 Videó információk lekérése... (DEMO MÓD)\n'));

  // Példa videó adatok
  const demoVideo = {
    title: "Me at the zoo",
    author: "jawed",
    channelName: "jawed",
    videoId: "jNQXAC9IVRw",
    lengthSeconds: 19,
    viewCount: 279000000,
    uploadDate: "2005-04-24",
    category: "People & Blogs",
    likes: 13000000,
    description: "The first video on YouTube. Maybe it's time to go back to the zoo?",
    keywords: ["zoo", "elephant", "me", "first video", "youtube history"],
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg"
  };

  // Információk megjelenítése
  console.log(chalk.green.bold('📺 Videó Adatok:\n'));
  console.log(chalk.yellow('Cím:'), chalk.white(demoVideo.title));
  console.log(chalk.yellow('Feltöltő:'), chalk.white(demoVideo.author));
  console.log(chalk.yellow('Csatorna:'), chalk.white(demoVideo.channelName));
  console.log(chalk.yellow('Videó ID:'), chalk.white(demoVideo.videoId));
  console.log(chalk.yellow('Hossz:'), chalk.white(formatDuration(demoVideo.lengthSeconds)));
  console.log(chalk.yellow('Megtekintések:'), chalk.white(demoVideo.viewCount.toLocaleString('hu-HU')));
  console.log(chalk.yellow('Feltöltés dátuma:'), chalk.white(demoVideo.uploadDate));
  console.log(chalk.yellow('Kategória:'), chalk.white(demoVideo.category));
  console.log(chalk.yellow('Értékelések:'), chalk.white(demoVideo.likes.toLocaleString('hu-HU')));

  console.log(chalk.yellow('\nLeírás:'));
  console.log(chalk.white(demoVideo.description));

  console.log(chalk.yellow('\nCímkék:'));
  console.log(chalk.white(demoVideo.keywords.join(', ')));

  console.log(chalk.yellow('\nURL:'), chalk.cyan(demoVideo.url));
  console.log(chalk.yellow('Bélyegkép:'), chalk.cyan(demoVideo.thumbnail));

  console.log(chalk.green('\n✅ Sikeres lekérés! (DEMO)\n'));
  console.log(chalk.magenta('💡 Ez egy demo kimenet. Éles használathoz futtasd: npm start <YouTube URL>\n'));
}

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

showDemo();
