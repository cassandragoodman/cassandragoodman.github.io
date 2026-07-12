// TEMPORARY one-time setup endpoint. Google redirects here after Cassandra
// consents; we exchange the code for tokens and display the refresh token so
// it can be saved as the GOOGLE_OAUTH_REFRESH_TOKEN env var. Deleted afterwards.
const { google } = require('googleapis');

function page(body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portal setup</title>
<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:48px auto;padding:0 20px;line-height:1.6;color:#1a1a1a}
code{display:block;word-break:break-all;background:#f2efe8;border:1px solid #e3e0d8;padding:16px;margin:16px 0;font-size:14px}
h1{font-weight:600}</style></head><body>${body}</body></html>`;
}

module.exports = async (req, res) => {
  const code = (req.query || {}).code;
  res.setHeader('Content-Type', 'text/html');
  if (!code) {
    res.status(400).send(page('<h1>Missing code</h1><p>Start again from <code>/api/oauth-setup</code>.</p>'));
    return;
  }
  const redirectUri = `https://${req.headers.host}/api/oauth-callback`;
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  try {
    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
      res.status(200).send(page('<h1>No refresh token returned</h1><p>Google only returns one on the first consent. Revoke the app at <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>, then start again from <code>/api/oauth-setup</code>.</p>'));
      return;
    }
    res.status(200).send(page(
      '<h1>Success — copy this value</h1>' +
      '<p>Send this to Claude to finish the setup. Keep it private (it grants access to your Drive).</p>' +
      `<code>${tokens.refresh_token}</code>` +
      '<p>Once it is saved, this page and its link will be removed.</p>'
    ));
  } catch (e) {
    res.status(500).send(page('<h1>Token exchange failed</h1><p>' + (e && e.message ? e.message : 'Unknown error') + '</p>'));
  }
};
