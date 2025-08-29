const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist/sk-portfolio/browser')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/sk-portfolio/browser/index.html'));
});

app.listen(port, () => {
  console.log(`Frontend running on port ${port}`);
});
