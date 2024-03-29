const express = require('express');
const router = express.Router();
const Todo = require('../models/task');
const Option = require('../models/option');
const { getAllOptions } = require('../models/option'); // Assuming the file structure


router.get('/tbc', async (req, res) => {
    try {
        const tasksByCategory = await Todo.aggregate([
            { $group: { _id: "$category", tasks: { $push: "$$ROOT" } } }
        ]);
        res.json(tasksByCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get("/", async (req, res) => {
    try {
        const tasksByCategory = await Todo.aggregate([
            { $group: { _id: "$category", tasks: { $push: "$$ROOT" } } }
        ]);
        console.log(tasksByCategory);
        const options = await getAllOptions();
        console.log(options);
        res.render("index.ejs", { tasksByCategory: tasksByCategory , options: options });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Create a task
let tasks=[]
console.log(tasks);
router.post("/tasks", async (req, res) => {
    try {
        console.log(req.body);
        const { task, category } = req.body;
        const newTask = new Todo({ task, category });
        console.log(task,category,newTask,"yes")
        // If the category provided in the request doesn't exist in tasksByCategory,
        // it indicates a new category. In this case, we need to create a new category in the database.
        const existingTask = await Todo.findOne({ task, category });
        console.log(existingTask)
        if (existingTask) {
            return res.send("Duplicate task");
        }
        await newTask.save();
      res.redirect('/');

    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/options', async (req, res) => {
    const optionText = req.body.option;
    console.log(optionText);
    const { name } = req.body;
    try {
        // Save the new option to MongoDB
        const existingOption = await Option.findOne({ name });
        if (existingOption) {
            return res.status(400).send("Option already exists");
        }
        const option = new Option({ name: optionText });
        await option.save();
        res.status(200).send('Option added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


  router.get('/options', async (req, res) => {
    try {
        const options = await getAllOptions();
      res.json(options); // Send options as a JSON array
    } catch (error) {
      console.error('Error fetching options:', error);
      res.status(500).json({ error: 'Failed to fetch options' });
    }
  });
// Delete a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit a task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category } = req.body;
    try {
        await Task.findByIdAndUpdate(id, { title, category });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
