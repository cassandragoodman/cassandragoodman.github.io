const { getDriveClient } = require('./googleClients');

// Creates a Drive folder named after the student's email under the shared
// root "Student Files" folder, and returns its id.
async function createStudentFolder(email) {
  const drive = getDriveClient();
  const { data } = await drive.files.create({
    requestBody: {
      name: email,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.DRIVE_ROOT_FOLDER_ID],
    },
    fields: 'id',
  });
  return data.id;
}

module.exports = { createStudentFolder };
