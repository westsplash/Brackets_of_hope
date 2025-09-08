const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const userEntries = {}; // { username: [ {date, travel, shopping, diet, footprint}, ... ] }

function calculateFootprint({ travel, shopping, diet }) {
  // Basic multipliers
  const travelFootprint = travel * 0.21; // kg CO2/km
  const shoppingFootprint = shopping * 5; // kg CO2/$ spent
  const dietFootprint = diet === 'vegan' ? 2 : diet === 'vegetarian' ? 3 : 7; // daily kg CO2
  return travelFootprint + shoppingFootprint + dietFootprint;
}

app.post('/api/input', (req, res) => {
  const { username, travel, shopping, diet } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const date = new Date().toISOString().slice(0, 10);
  const footprint = calculateFootprint({ travel, shopping, diet });
  const entry = { date, travel, shopping, diet, footprint };
  userEntries[username] = userEntries[username] || [];
  userEntries[username].push(entry);
  res.json({ entry });
});

app.get('/api/track/:username', (req, res) => {
  const entries = userEntries[req.params.username] || [];
  res.json({ entries });
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));