const { verifyGoogleIdToken } = require('../_lib/googleAuth');
const { findStudentByEmail, setDriveFolderId } = require('../_lib/studentsSheet');
const { createStudentFolder } = require('../_lib/driveFolders');
const { signSession } = require('../_lib/session');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { idToken } = req.body || {};
  if (!idToken) {
    res.status(400).json({ error: 'Missing idToken' });
    return;
  }

  let identity;
  try {
    identity = await verifyGoogleIdToken(idToken);
  } catch (err) {
    res.status(401).json({ error: 'Could not verify Google sign-in' });
    return;
  }

  try {
    const student = await findStudentByEmail(identity.email);
    if (!student) {
      res.status(403).json({
        error: "This Google account isn't registered for the portal yet. Please contact Cassandra.",
      });
      return;
    }

    let driveFolderId = student.driveFolderId;
    if (!driveFolderId) {
      driveFolderId = await createStudentFolder(identity.email);
      await setDriveFolderId(student.rowNumber, driveFolderId);
    }

    const name = student.name || identity.name;
    const sessionToken = signSession({ email: identity.email, name, driveFolderId });

    res.status(200).json({
      sessionToken,
      profile: {
        email: identity.email,
        name,
        status: student.status,
        notes: student.notes,
      },
    });
  } catch (err) {
    console.error('verify.js error:', err && err.message, err && err.stack);
    res.status(500).json({ error: 'Something went wrong while signing you in. Please try again.' });
  }
};
