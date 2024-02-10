const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/api/albums', async (req, res) => {
    try {
        const albums = await getAlbums();
        res.json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getAlbums() {
    const musicPath = path.join(__dirname, 'public', 'Music');
    const albums = [];

    const albumDirs = await fs.readdir(musicPath);

    for (const albumDir of albumDirs) {
        const albumDirPath = path.join(musicPath, albumDir);
        const thumbnailPath = path.join(albumDirPath, 'thumbnail.png');

        if (fs.existsSync(thumbnailPath)) {
            const songs = (await fs.readdir(albumDirPath)).filter(file => file !== 'thumbnail.png');
            albums.push({
                name: albumDir,
                thumbnail: `/Music/${albumDir}/thumbnail.png`,
                songs: songs.map(song => `/Music/${albumDir}/${song}`)
            });
        }
    }

    return albums;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
