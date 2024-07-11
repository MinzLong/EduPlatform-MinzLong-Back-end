const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ExamResult = require('../models/ExamResult');

// Submit exam results
router.post('/submit', auth, async (req, res) => {
  const { quizId, correctAnswers, totalQuestions, timeTaken } = req.body;

  console.log('Received exam result:', req.body);

  try {
    let examResult = await ExamResult.findOne({ user: req.user.id, quizId });
    if (examResult) {
      console.log('Existing result found:', examResult);
      if (correctAnswers > examResult.correctAnswers || (correctAnswers === examResult.correctAnswers && timeTaken < examResult.timeTaken)) {
        examResult.correctAnswers = correctAnswers;
        examResult.totalQuestions = totalQuestions;
        examResult.timeTaken = timeTaken;
        await examResult.save();
        console.log('Updated result:', examResult);
      }
    } else {
      examResult = new ExamResult({
        user: req.user.id,
        quizId,
        correctAnswers,
        totalQuestions,
        timeTaken,
      });
      await examResult.save();
      console.log('New result saved:', examResult);
    }
    res.status(201).json({ message: 'Exam results saved successfully' });
  } catch (err) {
    console.error('Error saving exam results:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const quizzes = await ExamResult.distinct('quizId');
    console.log('Quizzes:', quizzes); // Log quizzes

    const leaderboards = await Promise.all(quizzes.map(async (quizId) => {
      const results = await ExamResult.find({ quizId })
        .populate('user', 'email')
        .sort({ correctAnswers: -1, timeTaken: 1 })
        .limit(10);

      console.log(`Results for quiz ${quizId}:`, results); // Log results for each quiz

      return {
        quizId,
        title: `Quiz ${quizId}`,
        results,
      };
    }));

    res.json(leaderboards);
  } catch (err) {
    console.error('Error fetching leaderboard:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
