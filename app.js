const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const ejs = require('ejs');
const app = express();
const {Option,getAllOptions} = require('./models/option');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo-list')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
const tasksRoute = require('./routes/tasks');
app.use( tasksRoute);

// Set view engine
app.use(express.json())
app.set('view engine', 'ejs');
app.get("/views/styles.css", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "styles.css"));
});
app.get("/views/script.js", (req,res)=>{
    res.sendFile(path.join(__dirname, "views", "script.js"));
});

app.post('/options', async (req, res) => {
  try {
    const { name } = req.body;
    // Create a new option
    const newOption = new Option({ name });
    // Save the option to the database
    await newOption.save();
    res.status(201).json(newOption); // Send back the newly created option
  } catch (error) {
    console.error('Error adding new option:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/options', async (req, res) => {
  try {
    // Retrieve all options
    const options = await getAllOptions();
    res.render('index', { options }); // Pass options to the template
  } catch (error) {
    console.error('Error retrieving options:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Route to handle form submission

