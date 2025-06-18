const express = require('express');
const supabase = require('../supabase');
const mockAuth = require('../middleware/auth');
const router = express.Router();

router.use(mockAuth);

// Add a resource
router.post('/', async (req, res) => {
  const { disaster_id, name, location_name, location, type } = req.body;
  const { data, error } = await supabase.from('resources').insert([
    { disaster_id, name, location_name, location, type }
  ]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

// Geospatial query for resources near a point (within 10km)
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  const { data, error } = await supabase.rpc('nearby_resources', {
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    radius: 10000 // meters
  });
  if (error) return res.status(400).json({ error });
  res.json(data);
});

module.exports = router; 