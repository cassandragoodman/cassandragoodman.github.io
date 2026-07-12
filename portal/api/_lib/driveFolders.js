const { getUserDriveClient } = require('./googleClients');

const FOLDER_MIME = 'application/vnd.google-apps.folder';
// The app creates and owns its own top-level folder in Cassandra's Drive.
// With the drive.file scope the app can only see/manage files it created, so
// student folders and their uploads all live under this app-created parent.
const ROOT_FOLDER_NAME = 'Cassandra Goodman Portal — Student Files';

let rootFolderIdCache = null;

async function getRootFolderId() {
  if (rootFolderIdCache) return rootFolderIdCache;
  const drive = getUserDriveClient();
  const { data } = await drive.files.list({
    q: `name = '${ROOT_FOLDER_NAME}' and mimeType = '${FOLDER_MIME}' and trashed = false`,
    fields: 'files(id)',
    spaces: 'drive',
  });
  if (data.files && data.files.length) {
    rootFolderIdCache = data.files[0].id;
    return rootFolderIdCache;
  }
  const { data: created } = await drive.files.create({
    requestBody: { name: ROOT_FOLDER_NAME, mimeType: FOLDER_MIME },
    fields: 'id',
  });
  rootFolderIdCache = created.id;
  return rootFolderIdCache;
}

// Creates a Drive folder named after the student's email under the app's
// root folder, and returns its id.
async function createStudentFolder(email) {
  const drive = getUserDriveClient();
  const parentId = await getRootFolderId();
  const { data } = await drive.files.create({
    requestBody: {
      name: email,
      mimeType: FOLDER_MIME,
      parents: [parentId],
    },
    fields: 'id',
  });
  return data.id;
}

module.exports = { createStudentFolder };
