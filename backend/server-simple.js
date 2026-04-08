const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple routes
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Hostel Management API',
    endpoints: ['/api/health', '/api/auth/register', '/api/auth/login']
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Test URL: http://localhost:${PORT}/api/health`);
});