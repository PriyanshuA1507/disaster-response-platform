const express = require('express');
const supabase = require('../supabase');
const mockAuth = require('../middleware/auth');
const router = express.Router();

router.use(mockAuth);

// Submit a report
router.post('/', async (req, res) => {
  const { disaster_id, content, image_url } = req.body;
  const user_id = req.user.id;
  const verification_status = 'pending';
  const { data, error } = await supabase.from('reports').insert([
    { disaster_id, user_id, content, image_url, verification_status }
  ]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

// List reports for a disaster
router.get('/:disaster_id', async (req, res) => {
  const { disaster_id } = req.params;
  const { data, error } = await supabase.from('reports').select('*').eq('disaster_id', disaster_id);
  if (error) return res.status(400).json({ error });
  res.json(data);
});

module.exports = router; 