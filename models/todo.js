// models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
