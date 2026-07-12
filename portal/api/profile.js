const { requireSession } = require('./_lib/session');
const { findStudentByEmail } = require('./_lib/studentsSheet');

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
    // Re-checked against the live sheet on every call: if Cassandra removes
    // or edits a row, access changes immediately rather than waiting for
    // the session token to expire.
    const student = await findStudentByEmail(session.email);
    if (!student) {
      res.status(403).json({ error: 'This account no longer has portal access.' });
      return;
    }

    res.status(200).json({
      profile: {
        email: student.email,
        name: student.name,
        status: student.status,
        notes: student.notes,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load your profile. Please try again.' });
  }
};
