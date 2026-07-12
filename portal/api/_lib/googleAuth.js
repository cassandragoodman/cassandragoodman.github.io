const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verifies a Google Identity Services ID token server-side (signature,
// audience, expiry) and returns the trusted identity it carries.
async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email_verified) {
    throw new Error('Google account email is not verified');
  }
  return { email: payload.email, name: payload.name || payload.email };
}

module.exports = { verifyGoogleIdToken };
