const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config(); // Load environment variables
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');


// Connect to MongoDB Atlas
connectDB();
const app = express();

app.use(express.json()); // Body parser middleware
app.use(express.urlencoded({ extended: false }));

// MongoDB Atlas Connection String
const mongoUri = process.env.MONGO_URI
const port = process.env.PORT || 5000;
// Connect to MongoDB Atlas
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

app.get('/', (req, res) => {
  res.send(200).json({message: 'Welcome to the Partner Portal!'});
});


// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

