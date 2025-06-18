const supabase = require('../supabase');

// Usage: cacheMiddleware('cache_key', ttl_in_seconds)
function cacheMiddleware(keyFn, ttl = 3600) {
  return async (req, res, next) => {
    const key = typeof keyFn === 'function' ? keyFn(req) : keyFn;
    // Check cache
    const { data, error } = await supabase.from('cache').select('value,expires_at').eq('key', key).single();
    if (data && data.expires_at && new Date(data.expires_at) > new Date()) {
      return res.json(data.value);
    }
    // Hijack res.json to set cache after response
    const origJson = res.json.bind(res);
    res.json = async (body) => {
      await supabase.from('cache').upsert({
        key,
        value: body,
        expires_at: new Date(Date.now() + ttl * 1000).toISOString()
      });
      origJson(body);
    };
    next();
  };
}

module.exports = cacheMiddleware; 