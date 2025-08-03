const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use environment-specific database path
const getDatabasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    // For Railway, try multiple possible paths
    const possiblePaths = [
      process.env.DATABASE_PATH,
      '/tmp/database.db',
      './database.db',
      path.join(process.cwd(), 'database.db')
    ];
    
    // Use the first available path or default to current directory
    for (const dbPath of possiblePaths) {
      if (dbPath) {
        try {
          // Ensure directory exists
          const dir = path.dirname(dbPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          return dbPath;
        } catch (error) {
          console.log(`Could not use database path: ${dbPath}`);
          continue;
        }
      }
    }
    
    // Fallback to current directory
    return './database.db';
  }
  return './database.db';
};

const dbPath = getDatabasePath();
console.log(`Using database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

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
          console.error('Database initialization error:', err);
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