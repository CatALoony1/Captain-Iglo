require('dotenv').config();
async function getTenorGif(searchTerm) {
    const apiKey = process.env.TENOR_API;
    const url = `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=1&random=true`;
    try {
        const fetch = await import('node-fetch').then(module => module.default);
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const gifUrl = data.results[0].media_formats.gif.url;
            return gifUrl;
        } else {
            return 'Kein GIF gefunden.';
        }
    } catch (error) {
        console.error('Fehler beim Abrufen des GIFs:', error);
        return 'Fehler beim Abrufen des GIFs.';
    }
}

module.exports = getTenorGif;