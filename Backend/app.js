const express = require('express');
const cors = require('cors');
const db = require('./models'); 
require('dotenv').config();

const challengeRoutes = require('./routes/challengeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ MySQL DB Connected & Tables Synced');
  })
  .catch((err) => {
    console.error('❌ DB Error:', err);
  });

app.use('/api/challenges', challengeRoutes);
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});