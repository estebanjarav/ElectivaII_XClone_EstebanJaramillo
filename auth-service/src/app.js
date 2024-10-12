const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.use('/api/v1/auth', userRoutes);

mongoose.connect('mongodb://localhost:27017/auth-service', {
})
  .then(() => console.log('Connected to MongoDB for Auth Service'))
  .catch((err) => console.error(err));


app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));

