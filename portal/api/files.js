const { requireSession } = require('./_lib/session');
const { findStudentByEmail } = require('./_lib/studentsSheet');
const { getUserDriveClient } = require('./_lib/googleClients');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let session;
  try {
    session = requireSession(req);
  } catch (err) {
    res.status(err.statusCode || 401).json({ error: err.message });
    return;
  }

  try {
    const student = await findStudentByEmail(session.email);
    if (!student) {
      res.status(403).json({ error: 'This account no longer has portal access.' });
      return;
    }

    const drive = getUserDriveClient();
    const { data } = await drive.files.list({
      q: `'${session.driveFolderId}' in parents and trashed = false`,
      fields: 'files(id, name, webViewLink, createdTime, size)',
      orderBy: 'createdTime desc',
    });

    res.status(200).json({ files: data.files || [] });
  } catch (err) {
    res.status(500).json({ error: 'Could not load your files. Please try again.' });
  }
};
