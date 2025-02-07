const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./server/routes/authRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
