require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// In-memory storage for URL mappings
const urlMap = {};
let nextShortId = 1;

// Function to generate a custom short URL
function generateShortUrl() {
  return nextShortId++;
}

// Route to handle shortening URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  const shortUrl = generateShortUrl();
  urlMap[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Route to handle redirection
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  const originalUrl = urlMap[shortUrl];
  if (!originalUrl) {
    return res.json({ error: 'Short URL not found' });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
