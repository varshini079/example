const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.post('/todos', async (req, res) => {
  try {
    const { text, category } = req.body;
    const todo = new Todo({
      text,
      category
    });
    await todo.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
router.get('/', async (req, res) => {
  try {
    const personalTodos = await Todo.find({ category: 'Personal' });
    const homeTodos = await Todo.find({ category: 'home' });
    res.render('index', { personalTodos, homeTodos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
module.exports =router;