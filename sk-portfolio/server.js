const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      'https://shakil64it.me',      // production
      'http://localhost:4200',      // local dev
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, 'dist/sk-portfolio/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/sk-portfolio/browser/index.csr.html'));
});

app.listen(port, () => {
  console.log(`Frontend running on port ${port}`);
});
