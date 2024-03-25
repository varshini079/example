const express = require('express');
const mongoose = require('mongoose');
const PORT=3000;
const routes = require('./routes/todos');
const Todo=require('./models/Todo');
const path = require('path');
app=express();
// Middleware
app.use('/', routes);
// app.js
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/example')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Connection failed:', error);
  });

  

//starting server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
