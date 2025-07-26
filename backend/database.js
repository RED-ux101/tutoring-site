const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use environment-specific database path
const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    // For Railway, use /tmp directory or memory
    return process.env.DATABASE_PATH || '/tmp/database.db';
  }
  return './database.db';
};

const db = new sqlite3.Database(getDatabasePath());

// Initialize database tables
const initDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tutors table
      db.run(`
        CREATE TABLE IF NOT EXISTS tutors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Files table
      db.run(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tutor_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          mime_type TEXT NOT NULL,
          category TEXT,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (tutor_id) REFERENCES tutors (id)
        )
      `);

      // Submissions table for student submissions
      db.run(`
        CREATE TABLE IF NOT EXISTS submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_name TEXT NOT NULL,
          student_email TEXT NOT NULL,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          mime_type TEXT NOT NULL,
          description TEXT,
          category TEXT DEFAULT 'other',
          status TEXT DEFAULT 'pending',
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_at DATETIME,
          rejected_at DATETIME,
          rejection_reason TEXT
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Add category column to files table if it doesn't exist (migration)
          db.run(`ALTER TABLE files ADD COLUMN category TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
              console.error('Migration error:', err);
            } else {
              console.log('Database initialized successfully');
              resolve();
            }
          });
        }
      });
    });
  });
};

module.exports = { db, initDB }; 