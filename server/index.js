// server/index.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Example API Routes

// GET all records
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM your_table');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single record by ID
app.get('/api/data/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM your_table WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create new record
app.post('/api/data', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.query(
      'INSERT INTO your_table (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    res.status(201).json({ 
      success: true, 
      message: 'Record created successfully',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT update record
app.put('/api/data/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.query(
      'UPDATE your_table SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE record
app.delete('/api/data/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM your_table WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Authentication endpoint example
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // In production, use proper password hashing (bcrypt)
    if (rows[0].password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { id: rows[0].id, email: rows[0].email, name: rows[0].name }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Insert new user (in production, hash the password!)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ IMAGE ENDPOINTS ============

// GET all images
app.get('/api/images', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM images';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single image
app.get('/api/images/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST upload image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { title, description, category } = req.body;
    const filepath = `/uploads/${req.file.filename}`;
    
    const [result] = await pool.query(
      'INSERT INTO images (title, description, filename, filepath, mimetype, size, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title || req.file.originalname, description || '', req.file.filename, filepath, req.file.mimetype, req.file.size, category || 'other']
    );
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: result.insertId,
        filename: req.file.filename,
        filepath: filepath,
        url: `http://localhost:5000${filepath}`
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM images WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});