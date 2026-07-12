// TEMPORARY one-time setup endpoint. Visiting it sends Cassandra to Google's
// consent screen to grant the portal offline access to her Drive (drive.file
// scope). The matching /api/oauth-callback endpoint then shows the refresh
// token. Both endpoints are deleted once the token is stored as an env var.
const { google } = require('googleapis');

module.exports = async (req, res) => {
  const redirectUri = `https://${req.headers.host}/api/oauth-callback`;
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // force a refresh_token to be returned every time
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  res.writeHead(302, { Location: url });
  res.end();
};
