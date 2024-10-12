const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

app.use('/api/v1/users', userRoutes);

mongoose.connect('mongodb://localhost:27017/user-service', {
})
  .then(() => console.log('Connected to MongoDB for User Service'))
  .catch((err) => console.error(err));


app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
