// Mock users
const users = {
  netrunnerX: { id: 'netrunnerX', role: 'admin' },
  reliefAdmin: { id: 'reliefAdmin', role: 'admin' },
  citizen1: { id: 'citizen1', role: 'contributor' },
};

// Usage: req.headers['x-user'] = 'netrunnerX'
function mockAuth(req, res, next) {
  const userId = req.headers['x-user'];
  if (userId && users[userId]) {
    req.user = users[userId];
  } else {
    req.user = users['citizen1']; // default
  }
  next();
}

module.exports = mockAuth; 