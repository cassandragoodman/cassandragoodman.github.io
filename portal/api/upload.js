const fs = require('fs');
const { formidable } = require('formidable');
const { requireSession } = require('./_lib/session');
const { findStudentByEmail } = require('./_lib/studentsSheet');
const { getUserDriveClient } = require('./_lib/googleClients');

const MAX_FILE_SIZE = 4 * 1024 * 1024; // stay under Vercel's ~4.5MB request body limit

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
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

    const form = formidable({ maxFileSize: MAX_FILE_SIZE });
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploaded) {
      res.status(400).json({ error: 'No file was included in the upload.' });
      return;
    }

    const drive = getUserDriveClient();
    const { data } = await drive.files.create({
      requestBody: {
        name: uploaded.originalFilename || uploaded.newFilename,
        parents: [session.driveFolderId],
      },
      media: {
        mimeType: uploaded.mimetype || 'application/octet-stream',
        body: fs.createReadStream(uploaded.filepath),
      },
      fields: 'id, name, webViewLink',
    });

    res.status(200).json({ file: data });
  } catch (err) {
    res.status(400).json({
      error: 'Could not upload that file — it may be too large (please keep files under 4MB) or unreadable. Please try again.',
    });
  }
};

// Multipart bodies must be parsed by formidable, not Vercel's default body parser.
module.exports.config = { api: { bodyParser: false } };
