
const fs = require('fs');
const https = require('https');

const dest = "public/fonts/SpaceGrotesk-Bold.ttf";
const url = "https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk-Bold.ttf";

const file = fs.createWriteStream(dest);
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => console.log('Download completed.'));
    });
}).on('error', function (err) {
    fs.unlink(dest);
    console.error('Error downloading:', err.message);
});
