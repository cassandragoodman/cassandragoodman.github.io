const { google } = require('googleapis');

let authClient = null;

// GOOGLE_SERVICE_ACCOUNT_KEY holds the *entire* downloaded key file as one
// JSON blob (not split into separate env vars) so the private key's
// embedded "\n" sequences survive round-tripping through env var storage.
function getAuth() {
  if (!authClient) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    authClient = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
  }
  return authClient;
}

function getDriveClient() {
  return google.drive({ version: 'v3', auth: getAuth() });
}

function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

module.exports = { getDriveClient, getSheetsClient };
