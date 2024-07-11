const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCourseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedCourses: [{
    type: String, // Store course IDs as strings
    required: true,
  }],
});

module.exports = mongoose.model('UserCourse', UserCourseSchema);
