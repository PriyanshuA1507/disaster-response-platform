const express = require('express');
const axios = require('axios');
const cacheMiddleware = require('../middleware/cache');
const router = express.Router();

// POST /geocode { description }
router.post('/', cacheMiddleware(req => `geocode-${req.body.description}`, 3600), async (req, res) => {
  const { description } = req.body;
  try {
    // Gemini API call (mocked for now)
    // Replace with real Gemini call if available
    // const geminiResp = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=API_KEY', ...)
    const location_name = 'Manhattan, NYC'; // mock extraction

    // OpenStreetMap Nominatim geocoding
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location_name)}&format=json`;
    const nominatimResp = await axios.get(url, {
      headers: { 'User-Agent': 'DisasterResponseApp/1.0 (your@email.com)' }
    });
    if (!nominatimResp.data || nominatimResp.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const { lat, lon } = nominatimResp.data[0];
    res.json({ location_name, lat, lon });
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

module.exports = router; 