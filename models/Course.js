const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: String,
  description: String,
  type: String,
  content: String,
});

const CourseSchema = new Schema({
  title: String,
  description: String,
  details: String,
  tasks: [TaskSchema],
});

module.exports = mongoose.model('Course', CourseSchema);
