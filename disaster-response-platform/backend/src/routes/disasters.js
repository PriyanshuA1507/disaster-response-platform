const express = require('express');
const supabase = require('../supabase');
const mockAuth = require('../middleware/auth');
const router = express.Router();

// Audit helper
function makeAudit(action, user_id) {
  return { action, user_id, timestamp: new Date().toISOString() };
}

router.use(mockAuth);

// Create disaster
router.post('/', async (req, res) => {
  const { title, location_name, location, description, tags } = req.body;
  const owner_id = req.user.id;
  const audit_trail = [makeAudit('create', owner_id)];
  const { data, error } = await supabase.from('disasters').insert([
    { title, location_name, location, description, tags, owner_id, audit_trail }
  ]).select();
  if (error) return res.status(400).json({ error });
  req.app.get('io')?.emit('disaster_updated', { type: 'create', data });
  res.json(data[0]);
});

// Get disasters (optionally filter by tag)
router.get('/', async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Update disaster
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location_name, location, description, tags } = req.body;
  const user_id = req.user.id;
  // Fetch current audit trail
  const { data: current, error: fetchErr } = await supabase.from('disasters').select('audit_trail').eq('id', id).single();
  if (fetchErr) return res.status(404).json({ error: 'Not found' });
  const audit_trail = current.audit_trail || [];
  audit_trail.push(makeAudit('update', user_id));
  const { data, error } = await supabase.from('disasters').update({ title, location_name, location, description, tags, audit_trail }).eq('id', id).select();
  if (error) return res.status(400).json({ error });
  req.app.get('io')?.emit('disaster_updated', { type: 'update', data });
  res.json(data[0]);
});

// Delete disaster
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  // Fetch current audit trail
  const { data: current, error: fetchErr } = await supabase.from('disasters').select('audit_trail').eq('id', id).single();
  if (fetchErr) return res.status(404).json({ error: 'Not found' });
  const audit_trail = current.audit_trail || [];
  audit_trail.push(makeAudit('delete', user_id));
  const { data, error } = await supabase.from('disasters').update({ audit_trail }).eq('id', id).select();
  if (error) return res.status(400).json({ error });
  await supabase.from('disasters').delete().eq('id', id);
  req.app.get('io')?.emit('disaster_updated', { type: 'delete', id });
  res.json({ success: true });
});

module.exports = router; 