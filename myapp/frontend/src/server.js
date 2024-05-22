const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the src folder
app.use(express.static(path.join(__dirname, 'src')));

// Serve the app.js file as the entry point
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'app.js'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
