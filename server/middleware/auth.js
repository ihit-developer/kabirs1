const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  // EventSource (used for the live orders stream) can't send custom headers,
  // so it passes the token as a query param instead.
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.token || null;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

module.exports = { requireAdmin, JWT_SECRET };
