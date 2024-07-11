const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserCourse = require('../models/userCourses');

// Get completed courses for a user
router.get('/completed', auth, async (req, res) => {
  try {
    const userCourses = await UserCourse.findOne({ userId: req.user.id });
    if (!userCourses) {
      return res.json({ completedCourses: [] });
    }
    res.json({ completedCourses: userCourses.completedCourses });
  } catch (err) {
    console.error('Error fetching completed courses:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Mark a course as completed
router.post('/complete', auth, async (req, res) => {
  const { courseId } = req.body;

  try {
    let userCourse = await UserCourse.findOne({ userId: req.user.id });

    if (userCourse) {
      if (!userCourse.completedCourses.includes(courseId)) {
        userCourse.completedCourses.push(courseId);
      }
    } else {
      userCourse = new UserCourse({
        userId: req.user.id,
        completedCourses: [courseId],
      });
    }

    await userCourse.save();
    res.json({ completedCourses: userCourse.completedCourses });
  } catch (err) {
    console.error(`Error marking course as completed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
