const jwt = require('jsonwebtoken');

const SESSION_TTL = '7d';

function signSession({ email, name, driveFolderId }) {
  return jwt.sign(
    { email, name, driveFolderId },
    process.env.SESSION_JWT_SECRET,
    { expiresIn: SESSION_TTL }
  );
}

// Reads the Bearer token from the request and returns its verified payload.
// Throws an Error with a .statusCode of 401 if missing/invalid/expired.
function requireSession(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    const err = new Error('Missing or malformed Authorization header');
    err.statusCode = 401;
    throw err;
  }
  try {
    return jwt.verify(token, process.env.SESSION_JWT_SECRET);
  } catch (e) {
    const err = new Error('Invalid or expired session');
    err.statusCode = 401;
    throw err;
  }
}

module.exports = { signSession, requireSession };
