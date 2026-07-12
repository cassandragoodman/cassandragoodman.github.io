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

function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

// Drive is accessed as Cassandra's own Google account (via a stored OAuth
// refresh token), NOT the service account. Service accounts have no storage
// quota of their own, so any file they create is rejected by Google. Acting
// as Cassandra means uploaded files are owned by — and count against — her
// personal Drive storage, which is what we want.
let userDriveClient = null;
function getUserDriveClient() {
  if (!userDriveClient) {
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
    userDriveClient = google.drive({ version: 'v3', auth: oauth2 });
  }
  return userDriveClient;
}

module.exports = { getUserDriveClient, getSheetsClient };
