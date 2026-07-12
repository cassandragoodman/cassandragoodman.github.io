const { getSheetsClient } = require('./googleClients');

// "Portal Students" sheet layout (header row 1):
// A: Email | B: Student Name | C: Status | D: Notes | E: Drive Folder ID | F: Added Date
const SHEET_RANGE = 'Sheet1!A2:F1000';
const COLUMNS = ['email', 'name', 'status', 'notes', 'driveFolderId', 'addedDate'];

function rowToStudent(row, rowIndex) {
  const student = { rowNumber: rowIndex + 2 }; // +2: 1-indexed sheet rows, header is row 1
  COLUMNS.forEach((key, i) => { student[key] = row[i] || ''; });
  return student;
}

async function findStudentByEmail(email) {
  const sheets = getSheetsClient();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: SHEET_RANGE,
  });
  const rows = data.values || [];
  const normalized = email.toLowerCase();
  const index = rows.findIndex((row) => (row[0] || '').toLowerCase() === normalized);
  if (index === -1) return null;
  return rowToStudent(rows[index], index);
}

async function setDriveFolderId(rowNumber, folderId) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Sheet1!E${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[folderId]] },
  });
}

module.exports = { findStudentByEmail, setDriveFolderId };
